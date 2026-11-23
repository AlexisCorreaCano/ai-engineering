# Ruta personal de estudio

> **Edición manual:** marca casillas y reordena aquí mismo. Antes de añadir una lección, comprueba que exista su carpeta en `ai-engineering-from-scratch/phases/`.
> **Currículo base:** `ai-engineering-from-scratch/` (solo lectura). Esta ruta elige y ordena sus lecciones para un Senior Software Engineer que quiere ser **AI Engineer aplicado**.

## Cómo leer esta ruta

- **Una casilla = una lección estudiada** con el método del tutor ([tutor/METODO.md](../tutor/METODO.md)): clase, reto y explicación propia. **Estudiado no es dominado**: el dominio se prueba con el reto, el blog y el repaso (ver [PROGRESO.md](PROGRESO.md)).
- **Orden:** E0 → E11. Las matemáticas van al final (E10) a propósito: las vas a repasar con ejemplos que ya construiste. E1 es el único puente de redes neuronales que necesitan los transformers.
- **Saltar:** si demuestras una lección con un mini-reto, regístralo en PROGRESO.md como *saltada por diagnóstico*.
- **Fuera de ruta (a propósito):** visión, audio, RL, generative AI, multimodal y sistemas autónomos. Siguen en el currículo (`ai-engineering-from-scratch/ROADMAP.md`) por si algún proyecto los pide.
- Tiempos: estimaciones del currículo para las **lecciones solamente**; los retos, papers y blogs añaden tiempo.

## Resumen

| Etapa | Tema | Avance | Tiempo de lecciones |
|---|---|---|---|
| E0 | Diagnóstico y entorno | 3/7 | 5.8 h |
| E1 | Puente: redes neuronales mínimas | 0/9 | 11.5 h |
| E2 | Transformers y mini-GPT | 0/11 | 14.5 h |
| E3 | LLM engineering: prompts, salidas estructuradas, embeddings y RAG | 0/11 | 13.5 h |
| E4 | Evaluación, guardrails y costo | 0/6 | 6.0 h |
| E5 | Agentes, herramientas y MCP | 0/13 | 13.6 h |
| E6 | Producción y LLMOps | 0/15 | 18.4 h |
| E7 | Fine-tuning e inferencia | 0/7 | 11.0 h |
| E8 | Seguridad y alineación aplicada | 0/5 | 5.8 h |
| E9 | Producto, consultoría y agentes de código | 0/12 | 13.5 h |
| E10 | Matemáticas: núcleo (al final, con contexto) | 0/12 | 16.0 h |
| E11 | ML clásico y matemáticas avanzadas (opcional) | 0/16 | 24.9 h |
| | **Total** | **3/124** | **154.5 h** |

## E0 · Diagnóstico y entorno

**Objetivo:** Dejar un entorno reproducible y confirmar con un mini-reto qué lecciones de ingeniería puedes saltar.  
**Entregable:** Repo con entorno limpio, un test que reproduce un fallo y una llamada a un modelo por API.  

- [x] <!-- lesson:00-setup-and-tooling/01-dev-environment --> **00·01 Dev Environment** · ~45 min · [material](../ai-engineering-from-scratch/phases/00-setup-and-tooling/01-dev-environment/docs/en.md)
- [x] <!-- lesson:00-setup-and-tooling/02-git-and-collaboration --> **00·02 Git & Collaboration** · ~30 min · [material](../ai-engineering-from-scratch/phases/00-setup-and-tooling/02-git-and-collaboration/docs/en.md)
- [x] <!-- lesson:00-setup-and-tooling/04-apis-and-keys --> **00·04 APIs & Keys** · ~30 min · [material](../ai-engineering-from-scratch/phases/00-setup-and-tooling/04-apis-and-keys/docs/en.md)
- [ ] <!-- lesson:00-setup-and-tooling/05-jupyter-notebooks --> **00·05 Jupyter Notebooks** · ~30 min · [material](../ai-engineering-from-scratch/phases/00-setup-and-tooling/05-jupyter-notebooks/docs/en.md)
- [ ] <!-- lesson:00-setup-and-tooling/06-python-environments --> **00·06 Python Environments** · ~30 min · [material](../ai-engineering-from-scratch/phases/00-setup-and-tooling/06-python-environments/docs/en.md)
- [ ] <!-- lesson:00-setup-and-tooling/13-python-for-ai-engineering --> **00·13 Python for AI Engineering (diagnóstico: saltable si dominas los idioms)** · ~120 min · [material](../ai-engineering-from-scratch/phases/00-setup-and-tooling/13-python-for-ai-engineering/docs/en.md)
- [ ] <!-- lesson:00-setup-and-tooling/12-debugging-and-profiling --> **00·12 Debugging and Profiling** · ~60 min · [material](../ai-engineering-from-scratch/phases/00-setup-and-tooling/12-debugging-and-profiling/docs/en.md)

