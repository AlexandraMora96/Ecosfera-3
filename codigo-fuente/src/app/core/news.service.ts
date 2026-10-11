import { computed, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isNews, News, NewsDraft } from "./news.model";

/** Única fuente inicial: public/data/news.json. No hay copia en JavaScript. */
@Injectable({ providedIn: "root" })
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly base = signal<News[]>([]);
  private readonly custom = signal<News[]>(
    this.read("ecosfera-custom-news-v1").filter(isNews),
  );
  private readonly deleted = signal<string[]>(
    this.read("ecosfera-deleted-news-v3").map(String),
  );
  private readonly saved = signal<string[]>(
    this.read("ecosfera-favorites-v1").map(String),
  );
  readonly loading = signal(true);
  readonly error = signal("");
  readonly storageError = signal("");
  readonly news = computed(() =>
    [...this.custom(), ...this.base()].filter(
      (item) => !this.deleted().includes(String(item.id)),
    ),
  );
  readonly favorites = computed(() =>
    this.news().filter((item) => this.isFavorite(item.id)),
  );
  readonly categories = computed(() =>
    [...new Set(this.news().map((item) => item.category))].sort(),
  );
  readonly featured = computed(() =>
    this.news()
      .filter((item) => item.featured)
      .slice(0, 3),
  );

  constructor() {
    this.load();
  }

  /** GET real por HTTP; valida el arreglo y actualiza las señales compartidas. */
  load(): void {
    this.loading.set(true);
    this.error.set("");
    this.http.get<unknown>("data/news.json").subscribe({
      next: (data) => {
        if (
          !Array.isArray(data) ||
          !data.every(isNews) ||
          new Set(data.map((item) => String(item.id))).size !== data.length
        ) {
          this.fail("El archivo de noticias tiene un formato inválido.");
          return;
        }
        this.base.set(data);
        this.loading.set(false);
      },
      error: () =>
        this.fail("No pudimos cargar las noticias. Intenta de nuevo."),
    });
  }

  private fail(message: string): void {
    this.base.set([]);
    this.error.set(message);
    this.loading.set(false);
  }
  isFavorite(id: News["id"]): boolean {
    return this.saved().includes(String(id));
  }
  toggleFavorite(id: News["id"]): void {
    const key = String(id);
    const next = this.isFavorite(id)
      ? this.saved().filter((item) => item !== key)
      : [...this.saved(), key];
    if (this.write("ecosfera-favorites-v1", next)) this.saved.set(next);
  }
  /** Nuevas noticias y eliminaciones se conservan al recargar el navegador. */
  create(draft: NewsDraft): boolean {
    const item: News = {
      ...draft,
      id: `local-${crypto.randomUUID()}`,
      date: new Date().toISOString().slice(0, 10),
      featured: false,
    };
    if (!isNews(item)) return false;
    const next = [item, ...this.custom()];
    if (!this.write("ecosfera-custom-news-v1", next)) return false;
    this.custom.set(next);
    return true;
  }
  remove(id: News["id"]): boolean {
    const next = [...new Set([...this.deleted(), String(id)])];
    if (!this.write("ecosfera-deleted-news-v3", next)) return false;
    this.deleted.set(next);
    // Los favoritos se derivan del catálogo visible: una eliminada deja de contarse.
    return true;
  }
  restore(): void {
    if (this.write("ecosfera-deleted-news-v3", [])) this.deleted.set([]);
  }
  private read(key: string): unknown[] {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }
  private write(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.storageError.set("");
      return true;
    } catch {
      this.storageError.set(
        "No pudimos guardar los cambios. Revisa el almacenamiento del navegador.",
      );
      return false;
    }
  }
}
