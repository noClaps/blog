import { jsonFeed, rssFeed, atomFeed } from "../src/pages/feed";
import { AlertTriangle, MessageSquare, StickyNote } from "lucide-static";
import { indexPage, notesPage, storiesPage } from "../src/pages";
import { writeNotes, writePosts, writeStories } from "../src/pages/posts";

// Build feeds
jsonFeed();
rssFeed();
atomFeed();

// Build index pages
Bun.write("dist/index.html", await indexPage());
Bun.write("dist/notes/index.html", await notesPage());
Bun.write("dist/stories/index.html", await storiesPage());

// Build posts
await writePosts();
await writeNotes();
await writeStories();

// Build post components
const htmlFiles = new Bun.Glob("**/*.html").scanSync({ cwd: "dist/" });
for (const page of htmlFiles) {
	const htmlRw = new HTMLRewriter()
		.on(".note-heading", {
			element(el) {
				el.prepend(StickyNote, { html: true });
			},
		})
		.on(".quote-heading", {
			element(el) {
				el.prepend(MessageSquare, { html: true });
			},
		})
		.on(".warning-heading", {
			element(el) {
				el.prepend(AlertTriangle, { html: true });
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
					const path = `/${page.replace(".html", "")}/${filename}`;
					el.setAttribute("src", path);

					const image = await fetch(src).then((r) => r.blob());
					Bun.write(`dist${decodeURI(path)}`, image);
				}
			},
		});
	}

	const html = htmlRw.transform(await Bun.file(`dist/${page}`).text());
	Bun.write(`dist/${page}`, html);
}

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