## E1 · Puente: redes neuronales mínimas

**Objetivo:** Entender entrenamiento (pérdida, backprop, optimizador) lo justo para seguir transformers. Si backprop se siente opaco, adelanta 01/04 y 01/05 de matemáticas.  
**Entregable:** Red pequeña entrenada a mano y su equivalente en PyTorch, con curva de pérdida explicada.  

- [ ] <!-- lesson:03-deep-learning-core/01-the-perceptron --> **03·01 The Perceptron** · ~60 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/01-the-perceptron/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/02-multi-layer-networks --> **03·02 Multi-Layer Networks and Forward Pass** · ~90 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/02-multi-layer-networks/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/03-backpropagation --> **03·03 Backpropagation from Scratch** · ~120 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/03-backpropagation/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/04-activation-functions --> **03·04 Activation Functions** · ~75 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/04-activation-functions/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/05-loss-functions --> **03·05 Loss Functions** · ~75 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/05-loss-functions/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/06-optimizers --> **03·06 Optimizers** · ~75 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/06-optimizers/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/11-intro-to-pytorch --> **03·11 Introduction to PyTorch** · ~75 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/11-intro-to-pytorch/docs/en.md)
- [ ] <!-- lesson:05-nlp-foundations-to-advanced/09-sequence-to-sequence --> **05·09 Sequence-to-Sequence Models** · ~75 min · [material](../ai-engineering-from-scratch/phases/05-nlp-foundations-to-advanced/09-sequence-to-sequence/docs/en.md)
- [ ] <!-- lesson:05-nlp-foundations-to-advanced/10-attention-mechanism --> **05·10 Attention Mechanism — The Breakthrough** · ~45 min · [material](../ai-engineering-from-scratch/phases/05-nlp-foundations-to-advanced/10-attention-mechanism/docs/en.md)

## E2 · Transformers y mini-GPT

**Objetivo:** Explicar el camino texto → tokens → atención → siguiente token, y entrenar un GPT pequeño.  
**Entregable:** Tokenizador BPE, self-attention y mini-GPT con tests (continúa proyectos/fase-1).  
**Papers de la etapa:** `bpe`, `attention`, `gpt2`, `scaling-laws` (ver [papers/INDEX.md](../papers/INDEX.md))  

