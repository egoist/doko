package cmd

import (
	"github.com/egoist/doko/services"
	"github.com/spf13/cobra"
)

func enableCommand() *cobra.Command {

	var enableCmd = &cobra.Command{
		Use:   "enable <service> [--tag=IMAGE_TAG]",
		Short: "Enable a service",
		Run: func(cmd *cobra.Command, args []string) {
			switch args[0] {
			case "postgres":
				services.EnablePostgres(cmd, args, false)
			case "timescale":
				services.EnablePostgres(cmd, args, true)
			case "redis":
				services.EnableRedis()
			case "mysql":
				services.EnableMysql()
			case "chrome":
				services.EnableChrome()
			}
		},
	}

	enableCmd.Flags().String("tag", "", "Specify an image tag to pull")

	return enableCmd
}
