var fs = require('fs');
var es = require('event-stream');
var JSONStream = require('JSONStream');

var infer = require('../lib/fields');

var files = es.merge(fs.createReadStream(__dirname + '/../examples/test.json'));
var chunks = [];

files.pipe(JSONStream.parse())
  .pipe(es.through(function(data) {
    chunks.push(data);
    this.emit('data', data);
  },
  function(){
    var obj = {
      docs: chunks
    };
    var ret = infer.Field.build(obj);
    var info = JSON.stringify(ret.properties.docs.items, null, 2);
    // console.log(info);
    fs.writeFile('output.json', info, function (err) {
      if (err) throw err;
      console.log('write done!');
    });
  }));

