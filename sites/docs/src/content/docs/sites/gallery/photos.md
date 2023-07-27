---
title: Photos
description: The documentation for the photos on Aperturic Focus
---

## Code explanation

The photos on the site are kept in the `src/assets/` folder. This is a special folder that is used by Astro to optimise images. [Read the Astro Assets docs here.](https://docs.astro.build/en/guides/assets/)

In order to enable Astro Assets, the configuration file must be:

```js
import { defineConfig, sharpImageService } from "astro/config";

export default defineConfig({
  experimental: {
    assets: true,
  },
  image: {
    service: sharpImageService(),
  }
})
```

The `sharpImageService()` is so that the images are compressed using `sharp` rather than the default `Squoosh`. This is because `sharp` is faster at transforming images than `Squoosh`.

## Contributing

Any images should be added to the `src/assets/` folder to be optimised before being displayed on the website. These photos should also be available under the CC0-1.0 license.

## Licenses

All of the photos on the site are licensed under [CC0-1.0 license](https://github.com/noClaps/ZeroLimits.dev/blob/main/sites/gallery/src/assets/LICENSE).
