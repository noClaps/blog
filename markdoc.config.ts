import { component, defineMarkdocConfig, nodes } from "@astrojs/markdoc/config";
import shiki from "@astrojs/markdoc/shiki";

export default defineMarkdocConfig({
    tags: {
        quote: {
            render: component("./src/components/posts/Quote.astro"),
            attributes: {
                name: { type: String },
                link: { type: String }
            }
        },
        note: {
            render: component("./src/components/posts/Note.astro"),
            attributes: {
                title: { type: String }
            }
        },
        warning: {
            render: component("./src/components/posts/Warning.astro"),
            attributes: {
                title: { type: String }
            }
        },
        math: {
            render: component("./src/components/posts/Math.astro"),
            attributes: {
                display: { type: String }
            }
        },
        toc: {
            render: component("./src/components/posts/TableOfContents.astro"),
            attributes: {
                headings: { type: String }
            }
        }
    },
    extends: [shiki()]
});