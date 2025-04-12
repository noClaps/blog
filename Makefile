_default: build

build:
	@rm -rf dist
	@mkdir -p dist
	@cp -r public/** dist
	@go run . build

dev:
	@watchexec -c -r -i dist 'make build && go run . serve'

font:
	@curl 'https://rsms.me/inter/font-files/InterVariable.woff2' -o public/InterVariable.woff2
