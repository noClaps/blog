import { html } from "../scripts/utils";

export function Head(props: { title?: string; description?: string }) {
  const {
    title = "The Blog of Random",
    description = "A blog about the most random things you can think of.",
  } = props;
  return html`
    <link rel="icon" href="/favicon.ico" />
    <title>${title}</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}" />
    <link rel="alternate" href="/feed.json" type="application/json" />
    <link rel="alternate" href="/feed.atom" type="application/atom+xml" />
    <link rel="alternate" href="/feed.rss" type="application/rss+xml" />
  `;
}

export function Header(props: { showTitle: boolean }) {
  const { showTitle } = props;
  return html`<header>
    ${showTitle
      ? html`<a class="home" href="/">
          <h1>The Blog of Random</h1>
        </a>`
      : `<div></div>`}
    <a class="feed" href="/feed" title="Feed">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-rss"
      >
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
      </svg>
    </a>
  </header>`;
}
