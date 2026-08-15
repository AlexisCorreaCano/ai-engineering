# Visualizaciones de AI Engineering

Dos visualizaciones interactivas para entender los conceptos centrales de un
modelo de lenguaje. Vanilla HTML/CSS/JS — sin frameworks.

## Contenido

- **`index.html`** — página de inicio con navegación
- **`tokenizer.html`** + `tokenizer.js` — BPE Tokenizer paso a paso
- **`attention.html`** + `attention.js` — Self-Attention paso a paso
- **`style.css`** — estilos compartidos

## Cómo abrirlo

Opción 1 — Abrir directamente:

```sh
open index.html
```

Opción 2 — Servidor local (recomendado, evita restricciones de file:// en algunos navegadores):

```sh
python3 -m http.server 8000
# luego abrí http://localhost:8000
```

## Cómo usarlo

Ambas visualizaciones funcionan igual:

1. Editá los inputs de arriba (texto, parámetros) — se reentrena automáticamente
2. Avanzá con el botón **Siguiente** o las flechas ← → del teclado
3. Tocá **Reproducir** para que avance solo (pausa con el mismo botón)

### BPE Tokenizer

Sigue el algoritmo de `BasicTokenizer` (en `fase-1/tokenizador/`) en 7 pasos:

1. Texto de entrada
2. Codificación UTF-8 (cada char → 1+ bytes)
3. Tokens iniciales (cada byte = un token, IDs 0–255)
4. Conteo de pares adyacentes (con el ganador destacado)
5. Merge #1 animado (antes/después)
6. Todos los merges aprendidos (tabla + encoding final)
7. Resultado: encoding de texto nuevo con el vocabulario aprendido

### Self-Attention

Sigue la matemática del notebook `01-self-attention.ipynb` en 7 pasos:

1. Input embeddings (n × d_model)
2. Matrices W_q, W_k, W_v (d × d, learnable)
3. Proyecciones Q, K, V (n × d)
4. Scores = Q @ Kᵀ (n × n) — con heatmap
5. Softmax → attention weights (n × n)
6. Weighted sum: attn @ V → output (n × d)
7. Output contextualizado (input vs output lado a lado)

Las matrices W se generan con un PRNG sembrado (semilla = 42) para que los
valores sean reproducibles — los mismos cada vez que recargás.

## Limitaciones

- **`d_model` está limitado a 4–8** para que las matrices entren en pantalla.
- **Máximo 8 tokens** en attention por la misma razón.
- **Las matrices W no son entrenables** en la UI (son fijas). El flujo de
  atención asume pesos ya aprendidos, como hace el notebook.
- **No hay backprop visible.** La idea es entender el forward pass; el
  entrenamiento se cubre en los notebooks.
- En attention con d_model ≠ 8 o n ≠ 4, los embeddings se generan con un
  fallback seeded (no son los valores exactos del notebook).