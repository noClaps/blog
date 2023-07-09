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
import { Head, Footer, Page404, Sidebar } from "@noclaps/common";
import "@noclaps/common/global.css";
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

#### Sidebar

The content that should be displayed in the sidebar should go inside the sidebar component. This is usually your
navigation bar.

### Example

```astro
---
import Layout from "path/to/your/layout";
import { Head, Footer, Sidebar } from "@noclaps/common";
import "@noclaps/common/global.css";
---
<Layout>
    <Head site="blog" title="Your title here" description="Your description here" />
    <Sidebar>
        <!-- Your sidebar content should go here. -->
    </Sidebar>
    <Footer site="blog" />
</Layout>
```

```astro
---
// This should be your 404 page
import Layout from "path/to/your/layout";
import { Page404 } from "@noclaps/common";
---

<Layout>
    <Page404 />
</Layout>
```
