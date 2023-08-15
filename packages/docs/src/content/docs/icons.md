---
title: Icons
description: A package that hosts the icons used in the ZeroLimits.dev sites.
---

## Usage

```astro
---
import { Icon } from "@noclaps/icons";
---

<body>
  <Icon name="github">
</body>
```

## Options

### `name`

The name passed to the Icon component is the icon that is returned. For instance, if the name `moon` is passed to the component, then the following SVG is returned:

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

- **Allowed values**: `sun`, `moon`, `github`, `download`, `sidebar`, `blog-icon`, `rss`, `dropdown-arrow`, `arrow-up`, `note`, `quote`, `warning`, `donate`, `email`, `arrow-right`
- **Optional**: No

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

The "Allowed values" field in the [Options - name](#name) should also be updated to add the new icon name.

### Updating an icon

If an icon is being an updated, then only the `<svg>` should be changed. The class name of the icon should remain the same after updating the icon.

If only the style of the icon is being updated, then only the CSS inside `<style>` should be changed. This should be done by added a new `.class` selector and adding the styles to that, making sure to not change existing styles that could affect other icons. For instance, if the style of the RSS icon needs to be updated, then the code should change from:

```astro
<style>
  .moon,
  .sun,
  .github,
  .rss {
    height: 1.25rem;
  }
</style>
```

to:

```astro
<style>
  .moon,
  .sun,
  .github {
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
  .rss {
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
  .github {
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

The "Allowed values" field in the [Options - name](#name) should also be updated to remove the icon name.

## Licenses

The icons come from [Octicons](https://primer.style/octicons) and are licensed under
the [MIT license](https://github.com/primer/octicons/blob/main/LICENSE).
