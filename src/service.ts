import fs from "fs"
import path from "path"
import { z } from "zod"
import { CONFIG_PATH } from "./constants"
import {
  DockerComposeData,
  DockerComposeServiceConfig,
  DockerComposeServiceConfigSchema,
  writeDockerCompose,
} from "./docker"
import { omit } from "./utils"

const ServiceConfigSchema = DockerComposeServiceConfigSchema.extend({
  enabled: z.boolean().optional(),
})

export type ServiceConfig = z.infer<typeof ServiceConfigSchema>

export const ConfigSchema = z.object({
  services: z.record(z.string(), ServiceConfigSchema).optional(),
})

export type Config = z.infer<typeof ConfigSchema>

export function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return {}
  }
  const data = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"))
  return ConfigSchema.parse(data)
}

export function writeServices(services: Record<string, ServiceConfig>) {
  const config = getConfig()
  config.services = services
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true })
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8")

  const volumes: Record<string, any> = {}
  const dockerComposeServices = Object.keys(services).reduce<
    Record<string, DockerComposeServiceConfig>
  >((res, name) => {
    const service = services[name]
    if (service.enabled) {
      res[name] = {
        container_name: `doko_${name}`,
        ...omit(service, "enabled"),
      }
      if (service.volumes) {
        const names = service.volumes.map((vol) => vol.split(":")[0])
        for (const name of names) {
          if (/^[a-z0-9]/.test(name)) {
            volumes[name] = {}
          }
        }
      }
    }
    return res
  }, {})
  const dockerComposeData: DockerComposeData = {
    services: dockerComposeServices,
    volumes,
  }
  writeDockerCompose(dockerComposeData)
}
