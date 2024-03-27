import { $ } from "bun";
import { watch } from "fs";

async function serve() {
  await $`bun scripts/build.ts`;

  Bun.serve({
    async fetch({ url }) {
      const path = new URL(url).pathname;

      if (path === "/") return new Response(Bun.file(`dist/index.html`));
      if (path === "/notes")
        return new Response(Bun.file(`dist/notes/index.html`));

      if (await Bun.file(`dist${decodeURI(path)}`).exists()) {
        return new Response(Bun.file(`dist${decodeURI(path)}`));
      }

      return new Response(Bun.file(`dist${path}.html`));
    },
    reusePort: true,
  });
}

await serve()
  .then(() => {
    console.log("Server running on http://localhost:3000.");
  })
  .catch((e) => {
    console.log(`Something went wrong: ${e}`);
  });

function watcher(path: string) {
  watch(
    `${import.meta.dir}/../${path}`,
    { recursive: true },
    async (event, filename) => {
      console.log(`Detected ${event} in ${filename}.`);
      await serve().then(() => {
        console.log("Reloaded!");
      });
    },
  );
}

watcher("src");
watcher("public");
watcher("tools");
