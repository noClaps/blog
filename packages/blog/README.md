# The Blog of Random

A blog about the most random things you can think of.

## Build instructions

1.  ```sh
    git clone https://github.com/noClaps/ZeroLimits.dev.git
    cd ZeroLimits.dev
    ```

2.  ```sh
    npm install
    npm run dev:blog
    ```

    Then open `localhost:4321` in your browser to see the live preview of the site.

3.  ```sh
    npm run build:blog
    ```

    This will build the site and place it in `packages/blog/dist/`.

# Writing posts

All posts should go in the `src/content/posts/` directory, and should be in MDX format.

## Frontmatter

Each post should have frontmatter with the following properties:

- `title`: _string_

  The title of the post being written.

- `description`: _string_

  A short description of the post.

- `date`: _ISO date_

  The date on which the post was first published to the blog.

- `lastMod`: _ISO date (Optional)_

  The date on which the post was last modified **after** being published to the blog. The `date` field should not be changed after first publish.

- `author`: _string_

  The name of the author. See [Authors](#authors) for details.

The frontmatter should be in YAML format.

Example:

```md
---
title: "Google: A Misrepresented Evil"
description: Don't be evil, sometimes.
date: 2022-08-12
lastmod: 2022-11-26
author: noClaps
---
```

## Authors

In order to add your author data to the blog, you need to create a `[name].json` file in `src/content/authors/`. This JSON file should have the following data:

- `name`: _string_

  The name under which you want to write the post. This can be your real name, your username, your online identity, etc.

- `link`: _URL_

  A link where people can find more of your work, or anything else you may want to share. This can be a GitHub profile, a social media profile, a personal website, etc.

Example:

```json
{
    "name": "noClaps",
    "link": "https://github.com/noClaps"
}
```

## Content

The content of the post is up to you. However, it should be well-researched, with reputable sources provided for as many claims being made in the post as possible. Any post that is not properly researched, or that does not provide sources for claims made, will be rejected.

If you need ideas for posts, you can check the [Issues tab](https://github.com/noClaps/ZeroLimits.dev/issues?q=is%3Aissue+is%3Aopen+label%3Aidea) of the GitHub repository for ZeroLimits.dev for open issues with the "idea" label. If you have an idea yourself, make sure to open an issue first before working on the post.

The post you write should be in the appropriate section. If none of the current sections are appropriate for the post, then this should be informed in the issue or pull request, and will be resolved as soon as possible.

### Rules

- Heading 1 (`#`) should not be used in the content. All headings should be Heading 2 (`##`) and onward.

- If paragraphs are too long, they should be split up into smaller paragraphs, since it makes the content easier to read when there isn't a big block of text. A good way to judge this is to limit your paragraphs to 4-5 lines in your text editor. Also, try not to use line breaks (`<br />`), and instead use normal Markdown paragraph spacing.

- HTML should be avoided if a Markdown counterpart exists for it. Since the blog uses GitHub Flavored Markdown (GFM), most formatting features should be available. You can see the [GFM spec here](https://github.github.com/gfm/). Using HTML for superscript (`<sup></sup>`) or subscript (`<sub></sub>`) is allowed, as these features are not included in the GFM spec.

- Instead of using regular blockquotes (`>`), the [`Quote` component](#quote) should be used.

- Content inside components should start on a new line. This is due to the way that Astro handles formatting components in MDX.

  ```astro
  <!-- Instead of this: -->
  <Note>My note here</Note>

  <!-- Use this: -->
  <Note>
  My note here
  </Note>
  ```

To help with the layout and structuring of your content, you may also use [components](#components). You may also add a table of contents to help navigate the post, by adding:

```md
## Table of contents
```

Ensure that you do not place any content under the `## Table of contents` heading, as it will not be rendered. You may place the content under a different heading.

```md
## Previous heading

Content can go here

## Table of contents

<!-- Content cannot go here -->

## Next heading

Content can go here
```

The instructions for previewing the site locally are [here](/blog#build-instructions). On creating a PR, a preview deployment of the site will also be available to see the built version of the site.

## Adding files

If you need to add files, such as code, to support your post, you may do so in `public/files/`. This is recommended if you're writing a technical post. Any code you write, you should link the final, completed code as a download with:

```md
<a href="/files/[your-file-name]" download="[your-file-name]">Download the file (example text)</a>
```

# Components

This is the documentation for the components available to use when [writing posts](#writing-posts). You do not need to import these components into the post, they are available to use directly.

---

## `Note`

```astro
<Note title="[note title]">
[note content]
</Note>
```

### Options

- `title`: _string (Optional)_

  The title of the `<Note>`. If no title is provided, then the default title for the `<Note>` component is "NOTE".

---

## `Quote`

```astro
<Quote name="[name of quote]" link="[link to quote source]">
[quote]
</Quote>
```

### Options

- `name`: _string (Optional if no link provided)_

  The name of the source where the quote comes from. This is usually the name of the person, along with some details about them such as their job or qualifications. The name is optional if the `link` is not provided, and if no name is provided, then the default text is "QUOTE".

- `link`: _url (Optional)_

  The link to the source where the quote comes from.

While optional, both `name` and `link` are highly recommended to be provided.

---

## `Warning`

```astro
<Warning title="[warning title]">
[warning content]
</Warning>
```

### Options

- `title`: _string (Optional)_

  The title of the `<Warning>`. If no title is provided, then the default title for the `<Warning>` component is "WARNING".

---