// Kung Fu, No Hay Luz — Platanus Hack 26 (Caracas)
// Beat 'em up por oleadas en una calle de Petare. 1 o 2 jugadores (co-op).
// Palanca: mover · B1: golpe · B2: patada · B3: ulti

const W = 800;
const H = 600;
const FT = 352; // borde superior de la calle caminable
const FB = 585; // borde inferior
const HS_KEY = 'kungfu-nohayluz-highscore';

// DO NOT replace existing keys — they match the physical arcade cabinet wiring.
// To add local testing shortcuts, append extra keys to any array.
// Teclado cómodo para 2 jugadores (añadidas): P1 WASD + C V B · P2 flechas + M , .
const CABINET_KEYS = {
  P1_U: ['w'], P1_D: ['s'], P1_L: ['a'], P1_R: ['d'],
  P1_1: ['u', 'c'], P1_2: ['i', 'v'], P1_3: ['o', 'b'],
  P1_4: ['j'], P1_5: ['k'], P1_6: ['l'],
  P2_U: ['ArrowUp'], P2_D: ['ArrowDown'], P2_L: ['ArrowLeft'], P2_R: ['ArrowRight'],
  P2_1: ['r', 'm'], P2_2: ['t', ','], P2_3: ['y', '.'],
  P2_4: ['f'], P2_5: ['g'], P2_6: ['h'],
  START1: ['Enter'], START2: ['2'],
};

const KEY_TO_ARCADE = {};
for (const [code, keys] of Object.entries(CABINET_KEYS)) {
  for (const key of keys) {
    KEY_TO_ARCADE[key.length === 1 ? key.toLowerCase() : key] = code;
  }
}

// todo lo demás va en un ámbito local para que el minificador acorte los nombres
(() => {
const held = Object.create(null);
const hit = Object.create(null); // pulsaciones nuevas de este frame

window.addEventListener('keydown', (e) => {
  const code = KEY_TO_ARCADE[e.key.length === 1 ? e.key.toLowerCase() : e.key];
  if (code) {
    if (!held[code]) hit[code] = true;
    held[code] = true;
    e.preventDefault();
  }
  if (AC && AC.state === 'suspended') AC.resume();
});
window.addEventListener('keyup', (e) => {
  const code = KEY_TO_ARCADE[e.key.length === 1 ? e.key.toLowerCase() : e.key];
  if (code) held[code] = false;
});
window.addEventListener('blur', () => {
  for (const k in held) held[k] = false;
});

function getStorage() {
  if (window.platanusArcadeStorage) return window.platanusArcadeStorage;
  return {
    async get(key) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? { found: false, value: null } : { found: true, value: JSON.parse(raw) };
      } catch {
        return { found: false, value: null };
      }
    },
    async set(key, value) {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
  };
}

// ---------- Datos ----------

const WHT = 0xffffff;
const GOLD = 0xffd23f;
const PCOL = ['#ffe14a', '#5ee6ff'];
const PHEX = [0xffe14a, 0x5ee6ff];

// ---------- Textos ----------

const COPY = {
  tuki: {
    q: ['¡Jablale menol!', '¡Qué fue, menol!', '¡Activo, pana!', '¡Tierrúo y con swing!', '¡Ahí te va, chamo!', '¡Dale pa\' que aprendas!'],
    uq: '¡MOTO-PIRUETA, MENOL!',
    ko: ['¡Me pegaron burda!', '¡Ay, mi franelilla!'],
    rv: ['¡Activo otra vez!'],
  },
  gladys: {
    q: ['¡Ah buen tierrero!', '¡Coma ñoña!', '¡Respeten, vale!', '¡Toma chancla!', '¡Yo te crié, mijo!', '¡Qué falta de respeto!'],
    uq: '¡LA CHANCLA PETROLERA!',
    ko: ['¡Ay, mi columna!', '¡Mi moño, mijo!'],
    rv: ['¡Aquí sigo, mijo!'],
  },
  pana: {
    q: ['¡Qué ladilla, vale!', '¡Se me dañó la nevera!', '¡Yo solo quería dormir!', '¡Ya no aguanto, pana!', '¡Se me echó a perder todo!', '¡Que calor njda!'],
    uq: '¡AREPAZO!',
    ko: ['¡Hasta la luz me dejó!', '¡Qué día, vale!'],
    rv: ['¡Ya va, ya me paro!'],
  },
  paco: {
    q: ['¡Pa\' el fresco, chamo!', '¡Colabórame con el fresco!', '¡Algo pa\' el fresco!', '¡Los papeles, ciudadano!', '¡Pa\' la comisaría!'],
    dq: ['¡Y mi fresco, pues!', '¡Me quedé sin matraca!', '¡Ay, mi uniforme!'],
  },
  rojo: {
    q: ['¡Son las sanciones!', '¡Culpa de las sanciones!', '¡Es un sabotaje!', '¡Guerra eléctrica!', '¡Las sanciones, vale!'],
    dq: ['¡Fueron las sanciones!', '¡Me sancionaron a mí!', '¡Se rompió mi camisa!'],
  },
  corpo: {
    q: ['¡Fue una iguana!', 'No me pagan lo suficiente…', '¡Ya va a llegar la luz!', '¡Estamos trabajando!', '¡Fue la iguana, lo juro!'],
    dq: ['¡Me voy pa\' mi casa!', '¡Me pagan menos aún!', '¡Fue la iguana, vale!'],
    th: ['¡Toma tu bombillo!', '¡Luz de regalo!'],
  },
  jefe: {
    q: ['¡Aquí mando yo!', '¡Sin permiso no hay luz!', '¡Pa\' el fresco o nada!', '¡Yo soy la autoridad!'],
    dq: ['¡Me ascendieron a nada!', '¡Pidan su fresco con otro!'],
  },
  blackout: ['¡SE FUE LA LUZ!', '¡OTRO APAGÓN!', '¡APAGARON TODO!'],
  lightOn: ['¡LLEGÓ LA LUZ!', '¡MILAGRO, HAY LUZ!', '¡VOLVIÓ EL SERVICIO!'],
  fullBlackout: ['¡APAGÓN TOTAL!', '¡NI LA LUNA ALUMBRA!'],
  stampede: ['¡VA A BAJAR EL CERRO!', '¡ÉCHENSE A CORRER!'],
  waveClear: ['¡Calle despejada, pana!', '¡Burda de bueno!', '¡Así se hace, vale!'],
  pickup: ['¡Qué empanada, mijo!', '¡Con queso, burda rica!', '¡Energía de abuela!'],
  boss: ['¡LLEGÓ EL PACO JEFE!', '¡EL JEFE VIENE A COBRAR!'],
  over: [
    'Se fue la luz y tú también.',
    'Corpoelec dice: fue una iguana.',
    'Te quedaste sin fresco ni luz.',
    'Mejor ve a hacer la cola, pana.',
    'Ni el bachaquero te fía ya.',
  ],
  subtitle: [
    'Un beat \'em up a oscuras',
    'Pega duro, que no hay luz',
    'Un apagon mas y salgo a repartir coñazos',
  ],
};

const BOSSES = {
  mat: {
    n: 'EL MATRAQUERO',
    intro: '¡LLEGÓ EL MATRAQUERO!',
    q: ['¡Bájate de la mula!', '¡Esto es una alcabala!', '¡Pa\' el fresco, ya!', '¿Cuánto tienes ahí?'],
    at: ['¡Multa de mil!', '¡Estás detenido!', '¡Alcabala sorpresa!'],
    dq: ['¡Y mi matraca, pues!', '¡Ay, mi bigote!'],
  },
  pol: {
    n: 'EL POLÍTICO',
    intro: '¡LLEGÓ EL POLÍTICO!',
    q: ['¡Prometo todo, vale!', '¡Por la patria, ya!', '¡Cadena nacional!', '¡Todos al mitin!'],
    at: ['¡Petróleo pa\' todos!', '¡Charco de promesas!', '¡Derrame de discurso!'],
    dq: ['¡Fue una campaña sucia!', '¡Me voy de viaje!'],
  },
  toy: {
    n: 'EL TOYOBOBO',
    intro: '¡LLEGÓ EL TOYOBOBO!',
    q: ['¡O sea, whatever!', '¡Like, literal, bro!', '¡Qué ladilla, bro!', '¡Mi daddy me compra otro!'],
    at: ['¡Termo Kontigo, bro!', '¡Hydrate o muere!', '¡Thats it!'],
    dq: ['¡Se abolló mi termo!', '¡Se lo digo a mi daddy!'],
  },
};

// p / k = [alcance, daño, recarga]; ur = velocidad de carga de la ulti; st = barras de la selección
const CH = [
  {
    n: 'EL TUKI', sp: 195, hp: 110, p: [68, 9, 0.26], k: [42, 15, 0.42], ur: 0.9,
    un: 'MOTO-PIRUETA', ud: 'Invencible 5s', st: [5, 2, 3, 1],
    q: COPY.tuki.q, uq: COPY.tuki.uq, ko: COPY.tuki.ko, rv: COPY.tuki.rv,
  },
  {
    n: 'SRA. GLADYS', sp: 155, hp: 115, p: [54, 14, 0.28], k: [50, 24, 0.42], ur: 1.4,
    un: 'CHANCLA PETROLERA', ud: 'Bumerán x5', st: [2, 3, 5, 5],
    q: COPY.gladys.q, uq: COPY.gladys.uq, ko: COPY.gladys.ko, rv: COPY.gladys.rv,
  },
  {
    n: 'EL PANA', sp: 172, hp: 105, p: [54, 11, 0.28], k: [54, 20, 0.48], ur: 1.1,
    un: 'PROYECTIL DE AREPA', ud: 'Arepas teledirigidas', st: [3, 3, 3, 3],
    q: COPY.pana.q, uq: COPY.pana.uq, ko: COPY.pana.ko, rv: COPY.pana.rv,
  },
];
const STN = ['VEL', 'GOLPE', 'PATADA', 'ULTI'];

const bz = (o, x) => Object.assign({ boss: 1, n: o.n, q: o.q, dq: o.dq, at: o.at, in: [o.intro] }, x);
const EN = {
  r: { hp: 22, sp: 96, d: 6, s: 100, q: COPY.rojo.q, dq: COPY.rojo.dq },
  p: { hp: 40, sp: 76, d: 10, s: 150, q: COPY.paco.q, dq: COPY.paco.dq },
  c: { hp: 65, sp: 56, d: 16, s: 250, q: COPY.corpo.q, dq: COPY.corpo.dq, th: COPY.corpo.th },
  // jefes: el Matraquero embiste y cobra "pa'l fresco", el Político lanza petróleo, el Toyobobo pega con el termo a ambos lados
  b: bz({ n: 'EL COMISARIO', q: COPY.jefe.q, dq: COPY.jefe.dq, at: COPY.jefe.q }, { hp: 300, sp: 62, d: 22, s: 2000, in: COPY.boss }),
  m: bz(BOSSES.mat, { hp: 360, sp: 56, d: 20, s: 2500 }),
  o: bz(BOSSES.pol, { hp: 300, sp: 50, d: 16, s: 3000 }),
  y: bz(BOSSES.toy, { hp: 330, sp: 72, d: 18, s: 2500 }),
};
const BR = ['m', 'o', 'y', 'b'];

// [piel, camisa, pantalón, pelo/gorra, zapato]
const DK = {
  0: [0x8d5a3b, 0xf2f2f2, 0x2b6cff, 0xe02b2b, 0x222222],
  1: [0x8a5a3c, 0xff7ab8, 0xff7ab8, 0xd0d0d0, 0x3bd1c6],
  2: [0xc68a5e, 0x3d9be9, 0x34466e, 0x2a1a10, 0xf0f0f0],
  p: [0xb97a56, 0x1d2b53, 0x1d2b53, 0x101a38, 0x111111],
  b: [0xb97a56, 0x2a2f3a, 0x2a2f3a, 0x0a0a12, 0x111111],
  c: [0xa86f4c, 0x4a6a8f, 0x4a6a8f, 0xffc400, 0x5a3a1a],
  r: [0xb97a56, 0xd81e1e, 0x3a3a44, 0xa00d0d, 0x222222],
  m: [0xb07850, 0x1d2b53, 0x1d2b53, 0x101a38, 0x111111],
  o: [0xf0b8a0, 0x2a3350, 0x2a3350, 0xf0d060, 0x111111],
  y: [0xe8b896, 0x8fd8c8, 0xc8b078, 0x2a1a10, 0x7a4a2a],
};

// ---------- Estado ----------

let S; // escena
let AC = null; // AudioContext
let NB = null; // buffer de ruido
let bg, lg, eg, fx, hg, ug, rt, li;
let ph = 'title';
let T = 0;
let ui = [];
let hud = {};
let hi = 0;
let LB = []; // histórico: [{ n: 'ABC', s: puntos, w: oleada }]
let nm = { c: [0, 0, 0], i: 0, rt: 0 };
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let np = 1;
let sel = [{ i: 0, ok: false }, { i: 2, ok: false }];
let selT = 0;
let P = [];
let E = [];
let PR = [];
let PK = [];
let FXP = [];
let SPK = [];
let OIL = []; // charcos de petróleo del Político
let score = 0;
let wave = 0;
let wLeft = 0;
let wSpawn = 0;
let wNext = 0;
let paused = false;
let overT = 0;
let newRec = false;
let dark = false;
let rtD = false;
let L = { s: 0, t: 16, lt: 1, fl: 0, a: 0 };
let mus = { t: 0, i: 0 };
const POLES = [110, 400, 690];
let wm = ''; // modificador de la oleada: '', 'APAGÓN TOTAL', 'ESTAMPIDA'
let tsay = 0; // enfriamiento global de frases enemigas

new Phaser.Game({
  type: Phaser.AUTO,
  width: W,
  height: H,
  parent: 'game-root',
  backgroundColor: '#0a0714',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: W, height: H },
  scene: { create, update },
});

