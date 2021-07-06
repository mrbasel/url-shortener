# URL shortener
A simple and easy to use app for transforming long urls into short links.

## API documentation

### Requirements

You need to create an account at utrim.xyz to receive your API key.

Pass your API key in the `x-api-key` header with every request.

### Routes

POST `/api` (create shortened link)

Body parameters:

- url: required, url to shorten
