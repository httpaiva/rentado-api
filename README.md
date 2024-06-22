# Rentado API

## Description

Rentado is a App developed for a Web Development course at Universidade Católica de Brasília.

## Installation

```bash
$ npm install
```

## Running the app

```bash
docker compose up
```

Then access the NestJS application by visiting `http://localhost:3001` and pgAdmin by visiting `http://localhost:5050`.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Development

Whenever creating new resources, it might be needed to rebuild the docker containers to see the changes.

```bash
$ docker compose down --volumes --remove-orphans
$ docker compose build
```

## Routes

The available routes can be tested using Insomnia, Thunder Client or any other Client tool for APIs using this [document](./docs/api-test.json).

## License

Nest is [MIT licensed](LICENSE).
