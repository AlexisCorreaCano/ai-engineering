# Transformer minimal — Fase 1, Semanas 2-4

Implementación desde cero de un transformer estilo GPT, basada en la arquitectura del paper *"Attention Is All You Need"* (Vaswani et al., 2017).

## Por qué

El transformer es el corazón de los LLMs modernos. Construir uno desde cero es la mejor forma de entender **cómo funciona el modelo que predice el próximo token** — qué ocurre adentro de las capas de atención, cómo se entrenan los parámetros, cómo se genera texto.

## Plan

| Semana | Foco | Status |
|--------|------|--------|
| 2 | Self-attention → multi-head → feed-forward → positional encoding | ⏳ |
| 3 | Training loop + generación de texto | ⏳ |
| 4 | Optimizaciones (cuantización, batching) + comparación con LLMs grandes | ⏳ |

## Recursos

- 🎥 Video: [Karpathy — *"Let's build GPT from scratch"*](https://www.youtube.com/watch?v=kCc8FmEb1nY) (~4h)
- 💻 Repo de referencia: [github.com/karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) (~300 líneas)

## Estructura

```
transformer/
├── src/
│   └── transformer/    # paquete Python
├── tests/              # tests con pytest
├── notebooks/          # exploración interactiva
└── README.md           # este archivo
```

## Hardware

CPU puede funcionar para entrenamientos chicos. La Mac M2 Pro con Metal/MPS es excelente para acelerar.
