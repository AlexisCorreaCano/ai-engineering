import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "/Users/alexis/.agents/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "/Users/alexis/.agents/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
mkdirSync(HERE, { recursive: true });
const W = 900, H = 560;
const BASE = { x: -170, y: -90, w: 340, d: 180, r: 8 };
const CAB = { x: -125, y: -62, w: 250, d: 124, r: 5 };
const P = k.fitProjection([...k.boxCorners(BASE, -12, 0), [150, 80, 75], [-145, -70, 110]], W, H, { pad: 36, azimuth: 42 });
const at = (p) => k.iso(p, P);
const S = (p, style) => k.solidSvg(p, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const byDepth = (arr) => [...arr].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -12, 0, P)}"/>`];
  out.push(S(k.slabOf(BASE, -7, 7, P, 8, 1.3), { tone: "mid" }));
  for (const [x, y] of byDepth(k.corners(BASE, 18))) {
    out.push(S(k.cylinder(x, y, 7, -12, 5, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 4.8, -7, 2, P, 28), { tone: "mid" }));
  }
  const screws = k.corners(BASE, 11);
  out.push(D(screws.map(([x, y]) => at([x, y, 7])), { size: 0.6 }));
  const rail = { x: -154, y: 71, w: 308, d: 7, r: 1 };
  out.push(S(k.slabOf(rail, 0, 1.4, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(-148, 148, 5, 5, 74, 1.4, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  return out.join("");
}

function cabinet() {
  const out = [];
  out.push(S(k.slabOf(CAB, 0, 5, P, 6, 0.8), { tone: "mid" }));
  out.push(S(k.slabOf({ x: CAB.x, y: CAB.y, w: 8, d: CAB.d, r: 2 }, 5, 70, P, 4), { tone: "lo" }));
  out.push(S(k.slabOf({ x: CAB.x + CAB.w - 8, y: CAB.y, w: 8, d: CAB.d, r: 2 }, 5, 70, P, 4), { tone: "lo" }));
  out.push(S(k.slabOf({ x: CAB.x, y: CAB.y, w: CAB.w, d: 8, r: 2 }, 5, 70, P, 4), { tone: "lo" }));
  out.push(S(k.slabOf({ x: CAB.x, y: CAB.y + CAB.d - 8, w: CAB.w, d: 8, r: 2 }, 5, 70, P, 4), { tone: "lo" }));
  // Eight memory slots: each is a real drawer with a chip and contact screws.
  const cols = [-96, -48, 0, 48, 96];
  cols.forEach((x, i) => {
    const slot = { x: x - 18, y: -38, w: 36, d: 70, r: 2 };
    out.push(S(k.slabOf(slot, 6, 10 + (i % 2) * 4, P, 3, 0.4), { tone: i === 2 ? "hi" : "mid", lit: i === 2 }));
    const chip = { x: x - 11, y: -25, w: 22, d: 44, r: 1 };
    out.push(S(k.slabOf(chip, 16 + (i % 2) * 4, 8, P, 2, 0.3), { tone: i === 2 ? "lit" : "hi", crease: "lo" }));
    for (const yy of [-20, -9, 2, 13]) out.push(D([at([x - 14, yy, 17]), at([x + 14, yy, 17])], { size: 0.35, tone: "lo" }));
  });
  // Vertical fins and the top heat spreader.
  out.push(S(k.slabOf({ x: -115, y: -50, w: 230, d: 100, r: 3 }, 30, 5, P, 4), { tone: "mid" }));
  for (let x = -104; x <= 104; x += 16) out.push(S(k.slabOf({ x, y: -47, w: 4, d: 94, r: 0.5 }, 35, 12, P, 2), { tone: "lo", crease: "none" }));
  return out.join("");
}

function pipeline() {
  const out = [];
  const modules = [
    { id: "params", x: -116, y: -128, label: "PARAMETERS", tone: "blue" },
    { id: "acts", x: -26, y: -128, label: "ACTIVATIONS", tone: "green" },
    { id: "grads", x: 64, y: -128, label: "GRADIENTS", tone: "red" },
    { id: "opt", x: 116, y: 14, label: "OPTIMIZER STATE", tone: "mid" },
  ];
  modules.forEach((m, index) => {
    const plan = { x: m.x - 28, y: m.y - 18, w: 56, d: 36, r: 3 };
    const z = 11 + index * 2;
    out.push(`<g data-module="${m.id}">`);
    out.push(S(k.slabOf(plan, z, 15, P, 5, 0.7), { tone: index === 0 ? "hi" : "mid", lit: index === 0 }));
    out.push(L(k.planOutline(k.insetPlan(plan, 4), z + 15, P), { tone: "faint" }));
    for (let n = 0; n < 4; n++) out.push(S(k.cylinder(m.x - 17 + n * 11, m.y - 7, 2.2, z + 15, 3, P, 20), { tone: m.tone === "mid" ? "lo" : m.tone }));
    out.push(k.faceTextSvg(k.topMatrix([m.x, m.y + 3], z + 15, P, "x"), m.label, { size: 2.7, tone: "lo", anchor: "middle" }));
    out.push("</g>");
  });
  // Batch cards arriving from RAM and a PCIe bridge.
  for (let i = 0; i < 6; i++) {
    const x = -124 + i * 9, y = 92 - i * 3;
    out.push(S(k.slabOf({ x, y, w: 18, d: 10, r: 1 }, 9 + i, 2.5, P, 2), { tone: "hi", crease: "none" }));
  }
  const cableA = at([-126, 87, 12]), cableB = at([-116, -100, 20]);
  out.push(L(k.pathOf([cableA, at([-145, 20, 20]), cableB]), { tone: "lit", flow: true }));
  // Fan and fan hub: keeps the concrete machine feel.
  out.push(S(k.cylinder(118, 46, 18, 42, 5, P, 40), { tone: "lo" }));
  out.push(S(k.cylinder(118, 46, 4, 47, 2, P, 28), { tone: "mid" }));
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    out.push(L(k.lineOnTop([118, 46], [118 + Math.cos(a) * 14, 46 + Math.sin(a) * 14], 49, P), { tone: "lo" }));
  }
  return out.join("");
}

const svg = k.figureSvg({
  width: W, height: H,
  label: "An isometric VRAM warehouse showing model parameters, activations, gradients, optimizer state, input batches, memory chips, heat spreader and data transfer between CPU RAM and a GPU memory bank.",
  body: [base(), cabinet(), pipeline()],
});

const LIVE = `
const readout = document.querySelector('[data-readout]');
const svg = document.querySelector('svg');
const buttons = [...document.querySelectorAll('[data-mode], [data-precision]')];
const moduleButtons = [...document.querySelectorAll('[data-module-btn]')];
const modules = [...svg.querySelectorAll('[data-module]')];
const memory = document.querySelector('[data-memory]');
const explanation = document.querySelector('[data-explanation]');
const subtitle = document.querySelector('[data-subtitle]');
let mode = 'train', precision = 'fp32', focused = 'params';
const copy = {
  params: ['Parámetros', 'Los pesos aprendidos del modelo. Se mantienen tanto en entrenamiento como en inferencia.'],
  acts: ['Activaciones', 'Resultados intermedios del forward pass. Durante entrenamiento se guardan para poder calcular el backward pass.'],
  grads: ['Gradientes', 'Indican cómo cambiar cada parámetro para reducir la loss. Solo existen durante entrenamiento.'],
  opt: ['Estado del optimizador', 'Adam guarda momentos por parámetro; por eso puede consumir tanta o más memoria que el propio modelo.'],
};
const allocation = {
  'train-fp32': { params: 1.6, acts: 1.2, grads: 1.6, opt: 3.2, batch: .4 },
  'train-fp16': { params: .8, acts: .6, grads: .8, opt: 3.2, batch: .2 },
  'infer-fp32': { params: 1.6, acts: .6, grads: 0, opt: 0, batch: .2 },
  'infer-fp16': { params: .8, acts: .3, grads: 0, opt: 0, batch: .1 },
};
function update(){
  const a = allocation[mode + '-' + precision];
  const total = Object.values(a).reduce((x,y) => x + y, 0);
  readout.textContent = total.toFixed(1) + ' GB / 8 GB · ' + precision.toUpperCase() + ' · ' + (mode === 'train' ? 'entrenamiento' : 'inferencia');
  memory.style.setProperty('--fill', (total / 8 * 100).toFixed(1) + '%');
  memory.querySelector('[data-total]').textContent = total.toFixed(1) + ' GB';
  memory.querySelector('[data-breakdown]').textContent = 'P ' + a.params.toFixed(1) + ' · A ' + a.acts.toFixed(1) + ' · G ' + a.grads.toFixed(1) + ' · O ' + a.opt.toFixed(1) + ' · B ' + a.batch.toFixed(1);
  modules.forEach(g => {
    const off = a[g.dataset.module] === 0;
    g.style.opacity = off ? '.16' : (g.dataset.module === focused ? '1' : '.68');
    g.style.filter = g.dataset.module === focused ? 'drop-shadow(0 0 5px #fff6)' : 'none';
  });
  buttons.forEach(b => b.setAttribute('aria-pressed', String((b.dataset.mode === mode) || (b.dataset.precision === precision))));
  moduleButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.moduleBtn === focused)));
  const [title, text] = copy[focused];
  subtitle.textContent = title + ': ' + (a[focused] === 0 ? 'no se reserva en inferencia' : a[focused].toFixed(1) + ' GB en este ejemplo');
  explanation.textContent = text;
}
buttons.forEach(b => b.addEventListener('click', () => { if(b.dataset.mode) mode=b.dataset.mode; if(b.dataset.precision) precision=b.dataset.precision; update(); }));
moduleButtons.forEach(b => b.addEventListener('click', () => { focused=b.dataset.moduleBtn; update(); }));
update();
`;

const controls = `<section class="lesson-controls" aria-label="Controles de la explicación"><div><span class="control-label">Modo</span><button data-mode="train" aria-pressed="true">Entrenamiento</button><button data-mode="infer">Inferencia</button></div><div><span class="control-label">Precisión</span><button data-precision="fp32" aria-pressed="true">FP32 · 4 bytes</button><button data-precision="fp16">FP16 · 2 bytes</button></div></section>`;
const memoryMeter = `<aside class="memory-meter" data-memory><div class="meter-top"><strong>Presupuesto de VRAM</strong><b data-total>8.0 GB</b></div><div class="meter"><span></span></div><code data-breakdown>P 1.6 · A 1.2 · G 1.6 · O 3.2 · B 0.4</code><small>Ejemplo conceptual: una GPU con 8 GB. En Apple Silicon es memoria unificada, pero la presión de memoria sigue existiendo.</small></aside>`;
const moduleGuide = `<section class="module-guide"><div class="module-tabs"><button data-module-btn="params" aria-pressed="true">1 · Parámetros</button><button data-module-btn="acts">2 · Activaciones</button><button data-module-btn="grads">3 · Gradientes</button><button data-module-btn="opt">4 · Adam</button></div><div class="module-copy"><strong data-subtitle></strong><p data-explanation></p></div></section>`;
const body = k.plateHtml({
  fig: "Fig 1", title: "Anatomía de VRAM", hint: "Explora cada cajón de memoria", readout: "8.0 GB / 8 GB · FP32 · entrenamiento",
  keys: [{ mark: "lit", label: "Cajón iluminado: componente seleccionado" }, { mark: "raised", label: "Los cuatro residentes de la VRAM" }],
  caption: "La VRAM funciona como la mesa de trabajo de la GPU. El modelo, sus resultados intermedios y —durante entrenamiento— la información para corregirse deben caber al mismo tiempo. Cambia los controles: FP16 reduce algunos cajones, pero Adam puede conservar su estado en FP32.",
  body: `${controls}${memoryMeter}<div class="iso-stage">${svg}</div>${moduleGuide}`,
});
const extra = `<style>
.lesson-controls{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 12px;padding:10px 12px;background:var(--anatomy-face);border:1px solid var(--anatomy-faint);border-radius:10px}.control-label{color:var(--anatomy-muted);font-size:11px;text-transform:uppercase;letter-spacing:.08em;margin-right:8px}.lesson-controls button,.module-tabs button{background:transparent;color:var(--anatomy-text);border:1px solid var(--anatomy-faint);border-radius:7px;padding:6px 9px;margin-right:5px;cursor:pointer}.lesson-controls button[aria-pressed=true],.module-tabs button[aria-pressed=true]{color:var(--anatomy-strong);border-color:var(--anatomy-mid);background:var(--anatomy-shade-3)}.memory-meter{margin:0 0 12px;padding:11px 13px;border-left:3px solid var(--anatomy-lit);background:var(--anatomy-face);border-radius:0 8px 8px 0}.meter-top{display:flex;justify-content:space-between;gap:12px}.memory-meter strong{color:var(--anatomy-strong)}.memory-meter b{font-family:var(--anatomy-mono);color:var(--anatomy-strong)}.meter{height:8px;margin:10px 0 7px;background:var(--anatomy-shade-0);border-radius:99px;overflow:hidden}.meter span{display:block;width:var(--fill);height:100%;background:var(--anatomy-hi);transition:width .45s var(--anatomy-ease)}.memory-meter code{display:block;color:var(--anatomy-muted);font:11px var(--anatomy-mono)}.memory-meter small{display:block;color:var(--anatomy-muted);margin-top:7px}.module-guide{display:grid;grid-template-columns:1.35fr 1fr;gap:12px;margin-top:14px}.module-tabs{display:flex;flex-wrap:wrap;align-content:start;gap:6px}.module-tabs button{margin:0}.module-copy{padding:10px 12px;background:var(--anatomy-face);border-radius:8px;border:1px solid var(--anatomy-faint)}.module-copy strong{color:var(--anatomy-strong)}.module-copy p{margin:6px 0 0;color:var(--anatomy-text)}@media(max-width:560px){.module-guide{grid-template-columns:1fr}.lesson-controls{display:block}.lesson-controls>div+div{margin-top:8px}}</style>`;
const html = k.pageHtml({ title: "VRAM anatomy", theme: "dark", body: extra + body, script: kitScript() + LIVE, width: 960 });
writeFileSync(join(HERE, "vram-anatomy.html"), html);
console.log("wrote", join(HERE, "vram-anatomy.html"));
