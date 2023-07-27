---
title: Search
description: The documentation for the search bar in the homepage
---

## Code explanation

### Search function

The search component uses [Fuse.js](https://www.fusejs.io/) for its search algorithm. Fuse.js is a lightweight approximate string-matching (fuzzy search) library that runs on the client. Using fuzzy search in this situation is appropriate as there isn't a lot of data to be searching through, and the homepage is a static site.

```astro
<div id="search">
  <input
    id="searchBar"
    type="search"
    placeholder="Search for anything"
    autofocus
  />
  <ul id="searchResults"></ul>
  <p id="hint"></p>
</div>

<script src="../scripts/fuseSearch.ts"></script>
```

This creates the search bar and results components. The `fuseSearch.ts` script is also imported in the script tag.

```ts
const response = await fetch("/links.json").then(r => r.json())
const links = response["links"] as Links[]
```

This fetches the `links.json` file and stores it as an array of `Links`, which is defined as:

```ts
interface Links {
  url: string;
  favicon: string;
  title: string;
  desc: string;
  tags: string[];
}
```

This follows the [links format defined in the schema](./links).

```ts
const search = document.querySelector("#search") as HTMLDivElement;
const searchBar = document.querySelector("#searchBar") as HTMLInputElement;
const searchResults = document.querySelector("#searchResults") as HTMLUListElement;
```

The elements from the search component are selected using their `id`s.

```ts
searchBar.addEventListener("input", () => {
  const query = searchBar.value;
  const fuse = new Fuse(links, {
    keys: [ "title", "tags", "description" ],
    shouldSort: true,
    threshold: 0.2
  });
  const results = fuse.search(query);
  if (query === "*") {
    showResults(links);
  } else if (results.length > 0) {
    showResults(results.map(result => result.item));
  } else {
    hideResults();
  }
});
```

An event listener on the search bar listens for inputs, and passes the search query through Fuse.js. If the query is `*`, then all links are shown, else the results obtained from Fuse.js are shown. If no results are found, then the results element is hidden.

### Results

The results are generated with the `showResults()` function.

```ts
function showResults(results: Links[]) {
  searchResults.innerHTML = results.map(generateResultsHTML).join("");
  search.setAttribute("show-results", "");
  searchResults.style.visibility = "visible";
  searchResults.style.opacity = "1";
}
```

This function takes in the results in an array of `Links`, and uses the `generateResultsHTML()` function to generate the HTML for the results. It then puts that HTML inside the search results element, and displays it.

```ts
function generateResultsHTML(result: Links) {
  const resultHTML = `<a href=${ result.url } ${ result.title === "Mastodon" ? "rel=me" : "" } target="_blank">
        <div>
            ${ result.favicon.startsWith("https") ? `<img src=${ result.favicon } />` : result.favicon }
            <p>${ result.title }</p>
        </div>
        ${ result.desc ? `<p class="desc">${ result.desc }</p>` : "" }
    </a>`;
  return resultHTML;
}
```

The `generateResultsHTML()` function takes in a `Links` object, and returns some HTML with the link details.

The `hideResults()` function simply hides the search results element.

```ts
function hideResults() {
  searchResults.style.opacity = "0";
  searchResults.style.visibility = "hidden";
  search.removeAttribute("show-results");
}
```

### Hints

Random hints are shown on each page load in order to help those who may not know what to search for. This is done by having an array of hint strings, and using a random number generator to pick an index in the array.

```astro
<script>
  const hints = [
    "Hint: Type * to see all results!",
    "Try searching for my blog!",
    "Say cheese! Check out my photography by searching for it!",
    "Wanna talk? Search for my Matrix!",
    "All my work is open source, check it out by searching for 'GitHub'!",
    "If you wanna see all of my posts, try searching for 'posts'!",
    "Yearning for the ye olden days? Search for 'history'!",
    "In a science-y mood? Try searching for 'science'!",
    "Learn about our digital world by searching for 'tech'!",
    "Like my stuff? Consider donating by searching for 'donate'!",
  ];

  document.getElementById("hint")!.innerHTML =
    hints[Math.floor(Math.random() * hints.length)];
</script>
```

## Contributing

The search function should not be modified without good reason. The hints array may be modified to add new strings, or remove old or irrelevant ones.

## Licenses

[Fuse.js](https://www.fusejs.io), the approximate string-matching library used in the search component, is licensed under the [Apache-2.0 license](https://github.com/krisk/Fuse/blob/main/LICENSE).
