/* ============================================================
   Self-Attention 3D — motor principal
   ============================================================
   Visualización 3D (Three.js) del flujo de single-head attention.

   Matemática 1:1 con attention.js (versión 2D) y con el notebook
   01-self-attention.ipynb.

   Convenciones:
   - n = 3 tokens por defecto (máximo 3)
   - d_model = 8 (fijo en esta vista)
   - Filas de la matriz de scores: query (i).
   - Columnas de la matriz de scores: key (j).
   - score[i][j] = Σ_d Q[i][d] · K[j][d]  (producto punto en 8D)
   - attn = softmax(scores / √d_model) por filas
   - output = attn @ V
*/

/* ============================================================
   1. Imports (mapa de import declarado en index.html)
   ============================================================ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

/* ============================================================
   2. Config y constantes
   ============================================================ */

const DMODEL = 8;
const MAX_TOKENS = 3;
const DEFAULT_SEED = 42;
const RING_RADIUS = 3.2;

// Palabras: heredamos del style.css padre
const COL = {
  input:  new THREE.Color('#6ee7b7'),
  q:      new THREE.Color('#a78bfa'),
  k:      new THREE.Color('#f472b6'),
  v:      new THREE.Color('#fb923c'),
  score:  new THREE.Color('#fbbf24'),
  output: new THREE.Color('#60a5fa'),
  token:  new THREE.Color('#cbd5e1'),
  dim:    new THREE.Color('#475569'),
};

/* ============================================================
   3. Utilidades numéricas (mismas que attention.js)
   ============================================================ */

