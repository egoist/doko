import {
  dockerComposeRemoveServices,
  dockerComposeUp,
  getRunningDockerContainers,
  readDockerCompose,
  runDockerCommand,
} from "./docker"
import { DEFAULT_PASSWORD } from "./constants"
import { getConfig, ServiceConfig, writeServices } from "./service"

const KNOWN_SERVICES = ["postgres", "redis", "mysql", "chrome"]

export function addService(serviceName: string, { image }: { image?: string }) {
  const { services = {} } = getConfig()

  if (services[serviceName]) {
    throw new Error(`Service ${serviceName} already added`)
  }
  if (!KNOWN_SERVICES.includes(serviceName) && !image) {
    throw new Error("--image <image> is required for unknown services")
  }
  const serviceConfig: ServiceConfig =
    serviceName === "postgres"
      ? {
          image: image || "postgres:14-alpine",
          environment: [`POSTGRES_PASSWORD=${DEFAULT_PASSWORD}`],
          volumes: ["postgres_data:/var/lib/postgresql/data"],
          ports: ["5432:5432"],
        }
      : serviceName === "mysql"
      ? {
          image: image || "mysql:8",
          environment: [`MYSQL_ROOT_PASSWORD=${DEFAULT_PASSWORD}`],
          ports: ["3306:3306"],
          volumes: ["mysql_data:/var/lib/mysql"],
        }
      : serviceName === "redis"
      ? {
          image: image || "redis:7-alpine",
          volumes: ["redis_data:/data"],
          ports: ["6379:6379"],
        }
      : serviceName === "chrome"
      ? {
          image: image || "browserless/chrome",
          environment: [],
          ports: ["5050:3000"],
        }
      : {
          image: image,
        }

  services[serviceName] = {
    ...serviceConfig,
    enabled: true,
  }
  writeServices(services)
  dockerComposeUp()
}

export function removeServices(serviceNames: string[]) {
  const { services = {} } = getConfig()
  for (const name in services) {
    if (serviceNames.includes(name)) {
      delete services[name]
    }
  }
  writeServices(services)
  dockerComposeRemoveServices(serviceNames)
}

export function enableServices(serviceNames: string[]) {
  const { services = {} } = getConfig()
  const notFoundServiceNames: string[] = []

  for (const name of serviceNames) {
    const service = services[name]
    if (service) {
      service.enabled = true
    } else {
      notFoundServiceNames.push(name)
    }
  }

  if (notFoundServiceNames.length > 0) {
    throw new Error(
      `Services not found: ${notFoundServiceNames.join(
        ", ",
      )}, did you forget to add them?`,
    )
  }

  writeServices(services)
  dockerComposeUp()
  console.log(`--> Enabled ${serviceNames.join(", ")}`)
}

export function disableServices(serviceNames: string[]) {
  const { services = {} } = getConfig()
  const disabled: string[] = []

  for (const name of serviceNames) {
    const service = services[name]
    if (service) {
      if (serviceNames.includes(name)) {
        service.enabled = false
        disabled.push(name)
      }
    } else {
      console.warn(`Service "${name}" doesn't exist, skipping..`)
    }
  }

  if (disabled.length === 0) {
    console.log(`Nothing to disable`)
    return
  }

  writeServices(services)
  dockerComposeRemoveServices(serviceNames)

  console.log(`--> Disabled ${disabled.join(", ")}`)
}

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

export function startRepl(service: string) {
  const dockerComposeData = readDockerCompose()
  if (!dockerComposeData.services?.[service]) {
    throw new Error(`Service ${service} not found`)
  }
  runDockerCommand(`docker exec -it doko_${service} /bin/bash`)
}

export function compose(command: string) {
  runDockerCommand(`docker-compose ${command}`)
}
