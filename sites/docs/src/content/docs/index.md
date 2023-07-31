---
title: The Docs-ter
description: This is the documentation for ZeroLimits.dev projects
tableOfContents: false
---

This is the documentation for ZeroLimits.dev projects. These docs explain how each part of the code works, where you are allowed to contribute, and what to do when contributing to each one. Make sure you read these docs before contributing to the project, and keep up to date on them.

## Links
- [Astro docs](https://docs.astro.build)
- [ZeroLimits.dev](https://zerolimits.dev)
- [GitHub](https://github.com/noClaps/ZeroLimits.dev)

## Contributing

You should read the [contributing guidelines](https://github.com/noClaps/ZeroLimits.dev/blob/main/.github/CONTRIBUTING.md) for ZeroLimits.dev before contributing. Knowledge of Markdown, MDX, and basic HTML are recommended if you are writing a post. Knowledge of HTML, CSS, JavaScript, TypeScript (preferred over JavaScript) and Astro are recommended if you are contributing to the site in some other way.

### Changesets

Any contributions made should be added as a changeset. This can be done by running:

```sh
npx changeset
```

in the root directory and following the instructions. In the end, you should have a Markdown (`.md`) file in the `.changeset/` directory in the format:

```md
---
@noclaps/[package or site]: ["patch" | "minor" | "major"]
---

[Your change description here]
```

If you are unsure of what to do, you may leave this and create a pull request anyway. A changeset will be added for you before the pull request is merged.
