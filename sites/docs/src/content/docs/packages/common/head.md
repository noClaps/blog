---
title: Head
description: The head component used in the ZeroLimits.dev sites
---

## Options

### `site`

This is the site on which the component is being used. This option is used to add tags to the head depending on the site that the component is used on.

For instance, if the component is used in the blog, then a link to the RSS feed can be added:

```astro
<head>
  {
    site === "blog" && (
        <link
        rel="alternate"
        href="/rss.xml"
        type="application/rss+xml"
        title="RSS"
        />
    )
  }
</head>
```

- **Allowed values**: _string_
- **Optional**: No

### `title`

This sets the title for the page in the head. This is the title that appears on the tab at the top.

This will be extended in the future to include the OpenGraph title.

```astro
<head>
  <title>{title}</title>
</head>
```

- **Allowed values**: _string_
- **Optional**: No

### `description`

This sets the description metadata for the page in the head, which usually shows up in search results.

This will be extended in the future to include the OpenGraph page description.

```astro
<head>
  <meta name="description" content={description} />
</head>
```

- **Allowed values**: _string_
- **Optional**: No

## Code explanation

### Options

```astro
---
interface Props {
  site: string;
  title: string;
  description: string;
}

const { site, title, description } = Astro.props;
---
```

This sets the options and their allowed values that can be used in the component. These are explained above.

### Metadata

```astro
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark light" />
</head>
```

The `charset="UTF-8"` sets the character set to [UTF-8](https://en.wikipedia.org/wiki/UTF-8), which means only characters in this set will be allowed to be displayed on the page.

The `viewport` sets the viewport width to the device's screen width. This allows the page to scale appropriately, and the site to be responsive and mobile-friendly, although more CSS is needed to fully achieve that.

The `color-scheme` specifies which color schemes the site is compatible with. Its content can only be `normal`, `light dark` or `dark light` in order of preference, or `only light`. `only dark` is not a valid option.

### Favicons

```astro
<head>
  <link rel="icon" href="/icon/favicon.ico" sizes="any" />
  <link rel="icon" href="/icon/favicon.svg" type="image/svg+xml" />
</head>
```

This sets the favicon, which is the icon that shows up next to the title in the tab bar. In this case, you must have 2 favicon files: a `favicon.ico` and a `favicon.svg`, both placed in `public/icon/`.

### Font

```astro
<head>
  <link rel="preconnect" href="https://rsms.me/" />
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
</head>
```

This connects to the [Inter font website](https://rsms.me/inter/) and fetches the CSS for the font. The `preconnect` means that the link will get priority when loading the site. This can then be used by setting the `font-family` in your CSS.

All ZeroLimits.dev sites use the Inter font.

## Usage

First, [install the `common` package](/packages/common/#installation).

Then, you can import it into your files and start using it.

```astro
---
import { Head } from "@noclaps/common";

const {
  title,
  description = "A blog about the most random things you can think of, brought to you by the most interesting boring person you've ever met.",
} = Astro.props;
---

<html lang="en">
  <Head site="blog" title={title} description={description} />
</html>
```

## Contributing

This component should only be changed if a site is added or modified that needs a specific tag in the head. If this needs to be done, it should be done in the format:

```astro
<head>
  {
    site === "site name as string" && (
        // Your HTML tag here
    )
  }
</head>
```
