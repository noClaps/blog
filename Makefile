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

	@curl -L 'https://www.gust.org.pl/projects/e-foundry/lm-math/download/latinmodern-math-1959.zip' -o LMMath.zip
	@unzip LMMath.zip -d LMMath
	@rm LMMath.zip
	@cp LMMath/latinmodern-math-1959/otf/latinmodern-math.otf public/LMMath.otf
	@rm -rf LMMath
