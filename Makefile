_default: build

build:
	@mkdir -p dist
	@cp -r public/** dist
	@go run .

dev:
	@watchexec -c -r -i dist 'make build && bunx vite dist/'
