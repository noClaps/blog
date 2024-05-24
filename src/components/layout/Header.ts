export default function Header(
  vals: {
    pathname: string;
  },
  slots: {
    default?: string;
  } = {},
) {
  return `
<header>
    ${
      vals.pathname !== "/" && vals.pathname !== "/notes"
        ? `
            <div>
                <a class="home" href="${
                  vals.pathname.startsWith("/notes") ? "/notes" : "/"
                }">
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
                        class="lucide lucide-home"
                    >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </a>
				${slots?.default ? slots.default : "<div></div>"}
            </div>
        `
        : "<div></div>"
    }
    <a class="feed" href="/feed" title="Feed"
        ><svg
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
            ><path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="1"></circle>
        </svg>
    </a>
</header>
`;
}
