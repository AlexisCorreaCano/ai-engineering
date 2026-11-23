/* ============================================================
   Self-Attention — Visualización interactiva
   ============================================================
   Implementación 1:1 con el notebook 01-self-attention.ipynb.

   Pasos:
   1. Input embeddings  x: (n, d)
   2. Matrices W_q, W_k, W_v: (d, d) — learnable
   3. Proyecciones        Q, K, V = x @ W: (n, d)
   4. Scores              Q @ K^T: (n, n)
   5. Softmax             attn: (n, n)
   6. Weighted sum        attn @ V: (n, d)
   7. Output              contextualizado: (n, d)
*/

// ============================================================
// 1. Utilidades numéricas
// ============================================================

// PRNG sembrado (mulberry32) — para que las matrices W sean estables
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randn(rng) {
  // Box-Muller
  const u1 = Math.max(rng(), 1e-12);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function matMul(A, B) {
  const m = A.length, k = A[0].length, n = B[0].length;
  const C = [];
  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let p = 0; p < k; p++) s += A[i][p] * B[p][j];
      row.push(s);
    }
    C.push(row);
  }
  return C;
}

function transpose(A) {
  return A[0].map((_, j) => A.map(r => r[j]));
}

function softmaxRow(row) {
  const max = Math.max(...row);
  const exps = row.map(v => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

function softmax(A) {
  return A.map(softmaxRow);
}

function scaleMatrix(A, factor) {
  return A.map(row => row.map(v => v / factor));
}

function zeros(rows, cols) {
  return Array.from({ length: rows }, () => new Array(cols).fill(0));
}

function fmt(v, decimals = 2) {
  if (Math.abs(v) < 0.005) return '0.00';
  return v.toFixed(decimals);
}

// ============================================================
// 2. Pipeline completo de self-attention
// ============================================================

function runAttention(tokens, dModel, seed = 42) {
  const n = tokens.length;
  const rng = mulberry32(seed);

  // 1. Input embeddings — usamos los valores del notebook (fijo, no random)
  // Si dModel < 8, truncamos; si > 8, extendemos con ruido
  const notebookX = [
    [1.0, 0.5, 0.2, 0.8, 0.1, 0.4, 0.3, 0.9],
    [0.2, 0.9, 0.4, 0.1, 0.7, 0.3, 0.8, 0.5],
    [0.6, 0.1, 0.9, 0.4, 0.2, 0.7, 0.5, 0.3],
    [0.3, 0.7, 0.2, 0.9, 0.5, 0.6, 0.1, 0.8],
  ];

  let x;
  if (n === 4 && dModel === 8) {
    x = notebookX;
  } else {
    // Generar embeddings con la misma semilla para consistencia
    x = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < dModel; j++) {
        if (i < 4 && j < 8) row.push(notebookX[i][j]);
        else row.push(rng());
      }
      x.push(row);
    }
  }

  // 2. W matrices — kaiming init
  function kaiming(d) {
    const std = Math.sqrt(2 / d);
    return Array.from({ length: d }, () =>
      Array.from({ length: d }, () => randn(rng) * std)
    );
  }
  const Wq = kaiming(dModel);
  const Wk = kaiming(dModel);
  const Wv = kaiming(dModel);

  // 3. Q, K, V
  const Q = matMul(x, Wq);
  const K = matMul(x, Wk);
  const V = matMul(x, Wv);

  // 4. scores = Q @ K^T
  const KT = transpose(K);
  const rawScores = matMul(Q, KT);

  // 5. Scale + softmax
  const dK = dModel;
  const scaledScores = scaleMatrix(rawScores, Math.sqrt(dK));
  const attn = softmax(scaledScores);

  // 6. output = attn @ V
  const output = matMul(attn, V);

  return {
    tokens,
    dModel,
    n,
    x,
    Wq, Wk, Wv,
    Q, K, V,
    KT,
    rawScores,
    scaledScores,
    attn,
    output,
  };
}

// ============================================================
// 3. Colores
// ============================================================

const COLORS = {
  bg: '#0a0e1a',
  bgElev: '#131825',
  bgOverlay: '#1a2030',
  border: '#364056',
  text: '#e8eaf0',
  muted: '#6b7280',
  secondary: '#9ba3b5',

  // Accents por tipo de matriz
  input:    { hue: 158, name: 'input',   label: 'input',   text: '#6ee7b7' },
  output:   { hue: 217, name: 'output',  label: 'output',  text: '#60a5fa' },
  q:        { hue: 258, name: 'q',       label: 'Q',       text: '#a78bfa' },
  k:        { hue: 330, name: 'k',       label: 'K',       text: '#f472b6' },
  v:        { hue: 25,  name: 'v',       label: 'V',       text: '#fb923c' },
  wq:       { hue: 258, name: 'wq',      label: 'W_q',     text: '#a78bfa' },
  wk:       { hue: 330, name: 'wk',      label: 'W_k',     text: '#f472b6' },
  wv:       { hue: 25,  name: 'wv',      label: 'W_v',     text: '#fb923c' },
  scores:   { hue: 45,  name: 'scores',  label: 'scores',  text: '#fbbf24' },
  merge:    { hue: 158, name: 'merge',   label: 'merge',   text: '#34d399' },
};

