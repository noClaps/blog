interface Links {
  url: string;
  favicon: string;
  title: string;
  desc: string;
  tags: string[];
}

const searchBar = document.getElementById("searchBar") as HTMLInputElement;
searchBar.addEventListener("input", search);

// Fetch links from links.json file and create array of links.
const response = await fetch("/links.json").then((r) => r.json());
const links = response["links"] as Links[];
const resultsList = document.getElementById(
  "searchResults"
) as HTMLUListElement; // Results box

async function search() {
  let indices = [] as Links[];
  const query = searchBar.value.toLowerCase(); // Search query in lowercase, to make search case-insensitive

  // This clears the results list every time you press in a character, effectively refreshing with every update to the query.
  resultsList.replaceChildren("");

  // Find closest instance of query and give it priority,
  // eg. if query is "g", results like "GitHub" will have a higher position than "The Blog of Random",
  // since "GitHub" matches the query more than "The Blog of Random"
  function findTitles() {
    const titles = [] as Array<Array<number>>;
    links.forEach(
      (link, i) =>
        link.title.toLowerCase().indexOf(query) > -1 &&
        titles.push([i, link.title.toLowerCase().indexOf(query)])
    );
    titles.sort((a, b) => a[1] - b[1]);
    return titles;
  }

  // Goes through tags and finds if any value inside the tags matches the search query.
  // The tags with higher positions for each get stored in a higher index in the final tags list,
  // eg. "The Blog of Random" would have a lower position for the "posts" tag than "Messengers",
  // since TBoR has a lower priority for the "posts" tag (see links.json).
  function findTags() {
    const tags = [] as Array<Array<number>>;
    links.forEach((link, i) =>
      link.tags.forEach(
        (tag, j) => tag.indexOf(query) > -1 && tags.push([i, j])
      )
    );
    tags.sort((a, b) => a[1] - b[1]);
    return tags;
  }

  // Goes through descriptions and finds if any description matches the search query.
  // A more accurate search will yield a higher position in results,
  // eg. searching for "history" will give a higher result to the description
  // "The long and quite strange history of toilet paper" than to
  // "The simplest hardest problem in math history" since the word "history" shows up earlier in the former.
  function findDesc() {
    const descs = [] as Array<Array<number>>;
    links.forEach(
      (link, i) =>
        link.desc &&
        link.desc.toLowerCase().indexOf(query) > -1 &&
        descs.push([i, link.desc.toLowerCase().indexOf(query)])
    );
    descs.sort((a, b) => a[1] - b[1]);
    return descs;
  }

  if (query.replace(/\s+/g, "") === "") {
    // If query is empty, clear results
    resultsList.style.display = "none";
  } else if (query === "*") {
    indices = links;
  } else {
    // This block orders content appropriately such that
    // titles have first priority, tags have second, and descriptions come last,
    // eg. if query is "p", titles with "p" in them like "Aperturic Focus"
    // should show up before results that have tags like "post"

    for (const title of findTitles()) {
      // Skips the result if it's already been covered
      !indices.includes(links[title[0]]) && indices.push(links[title[0]]);
    }

    for (let tag of findTags()) {
      !indices.includes(links[tag[0]]) && indices.push(links[tag[0]]);
    }

    for (let desc of findDesc()) {
      !indices.includes(links[desc[0]]) && indices.push(links[desc[0]]);
    }
  }

  // If there are no results, hide results container.
  // Don't run the results creation code if its not needed.
  if (indices.length === 0) {
    resultsList.style.display = "none";
  } else {
    for (let index of indices) {
      // Create an element <a href=url><div><img src=favicon><p>title</p></div><p class="desc">desc</p></a> for each result
      const result = document.createElement("a");
      result.href = index.url;
      result.target = "_blank";
      result.innerHTML = `
                    <div>
                        ${
                          index.favicon.startsWith("https")
                            ? `<img src=${index.favicon} />`
                            : index.favicon
                        }
                        <p>${index.title}</p>
                    </div>
                    ${index.desc ? `<p class="desc">${index.desc}</p>` : ""}
            `;

      resultsList.append(result);
      resultsList.style.display = "flex";
    }
  }
}