function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randn(rng) {
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

function zeros(r, c) {
  return Array.from({ length: r }, () => new Array(c).fill(0));
}

function fmt(v, d = 2) {
  if (Math.abs(v) < Math.pow(10, -d) / 2) return (0).toFixed(d);
  return v.toFixed(d);
}

// Hash determinístico de string → uint32
function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// Receta determinística de embedding para un token.
// IMPORTANTE: NO son embeddings pretrained — son vectores de demo,
// generados a partir de un hash del string, útiles para visualizar.
function tokenEmbedding(token, dModel, salt) {
  const seed = (hashString(token) ^ (salt >>> 0)) >>> 0;
  const rng = mulberry32(seed);
  const emb = [];
  for (let d = 0; d < dModel; d++) {
    emb.push(rng() * 2 - 1); // [-1, 1]
  }
  return emb;
}

/* ============================================================
   4. Pipeline de self-attention
   ============================================================ */

function runAttention(tokens, seed) {
  const n = tokens.length;
  const dModel = DMODEL;
  const rng = mulberry32(seed >>> 0);

  // 1. Input embeddings x: [n, dModel] — receta determinística
  const x = tokens.map(t => tokenEmbedding(t, dModel, seed));

  // 2. W matrices — Kaiming-like init
  function kaiming(d) {
    const std = Math.sqrt(2 / d);
    return Array.from({ length: d }, () =>
      Array.from({ length: d }, () => randn(rng) * std)
    );
  }
  const Wq = kaiming(dModel);
  const Wk = kaiming(dModel);
  const Wv = kaiming(dModel);

  // 3. Q, K, V — proyección lineal
  const Q = matMul(x, Wq);
  const K = matMul(x, Wk);
  const V = matMul(x, Wv);

  // 4. rawScores = Q @ Kᵀ
  const KT = transpose(K);
  const rawScores = matMul(Q, KT);

  // 5. scaled + softmax
  const scaledScores = rawScores.map(row => row.map(v => v / Math.sqrt(dModel)));
  const attn = softmax(scaledScores);

  // 6. output = attn @ V
  const output = matMul(attn, V);

  return { tokens, n, dModel, seed, x, Wq, Wk, Wv, Q, K, V, KT, rawScores, scaledScores, attn, output };
}

/* ============================================================
   5. Steps
   ============================================================ */

const STEPS = [
  {
    id: 'input',
    title: '1. Input embeddings',
    desc: 'Cada token es un vector de 8 dimensiones. Estos embeddings son la entrada al bloque de self-attention (en un transformer real vienen del embedding layer + positional encoding).',
    shortLabel: 'Input embeddings',
    caption: 'Tres tokens como puntos en un espacio de 8 dimensiones. La flecha muestra una proyección 3D de sus primeras 3 coordenadas.',
  },
  {
    id: 'w',
    title: '2. Matrices de proyección W',
    desc: 'Self-attention tiene tres matrices de pesos W_q, W_k, W_v. Aquí nacen aleatorias (kaiming init); durante el entrenamiento se ajustan vía backprop hasta especializarse.',
    shortLabel: 'W_q, W_k, W_v',
    caption: 'Tres matrices [8, 8] inicializadas con kaiming. Sus valores se aprenden durante el entrenamiento.',
  },
  {
    id: 'qkv',
    title: '3. Proyecciones Q, K, V',
    desc: 'Cada token se proyecta tres veces: Q = x · W_q, K = x · W_k, V = x · W_v. Mismo input, tres "vistas" en espacios distintos.',
    shortLabel: 'Q, K, V',
    caption: 'Q (morado), K (rosa) y V (naranja) son tres proyecciones distintas del mismo input.',
  },
  {
    id: 'scores',
    title: '4. Attention scores: Q @ Kᵀ',
    desc: 'score[i][j] = Σ_d Q[i,d] · K[j,d] — producto punto entre la fila i de Q y la fila j de K. Mide "similitud geométrica" en 8D.',
    shortLabel: 'Q @ Kᵀ',
    caption: 'Producto punto entre cada query y cada key. Vectores alineados → score alto. Vectores opuestos → score negativo.',
  },
  {
    id: 'softmax',
    title: '5. Softmax → attention weights',
    desc: 'Softmax por filas (scores / √d_k) → cada fila se normaliza a una distribución que suma 1. Estos son los pesos de atención attn[i][j].',
    shortLabel: 'softmax',
    caption: 'Las filas de scores se normalizan a distribuciones (suman 1).',
  },
  {
    id: 'weighted',
    title: '6. Suma ponderada: attn @ V',
    desc: 'output[i] = Σ_j attn[i][j] · V[j]. Cada output es un promedio ponderado de todos los V, con los pesos de atención como coeficientes.',
    shortLabel: 'attn @ V',
    caption: 'Los pesos attn fluyen a lo largo de las aristas; cada output es una mezcla de los V.',
  },
  {
    id: 'output',
    title: '7. Output contextualizado',
    desc: 'El output tiene la misma forma que el input [n, d] pero cada posición ahora mezcla información del resto de la secuencia.',
    shortLabel: 'Output',
    caption: 'Output[i] contiene info de todos los tokens, pesada por attn[i].',
  },
];

/* ============================================================
   6. WebGL guard
   ============================================================ */

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

/* ============================================================
   7. Escena Three.js
   ============================================================ */

class AttentionScene {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.step = 0;
    this.selectedIJ = [0, 0]; // (query_idx, key_idx) para paso 4
    this.activeToken = -1;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.clock = new THREE.Clock();
    this.particles = [];
    this.transitionT = 0; // 0..1 — animación de transición entre steps

    this._init();
    this._build();
    this._renderStep(this.step, true);
    this._animate = this._animate.bind(this);
    requestAnimationFrame(this._animate);
  }

  setData(data) {
    this.data = data;
    this._rebuildDynamic();
    this._renderStep(this.step, true);
  }

  setStep(idx, instant = false) {
    if (idx === this.step) return;
    this.step = idx;
    this._renderStep(idx, instant);
  }

  /* -------- Init -------- */
  _init() {
    const wrap = this.container;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;

    // WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: wrap.querySelector('#three-canvas'),
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // CSS2D renderer para etiquetas
    this.labelRenderer = new CSS2DRenderer({
      element: wrap.querySelector('#three-labels'),
    });
    this.labelRenderer.setSize(w, h);

    // Escena
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.scene.fog = new THREE.FogExp2(0x0a0e1a, 0.04);

    // Cámara
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(0, 5.5, 9.5);
    this.camera.lookAt(0, 0, 0);

    // Controles
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 18;
    this.controls.maxPolarAngle = Math.PI * 0.85;
    this.controls.target.set(0, 0, 0);

    // Luces
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(5, 10, 7);
    this.scene.add(dir);
    const hemi = new THREE.HemisphereLight(0xa78bfa, 0x0a0e1a, 0.25);
    this.scene.add(hemi);

    // Grid sutil
    const grid = new THREE.GridHelper(20, 20, 0x252b3d, 0x1a2030);
    grid.position.y = -2.5;
    grid.material.transparent = true;
    grid.material.opacity = 0.45;
    this.scene.add(grid);

    // Grupo raíz
    this.root = new THREE.Group();
    this.scene.add(this.root);

    // Estado para raycaster
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.tokenMeshes = [];

    // Resize
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  _onResize() {
    const wrap = this.container;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    this.renderer.setSize(w, h, false);
    this.labelRenderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /* -------- Build (estructura persistente) -------- */
  _build() {
    const n = this.data.n;

    // 1. Tokens en un anillo en plano XZ (y=0)
    this.tokenGroup = new THREE.Group();
    this.root.add(this.tokenGroup);

    this.tokenNodes = []; // {mesh, label, pos, baseEmissive}
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const pos = new THREE.Vector3(
        Math.cos(angle) * RING_RADIUS,
        0,
        Math.sin(angle) * RING_RADIUS
      );

      // Nodo del token (esfera)
      const geom = new THREE.SphereGeometry(0.34, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x131825,
        emissive: COL.token.clone(),
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.5,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      mesh.userData.tokenIdx = i;
      this.tokenGroup.add(mesh);
      this.tokenMeshes.push(mesh);

      // Anillo exterior sutil
      const ringGeom = new THREE.RingGeometry(0.42, 0.46, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: COL.token,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      ring.lookAt(this.camera.position);
      this.tokenGroup.add(ring);

      // Etiqueta CSS2D
      const labelDiv = document.createElement('div');
      labelDiv.className = 'token-label';
      labelDiv.innerHTML = `<span class="token-label-index">[${i}]</span>${this.data.tokens[i]}`;
      const labelObj = new CSS2DObject(labelDiv);
      labelObj.position.copy(pos).add(new THREE.Vector3(0, 0.8, 0));
      this.tokenGroup.add(labelObj);

      this.tokenNodes.push({ mesh, label: labelObj, labelDiv, ring, pos, baseEmissive: 0.4 });
    }

    // 2. Flechas Q/K/V por token (inicialmente invisibles)
    this.arrowGroups = []; // {q, k, v} por token
    for (let i = 0; i < n; i++) {
      const arrowGroup = new THREE.Group();
      arrowGroup.position.copy(this.tokenNodes[i].pos);
      this.root.add(arrowGroup);

      // Dirección en 3D: primeras 3 coords del embedding
      const dir = this._first3Vec(this.data.x[i]).normalize().multiplyScalar(1.8);

      const qArrow = this._makeArrow(COL.q, dir, 'q');
      const kArrow = this._makeArrow(COL.k, dir.clone().negate(), 'k');
      const vArrow = this._makeArrow(COL.v, this._first3Vec(this.data.x[i]).normalize().multiplyScalar(1.5), 'v');

      qArrow.group.visible = false;
      kArrow.group.visible = false;
      vArrow.group.visible = false;

      arrowGroup.add(qArrow.group);
      arrowGroup.add(kArrow.group);
      arrowGroup.add(vArrow.group);

      // Etiquetas Q/K/V
      qArrow.group.userData.labelDiv = this._makeFloatLabel('Q', COL.q.getStyle());
      kArrow.group.userData.labelDiv = this._makeFloatLabel('K', COL.k.getStyle());
      vArrow.group.userData.labelDiv = this._makeFloatLabel('V', COL.v.getStyle());

      this.arrowGroups.push({ q: qArrow, k: kArrow, v: vArrow, dir });
    }

    // 3. Aristas de score/attention — 9 edges en grafo completo
    this.edgesGroup = new THREE.Group();
    this.root.add(this.edgesGroup);

    this.edges = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const edge = this._makeEdge(this.tokenNodes[i].pos, this.tokenNodes[j].pos);
        edge.mesh.visible = false;
        this.edgesGroup.add(edge.mesh);
        this.edges.push({ i, j, mesh: edge.mesh, lineMat: edge.lineMat });
      }
    }

    // 4. Partículas para paso 6
    this.particleGroup = new THREE.Group();
    this.root.add(this.particleGroup);
    this.particlePool = [];
    const POOL_SIZE = 120;
    const partGeom = new THREE.SphereGeometry(0.06, 12, 12);
    for (let p = 0; p < POOL_SIZE; p++) {
      const mat = new THREE.MeshBasicMaterial({
        color: COL.score,
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(partGeom, mat);
      mesh.visible = false;
      this.particleGroup.add(mesh);
      this.particlePool.push({ mesh, mat, active: false, from: null, to: null, t: 0, speed: 0 });
    }

    // 5. Output nodes (esferas azules en el mismo lugar que los tokens)
    this.outputGroup = new THREE.Group();
    this.root.add(this.outputGroup);
    this.outputNodes = [];
    for (let i = 0; i < n; i++) {
      const geom = new THREE.SphereGeometry(0.5, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0a0e1a,
        emissive: COL.output.clone(),
        emissiveIntensity: 0,
        roughness: 0.3,
        metalness: 0.5,
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(this.tokenNodes[i].pos);
      mesh.visible = false;
      this.outputGroup.add(mesh);

      // Vector output azul
      const dir = this._first3Vec(this.data.output[i]).normalize().multiplyScalar(1.8);
      const outArrow = this._makeArrow(COL.output, dir, 'out');
      outArrow.group.position.copy(this.tokenNodes[i].pos);
      outArrow.group.visible = false;
      this.outputGroup.add(outArrow.group);

      this.outputNodes.push({ mesh, arrow: outArrow });
    }

    // 6. Hover/click handlers
    this.renderer.domElement.addEventListener('pointermove', e => this._onPointerMove(e));
    this.renderer.domElement.addEventListener('pointerdown', e => this._onPointerDown(e));

    // 7. Tab focus → outline via CSS (ya en :focus)
  }

  _rebuildDynamic() {
    // Cuando cambian los tokens / seed: reorientamos flechas con nuevas direcciones 3D
    for (let i = 0; i < this.data.n; i++) {
      const dir = this._first3Vec(this.data.x[i]).normalize().multiplyScalar(1.8);
      this._retargetArrow(this.arrowGroups[i].q, dir);
      this._retargetArrow(this.arrowGroups[i].k, dir.clone().negate());
      const vdir = this._first3Vec(this.data.x[i]).normalize().multiplyScalar(1.5);
      this._retargetArrow(this.arrowGroups[i].v, vdir);

      const outDir = this._first3Vec(this.data.output[i]).normalize().multiplyScalar(1.8);
      this._retargetArrow(this.outputNodes[i].arrow, outDir);
    }
    // Actualizar labels
    this.tokenNodes.forEach((tn, i) => {
      tn.labelDiv.innerHTML = `<span class="token-label-index">[${i}]</span>${this.data.tokens[i]}`;
    });
  }

  _first3Vec(vec8) {
    return new THREE.Vector3(vec8[0], vec8[1], vec8[2]);
  }

  _makeArrow(color, dir, kind) {
    // Construye un ArrowHelper personalizado con cilindro + cono
    const group = new THREE.Group();

    const length = Math.max(0.6, dir.length());
    const dirN = dir.clone().normalize();

    const cylGeom = new THREE.CylinderGeometry(0.04, 0.04, length - 0.22, 12);
    cylGeom.translate(0, (length - 0.22) / 2, 0);
    const cylMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
    const cyl = new THREE.Mesh(cylGeom, cylMat);
    group.add(cyl);

    const coneGeom = new THREE.ConeGeometry(0.13, 0.3, 18);
    coneGeom.translate(0, length - 0.15, 0);
    const coneMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
    const cone = new THREE.Mesh(coneGeom, coneMat);
    group.add(cone);

    // Orientar al vector dir
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dirN);
    group.quaternion.copy(quat);

    return { group, cylMat, coneMat };
  }

  _retargetArrow(arrow, dir) {
    const length = Math.max(0.6, dir.length());
    const dirN = dir.clone().normalize();

    // Reconstruimos geometría (simple)
    arrow.group.clear();
    const cylGeom = new THREE.CylinderGeometry(0.04, 0.04, length - 0.22, 12);
    cylGeom.translate(0, (length - 0.22) / 2, 0);
    const cyl = new THREE.Mesh(cylGeom, arrow.cylMat);
    arrow.group.add(cyl);
    const coneGeom = new THREE.ConeGeometry(0.13, 0.3, 18);
    coneGeom.translate(0, length - 0.15, 0);
    const cone = new THREE.Mesh(coneGeom, arrow.coneMat);
    arrow.group.add(cone);
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dirN);
    arrow.group.quaternion.copy(quat);
  }

  _makeEdge(posA, posB) {
    // Curva Bezier simple entre dos puntos pasando por encima del centro
    const curve = new THREE.QuadraticBezierCurve3(
      posA,
      posA.clone().lerp(posB, 0.5).add(new THREE.Vector3(0, 0.5, 0)),
      posB
    );
    const points = curve.getPoints(40);
    const geom = new THREE.BufferGeometry().setFromPoints(points);

    const mat = new THREE.LineBasicMaterial({
      color: COL.score.clone(),
      transparent: true,
      opacity: 0.5,
      linewidth: 2,
    });
    const mesh = new THREE.Line(geom, mat);
    return { mesh, lineMat: mat };
  }

  _makeFloatLabel(text, color) {
    const div = document.createElement('div');
    div.style.cssText = `
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: ${color};
      background: rgba(10, 14, 26, 0.85);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
      pointer-events: none;
      user-select: none;
      white-space: nowrap;
    `;
    div.textContent = text;
    document.getElementById('three-labels').appendChild(div);
    return div;
  }

  /* -------- Per-step rendering -------- */
  _renderStep(idx, instant) {
    const step = STEPS[idx];
    this.step = idx;

    // Reset visibilidad
    this.tokenNodes.forEach(tn => {
      tn.mesh.material.emissive.copy(COL.token);
      tn.mesh.material.emissiveIntensity = tn.baseEmissive;
      tn.labelDiv.classList.remove('active');
    });
    this.arrowGroups.forEach(a => {
      a.q.group.visible = false;
      a.k.group.visible = false;
      a.v.group.visible = false;
      if (a.q.group.userData.labelDiv) a.q.group.userData.labelDiv.style.opacity = '0';
      if (a.k.group.userData.labelDiv) a.k.group.userData.labelDiv.style.opacity = '0';
      if (a.v.group.userData.labelDiv) a.v.group.userData.labelDiv.style.opacity = '0';
    });
    this.edges.forEach(e => {
      e.mesh.visible = false;
      e.lineMat.opacity = 0;
    });
    this.outputNodes.forEach(o => {
      o.mesh.visible = false;
      o.mesh.material.emissiveIntensity = 0;
      o.mesh.material.opacity = 0;
      o.arrow.group.visible = false;
    });
    this._stopAllParticles();

    // Step-specific
    switch (step.id) {
      case 'input':   this._renderInputStep(); break;
      case 'w':       this._renderWStep(); break;
      case 'qkv':     this._renderQKVStep(); break;
      case 'scores':  this._renderScoresStep(); break;
      case 'softmax': this._renderSoftmaxStep(); break;
      case 'weighted':this._renderWeightedStep(); break;
      case 'output':  this._renderOutputStep(); break;
    }
  }

  _renderInputStep() {
    // Solo nodos visibles, color base. Resaltar uno si está activo.
    this.tokenNodes.forEach((tn, i) => {
      tn.mesh.material.emissive.copy(COL.input);
      tn.mesh.material.emissiveIntensity = 0.55;
    });
    if (this.activeToken >= 0) {
      this.tokenNodes[this.activeToken].mesh.material.emissiveIntensity = 0.95;
      this.tokenNodes[this.activeToken].labelDiv.classList.add('active');
    }
  }

  _renderWStep() {
    // Solo tokens; el contenido numérico va al panel HTML
    this.tokenNodes.forEach((tn, i) => {
      tn.mesh.material.emissive.copy(COL.input);
      tn.mesh.material.emissiveIntensity = 0.45;
    });
  }

  _renderQKVStep() {
    // Q/K/V visibles como flechas desde cada token
    this.arrowGroups.forEach((a, i) => {
      a.q.group.visible = true;
      a.k.group.visible = true;
      a.v.group.visible = true;
      const labelQ = a.q.group.userData.labelDiv;
      const labelK = a.k.group.userData.labelDiv;
      const labelV = a.v.group.userData.labelDiv;
      if (labelQ) { labelQ.style.opacity = '1'; this._positionFloatLabel(labelQ, a.q.group, 0.25); }
      if (labelK) { labelK.style.opacity = '1'; this._positionFloatLabel(labelK, a.k.group, 0.25); }
      if (labelV) { labelV.style.opacity = '1'; this._positionFloatLabel(labelV, a.v.group, 0.25); }
    });
  }

  _renderScoresStep() {
    // Flechas Q/K visibles
    this.arrowGroups.forEach((a, i) => {
      a.q.group.visible = true;
      a.k.group.visible = true;
      const labelQ = a.q.group.userData.labelDiv;
      const labelK = a.k.group.userData.labelDiv;
      if (labelQ) { labelQ.style.opacity = '1'; this._positionFloatLabel(labelQ, a.q.group, 0.25); }
      if (labelK) { labelK.style.opacity = '1'; this._positionFloatLabel(labelK, a.k.group, 0.25); }
    });
    // Aristas de score, opacidad ∝ |score| normalizado
    const scores = this.data.rawScores;
    let smax = 0;
    for (const row of scores) for (const v of row) smax = Math.max(smax, Math.abs(v));
    smax = smax || 1;
    this.edges.forEach(e => {
      const s = scores[e.i][e.j];
      const t = Math.abs(s) / smax;
      e.mesh.visible = true;
      e.lineMat.opacity = 0.1 + 0.7 * t;
      e.lineMat.color.copy(COL.score);
    });
  }

  _renderSoftmaxStep() {
    // Flechas Q/K visibles tenues
    this.arrowGroups.forEach((a, i) => {
      a.q.group.visible = true;
      a.k.group.visible = true;
      a.q.cylMat.opacity = 0.55;
      a.q.coneMat.opacity = 0.55;
      a.k.cylMat.opacity = 0.55;
      a.k.coneMat.opacity = 0.55;
    });
    // Aristas = attention weights
    this.edges.forEach(e => {
      const a = this.data.attn[e.i][e.j];
      e.mesh.visible = true;
      e.lineMat.color.copy(COL.score);
      e.lineMat.opacity = 0.1 + a * 1.4;
      e.lineMat.opacity = Math.min(e.lineMat.opacity, 0.95);
    });
  }

  _renderWeightedStep() {
    // Flechas V visibles
    this.arrowGroups.forEach((a, i) => {
      a.v.group.visible = true;
      const labelV = a.v.group.userData.labelDiv;
      if (labelV) { labelV.style.opacity = '1'; this._positionFloatLabel(labelV, a.v.group, 0.25); }
      a.v.cylMat.opacity = 0.8;
      a.v.coneMat.opacity = 0.8;
    });
    // Aristas tenues con attn
    this.edges.forEach(e => {
      const a = this.data.attn[e.i][e.j];
      e.mesh.visible = true;
      e.lineMat.color.copy(COL.score);
      e.lineMat.opacity = 0.05 + a * 0.9;
      e.lineMat.opacity = Math.min(e.lineMat.opacity, 0.85);
    });
    // Output nodes tenues
    this.outputNodes.forEach(o => {
      o.mesh.visible = true;
      o.mesh.material.opacity = 0.35;
      o.mesh.material.emissiveIntensity = 0.2;
    });
    // Lanzar partículas
    if (!this.reducedMotion) this._spawnParticles();
  }

  _renderOutputStep() {
    // Output visible y dominante
    this.outputNodes.forEach((o, i) => {
      o.mesh.visible = true;
      o.mesh.material.opacity = 0.85;
      o.mesh.material.emissiveIntensity = 0.9;
      o.arrow.group.visible = true;
    });
    // Flechas input tenues como referencia
    this.arrowGroups.forEach((a, i) => {
      a.q.group.visible = true;
      a.q.cylMat.opacity = 0.25;
      a.q.coneMat.opacity = 0.25;
      const labelQ = a.q.group.userData.labelDiv;
      if (labelQ) { labelQ.style.opacity = '0.4'; this._positionFloatLabel(labelQ, a.q.group, 0.25); }
    });
    // Apagar aristas
    this.edges.forEach(e => {
      e.mesh.visible = false;
    });
  }

  _positionFloatLabel(labelDiv, group, frac) {
    // Posicionar CSS2D-ish: usar projection manual
    const v = new THREE.Vector3();
    group.updateMatrixWorld(true);
    // tomamos el top del arrow en local space y lo proyectamos
    v.set(0, 1.8, 0).applyMatrix4(group.matrixWorld);
    const proj = v.project(this.camera);
    const wrap = this.container.querySelector('#three-labels');
    const rect = wrap.getBoundingClientRect();
    const x = (proj.x * 0.5 + 0.5) * rect.width;
    const y = (-proj.y * 0.5 + 0.5) * rect.height;
    labelDiv.style.position = 'absolute';
    labelDiv.style.left = `${x}px`;
    labelDiv.style.top = `${y}px`;
    labelDiv.style.transform = 'translate(-50%, -100%)';
  }

  /* -------- Particles -------- */
  _stopAllParticles() {
    this.particlePool.forEach(p => {
      p.active = false;
      p.mesh.visible = false;
      p.mat.opacity = 0;
    });
  }

  _spawnParticles() {
    // Por cada par (i, j), lanzar partículas con velocidad ∝ attn[i,j]
    const n = this.data.n;
    let next = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const w = this.data.attn[i][j];
        if (w < 0.05) continue;
        const count = Math.max(1, Math.round(w * 14));
        for (let c = 0; c < count && next < this.particlePool.length; c++) {
          const p = this.particlePool[next++];
          p.active = true;
          p.mesh.visible = true;
          p.from = this.tokenNodes[j].pos.clone();
          p.to = this.tokenNodes[i].pos.clone();
          p.t = Math.random();
          p.speed = 0.25 + w * 0.5;
          p.mat.opacity = 0.9;
          p.mat.color.copy(COL.score);
          p.mesh.position.copy(p.from);
        }
      }
    }
  }

  _updateParticles(dt) {
    let needsUpdate = false;
    for (const p of this.particlePool) {
      if (!p.active) continue;
      needsUpdate = true;
      p.t += dt * p.speed;
      if (p.t >= 1) {
        // Loop o despawn
        p.t -= 1;
      }
      // Curva Bezier
      const a = p.from;
      const b = a.clone().lerp(p.to, 0.5).add(new THREE.Vector3(0, 0.5, 0));
      const c = p.to;
      const mt = 1 - p.t;
      const x = mt * mt * a.x + 2 * mt * p.t * b.x + p.t * p.t * c.x;
      const y = mt * mt * a.y + 2 * mt * p.t * b.y + p.t * p.t * c.y;
      const z = mt * mt * a.z + 2 * mt * p.t * b.z + p.t * p.t * c.z;
      p.mesh.position.set(x, y, z);
      // Fade al final
      p.mat.opacity = 0.3 + 0.7 * (1 - Math.abs(p.t - 0.5) * 2);
    }
    return needsUpdate;
  }

  /* -------- Hover/click -------- */
  _onPointerMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  _onPointerDown(e) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.tokenMeshes);
    if (hits.length) {
      const idx = hits[0].object.userData.tokenIdx;
      this.activeToken = idx;
      this._renderStep(this.step, true);
    }
  }

  /* -------- Animation loop -------- */
  _animate() {
    requestAnimationFrame(this._animate);
    const dt = Math.min(0.05, this.clock.getDelta());
    this.controls.update();

    // Partículas solo si estamos en paso 6 y reduced-motion desactivado
    if (!this.reducedMotion && STEPS[this.step].id === 'weighted') {
      this._updateParticles(dt);
    } else {
      this._stopAllParticles();
    }

    // Rotar suavemente los rings de los tokens hacia la cámara
    this.tokenNodes.forEach(tn => {
      tn.ring.lookAt(this.camera.position);
    });

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this._onResize);
    this.renderer.dispose();
    this.controls.dispose();
  }
}