- [ ] <!-- lesson:10-llms-from-scratch/01-tokenizers --> **10·01 Tokenizers: BPE, WordPiece, SentencePiece** · ~90 min · [material](../ai-engineering-from-scratch/phases/10-llms-from-scratch/01-tokenizers/docs/en.md)
- [ ] <!-- lesson:10-llms-from-scratch/02-building-a-tokenizer --> **10·02 Building a Tokenizer from Scratch** · ~90 min · [material](../ai-engineering-from-scratch/phases/10-llms-from-scratch/02-building-a-tokenizer/docs/en.md)
- [ ] <!-- lesson:07-transformers-deep-dive/01-why-transformers --> **07·01 Why Transformers — The Problems with RNNs** · ~45 min · [material](../ai-engineering-from-scratch/phases/07-transformers-deep-dive/01-why-transformers/docs/en.md)
- [ ] <!-- lesson:07-transformers-deep-dive/02-self-attention-from-scratch --> **07·02 Self-Attention from Scratch** · ~90 min · [material](../ai-engineering-from-scratch/phases/07-transformers-deep-dive/02-self-attention-from-scratch/docs/en.md)
- [ ] <!-- lesson:07-transformers-deep-dive/03-multi-head-attention --> **07·03 Multi-Head Attention** · ~75 min · [material](../ai-engineering-from-scratch/phases/07-transformers-deep-dive/03-multi-head-attention/docs/en.md)
- [ ] <!-- lesson:07-transformers-deep-dive/04-positional-encoding --> **07·04 Positional Encoding — Sinusoidal, RoPE, ALiBi** · ~45 min · [material](../ai-engineering-from-scratch/phases/07-transformers-deep-dive/04-positional-encoding/docs/en.md)
- [ ] <!-- lesson:07-transformers-deep-dive/05-full-transformer --> **07·05 The Full Transformer — Encoder + Decoder** · ~75 min · [material](../ai-engineering-from-scratch/phases/07-transformers-deep-dive/05-full-transformer/docs/en.md)
- [ ] <!-- lesson:07-transformers-deep-dive/07-gpt-causal-language-modeling --> **07·07 GPT — Causal Language Modeling** · ~75 min · [material](../ai-engineering-from-scratch/phases/07-transformers-deep-dive/07-gpt-causal-language-modeling/docs/en.md)
- [ ] <!-- lesson:10-llms-from-scratch/03-data-pipelines --> **10·03 Data Pipelines for Pre-Training** · ~90 min · [material](../ai-engineering-from-scratch/phases/10-llms-from-scratch/03-data-pipelines/docs/en.md)
- [ ] <!-- lesson:10-llms-from-scratch/04-pre-training-mini-gpt --> **10·04 Pre-Training a Mini GPT (124M Parameters)** · ~120 min · [material](../ai-engineering-from-scratch/phases/10-llms-from-scratch/04-pre-training-mini-gpt/docs/en.md)
- [ ] <!-- lesson:07-transformers-deep-dive/12-kv-cache-flash-attention --> **07·12 KV Cache, Flash Attention & Inference Optimization** · ~75 min · [material](../ai-engineering-from-scratch/phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md)

## E3 · LLM engineering: prompts, salidas estructuradas, embeddings y RAG

**Objetivo:** Construir una feature con contrato de salida validado y conocimiento externo con citas.  
**Entregable:** Asistente con tool use y salida estructurada + RAG con baseline BM25 vs dense/hybrid.  
**Papers de la etapa:** `cot`, `rag`, `sbert`, `lost-in-the-middle` (ver [papers/INDEX.md](../papers/INDEX.md))  

- [ ] <!-- lesson:11-llm-engineering/01-prompt-engineering --> **11·01 Prompt Engineering: Techniques & Patterns** · ~90 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/01-prompt-engineering/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/02-few-shot-cot --> **11·02 Few-Shot, Chain-of-Thought, Tree-of-Thought** · ~45 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/02-few-shot-cot/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/03-structured-outputs --> **11·03 Structured Outputs: JSON, Schema Validation, Constrained Decoding** · ~90 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/03-structured-outputs/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/09-function-calling --> **11·09 Function Calling & Tool Use** · ~75 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/09-function-calling/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/04-embeddings --> **11·04 Embeddings & Vector Representations** · ~75 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/04-embeddings/docs/en.md)
- [ ] <!-- lesson:05-nlp-foundations-to-advanced/22-embedding-models-deep-dive --> **05·22 Embedding Models — The 2026 Deep Dive** · ~60 min · [material](../ai-engineering-from-scratch/phases/05-nlp-foundations-to-advanced/22-embedding-models-deep-dive/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/05-context-engineering --> **11·05 Context Engineering: Windows, Budgets, Memory, and Retrieval** · ~90 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/05-context-engineering/docs/en.md)
- [ ] <!-- lesson:05-nlp-foundations-to-advanced/23-chunking-strategies-rag --> **05·23 Chunking Strategies for RAG** · ~60 min · [material](../ai-engineering-from-scratch/phases/05-nlp-foundations-to-advanced/23-chunking-strategies-rag/docs/en.md)
- [ ] <!-- lesson:00-setup-and-tooling/09-data-management --> **00·09 Data Management** · ~45 min · [material](../ai-engineering-from-scratch/phases/00-setup-and-tooling/09-data-management/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/06-rag --> **11·06 RAG (Retrieval-Augmented Generation)** · ~90 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/06-rag/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/07-advanced-rag --> **11·07 Advanced RAG (Chunking, Reranking, Hybrid Search)** · ~90 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/07-advanced-rag/docs/en.md)

