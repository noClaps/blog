# ZeroLimits.dev

This is a monorepo containing all of the sites and packages for ZeroLimits.dev.

For details on each, see the documentation:

**Sites**:

- [Homepage](https://docs.zerolimits.dev/sites/homepage/)
- [The Blog of Random](https://docs.zerolimits.dev/sites/blog/)
- [Aperturic Focus](https://docs.zerolimits.dev/sites/gallery/)
- [The Docs-ter](https://docs.zerolimits.dev/sites/docs/)

**Packages**:

- [icons](https://docs.zerolimits.dev/packages/icons/)
- [theme-toggle](https://docs.zerolimits.dev/packages/theme-toggle/)
- [common](https://docs.zerolimits.dev/packages/common/)

## Build Instructions

1.  ```bash
    git clone https://github.com/noClaps/ZeroLimits.dev.git && cd ZeroLimits.dev
    ```

2.  ```bash
    npm install
    npm run dev
    ```

    Run this in the root directory (`ZeroLimits.dev/` if you followed the instructions above). Turbo's CLI will then
    notify you for the links to the preview to each of the sites. If you want to see the preview for only one of the
    sites, use:

    ```bash
    npm run dev -- --filter=gallery # for gallery
    npm run dev -- --filter=blog # for blog
    ```

    Make sure to keep this repository and your dependencies up-to-date, especially if you plan to contribute.

3.  ```bash
    npm run build # The same filters as above also work here.
    ```

    This will build all 3 sites and place it into their respective `dist/` folders:
    - `sites/gallery/dist/` for the gallery,
    - `sites/blog/dist/` for the blog.

## Licenses

All of the code in this repository is under the [0BSD license](./LICENSE), unless specified otherwise.

The licenses of all npm dependencies are in their respective folders in `node_modules/` when you install them
with `npm install`.

[Astro](https://astro.build/), the static site generator used to generate these sites, is licensed under
the [MIT license](https://github.com/withastro/astro/blob/main/LICENSE).

The [Inter](https://rsms.me/inter/) font is licensed under the [OFL-1.1 license](https://github.com/rsms/inter/blob/master/LICENSE.txt).

Any additional licenses for the sites and packages are detailed in their respective [documentation](https://docs.zerolimits.dev).
