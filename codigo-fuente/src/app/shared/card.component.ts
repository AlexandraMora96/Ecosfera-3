import { Component, inject, input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { News } from "../core/news.model";
import { NewsService } from "../core/news.service";
import { categoryGroup } from "../core/editorial";
/** Una tarjeta recibe su noticia desde la colección cargada por HTTP. */
@Component({
  selector: "app-news-card",
  imports: [RouterLink, DatePipe],
  templateUrl: "./card.component.html",
})
export class CardComponent {
  readonly news = input.required<News>();
  readonly store = inject(NewsService);
  readonly group = categoryGroup;
}
