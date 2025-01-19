import { html } from "../scripts/utils.ts";

class EditButton extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = html`<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-pencil"
      >
        <path
          d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
        />
        <path d="m15 5 4 4" />
      </svg>
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
        class="lucide lucide-eye"
      >
        <path
          d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span class="text">Edit content</span>`;
    this.innerHTML += html`<style>
      main {
        textarea {
          font-size: 1rem;
          font-family: var(--mono);
          width: 100%;
          height: 87.5dvh;
          resize: none;
        }
      }

      edit-button {
        background-color: var(--primary);
        display: flex;
        gap: 0.25rem;
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.5rem;
        justify-content: center;
        align-items: center;

        svg {
          height: 1rem;
        }

        .lucide-pencil {
          display: block;
        }

        .lucide-eye {
          display: none;
        }

        &.view {
          .lucide-pencil {
            display: none;
          }

          .lucide-eye {
            display: block;
          }
        }
      }
    </style>`;

    this.addEventListener("click", async () => this.handleClick());
  }

  async handleClick() {
    const text = this.querySelector<HTMLSpanElement>(".text")!;
    const article = document.querySelector("main")!;
    const path = location.pathname;

    if (this.classList.toggle("view")) {
      text.innerText = "Show preview";
      const textContent = await fetch(`/edit${path}`).then((r) => r.text());
      article.innerHTML = `<textarea>${textContent}</textarea>`;
    } else {
      text.innerText = "Edit content";
      const inputElem = article.querySelector("textarea")!;
      const renderedContent = await fetch(`/render${path}`, {
        method: "POST",
        body: inputElem.value,
      }).then((r) => r.text());
      article.innerHTML = renderedContent;
    }
  }
}

customElements.define("edit-button", EditButton);
