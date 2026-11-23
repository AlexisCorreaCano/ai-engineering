# Notas

El paper de attention is all you need hable de como con solo los transformes puede obtener
un mejor resultado y en menos tiempo, eliminando RNN (RNN — Recurrent Neural Network
(red neuronal recurrente) Procesa la secuencia palabra por palabra, arrastrando una memoria.
Cada paso mira la palabra actual + la memoria acumulada de las anteriores.) y CNN (
Convolutional Neural Network (red neuronal convolucional) Procesa la secuencia mirando
ventanas de N palabras a la vez y deslizándose. En cada ventana aplica un filtro).

## El flujo completo — paso a paso:
Voy a usar un ejemplo concreto: traducir "El gato come" (español) → "The cat eats" (inglés).
### FASE 1 — Preparación del input
"El gato come"
   ↓ (cada palabra se convierte en un vector de 512 nums — embedding)
   ↓ (se le suma información de posición — positional encoding)
   ↓
Entrada lista para el encoder
### FASE 2 — El encoder procesa (6 capas)
Capa 1:
  Input → Self-attention (8 heads en paralelo) → cada palabra "mira" a las demás
       → Feed-forward → "momento de pensar" sobre cada palabra
       → Output refinado
Capa 2: (misma estructura, sobre el output de la capa 1)
...
Capa 6:
       → REPRESENTACIÓN FINAL del input (lo que el paper llama "z")

Cada capa refina la representación. La capa 1 mira relaciones simples
(sintaxis básica). La capa 6 mira relaciones profundas (significado).
### FASE 3 — El decoder genera la salida (una palabra por vez)
Iteración 1: producir "The"
Decoder capa 1:
  Masked self-attention → "The" mira solo a sí misma (única palabra generada)
  Encoder-decoder attention → "The" pregunta al encoder "¿qué del input me sirve?"
                           → el encoder responde con los keys/values de "El gato come"
  Feed-forward → combina y refina
  (idem capas 2-6)

Output projection → softmax → probabilidad sobre todo el vocabulario inglés:
  "cat" → 0.42
  "dog" → 0.08
  "eats" → 0.03
  ...

→ Elegimos "cat" (la más probable). La agregamos a la salida.

Estado: "The cat"
Iteración 2: producir "eats"
Decoder (mismas 6 capas):
  Masked self-attention → "The" y "cat" se miran entre sí
  Encoder-decoder attention → "cat" pregunta al encoder "¿qué más me sirve?"
  Feed-forward → refina
  Output projection → softmax → probabilides

→ Elegimos "eats"

Output final: "The cat eats" ✓
El flujo resumido en una sola imagen:
INPUT
  ↓ embeddings + positional encoding
ENCODER (×6 capas: self-attention + feed-forward)
  ↓ representación del input
DECODER (×6 capas, se repite por cada palabra de salida):
  masked self-attention → mira palabras ya generadas
  encoder-decoder attention → consulta al encoder
  feed-forward → refina
  ↓
Output projection → softmax → probabilidad sobre vocabulario
  ↓
PALABRA ELEGIDA → se agrega a la salida

(El bloque DECODER se repite hasta producir una palabra de fin de secuencia)

---

## Tokenizador

Convierte texto en IDs numéricos. Para eso, aprende un vocabulario a partir de una muestra de un corpus: cuenta qué combinaciones de bytes aparecen con más frecuencia y las une en tokens.

Por ejemplo, en español aprende que "qu", "de ", "que ", terminaciones verbales "-ar"/"-er" son frecuentes y los vuelve tokens individuales.

Las empresas grandes entrenan el LLM con corpus enormes (Common Crawl, Wikipedia, GitHub, libros — todos limpios y filtrados). Pero el tokenizador se entrena con una muestra pequeña de ese corpus, no con todo.

El resultado es un vocabulario eficiente — el texto se comprime a menos tokens. La compresión es consecuencia, no el objetivo: lo que importa es darle al LLM una representación útil.