function matrixToHue(value, minAbs, maxAbs, hue) {
  // Mapea |value| a lightness en HSL
  const t = maxAbs > minAbs ? (Math.abs(value) - minAbs) / (maxAbs - minAbs) : 0.5;
  const lightness = 14 + t * 48; // 14% → 62%
  const sat = 55 + t * 25;
  return `hsl(${hue}, ${sat}%, ${lightness}%)`;
}

function heatmapColor(t) {
  // t en [0, 1] → green→yellow→red
  const stops = [
    [0.0,  [15, 23, 42]],     // slate-900 (fondo)
    [0.1,  [6, 78, 59]],      // emerald-900
    [0.25, [16, 185, 129]],   // emerald-500
    [0.45, [253, 224, 71]],   // yellow-300
    [0.7,  [251, 146, 60]],   // orange-400
    [1.0,  [220, 38, 38]],    // red-600
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i][0] && t <= stops[i + 1][0]) {
      const [t0, c0] = stops[i];
      const [t1, c1] = stops[i + 1];
      const s = (t - t0) / (t1 - t0);
      return `rgb(${Math.round(c0[0] + s * (c1[0] - c0[0]))}, ${Math.round(c0[1] + s * (c1[1] - c0[1]))}, ${Math.round(c0[2] + s * (c1[2] - c0[2]))})`;
    }
  }
  return 'rgb(0,0,0)';
}

function textColorFor(bgLightness) {
  return bgLightness > 45 ? '#0a0e1a' : '#e8eaf0';
}

// ============================================================
// 4. Renderers de matrices
// ============================================================

function matrixAbsRange(M) {
  let min = Infinity, max = -Infinity;
  for (const row of M) for (const v of row) {
    if (Math.abs(v) < min) min = Math.abs(v);
    if (Math.abs(v) > max) max = Math.abs(v);
  }
  return [min, max];
}

