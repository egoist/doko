package cmd

import (
	"github.com/egoist/doko/services"
	"github.com/spf13/cobra"
)

var enableCmd = &cobra.Command{
	Use:   "enable <service>",
	Short: "Enable a service",
	Run: func(cmd *cobra.Command, args []string) {
		switch args[0] {
		case "all":
			services.EnablePostgres()
			services.EnableRedis()
		case "postgres":
			services.EnablePostgres()
		case "redis":
			services.EnableRedis()
		}
	},
}
