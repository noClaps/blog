---
title: Documentation
description: This is the documentation for ZeroLimits.dev projects
---

This is the documentation for the documentation. It's mostly about how to contribute to the documentation.

## Build instructions

1.  ```sh
    git clone https://github.com/noClaps/ZeroLimits.dev.git
    cd docs
    ```

2.  ```sh
    bun install
    bun dev:docs
    ```

    Then open `localhost:3000` in your browser to see the live preview of the site.

3.  ```sh
    bun build:docs
    ```

    This will build the site and place it in `dist/`.

## Contributing

All documentation should be written in Markdown (`.md`) files. The documentation should be in the appropriate directory, depending on the part of the site that has been modified.

The documentation is made with [Starlight](https://github.com/withastro/starlight), a documentation website framework for Astro. Their documentation can be found [here](https://starlight.astro.build).

### Frontmatter

Each page of documentation should have 2 properties:

```md
---
title: [documentation page title]
description: [documentation page description]
---
```

- `title`: _string_

  The title of the documentation page. This is also the title that will display in the navigation sidebar.

- `description`: _string (Optional)_

  The description of the documentation page. This will not display on the site, but will be present in the `<meta>` tag in the `<head>`. It is an optional property, but recommended.

### Content

The content of the documentation should be clear and concise. It should be split up into the following sections depending on what the documentation is for:



#### Build instructions

If the documentation is for a site, then this section should explain how to clone the repo, create a local deployment and build the site that is being worked on.

#### Usage

If the documentation is for a component, then this section should explain how to use the component in the site. Generally, this is just an example usage of the component, including importing it into the page and how to use it.

#### Options

If the documentation is for a component, then this section should detail the options and properties of components.

#### Contributing

This section should explain what parts of the code are allowed to be changed, and how any future contributors may contribute to that component. If used for a site, this section should explain how contributors can contribute to the site.

#### Licenses

If any licenses other than those listed in the [documentation homepage](/#licenses) are used, then they should be detailed in this section. Licenses should be added in the format:

```md
[Tool name](https://link-to-tool-homepage.tld), [short description of tool] is licensed under [License name](https://link-to-tool-license.tld).
```

## Licenses

[Starlight](https://starlight.astro.build), the documentation website framework used for this site is licensed under the [MIT license](https://github.com/withastro/starlight/blob/main/LICENSE).