/* ============================================================
   8. UI / side panels
   ============================================================ */

const ui = {
  data: null,
  step: 0,
  autoTimer: null,
  scene: null,
};

function $(id) { return document.getElementById(id); }

function setStep(n, instant = false) {
  if (n < 0 || n >= STEPS.length) return;
  ui.step = n;
  ui.scene.setStep(n, instant);
  renderChrome();
}

function nextStep() {
  if (ui.step < STEPS.length - 1) setStep(ui.step + 1);
  else stopAuto();
}

function prevStep() {
  if (ui.step > 0) setStep(ui.step - 1);
}

function startAuto() {
  stopAuto();
  if (ui.step >= STEPS.length - 1) setStep(0, true);
  $('btn-auto').innerHTML = PAUSE_ICON + '<span>Pausar</span>';
  ui.autoTimer = setInterval(() => {
    if (ui.step < STEPS.length - 1) setStep(ui.step + 1);
    else stopAuto();
  }, 2400);
}

function stopAuto() {
  if (ui.autoTimer) clearInterval(ui.autoTimer);
  ui.autoTimer = null;
  $('btn-auto').innerHTML = PLAY_ICON + '<span>Reproducir</span>';
}

const PLAY_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
`;
const PAUSE_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
`;

function renderChrome() {
  const step = STEPS[ui.step];
  $('stage-heading').textContent = step.title;
  $('stage-description').textContent = step.desc;
  $('stage-caption-text').innerHTML = step.caption;
  $('step-label').innerHTML = `<strong>Paso ${ui.step + 1}</strong> · ${step.shortLabel}`;
  $('step-counter').textContent = `${ui.step + 1} / ${STEPS.length}`;

  // Dots
  const dotsEl = $('step-dots');
  let dotsHtml = '';
  for (let i = 0; i < STEPS.length; i++) {
    let cls = 'step-dot';
    if (i < ui.step) cls += ' done';
    else if (i === ui.step) cls += ' active';
    dotsHtml += `<button type="button" class="${cls}" data-step="${i}" aria-label="Ir al paso ${i + 1}"></button>`;
  }
  dotsEl.innerHTML = dotsHtml;
  dotsEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => { stopAuto(); setStep(parseInt(btn.dataset.step, 10)); });
  });

  // Shape badge
  const shapeBadge = $('shape-badge');
  const shapeData = {
    input:    `x: [${ui.data.n}, ${ui.data.dModel}]`,
    w:        `W: [${ui.data.dModel}, ${ui.data.dModel}]`,
    qkv:      `Q, K, V: [${ui.data.n}, ${ui.data.dModel}]`,
    scores:   `scores: [${ui.data.n}, ${ui.data.n}]`,
    softmax:  `attn: [${ui.data.n}, ${ui.data.n}]`,
    weighted: `output: [${ui.data.n}, ${ui.data.dModel}]`,
    output:   `output: [${ui.data.n}, ${ui.data.dModel}]`,
  };
  if (shapeData[step.id]) {
    shapeBadge.style.display = 'inline-flex';
    $('shape-value').textContent = shapeData[step.id];
  } else {
    shapeBadge.style.display = 'none';
  }

  // Buttons
  $('btn-prev').disabled = ui.step === 0;
  $('btn-next').disabled = ui.step === STEPS.length - 1;

  // Side panels
  renderOpPanel(step);
  renderPipelinePanel(step);
  renderStatsPanel(step);
  renderMatrixPanel(step);
}

