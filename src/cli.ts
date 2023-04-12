#!/usr/bin/env node
import fs from "fs"
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

cli.command("start <service>", "Start a service").action(async (name) => {
  if (isDockerContainerRunning(`doko_${name}`)) {
    dockerStop(name)
  }

  switch (name) {
    case "postgres":
      dockerRun({
        serviceName: "postgres",
        image: "postgres:14",
        port: "5432:5432",
        env: [`POSTGRES_PASSWORD=${DEFAULT_PASSWORD}`],
        volumes: ["doko_pg:/var/lib/postgresql/data"],
      })
      break
    case "redis":
      dockerRun({
        serviceName: "redis",
        image: "redis:6",
        port: "6379:6379",
        env: [`REDIS_PASSWORD=${DEFAULT_PASSWORD}`],
        volumes: ["doko_redis:/data"],
      })
      break
    case "mysql":
      dockerRun({
        serviceName: "mysql",
        image: "mysql:8",
        port: "3306:3306",
        env: [`MYSQL_ROOT_PASSWORD=${DEFAULT_PASSWORD}`],
        volumes: ["doko_mysql:/var/lib/mysql"],
      })
    case "chrome":
      dockerRun({
        serviceName: "chrome",
        image: "browserless/chrome:latest",
        port: "4742:3000",
        env: [`CONNECTION_TIMEOUT=600000`],
      })
      break
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
