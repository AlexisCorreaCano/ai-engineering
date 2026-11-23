# Self-Attention 3D — AI Engineering

Visualización 3D interactiva del flujo de **single-head self-attention**, con
los mismos pasos y matemática que la [versión 2D](../attention.html) pero
con la geometría al frente. Implementada con [Three.js](https://threejs.org/)
(ES modules, sin build step) sobre CDN.

## Qué hace

Tres tokens en un anillo horizontal; cada uno proyecta tres vectores
(Q/K/V) en 3D; los scores se dibujan como aristas cuyo color/opacidad
refleja su valor; tras softmax, partículas fluyen por las aristas con
intensidad proporcional al peso; el output es un nodo azul con su vector
contextualizado.

## Archivos

- **`index.html`** — markup, importmap de Three.js, paneles laterales
- **`main.js`** — math + escena Three.js + UI
- **`styles.css`** — estilos locales (hereda `../style.css`)
- **`README.md`** — este archivo

## Cómo abrirlo

Sin build step. Opciones:

```sh
# 1. Servidor estático (recomendado)
cd fase-1/visualizaciones
python3 -m http.server 8000
# abrí http://localhost:8000/attention-threejs/

# 2. Apertura directa
open fase-1/visualizaciones/attention-threejs/index.html
```

Importante: si abrís el HTML con `file://`, algunos navegadores
bloquean los módulos ES desde CDN. Usá servidor estático si ves la
escena en blanco.

## Matemática (idéntica a la versión 2D)

```
x   ∈ R^{3, 8}      // input embeddings (receta determinística)
Wq, Wk, Wv ∈ R^{8, 8}  // matrices aprendibles (kaiming init, seed)
Q = x @ Wq           ∈ R^{3, 8}     // query
K = x @ Wk           ∈ R^{3, 8}     // key
V = x @ Wv           ∈ R^{3, 8}     // value
scores = Q @ Kᵀ      ∈ R^{3, 3}     // producto punto en 8D
attn   = softmax(scores / √8)        // pesos por fila (suman 1)
output = attn @ V     ∈ R^{3, 8}    // mezcla ponderada
```

Cada celda `scores[i][j] = Σ_d Q[i,d] · K[j,d]` se interpreta
geométricamente como **similitud direccional** entre la query del
token i y la key del token j: vectores alineados → score alto;
perpendiculares → 0; opuestos → negativo.

## Determinismo

- **Seed por defecto: 42.** La misma seed da siempre los mismos
  embeddings, matrices W, Q/K/V, scores y output.
- Botón **↻** (junto al input de semilla) genera una nueva seed y
  rerenderiza todo. Útil para ver cómo cambian los scores al
  re-inicializar los pesos (todavía aleatorios).

## Pasos (7, en línea con la versión 2D)

1. **Input embeddings** — x [n=3, d=8], demo (no pretrained).
2. **W_q, W_k, W_v** — matrices [8, 8] con init kaiming, learnable.
3. **Q/K/V** — tres flechas por token, una por proyección.
4. **Scores = Q @ Kᵀ** — aristas ámbar con opacidad ∝ |score|.
   Panel lateral muestra el cálculo `Σ_d Q[i,d] · K[j,d]` paso a paso.
5. **Softmax** — aristas ahora ∝ attn[i,j]; barras por fila que suman 1.
6. **Weighted sum** — partículas ámbar fluyen por las aristas hacia
   cada output. Receta de mezcla `Σ_j attn[i,j] · V[j]` por fila.
7. **Output** — nodos azules + flecha azul por token, con la receta
   completa de mezcla al costado.

## Controles

- **Drag** (botón izquierdo): orbitar la cámara
- **Wheel / pinch**: zoom
- **Click en un token**: resaltarlo en el paso 1
- **← / →**: paso anterior / siguiente
- **Reproducir**: avanza solo cada 2.4 s
- **Reiniciar**: vuelve al paso 1 con los inputs actuales
- **↻ seed**: nueva semilla aleatoria

## Accesibilidad

- `aria-label`s en canvas, botones, inputs
- `prefers-reduced-motion`: desactiva partículas y auto-orbit
- Mensaje de fallback si WebGL no está disponible
- Canvas focusable con outline de foco

## Limitaciones

- **`d_model` está fijado en 8** en esta vista — no configurable.
  La versión 2D permite ajustar `d_model` para experimentar.
- **Máximo 3 tokens** (igual que en el notebook toy).
- Las **matrices W no son entrenables** en la UI; son fijas a la
  inicialización. El flujo asume pesos ya aprendidos, como hace el
  notebook.
- La **proyección 3D** de los vectores usa solo las primeras 3 de las
  8 coordenadas (es una visualización, no la geometría real). El
  producto punto y los scores sí usan las 8 dimensiones completas.
- **No hay backprop visible.** La idea es entender el forward pass;
  el entrenamiento se cubre en los notebooks.

## Créditos

- Three.js 0.161.0 vía `https://cdn.jsdelivr.net/npm/three@0.161.0/`
- Hereda tokens visuales y tipografía de
  [`../style.css`](../style.css)
