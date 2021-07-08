# URL shortener

A simple and easy to use app for transforming long urls into short links.

## Features

- Shorten links without creating an account
- Track number of clicks on your shortened links
- Easy to use API for shortening urls from anywhere

## Tech stack

- Nodejs
- Expressjs
- PostgresSQL
- Picnic CSS

## API documentation

### Requirements

You need to create an account at [utrim.xyz](utrim.xyz) to receive your API key.

Pass your API key in the `x-api-key` header with every request.

### Routes

POST `/api/trim` (create shortened link)

Body parameters:

| Parameter |  Status  |  Description   |
| :-------: | :------: | :------------: |
|    url    | required | url to shorten |

#### Example request:
```javascript
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://utrim.xyz/api/trim',
  'headers': {
    'x-api-key': '<YOUR API KEY HERE>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "url": "https://stackoverflow.com/questions/19696240/proper-way-to-return-json-using-node-or-express?noredirect=1&lq=1"
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```

#### Example response (200):

```json
{
    "status": "success",
    "data": {
        "link": "https://utrim.xyz/ZkgxZePr"
    }
}
```