// ---------- Audio ----------

function tone(f, d, type, v, f2, t0) {
  if (!AC) return;
  const t = AC.currentTime + (t0 || 0);
  const o = AC.createOscillator();
  const g = AC.createGain();
  o.type = type || 'square';
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(v || 0.1, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + d);
  o.connect(g);
  g.connect(AC.destination);
  o.start(t);
  o.stop(t + d + 0.02);
}

function noise(d, v, fq, type) {
  if (!AC) return;
  if (!NB) {
    NB = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
    const c = NB.getChannelData(0);
    for (let i = 0; i < c.length; i++) c[i] = Math.random() * 2 - 1;
  }
  const t = AC.currentTime;
  const s = AC.createBufferSource();
  const f = AC.createBiquadFilter();
  const g = AC.createGain();
  s.buffer = NB;
  f.type = type || 'lowpass';
  f.frequency.value = fq || 1000;
  g.gain.setValueAtTime(v || 0.2, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + d);
  s.connect(f);
  f.connect(g);
  g.connect(AC.destination);
  s.start(t, Math.random() * 0.5, d + 0.02);
}

const SFX = {
  whiff: () => noise(0.07, 0.08, 2500, 'highpass'),
  punch: () => { noise(0.08, 0.3, 900); tone(140, 0.08, 'square', 0.12, 60); },
  kick: () => { noise(0.12, 0.35, 600); tone(100, 0.12, 'square', 0.15, 45); },
  slap: () => { noise(0.06, 0.4, 3000, 'highpass'); tone(900, 0.05, 'square', 0.06, 300); },
  hurt: () => tone(220, 0.16, 'sawtooth', 0.12, 90),
  ko: () => tone(320, 0.25, 'square', 0.1, 50),
  ulti: () => { tone(300, 0.5, 'sawtooth', 0.12, 1200); tone(150, 0.5, 'square', 0.08, 600); },
  spark: () => noise(0.05, 0.12, 5000, 'highpass'),
  out: () => tone(420, 1.1, 'sawtooth', 0.14, 30),
  on: () => { tone(200, 0.4, 'square', 0.08, 800); tone(800, 0.2, 'square', 0.06, 0, 0.35); },
  thunder: () => noise(0.7, 0.3, 220),
  moto: () => tone(70 + Math.random() * 45, 0.11, 'sawtooth', 0.08),
  sel: () => tone(660, 0.06, 'square', 0.07),
  ok: () => { tone(520, 0.08, 'square', 0.08); tone(780, 0.14, 'square', 0.08, 0, 0.08); },
  pick: () => { tone(600, 0.07, 'triangle', 0.12); tone(900, 0.12, 'triangle', 0.12, 0, 0.07); },
  wave: () => { tone(392, 0.1, 'square', 0.08); tone(523, 0.1, 'square', 0.08, 0, 0.1); tone(659, 0.2, 'square', 0.08, 0, 0.2); },
  over: () => { tone(300, 0.3, 'sawtooth', 0.12, 200); tone(200, 0.6, 'sawtooth', 0.12, 60, 0.3); },
};

const BASS = [0, -1, 0, 7, -1, 7, 5, -1, 0, -1, 0, 7, -1, 10, 7, 5];

function music(dt) {
  mus.t -= dt;
  if (mus.t > 0) return;
  mus.t += dark ? 0.2 : 0.15;
  const i = mus.i++ % 16;
  const n = BASS[i];
  if (n >= 0) tone((dark ? 41.2 : 55) * Math.pow(2, n / 12), 0.14, 'triangle', 0.13);
  if (i % 4 === 0) tone(120, 0.1, 'sine', 0.18, 40);
  if (i % 2 && !dark) noise(0.03, 0.03, 6000, 'highpass');
}

// ---------- Utilidades ----------

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function txt(x, y, s, z, c, keep) {
  // estilo de juego de peleas: itálica pesada, borde grueso, sombra y degradado en los textos grandes
  c = c || '#fff';
  const t = S.add.text(x, y, s, {
    fontFamily: 'Impact, Haettenschweiler, "Arial Black", sans-serif',
    fontSize: z + 'px',
    fontStyle: 'italic',
    color: c,
    stroke: z > 24 ? '#2a0a00' : '#000',
    strokeThickness: Math.max(3, z / 5),
    align: 'center',
    padding: { x: z / 4, y: 2 },
  }).setOrigin(0.5).setDepth(80).setShadow(z / 12 + 1, z / 12 + 1, '#000', 0, true, true);
  if (z > 24) {
    const g = t.context.createLinearGradient(0, 0, 0, t.height);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.5, c);
    g.addColorStop(1, c === '#ffe14a' ? '#ff5a00' : c);
    t.setFill(g);
  }
  if (!keep) ui.push(t);
  return t;
}

function say(x, y, s, c, z, d) {
  const t = txt(clamp(x, 90, W - 90), y, s, z || 16, c, 1).setDepth(65);
  S.tweens.add({ targets: t, y: y - 45, alpha: 0, duration: d || 1100, ease: 'Cubic.easeIn', onComplete: () => t.destroy() });
}

function banner(s, c) {
  say(W / 2, 215, s, c, 38, 2000);
}

function go(p) {
  ui.forEach((t) => t.destroy());
  ui = [];
  ph = p;
  paused = false;
  for (const k in hud) hud[k].setVisible(p === 'play');
  if (p === 'title') buildTitle();
  if (p === 'select') buildSelect();
  if (p === 'over') buildOver();
  if (p === 'name') buildName();
}

// ---------- Escenario ----------

function drawBg() {
  let sd = 11;
  const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const g = bg;
  [0x1b1140, 0x3a1c5c, 0x6b2a6e, 0xa8456a, 0xe0704f, 0xf5a04a].forEach((c, i) => {
    g.fillStyle(c);
    g.fillRect(0, i * 30, W, 31);
  });
  g.fillStyle(0xffd27a);
  g.fillCircle(610, 128, 30);
  // El Ávila
  g.fillStyle(0x24304d);
  g.beginPath();
  g.moveTo(0, 150);
  [[90, 108], [200, 136], [310, 84], [430, 122], [540, 94], [660, 132], [800, 104], [800, 340], [0, 340]].forEach((p) => g.lineTo(p[0], p[1]));
  g.closePath();
  g.fillPath();
  // Ranchitos apilados
  const pal = [0xb5593c, 0xa34e33, 0xc46a45, 0x8f4630, 0xb5593c, 0x4fb3a5, 0xe8c15a, 0x6d8fd6, 0xd98aa8, 0x9a9a8c];
  for (let row = 0; row < 4; row++) {
    const by = 178 + row * 30;
    g.fillStyle(0x1b1140, 0.16);
    g.fillRect(0, 0, W, by - 30);
    let x = -14 - row * 9;
    while (x < W) {
      const w = 30 + r() * 26;
      const h = 26 + r() * 18;
      if (r() > 0.07) {
        g.fillStyle(pal[Math.floor(r() * pal.length)]);
        g.fillRect(x, by - h, w - 2, h + 32);
        g.fillStyle(0x767e88);
        g.fillRect(x - 1, by - h - 3, w, 3);
        const nw = w > 44 ? 2 : 1;
        for (let j = 0; j < nw; j++) {
          const wx = x + 6 + j * 16;
          g.fillStyle(0x1a1420);
          g.fillRect(wx, by - h + 7, 8, 9);
          if (r() < 0.7) {
            lg.fillStyle(0xffe27a);
            lg.fillRect(wx + 1, by - h + 8, 6, 7);
          }
        }
        if (r() < 0.3) {
          g.fillStyle(0x2f6fb0);
          g.fillRect(x + w - 14, by - h - 10, 9, 7); // tanque de agua
        }
      }
      x += w;
    }
  }
  // Fachadas y muros a pie de calle
  const fac = [[0, 150, 0x4fb3a5], [150, 180, 0xd9d2bd], [330, 140, 0xb5593c], [470, 210, 0xd9d2bd], [680, 120, 0xe8c15a]];
  fac.forEach((f, i) => {
    const top = i % 2 ? 258 : 240;
    g.fillStyle(f[2]);
    g.fillRect(f[0], top, f[1], 340 - top);
    g.fillStyle(0, 0.18);
    g.fillRect(f[0] + f[1] - 3, top, 3, 340 - top);
    if (i % 2 === 0) {
      g.fillStyle(0x767e88);
      g.fillRect(f[0] - 2, top - 5, f[1] + 4, 6);
      g.fillStyle(0x3a2418);
      g.fillRect(f[0] + 22, 288, 28, 52);
      g.fillStyle(0x1a1420);
      g.fillRect(f[0] + 72, 272, 34, 28);
      lg.fillStyle(0xffe27a);
      lg.fillRect(f[0] + 74, 274, 30, 24);
      g.fillStyle(0x222228);
      for (let k = 0; k < 4; k++) g.fillRect(f[0] + 72 + k * 10, 272, 2, 28); // rejas
    } else {
      g.fillStyle(0x9a9485);
      g.fillRect(f[0], top, f[1], 5);
    }
  });
  // Bandera de Venezuela pintada en el muro
  [0xffcc00, 0x00247d, 0xcf142b].forEach((c, i) => {
    g.fillStyle(c);
    g.fillRect(183, 270 + i * 18, 114, 18);
  });
  g.fillStyle(WHT);
  for (let i = 0; i < 8; i++) {
    const a = Math.PI * (1.12 + (i * 0.76) / 7);
    g.fillCircle(240 + Math.cos(a) * 24, 304 + Math.sin(a) * 11, 1.7);
  }
  g.lineStyle(2, 0x2a2a30);
  g.strokeRect(183, 270, 114, 54);
  // Mural Tripealo
  g.fillStyle(0x2de0c8);
  g.fillEllipse(575, 300, 190, 62);
  g.fillStyle(0xffe14a);
  g.fillEllipse(575, 300, 172, 48);
  g.fillStyle(0xff3d81);
  [[488, 276], [664, 322], [656, 272], [496, 326]].forEach((p) => g.fillCircle(p[0], p[1], 5));
  S.add.text(575, 300, 'Tripealo', {
    fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '38px', fontStyle: 'bold italic',
    color: '#ff3d81', stroke: '#1a1a2e', strokeThickness: 7,
  }).setOrigin(0.5).setAngle(-4).setDepth(2);
  S.add.text(400, 252, 'ABASTO · NO HAY HIELO', {
    fontFamily: 'Arial, sans-serif', fontSize: '10px', fontStyle: 'bold', color: '#fff', backgroundColor: '#22324f', padding: { x: 4, y: 2 },
  }).setOrigin(0.5).setDepth(2);
  // Acera y calle
  g.fillStyle(0x9a958a);
  g.fillRect(0, 338, W, 12);
  g.fillStyle(0x6e6a62);
  g.fillRect(0, 348, W, 4);
  g.fillStyle(0x3b3b46);
  g.fillRect(0, 352, W, 248);
  g.fillStyle(0xd8c64a);
  for (let x = 20; x < W; x += 90) g.fillRect(x, 468, 44, 5);
  g.fillStyle(0x25252c);
  [[150, 420, 60], [520, 540, 80], [690, 400, 46], [300, 560, 50]].forEach((h) => g.fillEllipse(h[0], h[1], h[2], h[2] / 4)); // huecos
  // Cables
  const xs = [-120].concat(POLES, [920]);
  for (let i = 0; i < xs.length - 1; i++) {
    for (let c = 0; c < 4; c++) {
      const sag = 14 + c * 9 + r() * 8;
      const y0 = 104 + (c % 2) * 6;
      g.lineStyle(1.5, 0x15121c);
      g.beginPath();
      for (let k = 0; k <= 14; k++) {
        const u = k / 14;
        const px = xs[i] + (xs[i + 1] - xs[i]) * u;
        const py = y0 + sag * 4 * u * (1 - u);
        if (k) g.lineTo(px, py);
        else g.moveTo(px, py);
      }
      g.strokePath();
    }
  }
  // zapatos guindados
  g.lineStyle(1, 0x15121c);
  g.lineBetween(255, 124, 255, 140);
  g.fillStyle(0xe02b2b);
  g.fillRect(250, 140, 6, 4);
  g.fillRect(256, 143, 6, 4);
  // Postes
  POLES.forEach((x) => {
    g.fillStyle(0x4a3a2a);
    g.fillRect(x - 4, 92, 8, 256);
    g.fillRect(x - 24, 102, 48, 5);
    g.fillRect(x, 126, 32, 4);
    g.fillStyle(0x888890);
    g.fillRect(x + 24, 130, 16, 5);
    g.fillStyle(0x2a2a30);
    g.fillRect(x - 9, 112, 8, 12); // transformador
    g.lineStyle(1.5, 0x15121c);
    for (let k = 0; k < 4; k++) g.strokeCircle(x - 12 + r() * 24, 108 + r() * 12, 4 + r() * 6); // guarapita de cables
    lg.fillStyle(0xfff6c0);
    lg.fillRect(x + 25, 135, 14, 3);
    lg.fillStyle(0xfff2a0, 0.12);
    lg.fillTriangle(x + 32, 136, x - 50, 352, x + 120, 352);
    lg.fillEllipse(x + 35, 380, 190, 60);
  });
}

