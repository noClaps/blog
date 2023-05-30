# Theme toggle - ZeroLimits.dev

A package that hosts the theme toggle used in the ZeroLimits.dev sites. Not to be used outside.

## Installation
Add the `theme-toggle` package to `package.json`
```json
"dependencies" {
    "theme-toggle": "*"
}
```

## Usage
```astro
---
import { ThemeToggle } from "theme-toggle";
---
```

### Options
`color`

The color of the icon. Allows a CSS color string.

`hoverColor`

The color of the item when it is hovered. Allows a CSS color string.

### Example
```astro
---
import { ThemeToggle } from "theme-toggle";
---

<ThemeToggle color="#eee" hoverColor="#2ef" />
<ThemeToggle color="var(--text)" hoverColor="var(--link)" />
```
