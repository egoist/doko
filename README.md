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

### Add a service

Adding a service to `~/.doko/config.json`:

```bash
doko add redis

# Or a custom service
doko add hello --image hello-world
```

### Remove a service

Removing a service from `~/.doko/config.json`:

```bash
doko remove redis
```

### Starting services

```bash
doko up
```

### Stopping services

```bash
doko down
```

### Enable / Disable services

When you add a service, it's automatically enabled, meaning `doko up`, `doko down` will start and stop it respectively.

If you want to stop it from running, but keep its configuration in `.doko/config.json`, you can run:

```bash
doko disable redis
```

When you need it again, you can bring it back with:

```bash
doko enable redis
```

This command basically adds / removes the service from our internal docker compose config.

### Password

Default password for `postgres` and `mysql` is `password`, you can update it manually in `~/.doko/services.json`.

### Run commands in a Docker container

```bash
doko repl <service-name>
# e.g.
doko repl postgres
```

### Run `docker-compose` commands

Run `doko compose` to run `docker-compose` in `~/.doko` directory, for example:

```bash
# Stop the chrome service
doko compose stop chrome
```

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
