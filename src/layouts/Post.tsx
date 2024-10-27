import type { PropsWithChildren } from "@kitajs/html";
import { Head, Header } from "../components.tsx";
import { formatDate } from "../../scripts/utils.ts";

interface PostProps {
  title: string;
  description?: string;
  date: Date;
  lastmod?: Date;
}
export default function Post(props: PropsWithChildren<PostProps>) {
  const { title, description, date, lastmod, children } = props;
  const pubDate = lastmod ?? date;

  return (
    <>
      {`<!doctype html>`}
      <html lang="en">
        <head>
          <Head
            title={title}
            description={
              description ??
              "A blog about the most random things you can think of."
            }
          />
          <link rel="stylesheet" href="/styles/post.css" />
        </head>
        <body>
          <Header showTitle={true} />
          <main>
            <div class="post-header">
              <time datetime={pubDate.toISOString()}>
                {formatDate(pubDate)}
              </time>
              <h1>{title}</h1>
              {description && <p class="description">{description}</p>}
            </div>
            <article>{children}</article>
          </main>
        </body>
      </html>
    </>
  );
}
