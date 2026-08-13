# Tokenizador BPE — Fase 1, Semana 1

Implementación de un tokenizador **Byte Pair Encoding (BPE)** desde cero, siguiendo el estilo de Karpathy.

## Por qué

El tokenizador es la **puerta de entrada** de cualquier modelo de lenguaje. Si partís mal las palabras, el modelo no puede aprender bien. Construirlo desde cero es la mejor forma de entender **cada decisión** que toma (qué es un token, cómo se cuentan frecuencias, cómo se hacen los merges, cómo se encodea/decodea).

## Recursos

- 🎥 Video: [Karpathy — *"Let's build the GPT Tokenizer"*](https://www.youtube.com/watch?v=zduSFxRajkE) (~2h)
- 💻 Repo de referencia: [github.com/karpathy/minbpe](https://github.com/karpathy/minbpe) (~300 líneas)

## Plan de la semana

| Paso | Qué | Status |
|------|-----|--------|
| 1 | Ver el video de Karpathy | ⏳ |
| 2 | Clonar `minbpe` y leer el código | ⏳ |
| 3 | Implementar `BasicTokenizer` desde cero | ⏳ |
| 4 | Entrenar con un corpus chico | ⏳ |
| 5 | Round-trip test (encode → decode) | ⏳ |

## Estructura

```
tokenizador/
├── src/
│   └── tokenizador/    # paquete Python
├── tests/              # tests con pytest
└── README.md           # este archivo
```

## Hardware

CPU puro. La Mac M2 Pro sirve perfectamente. No hace falta GPU.
