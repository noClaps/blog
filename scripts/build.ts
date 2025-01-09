import { jsonFeed, rssFeed, atomFeed, feedPage } from "../src/pages/feed.ts";
import { indexPage } from "../src/pages/index.ts";
import { writePosts } from "../src/pages/posts.ts";

// Copy static files
const staticFiles = new Bun.Glob("**/*").scanSync({ cwd: "public" });
for (const file of staticFiles)
  Bun.write(`dist/${file}`, Bun.file(`public/${file}`));

// Build feeds
Bun.write("dist/feed.json", jsonFeed());
Bun.write("dist/feed.atom", atomFeed());
Bun.write("dist/feed.rss", rssFeed());
Bun.write("dist/feed.html", buildHtml(feedPage()));

// Build index page
Bun.write("dist/index.html", buildHtml(indexPage()));

function buildHtml(html: string) {
  const htmlRw = new HTMLRewriter();

  htmlRw.on("link[rel=stylesheet]", {
    async element(el) {
      const href = el.getAttribute("href");
      if (!href) return;

      const styles = await Bun.build({
        entrypoints: [`src/${href}`],
        experimentalCss: true,
        minify: true,
      }).then((bo) => bo.outputs[0].text());

      el.replace(`<style>${styles.trim()}</style>`, { html: true });
    },
  });

  return htmlRw.transform(html);
}

// Build post components and download images
function buildPost(post: string, filePath: string) {
  const htmlRw = new HTMLRewriter();

  htmlRw
    .on(`a[download]`, {
      element(el) {
        const href = el.getAttribute("href");
        if (!href) return;

        const urlArr = href.split("/");
        const filename = urlArr[urlArr.length - 1];
        const path = `${filePath.replace(".html", "")}/${filename}`;
        Bun.write(`dist/${path}`, Bun.file(`./src/content/${path}`));
      },
    })
    .on(`img[src^="./"]`, {
      element(el) {
        const src = el.getAttribute("src");
        if (!src) return;

        const urlArr = src.split("/");
        const filename = urlArr[urlArr.length - 1];
        const path = `${filePath.replace(".html", "")}/${filename}`;
        Bun.write(`dist/${path}`, Bun.file(`./src/content/${path}`));
      },
    });

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

  return htmlRw.transform(buildHtml(post));
}

// Build posts
for (const { filePath, post } of writePosts())
  Bun.write(`dist/${filePath}`, buildPost(post.toString(), filePath));
