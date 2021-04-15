package utils

import (
	"os"
	"os/exec"
)

// RunOptions is options for DockerRun
type RunOptions struct {
	Name   string
	Port   string
	Image  string
	Env    []string
	Volume string
}

// DockerRun starts a container
func DockerRun(options RunOptions) error {
	args := []string{
		"run",
		"--name",
		options.Name,
		"-p",
		options.Port + ":" + options.Port,
		"--rm",
		"-d",
		"-v",
		options.Volume,
	}
	for _, v := range options.Env {
		args = append(args, "-e", v)
	}
	args = append(args, options.Image)

	cmd := exec.Command(
		"docker",
		args...,
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	return cmd.Run()
}

// DockerStop stops container by name
func DockerStop(name string) error {
	cmd := exec.Command("docker", "stop", name)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	return cmd.Run()
}

// DockerExec is basically a shorthand of `docker exec`
func DockerExec(name string) error {
	cmd := exec.Command("docker", "exec", "-it", name, "/bin/bash")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	return cmd.Run()
}
