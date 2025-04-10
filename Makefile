_default: build

build:
	@mkdir -p dist
	@cp -r public/** dist
	@go run .

dev:
	@watchexec -c -r -w public -w src 'make build && bunx vite dist/'