## E4 · Evaluación, guardrails y costo

**Objetivo:** Medir calidad, latencia y costo juntos antes de tocar el sistema.  
**Entregable:** Suite de evals (golden set + LLM-as-judge calibrado), guardrails y scorecard calidad/latencia/costo.  
**Papers de la etapa:** `llm-judge` (ver [papers/INDEX.md](../papers/INDEX.md))  

- [ ] <!-- lesson:02-ml-fundamentals/09-model-evaluation --> **02·09 Model Evaluation** · ~90 min · [material](../ai-engineering-from-scratch/phases/02-ml-fundamentals/09-model-evaluation/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/10-evaluation --> **11·10 Evaluation & Testing LLM Applications** · ~45 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/10-evaluation/docs/en.md)
- [ ] <!-- lesson:05-nlp-foundations-to-advanced/27-llm-evaluation-frameworks --> **05·27 LLM Evaluation — RAGAS, DeepEval, G-Eval** · ~75 min · [material](../ai-engineering-from-scratch/phases/05-nlp-foundations-to-advanced/27-llm-evaluation-frameworks/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/11-caching-cost --> **11·11 Caching, Rate Limiting & Cost Optimization** · ~45 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/11-caching-cost/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/15-prompt-caching --> **11·15 Prompt Caching and Context Caching** · ~60 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/15-prompt-caching/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/12-guardrails --> **11·12 Guardrails, Safety & Content Filtering** · ~45 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/12-guardrails/docs/en.md)

## E5 · Agentes, herramientas y MCP

**Objetivo:** Decidir cuándo un agente supera a un workflow simple; construir el loop a mano y luego con framework.  
**Entregable:** Agente de investigación acotado + servidor MCP, evaluado contra un baseline determinista.  
**Papers de la etapa:** `react`, `reflexion`, `memgpt`, `indirect-injection` (ver [papers/INDEX.md](../papers/INDEX.md))  

