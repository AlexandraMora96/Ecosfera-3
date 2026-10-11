import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/header.component";
import { FooterComponent } from "./shared/footer.component";
import { NewsService } from "./core/news.service";
@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: ` <a class="skip-link" href="#main-content" (click)="skip($event)"
      >Saltar al contenido</a
    >
    <app-header />
    <main id="main-content" tabindex="-1">
      @if (store.loading()) {
        <div class="shell loading" role="status">Cargando historias…</div>
      }
      @if (store.error()) {
        <div class="shell notice" role="alert">
          <p>{{ store.error() }}</p>
          <button class="btn" (click)="store.load()">Reintentar</button>
        </div>
      }
      @if (store.storageError()) {
        <div class="shell notice" role="alert">{{ store.storageError() }}</div>
      }
      <router-outlet />
    </main>
    <app-footer />`,
})
export class AppComponent {
  readonly store = inject(NewsService);
  skip(event: Event): void {
    event.preventDefault();
    document.getElementById("main-content")?.focus();
  }
}
