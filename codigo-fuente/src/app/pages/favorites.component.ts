import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NewsService } from "../core/news.service";
import { CardComponent } from "../shared/card.component";
@Component({
  selector: "app-favorites",
  imports: [CardComponent, RouterLink],
  template: ` <section class="shell section">
    <span class="eyebrow">TU COLECCIÓN</span>
    <h1 class="page-title">Mis favoritos</h1>
    <p class="lead">Vuelve a las historias que más te interesan.</p>
    <div class="cards">
      @for (story of store.favorites(); track story.id) {
        <app-news-card [news]="story" />
      } @empty {
        @if (!store.loading() && !store.error()) {
          <div class="empty">
            <p>Todavía no has guardado noticias.</p>
            <a class="text-link" routerLink="/noticias">Explorar noticias →</a>
          </div>
        }
      }
    </div>
  </section>`,
})
export class FavoritesComponent {
  readonly store = inject(NewsService);
}