// ---------- Dibujo de personajes ----------

// o: { k: tipo, t: tiempo, mv: camina, a: pose (1 golpe, 2 patada, 3 preparando), r: alcance, fl: destello, s: escala, ns: sin sombra }
function man(g, x, y, f, o) {
  const s = o.s || 1.5;
  const k = o.k;
  const d = DK[k];
  const wh = o.fl > 0;
  const C = (c) => (wh ? WHT : c);
  const R = (dx, dy, w, h, c) => {
    g.fillStyle(C(c), 1);
    g.fillRect(x + (f > 0 ? dx : -dx - w) * s, y + dy * s, w * s, h * s);
  };
  const A = (x1, y1, x2, y2, w, c, al) => {
    g.lineStyle(w * s, C(c), al || 1);
    g.lineBetween(x + f * x1 * s, y + y1 * s, x + f * x2 * s, y + y2 * s);
  };
  if (!o.ns) {
    g.fillStyle(0, 0.3);
    g.fillEllipse(x, y, 30 * s, 7 * s);
  }
  const pl = k === 0 || k === 1;
  const q = o.t * 14;
  const sn = Math.sin(q);
  const mvv = o.mv && !o.sit;
  const sw = mvv ? sn * 4 : 0;
  const hu = o.hurt;
  const pg = o.pg === undefined ? 0.7 : o.pg;
  const a = o.a;
  const ex = pg < 0.3 ? (-0.3 * pg) / 0.3 : -0.3 + 1.3 * Math.min(1, (pg - 0.3) / 0.25);
  const kick = a === 2 && k !== 1;
  const gl = k === 1 && (a === 1 || a === 2);
  const bob = hu ? 1.5 : mvv ? -Math.abs(Math.cos(q)) * 1.4 : Math.sin(o.t * 3) * 0.9;
  const bx = hu ? -5 : o.sit ? 3 : a === 3 ? -2 : kick ? -ex * 1.5 : a ? ex * 2.5 : 0;
  const tx = bx * 0.6;
  const U = (dx, dy, w, h, c) => R(dx + tx, dy + bob, w, h, c);
  const H = (dx, dy, w, h, c) => R(dx + bx, dy + bob, w, h, c);
  const r = o.r || 20;
  const L = Math.max(3, r * ex);
  const leg = pl || k === 'y' ? d[0] : d[2];
  const lw = k === 'y' ? 3 : 5;
  const sock = (lx, l) => {
    if (k === 0) R(lx, -9 - l, 5, 6, WHT);
    R(lx, -3 - l, 7, 3, d[4]);
  };
  if (o.sit) {
    R(-5, -20, 15, 6, leg);
    R(8, -15, 6, 19, leg);
    R(8, 3, 9, 3, d[4]);
  } else {
    const l1 = mvv ? Math.max(0, sn) * 3 : 0;
    const l2 = mvv ? Math.max(0, -sn) * 3 : 0;
    R(-6 + (lw < 5 ? 1 : 0) + sw - (hu ? 2 : 0), -18, lw, 18 - l1, leg);
    sock(-6 + sw - (hu ? 2 : 0), l1);
    if (kick) {
      R(0, -24 - ex * 3, L, 6, leg);
      R(L - 2, -27 - ex * 3, 5, 10, d[4]);
    } else {
      R(1 + (lw < 5 ? 1 : 0) - sw + (hu ? 2 : 0), -18, lw, 18 - l2, leg);
      sock(1 - sw + (hu ? 2 : 0), l2);
    }
  }
  if (k === 0) R(-7, -20, 14, 9, d[2]);
  if (k === 1) R(-9, -20, 18, 11, d[1]);
  const fat = k === 'm' || k === 'y';
  if (fat) {
    R(-8, -20, 16, 3, d[2]);
    U(-10, -37, 20, 18, d[1]);
    U(-2, -30, 15, 14, d[1]);
  }
  U(-7, -38, 14, 20 - bob, d[1]);
  if (k === 'm') {
    U(-10, -21, 23, 3, 0x111111);
    U(8, -21, 4, 3, GOLD);
    U(-2, -35, 2, 6, 0xdddddd);
    U(-2, -36, 6, 1, 0xdddddd);
  }
  if (k === 'o') {
    R(-7, -20, 14, 3, d[2]);
    U(-2, -38, 5, 12, WHT);
    U(0, -36, 3, 18, 0xe02b2b);
  }
  if (k === 'y') {
    U(-7, -41, 14, 4, 0xc8f4ea);
    U(3, -33, 3, 3, 0xe02b2b);
    R(-8, -20, 16, 8, d[2]);
  }
  if (k === 0) U(-2, -37, 6, 2, GOLD);
  if (k === 1) {
    U(-4, -32, 2, 2, 0xfff06a);
    U(3, -27, 2, 2, 0xfff06a);
    U(-2, -21, 2, 2, 0xfff06a);
    U(5, -14, 2, 2, 0xfff06a);
  }
  if (k === 2) U(-7, -31, 14, 2, WHT);
  if (k === 'p' || k === 'b') {
    U(-7, -21, 14, 2, 0x111111);
    U(2, -35, 3, 3, GOLD);
  }
  if (k === 'c') U(-7, -28, 14, 2, 0xd8ff3a);
  // cabeza
  H(-5, -50, 11, 12, d[0]);
  H(3, -46, 2, 2, 0x111111);
  if (k === 1) {
    H(-6, -52, 12, 4, d[3]);
    H(-10, -56, 6, 6, d[3]);
  } else if (k === 2) {
    H(-6, -53, 12, 5, d[3]);
    H(-6, -50, 3, 5, d[3]);
    H(3, -44, 3, 1, 0x7a5038);
  } else if (k === 'o') {
    H(-6, -54, 12, 4, d[3]);
    H(0, -59, 13, 6, d[3]);
    H(9, -57, 6, 4, d[3]);
  } else if (k === 'y') {
    H(-6, -53, 12, 4, d[3]);
    H(1, -57, 8, 3, 0x222222);
    H(2, -56, 3, 1, 0x2a6aa0);
    H(2, -44, 6, 2, 0xf0e0d0);
  } else if (k === 'c') {
    H(-6, -55, 13, 6, d[3]);
    H(-7, -50, 16, 2, d[3]);
  } else {
    H(-6, -54, 12, 5, d[3]);
    H(4, -50, 7, 2, k === 0 || k === 'r' ? d[3] : 0);
    if (k === 'b') H(-1, -53, 3, 3, GOLD);
    if (k === 'm') {
      H(-1, -53, 3, 3, GOLD);
      H(-1, -47, 8, 3, 0x111111);
      H(1, -42, 8, 3, 0x111111);
    }
  }
  // brazos
  const arm = k === 0 ? d[0] : d[1];
  const wc = k === 'p' || k === 'b' || k === 'm' ? 0x111111 : k === 'c' ? 0xb8b8c0 : -1;
  const sy = -36 + bob;
  const hand = (hx, hy) => U(hx - 2, hy - 1, 4, 4, d[0]);
  const wp = (wx, wy) => {
    if (k === 'o') {
      U(wx - 2, wy - 14, 13, 15, 0x15151a);
      U(wx - 2, wy - 9, 13, 2, 0xe8a020);
      U(wx + 2, wy + 1, 3, 4 + 4 * Math.abs(Math.sin(o.t * 9)), 0x15151a);
    } else {
      U(wx - 2, wy - 17, 7, 19, 0x2a9ad8);
      U(wx - 2, wy - 20, 7, 3, 0xe8e8f0);
      U(wx, wy - 10, 3, 3, WHT);
    }
  };
  const wk = k === 'o' || k === 'y';
  if (o.sit) {
    A(-7 + tx, sy + 2, 32, -34, 3, arm);
    A(3 + tx, sy + 2, 33, -32, 3, arm);
    hand(32, -32);
  } else if (gl) {
    const sl = a === 2;
    const t0 = sl ? -0.1 : -1;
    const t1 = sl ? 0 : 0.1;
    const th = (p) => (p < 0.25 ? t0 - (0.2 * p) / 0.25 : t0 - 0.2 + (t1 - t0 + 0.2) * Math.pow(Math.min(1, (p - 0.25) / 0.55), 2));
    const ag = th(pg);
    const sx = 3 + tx;
    const ln = 14 + Math.max(0, ex) * (r - (sl ? 20 : 16));
    const cs = Math.cos(ag);
    const sg = Math.sin(ag);
    const hx = sx + ln * cs;
    const hy = sy + ln * sg;
    A(-7 + tx, sy, -9 + tx, -24 + bob, 4, arm);
    if (pg > 0.25) {
      const rr = ln + (sl ? 11 : 5);
      for (let i = 0; i < 6; i++) {
        const p1 = th(Math.max(0.25, pg - 0.22 * (i / 6)));
        const p2 = th(Math.max(0.25, pg - 0.22 * ((i + 1) / 6)));
        A(sx + rr * Math.cos(p1), sy + rr * Math.sin(p1), sx + rr * Math.cos(p2), sy + rr * Math.sin(p2), sl ? 5 : 3, WHT, (sl ? 0.6 : 0.4) * (1 - i / 6));
      }
    }
    A(sx, sy, hx, hy, 5, arm);
    hand(hx, hy);
    if (sl) {
      const cx = hx + 6 * cs;
      const cy = hy + 6 * sg;
      A(cx + 10 * sg, cy - 10 * cs, cx - 10 * sg, cy + 10 * cs, 8, 0x1f8f88);
      A(cx + 9 * sg, cy - 9 * cs, cx - 9 * sg, cy + 9 * cs, 5, 0x3bd1c6);
      R(cx - 1.5, cy - 1.5, 3, 3, 0xffe14a);
    }
  } else {
    A(-7 + tx, sy, (hu ? -13 : -7 - sw * 0.9) + tx, hu ? -28 : -24 + bob, 4, arm);
    if (a === 1) {
      R(2, -36 + bob, L, 5, arm);
      R(L - 2, -37 + bob, 5, 7, d[0]);
      if (wc >= 0) {
        R(L + 2, -35 + bob, 14, 3, wc);
        if (k === 'c') R(L + 13, -37 + bob, 5, 7, wc);
      }
      if (wk) wp(L + 2 + (k === 'o' && pg > 0.55 ? (pg - 0.55) * 50 : 0), -32 + bob);
    } else if (a === 3) {
      const tr = Math.sin(o.t * 70) * 0.9;
      R(3 + tr, -51, 4, 15, arm);
      if (wc >= 0) R(3 + tr, -66, 3, 16, wc);
      if (wk) wp(3 + tr, -53);
      R(-1, -64, 2, 6, 0xff3030);
      R(-1, -56, 2, 2, 0xff3030);
    } else {
      const ax = hu ? -1 : 5 + sw * 0.9;
      A(3 + tx, sy, ax + tx, hu ? -28 : -24 + bob, 4, arm);
      hand(ax, hu ? -27 : -24);
      if (wc >= 0) R(ax - 1, -23 + bob, 3, 13, wc);
      if (wk) wp(ax, -20 + bob);
    }
  }
}

