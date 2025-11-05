build:
	rm -rf dist
	mkdir -p dist
	cp -r public/** dist
	cargo run -r

serve:
	watchexec --clear --restart --ignore dist 'make build && serve dist'

flamegraph:
	CARGO_PROFILE_RELEASE_DEBUG=true cargo flamegraph
