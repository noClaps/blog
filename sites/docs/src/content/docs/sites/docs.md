---
title: Documentation
description: This is the documentation for ZeroLimits.dev projects
---

This is the documentation for the documentation. It's mostly about how to contribute to the documentation.

## Build instructions

1.  ```sh
    git clone https://github.com/noClaps/ZeroLimits.dev.git
    cd ZeroLimits.dev
    ```

2.  ```sh
    npm install

    # Run from the docs directory (ZeroLimits.dev/sites/docs)
    npm run dev

    # Run from the root directory (ZeroLimits.dev/)
    npm run dev:docs
    ```

    Then open `localhost:3000` in your browser to see the live preview of the site.

3.  ```sh
    # Run from the docs directory (ZeroLimits.dev/sites/docs)
    npm run build

    # Run from the root directory (ZeroLimits.dev/)
    npm run build:docs
    ```

    This will build the site and place it in `sites/docs/dist`.

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

The content of the documentation should be clear and concise. It should be split up into the following sections, depending on what the documentation is about:

#### Sites

- Build instructions

  This section should explain how to clone the repo, create a local deployment and build the site that is being worked on. This section only applies if the documentation is for a site.

- Components

  This section should list the components used in the site.

#### Packages

- Installation

  This section should detail how to install the package. This section only applies if the documentation is for a package.


#### Components

- Options

  This section should detail the options and properties of components. This section only applies if the documentation is for a component.

- Code explanation

  This section explains the code of the component. It should go through all parts of the code to explain in detail what each part does. This section only applies if the documentation is for a component, or if an explanation of the code is necessary or helpful to understand how to contribute.

- Usage

  This section should explain how to use the component in the site. Generally, this is just an example usage of the component, including importing it into the page and how to use it.

#### All

- Contributing

  This section should explain what parts of the code are allowed to be changed, and how any future contributers may contribute to that component. If used for a site, this section should explain how contributers can contribute to the site.

- Licenses

  If any licenses other than those listed in the [documentation homepage](/#licenses) are used, then they should be detailed in this section.

## Licenses

[Starlight], the documentation website framework used for this site is licensed under the [MIT license](https://github.com/withastro/starlight/blob/main/LICENSE).