function lay(g, x, y, f, o, ang) {
  g.save();
  g.translateCanvas(x, y);
  g.rotateCanvas(ang);
  o.ns = 1;
  man(g, 0, 0, f, o);
  g.restore();
}

let MS = [];

function drawSmoke(g) {
  MS = MS.filter((p) => {
    p.t += 1 / 60;
    p.x += p.vx / 60;
    p.y += p.vy / 60;
    if (p.k) {
      p.vy += 8;
      g.fillStyle(p.t % 0.06 < 0.03 ? 0xffe14a : 0xff9030);
      g.fillRect(p.x, p.y, 3, 3);
      return p.t < 0.35;
    }
    g.fillStyle(0x9a9aa4, 0.5 * (1 - p.t / 0.7));
    g.fillCircle(p.x, p.y, 3 + p.t * 18);
    return p.t < 0.7;
  });
}

function drawMoto(g, x, y, f, rider) {
  const a = -0.42 + Math.sin(T * 5) * 0.13;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const ph = T * 22;
  const rd = Math.random();
  if (MS.length < 90) {
    MS.push({ x: x + f * (-26 * ca + 22 * sa), y: y - 26 * sa - 22 * ca, vx: -f * (25 + rd * 25), vy: -8 - rd * 14, t: 0, k: 0 });
    const hot = Math.sin(T * 5) > 0.5;
    for (let i = 0; i < (hot ? 3 : rd < 0.3 ? 1 : 0); i++) MS.push({ x: x, y: y - 2, vx: -f * (50 + Math.random() * 130), vy: -30 - Math.random() * 110, t: 0, k: 1 });
  }
  drawSmoke(g);
  g.fillStyle(0, 0.3);
  g.fillEllipse(x + f * 18, y, 84, 11);
  g.save();
  g.translateCanvas(x, y);
  g.scaleCanvas(f, 1);
  g.rotateCanvas(a);
  const L = (x1, y1, x2, y2, w, c) => {
    g.lineStyle(w, c);
    g.lineBetween(x1, y1, x2, y2);
  };
  const Q = (c, al) => g.fillStyle(c, al || 1);
  // haz del faro
  Q(0xfff2a0, 0.14);
  g.fillTriangle(70, -54, 190, -76, 190, -2);
  Q(0xfff2a0, 0.16);
  g.fillTriangle(70, -54, 150, -62, 150, -30);
  const wheel = (cx) => {
    const cy = -16;
    Q(0x15151a);
    g.fillCircle(cx, cy, 16);
    Q(0x3c3c44);
    for (let i = 0; i < 10; i++) g.fillRect(cx + Math.cos(ph + i * 0.628) * 14.5 - 1, cy + Math.sin(ph + i * 0.628) * 14.5 - 1, 3, 3);
    Q(0xa8a8b4);
    g.fillCircle(cx, cy, 10.5);
    Q(0x24242c);
    g.fillCircle(cx, cy, 8.5);
    g.lineStyle(1.5, 0xdadae4);
    for (let i = 0; i < 6; i++) g.lineBetween(cx, cy, cx + Math.cos(ph + i * 1.047) * 9, cy + Math.sin(ph + i * 1.047) * 9);
    Q(GOLD);
    g.fillCircle(cx, cy, 2.5);
  };
  wheel(0);
  wheel(72);
  L(0, -16, 26, -27, 5, 0x50505a);
  L(8, -30, 14, -17, 3, 0x888890);
  // escape cromado
  L(46, -30, 40, -12, 5, 0xb8b8c4);
  L(40, -12, -24, -22, 6, 0xb8b8c4);
  L(40, -14, -24, -24.5, 1.5, WHT);
  Q(0x2a2a30);
  g.fillCircle(-26, -22, 4);
  // motor con aletas
  Q(0x3a3a44);
  g.fillRoundedRect(20, -34, 30, 22, 3);
  Q(0x4a4a56);
  g.fillRect(26, -42, 20, 9);
  g.lineStyle(1.5, 0x8a8a96);
  for (let i = 0; i < 4; i++) g.lineBetween(26, -41 + i * 2.5, 46, -41 + i * 2.5);
  Q(0x8a8a96);
  g.fillCircle(32, -20, 7);
  Q(0x50505a);
  g.fillCircle(32, -20, 4);
  // guardafango trasero y cola
  g.lineStyle(3, 0xa01818);
  g.beginPath();
  g.arc(0, -16, 19.5, Math.PI + 0.5, Math.PI * 2 - 0.7);
  g.strokePath();
  Q(0xe02b2b);
  g.fillRoundedRect(-24, -49, 24, 10, 3);
  Q(0xff9090);
  g.fillRect(-27, -47, 3, 4);
  Q(GOLD);
  g.fillRect(-18, -48, 4, 8);
  Q(0x2b6cff);
  g.fillRect(-14, -48, 4, 8);
  Q(0xe02b2b);
  g.fillRect(-10, -48, 4, 8);
  // asiento
  Q(0x15151a);
  g.fillRoundedRect(-6, -45, 38, 8, 4);
  // horquilla
  L(72, -16, 66, -36, 5, 0x8a8a96);
  L(66, -36, 59, -57, 4, 0xc8c8d0);
  g.lineStyle(3, 0xe02b2b);
  g.beginPath();
  g.arc(72, -16, 19.5, -2.6, -0.5);
  g.strokePath();
  // tanque rojo con brillo
  Q(0xe02b2b);
  g.fillRoundedRect(28, -58, 32, 17, 8);
  Q(0xa01818);
  g.fillRect(32, -43, 24, 2);
  Q(0xff8a8a);
  g.fillRoundedRect(34, -56, 18, 3, 1);
  // faro
  Q(0x70707c);
  g.fillCircle(68, -54, 8);
  Q(0xfff6b0);
  g.fillCircle(70, -54, 6);
  Q(WHT);
  g.fillCircle(71, -55, 2.5);
  // manubrio
  L(58, -58, 50, -66, 3, 0x222228);
  Q(0x111114);
  g.fillCircle(50, -66, 3);
  if (rider) rider();
  g.restore();
}

// ---------- Pantallas ----------

function buildTitle() {
  txt(W / 2, 78, 'KUNG FU,', 62, '#ffe14a');
  ui.lz = txt(W / 2, 150, 'NO HAY LUZ', 74, '#ffffff');
  txt(W / 2, 208, pick(COPY.subtitle), 18, '#ffd0a0');
  ui.st = txt(W / 2, 470, 'START 1: UN JUGADOR      START 2: DOS JUGADORES', 20, '#ffffff');
  txt(W / 2, 508, 'PALANCA: moverse   B1: golpe   B2: patada   B3: ULTI', 15, '#cfe8ff');
  txt(W / 2, 532, 'TECLADO   P1: WASD + C V B      P2: FLECHAS + M , .', 13, '#9fb8d8');
  ui.hi = txt(W / 2, 566, '', 18, '#ffe14a');
}

function buildSelect() {
  txt(W / 2, 40, 'ELIGE TU PELEADOR', 34, '#ffe14a');
  CH.forEach((c, i) => {
    const cx = 160 + i * 240;
    txt(cx, 132, c.n, 20, '#ffffff');
    STN.forEach((n, j) => txt(cx - 62, 338 + j * 18, n, 11, '#cfe8ff'));
    txt(cx, 416, c.un, 13, '#ffe14a');
    txt(cx, 434, c.ud, 11, '#ffffff');
  });
  ui.tag = [txt(0, 0, 'P1', 22, PCOL[0]), txt(0, 0, 'P2', 22, PCOL[1])];
  ui.s1 = txt(W / 4, 500, '', 15, PCOL[0]);
  ui.s2 = txt((W * 3) / 4, 500, '', 15, PCOL[1]);
  txt(W / 2, 560, 'PALANCA ◄ ► elegir   ·   B1 confirmar   ·   B2 cambiar', 14, '#cfe8ff');
}

function buildOver() {
  txt(W / 2, 80, 'GAME OVER', 64, '#ff4a4a');
  txt(W / 2, 138, pick(COPY.over), 17, '#ffd0a0');
  txt(W / 2, 190, 'PUNTOS: ' + score + '    OLEADA: ' + wave, 26, '#ffffff');
  if (newRec) txt(W / 2, 228, '¡NUEVO RÉCORD!', 22, '#ffe14a');
  txt(W / 2, 278, 'HISTÓRICO', 22, '#5ee6ff');
  LB.forEach((e, i) => {
    const me = e === nm.e;
    const c = me ? '#ffe14a' : '#ffffff';
    const y = 316 + i * 34;
    txt(260, y, i + 1 + '.', 20, c);
    txt(340, y, e.n, 22, c);
    txt(470, y, String(e.s).padStart(6, '0'), 22, c);
    txt(570, y, 'OL. ' + e.w, 15, me ? '#ffe14a' : '#9fb8d8');
  });
  if (!LB.length) txt(W / 2, 330, 'Nadie todavía. ¡Échale bolas!', 16, '#9fb8d8');
  ui.st = txt(W / 2, 520, 'START 1 PARA VOLVER', 22, '#ffffff');
}

function buildName() {
  nm = { c: [0, 0, 0], i: 0, rt: 0 };
  txt(W / 2, 110, newRec ? '¡NUEVO RÉCORD!' : '¡ENTRASTE AL HISTÓRICO!', 40, '#ffe14a');
  txt(W / 2, 170, score + ' PUNTOS · OLEADA ' + wave, 24, '#ffffff');
  txt(W / 2, 230, 'ESCRIBE TU NOMBRE', 22, '#5ee6ff');
  ui.L = [0, 1, 2].map((i) => txt(320 + i * 80, 320, 'A', 64, '#ffffff'));
  txt(W / 2, 430, 'PALANCA ▲▼ letra   ◄► mover   B1 aceptar   B2 borrar', 15, '#cfe8ff');
  txt(W / 2, 460, 'START 1: terminar', 15, '#9fb8d8');
}

function stepName(dt) {
  ug.fillStyle(0x0a0714, 0.85);
  ug.fillRect(0, 0, W, H);
  const up = held.P1_U || held.P2_U;
  const dn = held.P1_D || held.P2_D;
  let d = 0;
  if (hit.P1_U || hit.P2_U || hit.P1_D || hit.P2_D) {
    d = up ? -1 : 1;
    nm.rt = 0.35;
  } else if (up || dn) {
    nm.rt -= dt;
    if (nm.rt <= 0) {
      nm.rt = 0.08;
      d = up ? -1 : 1;
    }
  }
  if (d) {
    nm.c[nm.i] = (nm.c[nm.i] + d + 26) % 26;
    SFX.sel();
  }
  if (hit.P1_L || hit.P2_L) nm.i = Math.max(0, nm.i - 1);
  if (hit.P1_R || hit.P2_R) nm.i = Math.min(2, nm.i + 1);
  if (hit.P1_2 || hit.P2_2) {
    nm.c[nm.i] = 0;
    nm.i = Math.max(0, nm.i - 1);
  }
  let done = hit.START1;
  if (hit.P1_1 || hit.P2_1) {
    SFX.ok();
    if (nm.i < 2) nm.i++;
    else done = true;
  }
  ui.L.forEach((t, i) => {
    t.setText(ABC[nm.c[i]]);
    t.setColor(i === nm.i ? '#ffe14a' : '#ffffff');
    if (i === nm.i && T % 0.5 < 0.35) {
      ug.fillStyle(0xffe14a);
      ug.fillRect(292 + i * 80, 362, 56, 6);
      ug.fillTriangle(320 + i * 80, 262, 310 + i * 80, 274, 330 + i * 80, 274);
      ug.fillTriangle(320 + i * 80, 390, 310 + i * 80, 378, 330 + i * 80, 378);
    }
  });
  if (done) {
    nm.e = { n: nm.c.map((c) => ABC[c]).join(''), s: score, w: wave };
    mergeLB([nm.e]);
    saveHi();
    overT = 1;
    go('over');
  }
}

