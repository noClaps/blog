build:
	@go run .

serve:
	@watchexec --clear --restart --ignore dist 'go run . && serve dist'

fonts:
	@curl --location https://github.com/noClaps/math-font/releases/latest/download/NewCMMath-Regular.woff2 --output public/NewCMMath-Regular.woff2
