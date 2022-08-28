#!/usr/bin/env node
import fs from "fs"
import { cac } from "cac"
import {
  addService,
  compose,
  disableServices,
  enableServices,
  listServices,
  removeServices,
  startRepl,
} from "."
import { version } from "../package.json"
import { dockerComposeDown, dockerComposeUp } from "./docker"
import { DOKO_DIR } from "./constants"

fs.mkdirSync(DOKO_DIR, { recursive: true })

const cli = cac(`doko`)

cli
  .command("add <service>", "Add a service")
  .option("--image <image>", "Use a custom docker image")
  .action((name, options: { image?: string }) => {
    addService(name, { image: options.image })
  })

cli
  .command("remove <...service>", "Remove services")
  .action((names: string[]) => {
    removeServices(names)
  })

cli.command("enable <...service>", "Enable services").action((serviceNames) => {
  enableServices(serviceNames)
})

cli
  .command("disable <...service>", "Disable services")
  .action((serviceNames) => {
    disableServices(serviceNames)
  })

cli.command("up", "Start services").action(() => {
  dockerComposeUp()
})

cli.command("down", "Stop services").action(() => {
  dockerComposeDown()
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

cli
  .command("compose", "Run docker-compose commands directly", {
    allowUnknownOptions: true,
  })
  .action(() => {
    compose(
      process.argv
        .slice(3)
        .map((v) => JSON.stringify(v))
        .join(" "),
    )
  })

cli.version(version)
cli.help()
cli.parse()
