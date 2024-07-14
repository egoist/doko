import { spawnSync, execSync, ExecSyncOptions } from "child_process"
import { printPort } from "./utils"

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

export function runDockerCommand(
  command: string,
  { stdio }: { stdio?: "inherit" | "pipe" } = {},
) {
  const requireSudo = checkDockerPermission()
  const options: ExecSyncOptions = {
    stdio: stdio || "inherit",
  }
  if (requireSudo) {
    return execSync(`sudo -- su -c '${command}'`, options)
  }
  return execSync(command, options)
}

export function dockerRun({
  serviceName,
  image,
  volumes,
  port,
  env,
  extraArgs,
}: {
  serviceName: string
  image: string
  volumes?: string[]
  port?: Array<`${number}:${number}`>
  env?: string[]
  extraArgs?: string[]
}) {
  const args: string[] = ["run", "--name", `doko_${serviceName}`, "--rm", "-d"]

  if (port) {
    port.forEach((p) => {
      args.push("-p", p)
    })
  }

  if (volumes) {
    for (const vol of volumes) {
      args.push(`-v`, vol)
    }
  }

  if (env) {
    for (const value of env) {
      args.push("-e", value)
    }
  }

  args.push(image)

  if (extraArgs) {
    args.push(...extraArgs)
  }

  const command = `docker ${args.join(" ")}`

  runDockerCommand(command)

  if (port) {
    printPort(port)
  }
}

export function dockerStop(serviceName: string) {
  runDockerCommand(`docker stop doko_${serviceName}`)
}

export function getRunningDockerContainers() {
  const output = runDockerCommand(`docker ps --format "{{json .}}\\n\\n"`, {
    stdio: "pipe",
  })
    .toString()
    .trim()

  if (!output) return []

  const services: {
    Names: string
    Image: string
    Ports: string
    Size: string
    RunningFor: string
  }[] = output.split(/\n{2,}/).map((v) => JSON.parse(v))

  return services
}

export function isDockerContainerRunning(containerName: string) {
  const running =
    runDockerCommand(
      `docker ps --filter "name=${containerName}" --format "{{json .}}"`,
      { stdio: "pipe" },
    )
      .toString()
      .trim() !== ""

  return running
}

export function dockerExec(serviceName: string) {
  runDockerCommand(`docker exec -it doko_${serviceName} /bin/bash`)
}
