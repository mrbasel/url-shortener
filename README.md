# URL shortener

A simple and easy to use app for transforming long urls into short links.

## Features

- Shorten links without creating an account
- Track number of clicks on your shortened links
- Easy to use API for shortening urls from anywhere
- Keep track of your links in one place (requires account)

## Tech stack

- Nodejs
- Expressjs
- PostgresSQL
- Sequelize ORM
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
var request = require("request");
var options = {
  method: "POST",
  url: "https://utrim.xyz/api/trim",
  headers: {
    "x-api-key": "<YOUR API KEY HERE>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://stackoverflow.com/questions/19696240/proper-way-to-return-json-using-node-or-express?noredirect=1&lq=1",
  }),
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
    "link": "utrim.xyz/ZkgxZePr"
  }
}
```

## Setup

You will need to have Nodejs, npm, and Postgresql installed.

1- Clone repo:

```
git clone https://github.com/mrbasel/url-shortener.git
```

2- Install dependencies

```
cd url-shortener
npm install
```

3- Create a .env file and set config vars

```
DATABASE_URL=<Your database url here>
secret= <secret key here>
```

4- Run app

```
npm start
```

**NOTE: Make sure your database is running**

## Licence

MIT licence
