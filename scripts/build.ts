import { jsonFeed, rssFeed, atomFeed } from "../src/pages/feed.ts";
import { indexPage } from "../src/pages/index.tsx";
import { writePosts } from "../src/pages/posts.tsx";

// Copy static files
const staticFiles = new Bun.Glob("**/*").scanSync({ cwd: "public" });
for (const file of staticFiles)
  Bun.write(`dist/${file}`, Bun.file(`public/${file}`));

// Build stylesheets
const stylesheets = new Bun.Glob("*.css").scanSync({ cwd: "src/styles" });
await Bun.build({
  entrypoints: Array.from(stylesheets).map((c) => `src/styles/${c}`),
  experimentalCss: true,
  minify: true,
  outdir: "dist/styles",
});

// Build feeds
Bun.write("dist/feed.json", jsonFeed());
Bun.write("dist/feed.atom", atomFeed());
Bun.write("dist/feed.rss", rssFeed());

// Build index page
Bun.write("dist/index.html", await indexPage());

// Build post components and download images
function buildPost(post: string, filePath: string) {
  const htmlRw = new HTMLRewriter();

  if (Bun.env.NODE_ENV === "production") {
    htmlRw.on("img", {
      async element(el) {
        const src = el.getAttribute("src");
        if (!src) return;

        if (src.startsWith("http")) {
          const urlArr = src.split("/");
          const filename = urlArr[urlArr.length - 1];
          const path = `/${filePath.replace(".html", "")}/${filename}`;
          el.setAttribute("src", path);

          const image = await fetch(src).then((r) => r.blob());
          Bun.write(`dist${decodeURI(path)}`, image);
        }
      },
    });
  }

  return htmlRw.transform(post);
}

// Build posts
for await (const { filePath, post } of await writePosts("posts"))
  Bun.write(`dist/${filePath}`, buildPost(post.toString(), filePath));
for await (const { filePath, post } of await writePosts("notes"))
  Bun.write(`dist/notes/${filePath}`, buildPost(post.toString(), filePath));
for await (const { filePath, post } of await writePosts("stories"))
  Bun.write(`dist/stories/${filePath}`, buildPost(post.toString(), filePath));

// Build images
const images = new Bun.Glob("**/*.{png,jpeg,jpg}").scanSync({
  cwd: "src/content",
});
for (const image of images) {
  const imagePath = image.split("/").slice(1).join("/");
  Bun.write(
    `dist/${image.startsWith("posts") ? "" : image.split("/")[0]}/${imagePath}`,
    Bun.file(`src/content/${image}`),
  );
}
