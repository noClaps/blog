build:
	@mkdir -p dist/
	@cp -a public/. dist
	@bun run scripts/build.ts

dev:
	@watchexec -r "make build && bunx serve dist"