- [ ] <!-- lesson:13-tools-and-protocols/01-the-tool-interface --> **13·01 The Tool Interface — Why Agents Need Structured I/O** · ~45 min · [material](../ai-engineering-from-scratch/phases/13-tools-and-protocols/01-the-tool-interface/docs/en.md)
- [ ] <!-- lesson:13-tools-and-protocols/05-tool-schema-design --> **13·05 Tool Schema Design — Naming, Descriptions, Parameter Constraints** · ~45 min · [material](../ai-engineering-from-scratch/phases/13-tools-and-protocols/05-tool-schema-design/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/01-the-agent-loop --> **14·01 The Agent Loop: Observe, Think, Act** · ~60 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/01-the-agent-loop/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/06-tool-use-and-function-calling --> **14·06 Tool Use and Function Calling** · ~60 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/06-tool-use-and-function-calling/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/12-anthropic-workflow-patterns --> **14·12 Anthropic's Workflow Patterns: Simple Over Complex** · ~60 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/12-anthropic-workflow-patterns/docs/en.md)
- [ ] <!-- lesson:13-tools-and-protocols/06-mcp-fundamentals --> **13·06 MCP Fundamentals: Stateless Requests and JSON-RPC** · ~55 min · [material](../ai-engineering-from-scratch/phases/13-tools-and-protocols/06-mcp-fundamentals/docs/en.md)
- [ ] <!-- lesson:13-tools-and-protocols/07-building-an-mcp-server --> **13·07 Building an MCP Server: Stateless Python and TypeScript** · ~85 min · [material](../ai-engineering-from-scratch/phases/13-tools-and-protocols/07-building-an-mcp-server/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/07-memory-virtual-context-memgpt --> **14·07 Agent Memory — Virtual Context and Memory Paging** · ~75 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/07-memory-virtual-context-memgpt/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/13-langgraph-stateful-graphs --> **14·13 Stateful Graph Orchestration — Durable Execution and Checkpoints** · ~75 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/13-langgraph-stateful-graphs/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/28-orchestration-patterns --> **14·28 Orchestration Patterns: Supervisor, Swarm, Hierarchical** · ~60 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/28-orchestration-patterns/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/26-failure-modes-agentic --> **14·26 Failure Modes: Why Agents Break** · ~60 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/26-failure-modes-agentic/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/27-prompt-injection-defense --> **14·27 Prompt Injection and the PVE Defense** · ~75 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/27-prompt-injection-defense/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/30-eval-driven-agent-development --> **14·30 Eval-Driven Agent Development** · ~60 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/30-eval-driven-agent-development/docs/en.md)

## E6 · Producción y LLMOps

**Objetivo:** Operar la feature como producto: observabilidad, límites, despliegue gradual y rollback.  
**Entregable:** Servicio desplegado o simulado con dashboard, SLO, costo estimado y rollback probado.  

- [ ] <!-- lesson:11-llm-engineering/13-production-app --> **11·13 Building a Production LLM Application** · ~120 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/13-production-app/docs/en.md)
- [ ] <!-- lesson:02-ml-fundamentals/19-ml-system-design --> **02·19 ML System Design — From Problem to Deployed Model** · ~110 min · [material](../ai-engineering-from-scratch/phases/02-ml-fundamentals/19-ml-system-design/docs/en.md)
- [ ] <!-- lesson:02-ml-fundamentals/20-model-monitoring-and-drift --> **02·20 Monitoring Models in Production — Data and Concept Drift** · ~110 min · [material](../ai-engineering-from-scratch/phases/02-ml-fundamentals/20-model-monitoring-and-drift/docs/en.md)
- [ ] <!-- lesson:00-setup-and-tooling/07-docker-for-ai --> **00·07 Docker for AI** · ~60 min · [material](../ai-engineering-from-scratch/phases/00-setup-and-tooling/07-docker-for-ai/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/13-llm-observability --> **17·13 LLM Observability Stack Selection** · ~60 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/13-llm-observability/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/19-ai-gateways --> **17·19 AI Gateways — LiteLLM, Portkey, Kong AI Gateway, Bifrost** · ~60 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/19-ai-gateways/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/29-model-demo-interfaces --> **17·29 Model Demo Interfaces — From a Function to a Shareable App** · ~90 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/29-model-demo-interfaces/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/20-shadow-canary-progressive --> **17·20 Shadow Traffic, Canary Rollout, and Progressive Deployment for LLMs** · ~60 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/20-shadow-canary-progressive/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/08-inference-metrics-goodput --> **17·08 Inference Metrics — TTFT, TPOT, ITL, Goodput, P99** · ~60 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/08-inference-metrics-goodput/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/21-ab-testing-llm-features --> **17·21 A/B Testing LLM Features — GrowthBook, Statsig, and the Vibes Problem** · ~60 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/21-ab-testing-llm-features/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/22-load-testing-llm-apis --> **17·22 Load Testing LLM APIs — Why k6 and Locust Lie** · ~75 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/22-load-testing-llm-apis/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/25-security-secrets-audit --> **17·25 Security — Secrets, API Key Rotation, Audit Logs, Guardrails** · ~60 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/25-security-secrets-audit/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/27-finops-llms --> **17·27 FinOps for LLMs — Unit Economics and Multi-Tenant Attribution** · ~60 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/27-finops-llms/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/23-sre-for-ai --> **17·23 SRE for AI — Multi-Agent Incident Response, Runbooks, Predictive Detection** · ~60 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/23-sre-for-ai/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/29-production-runtimes --> **14·29 Production Runtimes: Queue, Event, Cron** · ~60 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/29-production-runtimes/docs/en.md)

