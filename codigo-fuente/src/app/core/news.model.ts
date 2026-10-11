/** Contrato de cada noticia del JSON y de las noticias creadas. */
export interface News {
  id: string | number;
  title: string;
  category: string;
  summary: string;
  body: string;
  author: string;
  date: string;
  image: string;
  featured: boolean;
  readingTime?: number;
  location?: string;
  caption?: string;
  quote?: string;
  quoteAuthor?: string;
}
export type NewsDraft = Pick<
  News,
  "title" | "category" | "summary" | "body" | "author" | "image"
>;
/** HttpClient no valida estructuras: se comprueban también en ejecución. */
export function isNews(value: unknown): value is News {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const fields = [
    "title",
    "category",
    "summary",
    "body",
    "author",
    "date",
    "image",
  ];
  return (
    (typeof item["id"] === "number" || typeof item["id"] === "string") &&
    fields.every(
      (key) => typeof item[key] === "string" && !!(item[key] as string).trim(),
    ) &&
    typeof item["featured"] === "boolean" &&
    /^images\/(?:noticia-[1-6]|mockup-(?:[7-9]|1[0-5]))\.png$/.test(
      String(item["image"]),
    ) &&
    /^\d{4}-\d{2}-\d{2}$/.test(String(item["date"]))
  );
}
