/** Recorrido de la versión completa: mockups 1, JSON, Angular y persistencia.
 * Cambia temporalmente el JSON del build y lo restaura incluso ante un fallo.
 * Reproduce el recorrido con npm run build && npm run test:e2e.
 */
import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
const base = "http://127.0.0.1:4173/";
const output = path.resolve("evidencias");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.ECOSFERA_CHROMIUM_PATH
    ? {
        executablePath: process.env.ECOSFERA_CHROMIUM_PATH,
        args: JSON.parse(process.env.ECOSFERA_CHROMIUM_ARGS ?? "[]"),
      }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const results = [],
  network = [],
  errors = [];
let nav = 0;
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.url().endsWith("/data/news.json"))
    network.push({
      url: r.url(),
      status: r.status(),
      contentType: r.headers()["content-type"],
    });
});
const go = async (route) => {
  await page.goto(base + "?revision=" + ++nav + "#/" + route);
  await expect(page.locator(".loading")).toHaveCount(0);
};
const shot = (name) =>
  page.screenshot({ path: path.join(output, name + ".png"), fullPage: true });
const check = async (name, action) => {
  await action();
  results.push({ prueba: name, resultado: "APROBADA" });
};
const jsonPath = path.resolve("dist/ecosfera/browser/data/news.json");
const original = await fs.readFile(jsonPath, "utf8");
try {
  await check("JSON por HTTP y catálogo inicial", async () => {
    await go("noticias");
    await expect(page.locator(".card")).toHaveCount(9);
    await expect(page.locator("#result-count")).toContainText("15 artículos");
    expect(network.some((n) => n.status === 200)).toBeTruthy();
    await shot("02_catalogo_json");
  });
  await check("Paginación real: nueve y seis noticias", async () => {
    await page
      .getByRole("button", { name: "Página siguiente", exact: true })
      .click();
    await expect(page.locator(".card")).toHaveCount(6);
    await expect(
      page.getByRole("button", { name: "Página 2", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await shot("11_paginacion");
    await page
      .getByRole("button", { name: "Página anterior", exact: true })
      .click();
    await expect(page.locator(".card")).toHaveCount(9);
  });
  await check("Título modificado únicamente en JSON", async () => {
    const data = JSON.parse(original);
    data[0].title = "EVIDENCIA JSON: título cambiado en el archivo de datos";
    await fs.writeFile(jsonPath, JSON.stringify(data));
    await page.reload();
    await expect(page.locator(".card h3").first()).toHaveText(data[0].title);
    await shot("03_cambio_json");
    await fs.writeFile(jsonPath, original);
    await page.reload();
  });
  await check("Filtros por botones editoriales", async () => {
    await page.getByRole("button", { name: "Ciencia", exact: true }).click();
    await expect(page.locator(".card")).toHaveCount(3);
    await page.getByRole("button", { name: "Turismo", exact: true }).click();
    await expect(page.locator(".card")).toHaveCount(4);
    await expect(page.locator(".pagination")).toHaveCount(0);
    await page.getByRole("button", { name: "Todas", exact: true }).click();
  });
  await check("Búsqueda y estado vacío", async () => {
    await page.locator("#search").fill("coral");
    await expect(page.locator(".card")).toHaveCount(1);
    await page.locator("#search").fill("zzzzzz");
    await expect(page.locator(".empty")).toBeVisible();
  });
  await check("Buscador general de la cabecera", async () => {
    await go("");
    await page.locator("#global-search").fill("Patagonia");
    await page.locator("#global-search").press("Enter");
    await expect(page.locator(".card")).toHaveCount(1);
    await expect(page.locator("#search")).toHaveValue("Patagonia");
  });
  await check(
    "Portada según el mockup: autor, fecha, lectura e imagen",
    async () => {
      await go("");
      await expect(page.locator(".hero-copy h1")).toContainText(
        "Expedición al Ártico",
      );
      await expect(page.locator(".byline")).toContainText("8 min de lectura");
      await expect(page.locator(".hero-art figcaption")).toContainText(
        "Ártico",
      );
      await expect(page.locator(".cards .card")).toHaveCount(3);
      await shot("01_inicio");
    },
  );
  await check("Pie editorial con dirección, correo y teléfono", async () => {
    await expect(page.locator("footer")).toContainText("Bogotá, Colombia");
    await expect(
      page.locator('footer a[href="mailto:redaccion@ecosfera.co"]'),
    ).toBeVisible();
    await expect(
      page.locator('footer a[href="tel:+573028562890"]'),
    ).toBeVisible();
  });
  await check(
    "Detalle con ruta, pie de imagen y lectura por párrafos",
    async () => {
      await go("noticia/1");
      await expect(page.locator(".breadcrumbs")).toContainText("Inicio");
      await expect(page.locator(".article-body>p")).toHaveCount(4);
      await expect(page.locator(".article-image figcaption")).toContainText(
        "OpenAI",
      );
      await expect(page.locator("blockquote")).toBeVisible();
      await shot("04_detalle");
    },
  );
  await check("Dos artículos relacionados navegables", async () => {
    await expect(page.locator(".related-card")).toHaveCount(2);
    await page.locator(".related-card").first().click();
    await expect(page.locator(".article h1")).not.toContainText(
      "Expedición al Ártico",
    );
  });
  await check("Favoritos conservados al recargar y contador", async () => {
    await go("noticia/1");
    await page.locator(".article-toolbar .fav-button").click();
    await expect(page.locator("#fav-count")).toHaveText("1");
    await go("favoritos");
    await expect(page.locator(".card")).toHaveCount(1);
    await page.reload();
    await expect(page.locator(".card")).toHaveCount(1);
    await shot("05_favoritos");
    await page.locator(".favorite-overlay").click();
    await expect(page.locator("#fav-count")).toHaveText("0");
  });
  await check("Contacto: canales, horarios y convocatoria", async () => {
    await go("contacto");
    await expect(page.locator(".contact-information")).toContainText(
      "Horario editorial",
    );
    await expect(page.locator(".collaboration")).toContainText(
      "fotógrafos independientes",
    );
    await expect(page.locator("#contact-subject")).toHaveJSProperty(
      "tagName",
      "SELECT",
    );
    await shot("12_contacto_completo");
  });
  await check("Validaciones de contacto y confirmación", async () => {
    await page
      .getByRole("button", { name: "Enviar mensaje", exact: true })
      .click();
    await expect(page.locator(".field-error")).toHaveCount(4);
    await page.locator("#contact-name").fill("Alexandra Mora");
    await page.locator("#contact-email").fill("correo-invalido");
    await page
      .locator("#contact-subject")
      .selectOption({ label: "Propuestas editoriales" });
    await page
      .locator("#contact-message")
      .fill("Quiero compartir una historia sobre conservación comunitaria.");
    await page
      .getByRole("button", { name: "Enviar mensaje", exact: true })
      .click();
    await expect(page.locator(".field-error")).toHaveCount(1);
    await shot("06_validacion_contacto");
    await page.locator("#contact-email").fill("alexandra@example.com");
    await page
      .getByRole("button", { name: "Enviar mensaje", exact: true })
      .click();
    await expect(page.locator(".form-message")).toContainText(
      "Gracias por escribirnos",
    );
    await shot("07_contacto_confirmacion");
  });
  await check("Newsletter: correo válido y confirmación", async () => {
    await go("");
    await page.getByRole("button", { name: "Suscribirme" }).click();
    await expect(page.locator(".field-error")).toBeVisible();
    await page.locator("#newsletter-email").fill("alexandra@example.com");
    await page.getByRole("button", { name: "Suscribirme" }).click();
    await expect(page.locator(".form-message")).toContainText(
      "Gracias por tu interés",
    );
  });
  await check("Creación de noticia y persistencia", async () => {
    await go("gestion");
    await page
      .getByRole("button", { name: "Crear noticia", exact: true })
      .click();
    await expect(page.locator(".field-error")).toBeVisible();
    await page
      .locator("#news-title")
      .fill("Nueva historia de conservación comunitaria");
    await page.locator("#news-author").fill("Alexandra Mora");
    await page
      .locator("#news-summary")
      .fill("La comunidad organiza una jornada para cuidar su bosque.");
    await page
      .locator("#news-body")
      .fill(
        "Vecinos y visitantes participan en una jornada de restauración con plantas nativas y actividades educativas.",
      );
    await page
      .getByRole("button", { name: "Crear noticia", exact: true })
      .click();
    await expect(page.locator(".managed-item")).toHaveCount(16);
    await shot("08_gestion");
    await go("noticias");
    await expect(page.locator(".card h3").first()).toHaveText(
      "Nueva historia de conservación comunitaria",
    );
  });
  await check("Eliminación de noticia nueva y de noticia inicial", async () => {
    page.on("dialog", (d) => d.accept());
    await go("gestion");
    await page
      .getByRole("button", {
        name: "Eliminar: Nueva historia de conservación comunitaria",
        exact: true,
      })
      .click();
    await expect(page.locator(".managed-item")).toHaveCount(15);
    await page
      .getByRole("button", {
        name: "Eliminar: Expedición al Ártico: lo que el hielo le dice al futuro del planeta",
        exact: true,
      })
      .click();
    await page.reload();
    await expect(page.locator(".managed-item")).toHaveCount(14);
  });
  await check("Restauración de noticias eliminadas", async () => {
    await page.getByRole("button", { name: "Restaurar eliminadas" }).click();
    await expect(page.locator(".managed-item")).toHaveCount(16);
  });
  await check("Noticia inexistente", async () => {
    await go("noticia/no-existe");
    await expect(page.locator("h1")).toHaveText("Noticia no disponible");
  });
  await check("Error HTTP y reintento sin respaldo en JavaScript", async () => {
    await page.route("**/data/news.json", (route) =>
      route.fulfill({ status: 503, body: "No disponible" }),
    );
    await go("noticias");
    await expect(page.getByRole("alert")).toContainText("No pudimos cargar");
    await shot("09_error_json");
    await page.unroute("**/data/news.json");
    await page.getByRole("button", { name: "Reintentar" }).click();
    await expect(page.locator("#result-count")).toContainText("16 artículos");
  });
  await check("JSON estructuralmente inválido", async () => {
    await page.route("**/data/news.json", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '[{"id":1}]',
      }),
    );
    await page.reload();
    await expect(page.getByRole("alert")).toContainText("formato inválido");
    await page.unroute("**/data/news.json");
  });
  await check("Almacenamiento corrupto no bloquea el catálogo", async () => {
    await page.evaluate(() => {
      localStorage.setItem("ecosfera-favorites-v1", "corrupto");
      localStorage.removeItem("ecosfera-custom-news-v1");
      localStorage.removeItem("ecosfera-deleted-news-v3");
    });
    await go("noticias");
    await expect(page.locator("#result-count")).toContainText("15 artículos");
    await expect(page.locator("#fav-count")).toHaveText("0");
  });
  await check(
    "Vista móvil: menú, filtros y ausencia de desbordamiento",
    async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await go("");
      await page.getByRole("button", { name: "Abrir o cerrar menú" }).click();
      await page
        .locator("#main-nav")
        .getByRole("link", { name: "Noticias", exact: true })
        .click();
      await expect(page.locator(".card")).toHaveCount(9);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await shot("10_movil");
    },
  );
  await check(
    "Consola sin errores JavaScript e imágenes disponibles",
    async () => {
      expect(errors).toEqual([]);
      await expect(page.locator(".card img").first()).toHaveJSProperty(
        "complete",
        true,
      );
      expect(
        await page
          .locator(".card img")
          .first()
          .evaluate((img) => img.naturalWidth),
      ).toBeGreaterThan(0);
    },
  );
  await fs.writeFile(
    path.join(output, "resultados-pruebas.json"),
    JSON.stringify(
      {
        fecha: new Date().toISOString(),
        navegador: "Chromium",
        url: base,
        version: "Entrega 3 completa según los cuatro mockups",
        pruebas: results,
        solicitudesJSON: network,
        erroresJavaScript: errors,
      },
      null,
      2,
    ),
  );
  console.log(`${results.length} pruebas aprobadas.`);
} finally {
  await fs.writeFile(jsonPath, original);
  await context.close();
  await browser.close();
}
