import { defineConfig, sharpImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://gallery.zerolimits.dev",
    integrations: [sitemap()],
    experimental: {
        assets: true,
    },
    image: {
        service: sharpImageService(),
    },
    compressHTML: true,
    build: {
        inlineStylesheets: "auto"
    }
});
