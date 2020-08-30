# Doko

A docker-based development dependency manager.

## Why

Stop messing with system dependencies, running the services you need in a perfectly isolated Docker container instead for web development.

## Install

```bash
curl -sf https://gobinaries.com/egoist/doko | sh
```

Then `doko` command will be available globally.

## Services

- `postgres`
- `mysql`
- `redis`

## Usage

### Show a list of services

```bash
doko list
```

### Enable a service

```bash
doko enable redis
```

### Disable a service

```bash
doko disable redis
```

### Run commands in a Docker container

Docker containers created by Doko use the same names as the services, for instance you can run commands in the `mysql` container like this:

```bash
docker exec -it mysql /bin/bash
```

## Piror Art

Inspired by [takeout](https://github.com/tightenco/takeout) which is written in PHP while this is written in Go.

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
