import BaseLayout from "../layouts/BaseLayout";
import Topic from "../components/Topic";
import Title from "../components/layout/Title";

const html = BaseLayout(
  { title: "The Blog of Random" },
  {
    head: `<link rel="stylesheet" href="/styles/index.css">`,

    default: `
			<main>
			${Title({ pathname: "/" })}
			<section>
			${await Topic({ section: "history" })}
			${await Topic({ section: "law" })}
			${await Topic({ section: "science" })}
			${await Topic({ section: "tech" })}
			</section>
			</main>
			`,
  },
  { pathname: "/" },
);

Bun.write("./dist/index.html", html);
