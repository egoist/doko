package cmd

import (
	"github.com/egoist/doko/utils"
	"github.com/spf13/cobra"
)

var replCmd = &cobra.Command{
	Use:   "repl <service>",
	Short: "Run commands inside a running container service",
	Run: func(cmd *cobra.Command, args []string) {
		utils.DockerExec(args[0])
	},
}