## E7 · Fine-tuning e inferencia

**Objetivo:** Decidir entre prompt, RAG, fine-tuning o no entrenar; entender el costo de servir un modelo.  
**Entregable:** Fine-tune pequeño con eval antes/después y model card, o diseño experimental justificado.  
**Papers de la etapa:** `instructgpt`, `lora`, `qlora`, `dpo`, `flashattention`, `vllm` (ver [papers/INDEX.md](../papers/INDEX.md))  

- [ ] <!-- lesson:10-llms-from-scratch/06-instruction-tuning-sft --> **10·06 Instruction Tuning (SFT)** · ~90 min · [material](../ai-engineering-from-scratch/phases/10-llms-from-scratch/06-instruction-tuning-sft/docs/en.md)
- [ ] <!-- lesson:11-llm-engineering/08-fine-tuning-lora --> **11·08 Fine-Tuning with LoRA & QLoRA** · ~75 min · [material](../ai-engineering-from-scratch/phases/11-llm-engineering/08-fine-tuning-lora/docs/en.md)
- [ ] <!-- lesson:10-llms-from-scratch/07-rlhf --> **10·07 RLHF: Reward Model + PPO** · ~90 min · [material](../ai-engineering-from-scratch/phases/10-llms-from-scratch/07-rlhf/docs/en.md)
- [ ] <!-- lesson:10-llms-from-scratch/08-dpo --> **10·08 DPO: Direct Preference Optimization** · ~90 min · [material](../ai-engineering-from-scratch/phases/10-llms-from-scratch/08-dpo/docs/en.md)
- [ ] <!-- lesson:10-llms-from-scratch/11-quantization --> **10·11 Quantization: Making Models Fit** · ~120 min · [material](../ai-engineering-from-scratch/phases/10-llms-from-scratch/11-quantization/docs/en.md)
- [ ] <!-- lesson:10-llms-from-scratch/12-inference-optimization --> **10·12 Inference Optimization** · ~120 min · [material](../ai-engineering-from-scratch/phases/10-llms-from-scratch/12-inference-optimization/docs/en.md)
- [ ] <!-- lesson:17-infrastructure-and-production/04-vllm-serving-internals --> **17·04 Serving Engine Internals — PagedAttention, Continuous Batching, Chunked Prefill** · ~75 min · [material](../ai-engineering-from-scratch/phases/17-infrastructure-and-production/04-vllm-serving-internals/docs/en.md)

## E8 · Seguridad y alineación aplicada

**Objetivo:** Modelar amenazas y probar defensas sobre el sistema que construiste.  
**Entregable:** Threat model, suite adversaria y reporte antes/después con riesgo residual.  
**Papers de la etapa:** `constitutional-ai` (ver [papers/INDEX.md](../papers/INDEX.md))  

- [ ] <!-- lesson:18-ethics-safety-alignment/15-indirect-prompt-injection --> **18·15 Indirect Prompt Injection — Production Attack Surface** · ~75 min · [material](../ai-engineering-from-scratch/phases/18-ethics-safety-alignment/15-indirect-prompt-injection/docs/en.md)
- [ ] <!-- lesson:18-ethics-safety-alignment/12-red-teaming-pair-automated-attacks --> **18·12 Red-Teaming: PAIR and Automated Attacks** · ~75 min · [material](../ai-engineering-from-scratch/phases/18-ethics-safety-alignment/12-red-teaming-pair-automated-attacks/docs/en.md)
- [ ] <!-- lesson:18-ethics-safety-alignment/16-red-team-tooling-garak-llamaguard-pyrit --> **18·16 Red-Team Tooling — Garak, Llama Guard, PyRIT** · ~75 min · [material](../ai-engineering-from-scratch/phases/18-ethics-safety-alignment/16-red-team-tooling-garak-llamaguard-pyrit/docs/en.md)
- [ ] <!-- lesson:18-ethics-safety-alignment/29-moderation-systems-openai-perspective-llamaguard --> **18·29 Moderation Systems — OpenAI, Perspective, Llama Guard** · ~60 min · [material](../ai-engineering-from-scratch/phases/18-ethics-safety-alignment/29-moderation-systems-openai-perspective-llamaguard/docs/en.md)
- [ ] <!-- lesson:18-ethics-safety-alignment/26-model-system-dataset-cards --> **18·26 Model, System, and Dataset Cards** · ~60 min · [material](../ai-engineering-from-scratch/phases/18-ethics-safety-alignment/26-model-system-dataset-cards/docs/en.md)

