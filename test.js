var infer = require('./'),
  assert = require('assert');

describe('infer', function(){
  it('should work', function(){
    var expect = {
        _id: 'string id objectId',
        service_request_id: 'number id',
        status: 'string',
        status_notes: 'string',
        service_name: 'string',
        service_code: 'category',
        description: 'text',
        agency_responsible: 'string',
        service_notice: null,
        requested_datetime: 'date',
        updated_datetime: 'date',
        expected_datetime: 'date',
        address: 'string',
        address_id: 'number id',
        zipcode: null,
        long: 'geo long',
        lat: 'geo lat',
        media_url: 'url'
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
        assert.equal(expect[k], res[k], k  + ' is incorrect.  wanted `'+expect[k]+'` got `'+res[k]+'`');
      });
  });

  it('should see geo fully spelled out', function(){
    var expect = { _id: 'string id objectId',
      id: 'number',
      address: 'string',
      latitude: 'geo lat',
      longitude: 'geo long',
      label: 'string'
    }, res = infer({
      "_id": "537a5a1f58ca78143e9b1730",
      "id": 5020,
      "address": "4622 7th Av",
      "latitude": 40.6443901062012,
      "longitude": -74.00422668457033,
      "label": "Mr. C's Cycles"
    });
    assert.deepEqual(expect, res);
  });
});
