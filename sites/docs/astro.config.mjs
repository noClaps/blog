import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl: "https://github.com/noClaps/ZeroLimits.dev/edit/main/sites/docs"
      },
      lastUpdated: true,
      title: 'Documentation',
      logo: { src: "./src/assets/favicon.svg" },
      tableOfContents: {
        maxHeadingLevel: 6
      },
      social: {
        github: 'https://github.com/noClaps/ZeroLimits.dev',
        mastodon: "https://mstdn.party/@noClaps"
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
      head: [
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://rsms.me/"
          }
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://rsms.me/inter/inter.css"
          }
        }
      ],
      customCss: [
        "./src/styles/style.css"
      ]
    }),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
