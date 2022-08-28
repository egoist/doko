import path from "path"
import os from "os"

export const DOKO_DIR = path.join(os.homedir(), ".doko")
export const DOCKER_COMPOSE_PATH = path.join(DOKO_DIR, "docker-compose.yml")
export const CONFIG_PATH = path.join(DOKO_DIR, "config.json")
export const DEFAULT_PASSWORD = "password"
