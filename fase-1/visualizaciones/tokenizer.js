/* ============================================================
   BPE Tokenizer — Visualización interactiva
   ============================================================
   Implementación 1:1 con BasicTokenizer de Python.
   Mismo algoritmo: bytes → pair counts → merge → vocab por
   composición. La diferencia es que capturamos cada estado
   intermedio para poder animar el proceso.
*/

// ============================================================
// 1. Motor BPE (mismo algoritmo que el Python)
// ============================================================

const utf8Encode = (str) => Array.from(new TextEncoder().encode(str));

function getPairCounts(ids) {
  const counts = new Map();
  for (let i = 0; i < ids.length - 1; i++) {
    const key = `${ids[i]},${ids[i + 1]}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function mergePair(ids, pair, newId) {
  const out = [];
  let i = 0;
  while (i < ids.length) {
    if (ids[i] === pair[0] && i + 1 < ids.length && ids[i + 1] === pair[1]) {
      out.push(newId);
      i += 2;
    } else {
      out.push(ids[i]);
      i += 1;
    }
  }
  return out;
}

function buildVocab(merges) {
  const vocab = new Map();
  for (let i = 0; i < 256; i++) vocab.set(i, [i]);
  for (const { pair, newId } of merges) {
    vocab.set(newId, [...vocab.get(pair[0]), ...vocab.get(pair[1])]);
  }
  return vocab;
}

function decodeBytes(bytes) {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(bytes));
  } catch {
    return '·';
  }
}

function formatTokenDisplay(tokenId, vocab) {
  const bytes = vocab.get(tokenId) || [tokenId];
  if (bytes.length === 1) {
    const b = bytes[0];
    if (b === 32) return "' '";
    if (b >= 33 && b < 127) return String.fromCharCode(b);
    return `\\x${b.toString(16).padStart(2, '0')}`;
  }
  // Multi-byte token: show decoded text
  const decoded = decodeBytes(bytes);
  return decoded.length <= 6 ? decoded : decoded.slice(0, 5) + '…';
}

function runTrain(text, vocabSize) {
  const textBytes = utf8Encode(text);
  let ids = [...textBytes];
  const numMerges = Math.max(0, vocabSize - 256);
  const merges = [];

  // Estado inicial
  const states = [{
    ids: [...ids],
    merges: [],
    vocab: buildVocab([]),
    pairCounts: getPairCounts(ids),
    label: 'inicial',
  }];

  for (let i = 0; i < numMerges; i++) {
    const counts = getPairCounts(ids);
    if (counts.size === 0) break;

    // Par más frecuente — empate se rompe por ID más bajo (orden de aparición)
    let maxKey = null, maxCount = 0;
    for (const [k, v] of counts) {
      if (v > maxCount) {
        maxCount = v;
        maxKey = k;
      }
    }
    const pair = maxKey.split(',').map(Number);
    const newId = 256 + i;

    ids = mergePair(ids, pair, newId);
    merges.push({ pair, newId, freq: maxCount });

    states.push({
      ids: [...ids],
      merges: [...merges],
      vocab: buildVocab(merges),
      pairCounts: counts,
      lastMerge: { pair, newId, freq: maxCount },
      mergeStep: i + 1,
      label: `merge ${i + 1}`,
    });
  }

  return {
    text,
    textBytes,
    merges,
    states,
    finalIds: ids,
    initialByteCount: textBytes.length,
    finalTokenCount: ids.length,
  };
}

// ============================================================
// 2. Estado de la UI
// ============================================================

const ui = {
  trainer: null,
  currentStep: 0,
  totalSteps: 7,
  autoTimer: null,
};

const STEPS = [
  { id: 'input',    title: 'Texto de entrada',            desc: 'Acá está el texto que vamos a tokenizar. Es un ejemplo chico para que el algoritmo se entienda paso a paso.' },
  { id: 'bytes',    title: 'Codificación UTF-8',          desc: 'Cada carácter se convierte en uno o más bytes UTF-8. Los caracteres especiales (como "ú") ocupan más de un byte.' },
  { id: 'tokens',   title: 'Tokens iniciales (bytes)',    desc: 'Al principio, cada byte es su propio token con un ID igual a su valor (0-255). Después los vamos a combinar.' },
  { id: 'pairs',    title: 'Conteo de pares adyacentes',  desc: 'Buscamos el par adyacente más frecuente. Ese par va a ser el próximo merge — el que más "comprime" el texto.' },
  { id: 'merge',    title: 'Merge #1',                    desc: 'El par más frecuente se reemplaza por un nuevo token. Le asignamos un ID nuevo, empezando en 256.' },
  { id: 'all',      title: 'Iteraciones: todos los merges', desc: 'Repetimos el proceso N veces. Cada merge nuevo reduce la cantidad de tokens y crece el vocabulario.' },
  { id: 'result',   title: 'Resultado y encoding',        desc: 'Ahora podemos tokenizar texto nuevo aplicando los merges aprendidos, en el orden en que los aprendimos.' },
];

// ============================================================
// 3. Renderizado SVG
// ============================================================

const COLORS = {
  bg: '#0a0e1a',
  bgElev: '#131825',
  bgOverlay: '#1a2030',
  border: '#364056',
  text: '#e8eaf0',
  muted: '#6b7280',
  secondary: '#9ba3b5',
  input: '#6ee7b7',
  merge: '#34d399',
  warn: '#fbbf24',
  warnBg: 'rgba(251, 191, 36, 0.18)',
  warnStroke: 'rgba(251, 191, 36, 0.7)',
  mergeBg: 'rgba(52, 211, 153, 0.18)',
  mergeStroke: 'rgba(52, 211, 153, 0.7)',
  accent: '#a78bfa',
};

const CELL_W = 54;
const CELL_H = 48;
const CELL_GAP = 5;
const STRIP_PAD = 12;

function makeStripSVG(ids, vocab, options = {}) {
  const {
    highlightIndices = [],
    highlightColor = 'warn',
    newTokenIndices = [],
    newTokenColor = 'merge',
    showChars = true,
  } = options;

  const totalW = STRIP_PAD * 2 + ids.length * (CELL_W + CELL_GAP) - CELL_GAP;
  const totalH = STRIP_H;

  let cells = '';
  for (let i = 0; i < ids.length; i++) {
    const x = STRIP_PAD + i * (CELL_W + CELL_GAP);
    const y = STRIP_PAD;
    const id = ids[i];

    let fill = COLORS.bgOverlay;
    let stroke = COLORS.border;
    let labelColor = COLORS.text;
    let idColor = COLORS.muted;
    let strokeW = 1.5;

    if (highlightIndices.includes(i)) {
      fill = COLORS[`${highlightColor}Bg`] || COLORS.warnBg;
      stroke = COLORS[`${highlightColor}Stroke`] || COLORS.warnStroke;
      strokeW = 2;
    }
    if (newTokenIndices.includes(i)) {
      fill = COLORS.mergeBg;
      stroke = COLORS.mergeStroke;
      strokeW = 2;
    }

    const display = formatTokenDisplay(id, vocab);
    const idLabel = String(id);

    cells += `
      <g transform="translate(${x}, ${y})">
        <rect width="${CELL_W}" height="${CELL_H}" rx="6"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"/>
        <text x="${CELL_W/2}" y="20" text-anchor="middle"
              fill="${labelColor}" font-family="JetBrains Mono, monospace"
              font-size="13" font-weight="500">${escapeXml(display)}</text>
        <text x="${CELL_W/2}" y="38" text-anchor="middle"
              fill="${idColor}" font-family="JetBrains Mono, monospace"
              font-size="10">${idLabel}</text>
      </g>
    `;
  }

  return `<svg viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            style="max-width: 100%; height: auto;">
    ${cells}
  </svg>`;
}

const STRIP_H = STRIP_PAD * 2 + CELL_H;

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// 4. Renderers por paso
// ============================================================

function renderStepInput() {
  const { text } = ui.trainer;
  return `
    <div class="stage-canvas">
      <div style="background: ${COLORS.bg}; border: 1px solid ${COLORS.border};
                  border-radius: 10px; padding: 24px 28px;
                  font-family: 'JetBrains Mono', monospace; font-size: 17px;
                  line-height: 1.7; color: ${COLORS.text};">
        "${escapeXml(text)}"
      </div>
      <div style="margin-top: 16px; display: flex; gap: 24px;
                  font-family: 'JetBrains Mono', monospace; font-size: 13px;
                  color: ${COLORS.secondary};">
        <span>${text.length} <span style="color:${COLORS.muted}">caracteres</span></span>
        <span>${ui.trainer.initialByteCount} <span style="color:${COLORS.muted}">bytes UTF-8</span></span>
      </div>
    </div>
  `;
}

function renderStepBytes() {
  const { text, textBytes } = ui.trainer;
  const cells = [];
  let byteIdx = 0;
  const charArr = Array.from(text);

  for (const ch of charArr) {
    const chBytes = utf8Encode(ch);
    const isMulti = chBytes.length > 1;
    const cellW = isMulti ? 90 : 56;

    let x = STRIP_PAD;
    for (const b of chBytes) {
      const bx = STRIP_PAD + byteIdx * (CELL_W + CELL_GAP);
      const fill = isMulti ? 'rgba(167, 139, 250, 0.12)' : COLORS.bgOverlay;
      const stroke = isMulti ? 'rgba(167, 139, 250, 0.5)' : COLORS.border;
      const charDisplay = b === 32 ? '␣' : (b >= 33 && b < 127 ? String.fromCharCode(b) : `\\x${b.toString(16)}`);
      cells.push(`
        <g transform="translate(${bx}, 0)">
          <rect width="${CELL_W}" height="${CELL_H}" rx="6"
                fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
          <text x="${CELL_W/2}" y="20" text-anchor="middle" fill="${COLORS.text}"
                font-family="JetBrains Mono, monospace" font-size="13" font-weight="500">${escapeXml(charDisplay)}</text>
          <text x="${CELL_W/2}" y="38" text-anchor="middle" fill="${COLORS.muted}"
                font-family="JetBrains Mono, monospace" font-size="10">${b}</text>
        </g>
      `);
      byteIdx++;
    }
  }

  const totalW = STRIP_PAD * 2 + textBytes.length * (CELL_W + CELL_GAP) - CELL_GAP;

  // Render chars above the strip (grouped)
  let charRow = '';
  let charCursor = 0;
  for (const ch of charArr) {
    const chBytes = utf8Encode(ch);
    const w = chBytes.length * (CELL_W + CELL_GAP) - CELL_GAP;
    const charLabel = ch === ' ' ? '␣' : ch;
    const isMulti = chBytes.length > 1;
    const charColor = isMulti ? COLORS.accent : COLORS.secondary;
    charRow += `
      <text x="${STRIP_PAD + charCursor + w/2}" y="20" text-anchor="middle"
            fill="${charColor}" font-family="JetBrains Mono, monospace"
            font-size="14" font-weight="${isMulti ? '600' : '400'}">${escapeXml(charLabel)}</text>
    `;
    charCursor += w + CELL_GAP;
  }

  return `
    <div class="stage-canvas">
      <svg viewBox="0 0 ${totalW} ${STRIP_H + 36}" xmlns="http://www.w3.org/2000/svg"
           preserveAspectRatio="xMidYMid meet"
           style="max-width: 100%; height: auto;">
        ${charRow}
        ${cells.join('')}
      </svg>
      ${textBytes.includes(194) || textBytes.includes(195) ? `
        <div style="margin-top: 18px; padding: 10px 14px;
                    background: rgba(167, 139, 250, 0.08);
                    border: 1px solid rgba(167, 139, 250, 0.3);
                    border-radius: 8px; font-size: 13px;
                    color: ${COLORS.secondary};">
          <strong style="color: ${COLORS.accent};">↑</strong>
          Caracteres acentuados como <code style="color:${COLORS.accent}">ú</code>
          ocupan 2 bytes (UTF-8 multibyte).
        </div>
      ` : ''}
    </div>
  `;
}

function renderStepTokens() {
  const { textBytes } = ui.trainer;
  const initialVocab = ui.trainer.states[0].vocab;
  const svg = makeStripSVG(textBytes, initialVocab);
  return `
    <div class="stage-canvas">
      ${svg}
      <div style="margin-top: 16px; display: flex; gap: 24px;
                  font-family: 'JetBrains Mono', monospace; font-size: 13px;
                  color: ${COLORS.secondary};">
        <span>${textBytes.length} <span style="color:${COLORS.muted}">tokens</span></span>
        <span style="color:${COLORS.muted}">IDs: 0–255 (cada byte = un token)</span>
      </div>
    </div>
  `;
}

function renderStepPairs() {
  const { states } = ui.trainer;
  const counts = states[0].pairCounts;
  const sorted = [...counts.entries()]
    .map(([k, v]) => ({ key: k, pair: k.split(',').map(Number), count: v }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

  const top = sorted[0];
  const initialVocab = states[0].vocab;

  // Show a subset (top 12)
  const shown = sorted.slice(0, 12);
  const maxCount = shown[0].count;

  let bars = '';
  for (const { pair, count } of shown) {
    const isTop = pair[0] === top.pair[0] && pair[1] === top.pair[1];
    const displayA = formatTokenDisplay(pair[0], initialVocab);
    const displayB = formatTokenDisplay(pair[1], initialVocab);
    const widthPct = (count / maxCount) * 100;

    bars += `
      <div class="data-row ${isTop ? 'highlight-winner' : ''}">
        <span class="data-row-key">
          (${escapeXml(displayA)}, ${escapeXml(displayB)})
        </span>
        <div style="position: relative; height: 18px; display: flex; align-items: center;">
          <div style="background: ${isTop ? 'rgba(52,211,153,0.25)' : 'rgba(167,139,250,0.15)'};
                      width: ${widthPct}%; height: 6px; border-radius: 3px;
                      transition: width 600ms cubic-bezier(0.16,1,0.3,1);"></div>
        </div>
        <span class="data-row-val" style="color: ${isTop ? COLORS.merge : COLORS.text}">
          ${count}${isTop ? ' ★' : ''}
        </span>
      </div>
    `;
  }

  return `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <div style="font-size: 12px; color: ${COLORS.muted}; text-transform: uppercase;
                    letter-spacing: 0.08em; margin-bottom: 12px;">
          Top ${shown.length} pares (de ${counts.size} totales)
        </div>
        <div class="data-list" style="max-height: 360px;">
          ${bars}
        </div>
        ${sorted.length > shown.length ? `
          <div style="margin-top: 8px; font-size: 12px; color: ${COLORS.muted};">
            + ${sorted.length - shown.length} pares más con frecuencia 1
          </div>
        ` : ''}
      </div>
      <div>
        <div style="font-size: 12px; color: ${COLORS.muted}; text-transform: uppercase;
                    letter-spacing: 0.08em; margin-bottom: 12px;">
          Ganador
        </div>
        <div style="background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.4);
                    border-radius: 10px; padding: 20px; text-align: center;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 36px;
                      color: ${COLORS.merge}; font-weight: 600; letter-spacing: -0.02em;">
            (${escapeXml(formatTokenDisplay(top.pair[0], initialVocab))}, ${escapeXml(formatTokenDisplay(top.pair[1], initialVocab))})
          </div>
          <div style="margin-top: 6px; font-family: 'JetBrains Mono', monospace;
                      font-size: 13px; color: ${COLORS.secondary};">
            aparece <strong style="color: ${COLORS.merge}">${top.count}</strong> veces en el texto
          </div>
          <div style="margin-top: 16px; font-size: 13px; color: ${COLORS.muted};">
            Este par se va a convertir en un nuevo token.
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStepMerge() {
  const before = ui.trainer.states[0];
  const after = ui.trainer.states[1];
  if (!after || !after.lastMerge) {
    return `<div style="color: ${COLORS.muted}">No hay merges para mostrar.</div>`;
  }

  const { pair, newId, freq } = after.lastMerge;
  const beforeVocab = before.vocab;
  const afterVocab = after.vocab;

  // Find positions of the pair in before.ids (we highlight all occurrences)
  const positions = [];
  for (let i = 0; i < before.ids.length - 1; i++) {
    if (before.ids[i] === pair[0] && before.ids[i + 1] === pair[1]) {
      positions.push(i);
    }
  }

  // Find positions of newId in after.ids
  const newPositions = [];
  for (let i = 0; i < after.ids.length; i++) {
    if (after.ids[i] === newId) newPositions.push(i);
  }

  const beforeSvg = makeStripSVG(before.ids, beforeVocab, {
    highlightIndices: positions,
  });
  const afterSvg = makeStripSVG(after.ids, afterVocab, {
    newTokenIndices: newPositions,
  });

  return `
    <div class="stage-canvas">
      <div style="display: flex; align-items: center; gap: 8px;
                  font-size: 12px; color: ${COLORS.muted}; text-transform: uppercase;
                  letter-spacing: 0.08em; margin-bottom: 8px;">
        Antes
        <span style="font-family: 'JetBrains Mono', monospace; color: ${COLORS.secondary};">
          · ${before.ids.length} tokens
        </span>
      </div>
      <div style="overflow-x: auto; padding-bottom: 4px;">
        ${beforeSvg}
      </div>

      <div style="display: flex; align-items: center; justify-content: center;
                  margin: 14px 0; gap: 12px; padding: 12px 16px;
                  background: rgba(167, 139, 250, 0.08);
                  border: 1px solid rgba(167, 139, 250, 0.3);
                  border-radius: 10px;">
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 14px;
                     color: ${COLORS.warn}; font-weight: 500;">
          (${escapeXml(formatTokenDisplay(pair[0], beforeVocab))}, ${escapeXml(formatTokenDisplay(pair[1], beforeVocab))})
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="${COLORS.secondary}" stroke-width="2" stroke-linecap="round"
             style="width: 20px; height: 20px; flex-shrink: 0;">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 14px;
                     color: ${COLORS.merge}; font-weight: 600;">
          token ${newId}
        </span>
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px;
                     color: ${COLORS.muted}; margin-left: 8px;">
          (${freq} ocurrencias)
        </span>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;
                  font-size: 12px; color: ${COLORS.muted}; text-transform: uppercase;
                  letter-spacing: 0.08em; margin-bottom: 8px;">
        Después
        <span style="font-family: 'JetBrains Mono', monospace; color: ${COLORS.secondary};">
          · ${after.ids.length} tokens
        </span>
        <span style="color: ${COLORS.merge};">↓ ${before.ids.length - after.ids.length} tokens menos</span>
      </div>
      <div style="overflow-x: auto; padding-bottom: 4px;">
        ${afterSvg}
      </div>
    </div>
  `;
}

function renderStepAllMerges() {
  const { merges, states, finalIds } = ui.trainer;
  const finalState = states[states.length - 1];
  const finalVocab = finalState.vocab;

  let mergeRows = '';
  for (let i = 0; i < merges.length; i++) {
    const m = merges[i];
    const a = formatTokenDisplay(m.pair[0], finalVocab);
    const b = formatTokenDisplay(m.pair[1], finalVocab);
    const widthPct = Math.min(100, (m.freq / merges[0].freq) * 100);
    mergeRows += `
      <div class="data-row">
        <span class="data-row-key" style="color: ${COLORS.muted}; min-width: 32px;">
          #${i + 1}
        </span>
        <span class="data-row-val" style="text-align: left;">
          (${escapeXml(a)}, ${escapeXml(b)})
          <span style="color: ${COLORS.muted}; margin-left: 6px;">→</span>
          <span style="color: ${COLORS.merge};">${m.newId}</span>
          <div style="display: inline-block; margin-left: 8px; width: 60px;
                      height: 4px; background: ${COLORS.bgBase}; border-radius: 2px;
                      vertical-align: middle;">
            <div style="width: ${widthPct}%; height: 100%; background: ${COLORS.merge};
                        border-radius: 2px; opacity: 0.7;"></div>
          </div>
        </span>
        <span class="data-row-val" style="color: ${COLORS.secondary}; min-width: 24px;">
          ×${m.freq}
        </span>
      </div>
    `;
  }

  const finalSvg = makeStripSVG(finalIds, finalVocab);

  return `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div>
        <div style="font-size: 12px; color: ${COLORS.muted}; text-transform: uppercase;
                    letter-spacing: 0.08em; margin-bottom: 12px;">
          ${merges.length} merges aprendidos
        </div>
        <div class="data-list" style="max-height: 320px;">
          ${mergeRows}
        </div>
      </div>
      <div>
        <div style="font-size: 12px; color: ${COLORS.muted}; text-transform: uppercase;
                    letter-spacing: 0.08em; margin-bottom: 12px;">
          Encoding final del texto
        </div>
        <div style="overflow-x: auto; padding-bottom: 4px;">
          ${finalSvg}
        </div>
        <div style="margin-top: 12px; font-family: 'JetBrains Mono', monospace;
                    font-size: 13px; color: ${COLORS.secondary};">
          ${ui.trainer.initialByteCount} bytes
          <span style="color: ${COLORS.muted};">→</span>
          <strong style="color: ${COLORS.merge}">${finalIds.length} tokens</strong>
          <span style="color: ${COLORS.muted};">
            (${(ui.trainer.initialByteCount / finalIds.length).toFixed(2)}× compresión)
          </span>
        </div>
      </div>
    </div>
  `;
}

function renderStepResult() {
  const { states, merges, finalVocab } = (() => {
    const last = ui.trainer.states[ui.trainer.states.length - 1];
    return { states: ui.trainer.states, merges: last.merges, finalVocab: last.vocab };
  })();

  // Encode new text using the learned merges
  function encode(text) {
    let ids = utf8Encode(text);
    while (ids.length >= 2) {
      const counts = getPairCounts(ids);
      // Find pair with lowest newId (earliest learned)
      let bestPair = null, bestId = Infinity;
      for (const [k] of counts) {
        const pair = k.split(',').map(Number);
        // We need to find the merge for this pair
        const mergeEntry = merges.find(m => m.pair[0] === pair[0] && m.pair[1] === pair[1]);
        if (mergeEntry && mergeEntry.newId < bestId) {
          bestId = mergeEntry.newId;
          bestPair = pair;
        }
      }
      if (!bestPair) break;
      ids = mergePair(ids, bestPair, bestId);
    }
    return ids;
  }

  const newText = 'gato come';
  const newEncoded = encode(newText);

  const allMerges = ui.trainer.merges;
  const lastState = ui.trainer.states[ui.trainer.states.length - 1];

  return `
    <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
      <div style="background: ${COLORS.bg}; border: 1px solid ${COLORS.border};
                  border-radius: 10px; padding: 20px;">
        <div style="font-size: 12px; color: ${COLORS.muted}; text-transform: uppercase;
                    letter-spacing: 0.08em; margin-bottom: 12px;">
          Resumen del entrenamiento
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 28px;
                        color: ${COLORS.input}; font-weight: 600;">
              ${allMerges.length}
            </div>
            <div style="font-size: 12px; color: ${COLORS.muted}; margin-top: 2px;">
              merges aprendidos
            </div>
          </div>
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 28px;
                        color: ${COLORS.merge}; font-weight: 600;">
              ${lastState.vocab.size}
            </div>
            <div style="font-size: 12px; color: ${COLORS.muted}; margin-top: 2px;">
              tamaño del vocabulario
            </div>
          </div>
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 28px;
                        color: ${COLORS.accent}; font-weight: 600;">
              ${ui.trainer.finalTokenCount}
            </div>
            <div style="font-size: 12px; color: ${COLORS.muted}; margin-top: 2px;">
              tokens para el texto
            </div>
          </div>
        </div>
      </div>

      <div style="background: ${COLORS.bg}; border: 1px solid ${COLORS.border};
                  border-radius: 10px; padding: 20px;">
        <div style="font-size: 12px; color: ${COLORS.muted}; text-transform: uppercase;
                    letter-spacing: 0.08em; margin-bottom: 12px;">
          Encoding de texto nuevo
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px;
                    color: ${COLORS.text}; margin-bottom: 12px;">
          "${escapeXml(newText)}"
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px;
                    color: ${COLORS.secondary}; margin-bottom: 8px;">
          Aplicando los merges aprendidos (en orden):
        </div>
        <div style="overflow-x: auto; padding-bottom: 4px;">
          ${makeStripSVG(newEncoded, lastState.vocab)}
        </div>
        <div style="margin-top: 10px; font-family: 'JetBrains Mono', monospace;
                    font-size: 12px; color: ${COLORS.muted};">
          IDs: [${newEncoded.join(', ')}]
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// 5. Side panels (counts, merges, vocab)
// ============================================================

function renderSidePanels() {
  const countsPanel = document.getElementById('panel-counts');
  const mergesPanel = document.getElementById('panel-merges');
  const vocabPanel = document.getElementById('panel-vocab');

  // Mapear cada paso visual al estado correcto del trainer
  const stepId = STEPS[ui.currentStep].id;
  const lastIdx = ui.trainer.states.length - 1;
  const stateIdx = {
    input:  0,
    bytes:  0,
    tokens: 0,
    pairs:  0,                    // antes del primer merge
    merge:  Math.min(1, lastIdx), // después del primer merge
    all:    lastIdx,              // después de todos los merges
    result: lastIdx,
  }[stepId] ?? 0;

  const currentState = ui.trainer.states[stateIdx];

  // Counts panel — show top pairs from current state
  const counts = currentState.pairCounts || new Map();
  const sortedCounts = [...counts.entries()]
    .map(([k, v]) => ({ key: k, pair: k.split(',').map(Number), count: v }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
    .slice(0, 8);

  let countsHTML = '';
  if (sortedCounts.length === 0) {
    countsHTML = `<div style="color: ${COLORS.muted}; font-size: 13px; padding: 8px;">Sin pares.</div>`;
  } else {
    for (const { pair, count } of sortedCounts) {
      const a = formatTokenDisplay(pair[0], currentState.vocab);
      const b = formatTokenDisplay(pair[1], currentState.vocab);
      const max = sortedCounts[0].count;
      const widthPct = (count / max) * 100;
      countsHTML += `
        <div class="data-row">
          <span class="data-row-key">(${escapeXml(a)}, ${escapeXml(b)})</span>
          <div style="position: relative; height: 14px;">
            <div style="position: absolute; top: 4px; left: 0;
                        width: ${widthPct}%; height: 6px;
                        background: ${COLORS.merge}; border-radius: 3px;
                        opacity: 0.7;"></div>
          </div>
          <span class="data-row-val">${count}</span>
        </div>
      `;
    }
  }
  document.getElementById('counts-list').innerHTML = countsHTML;
  document.getElementById('counts-count').textContent = `${counts.size} únicos`;

  // Merges panel
  const merges = currentState.merges || [];
  let mergesHTML = '';
  if (merges.length === 0) {
    mergesHTML = `<div style="color: ${COLORS.muted}; font-size: 13px; padding: 8px;">Aún no se aprendieron merges.</div>`;
  } else {
    const recent = merges.slice(-8).reverse();
    for (const m of recent) {
      const a = formatTokenDisplay(m.pair[0], currentState.vocab);
      const b = formatTokenDisplay(m.pair[1], currentState.vocab);
      mergesHTML += `
        <div class="data-row highlight-winner">
          <span class="data-row-key">(${escapeXml(a)}, ${escapeXml(b)})</span>
          <span class="data-row-val" style="color: ${COLORS.muted};">→</span>
          <span class="data-row-val" style="color: ${COLORS.merge};">${m.newId}</span>
        </div>
      `;
    }
  }
  document.getElementById('merges-list').innerHTML = mergesHTML;
  document.getElementById('merges-count').textContent = `${merges.length}`;

  // Vocab panel — show last 12 IDs (256+)
  const vocab = currentState.vocab;
  const mergeIds = merges.map(m => m.newId);
  let vocabHTML = '';
  const showFrom = Math.max(256, Math.max(...mergeIds, 255) - 11);
  for (let id = Math.max(0, 256); id <= Math.max(...mergeIds, 255); id++) {
    const bytes = vocab.get(id) || [];
    const isNew = id >= 256;
    const decoded = decodeBytes(bytes);
    const bytesStr = bytes.length === 1
      ? (bytes[0] >= 32 && bytes[0] < 127 ? String.fromCharCode(bytes[0]) : `\\x${bytes[0].toString(16).padStart(2,'0')}`)
      : decoded;
    vocabHTML += `
      <div class="vocab-chip ${isNew ? 'new' : ''}">
        <div class="vocab-chip-id">${id}${isNew ? ' · nuevo' : ''}</div>
        <div class="vocab-chip-bytes">${escapeXml(bytesStr)}</div>
      </div>
    `;
  }
  if (vocabHTML === '') {
    vocabHTML = `<div style="grid-column: 1 / -1; color: ${COLORS.muted}; font-size: 13px; padding: 8px;">
      Aún no hay merges. El vocabulario son los 256 bytes.
    </div>`;
  }
  document.getElementById('vocab-grid').innerHTML = vocabHTML;
  document.getElementById('vocab-count').textContent = `${vocab.size}`;
}

// ============================================================
// 6. Step navigation
// ============================================================

function renderCurrentStep() {
  const step = STEPS[ui.currentStep];

  // Update header
  document.getElementById('stage-heading').textContent = step.title;
  document.getElementById('stage-description').textContent = step.desc;

  // Render canvas
  const canvas = document.getElementById('stage-canvas');
  switch (step.id) {
    case 'input':  canvas.innerHTML = renderStepInput(); break;
    case 'bytes':  canvas.innerHTML = renderStepBytes(); break;
    case 'tokens': canvas.innerHTML = renderStepTokens(); break;
    case 'pairs':  canvas.innerHTML = renderStepPairs(); break;
    case 'merge':  canvas.innerHTML = renderStepMerge(); break;
    case 'all':    canvas.innerHTML = renderStepAllMerges(); break;
    case 'result': canvas.innerHTML = renderStepResult(); break;
  }

  // Update explanation
  const explanations = {
    input: '<strong>BPE</strong> (Byte Pair Encoding) es el algoritmo que usa GPT-2, RoBERTa y muchos otros modelos. La idea es: partimos de bytes sueltos y vamos <em>mergeando</em> los pares más frecuentes hasta tener un vocabulario compacto.',
    bytes: 'Cada carácter se convierte en <strong>1 o más bytes UTF-8</strong>. Los caracteres ASCII (a-z, espacio, punto) son 1 byte. Las letras acentuadas y emojis ocupan más.',
    tokens: 'Al principio, <strong>cada byte es su propio token</strong>. El ID del token es el valor del byte (0–255). Para "el", los tokens son 101 (e) y 108 (l).',
    pairs: 'Recorremos el texto contando <strong>pares adyacentes</strong>. El par con la frecuencia más alta gana — va a ser el próximo merge porque es lo que más "comprime" el texto.',
    merge: 'El par más frecuente se reemplaza por un <strong>nuevo token</strong>. Le asignamos el próximo ID libre (256, 257, ...) y guardamos el merge en el diccionario.',
    all: 'Repetimos <strong>N veces</strong>: contar pares → merge. Cada merge nuevo reduce la cantidad de tokens y crece el vocabulario.',
    result: 'Ahora podemos <strong>tokenizar texto nuevo</strong>. Para "gato come", aplicamos los merges aprendidos en orden — los más antiguos primero.',
  };
  document.getElementById('explanation-text').innerHTML = explanations[step.id] || '';

  // Shape badge
  const shapeBadge = document.getElementById('shape-badge');
  const shapeData = {
    bytes:  `[${ui.trainer.textBytes.length}]`,
    tokens: `[${ui.trainer.textBytes.length}]`,
    pairs:  `[${ui.trainer.states[0].pairCounts.size}]`,
    merge:  `[${ui.trainer.states[0].ids.length}] → [${ui.trainer.states[1].ids.length}]`,
    all:    `[${ui.trainer.textBytes.length}] → [${ui.trainer.finalIds.length}]`,
  };
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

  // Update button states
  document.getElementById('btn-prev').disabled = ui.currentStep === 0;
  document.getElementById('btn-next').disabled = ui.currentStep === ui.totalSteps - 1;
}

function updateStepper() {
  const dotsContainer = document.getElementById('step-dots');
  let dotsHTML = '';
  for (let i = 0; i < ui.totalSteps; i++) {
    let cls = 'step-dot';
    if (i < ui.currentStep) cls += ' done';
    else if (i === ui.currentStep) cls += ' active';
    dotsHTML += `<div class="${cls}"></div>`;
  }
  dotsContainer.innerHTML = dotsHTML;

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
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
    Pausar
  `;
  ui.autoTimer = setInterval(() => {
    if (ui.currentStep < ui.totalSteps - 1) {
      nextStep();
    } else {
      stopAuto();
    }
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
// 7. Init
// ============================================================

function reload() {
  const text = document.getElementById('input-text').value;
  const vocabSize = parseInt(document.getElementById('vocab-size').value) || 280;
  ui.trainer = runTrain(text, Math.max(257, Math.min(512, vocabSize)));
  ui.currentStep = 0;
  renderCurrentStep();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-next').addEventListener('click', () => {
    stopAuto();
    nextStep();
  });
  document.getElementById('btn-prev').addEventListener('click', () => {
    stopAuto();
    prevStep();
  });
  document.getElementById('btn-auto').addEventListener('click', () => {
    if (ui.autoTimer) stopAuto();
    else startAuto();
  });
  document.getElementById('btn-reload').addEventListener('click', () => {
    stopAuto();
    reload();
  });
  // Also reload when input changes
  let reloadTimer;
  document.getElementById('input-text').addEventListener('input', () => {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(reload, 600);
  });
  document.getElementById('vocab-size').addEventListener('change', reload);

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') { stopAuto(); nextStep(); }
    else if (e.key === 'ArrowLeft') { stopAuto(); prevStep(); }
  });

  reload();
});