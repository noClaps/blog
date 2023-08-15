---
title: Gallery
description: A website to showcase some cool photos I've taken.
---

This is the documentation for the code used in [Aperturic Focus](https://gallery.zerolimits.dev), the ZeroLimits.dev photo gallery.

## Build instructions

1.  ```sh
    git clone https://github.com/noClaps/ZeroLimits.dev.git
    cd ZeroLimits.dev
    ```

2.  ```sh
    bun install
    bun dev:gallery
    ```

    Then open `localhost:3000` in your browser to see the live preview of the site.

3.  ```sh
    # Run from the root directory (ZeroLimits.dev/)
    bun build:gallery
    ```
    
    This will build the site and place it in `packages/gallery/dist/`.

## Licenses

All of the photos on the site are licensed under [CC0-1.0 license](https://github.com/noClaps/ZeroLimits.dev/blob/main/packages/gallery/src/assets/LICENSE).
