# Plan de Estudio — AI Engineering

Plan completo y persistente para convertirte en **AI Engineer** con capacidad de subir a **Staff** y trabajar como **Consultor**. Sincronizado con el perfil en Engram bajo `ai-engineering/alexis/profile`.

---

## Perfil

| Atributo | Valor |
|---|---|
| Nivel actual | Intermedio |
| Objetivo | Trabajar como AI Engineer + promo a Staff + consultor de AI |
| Idioma conversación | Español (Rioplatense, voseo) |
| Hardware principal | Mac M2 Pro (Apple Silicon, unified memory) |
| Hardware secundario | Windows i7 con gráfica integrada (solo código) |
| GPU dedicada | No. Cuando haga falta entrenar, ir a cloud (RunPod/Lambda) |
| Budget cloud recomendado | $20-50/mes durante Fases 5-7 |
| Tiempo por semana | 5-8h |
| Duración total estimada | ~50 semanas (~12 meses) |
| Ritmo | 1 fase cada 5 semanas promedio, con buffer |

---

## Disciplina: Primary Sources (NO NEGOCIABLE)

Para CADA tema que toquemos, el tutor surface y trabaja con fuentes primarias.

### Qué hace el tutor

1. Surface 1-3 papers seminales + posts de voces referentes por tema
2. NO solo los lista — los lee CON el usuario usando un protocolo estructurado
3. Trackea el status de cada paper: `pending` → `cited-not-read` → `skimmed` → `read` → `reread`
4. Mantiene una lista curada de voces referentes por área (crece con el tiempo)

### Reading protocol

**Before**: frame (cuál es el claim), entry point (qué ya sabés), predicción (qué esperás encontrar)

**During**: abstract → intro → figuras → método → resultados, con pausas para que el usuario resuma en sus palabras

**After**: mecanismo core en 1 frase, evidencia empírica, qué queda abierto / fue criticado, conexión con lo que ya sabés

### Voces referentes curadas (punto de partida)

| Área | Voces |
|---|---|
| Deep Learning foundations | Karpathy, Jay Alammar, 3Blue1Brown, Manning, Raschka |
| LLM systems | Lilian Weng, Chip Huyen, Hamel Husain, Eugene Yan, Simon Willison |
| RAG | Pinecone Learning, Lance Martin, Microsoft Research (GraphRAG), Lewis et al. 2020 |
| Agents | Lilian Weng, Anthropic (Building Effective Agents), Harrison Chase |
| Inference | vLLM team, Hamel Husain |
| LLMOps | Langfuse, Arize AI, Modal |
| Fine-tuning | Raschka, HuggingFace PEFT, Daniel Han (Unsloth), Tim Dettmers |
| Safety | Anthropic (Constitutional AI), DeepEval/Ragas, OWASP, NIST |
| Multimodal | OpenAI (CLIP/Whisper/GPT-4V), Microsoft (LLaVA), Google (ViT/PaLI) |

---

## Track 1 — Técnico (10 fases, ~44 semanas + 6 buffer)

### Fase 1 — AI Foundations (4 semanas)

**Conceptos**: arquitectura transformer (intuición), pretraining / fine-tuning / RLHF / DPO, tokenización profunda, context windows, cuantización básica (GGUF, GPTQ, AWQ), local vs API

**Práctica**: correr LLMs locales (Ollama, LM Studio, llama.cpp), entender cada paso de inferencia

**Entregable**: benchmark personal de LLMs locales + documentación del stack

**Hardware**: Mac M2 Pro funciona excelente para Ollama/LM Studio/llama.cpp. Cloud no necesario.

**Mastery target**: Bloom 2 — Understand

---

### Fase 2 — Prompt Engineering & Structured Outputs (3 semanas)

**Conceptos**: zero/few-shot, chain-of-thought, system prompts como arquitectura, ReAct, function calling / tool use, structured outputs (JSON mode, schema enforcement), prompt optimization, Constitutional AI básico

**Herramientas**: instructor, outlines, langchain (usado con criterio, no por defecto)

**Entregable**: tool-using assistant desde cero (no LangChain)

**Hardware**: Mac M2 Pro. Cloud opcional para comparaciones con GPT-4/Claude.

**Salteable si falta tiempo**: nada, es core

**Mastery target**: Bloom 3-4 — Apply → Analyze

---

### Fase 3 — RAG & Information Retrieval (5 semanas)

