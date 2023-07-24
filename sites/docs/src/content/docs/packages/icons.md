---
title: Icons
description: A package that hosts the icons used in the ZeroLimits.dev sites.
---

## Installation

Add the `@noclaps/icons` package to `package.json`.

```json
"dependencies": {
  "@noclaps/icons": "*"
}
```

## Options

### `name`

The name passed to the `<Icon />` component is the icon that is returned. For instance, if the name `moon` is passed to the component, then the following SVG is returned:

```xml
<svg
  class="moon"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 16 16"
  fill="currentColor"
>
  <path
    fill-rule="evenodd"
    d="M9.598 1.591a.75.75 0 01.785-.175 7 7 0 11-8.967 8.967.75.75 0 01.961-.96 5.5 5.5 0 007.046-7.046.75.75 0 01.175-.786zm1.616 1.945a7 7 0 01-7.678 7.678 5.5 5.5 0 107.678-7.678z"
  />
</svg>
```

- **Allowed values**: `sun`, `moon`, `github`, `download`, `sidebar`, `blog-icon`, `rss`, `dropdown-arrow`, `arrow-up`, `note`, `quote`, `warning`, `mastodon`
- **Optional**: No

## Code explanation

### Options

```astro
---
interface Props {
  name: string;
}

const { name } = Astro.props;
---
```

This sets the options for the `<Icon />` component. These options are explained above.

### Icons

```astro
{
  name === "sun" && (
    <svg
      class="sun"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8 12a4 4 0 100-8 4 4 0 000 8zM8 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V.75A.75.75 0 018 0zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 018 13zM2.343 2.343a.75.75 0 011.061 0l1.06 1.061a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zm9.193 9.193a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.061l-1.061-1.06a.75.75 0 010-1.061zM16 8a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0116 8zM3 8a.75.75 0 01-.75.75H.75a.75.75 0 010-1.5h1.5A.75.75 0 013 8zm10.657-5.657a.75.75 0 010 1.061l-1.061 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm-9.193 9.193a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0z"
      />
    </svg>
  )
}

...
```

These are the icons that are available in the `<Icon />` component. When the name is passed to the component, it checks which icon is requested, and returns the SVG for that icon.

### Styles

```astro
<style>
  svg {
    justify-self: center;
    align-self: center;
  }

  .moon,
  .sun,
  .github,
  .rss,
  .mastodon {
    height: 1.25rem;
  }

  .download,
  .sidebar,
  .dropdown-arrow,
  .arrow-up,
  .note,
  .quote,
  .warning {
    height: 1rem;
  }

  .blog-icon {
    fill: var(--link);
    height: 16rem;
  }

  .arrow-up {
    margin-right: 0.25rem;
  }

  .note,
  .quote,
  .warning {
    margin-right: 0.5rem;
    vertical-align: middle;
  }
</style>
```

These are the styles of the different icons. The styles under `svg` are shared by all icons, while the individual icons have their own styles depending on their usage in the website.

## Usage

First, [install the package](#installation).

Then, you can import it into your files and start using it.

```astro
---
import { Icon } from "@noclaps/icons";
---

<body>
  <Icon name="github">
</body>
```

## Contributing

This component should only be updated to add a new icon, update or remove an existing icon, or update the styles of the icon(s).

### Adding a new icon

If a new icon is being added, it should be in the format:

```astro
{
  name === "icon-name" && (
    <svg
      class="icon-name">
      <!-- Rest of the icon SVG -->
    </svg>
  )
}
```

The icon name should be in kebab case, with hyphens (-) separating the words. If the icon is from a source different to the ones listed in the [Licenses](#licenses) section, then the source and license of the icon should be added, in the format:

```md
The <icon name> icon/icons comes/come from [Icon pack name](https://link-to-icon-pack.tld) and is/are licensed under [license name](https://link-to-licence.tld).
```

### Updating an icon

If an icon is being an updated, then only the `<svg>` should be changed. The class name of the icon should remain the same after updating the icon.

If only the style of the icon is being updated, then only the CSS inside `<style>` should be changed. This should be done by added a new `.class` selector and adding the styles to that, making sure to not change existing styles that could affect other icons. For instance, if the style of the RSS icon needs to be updated, then the code should change from:

```astro
<style>
  .moon,
  .sun,
  .github,
  .rss,
  .mastodon {
    height: 1.25rem;
  }
</style>
```

to:

```astro
<style>
  .moon,
  .sun,
  .github,
  .mastodon {
    height: 1.25rem;
  }

  .rss {
    /* RSS icon styles */
  }
</style>
```

If the new styles already exist for other icons, then the icon selector can just be added to the list with the other icons. For instance, if the `height` of the RSS icon were to be updated from `1.25rem` to `1rem`, then the code would change from:

```astro
<style>
  .moon,
  .sun,
  .github,
  .rss,
  .mastodon {
    height: 1.25rem;
  }

  .download,
  .sidebar,
  .dropdown-arrow,
  .arrow-up,
  .note,
  .quote,
  .warning {
    height: 1rem;
  }
</style>
```

to:

```astro
<style>
  .moon,
  .sun,
  .github,
  .mastodon {
    height: 1.25rem;
  }

  .download,
  .sidebar,
  .dropdown-arrow,
  .arrow-up,
  .note,
  .quote,
  .warning,
  .rss { /* The .rss selector was added here */
    height: 1rem;
  }
</style>
```

If the new icon comes from a different source than the original, then the license should be updated in the [Licenses](#licenses) section, in the format:

```md
The <icon name> icon/icons comes/come from [Icon pack name](https://link-to-icon-pack.tld) and is/are licensed under [license name](https://link-to-licence.tld).
```

### Removing an icon

An icon should only be removed after ensuring that it is not being used anywhere in the project. When removing an icon, ensure that you remove all code related to the icon, including the icon itself, the styles related to the icon, and the references to the icon in [Licenses](#licenses).

## Licenses

The icons come from [Octicons](https://primer.style/octicons) and are licensed under
the [MIT license](https://github.com/primer/octicons/blob/main/LICENSE).

The Mastodon icon comes from [Simple Icons](https://simpleicons.org/) and is licensed under the [CC0-1.0 license](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md).
