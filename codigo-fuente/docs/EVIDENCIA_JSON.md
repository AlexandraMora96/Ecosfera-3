# Evidencia del renderizado dinámico desde JSON

## Cadena de datos

`public/data/news.json` -> GET `data/news.json` por HttpClient -> validación -> señal base -> señal computada news -> filtro -> @for -> app-news-card -> interpolación / property binding.

## Evidencia ejecutada

1. `evidencias/02_catalogo_json.png`: 15 registros y nueve tarjetas en la primera página con los títulos originales.
2. `evidencias/03_cambio_json.png`: el primer título muestra `EVIDENCIA JSON: título cambiado en el archivo de datos`.
3. `evidencias/resultados-pruebas.json`: respuestas HTTP de JSON, comprobaciones y errores de consola.
4. `tests/flujo-completo.mjs`: prueba que modifica el JSON del build, recarga, comprueba el título y restaura el contenido original.
5. `evidencias/09_error_json.png`: estado de error ante HTTP 503 y recuperación por Reintentar.

## Repetir en el navegador desplegado

1. Abrir el sitio mediante HTTPS.
2. Abrir herramientas de desarrollador > Network/Red, activar Disable cache/Desactivar caché y filtrar `news.json`.
3. Recargar. Debe verse GET 200 a `/Ecosfera_entrega2/data/news.json`; revisar Response/Respuesta con los 15 registros.
4. Comparar id, title, image y summary con las tarjetas y el detalle.
5. Para demostrar un cambio controlado, modificar un título en una copia del JSON de publicación, publicar esa copia y recargar con caché desactivada. Restaurar después el título original.

El nombre de la variable y una captura del JSON por sí solos no prueban el renderizado. La evidencia combina la respuesta HTTP, el código consumidor y el cambio observable en la interfaz.
