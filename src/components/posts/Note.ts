class BNote extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
<p class="note-heading">
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
      class="lucide lucide-sticky-note"
      ><path
        d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"
      ></path><path d="M15 3v6h6"></path></svg
    >
    <b>${this.getAttribute("title") ?? "NOTE"}</b>
  </p>
  ${this.innerHTML.trim()}
		`;
  }
}

customElements.define("b-note", BNote);
