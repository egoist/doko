.PHONY: build

build:
	rm -rf build
	env GOOS=darwin GOARCH=arm64 go build -o build/doko-darwin-arm
	env GOOS=darwin GOARCH=amd64 go build -o build/doko-darwin-amd64
	env GOOS=windows GOARCH=amd64 go build -o build/doko-win-amd64
	env GOOS=linux GOARCH=amd64 go build -o build/doko-linux-amd64
