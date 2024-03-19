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
  const html = new HTMLRewriter()
    .on("img", {
      async element(el) {
        const src = el.getAttribute("src");
        if (!src) return;

        if (src.startsWith("http")) {
          const urlArr = src.split("/");
          const filename = urlArr[urlArr.length - 1];
          const path = `/${page.replace(".html", "")}/${filename}`;
          el.setAttribute("src", path);

          const image = await fetch(src).then((r) => r.blob());
          Bun.write(`dist${path.replaceAll("%20", " ")}`, image);
        }
      },
    })
    .transform(await Bun.file(`dist/${page}`).text());
  Bun.write(`dist/${page}`, html);
}
