import {
  formatDate,
  getPosts,
  html,
  type PostsCollection,
} from "../../scripts/utils.ts";
import { Head, Header } from "../components.ts";

function sortPosts(a: PostsCollection, b: PostsCollection) {
  const aDate = a.lastmod ?? a.date;
  const bDate = b.lastmod ?? b.date;

  if (aDate > bDate) return -1;
  if (aDate < bDate) return 1;
  return 0;
}

function Link(props: { title: string; href: string; date: Date }) {
  const { title, href, date } = props;

  return html` <a class="link" href="/${href}">
    ${date &&
    `<time datetime="${date.toISOString()}">${formatDate(date)}</time>`}
    <h3>${title}</h3>
  </a>`;
}

export async function indexPage() {
  const items = await getPosts();
  const posts = items
    .filter((i) => i.slug.startsWith("posts/"))
    .sort(sortPosts);
  const notes = items
    .filter((i) => i.slug.startsWith("notes/"))
    .sort(sortPosts);
  const stories = items
    .filter((i) => i.slug.startsWith("stories/"))
    .sort(sortPosts);

  return html`
    <!doctype html>
    <html lang="en">
      <head>
        ${Head({})}
        <link rel="stylesheet" href="/styles/index.css" />
      </head>
      <body>
        ${Header({ showTitle: false })}
        <main>
          <div class="title">
            <h1>The Blog of Random</h1>
            <p>A blog about the most random things you can think of.</p>
          </div>
          <h2>Posts</h2>
          <section id="posts">
            ${posts
              .map((post) =>
                Link({
                  title: post.title,
                  href: post.slug,
                  date: post.lastmod ?? post.date,
                }),
              )
              .join("")}
          </section>
          <h2>Notes</h2>
          <section id="notes">
            ${notes
              .map((note) =>
                Link({
                  title: note.title,
                  href: note.slug,
                  date: note.lastmod ?? note.date,
                }),
              )
              .join("")}
          </section>
          <h2>Stories</h2>
          <section id="stories">
            ${stories
              .map((story) =>
                Link({
                  title: story.title,
                  href: story.slug,
                  date: story.lastmod ?? story.date,
                }),
              )
              .join("")}
          </section>
        </main>
      </body>
    </html>
  `;
}
