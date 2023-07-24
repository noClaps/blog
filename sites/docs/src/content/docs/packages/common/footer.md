---
title: Footer
---

## Options

### `site`

This is the site on which the component is being used. This option is used to add tags to the footer depending on the site that the component is used on.

For instance, if the component is used in the blog, then a link to the RSS feed can be added:

```astro
<footer>
  {
    site === "blog" && (
      <>
        <a href="/rss.xml" title="Atom Feed">
          <Icon name="rss" />
        </a>
        <noscript>
          <a href="/sitemap">Sitemap</a>
        </noscript>
      </>
    )
  }
</footer>
```

- **Allowed values**: _string_
- **Optional**: No

## Code explanation

### Imports

```astro
---
import { Icon } from "@noclaps/icons";
---
```

This imports the Icon component from the [`icons` package](/packages/icons) to be used in the component.

### Options

```astro
---
interface Props {
  site: string;
}

const { site } = Astro.props;
---
```

This sets the option and allowed values that can be used in the component. This is explained above.

### Links
```astro
<footer>
  <a href="https://github.com/noClaps/ZeroLimits.dev" title="Source Code">
    <Icon name="github" />
  </a>
  <a rel="me" href="https://mstdn.party/@noClaps"><Icon name="mastodon"></a>
  {
    site === "blog" && (
      <>
        <a href="/rss.xml" title="Atom Feed">
          <Icon name="rss" />
        </a>
        <noscript>
          <a href="/sitemap">Sitemap</a>
        </noscript>
      </>
    )
  }
</footer>
```

This is the main HTML of the Footer component. There is a link to the [GitHub repository](https://github.com/noClaps/ZeroLimits.dev) on all of the sites where the Footer component is included, as well as the GitHub icon. There is also a link to the [noClaps Mastodon account](https://mstdn.party/@noClaps). If the `site` is set to `blog`, then a link to the RSS feed is also shown, as well as a sitemap if JavaScript is disabled.

### Styles

```astro
<style>
  footer {
    margin-top: 4rem;
    position: relative;
    display: flex;
    bottom: 0;
    padding: 1rem;
    justify-content: center;
    align-items: center;
  }

  a {
    text-decoration: none;
    color: var(--text);
    padding: 0.5rem;
    margin: 0 0.25rem;
    border-radius: 0.5rem;
    display: grid;
    transition: all 0.25s;

    &:hover {
      color: var(--link);
    }
  }
</style>
```

These are the styles of the Footer component. Since these styles are included in the component, they are scoped to it. [This is a feature of Astro.](https://docs.astro.build/en/guides/styling/#scoped-styles)

The styles require you to have a CSS variable named `--link` in your site stylesheet.

## Usage

First, [install the `common` package](/packages/common/#installation).

Then, you can import it into your files and start using it.

```astro
---
import { Footer } from "@noclaps/common";
---

<html lang="en">
  <Footer site="blog" />
</html>
```

## Contributing

This component should only be changed if a site is added or modified that needs a specific link in the footer, or if the style of the footer is to be updated. If this needs to be done, it should be done in the format:

```astro
<footer>
  {
    site === "site name as string" && (
        <a href="link to page" title="Link title">
            <!-- Site text or icon -->
        </a>
    )
  }
</footer>
```
