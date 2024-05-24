const server = Bun.serve({
  async fetch({ url }) {
    const path = new URL(url).pathname;

    if (path === "/") return new Response(Bun.file("dist/index.html"));
    if (path === "/notes")
      return new Response(Bun.file("dist/notes/index.html"));

    if (await Bun.file(`dist${decodeURI(path)}`).exists()) {
      return new Response(Bun.file(`dist${decodeURI(path)}`));
    }

    return new Response(Bun.file(`dist${path}.html`));
  },
  reusePort: true,
});

console.log(`Server running on ${server.url}`);
