import { Component, inject, signal } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NewsService } from "../core/news.service";
import { NewsDraft } from "../core/news.model";
@Component({
  selector: "app-manage",
  imports: [FormsModule, RouterLink],
  templateUrl: "./manage.component.html",
})
export class ManageComponent {
  readonly store = inject(NewsService);
  readonly message = signal("");
  readonly categories = [
    "Ciencia y biodiversidad",
    "Turismo sostenible",
    "Biodiversidad",
    "Medio ambiente",
    "Vida sostenible",
  ];
  draft: NewsDraft = this.empty();
  private empty(): NewsDraft {
    return {
      title: "",
      category: "Medio ambiente",
      summary: "",
      body: "",
      author: "",
      image: "images/noticia-4.png",
    };
  }
  create(form: NgForm): void {
    const clean = Object.fromEntries(
      Object.entries(this.draft).map(([key, value]) => [key, value.trim()]),
    ) as unknown as NewsDraft;
    if (form.invalid || Object.values(clean).some((value) => !value)) {
      form.control.markAllAsTouched();
      this.message.set("Completa todos los campos con información válida.");
      return;
    }
    if (this.store.create(clean)) {
      this.draft = this.empty();
      form.resetForm(this.draft);
      this.message.set(
        "Noticia creada correctamente. Ya aparece en el listado.",
      );
    }
  }
  remove(id: string | number): void {
    if (
      confirm("¿Eliminar esta noticia del catálogo?") &&
      this.store.remove(id)
    )
      this.message.set("Noticia eliminada correctamente.");
  }
}