function renderMatrixSVG(M, opts = {}) {
  const {
    color = 'input',
    cellSize = null,
    decimals = 2,
    showValues = true,
    cellGap = 1,
    highlight = null,         // {row: number} o null
    rowLabels = null,         // array de strings (izquierda)
    colLabels = null,         // array de strings (arriba)
    matrixName = '',
    valueRange = null,        // [min, max] para heatmap
    useHeatmap = false,
  } = opts;

  const rows = M.length;
  const cols = M[0].length;

  // Auto cell size: aim for total width ~ 320px
  if (cellSize === null) cellSize = Math.max(22, Math.min(40, Math.floor(320 / cols)));

  const labelWidth = rowLabels ? 60 : 0;
  const labelHeight = colLabels ? 24 : 0;
  const totalW = labelWidth + cols * (cellSize + cellGap) + 4;
  const totalH = labelHeight + rows * (cellSize + cellGap) + 4;

  const accent = COLORS[color];
  const hue = accent.hue;

  let minAbs = 0, maxAbs = 0;
  if (!useHeatmap) {
    [minAbs, maxAbs] = matrixAbsRange(M);
  }

  let cells = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const v = M[i][j];
      const x = labelWidth + j * (cellSize + cellGap);
      const y = labelHeight + i * (cellSize + cellGap);

      let fill;
      let textColor;
      if (useHeatmap) {
        // Use min/max from valueRange or compute from M
        let mn, mx;
        if (valueRange) [mn, mx] = valueRange;
        else {
          mn = Infinity; mx = -Infinity;
          for (const row of M) for (const val of row) {
            if (val < mn) mn = val;
            if (val > mx) mx = val;
          }
        }
        const t = mx > mn ? (v - mn) / (mx - mn) : 0.5;
        fill = heatmapColor(t);
        textColor = t > 0.4 && t < 0.75 ? '#0a0e1a' : '#e8eaf0';
      } else {
        fill = matrixToHue(v, minAbs, maxAbs, hue);
        const lightness = 14 + (maxAbs > minAbs ? ((Math.abs(v) - minAbs) / (maxAbs - minAbs)) * 48 : 24);
        textColor = lightness > 45 ? '#0a0e1a' : '#e8eaf0';
      }

      let stroke = COLORS.border;
      let strokeW = 1;
      if (highlight && (highlight.row === i || highlight.col === j)) {
        stroke = '#fbbf24';
        strokeW = 2;
      }
      if (highlight && highlight.cell && highlight.cell[0] === i && highlight.cell[1] === j) {
        stroke = '#fbbf24';
        strokeW = 2.5;
        fill = useHeatmap ? fill : `hsl(${hue}, 80%, 75%)`;
      }

      const fontSize = Math.max(8, Math.min(11, cellSize / 3.5));
      const valueStr = showValues ? fmt(v, decimals) : '';

      cells += `
        <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="3"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"/>
        ${showValues ? `
        <text x="${x + cellSize/2}" y="${y + cellSize/2 + fontSize/3}" text-anchor="middle"
              fill="${textColor}" font-family="JetBrains Mono, monospace"
              font-size="${fontSize}" font-weight="500">${valueStr}</text>
        ` : ''}
      `;
    }
  }

  // Row labels
  let labels = '';
  if (rowLabels) {
    for (let i = 0; i < rows; i++) {
      const y = labelHeight + i * (cellSize + cellGap) + cellSize / 2 + 3;
      labels += `
        <text x="${labelWidth - 8}" y="${y}" text-anchor="end"
              fill="${COLORS.secondary}" font-family="JetBrains Mono, monospace"
              font-size="${Math.max(9, Math.min(11, cellSize / 3.2))}">${escapeXml(rowLabels[i])}</text>
      `;
    }
  }

  // Col labels
  if (colLabels) {
    for (let j = 0; j < cols; j++) {
      const x = labelWidth + j * (cellSize + cellGap) + cellSize / 2;
      labels += `
        <text x="${x}" y="${labelHeight - 8}" text-anchor="middle"
              fill="${COLORS.muted}" font-family="JetBrains Mono, monospace"
              font-size="${Math.max(9, Math.min(10, cellSize / 3.5))}">${escapeXml(colLabels[j])}</text>
      `;
    }
  }

  return `<svg viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg"
            style="display: block; max-width: 100%; height: auto;">
    ${labels}
    ${cells}
  </svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================
// 5. UI state y steps
// ============================================================

const ui = {
  data: null,
  currentStep: 0,
  totalSteps: 7,
  autoTimer: null,
};

const STEPS = [
  { id: 'input',   title: 'Input embeddings',         desc: 'Cada token es un vector de d_model dimensiones. Estos embeddings son la entrada al bloque de self-attention.' },
  { id: 'w',       title: 'Matrices de proyección W', desc: 'Self-attention tiene tres matrices de pesos aprendibles: W_q, W_k y W_v. Cada una proyecta el input a un espacio diferente.' },
  { id: 'qkv',     title: 'Q, K y V — tres vistas del input', desc: 'Cada token se proyecta tres veces: una como Query (qué pregunta), una como Key (qué ofrece) y una como Value (qué contenido aporta).' },
  { id: 'scores',  title: 'Attention scores: Q @ Kᵀ', desc: 'Para cada par de tokens (i, j), computamos un score = Q[i] · K[j]. Mide cuánta "atención" debería prestarle el token i al token j.' },
  { id: 'softmax', title: 'Softmax → attention weights', desc: 'Aplicamos softmax por filas: cada fila se convierte en una distribución de probabilidad (suma = 1). Estos son los pesos de atención.' },
  { id: 'weighted', title: 'Suma ponderada: attn @ V', desc: 'Cada output es un promedio ponderado de todos los V, usando los pesos de atención. output[i] = Σⱼ attn[i][j] · V[j]' },
  { id: 'context', title: 'Output contextualizado',    desc: 'El output tiene la misma forma que el input, pero cada posición ahora contiene información de todos los tokens.' },
];

// ============================================================
// 6. Renderers por paso
// ============================================================

function renderStepInput() {
  const { tokens, x, dModel, n } = ui.data;

  const colLabels = Array.from({ length: dModel }, (_, i) => `d${i}`);
  const rowLabels = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);

  const svg = renderMatrixSVG(x, {
    color: 'input',
    colLabels,
    rowLabels,
    cellSize: 44,
  });

  return `
    <div style="overflow-x: auto; padding-bottom: 8px;">
      ${svg}
    </div>
  `;
}

function renderStepW() {
  const { Wq, Wk, Wv, dModel } = ui.data;
  const cellSize = Math.max(20, Math.floor(240 / dModel));

  const matrices = [
    { M: Wq, color: 'wq', name: 'W_q' },
    { M: Wk, color: 'wk', name: 'W_k' },
    { M: Wv, color: 'wv', name: 'W_v' },
  ];

  const blocks = matrices.map(({ M, color, name }) => {
    const accent = COLORS[color];
    const svg = renderMatrixSVG(M, {
      color,
      cellSize,
      decimals: 1,
      matrixName: name,
    });
    return `
      <div style="flex: 1; min-width: 0;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${accent.text}; font-weight: 600; margin-bottom: 8px;
                    text-align: center;">
          ${name}
          <span style="color: ${COLORS.muted}; font-weight: 400; font-size: 11px; margin-left: 6px;">
            [${dModel}, ${dModel}]
          </span>
        </div>
        <div style="overflow-x: auto;">${svg}</div>
      </div>
    `;
  }).join('');

  return `
    <div style="display: flex; gap: 20px; align-items: flex-start;">
      ${blocks}
    </div>
  `;
}

function renderStepQKV() {
  const { tokens, Q, K, V, dModel, n } = ui.data;
  const cellSize = Math.max(28, Math.floor(220 / dModel));
  const colLabels = Array.from({ length: dModel }, (_, i) => `d${i}`);
  const rowLabels = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);

  const matrices = [
    { M: Q, color: 'q', name: 'Q', formula: 'Q = x @ W_q' },
    { M: K, color: 'k', name: 'K', formula: 'K = x @ W_k' },
    { M: V, color: 'v', name: 'V', formula: 'V = x @ W_v' },
  ];

  const blocks = matrices.map(({ M, color, name, formula }) => {
    const accent = COLORS[color];
    const svg = renderMatrixSVG(M, {
      color,
      colLabels,
      rowLabels,
      cellSize,
      decimals: 2,
    });
    return `
      <div style="flex: 1; min-width: 0;">
        <div style="margin-bottom: 6px;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                       color: ${accent.text}; font-weight: 600;">${name}</span>
          <span style="color: ${COLORS.muted}; font-size: 11px; margin-left: 6px;">[${n}, ${dModel}]</span>
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 10px;">${formula}</div>
        <div style="overflow-x: auto;">${svg}</div>
      </div>
    `;
  }).join('');

  return `
    <div style="display: flex; gap: 24px; align-items: flex-start;">
      ${blocks}
    </div>
  `;
}

function renderStepScores() {
  const { tokens, Q, K, KT, rawScores, n, dModel } = ui.data;
  const cellSizeQ = Math.max(28, Math.floor(220 / dModel));
  const cellSizeScores = Math.max(36, Math.min(55, Math.floor(260 / n)));

  const rowLabelsQ = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);
  const rowLabelsKT = Array.from({ length: dModel }, (_, i) => `d${i}`);
  const colLabelsQ = Array.from({ length: dModel }, (_, i) => `d${i}`);
  const colLabelsKT = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);
  const rowLabelsScores = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);
  const colLabelsScores = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);

  return `
    <div style="display: grid; grid-template-columns: auto auto auto auto auto; gap: 18px; align-items: center;">
      <!-- Q -->
      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.q.text}; font-weight: 600; margin-bottom: 6px;">Q</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 8px;">[${n}, ${dModel}]</div>
        ${renderMatrixSVG(Q, { color: 'q', rowLabels: rowLabelsQ, colLabels: colLabelsQ, cellSize: cellSizeQ })}
      </div>

      <!-- × -->
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px;
                  color: ${COLORS.muted}; align-self: center;">×</div>

      <!-- K^T -->
      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.k.text}; font-weight: 600; margin-bottom: 6px;">Kᵀ</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 8px;">[${dModel}, ${n}]</div>
        ${renderMatrixSVG(KT, { color: 'k', rowLabels: rowLabelsKT, colLabels: colLabelsKT, cellSize: Math.max(22, Math.floor(180 / n)) })}
      </div>

      <!-- = -->
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px;
                  color: ${COLORS.muted}; align-self: center;">=</div>

      <!-- scores -->
      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.scores.text}; font-weight: 600; margin-bottom: 6px;">scores</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 8px;">[${n}, ${n}]</div>
        ${renderMatrixSVG(rawScores, {
          color: 'scores',
          rowLabels: rowLabelsScores,
          colLabels: colLabelsScores,
          cellSize: cellSizeScores,
          decimals: 2,
          useHeatmap: true,
          valueRange: [-0.3, 0.3],
        })}
      </div>
    </div>

    <div style="margin-top: 18px; padding: 12px 16px;
                background: ${COLORS.bg}; border: 1px solid ${COLORS.border};
                border-radius: 8px; font-family: 'JetBrains Mono', monospace;
                font-size: 13px; color: ${COLORS.secondary};">
      Cada celda <code style="color:${COLORS.scores.text}">scores[i][j]</code>
      es el producto punto entre la fila <code style="color:${COLORS.q.text}">Q[i]</code>
      y la fila <code style="color:${COLORS.k.text}">K[j]</code>:
      <code style="color:${COLORS.text}">scores[i][j] = Σ_d Q[i][d] × K[j][d]</code>
    </div>
  `;
}

function renderStepSoftmax() {
  const { tokens, rawScores, scaledScores, attn, n } = ui.data;
  const cellSize = Math.max(36, Math.min(55, Math.floor(260 / n)));
  const rowLabels = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);
  const colLabels = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);

  // Find score range
  let smin = Infinity, smax = -Infinity;
  for (const row of scaledScores) for (const v of row) {
    if (v < smin) smin = v;
    if (v > smax) smax = v;
  }

  return `
    <div style="display: grid; grid-template-columns: auto auto auto auto auto; gap: 18px; align-items: center;">
      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.scores.text}; font-weight: 600; margin-bottom: 6px;">scores</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 8px;">[${n}, ${n}] · raw</div>
        ${renderMatrixSVG(scaledScores, {
          color: 'scores',
          rowLabels, colLabels,
          cellSize,
          decimals: 2,
          useHeatmap: true,
          valueRange: [smin, smax],
        })}
      </div>

      <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px;
                  color: ${COLORS.muted}; align-self: center;">→</div>

      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.merge.text}; font-weight: 600; margin-bottom: 6px;">softmax</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 8px;">por fila</div>
        <div style="font-size: 32px; color: ${COLORS.muted}; align-self: center;">↓</div>
      </div>

      <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px;
                  color: ${COLORS.muted}; align-self: center;">=</div>

      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.merge.text}; font-weight: 600; margin-bottom: 6px;">attn</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 8px;">[${n}, ${n}] · pesos</div>
        ${renderMatrixSVG(attn, {
          color: 'scores',
          rowLabels, colLabels,
          cellSize,
          decimals: 3,
          useHeatmap: true,
          valueRange: [0, 1],
        })}
      </div>
    </div>

    <div style="margin-top: 18px; padding: 12px 16px;
                background: ${COLORS.bg}; border: 1px solid ${COLORS.border};
                border-radius: 8px; font-family: 'JetBrains Mono', monospace;
                font-size: 13px; color: ${COLORS.secondary};">
      <strong style="color: ${COLORS.text}">Softmax</strong> convierte cada fila en una distribución:
      <code style="color:${COLORS.text}">attn[i][j] = exp(scores[i][j]) / Σₖ exp(scores[i][k])</code>
      <br>Cada fila ahora suma 1.
      <span style="color: ${COLORS.muted};">También dividimos scores por √dₖ antes del softmax para estabilizar los gradientes.</span>
    </div>
  `;
}

function renderStepWeighted() {
  const { tokens, attn, V, output, n, dModel } = ui.data;
  const cellSizeAttn = Math.max(36, Math.min(55, Math.floor(260 / n)));
  const cellSizeV = Math.max(26, Math.floor(180 / dModel));
  const cellSizeOut = Math.max(26, Math.floor(180 / dModel));

  const rowLabels = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);
  const colLabels = Array.from({ length: dModel }, (_, i) => `d${i}`);
  const colLabelsAttn = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);

  // Pick first row to show the explicit weighted sum
  const rowIdx = 0;
  const weights = attn[rowIdx].map(v => v.toFixed(3));
  const VrowStr = V.map((row, j) => `(${weights[j]})·V[${j}]`).join(' + ');

  return `
    <div style="display: grid; grid-template-columns: auto auto auto auto auto; gap: 18px; align-items: start;">
      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: #34d399; font-weight: 600; margin-bottom: 6px;">attn</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 8px;">[${n}, ${n}] · heatmap</div>
        ${renderMatrixSVG(attn, {
          rowLabels, colLabels: colLabelsAttn,
          cellSize: cellSizeAttn,
          decimals: 3,
          useHeatmap: true,
          valueRange: [0, 1],
          highlight: { row: rowIdx },
        })}
      </div>

      <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px;
                  color: ${COLORS.muted}; padding-top: 60px;">×</div>

      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.v.text}; font-weight: 600; margin-bottom: 6px;">V</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 8px;">[${n}, ${dModel}]</div>
        ${renderMatrixSVG(V, {
          color: 'v',
          rowLabels, colLabels,
          cellSize: cellSizeV,
          decimals: 2,
          highlight: null,
        })}
      </div>

      <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px;
                  color: ${COLORS.muted}; padding-top: 60px;">=</div>

      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.output.text}; font-weight: 600; margin-bottom: 6px;">output</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 8px;">[${n}, ${dModel}]</div>
        ${renderMatrixSVG(output, {
          color: 'output',
          rowLabels, colLabels,
          cellSize: cellSizeOut,
          decimals: 2,
        })}
      </div>
    </div>

    <div style="margin-top: 18px; padding: 14px 16px;
                background: ${COLORS.bg}; border: 1px solid ${COLORS.border};
                border-radius: 8px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px;
                  color: ${COLORS.muted}; margin-bottom: 6px;">
        Para la fila destacada (output[0]):
      </div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                  color: ${COLORS.text}; line-height: 1.7;">
        output[0] = ${VrowStr}
      </div>
    </div>
  `;
}

function renderStepContext() {
  const { tokens, x, output, n, dModel } = ui.data;
  const cellSize = Math.max(24, Math.min(36, Math.floor(200 / dModel)));
  const rowLabels = tokens.map((t, i) => `[${i}] ${t.length > 6 ? t.slice(0, 5) + '…' : t}`);
  const colLabels = Array.from({ length: dModel }, (_, i) => `d${i}`);

  // Compare row 0: x[0] vs output[0]
  const x0 = x[0];
  const out0 = output[0];
  const maxDiff = Math.max(...x0.map((v, i) => Math.abs(v - out0[i])));

  return `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.input.text}; font-weight: 600; margin-bottom: 6px;">
          Input (x)
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 10px;">
          [${n}, ${dModel}] — embeddings originales
        </div>
        ${renderMatrixSVG(x, {
          color: 'input',
          rowLabels, colLabels,
          cellSize,
          decimals: 2,
        })}
      </div>

      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.output.text}; font-weight: 600; margin-bottom: 6px;">
          Output (después de attention)
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    color: ${COLORS.muted}; margin-bottom: 10px;">
          [${n}, ${dModel}] — embeddings contextualizados
        </div>
        ${renderMatrixSVG(output, {
          color: 'output',
          rowLabels, colLabels,
          cellSize,
          decimals: 2,
        })}
      </div>
    </div>

    <div style="margin-top: 24px; padding: 16px;
                background: ${COLORS.bg}; border: 1px solid ${COLORS.border};
                border-radius: 8px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px;
                  color: ${COLORS.muted}; margin-bottom: 10px;">
        Comparación fila 0 ("${tokens[0]}"):
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;
                  font-family: 'JetBrains Mono', monospace; font-size: 13px;">
        <div style="color: ${COLORS.input.text};">
          <div style="color: ${COLORS.muted}; font-size: 11px; margin-bottom: 4px;">x[0]</div>
          [${x0.map(v => v.toFixed(2)).join(', ')}]
        </div>
        <div style="color: ${COLORS.output.text};">
          <div style="color: ${COLORS.muted}; font-size: 11px; margin-bottom: 4px;">output[0]</div>
          [${out0.map(v => v.toFixed(2)).join(', ')}]
        </div>
        <div style="color: #34d399;">
          <div style="color: ${COLORS.muted}; font-size: 11px; margin-bottom: 4px;">|diferencia|</div>
          [${x0.map((v, i) => Math.abs(v - out0[i]).toFixed(2)).join(', ')}]
        </div>
      </div>
      <div style="margin-top: 12px; font-size: 13px; color: ${COLORS.secondary};">
        output[0] ahora mezcla info de los otros tokens (los pesos de atención determinan cuánto de cada uno).
        Diferencia máxima en una dimensión: <strong style="color: ${COLORS.text};">${maxDiff.toFixed(3)}</strong>.
      </div>
    </div>
  `;
}

// ============================================================
// 7. Side panels
// ============================================================

function renderSidePanels() {
  const stepId = STEPS[ui.currentStep].id;

  // Operation formula
  const formulas = {
    input:   '<span style="color:#9ba3b5">x</span> = input embeddings',
    w:       '<span style="color:#a78bfa">W_q</span>, <span style="color:#f472b6">W_k</span>, <span style="color:#fb923c">W_v</span> ← parámetros aprendibles (inicializados con kaiming)',
    qkv:     '<span style="color:#a78bfa">Q</span> = <span style="color:#9ba3b5">x</span> @ <span style="color:#a78bfa">W_q</span><br><span style="color:#f472b6">K</span> = <span style="color:#9ba3b5">x</span> @ <span style="color:#f472b6">W_k</span><br><span style="color:#fb923c">V</span> = <span style="color:#9ba3b5">x</span> @ <span style="color:#fb923c">W_v</span>',
    scores:  '<span style="color:#fbbf24">scores</span> = <span style="color:#a78bfa">Q</span> @ <span style="color:#f472b6">K</span>ᵀ<br>cada celda = producto punto de un Q y un K',
    softmax: '<span style="color:#34d399">attn</span> = softmax(<span style="color:#fbbf24">scores</span> / √dₖ)<br>cada fila → distribución (suma = 1)',
    weighted:'<span style="color:#60a5fa">output</span> = <span style="color:#34d399">attn</span> @ <span style="color:#fb923c">V</span><br>cada output = mezcla ponderada de V',
    context: 'output[i] = Σⱼ <span style="color:#34d399">attn</span>[i][j] · <span style="color:#fb923c">V</span>[j]<br>misma forma que x, ahora contextualizado',
  };
  document.getElementById('op-formula').innerHTML = formulas[stepId] || '';

  // Pipeline visualization
  const stages = [
    { name: 'x',   shape: `[${ui.data.n}, ${ui.data.dModel}]`, color: COLORS.input.text },
    { name: 'W',   shape: `[${ui.data.dModel}, ${ui.data.dModel}]`, color: COLORS.secondary },
    { name: 'QKV', shape: `[${ui.data.n}, ${ui.data.dModel}]`, color: COLORS.q.text },
    { name: 'sc.', shape: `[${ui.data.n}, ${ui.data.n}]`, color: COLORS.scores.text },
    { name: 'attn',shape: `[${ui.data.n}, ${ui.data.n}]`, color: '#34d399' },
    { name: 'out', shape: `[${ui.data.n}, ${ui.data.dModel}]`, color: COLORS.output.text },
  ];
  const activeIdx = { input: 0, w: 1, qkv: 2, scores: 3, softmax: 4, weighted: 5, context: 5 }[stepId];

  let pipe = '';
  stages.forEach((s, i) => {
    const isActive = i === activeIdx;
    const isDone = i < activeIdx;
    const opacity = isActive ? '1' : (isDone ? '0.6' : '0.3');
    const bg = isActive ? 'rgba(167, 139, 250, 0.15)' : 'transparent';
    const border = isActive ? 'rgba(167, 139, 250, 0.5)' : 'transparent';
    pipe += `
      <div style="display: flex; align-items: center; gap: 6px; opacity: ${opacity};
                  padding: 4px 8px; border-radius: 6px; background: ${bg};
                  border: 1px solid ${border}; margin-bottom: 2px;">
        <span style="color: ${s.color}; font-weight: 600;">${s.name}</span>
        <span style="color: ${COLORS.muted}; margin-left: auto;">${s.shape}</span>
      </div>
      ${i < stages.length - 1 ? `<div style="color: ${COLORS.muted}; margin-left: 12px; font-size: 10px;">↓</div>` : ''}
    `;
  });
  document.getElementById('pipeline-viz').innerHTML = pipe;

  // Stats
  const stats = {
    input: `${ui.data.n} tokens × ${ui.data.dModel} dim = ${ui.data.n * ui.data.dModel} valores`,
    w: `3 matrices × ${ui.data.dModel * ui.data.dModel} = ${3 * ui.data.dModel * ui.data.dModel} parámetros`,
    qkv: `${ui.data.n} filas × ${ui.data.dModel} dim × 3 (Q/K/V)`,
    scores: `${ui.data.n}² = ${ui.data.n * ui.data.n} scores · rango: [${minMax(ui.data.rawScores).map(v => v.toFixed(2)).join(', ')}]`,
    softmax: `filas suman 1: [${ui.data.attn.map(r => r.reduce((a, b) => a + b, 0).toFixed(2)).join(', ')}]`,
    weighted: `output preserva shape [${ui.data.n}, ${ui.data.dModel}]`,
    context: `diff promedio: ${avgDiff(ui.data.x, ui.data.output).toFixed(3)} · max diff: ${maxDiff(ui.data.x, ui.data.output).toFixed(3)}`,
  };
  document.getElementById('stats-viz').innerHTML = `<div style="line-height: 1.7;">${stats[stepId]}</div>`;
}

function minMax(M) {
  let mn = Infinity, mx = -Infinity;
  for (const row of M) for (const v of row) {
    if (v < mn) mn = v;
    if (v > mx) mx = v;
  }
  return [mn, mx];
}

function avgDiff(A, B) {
  let sum = 0, n = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      sum += Math.abs(A[i][j] - B[i][j]);
      n++;
    }
  }
  return sum / n;
}

function maxDiff(A, B) {
  let m = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      const d = Math.abs(A[i][j] - B[i][j]);
      if (d > m) m = d;
    }
  }
  return m;
}

// ============================================================
// 8. Step navigation
// ============================================================

function renderCurrentStep() {
  const step = STEPS[ui.currentStep];

  document.getElementById('stage-heading').textContent = step.title;
  document.getElementById('stage-description').textContent = step.desc;

  const canvas = document.getElementById('stage-canvas');
  switch (step.id) {
    case 'input':    canvas.innerHTML = renderStepInput(); break;
    case 'w':        canvas.innerHTML = renderStepW(); break;
    case 'qkv':      canvas.innerHTML = renderStepQKV(); break;
    case 'scores':   canvas.innerHTML = renderStepScores(); break;
    case 'softmax':  canvas.innerHTML = renderStepSoftmax(); break;
    case 'weighted': canvas.innerHTML = renderStepWeighted(); break;
    case 'context':  canvas.innerHTML = renderStepContext(); break;
  }

  const explanations = {
    input:   'Estos embeddings son la entrada. En un transformer real vienen de un embedding layer + positional encoding, pero para este ejemplo usamos valores fijos del notebook.',
    w:       'Estas matrices se <strong>aprenden durante el entrenamiento</strong>. Al inicio tienen valores aleatorios; después del backprop, cada una se especializa en proyectar el input a un espacio útil para su rol.',
    qkv:     'Tres proyecciones distintas del <strong>mismo input</strong>. Q es lo que cada token "busca", K es lo que "ofrece", V es el contenido que aporta. Comparten input pero viven en espacios diferentes.',
    scores:  'Cada score mide la <strong>similitud</strong> entre un query y una key. Si Q[i] y K[j] están alineados, scores[i][j] es alto — el token i debería prestar atención al token j.',
    softmax: 'Softmax convierte scores en <strong>probabilidades</strong>. Cada fila es una distribución: nos dice cómo distribuir la atención del token i entre todos los tokens j.',
    weighted:'Para cada posición i, tomamos un <strong>promedio ponderado</strong> de todos los V, usando los pesos attn[i]. El output es la información mezclada.',
    context: 'El output tiene la <strong>misma forma</strong> que el input, pero cada posición ahora "sabe" de los otros tokens. Esto es lo que hace self-attention tan poderoso.',
  };
  document.getElementById('explanation-text').innerHTML = explanations[step.id] || '';

  // Shape badge
  const shapeData = {
    input:   `x: [${ui.data.n}, ${ui.data.dModel}]`,
    w:       `W: [${ui.data.dModel}, ${ui.data.dModel}]`,
    qkv:     `Q, K, V: [${ui.data.n}, ${ui.data.dModel}]`,
    scores:  `scores: [${ui.data.n}, ${ui.data.n}]`,
    softmax: `attn: [${ui.data.n}, ${ui.data.n}]`,
    weighted:`output: [${ui.data.n}, ${ui.data.dModel}]`,
    context: `output: [${ui.data.n}, ${ui.data.dModel}]`,
  };
  const shapeBadge = document.getElementById('shape-badge');
  if (shapeData[step.id]) {
    shapeBadge.style.display = 'inline-flex';
    document.getElementById('shape-value').textContent = shapeData[step.id];
  } else {
    shapeBadge.style.display = 'none';
  }

  // Update stepper
  updateStepper();

  // Update side panels
  renderSidePanels();

  // Update buttons
  document.getElementById('btn-prev').disabled = ui.currentStep === 0;
  document.getElementById('btn-next').disabled = ui.currentStep === ui.totalSteps - 1;
}

function updateStepper() {
  const dots = document.getElementById('step-dots');
  let html = '';
  for (let i = 0; i < ui.totalSteps; i++) {
    let cls = 'step-dot';
    if (i < ui.currentStep) cls += ' done';
    else if (i === ui.currentStep) cls += ' active';
    html += `<div class="${cls}"></div>`;
  }
  dots.innerHTML = html;
  document.getElementById('step-label').innerHTML =
    `<strong>Paso ${ui.currentStep + 1}</strong> · ${STEPS[ui.currentStep].title}`;
  document.getElementById('step-counter').textContent =
    `${ui.currentStep + 1} / ${ui.totalSteps}`;
}

function nextStep() {
  if (ui.currentStep < ui.totalSteps - 1) {
    ui.currentStep++;
    renderCurrentStep();
  } else {
    stopAuto();
  }
}

function prevStep() {
  if (ui.currentStep > 0) {
    ui.currentStep--;
    renderCurrentStep();
  }
}

function startAuto() {
  stopAuto();
  document.getElementById('btn-auto').innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg>
    Pausar
  `;
  ui.autoTimer = setInterval(() => {
    if (ui.currentStep < ui.totalSteps - 1) nextStep();
    else stopAuto();
  }, 2200);
}

