import { $, type Serve } from "bun";
import { watch } from "node:fs";

const serverOptions: Serve = {
  async fetch({ url }) {
    const path = new URL(url).pathname;

    if (path === "/") return new Response(Bun.file("dist/index.html"));
    if (path === "/notes")
      return new Response(Bun.file("dist/notes/index.html"));

    if (await Bun.file(`dist${decodeURI(path)}`).exists()) {
      return new Response(Bun.file(`dist${decodeURI(path)}`));
    }

    if (await Bun.file(`dist${path}.html`).exists()) {
      return new Response(Bun.file(`dist${path}.html`));
    }

    return new Response("Not found", { status: 404 });
  },
};

await $`bun scripts/build.ts`;
const server = Bun.serve(serverOptions);
console.log(`Server started at ${server.url}`);

function watcher(path: string) {
  watch(
    `${import.meta.dir}/../${path}`,
    { recursive: true },
    async (event, filename) => {
      console.log(`Detected ${event} in ${filename}.`);
      await $`bun scripts/build.ts`.then(() => {
        server.reload(serverOptions);
        console.log("Reloaded!");
      });
    },
  );
}

watcher("src");
watcher("public");
