_default: build

build:
	@rm -rf dist
	@mkdir -p dist
	@cp -r public/** dist
	@go run . build

dev:
	@watchexec -c -r -i dist 'make build && go run . serve'

fonts:
	@curl 'https://rsms.me/inter/font-files/InterVariable.woff2' -o public/InterVariable.woff2
	@curl -L 'https://github.com/stipub/stixfonts/raw/refs/heads/master/fonts/static_otf_woff2/STIXTwoMath-Regular.woff2' -o public/STIXTwoMath.woff2
	@curl -L 'https://github.com/githubnext/monaspace/raw/refs/heads/main/fonts/webfonts/MonaspaceNeonVarVF%5Bwght,wdth,slnt%5D.woff2' -o public/MonaspaceNeon.woff2
