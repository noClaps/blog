build:
	@bun run scripts/build.ts

dev:
	@watchexec -r "make build && bunx serve dist"
