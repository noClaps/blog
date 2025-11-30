build:
	@cargo run -r

serve:
	@watchexec --clear --restart --ignore dist 'make build && serve dist'
