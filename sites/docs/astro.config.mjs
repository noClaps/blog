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
      tableOfContents: {
        maxHeadingLevel: 6
      },
      social: {
        github: 'https://github.com/noClaps/ZeroLimits.dev',
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
        },
        {
          tag: "style",
          content: ":root { --sl-font: 'Inter', sans-serif; } @supports(font-variation-settings: normal) {:root { --sl-font: 'Inter var', sans-serif; }}"
        }
      ]
    }),
  ],

// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
