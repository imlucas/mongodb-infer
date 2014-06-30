var infer = require('./'),
  assert = require('assert');

describe('infer', function(){
  it('should work', function(){
    var expect = {
      _id:
       { type: 'objectId',
         hints: [ 'string', 'id', 'objectId' ],
         value: '536c02d34efcef0c2f2439b9' },
      service_request_id: { type: 'id', hints: [ 'number', 'id' ], value: 101001366957 },
      status: { type: 'string', hints: [ 'string' ], value: 'closed' },
      status_notes:
       { type: 'string',
         hints: [ 'string' ],
         value: 'Completed - The request has been concluded.' },
      service_name: { type: 'string', hints: [ 'string' ], value: 'Road - Pot hole' },
      service_code:
       { type: 'category',
         hints: [ 'string', 'category' ],
         value: 'CSROWR-12' },
      description: { type: 'text', hints: [ 'null', 'text' ], value: null },
      agency_responsible: { type: 'string', hints: [ 'string' ], value: '311 Toronto' },
      service_notice: { type: 'null', hints: [ 'null' ], value: null },
      requested_datetime:
       { type: 'date',
         hints: [ 'string', 'date' ],
         value: '2012-02-14T20:58:35-04:00' },
      updated_datetime:
       { type: 'date',
         hints: [ 'string', 'date' ],
         value: '2012-02-17T07:56:00-04:00' },
      expected_datetime:
       { type: 'date',
         hints: [ 'string', 'date' ],
         value: '2012-05-14T20:59:00-04:00' },
      address: { type: 'string', hints: [ 'string' ], value: '46 LAMBTON AVE' },
      address_id: { type: 'id', hints: [ 'number', 'id' ], value: 9544823 },
      zipcode: { type: 'null', hints: [ 'null' ], value: null },
      long:
       { type: 'longitude',
         hints: [ 'number', 'geo', 'longitude' ],
         value: -79.48746252100001 },
      lat:
       { type: 'latitude',
         hints: [ 'number', 'geo', 'latitude' ],
         value: 43.683629226 },
      media_url: { type: 'url', hints: [ 'null', 'url' ], value: null }
      },
      res = infer({
        "_id": "536c02d34efcef0c2f2439b9",
        "service_request_id": 101001366957,
        "status": "closed",
        "status_notes": "Completed - The request has been concluded.",
        "service_name": "Road - Pot hole",
        "service_code": "CSROWR-12",
        "description": null,
        "agency_responsible": "311 Toronto",
        "service_notice": null,
        "requested_datetime": "2012-02-14T20:58:35-04:00",
        "updated_datetime": "2012-02-17T07:56:00-04:00",
        "expected_datetime": "2012-05-14T20:59:00-04:00",
        "address": "46 LAMBTON AVE",
        "address_id": 9544823,
        "zipcode": null,
        "long": -79.48746252100001,
        "lat": 43.683629226,
        "media_url": null
      });

      Object.keys(expect).map(function(k){
        assert.deepEqual(expect[k], res[k], k  + ' is incorrect.  wanted `'+expect[k]+'` got `'+res[k]+'`');
      });
  });

  it('should see geo fully spelled out', function(){
    var expect = {
      _id:
       { type: 'objectId',
         hints: [ 'string', 'id', 'objectId' ],
         value: '537a5a1f58ca78143e9b1730' },
      id: { type: 'number', hints: [ 'number' ], value: 5020 },
      address: { type: 'string', hints: [ 'string' ], value: '4622 7th Av' },
      latitude:
       { type: 'latitude',
         hints: [ 'number', 'geo', 'latitude' ],
         value: 40.6443901062012 },
      longitude:
       { type: 'longitude',
         hints: [ 'number', 'geo', 'longitude' ],
         value: -74.00422668457033 },
      label: { type: 'string', hints: [ 'string' ], value: 'Mr. C\'s Cycles' }
    },
    res = infer({
      "_id": "537a5a1f58ca78143e9b1730",
      "id": 5020,
      "address": "4622 7th Av",
      "latitude": 40.6443901062012,
      "longitude": -74.00422668457033,
      "label": "Mr. C's Cycles"
    });
    assert.deepEqual(expect, res);
  });

  it('should handle embedded arrays');
  it('should handle embedded documents');
});
