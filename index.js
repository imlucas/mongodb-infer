var tableize = require('tableize'),
  regret = require('regret'),
  pkg = require('./package.json');

regret.add('date',
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d-[0-5]\d/,
  '2012-02-14T20:58:35-04:00');

regret.add('objectId',
  /^[0-9a-fA-F]{24}$/,
  '536bfbaa0e132fd2563235f2');


// If we return a a matrix result like so:
// ```javascript
// return {
//   size: 40,
//   fields: {
//     _id: {
//       types: {'string': 40, 'id': 40, 'objectId': 40},
//       range: ['lowest id', 'highest id']
//     },
//     tags: {
//       types: {'array': 30},
//       range: ['shortest length', 'longest length']
//     },
//     'tags[n]': {
//       'string': 30
//     },
//     'bookmarks': {
//       'array': 30
//     },
//     'bookmarks[n]._id': {
//       'string': 40
//     },
//     'bookmarks[n].name': {
//       'string': 40
//     }
//   }
// };
// ```
// Constructing training models using the
// [json table schema](http://dataprotocols.org/json-table-schema/)
// to test for the best fit would be trivial:
// ```javascript
// return {
//     'a': {
//       fields: [
//         {
//           name: '_id',
//           type: 'objectId',
//           // determined via collection indexes and sampled values.
//           constraints: {required: true, unique: true}
//         }
//       ],
//       primaryKey: '_id',
//     },
//     'a.t': {
//     }
//   }
// };
// ```

function sample(docs, opts){
  opts = opts || {};
  var table = opts.name || 'a';
}

var infer = module.exports = function(doc, opts) {
  opts = opts || {};
  var obj = tableize(doc),
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
      if(regret('objectId', doc[key])){
        schema[key] += ' objectId';
      }
    }
    else if(regret('date', doc[key])){
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
