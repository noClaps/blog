class BQuote extends HTMLElement {
  constructor() {
    super();

    const href = this.getAttribute("href");
    const title = this.getAttribute("title") ?? "QUOTE";

    this.innerHTML = `
<p class="quote-heading">
<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-message-square"
      ><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      ></path></svg
    >
	${
    href
      ? `
			<b>
          <a href=${href} target="_blank" rel="noopener noreferrer">${title}</a>
        </b>
			`
      : `<b>${title}</b>`
  }
	</p>
	${this.innerHTML.trim()}
		`;
  }
}

customElements.define("b-quote", BQuote);
