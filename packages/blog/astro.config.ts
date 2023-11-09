import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
    site: "https://blog.zerolimits.dev",
    markdown: {
        remarkPlugins: [remarkToc],
    },
    integrations: [mdx()]
});