/* ---------- Op panel ---------- */
function renderOpPanel(step) {
  const d = ui.data;
  const f = {
    input:    `<span style="color:#9ba3b5">x</span> = input embeddings · shape <code>[${d.n}, ${d.dModel}]</code><br><span style="color:#6b7280; font-size: 11px;">Receta determinística (hash → PRNG). NO son embeddings pretrained.</span>`,
    w:        `<span style="color:#a78bfa">W_q</span>, <span style="color:#f472b6">W_k</span>, <span style="color:#fb923c">W_v</span><br><span style="color:#fbbf24">[${d.dModel}, ${d.dModel}]</span> cada una · kaiming init<br><span style="color:#6b7280; font-size: 11px;">Parámetros aprendibles. Al inicio son aleatorios.</span>`,
    qkv:      `<span style="color:#a78bfa">Q</span> = <span style="color:#9ba3b5">x</span> @ <span style="color:#a78bfa">W_q</span><br><span style="color:#f472b6">K</span> = <span style="color:#9ba3b5">x</span> @ <span style="color:#f472b6">W_k</span><br><span style="color:#fb923c">V</span> = <span style="color:#9ba3b5">x</span> @ <span style="color:#fb923c">W_v</span><br><span style="color:#6b7280; font-size: 11px;">Tres proyecciones distintas del mismo input.</span>`,
    scores:   `<span style="color:#fbbf24">scores</span> = <span style="color:#a78bfa">Q</span> @ <span style="color:#f472b6">K</span>ᵀ<br><span style="color:#6b7280; font-size: 11px;">scores[i][j] = Σ<sub>d</sub> Q[i,d] · K[j,d]<br>Producto punto en 8D entre query i y key j.</span>`,
    softmax:  `<span style="color:#34d399">attn</span> = softmax(<span style="color:#fbbf24">scores</span> / √${d.dModel})<br><span style="color:#6b7280; font-size: 11px;">Cada fila → distribución (suma = 1).</span>`,
    weighted: `<span style="color:#60a5fa">output</span>[i] = Σ<sub>j</sub> <span style="color:#34d399">attn</span>[i][j] · <span style="color:#fb923c">V</span>[j]<br><span style="color:#6b7280; font-size: 11px;">Promedio ponderado de los V con pesos attn.</span>`,
    output:   `<span style="color:#60a5fa">output</span>[i] = Σ<sub>j</sub> <span style="color:#34d399">attn</span>[i][j] · <span style="color:#fb923c">V</span>[j]<br><span style="color:#6b7280; font-size: 11px;">Misma forma que x, ahora contextualizado.</span>`,
  };
  $('op-formula').innerHTML = f[step.id] || '';
}

