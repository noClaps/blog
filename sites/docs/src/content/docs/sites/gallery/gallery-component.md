---
title: Gallery (component)
description: The docs for the Gallery component
---

## Code explanation

### Imports

```astro
---
import { Image } from "astro:assets";
const images = await Astro.glob("../assets/*.{jpg,jpeg}");
---
```

This imports the `<Image />` component from Astro Assets, as well as the images from the `assets/` directory.

### Displaying the images

```astro
<div>
  {
    images.map((image) => (
      <Image class="zoom" src={image.default} alt="" width="1008" />
    ))
  }
</div>
```

This shows the images in the optimised `<Image />` components, with a class of `zoom` for `medium-zoom`, and a width of 1008 pixels.

### Medium zoom

```astro
<script>
  import mediumZoom from "medium-zoom";
  mediumZoom(".zoom", { background: "var(--image-bg)", margin: 8 });
</script>
```

This uses a library called [`medium-zoom`](https://github.com/francoischalifour/medium-zoom), which creates a zoom effect on click similar to the one found on [Medium](https://medium.com).

The arguments for the `mediumZoom()` functions say that all elements with a class name of `zoom` should be selected to be zoomed in on click, and the background CSS property of the zoomed-in image should be set to the `--image-bg` CSS variable, which is set in the `colors.css` stylesheet for the gallery website. An 8px margin should also be set around the image.

## Contributing

This component should only be modified to update the styles, or the number of pixels in the optimised image with the `width` property of the `<Image />` component.
