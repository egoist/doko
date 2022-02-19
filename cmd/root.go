package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

// Execute runs the CLI
func Execute() {
	var displayVersion bool

	rootCmd := &cobra.Command{
		Use:   "doko",
		Short: "Docker-based local development tool",
		Run: func(cmd *cobra.Command, args []string) {
			if displayVersion {
				fmt.Printf("0.0.6")
			}
		},
	}

	rootCmd.Flags().BoolVarP(&displayVersion, "version", "v", false, "Displays version number")

	rootCmd.AddCommand(listCmd)
	rootCmd.AddCommand(enableCommand())
	rootCmd.AddCommand(disableCmd)
	rootCmd.AddCommand(replCmd)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
