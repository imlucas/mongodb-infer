var _ = require('underscore');

function Field (opts) {
  this.type = opts.type;
  this.title = opts.title || "";
  this.description = opts.description || "";
  this._history = [];
  this._enum = false;
}

Field.prototype.aggregate = function (field) {
  // aggregate with another field
};

Field.prototype.toSchema = function () {
  // produce application/json+schema format
};

Field.prototype.stats = function () {
  // show some stats
};

function INumber (num) {
  if (!(this instanceof INumber)) return new INumber(num);
  Field.call(this, { type: 'number' });
  this._history.push(num);
  this.maximum = num;
  this.exclusiveMaximum = false;
  this.minimum = num;
  this.exclusiveMinimum = false;
}

function IBoolean (bool) {
  if (!(this instanceof IBoolean)) return new IBoolean(bool);
  Field.call(this, { type: 'boolean' });
  this._history.push(bool);
}

function INull () {
  if (!(this instanceof INull)) return new INull(bool);
  Field.call(this, { type: 'null' });
}

function IString (str) {
  if (!(this instanceof IString)) return new IString(str);
  Field.call(this, { type: 'string' });
  this._history.push(str);
  this.pattern = null;
  this.minLength = null;
  this.maxLength = null;
}

function IArray (ar) {
  if (!(this instanceof IArray)) return new IArray(ar);
  Field.call(this, { type: 'array' });
  this._history.push(ar);
  this.items = null;
  this.additionalItems = null;
  this.minItems = null;
  this.maxItems = null;
  this.uniqueItems = true;
}

function IObject (obj) {
  if (!(this instanceof IObject)) return new IObject(obj);
  Field.call(this, { type: 'object' });
  this._history.push(obj);
  this.properties = null;
  this.required = null;
  this.patternProperties = null;
  this.additionalProperties = null;
  this.minProperties = null;
  this.maxProperties = null;
  this.items = null;
  this.minItems = null;
  this.maxItems = null;
  this.uniqueItems = true;
}

var TYPES = {
  number:  'number',
  string:  'string',
  array:   'array',
  object:  'object',
  null:    'null',
  boolean: 'boolean'
};

var NO_VALUE = function () { };
var WILDCARD = { };
var NOT_IMPLEMENTED = function () { throw new Error('nope'); };

function build (obj, type) {
  // determine input type
  if (typeof type === 'undefined') {
    switch(typeof obj) {
      case 'number':
        type = TYPES.number;
        break;
      case 'boolean':
        type = TYPES.boolean;
        break;
      case 'string':
        type = TYPES.string;
        break;
      case 'object':
        if (obj === null) {
          type = TYPES.null;
        } else if (Array.isArray(obj)) {
          type = TYPES.array;
        } else {
          type = TYPES.object;
        }
        break;
      default:
        NOT_IMPLEMENTED();
    }
  }
  // construct AST based on type
  switch (type) {
    case TYPES.number:
      return {
        type: TYPES.number,
        history: new Dictionary(obj),
        min: obj,
        max: obj
      };
    case TYPES.string:
      return {
        type: TYPES.string,
        history: new Dictionary(obj),
        pattern: NO_VALUE,
        minLength: obj.length,
        maxLength: obj.length
      };
    case TYPES.null:
      return {
        type: TYPES.null
      };
    case TYPES.boolean:
      return {
        type: TYPES.boolean,
        history: new Dictionary(obj)
      };
    case TYPES.array:
      var items = [];
      obj.forEach(function (item) {
        items.push(build(item));
      });
      return {
        type: TYPES.array,
        items: items.reduce(aggregate, WILDCARD)
      };
    case TYPES.object:
      var prop = {};
      Object.keys(obj).forEach(function (k) {
        prop[k] = build(obj[k]);
      });
      return {
        type: TYPES.object,
        properties: prop,
        required: Object.keys(obj)
      };
    default:
      NOT_IMPLEMENTED();
  }
}

function aggregate (obj1, obj2) {
  // should not merge objects
  console.log('----');
  console.log(obj1);
  console.log(obj2);
  if (obj1 === WILDCARD) {
    return obj2;
  } else if (obj1.type === obj2.type) {
    return {
      type: obj1.type,
      history: obj1.history.merge(obj2.history)
    };
  } else {
    // not supported yet
    NOT_IMPLEMENTED();
  }
}

// some fantastic dictionary that supports cool statistical analysis
function Dictionary(initial) {
  this.dict = {};
  if (initial !== undefined) this.put(initial, 1);
}
Dictionary.prototype.get = function (k) { return this.dict[k]; };
Dictionary.prototype.put = function (k, v) {
  if (k in this.dict) this.dict[k] += v;
  else this.dict[k] = v;
};
Dictionary.prototype.merge = function (d) {
  var ret = new Dictionary();
  ret.dict = _.clone(this.dict);
  Object.keys(d.dict).forEach(function (k) {
    ret.put(k, d.get(k));
  });
  return ret;
};
Dictionary.prototype.toString = function () {
  return this.dict.valueOf();
};

module.exports.build = build;