function stepTitle() {
  ug.fillStyle(0x0a0714, 0.45);
  ug.fillRect(0, 0, W, 232);
  ug.fillRect(0, 446, W, 154);
  ui.lz.setAlpha(Math.random() > 0.06 ? 1 : 0.25);
  ui.st.setVisible(T % 1 < 0.65);
  ui.hi.setText(LB.length ? 'RÉCORD: ' + LB[0].n + '  ' + LB[0].s : '');
  for (let i = 0; i < 3; i++) man(ug, 280 + i * 120, 425, 1, { k: i, t: T, s: 2.2, a: Math.floor(T * 1.5 + i) % 4 === 0 ? 1 + (i % 2) : 0, r: 20 });
  man(ug, 90, 425, 1, { k: 'p', t: T, s: 2.2, a: 3 });
  man(ug, 700, 425, -1, { k: 'c', t: T, s: 2.2 });
  if (hit.START2) np = 2;
  else if (hit.START1 || hit.P1_1) np = 1;
  else return;
  sel = [{ i: 0, ok: false }, { i: 2, ok: false }];
  selT = 0;
  SFX.ok();
  go('select');
}

function stepSelect(dt) {
  ug.fillStyle(0x0a0714, 0.78);
  ug.fillRect(0, 0, W, H);
  if (np === 1 && hit.START2) {
    np = 2;
    SFX.ok();
  }
  let all = true;
  for (let i = 0; i < 2; i++) {
    const s = sel[i];
    const on = i < np;
    const pre = 'P' + (i + 1) + '_';
    ui.tag[i].setVisible(on);
    if (!on) continue;
    if (!s.ok) {
      if (hit[pre + 'L']) { s.i = (s.i + 2) % 3; SFX.sel(); }
      if (hit[pre + 'R']) { s.i = (s.i + 1) % 3; SFX.sel(); }
      if (hit[pre + '1']) {
        s.ok = true;
        SFX.ok();
        say(160 + s.i * 240, 200, pick(CH[s.i].q), PCOL[i], 20);
      }
    } else if (hit[pre + '2'] && selT <= 0) s.ok = false;
    if (!s.ok) all = false;
    ui.tag[i].setPosition(160 + s.i * 240 + (i ? 60 : -60), 100);
  }
  ui.s1.setText(sel[0].ok ? 'P1 ¡LISTO!' : 'P1: elige con la palanca');
  ui.s2.setText(np < 2 ? 'P2: pulsa START 2 para unirte' : sel[1].ok ? 'P2 ¡LISTO!' : 'P2: elige con la palanca');
  CH.forEach((c, i) => {
    const cx = 160 + i * 240;
    ug.fillStyle(0x1d1836, 0.95);
    ug.fillRect(cx - 100, 112, 200, 340);
    ug.lineStyle(2, 0x4a4370);
    ug.strokeRect(cx - 100, 112, 200, 340);
    for (let j = 0; j < np; j++) {
      if (sel[j].i !== i) continue;
      ug.lineStyle(4, PHEX[j], sel[j].ok || T % 0.4 < 0.28 ? 1 : 0.3);
      ug.strokeRect(cx - 104 - j * 5, 108 - j * 5, 208 + j * 10, 348 + j * 10);
    }
    const a = Math.floor(T * 2 + i) % 3;
    man(ug, cx, 312, 1, { k: i, t: T, s: 2.7, a: a, r: (c[a === 2 ? 'k' : 'p'][0] - 10) / 1.5 });
    c.st.forEach((v, j) => {
      for (let b = 0; b < 5; b++) {
        ug.fillStyle(b < v ? 0xffe14a : 0x3a3458);
        ug.fillRect(cx - 34 + b * 22, 333 + j * 18, 18, 9);
      }
    });
  });
  if (all) {
    if (selT <= 0) selT = 0.9;
    selT -= dt;
    if (selT <= 0) startGame();
  } else selT = 0;
}

function stepOver() {
  ug.fillStyle(0x0a0714, 0.8);
  ug.fillRect(0, 0, W, H);
  ui.st.setVisible(T % 1 < 0.65);
  overT -= 1 / 60;
  if (overT <= 0 && (hit.START1 || hit.P1_1 || hit.START2)) go('title');
}

// ---------- Partida ----------

function startGame() {
  P = [];
  for (let i = 0; i < np; i++) {
    const c = CH[sel[i].i];
    P.push({
      i: i, c: sel[i].i, ch: c, x: np === 1 ? 400 : 300 + i * 200, y: 470, f: 1, hp: c.hp, ul: 0,
      at: 0, att: 0, cd: 0, inv: 1, t: 0, mv: false, moto: 0, mt: 0, ar: 0, art: 0, dead: false, sy: 0,
    });
  }
  E = [];
  PR = [];
  PK = [];
  OIL = [];
  FXP = [];
  score = 0;
  wave = 0;
  wLeft = 0;
  wNext = 1;
  overT = 0;
  newRec = false;
  L = { s: 0, t: 16, lt: 1, fl: 0, a: 0 };
  wm = '';
  tsay = 0;
  go('play');
}

function startWave() {
  wave++;
  // Curva: ver spawn/stepE. APAGÓN TOTAL en 3,7,11,15..; ESTAMPIDA en 6,9,12,18..; jefe cada 5 (x2 desde la 10)
  wm = wave % 4 === 3 ? 'APAGÓN TOTAL' : wave >= 6 && wave % 3 === 0 && wave % 5 ? 'ESTAMPIDA' : '';
  wLeft = Math.round(Math.min(40, 4 + wave * 2) * (np === 2 ? 1.5 : 1) * (wm === 'ESTAMPIDA' ? 1.3 : 1));
  wSpawn = 1;
  SFX.wave();
  banner('OLEADA ' + wave, wm ? '#ff8a5a' : '#ffe14a');
  if (wm === 'ESTAMPIDA') say(W / 2, 268, pick(COPY.stampede), '#ff8a5a', 28, 2000);
  if (wm === 'APAGÓN TOTAL') {
    L.full = 1;
    L.s = 1;
    L.t = 1.2;
  }
  P.forEach((p) => {
    if (p.dead && wave > 1) {
      p.dead = false;
      p.hp = p.ch.hp / 2;
      p.inv = 2;
      say(p.x, p.y - 90, pick(p.ch.rv), PCOL[p.i]);
    }
  });
  if (wave % 5 === 0) {
    spawnBoss(0);
    if (wave >= 10) spawnBoss(1);
  }
}

function spawnBoss(i) {
  const k = BR[(wave / 5 - 1 + i) % BR.length];
  spawn(k);
  say(W / 2, 310 + i * 40, pick(EN[k].in), '#ff4a4a', 30, 2400);
}

function spawn(k) {
  if (!k) {
    const r = Math.random();
    k = wm === 'ESTAMPIDA' ? (r < 0.25 ? 'p' : 'r') : wave >= 3 && r < Math.min(0.3, (wave - 2) * 0.05) ? 'c' : r < Math.min(0.7, 0.2 + wave * 0.08) ? 'p' : 'r';
  }
  const sd = Math.random() < 0.5 ? -1 : 1;
  const bo = EN[k].boss;
  const sc = bo ? 1.5 : 1;
  const e = {
    k: k, x: sd < 0 ? -30 : W + 30, y: rnd(FT + 10, FB - 5), f: -sd, sc: sc,
    hp: EN[k].hp * (1 + wave * 0.09) * (np === 2 ? 1.15 : 1) * (bo ? 0.5 + wave / 10 : 1), st: 'm', tm: 0, cd: 0.5, vx: 0, t: Math.random() * 9,
    sm: (1 + Math.min(0.5, wave * 0.025)) * (wm === 'ESTAMPIDA' ? 1.35 : 1), tw: k === 'c' && wave >= 5 && Math.random() < 0.4, sy: rnd(2, 5),
    fl: 0, mh: 0, ox: Math.random() * 14, oy: rnd(-10, 10), mv: true,
  };
  e.boss = bo;
  e.mhp = e.hp;
  e.sp2 = rnd(2, 4);
  E.push(e);
  if ((Math.random() < 0.22 && tsay <= 0) || bo) {
    tsay = 1.2;
    say(clamp(e.x, 100, W - 100), e.y - 90, pick(EN[k].q), '#ffb4b4');
  }
}

function alive(e) {
  return e.st !== 'd';
}

function damage(e, d, p, dir, ult) {
  if (!alive(e)) return;
  e.hp -= d;
  e.fl = 0.12;
  FXP.push({ x: e.x, y: e.y - 40 * e.sc, t: 0.18 });
  if (p && !ult) p.ul = Math.min(100, p.ul + d * p.ch.ur * 0.5);
  if (e.hp <= 0) {
    e.st = 'd';
    e.tm = 0.6;
    e.vx = dir * 340;
    score += EN[e.k].s * (dark ? 2 : 1);
    SFX.ko();
    if (dark) say(e.x, e.y - 95, 'x2', '#9fe8ff', 14, 700);
    if (e.boss || (tsay <= 0 && Math.random() < 0.35)) {
      tsay = 1.2;
      say(clamp(e.x, 100, W - 100), e.y - 95 * e.sc, pick(EN[e.k].dq || EN[e.k].q), '#ffb4b4');
    }
    if (Math.random() < 0.14 || e.boss) PK.push({ x: clamp(e.x, 30, W - 30), y: e.y, t: 10 });
  } else if (!e.boss) {
    // contra el spam: tras varios golpes seguidos el enemigo se blinda, deja de aturdirse y contraataca
    if (T - (e.lh || 0) > 1) e.hc = 0;
    e.lh = T;
    e.hc = (e.hc || 0) + 1;
    if (e.ar > 0 || e.hc >= (e.k === 'r' ? 4 : 3)) {
      if (!(e.ar > 0)) {
        e.ar = 1.3;
        e.hc = 0;
        if (tsay <= 0) {
          tsay = 1;
          say(e.x, e.y - 95, '¡ÉPALE!', '#ff8a8a', 18, 700);
        }
      }
      e.vx = dir * 60;
      if (e.st !== 'w' && e.st !== 's') {
        e.st = 'w';
        e.th = 0;
        e.tm = 0.16;
        e.f = -dir;
      }
    } else {
      e.st = 'h';
      e.tm = 0.22;
      e.vx = dir * 170;
    }
  } else {
    e.vx = dir * 40;
    // pegarle al Matraquero mientras se prepara cancela la embestida
    if (e.st === 'w' && e.th === 2) {
      e.st = 'm';
      e.th = 0;
      e.cd = 1.2;
      say(e.x, e.y - 140, '¡ÉPALE, ÉPALE!', '#ff8a8a', 18, 800);
    }
  }
}

function hurtP(p, d, dir) {
  if (p.dead || p.inv > 0 || p.moto > 0) return;
  p.hp -= d;
  p.inv = 0.6;
  p.x = clamp(p.x + dir * 14, 20, W - 20);
  SFX.hurt();
  S.cameras.main.shake(90, 0.005);
  if (p.hp <= 0) {
    p.hp = 0;
    p.dead = true;
    p.ar = 0;
    say(p.x, p.y - 90, pick(p.ch.ko), PCOL[p.i], 20);
    if (P.every((q) => q.dead)) {
      overT = 1.6;
      SFX.over();
    }
  }
}

// golpe enemigo cuerpo a cuerpo; el Matraquero además te cobra "pa'l fresco"
function hitP(e, p, d) {
  if (p.dead || p.inv > 0 || p.moto > 0) return;
  hurtP(p, d, e.f);
  if (e.k === 'm') {
    const s = Math.min(score, 100 + wave * 20);
    score -= s;
    if (s) say(p.x, p.y - 112, '-' + s + " ¡PA'L FRESCO!", '#ff4a4a', 16);
  }
}

