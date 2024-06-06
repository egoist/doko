# Doko

A docker-based development dependency manager.

## Why

Stop messing with system dependencies, running the services you need in a perfectly isolated Docker container instead, for local development only.

## Install

```bash
npm i -g @egoist/doko
```

## Built-in services

- `postgres`
- `mysql`
- `redis`
- `chrome`
- `qdrant`

## Usage

### Show the list of running services

```bash
doko list
```

### Start a service

```bash
doko start redis
```

### Stop a service

```bash
doko stop redis
```

### Password

Default password for `postgres` and `mysql` is `password`

### Run commands in a service's Docker container

```bash
doko repl <service-name>
# e.g.
doko repl postgres
```

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
