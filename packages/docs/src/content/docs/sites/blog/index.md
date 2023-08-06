---
title: Blog
description: A blog about the most random things you can think of, brought to you by the most interesting boring person you've ever met.
---

This is the documentation for the code used in [The Blog of Random](https://blog.zerolimits.dev), the ZeroLimits.dev blog.

## Build instructions

1.  ```sh
    git clone https://github.com/noClaps/ZeroLimits.dev.git
    cd ZeroLimits.dev
    ```

2.  ```sh
    npm install

    # Run from the blog directory (ZeroLimits.dev/sites/blog)
    npm run dev

    # Run from the root directory (ZeroLimits.dev/)
    npm run dev:blog
    ```

    Then open `localhost:3000` in your browser to see the live preview of the site.

3.  ```sh
    # Run from the blog directory (ZeroLimits.dev/sites/blog)
    npm run build

    # Run from the root directory (ZeroLimits.dev/)
    npm run build:blog
    ```

    This will build the site and place it in `sites/blog/dist`.

## Components

- [Writing posts](/sites/blog/posts)
- [Components](/sites/blog/components)
