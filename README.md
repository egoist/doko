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

## Usage

### Show the list of services

```bash
doko list
```

### Enable a service

Adding a service to `~/.doko/docker-compose.yml`:

```bash
doko enable redis
```

### Disable a service

Removing a service to `~/.doko/docker-compose.yml`:

```bash
doko disable redis
```

### Password

Default password for `postgres` and `mysql` is `password`.

### Run commands in a Docker container

```bash
doko repl <service-name>
# e.g.
doko repl postgres
```

### Create a custom service

Create a service called `hello` from the `hello-world` image:

```bash
doko enable hello --image hello-world
```

### docker-compose.yml

The underlying Docker Compose file used by doko is located at `~/.doko/docker-compose.yml`.

You can edit it directly to tweak your docker-compose service configurations.

### Run `docker-compose` commands

Run `doko compose` to run `docker-compose` in `~/.doko` directory, for example:

```bash
# Stop the chrome service
doko compose stop chrome
```

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
