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
    npm install

    # Run from the gallery directory (ZeroLimits.dev/sites/gallery)
    npm run dev

    # Run from the root directory (ZeroLimits.dev/)
    npm run dev:gallery
    ```

    Then open `localhost:3000` in your browser to see the live preview of the site.

3.  ```sh
    # Run from the gallery directory (ZeroLimits.dev/sites/gallery)
    npm run build

    # Run from the root directory (ZeroLimits.dev/)
    npm run build:gallery
    ```
    
    This will build the site and place it in `sites/gallery/dist`.

## Components

- [Photos](./photos)
- [Gallery (component)](./gallery-component)
