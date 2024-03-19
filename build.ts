import { $ } from "bun";

// Prepare
await $`mkdir -p dist`;

// Copy CSS
await $`cp -r src/styles dist`;

// Copy static files
await $`cp -a public/. dist`;

// Build HTML
const glob = new Bun.Glob("**/**.ts");
const files = glob.scanSync({ cwd: "src/pages" });

for (const file of files) {
  await $`bun run src/pages/${file}`;
}

// Build post components
Bun.build({
  entrypoints: ["src/components/posts/post-components.ts"],
  outdir: "dist",
  minify: true,
});

// Add MathJax
Bun.build({
  entrypoints: ["node_modules/mathjax/es5/tex-svg.js"],
  outdir: "dist/mathjax",
  minify: true,
});

// Build images
const imagesGlob = new Bun.Glob("**/*.{png,jpeg,jpg}");
const images = imagesGlob.scanSync({ cwd: "src/content" });

for (const image of images) {
  const imagePath = image.split("/").slice(1).join("/");
  Bun.write(
    `dist/${image.startsWith("notes") ? "notes" : ""}/${imagePath}`,
    Bun.file(`src/content/${image}`),
  );
}

// Download remote files
const htmlGlob = new Bun.Glob("**/*.html");
const htmlFiles = htmlGlob.scanSync({ cwd: "dist/" });
for (const page of htmlFiles) {
  new HTMLRewriter()
    .on("img", {
      async element(el) {
        const src = el.getAttribute("src");
        if (!src) return;

        const urlArr = src.split("/");
        const filename = urlArr[urlArr.length - 1];
        const path = `/${page.replace(".html", "")}/${filename}`;

        if (src.startsWith("https://")) {
          await fetch(src).then((r) =>
            Bun.write(`dist${path}`, r.arrayBuffer()),
          );
        }

        el.setAttribute("src", path);
      },
    })
    .transform(await Bun.file(`dist/${page}`).text());
}
