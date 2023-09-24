import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
    site: "https://blog.zerolimits.dev",
    markdown: {
        remarkPlugins: [remarkToc],
        rehypePlugins: [
            rehypeHeadingIds,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
    },
    integrations: [mdx()]
});
