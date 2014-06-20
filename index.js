var tableize = require('tableize'),
  regret = require('regret'),
  pkg = require('./package.json');

regret.add('date',
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d-[0-5]\d/,
  '2012-02-14T20:58:35-04:00');

regret.add('objectId',
  /^[0-9a-fA-F]{24}$/,
  '536bfbaa0e132fd2563235f2');

var infer = module.exports = function(sample, opts) {
  opts = opts || {};
  var obj = tableize(sample),
    geo = [];

  return Object.keys(obj).reduce(function(schema, key){
    var val = obj[key];
    var type = typeof val;

    if(val === null){
      schema[key] = null;
    }
    else if (type){
      schema[key] = type;
    }
    if(/_url$/.test(key)){
      schema[key] = 'url';
    }
    else if(/_code$/.test(key)){
      schema[key] = 'category';
    }
    else if(key === 'description' || key === 'summary'){
      schema[key] = 'text';
    }
    else if(/_id$/.test(key)){
      schema[key] += ' id';
      if(regret('objectId', sample[key])){
        schema[key] += ' objectId';
      }
    }
    else if(regret('date', sample[key])){
      schema[key] = 'date';
    }
    else if(key === 'lat' || key === 'latitude'){
      schema[key] = 'geo lat';
    }
    else if(key === 'long'  || key === 'longitude'){
      schema[key] = 'geo long';
    }
    return schema;
  }, {});
};
module.exports.version = pkg.version;
