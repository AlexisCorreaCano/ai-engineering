# Protocolo para estudiar papers

El tutor **explica el paper contigo**. Leer solo no cuenta, y citar un paper no equivale a haberlo entendido.

## Estados de lectura

`pendiente` → `citado, no leído` → `revisado` → `leído` → `releído`

Solo se sube de estado con evidencia (explicación propia o experimento). El estado vive en [INDEX.md](INDEX.md).

## Sesión de paper (45-75 min)

**Antes (5-10 min)**
1. **Claim:** ¿qué afirma el paper? Una frase.
2. **Punto de entrada:** ¿qué ya sabes que lo sostiene? (lección de la ruta relacionada)
3. **Predicción:** ¿qué esperas encontrar en método y resultados?

**Durante (30-45 min)**
Orden de lectura: abstract → introducción → figuras y tablas → método → resultados → limitaciones.
- El tutor explica cada sección con lenguaje directo, desglosa las ecuaciones paso a paso y conecta con el código de la lección.
- Tras cada bloque importante, **tú resumes en tus palabras**. No hay una pregunta por párrafo.
- Se distingue lo que el paper **demuestra** de lo que **supone** o **sugiere**.

**Después (10-15 min)**
1. Mecanismo central en **una frase**.
2. Evidencia a favor y críticas conocidas.
3. Qué queda abierto y qué cambió desde que se publicó.
4. Conexión con tu build (mini-GPT, RAG, agente…) y **un mini-experimento** para comprobarlo.
5. Una pregunta de transferencia a un caso nuevo.

## Notas por paper

Guarda la nota en tu vault de Obsidian, en `ai-engineering/papers/<id>.md` (plantilla en [../tutor/PLANTILLAS.md](../tutor/PLANTILLAS.md)). Contenido:

- Estado, fecha, claim, mecanismo central, evidencia y límites, relación con tu build, mini-experimento y pregunta abierta.

## Criterios de calidad

- Verifica autoría, fecha, versión (arXiv v1 vs última), si pasó revisión por pares y posibles intereses comerciales.
- Contrasta con una explicación de un referente ([../referentes/REFERENTES.md](../referentes/REFERENTES.md)) y con el código real.
- No reproduzcas el paper en tus notas: resume con tus palabras.
