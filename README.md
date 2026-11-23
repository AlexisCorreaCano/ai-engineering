# AI Engineering: espacio de estudio

Ruta para pasar de Senior Software Engineer a **AI Engineer aplicado**, con un tutor, papers explicados, referentes y una biblioteca de libros y blogs. El contenido de las lecciones viene de [`ai-engineering-from-scratch/`](ai-engineering-from-scratch/) (currículo curado, solo lectura).

## Empezar

Abre una sesión de Claude en esta carpeta y escribe **“Tutor, empecemos”**. El tutor lee la ruta y el progreso, y propone la sesión de hoy.

## Dónde está cada cosa

| Quieres… | Ve a |
|---|---|
| Ver la ruta y marcar lecciones | [ruta/RUTA.md](ruta/RUTA.md) |
| Ver evidencias, errores y repasos | [ruta/PROGRESO.md](ruta/PROGRESO.md) |
| Entender cómo funcionan las sesiones y la rúbrica | [tutor/METODO.md](tutor/METODO.md) |
| Ver quién referenciar por tema | [referentes/REFERENTES.md](referentes/REFERENTES.md) |
| Estudiar un paper con el tutor | [papers/INDEX.md](papers/INDEX.md) · [protocolo](papers/PROTOCOLO.md) |
| Buscar un libro, curso o blog | [recursos/LIBROS.md](recursos/LIBROS.md) · [recursos/BLOGS.md](recursos/BLOGS.md) |
| Escribir un blog de cierre o tomar notas | En tu vault de Obsidian (`alx-brain/ai-engineering/`); plantillas en [tutor/PLANTILLAS.md](tutor/PLANTILLAS.md) |
| Ver tu código (tokenizador BPE, self-attention) | [proyectos/fase-1/](proyectos/fase-1/) |
| Consultar planes anteriores | [archivo/](archivo/) |

## La ruta en una línea

E0 entorno → E1 redes mínimas → **E2 transformers y mini-GPT** → E3 prompts, RAG → E4 evals → E5 agentes y MCP → E6 producción → E7 fine-tuning → E8 seguridad → E9 producto y consultoría → **E10 matemáticas (al final)** → E11 opcionales.

## Mantenimiento

```bash
git -C ai-engineering-from-scratch pull          # actualiza el currículo externo
```

Para cambiar la ruta, edita [ruta/RUTA.md](ruta/RUTA.md) directamente (casillas y orden). Tus notas, notas de papers y blogs viven en el vault de Obsidian, no en este repo.
