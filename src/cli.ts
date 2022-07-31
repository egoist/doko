#!/usr/bin/env node
import { cac } from "cac"
import { disableServices, enableServices, listServices, startRepl } from "."
import { version } from "../package.json"

const cli = cac(`doko`)

cli
  .command("enable <...service>", "Enable services")
  .option("--image <image>", "Use a custom docker image")
  .action((serviceNames, options) => {
    enableServices(serviceNames, options)
  })

cli
  .command("disable <...service>", "Disable services")
  .action((serviceNames) => {
    disableServices(serviceNames)
  })

cli
  .command("list", "List services")
  .alias("ls")
  .action(() => {
    listServices()
  })

cli
  .command("repl <service>", "Run commands in docker container")
  .action((service) => {
    startRepl(service)
  })

cli.version(version)
cli.help()
cli.parse()