/* ---------- Pipeline ---------- */
function renderPipelinePanel(step) {
  const d = ui.data;
  const stages = [
    { name: 'x',    shape: `[${d.n}, ${d.dModel}]`, color: '#6ee7b7' },
    { name: 'W',    shape: `[${d.dModel}, ${d.dModel}]`, color: '#9ba3b5' },
    { name: 'QKV',  shape: `[${d.n}, ${d.dModel}]`, color: '#a78bfa' },
    { name: 'sc.',  shape: `[${d.n}, ${d.n}]`, color: '#fbbf24' },
    { name: 'attn', shape: `[${d.n}, ${d.n}]`, color: '#34d399' },
    { name: 'out',  shape: `[${d.n}, ${d.dModel}]`, color: '#60a5fa' },
  ];
  const activeIdx = { input: 0, w: 1, qkv: 2, scores: 3, softmax: 4, weighted: 5, output: 5 }[step.id];
  let html = '';
  stages.forEach((s, i) => {
    const active = i === activeIdx;
    const done = i < activeIdx;
    const opacity = active ? '1' : (done ? '0.6' : '0.3');
    const bg = active ? 'rgba(167, 139, 250, 0.15)' : 'transparent';
    const border = active ? 'rgba(167, 139, 250, 0.5)' : 'transparent';
    html += `
      <div style="display:flex;align-items:center;gap:6px;opacity:${opacity};padding:4px 8px;border-radius:6px;background:${bg};border:1px solid ${border};margin-bottom:2px;">
        <span style="color:${s.color};font-weight:600;">${s.name}</span>
        <span style="color:#6b7280;margin-left:auto;">${s.shape}</span>
      </div>
      ${i < stages.length - 1 ? '<div style="color:#6b7280;margin-left:12px;font-size:10px;">↓</div>' : ''}
    `;
  });
  $('pipeline-viz').innerHTML = html;
}

