# Plan final de estudio — AI Engineering

> **Objetivo:** convertirte en AI Engineer aplicado, con capacidad de crecer hacia Staff Engineer y consultoría de IA.  
> **Documento canónico:** este plan toma como **base la estructura, el énfasis técnico y el método paper → build de `PLAN.md`**. `PLAN.md` y `ROADMAP-TUTOR.md` quedan intactos como antecedentes, no como planes paralelos.  
> **Referencia externa:** [AI Engineer de roadmap.sh](https://roadmap.sh/ai-engineer) y su [mapa detallado en PDF](https://roadmap.sh/pdfs/roadmaps/ai-engineer.pdf), consultados el 2026-10-10. Sus temas están integrados en las diez fases; la tabla de cobertura al final permite comprobarlo. Los nombres de productos del mapa son ejemplos, no requisitos permanentes.

---

## Perfil y meta

| Aspecto | Punto de partida para planificar |
|---|---|
| Experiencia | Senior Software Engineer; aprovechar arquitectura, pruebas y operación sin asumir dominio de ML |
| Meta | Trabajar profesionalmente como AI Engineer; desarrollar criterio de Staff y comunicación de consultor |
| Tiempo disponible de referencia | 5–8 horas por semana; confirmar y ajustar al ejecutarlo |
| Equipo | Mac M2 Pro; Windows i7 sin GPU dedicada para código; cloud solo cuando un experimento lo justifique |
| Horizonte inicial | Diez fases: 44 semanas de trabajo estimado + 6 de buffer. **No es promesa de dominio en 50 semanas**: se alarga si la evidencia o la disponibilidad lo requieren |

### Qué vas a estudiar, antes de entrar en los temas

Un **AI Engineer aplicado** convierte capacidades de modelos existentes en productos útiles: identifica el problema, decide si la IA aporta valor, integra modelos y datos, evalúa respuestas, protege usuarios, controla costes y mantiene el sistema en producción. En un **ML Engineer** suele pesar más la construcción de pipelines y el entrenamiento/serving de modelos; en investigación, crear conocimiento o modelos nuevos. Los límites entre roles cambian según la empresa. [roadmap.sh](https://roadmap.sh/ai-engineer) enfatiza precisamente el uso práctico de modelos preentrenados.

Conviene distinguir **AI**, **ML**, **deep learning**, **IA generativa**, **LLM** y **AGI** antes de empezar: no son sinónimos. Esta ruta profundiza en LLMs y aplicaciones modernas, pero también cubre datos, evaluación y fundamentos de ML/DL suficientes para comprender sus límites. No busca formar un investigador de modelos frontera. La experiencia previa en frontend, backend o full-stack es una entrada válida: la parte nueva está en sistemas probabilísticos, datos y evaluación, no en volver a aprender ingeniería de software desde cero.

**Al terminar deberías poder:** formular un caso de uso y un baseline no-IA; elegir y justificar modelo abierto o propietario; construir aplicaciones con prompts, tools, embeddings, RAG o agentes; medir calidad, latencia y coste; operar con observabilidad, privacidad y seguridad; y explicar decisiones técnicas a clientes y equipos.

**No es objetivo obligatorio:** entrenar un LLM grande desde cero, investigar arquitecturas nuevas, aprender todos los proveedores del mercado ni dominar hardware especializado. Sí construirás un **mini-GPT didáctico** para entender tokenización, atención, entrenamiento e inferencia. ML clásico, estadística y datos se estudian **en la profundidad que exijan las decisiones y retos**; un diagnóstico evita repetir lo que ya sabes.

---

## Disciplina de fuentes primarias y voces referentes

Para cada tema importante, seleccionar **1–3 fuentes** pertinentes: paper original cuando explique el mecanismo; documentación oficial para una API o herramienta; y una explicación crítica de una voz referente cuando facilite el aprendizaje. No leer papers como ritual ni tratar blogs, páginas web o este plan como instrucciones infalibles. Verificar autoría, fecha, evidencia, limitaciones y posibles intereses comerciales.

**Protocolo de lectura:**

1. **Antes:** ¿qué afirma la fuente?, ¿qué espero encontrar?, ¿cómo se relaciona con lo que ya sé?
2. **Durante:** abstract o resumen → introducción → figuras/ejemplos → método → resultados; detenerse a explicar el mecanismo en palabras propias.
3. **Después:** mecanismo central en una frase, evidencia a favor, límites/críticas, aplicación al build y una pregunta abierta.

Registrar el estado de lectura como `pendiente` → `citado, no leído` → `revisado` → `leído` → `releído`; citar un paper no equivale a comprenderlo.

| Área | Referentes de partida, no autoridad única |
|---|---|
| Fundamentos y transformers | Vaswani et al., Andrej Karpathy, Jay Alammar, Sebastian Raschka |
| Sistemas LLM y producto | Lilian Weng, Chip Huyen, Hamel Husain, Eugene Yan, Simon Willison |
| RAG y agentes | Lewis et al., Microsoft Research, Anthropic, equipos de proyectos de retrieval/agents |
| Inferencia y personalización | Equipos de vLLM, llama.cpp, Hugging Face y autores de LoRA/QLoRA |
| Seguridad y operación | OWASP, NIST, documentación de proveedores y equipos de observabilidad |

La lista se actualiza por tema. Usar las voces para aprender y contrastar, no sustituir papers, documentación ni experimentos propios. Al recomendar un recurso concreto, indicar enlace, autor, contribución, nivel, límite y fecha de consulta.

---

## Metodología — Paper → Discusión → Build → Sistema

Se conserva el enfoque de `PLAN.md`:

1. **Fuente:** leer una explicación primaria u oficial con una pregunta concreta.
2. **Discusión:** intuición → mecanismo → límites/tradeoffs. Explicación directa para conceptos nuevos; preguntas socráticas para profundizar.
3. **Mini-build:** implementar una versión pequeña y observable, preferiblemente sin framework cuando eso revele el mecanismo.
4. **Aplicación:** integrar la idea al entregable de la fase; medir contra baseline y analizar errores.
5. **Explicación y escritura:** defender dos decisiones y un modo de fallo; escribir una síntesis o blog original y revisarlo.
6. **Repaso:** recuperación sin apuntes y reintento diferido 1–2 semanas después.

**Evidencia mínima en todas las fases, incluso antes de la fase 8:** tarea y usuario, baseline, datos/casos de prueba, criterio de éxito, resultados por segmento o tipo de error, coste/latencia, riesgos de privacidad y una decisión justificada. Los módulos de seguridad y evaluación profundizan estos temas; no los inauguran. Un proyecto funcional sin evaluación no demuestra competencia.

**Ritmo:** las semanas de abajo son presupuestos iniciales, no un calendario que obligue a avanzar. Si un reto no se supera, se practica y reintenta. Si ya dominas un tema, demuéstralo con un reto y evita repetirlo. Las preferencias de lectura, vídeo o código se usan para hacer sostenible la rutina, no como “estilos de aprendizaje” fijos.

---

# Track 1 — Técnico: diez fases

## Fase 1 — AI Foundations y modelos preentrenados · 4 semanas

**Objetivo:** entender qué ocurre desde texto de entrada hasta tokens de salida, y comparar modelos locales y por API. Aquí continúa el trabajo ya iniciado de BPE y self-attention.

**Temas y subtemas**

- Rol de AI Engineer; AI vs AGI; LLM, training, inference, embeddings, vector DB, RAG, prompting y agents como vocabulario orientador.
- Beneficios y límites de modelos preentrenados: capacidades, modalidades, ventana de contexto, fecha/límite de conocimiento, latencia, coste, privacidad, sesgos y fallos.
- Modelos **abiertos vs propietarios**: licencias, pesos, hosting, control, calidad, dependencia del proveedor y operaciones. Descubrir candidatos en un model hub; leer model cards y documentación de capacidades. Comparar familias como OpenAI, Anthropic/Claude, Google/Gemini, Mistral o Cohere **como ejemplos del mapa**, sin memorizarlas ni presuponer vigencia de versiones.
- Ecosistema abierto: Hugging Face Hub y sus tareas/model cards; inferencia local con Ollama y llama.cpp; SDKs de inferencia o Transformers.js cuando el entorno lo justifique. Comparar con una API alojada; revisar opciones de nube como Azure AI o AWS SageMaker solo a nivel de selección.
- Fundamentos que explican el modelo: tokenización/BPE, embeddings, producto punto, gradiente, pérdida, entrenamiento vs inferencia; atención Q/K/V, multi-head, transformer, contexto, pretraining, SFT, RLHF/DPO a nivel conceptual y generación autoregresiva.
- Manejo de tokens y costes: token counting, máximos de entrada/salida, límites de contexto, coste por tarea; cuantización básica y calidad vs memoria.
- Datos/ML mínimos para esta fase: train/validation/test, leakage, overfitting y baseline. Profundizar solo si el diagnóstico o el mini-GPT revela una brecha.

**Paper → build:** leer críticamente *Attention Is All You Need* y contrastar cada mecanismo con código. Secuencia orientativa: BPE → atención/multi-head → training loop/mini-GPT → generación y comparación con modelos preentrenados. La secuencia ya empezada no se reinicia por calendario.

**Entregable:** mini-GPT didáctico y benchmark sencillo de dos modelos preentrenados, uno local y otro alojado si el presupuesto lo permite. Explicar qué se aprende del mini-GPT y qué no extrapola a un modelo moderno. **Salida:** pruebas de tokenización/máscara causal, generación reproducible, casos de error, medición de tokens, latencia y coste o memoria.

---

## Fase 2 — Prompt Engineering y Structured Outputs · 3 semanas

**Objetivo:** construir interfaces fiables con modelos existentes y herramientas, no depender de prompts ingeniosos sin pruebas.

**Temas y subtemas**

- Plataformas de modelos: consola/playground, SDK/API y diferencias entre experimentar y construir un servicio. Entender mensajes, roles, contexto e instrucciones; verificar la API vigente en documentación oficial. El mapa menciona OpenAI Platform, Chat Completions y playground como ejemplos, no como única ruta.
- Zero/few-shot, ejemplos, descomposición, instrucciones de sistema, delimitación de datos no confiables, prompt optimization y robustez ante variaciones.
- Gestión de contexto y tokens: truncamiento, presupuesto, límites, coste, streaming, caching y elección del modelo.
- Structured outputs: JSON/JSON Schema, validación, manejo de errores, reintentos acotados, fallbacks y contratos de salida.
- Tool/function calling: argumentos validados, timeouts, idempotencia, autorización, auditabilidad y separación entre propuesta del modelo y acción real.
- Seguridad temprana: prompt injection, restricciones de entrada/salida, moderación cuando aplique, identificadores de usuario pseudonimizados para abuso/observabilidad y políticas de datos. Conocer el enfoque de Constitutional AI sin confundirlo con un control suficiente.
- Decisión manual vs frameworks: usar primero SDK directo; comparar después bibliotecas como Instructor, Outlines, LangChain o LlamaIndex solo si reducen complejidad real.

**Entregable:** asistente CLI con tool use desde cero y salida estructurada validada. **Salida:** suite pequeña de casos normales/adversarios, tasa de éxito, errores de esquema, coste, latencia y un modo de fallo explicado.

---

## Fase 3 — Embeddings, búsqueda vectorial y RAG · 5 semanas

**Objetivo:** usar conocimiento externo con recuperación verificable y aprender embeddings **más allá de RAG**.

**Temas y subtemas**

- Qué representa un embedding, similitud/distancia, límites semánticos y cuándo usar modelos de embeddings abiertos, Sentence Transformers o APIs alojadas; comparar calidad, latencia y coste.
- Casos de uso: búsqueda semántica, **recomendación**, **detección de anomalías** y **clasificación**. Elegir métricas distintas para cada caso; proximidad vectorial no garantiza verdad ni utilidad.
- Búsqueda sparse (BM25/FTS5), dense, hybrid + RRF; indexado, top-k, filtros, consulta por similitud y vector search implementado. Distinguir librería de índice, base vectorial y servicio gestionado.
- Vector DB: propósito, indexación, metadatos, actualización, borrado, ACL, escalabilidad y coste. Comparar ejemplos del mapa — Chroma, Pinecone, Weaviate, FAISS, LanceDB, Qdrant, Supabase/pgvector, MongoDB Atlas — y **elegir una** para profundizar, no estudiarlas todas.
- RAG end-to-end: casos de uso, ingesta/calidad documental, chunking → embedding → almacenamiento → retrieval → reranking → generación → citas/abstención → refresh. Permisos y procedencia desde la fuente hasta la respuesta.
- Cuándo usar RAG vs contexto largo vs fine-tuning vs respuesta sin IA. Query transformation, HyDE y GraphRAG como extensiones solo tras medir un baseline.
- Implementación con SDK directo primero; comparar LangChain/LlamaIndex u otros orquestadores si agregan valor. El PDF cita también Assistants API y Replicate: tratarlos como ejemplos históricos o de proveedor y comprobar su vigencia antes de escogerlos.
- Evals separadas: recall/precision de retrieval, exactitud de citas, calidad de respuesta, abstención y fallos por tipo de pregunta.

**Entregable:** sistema RAG multi-estrategia con corpus autorizado y eval comparativa (BM25 vs dense/hybrid), más un microexperimento de embeddings para recomendación, clasificación o anomalías. **Salida:** conjunto etiquetado, métricas, análisis de errores, protección entre usuarios y decisión técnica documentada.

---

## Fase 4 — AI Agents y workflows · 5 semanas

**Objetivo:** decidir cuándo un agente mejora una tarea y cuándo un workflow determinista o RAG simple es suficiente.

**Temas y subtemas**

- Casos de uso y límites; RAG como alternativa o componente, no sinónimo de agente. Herramientas, estado, contexto, memoria short/long/episodic y persistencia.
- ReAct prompting y planificación acotada; Plan-and-Execute, Reflexion y Tree of Thoughts como ideas a comparar, no patrones obligatorios.
- Implementación manual de un loop de herramientas antes de frameworks; function/tool calling, contratos, límites de pasos/tokens, cancelación, aprobación humana, idempotencia y recuperación de fallos.
- Frameworks como LangGraph, CrewAI o AutoGen solo después de entender el ciclo manual. Arquitecturas multiagente, coordinación, comunicación y coste adicional.
- Evals de tarea completa: éxito, seguridad, errores de herramientas, trazas, latencia y coste; comparar con baseline determinista.

**Entregable:** research assistant acotado; añadir una versión multiagente solo si supera una métrica importante. **Salida:** comparación reproducible, trazas, controles de acciones y análisis de fallos.

---

## Fase 5 — Fine-tuning y personalización · 5 semanas

**Objetivo:** elegir entre cambiar prompt, recuperar información, fine-tunear o no usar IA; entrenar solo cuando exista una hipótesis comprobable.

**Temas y subtemas**

- Marco de decisión: prompt vs RAG vs fine-tuning; conocimiento cambiante frente a comportamiento/formato estable.
- Datos para entrenamiento: curación, permisos/licencias, privacidad, splits, contaminación, sintéticos, calidad de etiquetas y versión del dataset.
- SFT, LoRA, QLoRA, adapters, full fine-tuning a nivel de comparación, evaluación de generalización y regresiones.
- Herramientas como PEFT/TRL, MLX, Unsloth o Axolotl según compatibilidad verificada; cloud solo si el experimento lo exige.
- Model card: datos, usos previstos, límites, riesgos y comparación honesta con el baseline.

**Entregable:** fine-tune pequeño con evaluación antes/después y model card; si no hay hardware, presupuesto o caso válido, diseño experimental con subset y justificación de no entrenar. **Salida:** demostrar mejora en el objetivo sin empeorar casos críticos.

---

## Fase 6 — Inference y rendimiento · 4 semanas

**Objetivo:** cumplir un presupuesto de calidad, latencia, throughput, memoria y coste bajo una carga definida.

**Temas y subtemas**

- Inference engines: llama.cpp/MLX para local; vLLM o TensorRT-LLM en contextos compatibles. CPU vs GPU vs edge y servicios alojados.
- KV-cache, batching/continuous batching, paralelismo de solicitudes, cuantización INT8/INT4 y formatos como GGUF/GPTQ/AWQ; speculative decoding como extensión.
- Medidas: TTFT, tokens/s, p50/p95/p99, throughput, tasa de error, memoria y coste por tarea exitosa. Perfilado y pruebas de carga con entradas/salidas comparables.
- Tradeoffs: contexto largo, calidad tras cuantización, batching vs latencia individual y coste de capacidad ociosa.

**Entregable:** benchmark reproducible de dos configuraciones con SLO derivado de un caso real, no un número universal inventado. **Salida:** decisión defendida con calidad, p95, memoria y coste.

---

## Fase 7 — LLMOps y producción · 5 semanas

**Objetivo:** operar el sistema como producto, no solo como demo local.

**Temas y subtemas**

- Deployment: serverless, contenedores, servicios persistentes y edge; CI/CD, secretos, ambientes, canary, rollback y versionado de prompts/modelos/datos.
- Cost modeling y caching exacto, semántico o de prefijo; streaming, rate limits, cuotas, routing de modelos y presupuesto por tenant.
- Observabilidad: traces de prompt/retrieval/tools/modelo, métricas de calidad y HTTP, coste/tokens, latencia, errores y SLI/SLO. Herramientas como Langfuse, Phoenix u OpenTelemetry según necesidad.
- Load testing, multitenancy, autorización también en retrieval, aislamiento, data residency, retención y borrado.
- Resiliencia: timeouts, retries con presupuesto, colas, idempotencia, circuit breakers, fallback y respuesta degradada.
- Experimentos A/B cuando existan volumen y métricas suficientes; incident response y evaluación continua.

**Entregable:** servicio AI desplegado o entorno de producción simulado con dashboard, alertas, SLO, coste estimado y rollback probado. **Salida:** diagnosticar un fallo real o inyectado usando trazas y métricas.

---

## Fase 8 — Safety, guardrails y evaluación profunda · 4 semanas

**Objetivo:** formalizar controles y evals rigurosas sobre los sistemas construidos desde las fases 2–7.

**Temas y subtemas**

- Threat modeling, prompt injection directa/indirecta, exfiltración, tool misuse, secretos, PII, permisos mínimos, aislamiento y abuso.
- Safety/ethics: sesgo, fairness, daño, privacidad, moderación, restricciones de entrada/salida y supervisión humana. Moderation APIs y end-user IDs del mapa son **posibles controles de proveedor**, nunca sustitutos de diseño seguro.
- Guardrails deterministas y basados en modelos; ejemplos como NeMo, Guardrails AI o LlamaGuard. Red teaming, pruebas adversarias y límites de defensas basadas solo en prompts.
- Evals: golden sets, métricas de tarea, factualidad, citas, alucinación, LLM-as-judge con calibración humana, segmentación, incertidumbre y pruebas de regresión.
- Evaluación de RAG/agentes con herramientas como Ragas/DeepEval cuando sus métricas sean apropiadas; no confundir un score agregado con seguridad.

**Entregable:** threat model, suite adversaria y pipeline de evaluación para el servicio previo. **Salida:** mitigar fallos, mostrar antes/después y documentar riesgo residual.

---

## Fase 9 — Multimodalidad y temas avanzados · 4 semanas

**Objetivo:** aplicar imagen, audio, vídeo y documentos con métricas y revisión humana adaptadas a cada modalidad.

**Temas y subtemas**

- **Image understanding:** clasificación, extracción y modelos vision-language; calidad de imagen, OCR y casos ambiguos.
- **Image generation:** creación/edición, control, consistencia, evaluación humana, derechos de uso, seguridad de contenido y coste.
- **Audio:** speech-to-text/transcripción, text-to-speech, latencia, errores de acento/ruido y privacidad de voces.
- **Vídeo:** comprensión temporal, muestreo de frames, sincronización con audio, coste y límites; profundidad opcional si no es relevante al proyecto.
- **Document AI:** OCR, layout, tablas, PDF → datos estructurados, validación y citas.
- Modelos y herramientas del mapa como Vision APIs, DALL-E, Whisper, modelos de Hugging Face, LangChain/LlamaIndex multimodal: comparar capacidad actual y documentación antes de escoger; ningún producto es requisito.
- Long context vs RAG, mixture of experts y modelos sparse como temas de frontera aplicada.

**Entregable:** pipeline multimodal (por ejemplo PDF → datos estructurados, o imagen/audio → respuesta) con casos difíciles y métricas por etapa. **Salida:** explicar qué revisa una persona, qué automatiza el sistema y dónde falla.

---

## Fase 10 — AI System Design, Staff y consultoría · 5 semanas

**Objetivo:** sintetizar todo en arquitectura y decisiones de negocio defendibles.

**Temas y subtemas**

- Casos de estudio de productos AI; arquitectura end-to-end, requirements, buy-vs-build, selección de modelos, datos y métricas de negocio.
- Capacidad y escala: concurrencia, tokens, p95/p99, colas, backpressure, SLO, disponibilidad, aislamiento multiempresa y coste por tarea.
- Failure-mode analysis, privacidad/data residency, gobernanza, tradeoffs y respuesta a incidentes.
- Escritura técnica: ADRs, diagramas, estimaciones, client memos, postmortems y explicación a público no técnico.
- Desarrollo asistido por IA: code editors, code completion y agentes de coding; verificar pruebas, seguridad, licencia, procedencia y responsabilidad humana.
- Liderazgo: revisión de diseños, mentoring, decisiones entre equipos, roadmap de producto y comunicación con stakeholders.

**Entregable:** tres case studies diseñados y documentados, más un capstone end-to-end o evolución del servicio de la fase 7. **Salida:** defender ante un reviewer dos decisiones, una alternativa descartada, costes y un fallo probable.

---

# Track 2 — System Design y tradeoffs (continuo)

- Un design exercise cada dos semanas: requisitos, capacidad, datos, arquitectura, bottlenecks, fallos, seguridad y costes.
- ADR para decisiones relevantes: problema, opciones, evidencia, tradeoff y condición que haría cambiar de opción.
- Casos de estudio de sistemas AI reales, diferenciando lo publicado de inferencias propias.
- Ejercicios grandes de diseño en tres hitos de la ruta, no atados a semanas fijas; medir claridad, supuestos, resiliencia y economía.
- Antes del capstone: diseñar un servicio multiempresa con documentos y una herramienta acotada; demostrar aislamiento, observabilidad, evals, carga y rollback.

**Propósito:** transformar profundidad técnica en criterio arquitectónico para Staff/consultoría. Un título no se obtiene automáticamente al completar ejercicios; la evidencia es la calidad de las decisiones y su impacto.

# Track 3 — Comunicación y liderazgo (continuo)

- Texto original tipo blog al cerrar cada fase estudiada: mecanismo, ejemplo, decisión, evidencia, límites y reflexión. Si un tema se acredita por diagnóstico, usar síntesis breve en lugar de producir contenido redundante.
- Explicación mensual o mentoring a otra persona; escuchar dónde el modelo mental aún no es claro.
- Un **client memo** por fase: decisión técnica explicada a alguien no técnico, con coste, riesgo y alternativa.
- Un checklist reutilizable de auditoría de IA y una simulación de consultoría antes del capstone.
- Portfolio con repositorios, model cards, comparativas y estudios de diseño **solo después de revisar secretos, datos privados y licencias**.

**Propósito:** hacer visible y transferible el conocimiento. Escribir y enseñar también son pruebas de comprensión, no marketing separado del aprendizaje.

---

## Portfolio y criterios de avance

| Fase | Pieza sugerida | Evidencia que importa |
|---|---|---|
| 1 | Mini-GPT + comparativa de modelos locales/API | Pruebas, explicación del mecanismo, límites y mediciones |
| 2 | Tool-using CLI assistant | Esquemas válidos, evals, fallbacks, coste y seguridad básica |
| 3 | RAG multi-estrategia | Baseline BM25, recall, calidad de citas, permisos y errores |
| 4 | Research assistant | Comparación con workflow simple; éxito/coste/trazas |
| 5 | Fine-tune pequeño o decisión de no entrenar | Baseline, datos legales, eval antes/después, model card |
| 6 | Benchmark de inferencia | Carga reproducible, calidad, p95, memoria y coste |
| 7 | Servicio desplegado/simulado | SLO, observabilidad, resiliencia y rollback |
| 8 | Reporte de seguridad y evals | Threat model, casos adversarios, mitigaciones y límites |
| 9 | Demo multimodal | Métrica por modalidad y revisión humana |
| 10 | Tres case studies + capstone | Diseño, negocio, tradeoffs y defensa técnica |

**Paso de fase:** entregable funcional o análisis defendible, pruebas y mediciones, explicación independiente de dos decisiones y un modo de fallo, y texto revisado. Lo no demostrado queda **en progreso**. Publicar las diez piezas es una posibilidad, no un contador de éxito: menos piezas sólidas son mejores que demos sin evaluación.

---

## Recursos, cloud y límites de presupuesto

- Empezar con Mac M2 Pro para mini-builds, modelos locales manejables, retrieval, evaluación y prototipos. Verificar memoria y compatibilidad antes de escoger modelo o herramienta.
- Usar cloud para entrenamiento, inferencia especializada, carga o despliegue cuando una hipótesis lo necesite. Herramientas citadas en `PLAN.md` como RunPod, Lambda Labs, Modal o Replicate son opciones a comparar, no un presupuesto contratado.
- El rango de USD 20–50/mes de `PLAN.md` es **una hipótesis de gasto**, especialmente en fases 5–7, no precio ni autorización. Confirmar presupuesto, tarifa vigente y límite de gasto antes de lanzar recursos; no copiar precios antiguos del plan.
- Elegir una plataforma en profundidad cuando haga falta operar un servicio. No estudiar Azure, AWS y todos los SDKs solo por aparecer en el mapa.

---

## Cobertura completa de temas de roadmap.sh

Esta tabla traduce **todos los bloques educativos del [PDF de roadmap.sh](https://roadmap.sh/pdfs/roadmaps/ai-engineer.pdf)** a las fases anteriores. Las promociones, enlaces de navegación y nombres de productos se separan de las competencias; un nombre listado no obliga a usarlo. Algunos nombres de APIs del PDF pueden cambiar: comprobar siempre documentación vigente antes de una práctica.

| Bloque del mapa | Contenido cubierto | Fase |
|---|---|---|
| Introducción y prerrequisitos | Qué es AI Engineer, diferencia con ML Engineer, AI vs AGI, terminología, roles, responsabilidades, impacto en producto, entradas frontend/backend/full-stack | Orientación, 1, 10 |
| LLMs y modelos preentrenados | Training vs inference; beneficios/límites; familias populares; modelos abiertos y propietarios; capacidades, ventana de contexto y fecha de conocimiento | 1 |
| Plataformas/modelos de ejemplo | OpenAI, Anthropic/Claude, Google/Gemini, Mistral, Cohere, Hugging Face; Azure AI y AWS SageMaker como opciones de plataforma | 1, 2, 7 |
| Open-source AI | Open vs closed; encontrar y usar modelos; Hugging Face Hub, model cards/tasks, inference SDK, Transformers.js; Ollama, catálogo de modelos y SDK | 1 |
| Plataforma/API, prompting y tokens | OpenAI Platform, OpenAI API, Chat Completions API y playground como ejemplos del PDF; escritura de prompts; token counting, máximos, límites y pricing; fine-tuning como opción | 1, 2, 5 |
| Safety y ética | Problemas de seguridad, prompt injection, sesgo/fairness, privacidad, pruebas adversarias, robust prompting, clientes/casos de uso y límites de input/output; OpenAI Moderation API y end-user IDs como ejemplos de controles del PDF | 2, 8; controles desde 1 |
| Embeddings | Qué son, búsqueda semántica, recomendación, anomalías, clasificación; modelos abiertos/Sentence Transformers vs OpenAI Embeddings API/modelos como ejemplo alojado; precio | 3 |
| Bases vectoriales | Propósito, indexado, similitud y vector search; Chroma, Pinecone, Weaviate, FAISS, LanceDB, Qdrant, Supabase y MongoDB Atlas como candidatos; escoger una | 3 |
| RAG | Casos de uso, RAG vs fine-tuning, chunking, embedding, base vectorial, retrieval, generación, implementación y evaluación; SDK directo vs LangChain/LlamaIndex; OpenAI Assistants API y Replicate como ejemplos del PDF sujetos a vigencia | 3 |
| Agentes | Casos de uso, alternativa a RAG, prompting/ReAct, implementación manual, OpenAI Functions/Tools como ejemplo del PDF, construcción y evaluación; APIs de asistentes solo tras verificar vigencia | 4 |
| Multimodal | Image understanding/generation, video understanding, audio processing, text-to-speech, speech-to-text y aplicaciones; OpenAI Vision API, DALL-E API, Whisper API, modelos de Hugging Face y frameworks multimodales como ejemplos del PDF | 9 |
| Herramientas de desarrollo | AI code editors y code completion con revisión técnica | 10 y uso transversal |
| Rutas relacionadas | AI & Data Scientist, Prompt Engineering Roadmap y Data Analyst son rutas externas opcionales, **no subtemas que haya que copiar enteros** dentro de esta formación | Según brecha diagnosticada |

---

## Reglas del juego y primer paso

1. **Conceptos > nombres de frameworks.** Implementar manualmente cuando enseñe el mecanismo; abstraer después.
2. **Medir antes de optimizar.** Baseline y casos de fallo antes de complejidad adicional.
3. **Seguridad, datos y evaluación desde el inicio.** No esperar a las fases 7–8 para mirar privacidad o calidad.
4. **Fuentes primarias + construcción + explicación.** Leer, predecir, probar, documentar y repasar.
5. **No avanzar por calendario.** Avanzar por evidencia observada; usar los tiempos como presupuesto revisable.
6. **Conservar una ruta única.** Ajustar este documento si cambia el objetivo, sin abrir nuevos roadmaps paralelos.

**Primera sesión:** partir del trabajo existente de BPE/atención y pedir una explicación propia: “¿Qué problema resuelve la atención en un transformer, y qué evidencia te convencería de que tu implementación funciona?”. Con esa respuesta se decide si continuar el mini-GPT, reforzar un prerrequisito de datos/ML o pasar a comparar un modelo preentrenado. No se presume dominio por la presencia de archivos.
