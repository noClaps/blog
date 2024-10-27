import { Rss } from "lucide-static";

export function Head(props: { title?: string; description?: string }) {
  const {
    title = "The Blog of Random",
    description = "A blog about the most random things you can think of.",
  } = props;
  return (
    <>
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <link rel="alternate" href="/feed.json" type="application/json" />
      <link rel="alternate" href="/feed.atom" type="application/atom+xml" />
      <link rel="alternate" href="/feed.rss" type="application/rss+xml" />
    </>
  );
}

export function Header(props: { showTitle: boolean }) {
  const { showTitle } = props;
  return (
    <header>
      {showTitle ? (
        <a class="home" href="/">
          <h1>The Blog of Random</h1>
        </a>
      ) : (
        <div />
      )}
      <a class="feed" href="/feed" title="Feed">
        {Rss}
      </a>
    </header>
  );
}
