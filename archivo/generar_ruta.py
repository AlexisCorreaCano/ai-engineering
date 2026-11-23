#!/usr/bin/env python3
"""Genera ruta/RUTA.md: la ruta personal de estudio.

La ruta es una selección y un orden propio de lecciones del currículo
`ai-engineering-from-scratch/` (que se trata como solo lectura). Para cambiar
la ruta, edita STAGES aquí y vuelve a ejecutar:

    python3 scripts/generar_ruta.py

Las casillas marcadas se conservan (clave: carpeta de fase + carpeta de lección).
La primera vez migra los checks de `archivo/CHECKLIST-ESTUDIO.md`.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHASES = ROOT / "ai-engineering-from-scratch" / "phases"
OUTPUT = ROOT / "ruta" / "RUTA.md"
OLD_CHECKLIST = ROOT / "archivo" / "CHECKLIST-ESTUDIO.md"

# --------------------------------------------------------------------------
# Definición de la ruta. Cada etapa: objetivo observable, entregable, papers
# (ids de papers/INDEX.md) y lecciones "fase/lección".
# --------------------------------------------------------------------------
STAGES = [
    {
        "id": "E0",
        "titulo": "Diagnóstico y entorno",
        "objetivo": "Dejar un entorno reproducible y confirmar con un mini-reto qué lecciones de ingeniería puedes saltar.",
        "entregable": "Repo con entorno limpio, un test que reproduce un fallo y una llamada a un modelo por API.",
        "papers": [],
        "lecciones": [
            "00-setup-and-tooling/01-dev-environment",
            "00-setup-and-tooling/02-git-and-collaboration",
            "00-setup-and-tooling/04-apis-and-keys",
            "00-setup-and-tooling/05-jupyter-notebooks",
            "00-setup-and-tooling/06-python-environments",
            "00-setup-and-tooling/12-debugging-and-profiling",
        ],
    },
    {
        "id": "E1",
        "titulo": "Puente: redes neuronales mínimas",
        "objetivo": "Entender entrenamiento (pérdida, backprop, optimizador) lo justo para seguir transformers. Si backprop se siente opaco, adelanta 01/04 y 01/05 de matemáticas.",
        "entregable": "Red pequeña entrenada a mano y su equivalente en PyTorch, con curva de pérdida explicada.",
        "papers": [],
        "lecciones": [
            "03-deep-learning-core/01-the-perceptron",
            "03-deep-learning-core/02-multi-layer-networks",
            "03-deep-learning-core/03-backpropagation",
            "03-deep-learning-core/04-activation-functions",
            "03-deep-learning-core/05-loss-functions",
            "03-deep-learning-core/06-optimizers",
            "03-deep-learning-core/11-intro-to-pytorch",
            "05-nlp-foundations-to-advanced/09-sequence-to-sequence",
            "05-nlp-foundations-to-advanced/10-attention-mechanism",
        ],
    },
    {
        "id": "E2",
        "titulo": "Transformers y mini-GPT",
        "objetivo": "Explicar el camino texto → tokens → atención → siguiente token, y entrenar un GPT pequeño.",
        "entregable": "Tokenizador BPE, self-attention y mini-GPT con tests (continúa proyectos/fase-1).",
        "papers": ["bpe", "attention", "gpt2", "scaling-laws"],
        "lecciones": [
            "10-llms-from-scratch/01-tokenizers",
            "10-llms-from-scratch/02-building-a-tokenizer",
            "07-transformers-deep-dive/01-why-transformers",
            "07-transformers-deep-dive/02-self-attention-from-scratch",
            "07-transformers-deep-dive/03-multi-head-attention",
            "07-transformers-deep-dive/04-positional-encoding",
            "07-transformers-deep-dive/05-full-transformer",
            "07-transformers-deep-dive/07-gpt-causal-language-modeling",
            "10-llms-from-scratch/03-data-pipelines",
            "10-llms-from-scratch/04-pre-training-mini-gpt",
            "07-transformers-deep-dive/12-kv-cache-flash-attention",
        ],
    },
    {
        "id": "E3",
        "titulo": "LLM engineering: prompts, salidas estructuradas, embeddings y RAG",
        "objetivo": "Construir una feature con contrato de salida validado y conocimiento externo con citas.",
        "entregable": "Asistente con tool use y salida estructurada + RAG con baseline BM25 vs dense/hybrid.",
        "papers": ["cot", "rag", "sbert", "lost-in-the-middle"],
        "lecciones": [
            "11-llm-engineering/01-prompt-engineering",
            "11-llm-engineering/02-few-shot-cot",
            "11-llm-engineering/03-structured-outputs",
            "11-llm-engineering/09-function-calling",
            "11-llm-engineering/04-embeddings",
            "05-nlp-foundations-to-advanced/22-embedding-models-deep-dive",
            "11-llm-engineering/05-context-engineering",
            "05-nlp-foundations-to-advanced/23-chunking-strategies-rag",
            "00-setup-and-tooling/09-data-management",
            "11-llm-engineering/06-rag",
            "11-llm-engineering/07-advanced-rag",
        ],
    },
    {
        "id": "E4",
        "titulo": "Evaluación, guardrails y costo",
        "objetivo": "Medir calidad, latencia y costo juntos antes de tocar el sistema.",
        "entregable": "Suite de evals (golden set + LLM-as-judge calibrado), guardrails y scorecard calidad/latencia/costo.",
        "papers": ["llm-judge"],
        "lecciones": [
            "02-ml-fundamentals/09-model-evaluation",
            "11-llm-engineering/10-evaluation",
            "05-nlp-foundations-to-advanced/27-llm-evaluation-frameworks",
            "11-llm-engineering/11-caching-cost",
            "11-llm-engineering/15-prompt-caching",
            "11-llm-engineering/12-guardrails",
        ],
    },
    {
        "id": "E5",
        "titulo": "Agentes, herramientas y MCP",
        "objetivo": "Decidir cuándo un agente supera a un workflow simple; construir el loop a mano y luego con framework.",
        "entregable": "Agente de investigación acotado + servidor MCP, evaluado contra un baseline determinista.",
        "papers": ["react", "reflexion", "memgpt", "indirect-injection"],
        "lecciones": [
            "13-tools-and-protocols/01-the-tool-interface",
            "13-tools-and-protocols/05-tool-schema-design",
            "14-agent-engineering/01-the-agent-loop",
            "14-agent-engineering/06-tool-use-and-function-calling",
            "14-agent-engineering/12-anthropic-workflow-patterns",
            "13-tools-and-protocols/06-mcp-fundamentals",
            "13-tools-and-protocols/07-building-an-mcp-server",
            "14-agent-engineering/07-memory-virtual-context-memgpt",
            "14-agent-engineering/13-langgraph-stateful-graphs",
            "14-agent-engineering/28-orchestration-patterns",
            "14-agent-engineering/26-failure-modes-agentic",
            "14-agent-engineering/27-prompt-injection-defense",
            "14-agent-engineering/30-eval-driven-agent-development",
        ],
    },
    {
        "id": "E6",
        "titulo": "Producción y LLMOps",
        "objetivo": "Operar la feature como producto: observabilidad, límites, despliegue gradual y rollback.",
        "entregable": "Servicio desplegado o simulado con dashboard, SLO, costo estimado y rollback probado.",
        "papers": [],
        "lecciones": [
            "11-llm-engineering/13-production-app",
            "00-setup-and-tooling/07-docker-for-ai",
            "17-infrastructure-and-production/13-llm-observability",
            "17-infrastructure-and-production/19-ai-gateways",
            "17-infrastructure-and-production/20-shadow-canary-progressive",
            "17-infrastructure-and-production/08-inference-metrics-goodput",
            "17-infrastructure-and-production/21-ab-testing-llm-features",
            "17-infrastructure-and-production/22-load-testing-llm-apis",
            "17-infrastructure-and-production/25-security-secrets-audit",
            "17-infrastructure-and-production/27-finops-llms",
            "17-infrastructure-and-production/23-sre-for-ai",
            "14-agent-engineering/29-production-runtimes",
        ],
    },
    {
        "id": "E7",
        "titulo": "Fine-tuning e inferencia",
        "objetivo": "Decidir entre prompt, RAG, fine-tuning o no entrenar; entender el costo de servir un modelo.",
        "entregable": "Fine-tune pequeño con eval antes/después y model card, o diseño experimental justificado.",
        "papers": ["instructgpt", "lora", "qlora", "dpo", "flashattention", "vllm"],
        "lecciones": [
            "10-llms-from-scratch/06-instruction-tuning-sft",
            "11-llm-engineering/08-fine-tuning-lora",
            "10-llms-from-scratch/07-rlhf",
            "10-llms-from-scratch/08-dpo",
            "10-llms-from-scratch/11-quantization",
            "10-llms-from-scratch/12-inference-optimization",
            "17-infrastructure-and-production/04-vllm-serving-internals",
        ],
    },
    {
        "id": "E8",
        "titulo": "Seguridad y alineación aplicada",
        "objetivo": "Modelar amenazas y probar defensas sobre el sistema que construiste.",
        "entregable": "Threat model, suite adversaria y reporte antes/después con riesgo residual.",
        "papers": ["constitutional-ai"],
        "lecciones": [
            "18-ethics-safety-alignment/15-indirect-prompt-injection",
            "18-ethics-safety-alignment/12-red-teaming-pair-automated-attacks",
            "18-ethics-safety-alignment/16-red-team-tooling-garak-llamaguard-pyrit",
            "18-ethics-safety-alignment/29-moderation-systems-openai-perspective-llamaguard",
            "18-ethics-safety-alignment/26-model-system-dataset-cards",
        ],
    },
    {
        "id": "E9",
        "titulo": "Producto, consultoría y agentes de código",
        "objetivo": "Pasar de un flujo de trabajo observado a un piloto medido; usar agentes de código con verificación.",
        "entregable": "Client memo, especificación, métricas de éxito y plan de piloto para un caso real.",
        "papers": [],
        "lecciones": [
            "14-agent-engineering/43-frame-the-task-before-code",
            "14-agent-engineering/44-plan-from-evidence",
            "14-agent-engineering/45-delegate-with-isolation",
            "14-agent-engineering/46-turn-feedback-into-system",
            "14-agent-engineering/47-outcomes-before-output",
            "14-agent-engineering/48-discover-the-real-workflow",
            "14-agent-engineering/49-map-assumptions-and-risk",
            "14-agent-engineering/50-choose-the-smallest-testable-slice",
            "14-agent-engineering/51-write-specifications-that-preserve-judgment",
            "14-agent-engineering/52-design-success-metrics",
            "14-agent-engineering/53-prototype-pilot-or-production",
            "14-agent-engineering/54-build-the-feedback-ratchet",
        ],
    },
    {
        "id": "E10",
        "titulo": "Matemáticas: núcleo (al final, con contexto)",
        "objetivo": "Repasar con las ideas que ya usaste: embeddings, atención, pérdida, gradientes y muestreo.",
        "entregable": "Ejercicios en NumPy y una explicación propia de cómo cada concepto aparece en tu mini-GPT y tu RAG.",
        "papers": [],
        "lecciones": [
            "01-math-foundations/01-linear-algebra-intuition",
            "01-math-foundations/02-vectors-matrices-operations",
            "01-math-foundations/03-matrix-transformations",
            "01-math-foundations/04-calculus-for-ml",
            "01-math-foundations/05-chain-rule-and-autodiff",
            "01-math-foundations/06-probability-and-distributions",
            "01-math-foundations/07-bayes-theorem",
            "01-math-foundations/08-optimization",
            "01-math-foundations/09-information-theory",
            "01-math-foundations/11-singular-value-decomposition",
            "01-math-foundations/14-norms-and-distances",
            "01-math-foundations/15-statistics-for-ml",
        ],
    },
    {
        "id": "E11",
        "titulo": "ML clásico y matemáticas avanzadas",
        "objetivo": "Profundizar solo si un reto o una entrevista revela una laguna.",
        "entregable": "Lo que pida la laguna detectada.",
        "papers": [],
        "opcional": True,
        "lecciones": [
            "02-ml-fundamentals/01-what-is-machine-learning",
            "02-ml-fundamentals/02-linear-regression",
            "02-ml-fundamentals/03-logistic-regression",
            "02-ml-fundamentals/10-bias-variance",
            "01-math-foundations/10-dimensionality-reduction",
            "01-math-foundations/12-tensor-operations",
            "01-math-foundations/13-numerical-stability",
            "01-math-foundations/16-sampling-methods",
            "01-math-foundations/17-linear-systems",
            "01-math-foundations/18-convex-optimization",
            "03-deep-learning-core/07-regularization",
            "03-deep-learning-core/08-weight-initialization",
            "03-deep-learning-core/09-learning-rate-schedules",
            "03-deep-learning-core/13-debugging-neural-networks",
            "07-transformers-deep-dive/14-build-a-transformer-capstone",
        ],
    },
]

TIME_RE = re.compile(r"\*\*Time:\*\*\s*~?\s*([\d.]+)\s*(hours?|hrs?|h|minutes?|mins?|m)\b", re.I)


def lesson_info(key: str) -> dict:
    folder = PHASES / key
    doc = folder / "docs" / "en.md"
    if not doc.is_file():
        sys.exit(f"ERROR: no existe la lección {key} ({doc})")
    text = doc.read_text(encoding="utf-8")
    title = next((l[2:].strip() for l in text.splitlines() if l.startswith("# ")), key)
    minutes = None
    m = TIME_RE.search(text)
    if m:
        value = float(m.group(1))
        minutes = int(value * 60) if m.group(2).lower().startswith("h") else int(value)
    phase, lesson = key.split("/")
    return {"title": title, "minutes": minutes, "num": f"{phase[:2]}·{lesson[:2]}"}


def previous_state() -> set[str]:
    done: set[str] = set()
    if OUTPUT.exists():
        for line in OUTPUT.read_text(encoding="utf-8").splitlines():
            m = re.match(r"- \[[xX]\] <!-- lesson:(\S+) -->", line)
            if m:
                done.add(m.group(1))
    elif OLD_CHECKLIST.exists():  # migración de una sola vez, solo si RUTA.md aún no existe
        for line in OLD_CHECKLIST.read_text(encoding="utf-8").splitlines():
            m = re.match(r"- \[[xX]\] \*\*.*?\*\* \(\[material\]\(ai-engineering-from-scratch/phases/([^/]+/[^/]+)/docs/en\.md\)\)", line)
            if m:
                done.add(m.group(1))
    return done


def fmt_hours(minutes: int) -> str:
    return f"{minutes / 60:.1f} h"


def main() -> None:
    done = previous_state()
    seen: set[str] = set()
    rows = []
    body: list[str] = []
    total_min = total_done = total_lessons = 0

    for st in STAGES:
        infos = []
        for key in st["lecciones"]:
            if key in seen:
                sys.exit(f"ERROR: lección repetida en la ruta: {key}")
            seen.add(key)
            infos.append((key, lesson_info(key)))
        mins = sum(i["minutes"] or 0 for _, i in infos)
        n_done = sum(1 for k, _ in infos if k in done)
        total_min += mins
        total_done += n_done
        total_lessons += len(infos)
        etiqueta = " (opcional)" if st.get("opcional") else ""
        rows.append(f"| {st['id']} | {st['titulo']}{etiqueta} | {n_done}/{len(infos)} | {fmt_hours(mins)} |")

        body.append(f"## {st['id']} · {st['titulo']}{etiqueta}\n")
        body.append(f"**Objetivo:** {st['objetivo']}  ")
        body.append(f"**Entregable:** {st['entregable']}  ")
        if st["papers"]:
            body.append("**Papers de la etapa:** " + ", ".join(f"`{p}`" for p in st["papers"]) + " (ver [papers/INDEX.md](../papers/INDEX.md))  ")
        body.append("")
        for key, i in infos:
            mark = "x" if key in done else " "
            t = f" · ~{i['minutes']} min" if i["minutes"] else ""
            body.append(
                f"- [{mark}] <!-- lesson:{key} --> **{i['num']} {i['title']}**{t} "
                f"· [material](../ai-engineering-from-scratch/phases/{key}/docs/en.md)"
            )
        body.append("")

    header = f"""# Ruta personal de estudio

> **Generado por `scripts/generar_ruta.py`.** No edites las listas a mano: cambia `STAGES` en el script y vuelve a ejecutarlo (las casillas marcadas se conservan).
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
""" + "\n".join(rows) + f"""
| | **Total** | **{total_done}/{total_lessons}** | **{fmt_hours(total_min)}** |

"""
    OUTPUT.write_text(header + "\n".join(body), encoding="utf-8")
    print(f"OK: {OUTPUT.relative_to(ROOT)} · {total_lessons} lecciones · {fmt_hours(total_min)} · {total_done} marcadas")


if __name__ == "__main__":
    main()
