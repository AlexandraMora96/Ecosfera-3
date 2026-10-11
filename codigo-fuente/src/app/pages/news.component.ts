import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { NewsService } from "../core/news.service";
import { categoryGroup } from "../core/editorial";
import { CardComponent } from "../shared/card.component";
@Component({
  selector: "app-news",
  imports: [FormsModule, CardComponent],
  templateUrl: "./news.component.html",
})
export class NewsComponent {
  readonly store = inject(NewsService);
  readonly search = signal("");
  readonly category = signal("");
  readonly page = signal(1);
  readonly filters = ["", "Turismo", "Naturaleza", "Ciencia", "Conservación"];
  readonly pageSize = 9;
  private readonly params = toSignal(inject(ActivatedRoute).queryParamMap);
  readonly filtered = computed(() => {
    const term = this.search().trim().toLocaleLowerCase("es");
    return this.store
      .news()
      .filter(
        (n) =>
          (!this.category() || categoryGroup(n) === this.category()) &&
          `${n.title} ${n.summary} ${n.category}`
            .toLocaleLowerCase("es")
            .includes(term),
      );
  });
  readonly totalPages = computed(() =>
    Math.ceil(this.filtered().length / this.pageSize),
  );
  readonly currentPage = computed(() =>
    Math.min(this.page(), Math.max(1, this.totalPages())),
  );
  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );
  readonly visible = computed(() =>
    this.filtered().slice(
      (this.currentPage() - 1) * this.pageSize,
      this.currentPage() * this.pageSize,
    ),
  );
  constructor() {
    effect(() => {
      this.search.set(this.params()?.get("q") ?? "");
      const category = this.params()?.get("categoria") ?? "";
      this.category.set(this.filters.includes(category) ? category : "");
      this.page.set(1);
    });
  }
  setSearch(term: string): void {
    this.search.set(term);
    this.page.set(1);
  }
  setCategory(category: string): void {
    this.category.set(category);
    this.page.set(1);
  }
  goToPage(page: number): void {
    this.page.set(page);
    document
      .querySelector(".catalog-heading")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
