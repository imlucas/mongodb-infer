var fs = require('fs');
var es = require('event-stream');
var JSONStream = require('JSONStream');

var build = require('./types').build;
var agg = require('./types').aggregate;

var files = es.merge(fs.createReadStream('../mongodb-datasets/examples/one_to_one-sample.json'));

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
    var ret = build(obj);
    fs.writeFile('output.txt', JSON.stringify(ret), function (err) {
      if (err) throw err;
      console.log('write done!');
    });
  }));

