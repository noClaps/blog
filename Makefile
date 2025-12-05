files=`echo src/content/**/*.typ`

build:
	@mkdir -p dist
	@#cp -r public/** dist # TODO: Uncomment when Typst supports MathML
	@typst compile src/pages/index.typ dist/index.html --format html --root . --features html --input files="$(files)"
	@cargo run --release

serve:
	@watchexec --clear --restart --ignore dist 'make build && serve dist'
