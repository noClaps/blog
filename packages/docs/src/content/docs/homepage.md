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
    bun install
    bun dev:homepage
    ```

    Then open `localhost:4321` in your browser to see the live preview of the site.

3.  ```sh
    bun build:homepage
    ```

    This will build the site and place it in `packages/homepage/dist/`.

## Licenses

The Starfield animation comes from the [Astro Landing Page theme](https://astro-moon-landing.netlify.app) by [mhyfritz](https://github.com/mhyfritz) and is licensed under the [MIT license](https://github.com/mhyfritz/astro-landing-page/blob/main/LICENSE).
