---
title: Components
description: The documentation for the components available when writing posts
---

This is the documentation for the components available to use when [writing posts](/sites/blog/posts). You do not need to import these components into the post, they are available to use directly.

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
