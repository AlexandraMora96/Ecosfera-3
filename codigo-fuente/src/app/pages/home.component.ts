import { PinComponent } from "../shared/pin.component";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { NewsService } from "../core/news.service";
import { readingTime } from "../core/editorial";
import { CardComponent } from "../shared/card.component";
@Component({
  selector: "app-home",
  imports: [PinComponent, RouterLink, CardComponent, FormsModule, DatePipe],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  readonly store = inject(NewsService);
  readonly minutes = readingTime;
  readonly principal = computed(
    () => this.store.news().find((n) => n.id === 1) ?? this.store.featured()[0],
  );
  readonly secondary = computed(() =>
    this.store
      .news()
      .filter((n) => n.featured && n.id !== this.principal()?.id)
      .slice(0, 3),
  );
  email = "";
  readonly message = signal("");
  subscribe(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.message.set("Gracias por tu interés en Ecosfera.");
    form.resetForm();
  }
}
