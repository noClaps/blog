# Common - ZeroLimits.dev

A package that hosts the common components and files used in the ZeroLimits.dev sites. Not to be used outside.

## Installation

Add the `@noclaps/common` package to `package.json`

```json
"dependencies": {
"@noclaps/common": "*"
}
```

## Usage

```astro
---
import { Head } from "@noclaps/common";
import "@noclaps/common/global.scss";
---
```

### Options

#### Head

`site`

The site for the head component to be used on.

### Example

```astro
---
import { Head } from "@noclaps/theme-toggle";
import "@noclaps/common/global.scss";
---

<ThemeToggle color="#eee" hoverColor="#2ef" />
<ThemeToggle color="var(--text)" hoverColor="var(--link)" />
```
