# mongodb-infer

[![build status](https://secure.travis-ci.org/imlucas/mongodb-infer.png)](http://travis-ci.org/imlucas/mongodb-infer)

MongoDB schema inference

```
var infer = require('mongodb-infer'),

console.log('simple document', infer({
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
}));
```

will output

```
simple document {
  _id: 'string id',
  service_request_id: 'number id',
  status: 'string',
  status_notes: 'string',
  service_name: 'string',
  service_code: 'enum',
  description: 'text',
  agency_responsible: 'string',
  service_notice: 'object',
  requested_datetime: 'date',
  updated_datetime: 'date',
  expected_datetime: 'date',
  address: 'string',
  address_id: 'number id',
  zipcode: 'enum',
  long: 'geo long',
  lat: 'geo lat',
  media_url: 'url'
}
```

## license

MIT
