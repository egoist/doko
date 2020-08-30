package services

import (
	"fmt"
	"log"

	"github.com/egoist/doko/utils"
)

// EnableRedis starts a docker container for redis
func EnableRedis() {
	err := utils.DockerRun(utils.RunOptions{
		Name:   "redis",
		Port:   "6379",
		Image:  "redis:6-alpine",
		Volume: "redis_data:/data",
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Redis listening on port %s\n", "6379")
}

// DisableRedis stops redis container
func DisableRedis() {
	err := utils.DockerStop("redis")
	if err != nil {
		log.Fatal(err)
	}
}