function attack(p, ty) {
  const a = ty === 1 ? p.ch.p : p.ch.k;
  let any = false;
  p.at = ty;
  p.att = p.ad = 0.18;
  p.cd = a[2];
  for (const e of E) {
    const dx = (e.x - p.x) * p.f;
    if (alive(e) && dx > -12 && dx < a[0] + (e.sc - 1) * 40 && Math.abs(e.y - p.y) < 24) {
      damage(e, a[1], p, p.f);
      any = true;
    }
  }
  if (!any) SFX.whiff();
  else if (p.c === 1) SFX.slap();
  else if (ty === 1) SFX.punch();
  else SFX.kick();
  if (any && p.sy <= 0 && Math.random() < 0.35) {
    say(p.x, p.y - 95, pick(p.ch.q), PCOL[p.i]);
    p.sy = 1.6;
  }
}

function nearest(x, y) {
  let b = null;
  let bd = 1e9;
  for (const e of E) {
    const d = Math.abs(e.x - x) + Math.abs(e.y - y);
    if (alive(e) && e.x > -10 && e.x < W + 10 && d < bd) {
      bd = d;
      b = e;
    }
  }
  return b;
}

function ulti(p) {
  p.ul = 0;
  p.sy = 2;
  SFX.ulti();
  say(p.x, p.y - 100, p.ch.uq, PCOL[p.i], 26, 1600);
  S.cameras.main.flash(150, 255, 240, 160);
  if (p.c === 0) p.moto = 5;
  else if (p.c === 1) {
    const tg = E.filter(alive).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x)).slice(0, 5);
    const last = tg[tg.length - 1];
    const far = last ? { x: clamp(last.x + (last.x < p.x ? -110 : 110), 20, W - 20), y: last.y - 40 } : { x: clamp(p.x + p.f * 320, 20, W - 20), y: p.y - 40 };
    PR.push({ ty: 'ch', x: p.x, y: p.y - 40, o: p, tg: tg.concat([far], tg.slice().reverse()), i: 0, rot: 0 });
  } else {
    p.ar = 10;
    p.art = 0;
  }
}

function stepP(p, dt) {
  const pre = 'P' + (p.i + 1) + '_';
  p.t += dt;
  p.inv -= dt;
  p.cd -= dt;
  p.att -= dt;
  p.sy -= dt;
  if (p.dead) return;
  const dx = (held[pre + 'R'] ? 1 : 0) - (held[pre + 'L'] ? 1 : 0);
  const dy = (held[pre + 'D'] ? 1 : 0) - (held[pre + 'U'] ? 1 : 0);
  const oil = !(p.moto > 0) && OIL.some((o) => Math.abs(o.x - p.x) < 50 && Math.abs(o.y - p.y) < 14);
  const sp = p.ch.sp * (p.moto > 0 ? 1.9 : p.att > 0 ? 0.35 : 1) * (dx && dy ? 0.75 : 1) * (oil ? 0.45 : 1);
  p.mv = !!(dx || dy);
  if (dx) p.f = dx;
  p.x = clamp(p.x + dx * sp * dt, 20, W - 20);
  p.y = clamp(p.y + dy * sp * 0.7 * dt, FT, FB);
  if (p.moto > 0) {
    p.moto -= dt;
    p.mt -= dt;
    if (p.mt <= 0) {
      p.mt = 0.1;
      SFX.moto();
    }
    for (const e of E) {
      if (alive(e) && Math.abs(e.x - p.x) < 40 * e.sc && Math.abs(e.y - p.y) < 26 && e.mh <= 0) {
        e.mh = 0.4;
        damage(e, e.boss ? 60 : 999, p, e.x < p.x ? -1 : 1, 1);
        SFX.kick();
      }
    }
    if (p.moto <= 0) p.inv = 0.8;
    return;
  }
  if (p.ar > 0) {
    p.art -= dt;
    if (p.art <= 0) {
      p.art = 0.16;
      p.ar--;
      p.at = 1;
      p.att = 0.1;
      PR.push({ ty: 'ar', x: p.x + p.f * 24, y: p.y - 52, vx: p.f * 520, vy: rnd(-40, 40), o: p, tg: nearest(p.x, p.y), life: 1.6 });
      tone(700, 0.08, 'triangle', 0.08, 300);
    }
  }
  if (p.cd <= 0) {
    if (hit[pre + '1']) attack(p, 1);
    else if (hit[pre + '2']) attack(p, 2);
  }
  if (hit[pre + '3'] && p.ul >= 100) ulti(p);
}

function stepE(e, dt) {
  const d = EN[e.k];
  e.t += dt;
  e.fl -= dt;
  e.cd -= dt;
  e.mh -= dt;
  e.ar -= dt;
  e.x += e.vx * dt;
  e.vx -= e.vx * Math.min(1, 7 * dt);
  if (e.st === 'd') {
    e.tm -= dt;
    return e.tm > 0;
  }
  if (e.st === 'h') {
    e.tm -= dt;
    if (e.tm <= 0) e.st = 'm';
    return true;
  }
  let tg = null;
  let bd = 1e9;
  for (const p of P) {
    const q = Math.abs(p.x - e.x) + Math.abs(p.y - e.y);
    if (!p.dead && q < bd) {
      bd = q;
      tg = p;
    }
  }
  e.mv = false;
  if (!tg) return true;
  const rg = 44 * e.sc;
  e.tm -= dt;
  if (e.st === 'm') {
    const sd = e.x < tg.x ? -1 : 1;
    const tx = tg.x + sd * (rg - 16 + e.ox * 0.6);
    const ddx = tx - e.x;
    const ddy = tg.y + e.oy - e.y;
    const l = Math.hypot(ddx, ddy);
    e.f = -sd;
    if (l > 4) {
      const v = (d.sp * e.sm * (dark ? 1.3 : 1) * dt) / l;
      e.x += ddx * v;
      e.y = clamp(e.y + ddy * v * 0.8, FT, FB);
      e.mv = true;
    }
    e.sy -= dt;
    if (e.sy <= 0) {
      e.sy = rnd(5, 9);
      if (tsay <= 0 && Math.random() < 0.5) {
        tsay = 1.2;
        say(clamp(e.x, 100, W - 100), e.y - 95 * e.sc, pick(EN[e.k].q), '#ffb4b4');
      }
    }
    const wt = Math.max(0.55, 1 - wave * 0.03) * (dark ? 0.75 : 1);
    e.sp2 -= dt;
    if ((e.k === 'm' || e.k === 'o') && e.sp2 <= 0 && e.cd <= 0 && Math.abs(tg.x - e.x) > 140) {
      e.sp2 = rnd(3.5, 5.5);
      e.st = 'w';
      e.th = e.k === 'm' ? 2 : 3;
      e.tm = e.k === 'm' ? 1 : 0.55;
      e.f = tg.x < e.x ? -1 : 1;
      if (tsay <= 0) {
        tsay = 1.2;
        say(clamp(e.x, 100, W - 100), e.y - 140, pick(d.at), '#ff8a8a');
      }
    } else if (e.tw && e.cd <= 0 && PR.filter((q) => q.ty === 'bu').length < 2 && Math.abs(tg.x - e.x) > 150 && Math.abs(tg.y - e.y) < 18) {
      e.st = 'w';
      e.th = 1;
      e.tm = 0.6 * wt;
      e.f = tg.x < e.x ? -1 : 1;
      if (tsay <= 0) {
        tsay = 1.2;
        say(clamp(e.x, 100, W - 100), e.y - 95, pick(EN.c.th || EN.c.q), '#ffb4b4');
      }
    } else if (Math.abs(tg.x - e.x) < rg + 6 && Math.abs(tg.y - e.y) < 16 && e.cd <= 0) {
      e.st = 'w';
      e.th = 0;
      e.tm = 0.4 * wt;
    }
  } else if (e.st === 'c') {
    // embestida del Matraquero
    // va recto por su carril (marcado en rojo durante la preparación): se esquiva moviéndose arriba/abajo
    e.x += e.f * 400 * dt;
    e.mv = true;
    for (const p of P) {
      if (Math.abs(p.x - e.x) < 40 && Math.abs(p.y - e.y) < 20 && p.inv <= 0 && !p.dead && !(p.moto > 0)) {
        hitP(e, p, d.d * 1.2 * (1 + wave * 0.04));
        e.tm = 0;
      }
    }
    if (e.tm <= 0 || e.x < -40 || e.x > W + 40) {
      e.st = 'm';
      e.cd = 1;
    }
  } else if (e.st === 'w') {
    if (e.tm <= 0 && e.th === 2) {
      e.th = 0;
      e.st = 'c';
      e.tm = 0.8;
      SFX.moto();
      noise(0.4, 0.2, 500);
    } else if (e.tm <= 0 && e.th === 3) {
      e.th = 0;
      e.st = 's';
      e.tm = 0.3;
      e.cd = 1;
      PR.push({ ty: 'oil', sx: e.x + e.f * 20, sy: e.y - 100, x: e.x, y: e.y - 100, tx: clamp(tg.x, 40, W - 40), gy: tg.y, t: 0, d: 0.9, rot: 0 });
    } else if (e.tm <= 0 && e.th) {
      e.th = 0;
      e.st = 's';
      e.tm = 0.25;
      e.cd = rnd(2.5, 4);
      PR.push({ ty: 'bu', x: e.x + e.f * 24, y: e.y - 46, gy: e.y, vx: e.f * (330 + wave * 6), rot: 0 });
    } else if (e.tm <= 0) {
      e.st = 's';
      e.tm = 0.18;
      SFX.whiff();
      for (const p of P) {
        const dx = (p.x - e.x) * e.f;
        const ax = e.k === 'y' ? Math.abs(dx) : dx;
        if (ax > -10 && ax < rg + 12 && Math.abs(p.y - e.y) < 22) hitP(e, p, d.d * (1 + wave * 0.04));
      }
    }
  } else if (e.tm <= 0) {
    e.st = 'm';
    e.cd = rnd(0.7, 1.6) * Math.max(0.45, 1 - wave * 0.04);
  }
  return true;
}

function stepPR(o, dt) {
  if (o.ty === 'ar') {
    o.life -= dt;
    if (o.tg && alive(o.tg)) {
      const dx = o.tg.x - o.x;
      const dy = o.tg.y - 36 - o.y;
      const l = Math.hypot(dx, dy) || 1;
      o.vx = (dx / l) * 520;
      o.vy = (dy / l) * 520;
    }
    o.x += o.vx * dt;
    o.y += o.vy * dt;
    for (const e of E) {
      if (alive(e) && Math.abs(e.x - o.x) < 22 * e.sc && Math.abs(e.y - 36 * e.sc - o.y) < 36 * e.sc) {
        damage(e, 30, o.o, o.vx < 0 ? -1 : 1, 1);
        SFX.punch();
        return false;
      }
    }
    return o.life > 0 && o.x > -30 && o.x < W + 30;
  }
  if (o.ty === 'oil') {
    o.t += dt;
    o.rot += dt * 9;
    const u = Math.min(1, o.t / o.d);
    o.x = o.sx + (o.tx - o.sx) * u;
    o.y = o.sy + (o.gy - 30 - o.sy) * u - Math.sin(u * Math.PI) * 120;
    if (u < 1) return true;
    OIL.push({ x: o.tx, y: o.gy, t: 7 });
    noise(0.3, 0.3, 400);
    for (const p of P) if (!p.dead && Math.abs(p.x - o.tx) < 46 && Math.abs(p.y - o.gy) < 24) hurtP(p, 14 * (1 + wave * 0.04), p.x < o.tx ? -1 : 1);
    return false;
  }
  if (o.ty === 'bu') {
    o.x += o.vx * dt;
    o.rot += dt * 14;
    for (const p of P) {
      if (!p.dead && Math.abs(p.x - o.x) < 18 && Math.abs(p.y - o.gy) < 24) {
        hurtP(p, 12 * (1 + wave * 0.04), o.vx < 0 ? -1 : 1);
        FXP.push({ x: o.x, y: o.y, t: 0.18 });
        SFX.spark();
        return false;
      }
    }
    return o.x > -30 && o.x < W + 30;
  }
  // chancla bumerán
  o.rot += dt * 22;
  let t = o.tg[o.i];
  while (t && t.st === 'd') t = o.tg[++o.i];
  const en = t && t.k;
  const tx = t ? t.x : o.o.x;
  const ty = t ? (en ? t.y - 40 : t.y) : o.o.y - 40;
  const dx = tx - o.x;
  const dy = ty - o.y;
  const l = Math.hypot(dx, dy);
  const v = 680 * dt;
  if (l <= v + 14) {
    if (!t) return false;
    if (en) {
      damage(t, 42, o.o, dx < 0 ? -1 : 1, 1);
      SFX.slap();
    }
    o.i++;
  }
  if (l > 1) {
    o.x += (dx / l) * Math.min(v, l);
    o.y += (dy / l) * Math.min(v, l);
  }
  return true;
}