**Conceptos**: sparse retrieval (BM25, FTS5 desde cero), dense retrieval, vector DBs (FAISS, Chroma, pgvector, Qdrant), hybrid search + RRF, query transformation (HyDE, multi-query), chunking strategies, GraphRAG, Agentic RAG, evaluación con Ragas

**Entregable**: sistema RAG multi-estrategia con eval comparativa

**Hardware**: Mac M2 Pro, todo funciona (FAISS, Chroma, FTS5). Cloud opcional para embeddings hosted.

**Salteable si falta tiempo**: GraphRAG (quedate con concepts)

**Mastery target**: Bloom 4 — Analyze

---

### Fase 4 — AI Agents (5 semanas)

**Conceptos**: fundamentos de agentes, sistemas de memoria (short/long/episodic), planning (ReAct, Plan-and-Execute, Reflexion, Tree of Thoughts), arquitecturas multi-agente, frameworks (LangGraph, CrewAI, AutoGen), patrones reales (research agents, coding agents), failure modes

**Entregable**: multi-agent research system

**Hardware**: Mac M2 Pro, todo funciona. Cloud opcional.

**Salteable si falta tiempo**: nada

**Mastery target**: Bloom 4 — Analyze

---

### Fase 5 — Fine-tuning & Customization (5 semanas) ⚠️ más cloud

**Conceptos**: cuándo fine-tunear vs prompt vs RAG (framework de decisión), LoRA, QLoRA, full fine-tuning, data curation, evaluación de modelos fine-tuned, synthetic data generation

**Herramientas**: Unsloth, Axolotl, TRL

**Entregable**: modelo fine-tuneado publicado en HuggingFace

**Hardware Mac M2 Pro**: QLoRA con MLX/Unsloth funciona pero LENTO. 7B = varias horas por epoch.

**Cloud**: RECOMENDADO para >1 epoch o modelos >7B. RunPod ~$5-15 por experimento.

**Salteable si falta tiempo**: full fine-tuning (quedate con LoRA/QLoRA solamente)

**Mastery target**: Bloom 3-4 — Apply → Analyze

---

### Fase 6 — Inference & Performance (4 semanas)

**Conceptos**: inference engines (vLLM, TensorRT-LLM, llama.cpp), cuantización (INT8/INT4), batching strategies, KV-cache, speculative decoding, continuous batching, GPU vs CPU vs edge

**Entregable**: sistema optimizado que cumple latency budget específico (ej. p95 < 200ms para 1k tokens)

**Hardware Mac M2 Pro**: excelente (Metal + llama.cpp + MLX). Cloud opcional.

**Salteable si falta tiempo**: speculative decoding (quedate con batching + cuantización)

**Mastery target**: Bloom 3-4 — Apply → Analyze

---

### Fase 7 — LLMOps & Producción (5 semanas)

**Conceptos**: deployment patterns (serverless, containers, edge), cost modeling, caching (semantic, exact, prefix), streaming, observability (Langfuse, Phoenix, OpenLLMetry), load testing, multi-tenancy, A/B testing para LLMs, incident response

**Entregable**: servicio AI en producción con monitoring completo

**Hardware Mac M2 Pro**: dev local funciona. Cloud NECESARIO para deploy real (Fly.io, Railway, Vercel, RunPod).

**Salteable si falta tiempo**: A/B testing framework (quedate con el concepto)

**Mastery target**: Bloom 5 — Evaluate

---

### Fase 8 — Safety, Guardrails & Evaluación (4 semanas)

**Conceptos**: guardrails (NeMo, Guardrails AI, LlamaGuard), red teaming, prompt injection defense, PII handling, bias & fairness, Ragas, DeepEval, custom evals, LLM-as-judge, human-in-the-loop, hallucination detection

**Entregable**: sistema con guardrails + pipeline de evaluación completo

**Hardware**: Mac M2 Pro. Cloud opcional para hosted judge.

**Salteable si falta tiempo**: nada, es crítico

**Mastery target**: Bloom 5 — Evaluate

---

### Fase 9 — Multimodal & Advanced Topics (4 semanas)

**Conceptos**: vision (CLIP, LLaVA, GPT-4V, Florence), audio (Whisper, TTS — XTTS, Bark), video understanding, document AI (layout-aware extraction), long context techniques (RAG vs long context), mixture of experts, sparse models

**Entregable**: pipeline multimodal (ej. PDF → structured data)

**Hardware Mac M2 Pro**: visión funciona, Whisper funciona, TTS funciona (más lento). Cloud opcional para visión pesada.

