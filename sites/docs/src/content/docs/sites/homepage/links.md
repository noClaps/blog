---
title: Links
description: The documentation for the links.json file in the homepage
---

## Code explanation

### Link format

```json
{
  "$schema": "./schema.json",
}
```

The schema enforces a format for the links entries to be in. Read more about JSON schema here: [JSON Schema](https://json-schema.org/).

The [`schema.json` file](https://github.com/noClaps/ZeroLimits.dev/blob/main/sites/homepage/public/schema.json) defines the `links` property to be an array of items, with each item having 5 properties:

- `url`: _string_
  
  The URL of link so that clicking on it navigates somewhere. Example:

  ```json
  {
    "url": "https://blog.zerolimits.dev"
  },
  ```

- `favicon`: _string_

  The favicon of the site being linked, or an icon to go along with the link. This can either be a link to the favicon/icon, or an SVG. Example:

  ```json
  {
    // Link
    "favicon": "https://blog.zerolimits.dev/icon/favicon.svg",

    // SVG
    "favicon": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z'></path></svg>"
  }
  ```

- `title`: _string_

  The title or name of the site being linked, or a title to go along with the link. Example:

  ```json
  {
    "title": "The Blog of Random"
  }
  ```

- `desc`: _string (Optional)_

  A short description of the site or link, usually about a sentence or so. Example:

  ```json
  {
    "desc": "A blog about the most random things you can think of, brought to you by the most interesting boring person you've ever met."
  }
  ```

- `tags`: _array_

  This is an array of words that describe your link or site. This can help the user find your site even without knowing its name or description exactly. Only strings are allowed, you must have at least one tag, and all tags must be unique. Example:

  ```json
  {
    "tags": [
      "posts",
      "tech",
      "privacy",
      "security",
      "anonymity"
    ]
  }
  ```

### Example link item

```json
{
  "url": "https://blog.zerolimits.dev/tech/psa/inside-e2ee",
  "favicon": "https://blog.zerolimits.dev/icon/favicon.svg",
  "title": "Inside of E2EE",
  "desc": "Wait... that's illegal",
  "tags": [
    "posts",
    "tech",
    "security"
    ]
}
```

### Links array

```json
{
  "links": [
    // ...
  ]
}
```

This is the array of the link items described above.

## Contributing

The `schema.json` file should not be modified without good reason, and neither should any of the existing links within the `links.json` file. Any new links must be added in the described format, and should be added to the bottom of the `links` array.
