export default function Title(props: { page: "index" | "notes" | "stories" }) {
	const { page } = props;
	return (
		<div class="title">
			<section>
				<h1>The Blog of Random</h1>
				<p>A blog about the most random things you can think of.</p>
			</section>
			<nav>
				<a href="/" data-selected={`${page === "index"}`}>
					Blog
				</a>{" "}
				/{" "}
				<a href="/notes" data-selected={`${page === "notes"}`}>
					Notes
				</a>{" "}
				/{" "}
				<a href="/stories" data-selected={`${page === "stories"}`}>
					Stories
				</a>
			</nav>
		</div>
	);
}
