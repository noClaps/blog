class BWarning extends HTMLElement {
	constructor() {
		super()
		this.innerHTML = `
		<p class="warning-heading">
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
		class="lucide lucide-alert-triangle"
		><path
		d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
		></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg
		>
		<b id="title">${this.getAttribute("title") ?? "WARNING"}</b>
		</p>
		${this.innerHTML.trim()}
		`
	}
}

customElements.define("b-warning", BWarning)
