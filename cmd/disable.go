package cmd

import (
	"github.com/egoist/doko/services"
	"github.com/spf13/cobra"
)

var disableCmd = &cobra.Command{
	Use:   "disable <service>",
	Short: "Disable a service",
	Run: func(cmd *cobra.Command, args []string) {
		switch args[0] {
		case "postgres":
			services.DisablePostgres()
		case "redis":
			services.DisableRedis()
		case "mysql":
			services.DisableMysql()
		case "chrome":
			services.DisableChrome()
		}
	},
}