## E9 · Producto, consultoría y agentes de código

**Objetivo:** Pasar de un flujo de trabajo observado a un piloto medido; usar agentes de código con verificación.  
**Entregable:** Client memo, especificación, métricas de éxito y plan de piloto para un caso real.  

- [ ] <!-- lesson:14-agent-engineering/43-frame-the-task-before-code --> **14·43 Frame the Task Before the Agent Writes Code** · ~60 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/43-frame-the-task-before-code/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/44-plan-from-evidence --> **14·44 Build an Evidence-Backed Execution Plan** · ~65 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/44-plan-from-evidence/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/45-delegate-with-isolation --> **14·45 Delegate Agent Work with Isolation and Merge Contracts** · ~70 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/45-delegate-with-isolation/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/46-turn-feedback-into-system --> **14·46 Turn Every Agent Correction into a System Improvement** · ~65 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/46-turn-feedback-into-system/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/47-outcomes-before-output --> **14·47 Define the Outcome Before You Choose the Output** · ~60 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/47-outcomes-before-output/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/48-discover-the-real-workflow --> **14·48 Discover the Workflow People Actually Perform** · ~70 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/48-discover-the-real-workflow/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/49-map-assumptions-and-risk --> **14·49 Map Assumptions and Resolve the Riskiest One First** · ~65 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/49-map-assumptions-and-risk/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/50-choose-the-smallest-testable-slice --> **14·50 Choose the Smallest Slice That Can Change the Decision** · ~65 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/50-choose-the-smallest-testable-slice/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/51-write-specifications-that-preserve-judgment --> **14·51 Write Specifications That Preserve Judgment** · ~75 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/51-write-specifications-that-preserve-judgment/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/52-design-success-metrics --> **14·52 Design Success Metrics Before the Result Exists** · ~70 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/52-design-success-metrics/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/53-prototype-pilot-or-production --> **14·53 Choose Prototype, Pilot, or Production Deliberately** · ~70 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/53-prototype-pilot-or-production/docs/en.md)
- [ ] <!-- lesson:14-agent-engineering/54-build-the-feedback-ratchet --> **14·54 Build a Feedback Ratchet with Ownership and Retirement** · ~75 min · [material](../ai-engineering-from-scratch/phases/14-agent-engineering/54-build-the-feedback-ratchet/docs/en.md)

## E10 · Matemáticas: núcleo (al final, con contexto)

**Objetivo:** Repasar con las ideas que ya usaste: embeddings, atención, pérdida, gradientes y muestreo.  
**Entregable:** Ejercicios en NumPy y una explicación propia de cómo cada concepto aparece en tu mini-GPT y tu RAG.  

