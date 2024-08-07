#!/usr/bin/env node
import { cac } from "cac"
import { version } from "../package.json"
import { DEFAULT_PASSWORD } from "./constants"
import {
  dockerExec,
  dockerRun,
  dockerStop,
  getRunningDockerContainers,
  isDockerContainerRunning,
} from "./docker"

const cli = cac(`doko`)

cli
  .command("start <service>", "Start a service")
  .option("--pgvector", "Enable pgvector for postgres")
  .action(async (name, flags) => {
    if (isDockerContainerRunning(`doko_${name}`)) {
      dockerStop(name)
    }

    if (name === "postgres") {
      dockerRun({
        serviceName: "postgres",
        image: flags.pgvector ? "pgvector/pgvector:pg16" : "postgres:16",
        port: ["5432:5432"],
        env: [`POSTGRES_PASSWORD=${DEFAULT_PASSWORD}`],
        volumes: ["doko_pg:/var/lib/postgresql/data"],
      })
    } else if (name === "redis") {
      dockerRun({
        serviceName: "redis",
        image: "redis:6",
        port: ["6379:6379"],
        volumes: ["doko_redis:/data"],
      })
    } else if (name === "mysql") {
      dockerRun({
        serviceName: "mysql",
        image: "mysql:8",
        port: ["3306:3306"],
        volumes: ["doko_mysql:/var/lib/mysql"],
      })
    } else if (name === "chrome") {
      dockerRun({
        serviceName: "chrome",
        image: "browserless/chrome:latest",
        port: ["4742:3000"],
        env: [`CONNECTION_TIMEOUT=600000`],
      })
    } else if (name === "qdrant") {
      dockerRun({
        serviceName: "qdrant",
        image: "qdrant/qdrant:latest",
        port: ["6333:6333", "6334:6334"],
        volumes: ["doko_qdrant:/qdrant/storage"],
      })
    } else if (name === "traefik") {
      dockerRun({
        serviceName: "traefik",
        image: "traefik:v3.0",
        port: ["4842:8080", "80:80"],
        volumes: ["/var/run/docker.sock:/var/run/docker.sock"],
        extraArgs: ["--api.insecure=true", "--providers.docker"],
      })
    } else {
      throw new Error(`unknown service: ${name}`)
    }
  })

cli.command("stop <service>", "Stop a service").action((name) => {
  dockerStop(name)
})

cli
  .command("list", "List services")
  .alias("ls")
  .action(() => {
    const items = getRunningDockerContainers()
    for (const item of items) {
      if (item.Names.startsWith("doko_")) {
        console.log(`${item.Names.slice(5)} ${item.Ports}`)
      }
    }
  })

cli
  .command("repl <service>", "Run commands in docker container")
  .action((service) => {
    dockerExec(service)
  })

cli.version(version)
cli.help()
cli.parse()
