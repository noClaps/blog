_default: build

build:
	mkdir -p dist
	cp -r public/** dist
	cargo run -r

dev:
	watchexec -c -r -w public -w src 'make build && bunx vite dist/'