/* ---------- Stats ---------- */
function renderStatsPanel(step) {
  const d = ui.data;
  const minMax = M => {
    let mn = Infinity, mx = -Infinity;
    for (const row of M) for (const v of row) {
      if (v < mn) mn = v; if (v > mx) mx = v;
    }
    return [mn, mx];
  };
  const stats = {
    input:    `${d.n} tokens × ${d.dModel} dim = ${d.n * d.dModel} valores`,
    w:        `3 matrices × ${d.dModel * d.dModel} = ${3 * d.dModel * d.dModel} parámetros`,
    qkv:      `${d.n} filas × ${d.dModel} dim × 3 (Q/K/V)`,
    scores:   `${d.n * d.n} scores · rango [${minMax(d.rawScores).map(v => v.toFixed(2)).join(', ')}]`,
    softmax:  `filas suman 1: [${d.attn.map(r => r.reduce((a, b) => a + b, 0).toFixed(3)).join(', ')}]`,
    weighted: `output preserva shape [${d.n}, ${d.dModel}]`,
    output:   `output promedio diff vs x: ${avgDiff(d.x, d.output).toFixed(3)}`,
  };
  $('stats-viz').innerHTML = `<div style="line-height:1.7;">${stats[step.id]}</div>`;
}

function avgDiff(A, B) {
  let sum = 0, n = 0;
  for (let i = 0; i < A.length; i++)
    for (let j = 0; j < A[0].length; j++) { sum += Math.abs(A[i][j] - B[i][j]); n++; }
  return sum / n;
}

