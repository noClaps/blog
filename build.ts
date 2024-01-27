import {$} from "bun"

// Copy CSS
await $`mkdir -p dist`
await $`cp -r src/styles dist`

// Copy static files
await $`cp -a public/. dist`

// Build HTML
const glob = new Bun.Glob("**/**.ts")
const files = glob.scanSync({cwd: "src/pages"})

for (const file of files) {
	await $`bun run src/pages/${file}`
}

// Build post components
Bun.build({
	entrypoints: ["src/components/posts/post-components.ts"],
	outdir: "dist",
	minify: true,
})

// Add MathJax
Bun.build({
	entrypoints: ["node_modules/mathjax/es5/tex-svg.js"],
	outdir: "dist/mathjax",
	minify: true
})
