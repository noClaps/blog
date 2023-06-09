# Icons - ZeroLimits.dev

A package that hosts the icons used in the ZeroLimits.dev sites. Not to be used outside.

## Installation

Add the `@noclaps/icons` package to `package.json`.

```json
"dependencies": {
"@noclaps/icons": "*"
}
```

## Usage

```astro
---
import { Icon } from "@noclaps/icons";
---
```

### Options

`name`

Allows a string, one of:

- `sun`
- `moon`
- `github`
- `download`
- `sidebar`
- `blog-icon`
- `rss`
- `dropdown-arrow`
- `arrow-up`
- `note`
- `quote`
- `warning`

### Example

```astro
---
import { Icon } from "@noclaps/icons"
---

<Icon name="github" />
```

## Licenses

The icons come from [Octicons](https://primer.style/octicons) and are licensed under
the [MIT license](https://github.com/primer/octicons/blob/main/LICENSE).
