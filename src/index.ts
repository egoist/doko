import { getRunningDockerContainers, runDockerCommand } from "./docker"
import { getConfig } from "./service"

export function listServices() {
  const { services = {} } = getConfig()
  const dockerContainers = getRunningDockerContainers()
  for (const name in services) {
    const service = services[name]
    const containerName = service.container_name || `doko_${name}`
    const running = dockerContainers.some(
      (container) => container.Names === containerName,
    )
    console.log(
      `${name} ${service.ports ? `${service.ports.join(" ")} ` : ""}${
        service.enabled ? "(enabled) " : ""
      }${running ? "(running) " : ""}`,
    )
  }
}

export function compose(command: string) {
  runDockerCommand(`docker-compose ${command}`)
}
