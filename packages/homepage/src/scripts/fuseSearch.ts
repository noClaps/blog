import Fuse from "fuse.js";

interface Links {
  url: string;
  favicon: string;
  title: string;
  desc: string;
  tags: string[];
}

const search = document.querySelector("#search") as HTMLDivElement;
const searchBar = document.querySelector("#searchBar") as HTMLInputElement;
const searchResults = document.querySelector("#searchResults") as HTMLUListElement;

const response = await fetch("/links.json").then(r => r.json());
const links = response[ "links" ] as Links[];

function generateResultsHTML(result: Links) {
  const resultHTML = `<a href=${ result.url } target="_blank">
        <div>
            ${ result.favicon.startsWith("https") ? `<img src=${ result.favicon } />` : result.favicon }
            <p>${ result.title }</p>
        </div>
        ${ result.desc ? `<p class="desc">${ result.desc }</p>` : "" }
    </a>`;
  return resultHTML;
}

function showResults(results: Links[]) {
  searchResults.innerHTML = results.map(generateResultsHTML).join("");
  search.setAttribute("show-results", "");
  searchResults.style.visibility = "visible";
  searchResults.style.opacity = "1";
}

function hideResults() {
  searchResults.style.opacity = "0";
  searchResults.style.visibility = "hidden";
  search.removeAttribute("show-results");
}

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

export { };