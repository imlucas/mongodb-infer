_ = require "underscore"

# Constants

NO_VALUE = ->
INIT_FIELD = ->

illegalInputException = (input) ->
  @message = "Attempted input: " + input
  @name = "IllegalInputException"

notImplementedException = ->
  @name = "NotImplementedException"

# utilities

# @todo: augment Counter for each subclass of Fields
# e.g. NumberCounter may have methods such as min, max, mean, medium
class Counter
  @merge: (c1, c2) ->
    ret = new Counter()
    ret.put(k, c1.get(k)) for k in c1.keys()
    ret.put(k, c2.get(k)) for k in c2.keys()
    ret
  constructor: (initial) ->
    @dict = {}
    @put(initial) if initial?
  get: (key) ->
    if key of @dict
      @dict[key]
    else
      @put(key, 0)
  put: (key, val=1) ->
    if key of @dict
      @dict[key] += val
    else
      @dict[key] = val
  keys: ->
    Object.keys(@dict)
  #below are poorly implemented (for now) utility methods
  flatten: ->
    list = []
    for key, count of @dict
      list.push(key) while count--
    list
  sortByCounts: ->
    _.sortBy _.pairs(@dict), (tuple) ->
      -tuple[1]
  toString: ->
    "[Object Counter<#{@sortByCounts}>]"

# Fields definitions

class Field
  @type = NO_VALUE
  @build = (val, key) ->
    cnst = resolveCnst val
    new cnst val, key
  @aggregate = (f1, f2) ->
    return f2 if f1 is INIT_FIELD
    return f1 if f2 is INIT_FIELD
    if f1.type is f2.type
      return CNST[f1.type].aggregate(f1, f2)
    throw notImplementedException()
  constructor: (val, key, @type) ->
    throw illegalInputException("type") unless @type in TYPES
    # @todo: add variable @hint
    # guess the possible function of the Field based on @type, key, val
  toSchema: ->
    # @todo: returns schema description file conforming to application/json+schema
    throw notImplementedException()
  toString: ->
    "[Object Field]"

class NullField extends Field
  @type = "null"
  @aggregate: (n1, n2) ->
    new NullField()
  constructor: (val, key) ->
    super val, key, @constructor.type

class BooleanField extends Field
  @type = "boolean"
  @aggregate: (b1, b2) ->
    ret = new BooleanField()
    ret._counter = Counter.merge(b1._counter, b2._counter)
    ret
  constructor: (bool, key) ->
    super bool, key, @constructor.type
    @_counter = new Counter(bool)

class NumberField extends Field
  @type = "number"
  @aggregate: (n1, n2) ->
    ret = new NumberField()
    ret._counter = Counter.merge(n1._counter, n2._counter)
    ret
  constructor: (num, key) ->
    super num, key, @constructor.type
    @_counter = new Counter(num)

class StringField extends Field
  @type = "string"
  @aggregate: (s1, s2) ->
    ret = new StringField()
    ret._counter = Counter.merge(s1._counter, s2._counter)
    ret
  constructor: (str, key) ->
    super str, key, @constructor.type
    @pattern = NO_VALUE
    @_counter = new Counter(str)

class ArrayField extends Field
  @type = "array"
  @aggregate: (a1, a2) ->
    ret = new ArrayField()
    ret.items = Field.aggregate(a1.items, a2.items)
    ret
  constructor: (ar=[], key) ->
    super ar, key, @constructor.type
    items = (Field.build(item) for item in ar)
    @items = items.reduce(Field.aggregate, INIT_FIELD)

class ObjectField extends Field
  @type = "object"
  @aggregate: (o1, o2) ->
    ret = new ObjectField()
    ret.required = _.intersection(o1.required, o2.required)
    ret._pCounter = Counter.merge(o1._pCounter, o2._pCounter)
    props = _.union(Object.keys(o1.properties),
                    Object.keys(o2.properties))
    for prop in props
      p1 = o1.properties[prop] ? INIT_FIELD
      p2 = o2.properties[prop] ? INIT_FIELD
      ret.properties[prop] = Field.aggregate(p1, p2)
    ret
  constructor: (obj={}, key) ->
    super obj, key, @constructor.type
    @required = []
    @properties = {}
    @_pCounter = new Counter()
    for k, v of obj
      @_pCounter.put(k)
      @required.push(k)
      @properties[k] = Field.build(v, k)

class ComplexField extends Field
  constructor: ->
    # @todo: handle fields with heterogenous datatypes
    throw notImplementedException()

# CONSTANTS

CNST =
  number: NumberField
  null: NullField
  string: StringField
  array: ArrayField
  object: ObjectField
  boolean: BooleanField

TYPES = (v.type for k, v of CNST)

# helpers

resolveCnst = (obj) ->
  switch typeof obj
    when "number" then CNST.number
    when "boolean" then CNST.boolean
    when "string" then CNST.string
    when "object"
      if obj is null
        return CNST.null
      if Array.isArray obj
        return CNST.array
      CNST.object
    else throw illegalInputException "type"

module.exports =
  Counter: Counter
  Field: Field
  NumberField: NumberField
  NullField: NullField
  BooleanField: BooleanField
  StringField: StringField
  ArrayField: ArrayField
  ObjectField: ObjectField