function spark(x) {
  const pts = [];
  for (let i = 0; i < 4; i++) {
    const a = rnd(0, 6.28);
    const l = rnd(10, 28);
    pts.push([Math.cos(a) * l * 0.5 + rnd(-5, 5), Math.sin(a) * l * 0.5 + rnd(-5, 5), Math.cos(a) * l, Math.sin(a) * l]);
  }
  SPK.push({ x: x + rnd(-14, 14), y: 108 + rnd(0, 14), t: 0.1, p: pts });
  SFX.spark();
}

function light(dt) {
  L.t -= dt;
  L.fl -= dt;
  if (L.s === 0) {
    lg.visible = true;
    L.a = 0;
    if (L.t <= 0) {
      L.s = 1;
      L.t = 1.4;
    }
  } else if (L.s === 1) {
    lg.visible = Math.random() > 0.45;
    L.a = lg.visible ? 0 : 0.5;
    if (Math.random() < 0.15) spark(pick(POLES));
    if (L.t <= 0) {
      L.s = 2;
      L.t = L.full ? 999 : rnd(6.5, 9.5);
      L.lt = 1;
      SFX.out();
      banner(pick(L.full ? COPY.fullBlackout : COPY.blackout), '#9fe8ff');
      const c = E.find((e) => e.k === 'c' && alive(e));
      if (c) say(c.x, c.y - 95, '¡Fue una iguana!', '#ffb4b4');
    }
  } else if (L.s === 2) {
    lg.visible = false;
    L.lt -= dt;
    if (L.lt <= 0) {
      L.lt = rnd(1.4, 3.6);
      L.fl = 0.14;
      L.bx = rnd(80, W - 80);
      SFX.thunder();
    }
    L.a = L.fl > 0 ? 0.3 : 0.9;
    if (Math.random() < 0.03) spark(pick(POLES));
    if (L.t <= 0 && !L.full) {
      L.s = 3;
      L.t = 0.8;
    }
  } else {
    lg.visible = Math.random() > 0.5;
    L.a = lg.visible ? 0 : 0.85;
    if (L.t <= 0) {
      L.s = 0;
      L.t = rnd(13, 22) * Math.max(0.6, 1 - wave * 0.03);
      SFX.on();
      banner(pick(COPY.lightOn), '#ffe14a');
    }
  }
  dark = L.s === 2;
}

function stepPlay(dt) {
  tsay -= dt;
  light(dt);
  music(dt);
  P.forEach((p) => stepP(p, dt));
  // separa a los dos jugadores para que no se encimen
  const [a, b] = P;
  if (b && !a.dead && !b.dead && Math.abs(b.x - a.x) < 30 && Math.abs(b.y - a.y) < 16) {
    const s = ((30 - Math.abs(b.x - a.x)) / 2) * (b.x < a.x ? -1 : 1);
    a.x = clamp(a.x - s, 20, W - 20);
    b.x = clamp(b.x + s, 20, W - 20);
  }
  E = E.filter((e) => stepE(e, dt));
  PR = PR.filter((o) => stepPR(o, dt));
  OIL = OIL.filter((o) => (o.t -= dt) > 0);
  PK = PK.filter((k) => {
    k.t -= dt;
    for (const p of P) {
      if (!p.dead && Math.abs(p.x - k.x) < 28 && Math.abs(p.y - k.y) < 20) {
        p.hp = Math.min(p.ch.hp, p.hp + 25);
        SFX.pick();
        say(k.x, k.y - 60, '+25 ' + pick(COPY.pickup), '#8dff8d');
        return false;
      }
    }
    return k.t > 0;
  });
  // oleadas
  if (overT > 0) {
    overT -= dt;
    if (overT <= 0) endGame();
    return;
  }
  if (wNext > 0) {
    wNext -= dt;
    if (wNext <= 0) startWave();
  } else if (wLeft > 0) {
    wSpawn -= dt;
    if (wSpawn <= 0 && E.length < (Math.min(10, 3.5 + wave * 0.5) + (wm === 'ESTAMPIDA' ? 2 : 0)) * (np === 2 ? 1.3 : 1)) {
      wSpawn = Math.max(0.55, 1.6 - wave * 0.07) * (dark ? 0.85 : 1) * (wm === 'ESTAMPIDA' ? 0.7 : 1);
      wLeft--;
      spawn();
    }
  } else if (!E.length) {
    wNext = 2.2;
    if (L.full) {
      L.full = 0;
      L.s = 3;
      L.t = 0.8;
    }
    score += wave * 250;
    say(W / 2, 260, pick(COPY.waveClear) + '  +' + wave * 250, '#8dff8d', 22, 1600);
  }
}

function endGame() {
  newRec = score > hi;
  nm.e = null;
  overT = 1;
  lg.visible = true;
  L.a = 0;
  dark = false;
  go(score > 0 && (LB.length < 5 || score > LB[4].s) ? 'name' : 'over');
}

// acepta el formato actual { v: 2, t: [...] } y el viejo (número o { score })
function readHi(r) {
  const v = r && r.found ? r.value : null;
  let t = [];
  if (v && Array.isArray(v.t)) t = v.t;
  else {
    const n = typeof v === 'number' ? v : v && v.score;
    if (typeof n === 'number') t = [{ n: '???', s: n, w: 0 }];
  }
  mergeLB(
    t.filter((e) => e && typeof e.n === 'string' && typeof e.s === 'number' && isFinite(e.s) && e.s >= 0)
      .map((e) => ({ n: e.n.slice(0, 3).toUpperCase(), s: Math.floor(e.s), w: Math.floor(+e.w || 0) })),
  );
}

