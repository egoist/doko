import path from "path"
import { spawnSync, execSync, ExecSyncOptions } from "child_process"
import fs from "fs"
import yaml from "js-yaml"
import { DOCKER_COMPOSE_PATH, DOKO_DIR } from "./constants"

export type ServiceConfig = {
  container_name?: string
  image?: string
  ports?: string[]
  environment?: string[]
  volumes?: string[]
}

export type DockerComposeData = {
  version?: string
  services?: {
    [name: string]: ServiceConfig
  }
  volumes?: {
    [name: string]: any
  }
}

let requireSudo: boolean | undefined

export function checkDockerPermission() {
  if (typeof requireSudo === "boolean") return requireSudo

  const cmd = spawnSync("docker", ["ps"])
  const output = cmd.stderr.toString()

  if (cmd.status === 0) {
    requireSudo = false
  } else {
    if (output.includes("permission denied")) {
      requireSudo = true
    } else {
      throw new Error(output)
    }
  }

  return requireSudo
}

export function readDockerCompose(): DockerComposeData {
  if (!fs.existsSync(DOCKER_COMPOSE_PATH)) return {}
  const content = fs.readFileSync(DOCKER_COMPOSE_PATH, "utf8")
  const data = yaml.load(content) as DockerComposeData
  return data
}

export function writeDockerCompose(data: DockerComposeData) {
  const content = yaml.dump(data)
  fs.mkdirSync(path.dirname(DOCKER_COMPOSE_PATH), { recursive: true })
  fs.writeFileSync(DOCKER_COMPOSE_PATH, content, "utf8")
}

export function runDockerCommand(command: string) {
  const requireSudo = checkDockerPermission()
  const options: ExecSyncOptions = {
    cwd: DOKO_DIR,
    stdio: "inherit",
  }
  if (requireSudo) {
    execSync(`sudo -- su -c '${command}'`, options)
  } else {
    execSync(command, options)
  }
}

export function dockerComposeUp() {
  runDockerCommand(`docker-compose up -d --remove-orphans`)
}

export function dockerComposeRemoveService(serviceNames: string[]) {
  runDockerCommand(`docker-compose rm -s -v -f ${serviceNames.join(" ")}`)
}
