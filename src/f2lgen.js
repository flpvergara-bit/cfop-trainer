/* Genera y verifica los casos de F2L. Candidatos de memoria primero; lo que falte, por búsqueda. */
/* Los 24 casos de la guía F2L reducida (myrubik.com): van en la etapa 1 */
const REDUCIDO = ["F2L-fa1", "F2L-fa2", "F2L-fa3", "F2L-fa4", "F2L-fa5", "F2L-fa6", "F2L-fa7", "F2L-fa8", "F2L-fc1", "F2L-fc10", "F2L-fc11", "F2L-fc2", "F2L-fc3", "F2L-fc4", "F2L-fc5", "F2L-fc6", "F2L-fc7", "F2L-fc8", "F2L-fc9", "F2L-fd1", "F2L-fd2", "F2L-fd3", "F2L-fd4", "F2L-fk1"];
const C = require('./engine.js');
const CANDS = [
"U R U' R'","U' F' U F","F' U' F","R U R'",
"U' R U R' U2 R U' R'","U F' U' F U2 F' U F","U' R U2 R' U2 R U' R'","U F' U2 F U2 F' U F",
"U' R U' R' U F' U' F","U' R U R' U R U R'","U' R U2 R' U F' U' F","U F' U F U' F' U' F",
"U' R U' R' U R U R'","U F' U' F U' F' U' F","U F' U F U F' U F","R U' R' U2 F' U' F","R U2 R' U' R U R'",
"F' U2 F U F' U' F","U R U2 R' U R U' R'","U' F' U2 F U' F' U F","U2 R U R' U R U' R'",
"U2 F' U' F U' F' U F","R U' R' U2 R U R'","F' U F U2 F' U' F","U R U' R' U' R U' R' U R U' R'",
"F U R U' R' F' R U' R'","U2 R2 U2 R' U' R U' R2","U' R' F R F' R U R'","U R U' R' F R' F' R",
"R U' R' U R U' R'","R U R' U' F R' F' R","F' U F U' F' U F","R U R' U' R U R'",
"R U' R' U' R U R' U2 R U' R'","R U R' U' R U R' U' R U R'","U' R U' R' U2 R U' R'","U R U R' U2 R U R'",
"R2 U2 F R2 F' U2 R' U R'","R U' R' U R U2 R' U R U' R'","R U R' U2 R U' R' U R U R'","R U' R' F' U2 F",
"R' D' R U' R' D R U R U' R'","U' R U R' U F' U' F","U F' U' F U' R U R'","R U' R' U F' U F",
"U2 R U' R' U' R U R'","R U2 R' U R U' R'","U R U' R' U' F' U F","U' F' U F U R U' R'",
"U F' U F U2 F' U F","U' R U' R' U2 R U' R'","U R U' R' U R U' R' U R U' R'","R U R' U R U' R'",
"F' U' F U F' U' F","R U' R' U R U' R' U R U' R'","U' R U R' U R U' R'","U F' U' F U' F' U F",
"R U R' U' R U R' U' R U R' U' R U R'","U' R U2 R' U R U R'","U F' U2 F U' F' U' F",
"R U' R' U' R U R' U' R U R'","R U' R' F' U' F","R U R' F R' F' R","U R U2 R' U2 R U' R'"
];
const kind = 'f2l', cases = {}, order = [];
for (const a of CANDS) {
  const r = C.check(a, kind);
  if (!r.ok) { console.log('  descartado:', a, '-', r.why); continue; }
  if (!cases[r.sig]) { cases[r.sig] = { sig: r.sig, algs: [], cs: r.cs }; order.push(r.sig); }
  if (!cases[r.sig].algs.includes(a)) cases[r.sig].algs.push(a);
}
console.log('casos cubiertos por candidatos:', order.length);
/* Enumerar los 41 casos posibles y buscar los que falten */
const SL = C.solved().map(s => C.key(s.p, s.n));
const IDX = {}; SL.forEach((k, i) => IDX[k] = i);
const MOVES = [];
['U', 'R', 'F', 'D', 'L'].forEach(b => [1, 2, 3].forEach(t => {
  const st = C.solved(); st.forEach((s, i) => s.id = IDX[C.key(s.p, s.n)]);
  C.applyMove(st, { b, t }); const fwd = new Array(54);
  st.forEach(s => fwd[s.id] = IDX[C.key(s.p, s.n)]);
  MOVES.push({ b, t, fwd });
}));
const colorsOf = st => { const ix = C.index(st); return SL.map(k => ix[k]); };
const GOAL = SL.map((k, i) => { const [p, n] = k.split('|').map(v => v.split(',').map(Number)); return p[1] <= 0 ? i : -1; }).filter(i => i >= 0);
const SOLVED = colorsOf(C.solved());
function search(startState, faces, maxD) {
  const start = colorsOf(startState);
  const ms = MOVES.filter(m => faces.includes(m.b));
  const sols = [];
  function f2l(a) { for (const i of GOAL) if (a[i] !== SOLVED[i]) return false; return true; }
  function dfs(a, depth, last, path) {
    if (depth === 0) { if (f2l(a)) sols.push(path.slice()); return; }
    for (const m of ms) {
      if (m.b === last) continue;
      const b = new Array(54); for (let i = 0; i < 54; i++) b[m.fwd[i]] = a[i];
      path.push(m); dfs(b, depth - 1, m.b, path); path.pop();
    }
  }
  for (let d = 1; d <= maxD; d++) { dfs(start, d, '', []); if (sols.length) return sols.map(p => C.str(p)); }
  return [];
}
/* Todos los estados posibles de la pareja: generados aplicando secuencias cortas desde resuelto */
const all = {};
(function gen() {
  const seeds = [''];
  const pre = ["", "R U R'", "R U' R'", "R U2 R'", "F' U F", "F' U' F", "F' U2 F", "R U R' U' R U R'", "R' F R F'", "R U' R' U R U' R'", "F R' F' R", "R U2 R' U R U' R'", "R U R' U2 R U R'", "F' U' F U F' U' F", "R' F R F' R U R'", "R U R' F R' F' R"];
  for (const a of pre) for (const b of pre) for (const u of ['', 'U', 'U2', "U'"]) {
    const alg = (a + ' ' + u + ' ' + b).trim(); if (!alg) continue;
    const inv = C.str(C.invert(C.parse(alg)));
    const r = C.check(inv, kind); if (r.ok && !all[r.sig]) all[r.sig] = inv;
  }
})();
console.log('casos posibles encontrados:', Object.keys(all).length, '(esperado 41)');
for (const sig of Object.keys(all)) {
  if (cases[sig]) continue;
  const st = C.caseState(all[sig]).state;
  let sols = search(st, ['U', 'R', 'F'], 10);
  if (!sols.length) sols = search(st, ['U', 'R', 'F', 'D', 'L'], 9);
  const score = a => { const m = C.parse(a); return m.length + m.filter(x => x.b === 'F').length * 0.4 + m.filter(x => x.t === 2).length * 0.3 + m.filter(x => 'DL'.includes(x.b)).length; };
  sols.sort((x, y) => score(x) - score(y));
  console.log('  buscado', sig, '→', sols.slice(0, 3).join('  ||  '));
  const r = C.check(sols[0], kind);
  cases[sig] = { sig, algs: sols.slice(0, 2), cs: r.cs, buscado: true }; order.push(sig);
}
/* Agrupar */
const groups = { fd: [], fa: [], fc: [], fe: [], fk: [], fh: [] };
for (const sig of order) {
  const c = cases[sig], st = c.cs.state;
  const m = C.piecesAt(st), corner = C.findPiece(st, ['D', 'F', 'R']), edge = C.findPiece(st, ['F', 'R']);
  const cUp = corner.p[1] === 1, eUp = edge.p[1] === 1;
  const len = C.parse(c.algs[0]).length;
  let g;
  if (cUp && eUp) g = len <= 4 ? 'fd' : (corner.n[1] === 1 ? 'fa' : 'fc');
  else if (cUp && !eUp) g = 'fe';
  else if (!cUp && eUp) g = 'fk';
  else g = 'fh';
  c.g = g; groups[g].push(c);
}
const NAMES = { fd: 'Directo', fa: 'Blanco arriba', fc: 'Al costado', fe: 'Arista abajo', fk: 'Esquina abajo', fh: 'En el hueco' };
const out = [];
for (const g of Object.keys(groups)) {
  groups[g].sort((a, b) => C.parse(a.algs[0]).length - C.parse(b.algs[0]).length);
  groups[g].forEach((c, i) => out.push({ id: 'F2L-' + g + (i + 1), set: 'F2L', name: NAMES[g] + ' ' + (i + 1), g, e: REDUCIDO.indexOf('F2L-' + g + (i + 1)) >= 0 ? 1 : 4, a: c.algs[0], alt: c.algs.slice(1, 3), buscado: !!c.buscado }));
  console.log(g, groups[g].length);
}
/* Principiante */
const simp = a => { const r = []; C.parse(a).forEach(m => { const l = r[r.length - 1]; if (l && l.b === m.b) { l.t = (l.t + m.t) % 4; if (!l.t) r.pop(); } else r.push({ b: m.b, t: m.t }); }); return C.str(r); };
const BEG = [
  { id: 'F2Lb-c1', name: 'Esquina · blanco a la derecha', g: 'f2lc', k: 'f2lc', a: "R U R'" },
  { id: 'F2Lb-c2', name: 'Esquina · blanco al frente', g: 'f2lc', k: 'f2lc', a: "F' U' F", alt: ["U R U' R'"] },
  { id: 'F2Lb-c3', name: 'Esquina · blanco arriba', g: 'f2lc', k: 'f2lc', a: "R U2 R' U' R U R'" },
  { id: 'F2Lb-c4', name: 'Esquina abajo · blanco a la derecha', g: 'f2lc', k: 'f2lc', a: "R U R' U' R U R'" },
  { id: 'F2Lb-c5', name: 'Esquina abajo · blanco al frente', g: 'f2lc', k: 'f2lc', a: "R U' R' U R U' R'" },
  { id: 'F2Lb-e1', name: 'Arista hacia la derecha', g: 'f2le', k: 'f2le', a: "U R U' R' U' F' U F" },
  { id: 'F2Lb-e2', name: 'Arista hacia la izquierda', g: 'f2le', k: 'f2le', a: "U' L' U L U F U' F'" },
  { id: 'F2Lb-e3', name: 'Arista girada en su hueco', g: 'f2le', k: 'f2le', a: simp("U R U' R' U' F' U F U2 U R U' R' U' F' U F") }
];
const sigs = {};
for (const b of BEG) {
  const r = C.check(b.a, b.k); if (!r.ok) throw new Error(b.id + ' ' + r.why);
  if (sigs[r.sig]) throw new Error('dup ' + b.id); sigs[r.sig] = 1;
  (b.alt || []).forEach(x => { const q = C.check(x, b.k); if (!q.ok || q.sig !== r.sig) throw new Error('alt ' + b.id + ' ' + x); });
  out.unshift(Object.assign({ set: 'F2Lb', e: 1, alt: b.alt || [] }, b));
}
const beg = out.filter(c => c.set === 'F2Lb').reverse(), adv = out.filter(c => c.set === 'F2L');
require('fs').writeFileSync(require('path').join(__dirname, 'f2l-data.js'), '/* Generado por f2lgen.js: todos verificados en el simulador */\nvar F2L_CASES = ' + JSON.stringify(beg.concat(adv).map(c => { const o = { id: c.id, set: c.set, name: c.name, g: c.g, e: c.e, a: c.a }; if (c.alt && c.alt.length) o.alt = c.alt; if (c.k) o.k = c.k; return o; }), null, 1) + ';\nif (typeof module !== "undefined") module.exports = F2L_CASES;\n');
console.log('total', beg.length, '+', adv.length, '| buscados:', adv.filter(c => c.buscado).map(c => c.id + ' ' + c.a).join(' ; '));
