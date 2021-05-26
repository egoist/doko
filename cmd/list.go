package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all services",
	Run: func(cmd *cobra.Command, args []string) {
		services := []string{"postgres", "timescale", "redis", "mysql"}
		for _, name := range services {
			fmt.Println(name)
		}
	},
}
