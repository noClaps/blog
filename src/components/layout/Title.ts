export default function Title(vals: { pathname: string }) {
  return `
<div class="title">
    <section>
        <h1>The Blog of Random</h1>
        <p>A blog about the most random things you can think of.</p>
    </section>
    <nav>
        <a href="/" data-selected="${vals.pathname === "/"}">Blog</a> /
        <a href="/notes" data-selected="${vals.pathname.startsWith(
          "/notes",
        )}">Notes</a>
    </nav>
</div>
	`;
}
