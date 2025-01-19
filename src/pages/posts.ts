import { render } from "@noclaps/znak";
import { codeTheme, formatDate, getPosts, html } from "../../scripts/utils.ts";
import { Head, Header } from "../components.ts";

interface PostProps {
  title: string;
  description?: string;
  date: Date;
  lastmod?: Date;
  children: string;
}
export function Post(props: PostProps) {
  const { title, description, date, lastmod, children } = props;
  const pubDate = lastmod ?? date;

  return html`
    <!doctype html>
    <html lang="en">
      <head>
        ${Head({
          title: title,
          description:
            description ??
            "A blog about the most random things you can think of.",
        })}
        <link rel="stylesheet" href="/styles/post.css" />
      </head>
      <body>
        ${Header({ showTitle: true })}
        <main>
          <div class="post-header">
            <time datetime="${pubDate.toISOString()}">
              ${formatDate(pubDate)}
            </time>
            <h1>${title}</h1>
            ${description && `<p class="description">${description}</p>`}
          </div>
          <article>${children}</article>
        </main>
      </body>
    </html>
  `;
}

const posts = await getPosts();
export function writePosts() {
  return posts.map((post) => {
    const html = render(post.content, codeTheme);
    return {
      filePath: `${post.slug}.html`,
      post: Post({
        title: post.title,
        description: post.description,
        date: post.date,
        lastmod: post.lastmod,
        children: html,
      }),
    };
  });
}