- [ ] <!-- lesson:01-math-foundations/01-linear-algebra-intuition --> **01·01 Linear Algebra Intuition** · ~60 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/01-linear-algebra-intuition/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/02-vectors-matrices-operations --> **01·02 Vectors, Matrices & Operations** · ~60 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/02-vectors-matrices-operations/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/03-matrix-transformations --> **01·03 Matrix Transformations** · ~75 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/03-matrix-transformations/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/04-calculus-for-ml --> **01·04 Calculus for Machine Learning** · ~60 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/04-calculus-for-ml/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/05-chain-rule-and-autodiff --> **01·05 Chain Rule & Automatic Differentiation** · ~90 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/05-chain-rule-and-autodiff/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/06-probability-and-distributions --> **01·06 Probability and Distributions** · ~75 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/06-probability-and-distributions/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/07-bayes-theorem --> **01·07 Bayes' Theorem** · ~75 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/07-bayes-theorem/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/08-optimization --> **01·08 Optimization** · ~75 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/08-optimization/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/09-information-theory --> **01·09 Information Theory** · ~60 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/09-information-theory/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/11-singular-value-decomposition --> **01·11 Singular Value Decomposition** · ~120 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/11-singular-value-decomposition/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/14-norms-and-distances --> **01·14 Norms and Distances** · ~90 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/14-norms-and-distances/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/15-statistics-for-ml --> **01·15 Statistics for Machine Learning** · ~120 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/15-statistics-for-ml/docs/en.md)

## E11 · ML clásico y matemáticas avanzadas (opcional)

**Objetivo:** Profundizar solo si un reto o una entrevista revela una laguna.  
**Entregable:** Lo que pida la laguna detectada.  

- [ ] <!-- lesson:02-ml-fundamentals/01-what-is-machine-learning --> **02·01 What Is Machine Learning** · ~45 min · [material](../ai-engineering-from-scratch/phases/02-ml-fundamentals/01-what-is-machine-learning/docs/en.md)
- [ ] <!-- lesson:02-ml-fundamentals/02-linear-regression --> **02·02 Linear Regression** · ~90 min · [material](../ai-engineering-from-scratch/phases/02-ml-fundamentals/02-linear-regression/docs/en.md)
- [ ] <!-- lesson:02-ml-fundamentals/03-logistic-regression --> **02·03 Logistic Regression** · ~90 min · [material](../ai-engineering-from-scratch/phases/02-ml-fundamentals/03-logistic-regression/docs/en.md)
- [ ] <!-- lesson:02-ml-fundamentals/10-bias-variance --> **02·10 Bias-Variance Tradeoff** · ~75 min · [material](../ai-engineering-from-scratch/phases/02-ml-fundamentals/10-bias-variance/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/10-dimensionality-reduction --> **01·10 Dimensionality Reduction** · ~90 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/10-dimensionality-reduction/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/12-tensor-operations --> **01·12 Tensor Operations** · ~90 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/12-tensor-operations/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/13-numerical-stability --> **01·13 Numerical Stability** · ~120 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/13-numerical-stability/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/16-sampling-methods --> **01·16 Sampling Methods** · ~120 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/16-sampling-methods/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/17-linear-systems --> **01·17 Linear Systems** · ~120 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/17-linear-systems/docs/en.md)
- [ ] <!-- lesson:01-math-foundations/18-convex-optimization --> **01·18 Convex Optimization** · ~90 min · [material](../ai-engineering-from-scratch/phases/01-math-foundations/18-convex-optimization/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/07-regularization --> **03·07 Regularization** · ~75 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/07-regularization/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/08-weight-initialization --> **03·08 Weight Initialization and Training Stability** · ~90 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/08-weight-initialization/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/09-learning-rate-schedules --> **03·09 Learning Rate Schedules and Warmup** · ~90 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/09-learning-rate-schedules/docs/en.md)
- [ ] <!-- lesson:03-deep-learning-core/13-debugging-neural-networks --> **03·13 Debugging Neural Networks** · ~90 min · [material](../ai-engineering-from-scratch/phases/03-deep-learning-core/13-debugging-neural-networks/docs/en.md)
- [ ] <!-- lesson:02-ml-fundamentals/21-feature-stores-and-training-serving-skew --> **02·21 Feature Stores and Training-Serving Skew** · ~100 min · [material](../ai-engineering-from-scratch/phases/02-ml-fundamentals/21-feature-stores-and-training-serving-skew/docs/en.md)
- [ ] <!-- lesson:07-transformers-deep-dive/14-build-a-transformer-capstone --> **07·14 Build a Transformer from Scratch — The Capstone** · ~120 min · [material](../ai-engineering-from-scratch/phases/07-transformers-deep-dive/14-build-a-transformer-capstone/docs/en.md)
