# Doko

A docker-based development dependency manager.

## Why

Stop messing with system dependencies, running the services you need in a perfectly isolated Docker container instead, for local development only.

## Install

[Download the latest release](https://github.com/egoist/doko/releases).

Or using [gobinaries.com](https://gobinaries.com/):

```bash
curl -sf https://gobinaries.com/egoist/doko | sh
```

## Services

- `postgres`
- `mysql`
- `redis`
- `chrome`

## Usage

### Show the list of services

```bash
doko list
```

### Enable a service

```bash
doko enable redis
```

This runs `docker run` under the hood.

### Disable a service

```bash
doko disable redis
```

This runs `docker stop` under the hood.

### Password

The password for the default user in `postgres` and `mysql` is set to `pass`.

### Run commands in a Docker container

```bash
doko repl <service-name>
# e.g.
doko repl postgres
```

This is basically a shorthand for:

```bash
docker exec -it postgres /bin/bash
```

## Piror Art

Inspired by [takeout](https://github.com/tightenco/takeout) which is written in PHP while this is written in Go.

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