function mergeLB(t) {
  const seen = {};
  LB = LB.concat(t)
    .filter((e) => {
      const k = e.n + e.s + '/' + e.w;
      return seen[k] ? false : (seen[k] = 1);
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, 5);
  hi = LB.length ? LB[0].s : 0;
}

// relee antes de guardar para no pisar un récord mayor ya almacenado
function saveHi() {
  const st = getStorage();
  Promise.resolve()
    .then(() => st.get(HS_KEY))
    .then(readHi, () => {})
    .then(() => st.set(HS_KEY, { v: 2, t: LB }))
    .catch(() => {});
}

function drawPlay() {
  const g = eg;
  const list = [];
  P.forEach((p) => list.push(p));
  E.forEach((e) => list.push(e));
  PK.forEach((k) => list.push(k));
  list.sort((a, b) => a.y - b.y);
  for (const o of list) {
    if (o.ch) {
      // jugador
      const a = o.att > 0 ? o.at : 0;
      const r = ((a === 2 ? o.ch.k[0] : o.ch.p[0]) - 10) / 1.5;
      const op = { k: o.c, t: o.t, mv: o.mv, a: a, r: r, pg: clamp(1 - o.att / (o.ad || 0.18), 0, 1), hurt: o.inv > 0.4 && o.inv <= 0.6 };
      if (o.dead) lay(g, o.x, o.y - 6, o.f, op, -o.f * 1.57);
      else if (o.moto > 0) {
        const rd = o.moto > 1 || T % 0.2 < 0.1;
        drawMoto(g, o.x - o.f * 28, o.y, o.f, rd && (() => man(g, 12, -19, 1, { k: 0, t: o.t, s: 1.3, ns: 1, sit: 1, fl: o.fl })));
      } else if (o.inv <= 0 || T % 0.12 < 0.06) man(g, o.x, o.y, o.f, op);
      if (!o.dead) {
        fx.fillStyle(PHEX[o.i]);
        fx.fillTriangle(o.x - 6, o.y - 98, o.x + 6, o.y - 98, o.x, o.y - 89);
      }
    } else if (o.k) {
      // enemigo
      const op = { k: o.k, t: o.t, mv: o.mv, s: 1.5 * o.sc, fl: o.fl, a: o.st === 'w' ? 3 : o.st === 's' ? 1 : 0, r: 18, pg: o.st === 's' ? 1 - o.tm / 0.18 : undefined, hurt: o.st === 'h' };
      if (o.st === 'd') {
        if (o.tm > 0.25 || T % 0.1 < 0.05) {
          const dp = Math.min(1, (0.6 - o.tm) * 2.4);
          lay(g, o.x, o.y - 6 - Math.sin(dp * 3.14) * 36, o.f, op, o.f * dp * 7.85);
        }
      } else {
        man(g, o.x, o.y, o.f, op);
        if (o.boss || o.k === 'b') {
          g.fillStyle(0);
          g.fillRect(o.x - 31, o.y - 142, 62, 7);
          g.fillStyle(0xff4a4a);
          g.fillRect(o.x - 30, o.y - 141, clamp(o.hp / (o.mhp || EN.b.hp * (1 + wave * 0.06) * (wave / 5)), 0, 1) * 60, 5);
        }
        if (dark) {
          fx.fillStyle(o.k === 'b' ? 0xff5050 : WHT);
          fx.fillRect(o.x + o.f * 4 * o.sc - 1, o.y - 69 * o.sc, 3, 3);
          fx.fillRect(o.x + o.f * 9 * o.sc - 1, o.y - 69 * o.sc, 3, 3);
        }
      }
    } else if (o.t > 2 || T % 0.2 < 0.1) {
      // empanada
      const y = o.y - 10 + Math.sin(T * 5) * 3;
      g.fillStyle(0, 0.3);
      g.fillEllipse(o.x, o.y, 22, 6);
      g.fillStyle(0xe8a93a);
      g.fillEllipse(o.x, y, 24, 13);
      g.fillStyle(0xb5772a);
      for (let i = -2; i < 3; i++) g.fillRect(o.x + i * 4 - 1, y + 3, 2, 3);
    }
  }
  for (const o of PR) {
    if (o.ty === 'ar') {
      g.fillStyle(0xfff6c0, 0.5);
      g.fillCircle(o.x - o.vx * 0.03, o.y - o.vy * 0.03, 7);
      g.fillStyle(0xf3e3b0);
      g.fillCircle(o.x, o.y, 10);
      g.fillStyle(0xd9b25f);
      g.fillCircle(o.x, o.y, 5);
    } else if (o.ty === 'oil') {
      g.save();
      g.translateCanvas(o.x, o.y);
      g.rotateCanvas(o.rot);
      g.fillStyle(0x1a1a1a);
      g.fillRect(-10, -13, 20, 26);
      g.fillStyle(0x5a5a64);
      g.fillRect(-10, -8, 20, 3);
      g.fillRect(-10, 5, 20, 3);
      g.restore();
      g.fillStyle(0x0a0a10);
      g.fillCircle(o.x - 6, o.y + 16, 3);
      g.fillCircle(o.x + 4, o.y + 22, 2);
    } else if (o.ty === 'bu') {
      g.save();
      g.translateCanvas(o.x, o.y);
      g.rotateCanvas(o.rot);
      g.fillStyle(0xffe98a, 0.35);
      g.fillCircle(0, 0, 16);
      g.fillStyle(0xfff6c0);
      g.fillCircle(0, -3, 8);
      g.fillStyle(0xffffff);
      g.fillCircle(-2, -5, 3);
      g.fillStyle(0x8a8a94);
      g.fillRect(-4, 4, 8, 6);
      g.restore();
    } else {
      g.save();
      g.translateCanvas(o.x, o.y);
      g.rotateCanvas(o.rot);
      g.fillStyle(0x1f8f88);
      g.fillEllipse(0, 0, 58, 24);
      g.fillStyle(0x3bd1c6);
      g.fillEllipse(0, 0, 50, 18);
      g.lineStyle(4, 0xffe14a);
      g.lineBetween(16, 0, -6, -9);
      g.lineBetween(16, 0, -6, 9);
      g.restore();
    }
  }
  FXP = FXP.filter((p) => {
    p.t -= 1 / 60;
    const l = (0.2 - p.t) * 110;
    g.lineStyle(3, 0xfff06a);
    for (let i = 0; i < 4; i++) {
      const a = i * 1.57 + 0.6;
      g.lineBetween(p.x + Math.cos(a) * l * 0.4, p.y + Math.sin(a) * l * 0.4, p.x + Math.cos(a) * l, p.y + Math.sin(a) * l);
    }
    return p.t > 0;
  });
  // HUD
  hud.sc.setText(String(score).padStart(6, '0'));
  hud.wv.setText('OLEADA ' + Math.max(1, wave) + (dark ? '   ·   APAGÓN x2' : ''));
  hud.hi.setText('RÉCORD ' + Math.max(hi, score));
  hud.pa.setVisible(paused);
  const bs = E.filter((e) => e.boss && alive(e));
  for (let i = 0; i < 2; i++) {
    const b = bs[i];
    const t = hud['b' + i];
    t.setVisible(!!b);
    if (!b) continue;
    const y = 584 - i * 26;
    t.setText(EN[b.k].n).setY(y);
    hg.fillStyle(0, 0.75);
    hg.fillRect(298, y - 8, 304, 16);
    hg.fillStyle(0xff3030);
    hg.fillRect(300, y - 6, 300 * clamp(b.hp / b.mhp, 0, 1), 12);
  }
  for (let i = 0; i < 2; i++) {
    const p = P[i];
    hud['n' + i].setVisible(!!p);
    hud['u' + i].setVisible(!!p && p.ul >= 100 && !p.dead && T % 0.5 < 0.35);
    if (!p) continue;
    const x = i ? 584 : 16;
    hud['n' + i].setText('P' + (i + 1) + ' ' + p.ch.n + (p.dead ? ' (K.O.)' : ''));
    hg.fillStyle(0, 0.7);
    hg.fillRect(x - 2, 30, 204, 16);
    hg.fillRect(x - 2, 48, 204, 10);
    hg.fillStyle(p.hp / p.ch.hp > 0.3 ? 0x4ae04a : 0xff4a4a);
    hg.fillRect(x, 32, (200 * p.hp) / p.ch.hp, 12);
    hg.fillStyle(p.moto > 0 ? 0xff7a2a : p.ul >= 100 ? (T % 0.3 < 0.15 ? WHT : 0x5ee6ff) : 0x2a8ad8);
    hg.fillRect(x, 50, p.moto > 0 ? 40 * p.moto : 2 * p.ul, 6);
  }
}

let IG = { m: 0, t: 0, c: 0, y: 0 };

function iguana(g, dt) {
  const play = ph === 'play';
  if (!play && ph !== 'title') {
    IG.m = 0;
    return;
  }
  IG.c += dt;
  const cy = IG.c % 14;
  const ls = play ? L.s : cy < 10.5 ? 0 : cy < 11.9 ? 1 : 2;
  const lt = play ? L.t : 10.5 - cy;
  const px = POLES[1] - 5;
  if (ls === 0 && lt > 3.6) IG.m = 0;
  if (IG.m === 0 && ls === 0 && lt < 3.5) IG.m = 1;
  if (IG.m === 1 && ls !== 0) {
    IG.m = 2;
    IG.t = 0;
  }
  if (!IG.m || IG.m > 4) return;
  IG.t += dt;
  const dw = (x, y, rot, md) => {
    g.save();
    g.translateCanvas(x, y);
    g.rotateCanvas(rot);
    const sw = Math.sin(IG.c * 16) * 3;
    const C = (c, d) => g.fillStyle(md === 1 ? WHT : md === 2 ? d : c);
    if (md === 1) {
      g.fillStyle(0, 0.9);
      g.fillRect(-24, -12, 70, 26);
    }
    C(0x4fb04a, 0x1c1c1c);
    if (md !== 1) {
      g.fillEllipse(0, 0, 26, 9);
      g.fillEllipse(-15, -1, 11, 8);
      g.lineStyle(5, md === 2 ? 0x1c1c1c : 0x4fb04a);
      g.lineBetween(10, 0, 26, 3);
      g.lineStyle(3, md === 2 ? 0x1c1c1c : 0x4fb04a);
      g.lineBetween(26, 3, 38, 0);
      g.lineStyle(2, md === 2 ? 0x1c1c1c : 0x4fb04a);
      g.lineBetween(38, 0, 45, -4);
      C(0xa8e040, 0x3a3a3a);
      for (let i = 0; i < 6; i++) g.fillTriangle(-8 + i * 3.5, -4, -6.5 + i * 3.5, -10, -5 + i * 3.5, -4);
      g.lineStyle(2.5, md === 2 ? 0x1c1c1c : 0x2d7a2f);
      for (let i = 0; i < 4; i++) g.lineBetween(-8 + (i >> 1) * 15, 3, -8 + (i >> 1) * 15 + (i & 1 ? sw : -sw), 9);
      g.fillStyle(md === 2 ? 0x555555 : 0x111111);
      g.fillRect(-18, -4, 2, 2);
    } else {
      g.lineStyle(1.5, WHT);
      g.lineBetween(-12, -1, 45, -2);
      for (let i = 0; i < 6; i++) g.lineBetween(-8 + i * 3, -1, -6 + i * 3, 5);
      g.fillRect(-21, -5, 9, 7);
      g.fillStyle(0);
      g.fillRect(-18, -3, 3, 3);
      g.lineStyle(1.5, WHT);
      for (let i = 0; i < 4; i++) g.lineBetween(-8 + (i >> 1) * 15, 2, -8 + (i >> 1) * 15 + (i & 1 ? sw : -sw), 9);
    }
    g.restore();
  };
  const R = Math.random;
  if (IG.m === 1) {
    const u = clamp(lt / 3.5, 0, 1);
    dw(px + 295 * u, 104 + 72 * u * (1 - u) - 6, 0, 0);
  } else if (IG.m === 2) {
    const k = Math.floor(IG.t * 16) % 2;
    dw(px + R() * 4 - 2, 100 + R() * 3, 0, k ? 1 : 0);
    if (IG.t < 0.12) {
      g.fillStyle(WHT, 0.45 * (1 - IG.t / 0.12));
      g.fillRect(0, 0, W, H);
    }
    g.fillStyle(0xfff2a0, 0.5);
    g.fillCircle(px, 118, 8 + R() * 8);
    for (let i = 0; i < 5; i++) {
      const a = R() * 6.28;
      const l = 8 + R() * 26;
      g.lineStyle(2, pick([WHT, 0xffe14a, 0x9fe8ff]));
      g.lineBetween(px, 118, px + Math.cos(a) * l, 118 + Math.sin(a) * l);
    }
    g.lineStyle(2, 0x9fe8ff);
    let zx = px;
    let zy = 118;
    for (let i = 1; i < 4; i++) {
      const nx = px + R() * 10 - 5;
      const ny = 118 - i * 5;
      g.lineBetween(zx, zy, nx, ny);
      zx = nx;
      zy = ny;
    }
    if (IG.t > 1.2) {
      IG.m = 3;
      IG.t = 0;
      IG.y = 100;
      IG.v = 0;
    }
  } else if (IG.m === 3) {
    IG.v += 900 * dt;
    IG.y += IG.v * dt;
    dw(px, IG.y, Math.min(3.14, ((IG.y - 100) / 272) * 4.5), 2);
    if (IG.y >= 372) {
      IG.y = 372;
      IG.m = 4;
      IG.t = 0;
    }
  } else {
    dw(px, 372, 3.14, 2);
    for (let i = 0; i < 3; i++) {
      const p = (IG.t * 0.7 + i / 3) % 1;
      g.fillStyle(0x888890, 0.5 * (1 - p));
      g.fillCircle(px + Math.sin(p * 6 + i) * 5, 360 - p * 28, 2 + p * 5);
    }
    if (IG.t > 6) IG.m = 5;
  }
}

function drawFx() {
  iguana(fx, 1 / 60);
  SPK = SPK.filter((s) => {
    s.t -= 1 / 60;
    fx.lineStyle(2, Math.random() < 0.5 ? WHT : 0xffe14a);
    s.p.forEach((q) => fx.lineBetween(s.x + q[0], s.y + q[1], s.x + q[2], s.y + q[3]));
    fx.fillStyle(WHT);
    fx.fillCircle(s.x, s.y, 3);
    return s.t > 0;
  });
  if (ph === 'play' && L.s === 2 && L.fl > 0) {
    fx.lineStyle(3, 0xe8f0ff);
    let x = L.bx;
    let y = 0;
    while (y < 200) {
      const nx = x + rnd(-26, 26);
      const ny = y + rnd(18, 40);
      fx.lineBetween(x, y, nx, ny);
      x = nx;
      y = ny;
    }
  }
  // oscuridad con linternas de los jugadores
  const a = ph === 'play' ? L.a : 0;
  if (a > 0 || rtD) {
    rt.clear();
    rtD = a > 0;
    if (a > 0) {
      rt.fill(0x03040c, a);
      if (L.s === 2) P.forEach((p) => !p.dead && rt.erase(li, p.x, p.y - 40));
    }
  }
}

// ---------- Escena ----------

function create() {
  S = this;
  AC = S.sound && S.sound.context ? S.sound.context : null;
  bg = S.add.graphics();
  lg = S.add.graphics().setDepth(1);
  eg = S.add.graphics().setDepth(5);
  rt = S.add.renderTexture(0, 0, W, H).setOrigin(0).setDepth(50);
  fx = S.add.graphics().setDepth(60);
  hg = S.add.graphics().setDepth(70);
  ug = S.add.graphics().setDepth(79);
  drawBg();

  // textura de luz suave para "borrar" la oscuridad alrededor de los jugadores
  const ct = S.textures.createCanvas('lt', 280, 280);
  const c = ct.getContext();
  const gr = c.createRadialGradient(140, 140, 10, 140, 140, 140);
  gr.addColorStop(0, 'rgba(255,255,255,.9)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = gr;
  c.fillRect(0, 0, 280, 280);
  ct.refresh();
  li = S.make.image({ key: 'lt', add: false });

  hud.sc = txt(W / 2, 20, '000000', 26, '#ffffff', 1).setDepth(71);
  hud.wv = txt(W / 2, 46, '', 14, '#ffe14a', 1).setDepth(71);
  hud.hi = txt(W / 2, 64, '', 11, '#cfe8ff', 1).setDepth(71);
  hud.pa = txt(W / 2, 300, 'PAUSA', 60, '#ffffff', 1).setDepth(75);
  for (let i = 0; i < 2; i++) {
    hud['n' + i] = txt(i ? 784 : 16, 16, '', 14, PCOL[i], 1).setOrigin(i, 0.5).setDepth(71);
    hud['b' + i] = txt(292, 0, '', 15, '#ff8a8a', 1).setOrigin(1, 0.5).setDepth(71);
    hud['u' + i] = txt(i ? 784 : 16, 70, '¡ULTI LISTA! → B3', 13, '#5ee6ff', 1).setOrigin(i, 0.5).setDepth(71);
  }

  Promise.resolve().then(() => getStorage().get(HS_KEY)).then(readHi).catch(() => {});

  go('title');
}

function update(_, ms) {
  const dt = Math.min(ms, 50) / 1000;
  T += dt;
  eg.clear();
  fx.clear();
  hg.clear();
  ug.clear();
  if (ph === 'play') {
    if (hit.START1 && overT <= 0) paused = !paused;
    if (!paused) stepPlay(dt);
  } else {
    lg.visible = Math.random() > 0.015;
    if (ph === 'title') stepTitle();
    else if (ph === 'select') stepSelect(dt);
    else if (ph === 'name') stepName(dt);
    else stepOver();
  }
  if (ph === 'play') {
    E.forEach((e) => {
      if (e.st === 'w' && e.th === 2) {
        eg.fillStyle(0xff2020, 0.18 + 0.12 * Math.sin(T * 30));
        eg.fillRect(e.f > 0 ? e.x : 0, e.y - 20, e.f > 0 ? W - e.x : e.x, 40);
      }
    });
    OIL.forEach((o) => {
      eg.fillStyle(0x07070c, Math.min(1, o.t) * 0.9);
      eg.fillEllipse(o.x, o.y, 104, 26);
      eg.fillStyle(0x5a3f8a, Math.min(1, o.t) * 0.45);
      eg.fillEllipse(o.x - 16, o.y - 4, 34, 6);
    });
    drawPlay();
  }
  drawFx();
  for (const k in hit) delete hit[k];
}
})();
