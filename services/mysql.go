package services

import (
	"fmt"
	"log"

	"github.com/egoist/doko/utils"
)

// EnableMysql starts a docker container for postgres
func EnableMysql() {
	err := utils.DockerRun(utils.RunOptions{
		Name:   "mysql",
		Port:   "3306",
		Env:    []string{"MYSQL_ROOT_PASSWORD=pass"},
		Image:  "mysql:8",
		Volume: "mysql_data:/var/lib/mysql",
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Mysql listening on port %s\n", "3306")
}

// DisableMysql stops postgres container
func DisableMysql() {
	err := utils.DockerStop("mysql")
	if err != nil {
		log.Fatal(err)
	}
}
