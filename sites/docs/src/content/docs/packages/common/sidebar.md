---
title: Sidebar
---

## Code explanation

### Imports

```astro
---
import { Icon } from "@noclaps/icons";
---
```

This imports the Icon component from the [`icons` package](/packages/icons) to be used in the component.

### Button

```astro
<aside id="aside">
  <button
    onclick="
    document.getElementById('sidebar').classList.toggle('open');
    "
    title="Sidebar"
    type="button"
  >
    <Icon name="sidebar" />
  </button>
</aside>

<script>
  const aside = document.getElementById("aside");
  const sidebar = document.getElementById("sidebar");

  if (aside && sidebar) {
    if (window.matchMedia("(max-width: 768px)").matches) {
      aside.style.display = "initial";
    }

    document.addEventListener("click", function (event) {
      if (
        (event.target as HTMLElement).closest("button") ||
        (event.target as HTMLElement).closest("nav")
      )
        return;
      sidebar.classList.remove("open");
    });
  }
</script>
```

This is a button that adds an `open` class to the sidebar when it is clicked. Clicking anywhere outside of the navigation menu, or clicking on the button again, removes the `open` class, which closes the navigation menu.

### Navigation

```astro
<aside id="aside">
  <nav id="sidebar">
    <slot />
  </nav>
</aside>
```

This is where your navigation goes, usually in the form of a `<Nav />` component.

### Styles

```astro
<style>
  aside {
    display: none;
    z-index: 999;
    position: relative;
  }

  button {
    display: inline-flex;
    background-color: transparent;
    border: none;
    color: var(--text);
    margin: 1vh 1vw;
  }

  /* Sidebar */
  nav {
    display: flex;
    position: absolute;
    right: 0;
    scroll-margin-top: 5rem;
    background-color: var(--bg);
    border: solid 0.125rem var(--variant);
    border-radius: 0.75rem;
    padding: 0.5rem;
    white-space: nowrap;
    margin-right: 1rem;
    margin-top: 0.5rem;
    transition: all 0.25s;
    flex-direction: column;
    gap: 0.5rem;

    &.open {
      visibility: visible;
      transform: translateY(0%);
    }

    &:not(nav.open) {
      visibility: hidden;
      opacity: 0;
      transform: translateY(-10%);
    }
  }
</style>
```

These are the styles of the Sidebar component. Since these styles are included in the component, they are scoped to it. [This is a feature of Astro.](https://docs.astro.build/en/guides/styling/#scoped-styles)

## Usage

First, [install the `common` package](/packages/common/#installation).

Then, you can import it into your files and start using it.

```astro
---
import { Sidebar } from "@noclaps/common";
import Nav from "./Nav.astro";
---

<header>
  <Sidebar>
    <Nav />
  </Sidebar>
</header>
```

## Contributing

This component should only be changed if the script for opening and closing the sidebar can be improved, or if the style of the sidebar is to be updated. The script(s) should be written in TypeScript, and using browser APIs to write your own solution should be preferred over adding external dependencies.
