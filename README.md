# ZeroLimits.dev
This is a monorepo containing all of the sites and packages for ZeroLimits.dev.

For details on each, see their respective READMEs:

**Sites**:
- [Homepage](./sites/homepage/README.md)
- [The Blog of Random](./sites/blog/README.md)
- [Aperturic Focus](./sites/gallery/README.md)

**Packages**:
- [icons](./packages/icons/README.md)
- [theme-toggle](./packages/theme-toggle/README.md)

## Build Instructions
1.  ```bash
    git clone https://github.com/noClaps/ZeroLimits.dev.git && cd ZeroLimits.dev
    ```

2.  ```bash
    npm install
    npm run dev
    ```

    Run this in the root directory (`ZeroLimits.dev/` if you followed the instructions above). Turbo's CLI will then notify you for the links to the preview to each of the sites. If you want to see the preview for only one of the sites, use:

    ```bash
    npm run dev -- --filter=homepage # for homepage
    npm run dev -- --filter=gallery # for gallery
    npm run dev -- --filter=blog # for blog
    ```

    Make sure to keep this repository and your dependencies up-to-date, especially if you plan to contribute.

3.  ```bash
    npm run build # The same filters as above also work here.
    ```

    This will build all 3 sites and place it into their respective `dist/` folders:
    - `sites/homepage/dist/` for the homepage,
    - `sites/gallery/dist/` for the gallery,
    - `sites/blog/dist` for the blog.

## Licenses

All of the code in this repository is under the [0BSD license](./LICENSE), unless specified otherwise.
