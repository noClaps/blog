---
title: Styles - Global
---

This, and the [`colors`](./colors) stylesheet are meant to create uniformity in the design of the ZeroLimits.dev sites. As many styles as possible should be written here, instead of repeating them in the individual stylesheets for the sites.

## Code explanation

### Imports

```css
@import url("./colors.css");
```

This imports the [Styles - Colors](./colors) file into the global stylesheet. This means that only one stylesheet will need to be imported into the sites that will contain all of the necessary styles, while also allowing the code to be more modular and simple to understand.

### Font
```css
/* Font */
:root,
input,
button {
    font-family: 'Inter', sans-serif;

    @supports (font-variation-settings: normal) {
        font-family: 'Inter var', sans-serif;
    }
}
```

[Inter](https://rsms.me/inter) is the font used by all of the ZeroLimits.dev sites for the majority of the content. This code applies the font to all elements (unless overridden by the site), with the browser's san-serif font as the fallback.

### Root styles

```css
/* Root */
*,
:before,
:after {
    box-sizing: border-box;
}
```

This sets the box-sizing of all elements to border-box. This means that the borders and padding of the element should be included in the width or height of the element.

> If you set an element's width to 100 pixels, that 100 pixels will include any border or padding you added, and the content box will shrink to absorb that extra width.
> 
> Source: [box-sizing - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)

```css
body {
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    color: var(--text);
    min-height: 100vh;
    min-height: -webkit-fill-available;
    margin: 0;

    @supports (scroll-behavior: smooth) {
        scroll-behavior: smooth;
    }
}

html {
    height: -webkit-fill-available;
}
```

This code makes the body a [flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox), and makes the height the entire height of the viewport. The `-webkit-fill-available` is present because of the collapsing URL bars on mobile browsers like Chromium and Safari, which would otherwise cause layout issues, such as content being hidden behind them.

### Main content

```css
main {
    width: 88vw;
    max-width: 64rem;
    margin: 0 auto;
}
```

This limits the main content to 88% of the screen width, or 64rem, whichever is smaller. The `margin` makes it so that the content is horizonally centered on the screen.

### Text

```css
p,
li {
    line-height: 1.5rem;
    text-align: justify;
}
```

All of the text on all websites is justified, unless specified in the site's stylesheets. This means that the left and right edges of text are aligned with the edge of the box, except for the last line.

### Scrollbar

```css
/* Scrollbar */
::-webkit-scrollbar {
    width: 1.25rem;
}

::-webkit-scrollbar-thumb {
    background: var(--variant);
    border-radius: 0.5rem;
    border: solid 0.375rem var(--bg);
}
```

This creates the styles for the scrollbar on WebKit browsers like Safari and Chromium.

## Usage

First, [install the `common` package](/packages/common#installation).

Then, you can import it into your project.

```astro
---
import "@noclaps/common/global.css";
---
```

## Contributing

This should only be updated if a change is needed in the design of all ZeroLimits.dev sites. If a change is needed only in one of the sites, then the CSS file(s) for that site alone should be updated.
