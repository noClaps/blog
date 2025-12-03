build:
	@cargo run --release

serve:
	@watchexec --clear --restart --ignore dist 'make build && serve dist'
