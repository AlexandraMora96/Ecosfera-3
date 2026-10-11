import { Component } from "@angular/core";
/** Icono vectorial decorativo: evita depender de glifos del sistema. */
@Component({
  selector: "app-pin",
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>`,
  styles: [
    `
      :host {
        display: inline-block;
        width: 15px;
        height: 15px;
        vertical-align: middle;
      }
      svg {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class PinComponent {}
