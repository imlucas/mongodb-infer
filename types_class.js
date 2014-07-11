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
