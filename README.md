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

## Piror Art

Inspired by [takeout](https://github.com/tightenco/takeout) which is written in PHP while this is written in Go.

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
