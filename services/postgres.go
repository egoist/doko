package services

import (
	"fmt"
	"log"

	"github.com/egoist/doko/utils"
	"github.com/spf13/cobra"
)

// EnablePostgres starts a docker container for postgres
func EnablePostgres(cmd *cobra.Command, args []string, timescale bool) {
	var imageName string
	var imageTag string
	var imageFullName string

	imageTag, getTagErr := cmd.Flags().GetString("tag")

	if getTagErr != nil {
		log.Fatal(getTagErr)
	}

	if timescale {
		imageName = "timescale/timescaledb"
		if imageTag == "" {
			imageTag = "latest-pg12"
		}
	} else {
		imageName = "postgres"
		if imageTag == "" {
			imageTag = "12-alpine"
		}
	}

	imageFullName = fmt.Sprintf("%s:%s", imageName, imageTag)

	err := utils.DockerRun(utils.RunOptions{
		Name:   "postgres",
		Port:   "5432",
		Env:    []string{"POSTGRES_PASSWORD=pass"},
		Image:  imageFullName,
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
