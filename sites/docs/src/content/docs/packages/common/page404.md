---
title: 404 Page
---

## Code explanation

```astro
<main>
  <h1>This content is not available in your country.</h1>
</main>
<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    text-align: center;
  }
</style>
```

[![xkcd: Not Available](https://imgs.xkcd.com/comics/not_available.png)](https://xkcd.com/1969/)

## Usage

First, [install the `common` package](/packages/common/#installation).

Then, you can import it into your files and start using it.

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { Page404 } from "@noclaps/common";
---

<BaseLayout>
  <Page404 />
</BaseLayout>
```

## Contributing

This component should only be changed if the style of the 404 page is to be updated.
