import { News } from "./news.model";
/** Categorías editoriales de los mockups, compatibles con el catálogo anterior. */
export function categoryGroup(item: News): string {
  const name = item.category.toLocaleLowerCase("es");
  if (name.includes("turismo")) return "Turismo";
  if (name.includes("ciencia")) return "Ciencia";
  if (name.includes("conservación") || name.includes("medio ambiente"))
    return "Conservación";
  return "Naturaleza";
}
export function readingTime(item: News): number {
  return (
    item.readingTime ??
    Math.max(1, Math.ceil(item.body.split(/\s+/).length / 200))
  );
}
