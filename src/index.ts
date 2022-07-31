import {
  dockerComposeRemoveService,
  dockerComposeUp,
  readDockerCompose,
  runDockerCommand,
  ServiceConfig,
  writeDockerCompose,
} from "./docker"
import { DEFAULT_PASSWORD } from "./constants"

const KNOWN_SERVICES = ["postgres", "redis", "mysql", "chrome"]

export function enableServices(
  serviceNames: string[],
  { image }: { image?: string } = {},
) {
  const dockerComposeData = readDockerCompose()

  for (const serviceName of serviceNames) {
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

    dockerComposeData.services = {
      ...dockerComposeData.services,
      [serviceName]: {
        container_name: `doko_${serviceName}`,
        ...serviceConfig,
      },
    }
    if (serviceConfig.volumes) {
      dockerComposeData.volumes = dockerComposeData.volumes || {}
      for (const volume of serviceConfig.volumes) {
        const name = volume.split(":")[0]
        if (!dockerComposeData.volumes[name]) {
          dockerComposeData.volumes[name] = {}
        }
      }
    }
  }
  writeDockerCompose(dockerComposeData)

  dockerComposeUp()

  console.log(`--> Enabled ${serviceNames.join(", ")}`)
}

export function disableServices(serviceNames: string[]) {
  for (const serviceName of serviceNames) {
    const dockerComposeData = readDockerCompose()
    if (dockerComposeData.services) {
      delete dockerComposeData.services[serviceName]
    }
    writeDockerCompose(dockerComposeData)
  }
  dockerComposeRemoveService(serviceNames)
  console.log(`--> Disabled ${serviceNames.join(", ")}`)
}

export function listServices() {
  const dockerComposeData = readDockerCompose()
  if (dockerComposeData.services) {
    for (const name in dockerComposeData.services) {
      const service = dockerComposeData.services[name]
      console.log(`${name} ${service.ports ? service.ports[0] : ""}`)
    }
  }
}

export function startRepl(service: string) {
  const dockerComposeData = readDockerCompose()
  if (!dockerComposeData.services?.[service]) {
    throw new Error(`Service ${service} not found`)
  }
  runDockerCommand(`docker exec -it doko_${service} /bin/bash`)
}
