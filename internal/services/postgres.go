package services

import (
	"os"
	"os/exec"
)

// EnablePostgres starts a docker container for postgres
func EnablePostgres() {
	cmd := exec.Command("docker", "run", "--name", "postgres", "--rm", "-d", "-e", "POSTGRES_PASSWORD=admin", "postgres")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
}

// DisablePostgres stops postgres container
func DisablePostgres() {
	cmd := exec.Command("docker", "stop", "postgres")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
}