**Salteable si falta tiempo**: video understanding (quedate con visión + audio)

**Mastery target**: Bloom 3-4 — Apply → Analyze

---

### Fase 10 — AI System Design & Architecture (5 semanas)

**Conceptos**: case studies (ChatGPT, Perplexity, Cursor, Devin, v0), architecture patterns, cost engineering, failure mode analysis, multi-tenant patterns, privacy & data residency, technical writing

**Entregable**: 3 case studies diseñados + 3 blog posts publicados

**Hardware**: irrelevante (es diseño puro). Cloud opcional para tests.

**Mastery target**: Bloom 5-6 — Evaluate → Create

---

**Total Track 1**: 44 semanas técnicas + 6 semanas de buffer = **50 semanas / 12 meses**

---

## Track 2 — System Design & Tradeoffs (continuo, cross-cutting)

- Design exercises cada 2 semanas (sistema AI end-to-end con requirements, capacidad, arquitectura, modelo de datos, bottlenecks, fallos)
- Tradeoff docs de cada decisión técnica
- Case studies reales (ChatGPT, Perplexity, Cursor, Devin, v0)
- Estimación de costos y capacidad
- Failure mode analysis

**Propósito**: te convierte en Staff + Consultor. La profundidad técnica sin system design = senior. Con system design = staff.

---

## Track 3 — Comunicación & Liderazgo (continuo, cross-cutting)

- Blog post cada 2 semanas (fuerza claridad, arma portfolio)
- Frameworks de decisión escritos (cuándo X vs Y)
- 1 sesión de mentoring/enseñanza al mes (a un par, en un curso, en un stream)
- Documentación clara que otros pueden usar
- ADRs escritos de tus decisiones técnicas

**Propósito**: te hace Consultant visible. La expertise sin comunicación = invisible.

---

## Foco Staff/Consultor — additions específicas

### Staff Engineer prep

- **Semana 8, 20, 32**: 3 design exercises "large" estilo FAANG (45 min c/u, score con rúbrica)
- **Mes 4-12**: 1 paper seminal por mes (Attention Is All You Need, RAG, Constitutional AI, etc.)
- **Mes 6**: PR significativo a 1 proyecto open source de AI

### Consultor prep

- **Cada fase**: 1 "client memo" (explicás la decisión técnica como a cliente no-técnico)
- **Mes 3**: AI audit checklist reusable
- **Mes 9**: simulación end-to-end de consultoría con amigo como "cliente"
- **Continuo**: framework de estimación de costos/timeline para engagements

---

## Portfolio Strategy (entregables públicos)

| Fase | Entregable público |
|---|---|
| 1 | Blog: "Cómo correr LLMs locales y qué aprendí" |
| 2 | Repo: tool-using CLI assistant |
| 3 | Repo: RAG multi-estrategia + eval report |
| 4 | Repo: multi-agent research assistant |
| 5 | Modelo en HuggingFace con model card |
| 6 | Blog: "Optimicé X inference y así fue" |
| 7 | Repo: servicio AI con observability stack |
| 8 | Blog: "Cómo evalúo sistemas AI en producción" |
| 9 | Demo multimodal deployado |
| 10 | 3 case studies + 3 blogs de AI architecture |

**Al final**: 10 piezas públicas que muestran rango completo — foundations → agents → producción → multimodal → system design.

---

## Cloud Credits Strategy

| Servicio | Precio | Uso ideal |
|---|---|---|
| RunPod | ~$0.20/h A100 | Fine-tuning experiments |
| Lambda Labs | mejor pricing para training largo | Training largo |
| Modal / Replicate | pay-per-use | Hosted inference experiments |

**Budget recomendado**: $20-50/mes durante Fases 5-7 (más intensivas en cloud). Resto del plan funciona con $0 cloud.

---

## Out of Scope (por diseño)

- **Entrenar LLMs from scratch a escala OpenAI/Anthropic** (no aporta al perfil de AI Engineer). **Sí entrenamos un mini-GPT desde cero en Fase 1** como vehículo de comprensión profunda.
- Investigación académica publicable
- AI hardware custom (chips, TPUs)

Si alguno de estos te interesa específicamente, se agrega como bonus track.

---

## Metodología de Aprendizaje — Paper → Build (para todo el plan)

A partir de la primera iteración de ejecución, este plan se aprende con la siguiente cadencia para CADA tema:

