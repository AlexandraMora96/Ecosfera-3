# Correspondencia con la entrega 1

Fuente: Entregable_1_Ecosfera.docx.pdf, proporcionado por Alexandra Mora Cuellar. Se incluye completo en docs/Entregable_1_Completo.pdf.

| Vista y páginas | Implementación |
|---|---|
| Inicio, pp. 2-5 | Encabezado con buscador y favoritos, noticia principal con categoría, resumen, autor, fecha y lectura, imagen con ubicación, tres destacados, newsletter y pie editorial. |
| Catálogo, pp. 6-8 | Categorías Todas/Turismo/Naturaleza/Ciencia/Conservación, buscador, tarjetas con corazón sobre la imagen y paginación real. |
| Detalle, pp. 9-11 | Breadcrumbs, autor, fecha, minutos de lectura, favoritos, imagen y crédito, varios párrafos, cita editorial y dos relacionados navegables. |
| Contacto, pp. 12-13 | Título centrado, formulario a la izquierda, asunto desplegable, canales y horarios a la derecha, convocatoria y pie. |

Se conservan las seis imágenes editoriales asociadas a las noticias de la entrega 2 y se incorporan nueve imágenes de las tarjetas de los mockups. El catálogo tiene 15 registros: 9 por página y 6 en la siguiente. Los cinco números decorativos del mockup no se convierten en páginas vacías: la cantidad de páginas se calcula a partir del catálogo y cambia al crear o eliminar noticias.

Las nueve noticias del catálogo original se incorporan como contenido académico y no como información periodística verificada. Las imágenes de estas nueve tarjetas se extraen de la maquetación aportada; su crédito se identifica en public/images/CREDITOS.md. Los seis recursos generados con OpenAI mantienen su procedencia.

La implementación conserva Angular, HttpClient y JSON como fuente inicial única, favoritos, validaciones y mini CRUD. La aplicación incorpora además Favoritos y Gestión con el mismo lenguaje visual.
