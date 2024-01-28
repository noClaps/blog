import {$} from "bun"

// Prepare
await $`mkdir -p dist`

// Copy CSS
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

// Build images
const imagesGlob = new Bun.Glob("**/*.{png,jpeg,jpg}")
const images = imagesGlob.scanSync({cwd: "src/content"})

for (const image of images) {
	const imagePath = image.split("/").slice(1).join("/")
	Bun.write(`dist/${image.startsWith("notes") ? "notes" : ""}/${imagePath}`, Bun.file(`src/content/${image}`))
}
