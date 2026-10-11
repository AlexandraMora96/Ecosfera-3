/** Servidor HTTP temporal del build y recorrido completo en Chromium. */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist/ecosfera/browser");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
};
const server = http.createServer(async (request, response) => {
  try {
    const name = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const file = path.resolve(
      root,
      "." + name,
      name.endsWith("/") ? "index.html" : "",
    );
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    const content = await fs.readFile(file);
    response.writeHead(200, {
      "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end("No encontrado");
  }
});
await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));
try {
  await import("./flujo-completo.mjs");
} finally {
  server.close();
}
