# Rentado API

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
docker compose up
```

Then access the NestJS application by visiting `http://localhost:3000` and pgAdmin by visiting `http://localhost:5050`.

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

## License

Nest is [MIT licensed](LICENSE).
