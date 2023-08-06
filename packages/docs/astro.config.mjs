import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl: "https://github.com/noClaps/docs/edit/main/"
      },
      lastUpdated: true,
      title: 'The Docs-ter',
      description: "The documentation for the ZeroLimits.dev sites",
      logo: { src: "./src/assets/favicon.svg" },
      tableOfContents: {
        maxHeadingLevel: 6
      },
      social: {
        github: 'https://github.com/noClaps/docs',
      },
      sidebar: [
        {
          label: 'Sites',
          autogenerate: { directory: "sites" },
        },
        {
          label: 'Packages',
          autogenerate: { directory: 'packages' },
        },
      ],
      customCss: [
        "./src/styles/style.css"
      ],
      favicon: "/favicon.ico"
    }),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