function stopAuto() {
  if (ui.autoTimer) clearInterval(ui.autoTimer);
  ui.autoTimer = null;
  document.getElementById('btn-auto').innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
    Reproducir
  `;
}

// ============================================================
// 9. Init
// ============================================================

function reload() {
  const tokensRaw = document.getElementById('input-tokens').value;
  const tokens = tokensRaw.split(',').map(s => s.trim()).filter(Boolean);
  const dModel = parseInt(document.getElementById('d-model').value) || 8;

  if (tokens.length < 2) {
    alert('Necesitamos al menos 2 tokens.');
    return;
  }
  if (tokens.length > 8) {
    alert('Máximo 8 tokens (para que entre en pantalla).');
    return;
  }
  if (dModel < 4 || dModel > 8) {
    alert('d_model debe estar entre 4 y 8.');
    return;
  }

  ui.data = runAttention(tokens, dModel, 42);
  ui.currentStep = 0;
  renderCurrentStep();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-next').addEventListener('click', () => { stopAuto(); nextStep(); });
  document.getElementById('btn-prev').addEventListener('click', () => { stopAuto(); prevStep(); });
  document.getElementById('btn-auto').addEventListener('click', () => {
    if (ui.autoTimer) stopAuto(); else startAuto();
  });
  document.getElementById('btn-reload').addEventListener('click', () => { stopAuto(); reload(); });

  let reloadTimer;
  document.getElementById('input-tokens').addEventListener('input', () => {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(reload, 600);
  });
  document.getElementById('d-model').addEventListener('change', reload);

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') { stopAuto(); nextStep(); }
    else if (e.key === 'ArrowLeft') { stopAuto(); prevStep(); }
  });

  reload();
});