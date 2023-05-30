import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeMathJax from "rehype-mathjax";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import { remarkReadingTime } from "./remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.zerolimits.dev",
  markdown: {
    remarkPlugins: [remarkMath, remarkReadingTime],
    rehypePlugins: [
      rehypeHeadingIds,
      rehypeMathJax,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
  integrations: [mdx(), sitemap()],
  compressHTML: true,
});
