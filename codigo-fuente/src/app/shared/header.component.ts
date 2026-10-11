import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NewsService } from "../core/news.service";
@Component({
  selector: "app-header",
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  readonly store = inject(NewsService);
  private readonly router = inject(Router);
  readonly open = signal(false);
  term = "";
  search(): void {
    this.router.navigate(["/noticias"], {
      queryParams: { q: this.term.trim() || null },
    });
    this.open.set(false);
  }
}
