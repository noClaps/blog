---
title: Styles - Colors
description: The common colors for ZeroLimits.dev sites
---

## Code explanation

### PostCSS mixin plugin

```postcss
@define-mixin
```

This uses a [PostCSS plugin for mixins](https://github.com/postcss/postcss-mixins). The configuration for this plugin can be found in the `postcss.config.cjs` file in the `common` package root.

### Common colors

```postcss
@define-mixin light-theme {
    --bg: #fff;
    --text: #111;
    --variant: #eee;
}

@define-mixin dark-theme {
    --bg: #111;
    --text: #eee;
    --variant: #222;
}
```

These are the common colors for all of the ZeroLimits.dev sites.

- `--bg`: The background color of the site.
- `--text`: The color of the text on the site.
- `--variant`: A neutral color used to differentiate an element from the background. An example of this is the search bar on the [homepage](https://zerolimits.dev).

### Theme toggle

```postcss
@define-mixin light-theme {
    .moon {
        display: inline-block;
    }

    .sun {
        display: none;
    }
}

@define-mixin dark-theme {
    .moon {
        display: none;
    }

    .sun {
        display: inline-block;
    }
}
```

These are used to show and hide the [theme toggle](/packages/theme-toggle) icons. In light mode, the moon icon is displayed and the sun icon is hidden. In dark mode, the sun icon is displayed and the moon icon is hidden.

### Applying the styles

```postcss
body {
    @media (prefers-color-scheme: dark) {
        @mixin dark-theme;
    }

    @media (prefers-color-scheme: light) {
        @mixin light-theme;
    }

    &.light {
        @mixin light-theme;
    }

    &.dark {
        @mixin dark-theme;
    }
}
```

This applies the mixins from above.

- The `dark-theme` mixin gets applies if the user's browser sends a `prefers-color-scheme` value of dark, or if the user uses the theme toggle to enable the dark theme, which sets the body class to `dark`.
- The `light-theme` mixin is applied if the user's browser sends a `prefers-color-scheme` value of light, or if the user uses the theme toggle to enable the light theme, which sets the body class to `light`.


### Selection

```postcss
::selection {
    background-color: var(--selection-bg);
    color: var(--selection-text);
}
```

This applies the `--selection-bg` and `--selection-text` CSS variables to the [`::selection` pseudo-element](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection). As this is different for each site, this requires the site to have CSS variables called `--selection-bg` and `--selection-text`.

- `--selection-bg`: The background color of the selected text.
- `--selection-text`: The color of the selected text.

## Usage

See [Styles - Global](./global).

## Contributing

Only the colors in the mixins should be updated, if necessary. Updating the colors here will automatically update the respective colors on the sites that use the `common` package.
