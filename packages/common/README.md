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

`title`

The title to be set for the page.

`description`

The content of the description meta tag for the page.

#### Footer

`site`

The site for the footer component to be used on.

### Example

```astro
---
import { Head, Footer } from "@noclaps/common";
import "@noclaps/common/global.scss";
---

<Head site="blog" title="Your title here" description="Your description here" />
<Footer site="blog" />
```
