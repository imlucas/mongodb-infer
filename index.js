var tableize = require('tableize'),
  regret = require('regret'),
  pkg = require('./package.json');

regret.add('date',
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d-[0-5]\d/,
  '2012-02-14T20:58:35-04:00');

regret.add('objectId',
  /^[0-9a-fA-F]{24}$/,
  '536bfbaa0e132fd2563235f2');

regret.add('repr',
  /\[object (\w+)\]/,
  '[object Array]',
  ['type']);


// If we return a a matrix result like so:
// ```javascript
// return {
//   name: 'scope.users', // collection ns
//   sample: 40,
//   total: 12000,
//   fields: {
//     _id: {
//       type: 'objectId',
//       unique: true,
//       hints: {'string': 40, 'id': 40, 'objectId': 40},
//       range: ['lowest id', 'highest id']
//     },
//     tags: {
//       type: 'array',
//       hints: {'array': 28, 'unset': 2},
//       range: ['shortest array length', 'longest array length'],
//       unique: false,  // some documents had the same tag sets? one tag to many users?
//       items: {
//         type: 'string',
//         hints: {'string': 45},
//         range: ['abba', 'zebra']
//       }
//     },
//     bookmarks: {
//       type: 'array',
//       hints: {'array': 15, 'unset': 15},
//       items: {
//         type: 'object',
//         hints: {'object': 15},
//         range: ['shortest array length', 'longest array length'],
//         unique: true, // many to many?
//         properties: {
//           _id: {
//             type: 'string',
//             hints: {'string': 15, 'id': 15}, // likely a foreign key
//             range: ['you get', 'the idea']
//           },
//           name: {
//             type: 'string',
//             hints: {'string': 15},
//             range: ['you get', 'the idea']
//           }
//         }
//       }
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
  var res = {
    title: (opts.name || 'a'),
    sample: docs.length,
    total: undefined
  };

  docs.map(function(doc){

  });
}

var infer = module.exports = function(doc, opts) {
  opts = opts || {};
  var obj = tableize(doc),
    geo = [];

  return Object.keys(obj).reduce(function(schema, key){
    schema[key] = {};

    var repr = Object.prototype.toString.call(obj[key]),
      primitive = regret('repr', repr).type.toLowerCase();

    if(primitive === 'array'){
      schema[key] = array(key, obj[key]);
    }
    else {
      schema[key] = member(primitive, key, obj[key]);
    }
    return schema;
  }, {});
};

function array(key, value){
  return {
    type: 'array',
    items: {}
  };
}

function member(primitive, key, value){
  var res = {
    type: primitive,
    hints: [primitive],
    value: value
  };

  if(/_url$/.test(key)){
    res.type = 'url';
    res.hints.push('url');
  }
  else if(/_code$/.test(key)){
    res.type = 'category';
    res.hints.push('category');
  }
  else if(key === 'description' || key === 'summary'){
    res.type = 'text';
    res.hints.push('text');
  }
  else if(/_id$/.test(key)){
    res.type = 'id';
    res.hints.push('id');
    if(regret('objectId', value)){
      res.type = 'objectId';
      res.hints.push('objectId');
    }
  }
  else if(regret('date', value)){
    res.type = 'date';
    res.hints.push('date');
  }
  else if(key === 'lat' || key === 'latitude'){
    res.type = 'latitude';
    res.hints.push('geo');
    res.hints.push('latitude');
  }
  else if(key === 'long'  || key === 'longitude'){
    res.type = 'longitude';
    res.hints.push('geo');
    res.hints.push('longitude');
  }
  return res;
}
module.exports.version = pkg.version;
