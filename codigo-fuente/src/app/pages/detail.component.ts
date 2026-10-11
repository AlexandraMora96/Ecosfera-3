import { Component, computed, inject } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { NewsService } from "../core/news.service";
import { readingTime, categoryGroup } from "../core/editorial";
@Component({
  selector: "app-detail",
  imports: [RouterLink, DatePipe],
  templateUrl: "./detail.component.html",
})
export class DetailComponent {
  readonly store = inject(NewsService);
  readonly minutes = readingTime;
  readonly group = categoryGroup;
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  readonly story = computed(() =>
    this.store.news().find((n) => String(n.id) === this.params()?.get("id")),
  );
  readonly paragraphs = computed(
    () =>
      this.story()
        ?.body.split(/\n\s*\n/)
        .filter(Boolean) ?? [],
  );
  readonly related = computed(() => {
    const current = this.story();
    if (!current) return [];
    const others = this.store.news().filter((n) => n.id !== current.id);
    return [
      ...others.filter((n) => categoryGroup(n) === categoryGroup(current)),
      ...others.filter((n) => categoryGroup(n) !== categoryGroup(current)),
    ].slice(0, 2);
  });
}