1. **Paper(s)** — leer la fuente primaria (como se viene haciendo con "Attention Is All You Need")
2. **Discusión** — explicar/Socratic según necesidad (calibrado: explain-first para conceptos nuevos, Socratic para profundizar)
3. **Build mini-project** — implementar la idea en código, idealmente desde cero cuando aplique (estilo Karpathy)
4. **Aplicar al entregable** — conectar el mini-project con el entregable más grande de la fase

**Por qué funciona**: respeta tanto la lectura-como-comprensión (papers) como la construcción-como-comprensión (código). El paper se vuelve la **especificación**. El código se vuelve la **comprensión profunda**.

### Fase 1 re-armada (build-first)

| Semana | Foco |
|--------|------|
| 1 | Tokenizador BPE desde cero (build) |
| 2 | Transformer minimal (build) — atención, multi-head, FF |
| 3 | Training loop + generación de texto (build) |
| 4 | Optimizaciones (cuantización, batching) + comparación con LLMs grandes |

**Recursos**: Karpathy *"Let's build GPT from scratch"* (video 4h) + repo `nanoGPT` (~300 líneas) + Mac M2 con MLX o Modal/RunPod para training largo.

**Entregable Fase 1**: un mini-GPT funcional con código propio y documentación de cada parte.

### Aplicación a otras fases (ejemplos)

| Fase | Paper primero | Build mini → Entregable |
|------|---------------|--------------------------|
| 2 | Prompt engineering papers | tool-using CLI assistant |
| 3 | Lewis 2020 RAG + vector DB papers | RAG multi-estrategia |
| 4 | Lilian Weng / Anthropic agents | multi-agent research system |
| 5 | LoRA / QLoRA papers | modelo fine-tuneado en HuggingFace |
| 6 | Inference / vLLM papers | sistema optimizado con latency budget |
| 7 | LLMOps / observability papers | servicio AI en producción con monitoring |
| 8 | Safety / eval papers (Ragas, DeepEval) | sistema con guardrails + pipeline de evaluación |
| 9 | Multimodal papers (CLIP, LLaVA) | pipeline multimodal deployado |
| 10 | System design case studies | 3 case studies + 3 blogs de AI architecture |

---

## Reglas del Juego

1. **Conceptos > código** — pero el código es el **método** para llegar a los conceptos, no al revés
2. **Manual primero, frameworks después** — implementar desde cero antes de usar LangChain/LlamaIndex
3. **Medir todo** — sin métricas estás adivinando
4. **Tradeoffs documentados** — cada decisión con pros y contras escritos
5. **Publicar trabajo** — el portfolio es tu carta de presentación
6. **Leer fuentes primarias + construir para entender** — la disciplina NO NEGOCIABLE se complementa con código propio
7. **Preguntar antes de avanzar** — si algo no cierra, lo discutimos

---

## Estado Actual

- Plan completo definido y guardado en Engram (`ai-engineering/alexis/profile`)
- Skill del system-design-tutor activa con disciplina de primary sources
- Agente `english-tutor` listo para práctica de vocabulario
- **Fase 1 en curso** — metodología paper → build adoptada para todo el plan
- Paper 1 leído: *"Attention Is All You Need"* (Vaswani et al., 2017) — cerrar con síntesis After
- **Próximo**: build del tokenizador BPE para arrancar Semana 1

---

## Próximo Paso

**Cerrar el paper 1** con síntesis After (mecanismo en 1 frase, evidencia, qué queda abierto, conexión con lo que ya sabías). **Luego**: build del tokenizador BPE desde cero (Semana 1 de Fase 1 re-armada), siguiendo a Karpathy *"'Let's build the GPT Tokenizer'"* + repo `minbpe` (~300 líneas).

---

## Engram Keys

| Key | Propósito |
|---|---|
| `ai-engineering/alexis/profile` | Este plan, perfil del usuario |
| `ai-engineering/alexis/curriculum` | Decisiones sobre qué fases, fechas target |
| `ai-engineering/alexis/topics/{slug}` | Topics Bloom por fase |
| `ai-engineering/alexis/papers/{slug}` | Notas por paper leído |
| `ai-engineering/alexis/referents/{handle}` | Perfil de cada voz referente |
| `ai-engineering/alexis/sessions/{YYYY-MM-DD}` | Resumen de cada sesión |
| `ai-engineering/alexis/challenges/{slug}/{date}` | Design exercises resueltos |
| `ai-engineering/alexis/mistakes` | Errores recurrentes para drillarlos |
