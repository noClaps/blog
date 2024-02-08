import Link from "../../components/Link";
import Title from "../../components/layout/Title";
import BaseLayout from "../../layouts/BaseLayout";
import { getCollection } from "../../../tools/utils";

const notes = await getCollection("notes").then((notes) => {
  return notes.sort((a, b) => {
    const aDate = a.lastmod ?? a.date;
    const bDate = b.lastmod ?? b.date;

    if (aDate > bDate) return -1;
    if (aDate < bDate) return 1;
    return 0;
  });
});

const html = BaseLayout(
  { title: "Notes | The Blog of Random" },
  {
    head: `<link rel="stylesheet" href="/styles/notes/index.css">`,
    default: `
		<main>
		${Title({ pathname: "/notes" })}
		<section>
		${notes
      .map((note) =>
        Link({
          title: note.title,
          href: `notes/${note.slug}`,
          date: note.lastmod ?? note.date,
          author: note.author.name,
        }),
      )
      .join("")}
		</section>
		</main>
		`,
  },
  { pathname: "/notes" },
);

Bun.write("./dist/notes/index.html", html);
