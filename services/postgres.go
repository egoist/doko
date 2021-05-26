package services

import (
	"fmt"
	"log"

	"github.com/egoist/doko/utils"
)

// EnablePostgres starts a docker container for postgres
func EnablePostgres(timescale bool) {
	image := "postgres:12-alpine"
	if timescale {
		image = "timescale/timescaledb:latest-pg12"
	}
	err := utils.DockerRun(utils.RunOptions{
		Name:   "postgres",
		Port:   "5432",
		Env:    []string{"POSTGRES_PASSWORD=pass"},
		Image:  image,
		Volume: "postgres_data:/var/lib/postgresql/data",
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Postgres listening on port %s\n", "5432")
}

// DisablePostgres stops postgres container
func DisablePostgres() {
	err := utils.DockerStop("postgres")
	if err != nil {
		log.Fatal(err)
	}
}
