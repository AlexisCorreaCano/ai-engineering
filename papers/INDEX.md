# Índice de papers

Los `id` se citan desde [../ruta/RUTA.md](../ruta/RUTA.md). El protocolo y los estados están en [PROTOCOLO.md](PROTOCOLO.md). Estado inicial: todo `pendiente`, salvo lo indicado.

> Los identificadores arXiv son de partida; el tutor verifica título, autoría y versión al abrir cada paper.

| id | Paper | Enlace | Etapa | Estado | Notas |
|---|---|---|---|---|---|
| `bpe` | Sennrich et al. — *Neural Machine Translation of Rare Words with Subword Units* (BPE) | [arXiv 1508.07909](https://arxiv.org/abs/1508.07909) | E2 | pendiente | Ya implementaste BPE en `proyectos/fase-1/tokenizador` |
| `attention` | Vaswani et al. — *Attention Is All You Need* | [arXiv 1706.03762](https://arxiv.org/abs/1706.03762) | E2 | en progreso | Hay apuntes propios en el vault; falta sesión de paper formal |
| `gpt2` | Radford et al. — *Language Models are Unsupervised Multitask Learners* (GPT-2) | [OpenAI, 2019](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) | E2 | pendiente | Referencia del mini-GPT de 124M |
| `scaling-laws` | Kaplan et al. — *Scaling Laws for Neural Language Models* · Hoffmann et al. — *Chinchilla* | [2001.08361](https://arxiv.org/abs/2001.08361) · [2203.15556](https://arxiv.org/abs/2203.15556) | E2 | pendiente | Leer los dos y contrastarlos |
| `cot` | Wei et al. — *Chain-of-Thought Prompting* | [arXiv 2201.11903](https://arxiv.org/abs/2201.11903) | E3 | pendiente | |
| `rag` | Lewis et al. — *Retrieval-Augmented Generation for Knowledge-Intensive NLP* | [arXiv 2005.11401](https://arxiv.org/abs/2005.11401) | E3 | pendiente | |
| `sbert` | Reimers & Gurevych — *Sentence-BERT* | [arXiv 1908.10084](https://arxiv.org/abs/1908.10084) | E3 | pendiente | Base de los embeddings de oraciones |
| `lost-in-the-middle` | Liu et al. — *Lost in the Middle* | [arXiv 2307.03172](https://arxiv.org/abs/2307.03172) | E3 | pendiente | Contexto largo y posición |
| `llm-judge` | Zheng et al. — *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena* | [arXiv 2306.05685](https://arxiv.org/abs/2306.05685) | E4 | pendiente | Sesgos del juez; calibrar con humanos |
| `react` | Yao et al. — *ReAct* | [arXiv 2210.03629](https://arxiv.org/abs/2210.03629) | E5 | pendiente | |
| `reflexion` | Shinn et al. — *Reflexion* | [arXiv 2303.11366](https://arxiv.org/abs/2303.11366) | E5 | pendiente | |
| `memgpt` | Packer et al. — *MemGPT* | [arXiv 2310.08560](https://arxiv.org/abs/2310.08560) | E5 | pendiente | |
| `indirect-injection` | Greshake et al. — *Not what you've signed up for* (indirect prompt injection) | [arXiv 2302.12173](https://arxiv.org/abs/2302.12173) | E5 / E8 | pendiente | |
| `instructgpt` | Ouyang et al. — *Training language models to follow instructions with human feedback* | [arXiv 2203.02155](https://arxiv.org/abs/2203.02155) | E7 | pendiente | |
| `lora` | Hu et al. — *LoRA* | [arXiv 2106.09685](https://arxiv.org/abs/2106.09685) | E7 | pendiente | |
| `qlora` | Dettmers et al. — *QLoRA* | [arXiv 2305.14314](https://arxiv.org/abs/2305.14314) | E7 | pendiente | |
| `dpo` | Rafailov et al. — *Direct Preference Optimization* | [arXiv 2305.18290](https://arxiv.org/abs/2305.18290) | E7 | pendiente | |
| `flashattention` | Dao et al. — *FlashAttention* | [arXiv 2205.14135](https://arxiv.org/abs/2205.14135) | E7 | pendiente | |
| `vllm` | Kwon et al. — *Efficient Memory Management for LLM Serving with PagedAttention* | [arXiv 2309.06180](https://arxiv.org/abs/2309.06180) | E7 | pendiente | |
| `constitutional-ai` | Bai et al. — *Constitutional AI* | [arXiv 2212.08073](https://arxiv.org/abs/2212.08073) | E8 | pendiente | |

## Lecturas no-paper de referencia

- Anthropic — [*Building Effective Agents*](https://www.anthropic.com/engineering/building-effective-agents) (E5).
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/) y [NIST Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) (E8).

## Cómo añadir un paper

Agrega una fila con `id` corto, enlace, etapa y estado `pendiente`; si lo vas a leer pronto, crea la nota `ai-engineering/papers/<id>.md` en tu vault con la plantilla de [../tutor/PLANTILLAS.md](../tutor/PLANTILLAS.md).
