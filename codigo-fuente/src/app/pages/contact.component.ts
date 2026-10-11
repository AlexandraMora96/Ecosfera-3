import { PinComponent } from "../shared/pin.component";
import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
@Component({
  selector: "app-contact",
  imports: [PinComponent, FormsModule, RouterLink],
  templateUrl: "./contact.component.html",
})
export class ContactComponent {
  data = { name: "", email: "", subject: "", message: "" };
  readonly confirmation = signal("");
  submit(form: NgForm): void {
    if (
      form.invalid ||
      Object.values(this.data).some((value) => !value.trim())
    ) {
      form.control.markAllAsTouched();
      this.confirmation.set(
        "Completa todos los campos con información válida.",
      );
      return;
    }
    this.confirmation.set(
      "Gracias por escribirnos y compartir tus ideas con Ecosfera.",
    );
    form.resetForm();
  }
}
