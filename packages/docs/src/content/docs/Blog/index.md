---
title: Blog
description: A blog about the most random things you can think of.
---

This is the documentation for the code used in [The Blog of Random](https://blog.zerolimits.dev), the ZeroLimits.dev blog.

## Build instructions

1.  ```sh
    git clone https://github.com/noClaps/ZeroLimits.dev.git
    cd ZeroLimits.dev
    ```

2.  ```sh
    bun install
    bun dev:blog
    ```

    Then open `localhost:4321` in your browser to see the live preview of the site.

3.  ```sh
    bun build:blog
    ```

    This will build the site and place it in `packages/blog/dist/`.
