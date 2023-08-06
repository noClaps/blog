---
title: Homepage
description: The most interesting boring homepage you've ever seen
---

This is the documentation for all of the code used in the [homepage](https://zerolimits.dev) of ZeroLimits.dev.

## Build instructions

1.  ```sh
    git clone https://github.com/noClaps/ZeroLimits.dev.git
    cd ZeroLimits.dev
    ```

2.  ```sh
    npm install

    # Run from the homepage directory (ZeroLimits.dev/sites/homepage)
    npm run dev

    # Run from root directory (ZeroLimits.dev/)
    npm run dev:homepage
    ```

    Then open `localhost:3000` in your browser to see the live preview of the site.

3.  ```sh
    # Run from homepage directory (ZeroLimits.dev/sites/homepage/)
    npm run build

    # Run from root directory (ZeroLimits.dev/)
    npm run build:homepage
    ```

    This will build the site and place it in `sites/homepage/dist/`.

## Adding links

All new links should be added to the end of the `public/links.json` file, in the format:

```json
{
  "url": "https://link-to-site.tld",
  "favicon": "https://link-to-favicon.tld/favicon.ico",
  "title": "Title of site",
  "desc": "Short description of site", // Optional
  "tags": ["tags", "to", "describe", "site"]
}
```

## Licenses

The favicon, [GitHub](https://github.com) and donate icons come from [Octicons](https://primer.style/octicons) and are licensed under the [MIT license](https://github.com/primer/octicons/blob/main/LICENSE).

The [Matrix](https://matrix.org) icon comes from [Simple Icons](https://simpleicons.org/).

[Fuse.js](https://www.fusejs.io), the approximate string-matching library used in the search component, is licensed under the [Apache-2.0 license](https://github.com/krisk/Fuse/blob/main/LICENSE).
