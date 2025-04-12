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

	@curl -L 'https://github.com/stipub/stixfonts/releases/latest/download/fonts.zip' -o STIX2.zip
	@unzip STIX2.zip -d STIX2
	@rm STIX2.zip
	@cp STIX2/fonts/STIXTwoMath/OTFWOFF2/STIXTwoMath.woff2 public/
	@rm -rf STIX2
