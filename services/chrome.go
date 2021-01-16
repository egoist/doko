package services

import (
	"fmt"
	"log"

	"github.com/egoist/doko/utils"
)

// EnableChrome starts a docker container for chrome
func EnableChrome() {
	err := utils.DockerRun(utils.RunOptions{
		Name:  "chrome",
		Port:  "6343",
		Image: "browserless/chrome",
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Chrome websocket listening on port %s\n", "6343")
}

// DIsableChrome stops chrome container
func DIsableChrome() {
	err := utils.DockerStop("chrome")
	if err != nil {
		log.Fatal(err)
	}
}
