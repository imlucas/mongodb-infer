var _ = require('underscore');

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

function notImplementedException(method) {
  this.message = 'Method name: ' + method;
  this.name = 'NotImplementedException';
}
function illegalInputException(input) {
  this.message = 'Attempted input: ' + input;
  this.name = 'IllegalInputException';
}

function findType (obj) {
  switch(typeof obj) {
    case 'number':
      return TYPES.number;
    case 'boolean':
      return TYPES.boolean;
    case 'string':
      return TYPES.string;
    case 'object':
      if (obj === null) {
        return TYPES.null;
      } else if (Array.isArray(obj)) {
        return TYPES.array;
      } else {
        return TYPES.object;
      }
  }
  throw illegalInputException('type');
}

/*
 * builder
 */

function build (value, key, type) {
  // determine input type
  type = type in TYPES ? type : findType(value);
  // construct AST based on type
  switch (type) {
    case TYPES.null:
      return {
        type: TYPES.null,
        counter: new Dictionary() // placeholder
      };
    case TYPES.boolean:
      return {
        type: TYPES.boolean,
        counter: new Dictionary(value)
      };
    case TYPES.number:
      return buildNumber(value, key);
    case TYPES.string:
      return buildString(value, key);
    case TYPES.array:
      return buildArray(value, key);
    case TYPES.object:
      return buildObject(value, key);
  }
  throw illegalInputException('type');
}

function buildNumber (num, key) {
  return {
    type: TYPES.number,
    counter: new Dictionary(num),
    min: num,
    max: num
  };
}

function buildString (str, key) {
  return {
    type: TYPES.string,
    counter: new Dictionary(str),
    pattern: NO_VALUE
  };
}

function buildArray (ar, key) {
  var items = [];
  ar.forEach(function (item) {
    items.push(build(item));
  });
  return {
    type: TYPES.array,
    items: items.reduce(aggregate, WILDCARD)
  };
}

function buildObject (obj, key) {
  var prop = {};
  var propCounter = new Dictionary();
  Object.keys(obj).forEach(function (k) {
    prop[k] = build(obj[k], k);
    propCounter.put(k, 1);
  });
  return {
    type: TYPES.object,
    properties: prop,
    required: Object.keys(obj),
    propCounter: propCounter
  };
}

/*
 * aggregation
 */

function aggregate (obj1, obj2) {
  if (obj1 === WILDCARD) return obj2;
  if (obj2 === WILDCARD) return obj1;
  if (obj1.type !== obj2.type) {
    // ! different complex type? [1,2] !== [1,2]
    // fields with dynamic types
    return {
      type: _.flatten(_.union([obj1.type], [obj2.type])),
      counter: obj1.counter.merge(obj2.counter)
    };
  }
  // normal cases
  if (obj1.type === TYPES.object) return aggObject(obj1, obj2);
  if (obj1.type === TYPES.array) return aggArray(obj1, obj2);
  if (obj1.type === TYPES.string) return aggString(obj1, obj2);
  if (obj1.type === TYPES.number) return aggNumber(obj1, obj2);
  return {
    type: obj1.type,
    counter: obj1.counter.merge(obj2.counter)
  };
}

function aggNumber (num1, num2) {
  return {
    type: TYPES.number,
    counter: num1.counter.merge(num2.counter),
    min: Math.min(num1.min, num2.min),
    max: Math.max(num1.max, num2.max)
  };
}

function aggString (str1, str2) {
  return {
    type: str1.type,
    counter: str1.counter.merge(str2.counter)
  };
}

function aggArray (ar1, ar2) {
  throw notImplementedException('aggArray');
}

function aggObject (obj1, obj2) {
  var props = {};
  Object.keys(obj1.properties).forEach(function (k) {
    if (k in obj2.properties) {
      props[k] = aggregate(obj1.properties[k], obj2.properties[k]);
    } else {
      props[k] = obj1.properties[k];
    }
  });
  Object.keys(obj2.properties).forEach(function (k) {
    if (!(k in props)) {
      props[k] = obj2.properties[k];
    }
  });
  return {
    type: TYPES.object,
    required: _.intersection(obj1.required, obj2.required),
    properties: props,
    propCounter: obj1.propCounter.merge(obj2.propCounter)
  };
}

/*
 * utility
 */

// some fantastic dictionary that supports cool statistical analysis
function Dictionary(initial) {
  this.dict = {};
  if (initial !== undefined) this.put(initial, 1);
}
Dictionary.prototype.get = function (k) {
  if (k in this.dict) return this.dict[k];
  return (this.dict[k] = 0);
};
Dictionary.prototype.put = function (k, v) {
  if (k in this.dict) return (this.dict[k] += v);
  return (this.dict[k] = v);
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
module.exports.aggregate = aggregate;
