import {
  formatDate,
  getCollection,
  type PostsCollection,
} from "../../scripts/utils.ts";
import { Head, Header } from "../components.tsx";

function sortPosts(a: PostsCollection, b: PostsCollection) {
  const aDate = a.lastmod ?? a.date;
  const bDate = b.lastmod ?? b.date;

  if (aDate > bDate) return -1;
  if (aDate < bDate) return 1;
  return 0;
}

function Link(props: { title: string; href: string; date: Date }) {
  const { title, href, date } = props;

  return (
    <a class="link" href={`/${href}`}>
      {date && <time datetime={date.toISOString()}>{formatDate(date)}</time>}
      <h3>{title}</h3>
    </a>
  );
}

export async function indexPage() {
  const posts = await getCollection("posts").then((posts) =>
    posts.sort(sortPosts),
  );

  const notes = await getCollection("notes").then((notes) =>
    notes.sort(sortPosts),
  );

  const stories = await getCollection("stories").then((stories) =>
    stories.sort(sortPosts),
  );

  return (
    <>
      {`<!doctype html>`}
      <html lang="en">
        <head>
          <Head />
          <link rel="stylesheet" href="/styles/index.css" />
        </head>
        <body>
          <Header showTitle={false} />
          <main>
            <div class="title">
              <h1>The Blog of Random</h1>
              <p>A blog about the most random things you can think of.</p>
            </div>
            <h2>Posts</h2>
            <section id="posts">
              {posts.map((post) => (
                <Link
                  title={post.title}
                  href={post.slug}
                  date={post.lastmod ?? post.date}
                />
              ))}
            </section>
            <h2>Notes</h2>
            <section id="notes">
              {notes.map((note) => (
                <Link
                  title={note.title}
                  href={`notes/${note.slug}`}
                  date={note.lastmod ?? note.date}
                />
              ))}
            </section>
            <h2>Stories</h2>
            <section id="stories">
              {stories.map((story) => (
                <Link
                  title={story.title}
                  href={`stories/${story.slug}`}
                  date={story.lastmod ?? story.date}
                />
              ))}
            </section>
          </main>
        </body>
      </html>
    </>
  ).toString();
}
