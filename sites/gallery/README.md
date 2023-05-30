# Aperturic Focus

A website to showcase some cool photos I've taken.

## Building from source

1.  ```sh
    git clone https://github.com/noClaps/gallery.git && cd gallery
    ```
2.  Put all of your photos in `/assets/img/`
3.  ```sh
     npm install
     npm run dev
    ```

    Run this in the root directory (`gallery/` if you followed the instructions above), and open `localhost:3000` in your desired browser to see the preview. Make sure to keep this repository and your dependencies up-to-date, especially if you plan to contribute.

4.  ```sh
     npm run build
    ```
    This builds the site and places the files in the `dist/` directory.

## Licenses

The licenses of all npm dependencies are in their respective folders in `node_modules/` when you install them with `npm install`.

[Astro](https://astro.build), the static site generator used to generate this website, is licensed under the [MIT license](https://github.com/withastro/astro/blob/main/LICENSE).

The favicon and icons come from [Octicons](https://primer.style/octicons) and are licensed under the [MIT license](https://github.com/primer/octicons/blob/main/LICENSE).

The [Inter](https://rsms.me/inter) font is licensed under the [OFL-1.1 license](https://github.com/rsms/inter/blob/master/LICENSE.txt).

All of the images are licensed under [CC0-1.0 license](src/assets/LICENSE).