/* ---------- Matrix panel ---------- */
function renderMatrixPanel(step) {
  const d = ui.data;
  const el = $('matrix-panel');
  let html = '';

  switch (step.id) {
    case 'input': {
      html += matrixHtml({
        title: 'x (input embeddings)',
        shape: `[${d.n}, ${d.dModel}]`,
        M: d.x,
        colorFn: () => COL.input.getStyle(),
      });
      html += `<div style="font-size:11px;color:#9ba3b5;margin-top:8px;">
        Cada fila es un embedding de 8D para un token. La flecha en el canvas 3D
        muestra solo las 3 primeras coordenadas.
      </div>`;
      break;
    }
    case 'w': {
      const blocks = [
        { M: d.Wq, color: '#a78bfa', name: 'W_q' },
        { M: d.Wk, color: '#f472b6', name: 'W_k' },
        { M: d.Wv, color: '#fb923c', name: 'W_v' },
      ];
      blocks.forEach(b => {
        html += matrixHtml({
          title: b.name,
          shape: `[${d.dModel}, ${d.dModel}]`,
          M: b.M,
          colorFn: v => `rgba(${hexToRgb(b.color)}, ${Math.min(0.9, Math.abs(v) * 4)})`,
          decimals: 1,
          cellSize: 18,
        });
      });
      html += `<div style="font-size:11px;color:#9ba3b5;margin-top:8px;">
        Valores iniciales con kaiming. Estas matrices se entrenan vía backprop.
      </div>`;
      break;
    }
    case 'qkv': {
      const blocks = [
        { M: d.Q, color: '#a78bfa', name: 'Q', formula: 'Q = x @ W_q' },
        { M: d.K, color: '#f472b6', name: 'K', formula: 'K = x @ W_k' },
        { M: d.V, color: '#fb923c', name: 'V', formula: 'V = x @ W_v' },
      ];
      blocks.forEach(b => {
        html += matrixHtml({
          title: b.name,
          shape: `[${d.n}, ${d.dModel}]`,
          M: b.M,
          colorFn: v => `rgba(${hexToRgb(b.color)}, ${Math.min(0.9, Math.abs(v) * 3)})`,
          decimals: 2,
          cellSize: 22,
          rowLabels: d.tokens,
        });
      });
      break;
    }
    case 'scores': {
      const sel = ui.scene ? ui.scene.selectedIJ : [0, 0];
      html += matrixHtml({
        title: 'scores = Q @ Kᵀ',
        shape: `[${d.n}, ${d.n}]`,
        M: d.rawScores,
        colorFn: v => {
          const t = Math.tanh(Math.abs(v) * 6);
          return v >= 0
            ? `rgba(251, 191, 36, ${0.1 + t * 0.85})`
            : `rgba(244, 114, 182, ${0.1 + t * 0.7})`;
        },
        decimals: 2,
        cellSize: 30,
        rowLabels: d.tokens,
        colLabels: d.tokens,
        highlightRow: sel[0],
        highlightCol: sel[1],
      });
      // Cálculo explícito del dot product
      const i = sel[0], j = sel[1];
      const Qi = d.Q[i], Kj = d.K[j];
      const terms = Qi.map((q, k) => `${fmt(q, 2)}·${fmt(Kj[k], 2)}`).join(' + ');
      const sum = Qi.reduce((acc, q, k) => acc + q * Kj[k], 0);
      html += `
        <div class="example-card">
          <div class="example-card-title">Dot product: scores[${i}][${j}]</div>
          scores[${i}][${j}] = Q[${i}] · K[${j}] = ${terms}
          <br>= <code style="color:#fbbf24">${fmt(sum, 3)}</code>
          <div style="margin-top:6px;color:#9ba3b5;font-size:11px;">
            <strong style="color:#e8eaf0;">Interpretación geométrica:</strong> es la
            suma de 8 productos componente a componente. Si Q[${i}] y K[${j}] están
            alineados en 8D → score alto. Si son opuestos → score negativo. Si son
            perpendiculares → score cercano a 0.
          </div>
        </div>
        <div class="example-card">
          <div class="example-card-title">Mini-ejemplo 2D</div>
          <span class="pos">q = [1, 0]</span> &nbsp;·&nbsp;
          <span class="pos">k₀ = [1, 0]</span> &nbsp;→&nbsp; q·k₀ = <code>1</code> (alineados)<br>
          <span class="pos">q = [1, 0]</span> &nbsp;·&nbsp;
          <span style="color:#f472b6">k₁ = [0, 1]</span> &nbsp;→&nbsp; q·k₁ = <code>0</code> (perpendicular)<br>
          <span class="pos">q = [1, 0]</span> &nbsp;·&nbsp;
          <span class="neg">k₂ = [-1, 0]</span> &nbsp;→&nbsp; q·k₂ = <code>-1</code> (opuestos)<br>
          scores: <code>[1, 0, -1]</code> → softmax → <code>[0.665, 0.245, 0.090]</code>
        </div>
      `;
      break;
    }
    case 'softmax': {
      html += matrixHtml({
        title: 'attn (attention weights)',
        shape: `[${d.n}, ${d.n}]`,
        M: d.attn,
        colorFn: v => `rgba(52, 211, 153, ${0.1 + v * 1.5})`,
        decimals: 3,
        cellSize: 30,
        rowLabels: d.tokens,
        colLabels: d.tokens,
      });
      // Bars por fila
      html += `<div style="margin-top:10px;">`;
      d.attn.forEach((row, i) => {
        html += `
          <div class="softmax-bars">
            <div class="bar-row-label">${d.tokens[i]}</div>
            <div class="bar-row-track">
              ${row.map((v, j) => `
                <div class="bar-row-seg" style="width:${v * 100}%;background:rgba(52,211,153,${0.2 + v * 1.5});">${v > 0.08 ? (v * 100).toFixed(0) + '%' : ''}</div>
              `).join('')}
            </div>
          </div>
        `;
      });
      html += `</div>`;
      html += `<div style="font-size:11px;color:#9ba3b5;margin-top:8px;">
        Cada fila suma 1 — es una distribución de probabilidad sobre los tokens j.
      </div>`;
      break;
    }
    case 'weighted': {
      const i = 0;
      const weights = d.attn[i];
      const terms = d.V.map((vrow, j) => `${fmt(weights[j], 3)} · V[${j}]`).join(' + ');
      html += `
        <div class="recipe-row">
          <span class="recipe-result">output[${i}]</span>
          <span class="recipe-eq">=</span>
          <span class="recipe-token">${terms}</span>
        </div>
        <div style="font-size:11px;color:#9ba3b5;margin:8px 0;">
          Para cada dimensión d:
          <code style="font-family:'JetBrains Mono',monospace;color:#fbbf24">
            output[${i}][d] = ${weights.map((w, j) => `${fmt(w, 3)}·${fmt(d.V[j][0], 2)}`).join(' + ')}${d.dModel > 1 ? `, ..., ${weights.map((w, j) => `${fmt(w, 3)}·${fmt(d.V[j][d.dModel - 1], 2)}`).join(' + ')}` : ''}
          </code>
        </div>
      `;
      html += matrixHtml({
        title: 'attn (pesos usados)',
        shape: `[${d.n}, ${d.n}]`,
        M: d.attn,
        colorFn: v => `rgba(52, 211, 153, ${0.1 + v * 1.5})`,
        decimals: 3,
        cellSize: 30,
        rowLabels: d.tokens,
        colLabels: d.tokens,
        highlightRow: i,
      });
      html += matrixHtml({
        title: 'V',
        shape: `[${d.n}, ${d.dModel}]`,
        M: d.V,
        colorFn: v => `rgba(251, 146, 60, ${Math.min(0.9, Math.abs(v) * 3)})`,
        decimals: 2,
        cellSize: 22,
        rowLabels: d.tokens,
      });
      break;
    }
    case 'output': {
      html += matrixHtml({
        title: 'x (input)',
        shape: `[${d.n}, ${d.dModel}]`,
        M: d.x,
        colorFn: () => 'rgba(110, 231, 183, 0.25)',
        decimals: 2,
        cellSize: 22,
        rowLabels: d.tokens,
      });
      html += matrixHtml({
        title: 'output (contextualizado)',
        shape: `[${d.n}, ${d.dModel}]`,
        M: d.output,
        colorFn: () => 'rgba(96, 165, 250, 0.25)',
        decimals: 2,
        cellSize: 22,
        rowLabels: d.tokens,
      });
      // Mixing recipe per token
      html += `<div style="margin-top:10px;font-size:11px;color:#9ba3b5;">
        Receta de mezcla por token (attn[i] × V):
      </div>`;
      d.attn.forEach((row, i) => {
        const terms = row.map((w, j) => `${fmt(w, 2)}·V[${j}]`).join(' + ');
        html += `
          <div class="recipe-row">
            <span class="recipe-result">output[${i}]</span>
            <span class="recipe-eq">=</span>
            <span class="recipe-token">${terms}</span>
          </div>
        `;
      });
      break;
    }
  }

  el.innerHTML = html;
}

