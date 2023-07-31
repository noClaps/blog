---
title: Theme toggle
description: A package that hosts the theme toggle used in the ZeroLimits.dev sites.
---

## Installation

Add the `@noclaps/theme-toggle` package to `package.json`

```json
"dependencies": {
  "@noclaps/theme-toggle": "*"
}
```

## Code explanation

### Imports

```astro
---
import { Icon } from "@noclaps/icons";
---
```

This imports the Icon component from the [`icons` package](/packages/icons) to be used in the component.

### Button

```astro
<button title="Theme toggle" type="button" id="theme-toggle">
  <Icon name="sun" />
  <Icon name="moon" />
</button>
```

This creates a `<button>` with 2 icons inside: the sun icon and the moon icon. The styles in the [`colors` stylesheet](/packages/common/styles/colors/#theme-toggle) in the `common` package ensure that only one of the icons is shown, depending on if the site is in dark or light mode. If the site is in dark mode, then the sun icon is shown, and if the site is in light mode, then the moon icon is shown.

### Styles

```astro
<style>
  button {
    display: inline-flex;
    text-decoration: none;
    padding: 0.5rem;
    transition: all 0.25s;
    color: var(--text);
    background-color: transparent;
    border: none;
    cursor: pointer;

    &:hover {
      color: var(--link);
    }
  }
</style>
```

These are the styles for the theme toggle icon. Since these styles are included in the component, they are scoped to it. [This is a feature of Astro.](https://docs.astro.build/en/guides/styling/#scoped-styles)

The styles require you to have a CSS variable named `--link` in your site stylesheet.

### Script

This is the script for the theme toggle functionality. It is written in TypeScript, and will be converted to JavaScript on building the site.

#### Theme object

```astro
<script>
  const theme = {
    value: "light",

    init() {
      // Check if theme is stored in sessionStorage, else use prefers-color-scheme
      this.value =
        sessionStorage.getItem("theme") ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");

      // Set the body class to be the current theme value
      document.body.className = this.value;
    },

    toggle() {
      // Switch between light and dark
      if (this.value === "dark") {
        this.value = "light";
      } else {
        this.value = "dark";
      }

      // Update value in sessionStorage
      sessionStorage.setItem("theme", this.value);

      // Set body class to be updated theme value
      document.body.className = this.value;
    },
  };
</script>
```

This creates a `theme` object with an initial value of `light`. The `init()` function initialises the theme toggle by:

1. Checking if there is a value of the theme toggle already stored in `sessionStorage`.
2. If not, then checking the `prefers-color-scheme` value sent by the user's browser.
3. Setting the body class to the theme value returned (`dark` or `light`).

The `toggle()` function switches the value from dark to light, and vice versa. It also updates the theme value in `sessionStorage`, and updates the body class to the new value.

The styles are applied according to the [`colors` stylesheet](/packages/common/styles/colors/#applying-the-styles) in the `common` package.

#### Initialising

```astro
<script>
  // Initialise theme
  theme.init();

  // Attach event listener to theme toggle
  document
    .querySelector("#theme-toggle")
    ?.addEventListener("click", () => theme.toggle());
</script>
```

This initialises the theme toggle by running the `init()` script. It also adds an event listener to the theme toggle button, which runs the `toggle()` script every time the button is clicked.

## Usage

First, [install the package](#installation).

Then, you can import it into your files and start using it.

```astro
---
import { ThemeToggle } from "@noclaps/theme-toggle";
---

<header>
  <ThemeToggle />
</header>
```

## Contributing

This component should only be updated to change the style of the theme toggle, or to optimise the script that is used to add functionality to it.
