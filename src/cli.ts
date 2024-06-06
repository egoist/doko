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
        port: "5432:5432",
        env: [`POSTGRES_PASSWORD=${DEFAULT_PASSWORD}`],
        volumes: ["doko_pg:/var/lib/postgresql/data"],
      })
    } else if (name === "redis") {
      dockerRun({
        serviceName: "redis",
        image: "redis:6",
        port: "6379:6379",
        env: [`REDIS_PASSWORD=${DEFAULT_PASSWORD}`],
        volumes: ["doko_redis:/data"],
      })
    } else if (name === "mysql") {
      dockerRun({
        serviceName: "mysql",
        image: "mysql:8",
        port: "3306:3306",
        env: [`MYSQL_ROOT_PASSWORD=${DEFAULT_PASSWORD}`],
        volumes: ["doko_mysql:/var/lib/mysql"],
      })
    } else if (name === "chrome") {
      dockerRun({
        serviceName: "chrome",
        image: "browserless/chrome:latest",
        port: "4742:3000",
        env: [`CONNECTION_TIMEOUT=600000`],
      })
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