function matrixHtml({ title, shape, M, colorFn, decimals = 2, cellSize = 26, rowLabels = null, colLabels = null, highlightRow = -1, highlightCol = -1 }) {
  const rows = M.length;
  const cols = M[0].length;
  const labelW = rowLabels ? 24 : 0;
  const labelH = colLabels ? 14 : 0;

  let html = `<div class="mini-matrix" style="min-width:${labelW + cols * (cellSize + 1) + 4}px;">`;
  html += `<div class="mini-matrix-title">${title} <span class="mini-matrix-shape">${shape}</span></div>`;
  html += `<div class="mini-matrix-grid" style="grid-template-columns: ${labelW ? `${labelW}px ` : ''}repeat(${cols}, ${cellSize}px); gap:1px; margin-left:${labelW ? labelW + 1 : 0}px;">`;

  // Top-left empty + col labels
  if (colLabels) {
    html += `<div></div>`;
    colLabels.forEach(cl => {
      html += `<div style="font-size:9px;color:#6b7280;text-align:center;height:${labelH}px;line-height:${labelH}px;">${cl}</div>`;
    });
  }

  for (let i = 0; i < rows; i++) {
    if (rowLabels) {
      html += `<div style="font-size:9px;color:#6b7280;text-align:right;padding-right:4px;line-height:${cellSize}px;">${rowLabels[i]}</div>`;
    }
    for (let j = 0; j < cols; j++) {
      const v = M[i][j];
      let cls = 'mini-cell';
      if (highlightRow === i) cls += ' highlight-row';
      if (highlightCol === j) cls += ' highlight-col';
      if (highlightRow === i && highlightCol === j) cls += ' highlight-cell';
      html += `<div class="${cls}" style="background:${colorFn(v)};color:${Math.abs(v) > 0.5 ? '#0a0e1a' : '#e8eaf0'};">${fmt(v, decimals)}</div>`;
    }
  }
  html += `</div></div>`;
  return html;
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ].join(',');
}

/* ============================================================
   9. Init
   ============================================================ */

function reload() {
  const tokensRaw = $('input-tokens').value;
  const tokens = tokensRaw.split(',').map(s => s.trim()).filter(Boolean).slice(0, MAX_TOKENS);
  const seed = parseInt($('seed-input').value, 10) || DEFAULT_SEED;

  if (tokens.length === 0) {
    tokens.push('hola', 'como', 'estas');
    $('input-tokens').value = 'hola, como, estas';
  } else if (tokens.length < MAX_TOKENS) {
    while (tokens.length < MAX_TOKENS) tokens.push('?');
    $('input-tokens').value = tokens.join(', ');
  }

  ui.data = runAttention(tokens, seed);

  if (ui.scene) {
    ui.scene.setData(ui.data);
  } else {
    const wrap = document.querySelector('.stage-three-canvas-wrap');
    if (!wrap) return;
    ui.scene = new AttentionScene(wrap, ui.data);
  }
  ui.step = 0;
  renderChrome();
}

function init() {
  if (!hasWebGL()) {
    const wrap = document.querySelector('.stage-three-canvas-wrap');
    wrap.innerHTML = `
      <div class="webgl-fallback">
        <strong>WebGL no disponible</strong>
        Tu navegador o dispositivo no soporta WebGL, así que no podemos
        renderizar la escena 3D. Probá abrir esta página en
        <code>Chrome</code>, <code>Firefox</code>, <code>Safari</code>
        o <code>Edge</code> actualizados.
        <br><br>
        Mientras tanto, podés usar la versión 2D:
        <a href="../attention.html" style="color:#a78bfa">Self-Attention (2D)</a>.
      </div>
    `;
    return;
  }

  // Botones y bindings
  $('btn-next').addEventListener('click', () => { stopAuto(); nextStep(); });
  $('btn-prev').addEventListener('click', () => { stopAuto(); prevStep(); });
  $('btn-auto').addEventListener('click', () => {
    if (ui.autoTimer) stopAuto(); else startAuto();
  });
  $('btn-reload').addEventListener('click', () => { stopAuto(); reload(); });
  $('btn-new-seed').addEventListener('click', () => {
    stopAuto();
    const newSeed = Math.floor(Math.random() * 99999) + 1;
    $('seed-input').value = String(newSeed);
    reload();
  });

  let debounceTimer;
  $('input-tokens').addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(reload, 600);
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') { stopAuto(); nextStep(); }
    else if (e.key === 'ArrowLeft') { stopAuto(); prevStep(); }
  });

  reload();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
