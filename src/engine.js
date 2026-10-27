/* Motor del cubo: estado por pegatinas (posición + normal + color). Ejes: x→derecha (R), y→arriba (U), z→frente (F). */
var Cube = (function () {
  var FACE_N = { U: [0, 1, 0], D: [0, -1, 0], R: [1, 0, 0], L: [-1, 0, 0], F: [0, 0, 1], B: [0, 0, -1] };
  var FACE_ORDER = ['U', 'R', 'F', 'D', 'L', 'B'];
  var MOVES = {
    R: { a: 0, l: [1], d: -1 }, L: { a: 0, l: [-1], d: 1 }, M: { a: 0, l: [0], d: 1 },
    r: { a: 0, l: [0, 1], d: -1 }, l: { a: 0, l: [-1, 0], d: 1 }, x: { a: 0, l: [-1, 0, 1], d: -1 },
    U: { a: 1, l: [1], d: -1 }, D: { a: 1, l: [-1], d: 1 }, E: { a: 1, l: [0], d: 1 },
    u: { a: 1, l: [0, 1], d: -1 }, d: { a: 1, l: [-1, 0], d: 1 }, y: { a: 1, l: [-1, 0, 1], d: -1 },
    F: { a: 2, l: [1], d: -1 }, B: { a: 2, l: [-1], d: 1 }, S: { a: 2, l: [0], d: -1 },
    f: { a: 2, l: [0, 1], d: -1 }, b: { a: 2, l: [-1, 0], d: 1 }, z: { a: 2, l: [-1, 0, 1], d: -1 }
  };
  function rot(v, a, d) {
    var x = v[0], y = v[1], z = v[2];
    if (a === 0) return d < 0 ? [x, z, -y] : [x, -z, y];
    if (a === 1) return d < 0 ? [-z, y, x] : [z, y, -x];
    return d < 0 ? [y, -x, z] : [-y, x, z];
  }
  function solved() {
    var st = [];
    FACE_ORDER.forEach(function (f) {
      var n = FACE_N[f];
      for (var x = -1; x <= 1; x++) for (var y = -1; y <= 1; y++) for (var z = -1; z <= 1; z++) {
        if (x * n[0] + y * n[1] + z * n[2] === 1) st.push({ p: [x, y, z], n: n.slice(), c: f });
      }
    });
    return st;
  }
  function clone(st) { return st.map(function (s) { return { p: s.p.slice(), n: s.n.slice(), c: s.c }; }); }
  /* alg → [{b:'R', t:1|2|3}]  (t = cuartos de giro en el sentido base) */
  function parse(alg) {
    var out = [], re = /([RLUDFBMESrludfbxyz])(w?)(['’]?)([23]?)(['’]?)/g, m;
    var s = String(alg || '').replace(/[()\[\]]/g, ' ');
    while ((m = re.exec(s))) {
      var b = m[1];
      if (m[2]) b = b.toLowerCase();
      var t = m[4] ? parseInt(m[4], 10) : 1;
      if (m[3] || m[5]) t = (4 - t) % 4;
      if (t) out.push({ b: b, t: t });
    }
    return out;
  }
  function tok(m) { return m.b + (m.t === 2 ? '2' : m.t === 3 ? "'" : ''); }
  function str(ms) { return ms.map(tok).join(' '); }
  function invert(ms) { return ms.slice().reverse().map(function (m) { return { b: m.b, t: (4 - m.t) % 4 }; }); }
  function applyMove(st, m) {
    var def = MOVES[m.b];
    for (var k = 0; k < m.t; k++) {
      for (var i = 0; i < st.length; i++) {
        var s = st[i];
        if (def.l.indexOf(s.p[def.a]) >= 0) { s.p = rot(s.p, def.a, def.d); s.n = rot(s.n, def.a, def.d); }
      }
    }
    return st;
  }
  function apply(st, ms) { if (typeof ms === 'string') ms = parse(ms); ms.forEach(function (m) { applyMove(st, m); }); return st; }
  function key(p, n) { return p.join(',') + '|' + n.join(','); }
  function index(st) { var o = {}; st.forEach(function (s) { o[key(s.p, s.n)] = s.c; }); return o; }
  var SLOTS = solved().map(function (s) { return key(s.p, s.n); });
  function serialize(st) { var ix = index(st); return SLOTS.map(function (k) { return ix[k]; }).join(''); }
  var SOLVED_STR = serialize(solved());
  function faceOfNormal(n) { for (var f in FACE_N) { var v = FACE_N[f]; if (v[0] === n[0] && v[1] === n[1] && v[2] === n[2]) return f; } }
  function centersOk(st) { return st.every(function (s) { return (Math.abs(s.p[0]) + Math.abs(s.p[1]) + Math.abs(s.p[2]) !== 1) || s.c === faceOfNormal(s.n); }); }
  function f2lOk(st) { return st.every(function (s) { return s.p[1] > 0 || s.c === faceOfNormal(s.n); }); }
  function topOriented(st) { return st.every(function (s) { return s.n[1] !== 1 || s.c === 'U'; }); }
  var ORIENTS = (function () {
    var res = [], seen = {};
    ['', 'x', 'x2', "x'", 'z', "z'"].forEach(function (a) {
      ['', 'y', 'y2', "y'"].forEach(function (b) {
        var s = (a + ' ' + b).trim(), k = serialize(apply(solved(), s));
        if (!seen[k]) { seen[k] = 1; res.push(s); }
      });
    });
    return res;
  })();
  /* Estado del caso: el cubo (centros estándar) que el algoritmo deja resuelto. pre/post = ajustes de U opcionales */
  function caseState(alg, pre, post) {
    var inv = invert(parse(alg));
    for (var i = 0; i < ORIENTS.length; i++) {
      var st = solved();
      if (pre) apply(st, pre);
      apply(st, ORIENTS[i]); apply(st, inv);
      if (centersOk(st)) { if (post) apply(st, post); return { state: st, prefix: ORIENTS[i] }; }
    }
    return null;
  }
  function ollSig(st) {
    var pts = st.filter(function (s) { return s.p[1] === 1 && s.c === 'U' && !(s.p[0] === 0 && s.p[2] === 0); });
    var best = null, all = {};
    for (var k = 0; k < 4; k++) {
      var sig = pts.map(function (s) {
        var p = s.p, n = s.n;
        for (var j = 0; j < k; j++) { p = rot(p, 1, -1); n = rot(n, 1, -1); }
        return key(p, n);
      }).sort().join(';');
      all[sig] = 1;
      if (best === null || sig < best) best = sig;
    }
    return { sig: best, count: Object.keys(all).length };
  }
  function pllSig(alg) {
    var best = null, all = {}, U = ['', 'U', 'U2', "U'"];
    for (var a = 0; a < 4; a++) for (var b = 0; b < 4; b++) {
      var cs = caseState(alg, U[a], U[b]); if (!cs) return null;
      var s = serialize(cs.state); all[s] = 1;
      if (best === null || s < best) best = s;
    }
    return { sig: best, count: Object.keys(all).length };
  }


  /* Convierte un algoritmo con giros de cubo (x y z), capas anchas (r u f…) y capas medias (M E S)
     en uno equivalente solo con caras, visto desde la posición inicial del cubo. */
  var EQ = { d: [['U', 1], ['y', 3]], u: [['D', 1], ['y', 1]], r: [['L', 1], ['x', 1]], l: [['R', 1], ['x', 3]], f: [['B', 1], ['z', 1]], b: [['F', 1], ['z', 3]],
    M: [['R', 1], ['L', 3], ['x', 3]], E: [['U', 1], ['D', 3], ['y', 3]], S: [['F', 3], ['B', 1], ['z', 1]] };
  function derotate(ms) {
    var map = { U: 'U', D: 'D', R: 'R', L: 'L', F: 'F', B: 'B' }, out = [];
    function rotate(b) {
      var def = MOVES[b], nm = {};
      for (var s in FACE_N) nm[faceOfNormal(rot(FACE_N[s], def.a, def.d))] = map[s];
      map = nm;
    }
    ms.forEach(function (m) {
      for (var k = 0; k < m.t; k++) {
        var seq = EQ[m.b] || [[m.b, 1]];
        seq.forEach(function (q) {
          for (var j = 0; j < q[1]; j++) {
            if ('xyz'.indexOf(q[0]) >= 0) rotate(q[0]);
            else out.push({ b: map[q[0]], t: 1 });
          }
        });
      }
    });
    return simplify(out);
  }
  function simplify(ms) {
    var r = [];
    ms.forEach(function (m) { var l = r[r.length - 1]; if (l && l.b === m.b) { l.t = (l.t + m.t) % 4; if (!l.t) r.pop(); } else r.push({ b: m.b, t: m.t }); });
    return r;
  }
  /* ---- F2L ---- */
  function posKey(p) { return p.join(','); }
  function piecesAt(st) { var m = {}; st.forEach(function (s) { var k = posKey(s.p); (m[k] = m[k] || []).push(s); }); return m; }
  function solvedAt(m, p) { return m[posKey(p)].every(function (s) { return s.c === faceOfNormal(s.n); }); }
  var CROSS = [[0, -1, 1], [0, -1, -1], [1, -1, 0], [-1, -1, 0]], DC = [[1, -1, 1], [-1, -1, 1], [-1, -1, -1], [1, -1, -1]], MID = [[1, 0, 1], [-1, 0, 1], [-1, 0, -1], [1, 0, -1]];
  function homeColors(p) { var c = []; if (p[1]) c.push(p[1] > 0 ? 'U' : 'D'); if (p[2]) c.push(p[2] > 0 ? 'F' : 'B'); if (p[0]) c.push(p[0] > 0 ? 'R' : 'L'); return c; }
  function findPiece(st, colors) {
    var m = piecesAt(st);
    for (var k in m) { var a = m[k]; if (a.length === colors.length && colors.every(function (c) { return a.some(function (s) { return s.c === c; }); })) { var s0 = a.filter(function (s) { return s.c === colors[0]; })[0]; return { p: s0.p, n: s0.n }; } }
  }
  function pieceSig(st, colors) { var f = findPiece(st, colors); return posKey(f.p) + '/' + posKey(f.n); }
  function uCanon(st, fn) { var best = null; ['', 'U', 'U2', "U'"].forEach(function (u) { var v = fn(apply(clone(st), u)); if (best === null || v < best) best = v; }); return best; }
  function checkF2L(alg, kind) {
    var cs = caseState(alg); if (!cs) return { ok: false, why: 'centros' };
    var end = apply(clone(cs.state), parse(alg)); if (!centersOk(end)) return { ok: false, why: 'centros' };
    var m = piecesAt(cs.state), me = piecesAt(end);
    function all(mm, list) { return list.every(function (p) { return solvedAt(mm, p); }); }
    var F2L = CROSS.concat(DC, MID);
    if (kind === 'f2l') {
      if (!all(m, CROSS.concat(DC.slice(1), MID.slice(1)))) return { ok: false, why: 'desarma otras piezas' };
      if (!all(me, F2L)) return { ok: false, why: 'no resuelve' };
      if (solvedAt(m, DC[0]) && solvedAt(m, MID[0])) return { ok: false, why: 'resuelto' };
      return { ok: true, cs: cs, sig: uCanon(cs.state, function (s) { return pieceSig(s, ['D', 'F', 'R']) + '|' + pieceSig(s, ['F', 'R']); }) };
    }
    if (kind === 'f2lc') {
      if (!all(m, CROSS.concat(DC.slice(1)))) return { ok: false, why: 'desarma otras piezas' };
      if (!all(me, CROSS.concat(DC))) return { ok: false, why: 'no resuelve' };
      if (solvedAt(m, DC[0])) return { ok: false, why: 'resuelto' };
      return { ok: true, cs: cs, sig: uCanon(cs.state, function (s) { return pieceSig(s, ['D', 'F', 'R']); }) };
    }
    /* f2le: una sola arista de la capa del medio fuera de su sitio */
    if (!all(m, CROSS.concat(DC))) return { ok: false, why: 'desarma la primera capa' };
    var off = MID.filter(function (p) { return !solvedAt(m, p); });
    if (off.length !== 1) return { ok: false, why: 'mueve otras aristas' };
    if (!all(me, F2L)) return { ok: false, why: 'no resuelve' };
    var hc = homeColors(off[0]).filter(function (c) { return c !== 'D' && c !== 'U'; });
    return { ok: true, cs: cs, target: off[0], sig: posKey(off[0]) + '#' + uCanon(cs.state, function (s) { return pieceSig(s, hc); }) };
  }
  /* Comprueba un algoritmo. kind: 'oll' | 'pll' | 'eo' (solo orienta aristas) */
  function check(alg, kind) {
    alg = str(derotate(parse(alg)));
    if (kind === 'f2l' || kind === 'f2lc' || kind === 'f2le') return checkF2L(alg, kind);
    var cs = caseState(alg);
    if (!cs) return { ok: false, why: 'centros' };
    if (!f2lOk(cs.state)) return { ok: false, why: 'f2l' };
    if (kind === 'eo') {
      var eoOk = cs.state.some(function (s) { return s.p[1] === 1 && s.n[1] === 1 && (Math.abs(s.p[0]) + Math.abs(s.p[2]) === 1) && s.c !== 'U'; });
      return { ok: eoOk, cs: cs, why: eoOk ? '' : 'no cambia aristas' };
    }
    if (kind === 'oll') {
      if (topOriented(cs.state)) return { ok: false, why: 'ya orientado' };
      var o = ollSig(cs.state); return { ok: true, cs: cs, sig: o.sig, count: o.count };
    }
    if (!topOriented(cs.state)) return { ok: false, why: 'no orientado' };
    if (serialize(cs.state) === SOLVED_STR) return { ok: false, why: 'resuelto' };
    var p = pllSig(alg); return { ok: true, cs: cs, sig: p.sig, count: p.count };
  }
  return { FACE_N: FACE_N, MOVES: MOVES, rot: rot, solved: solved, clone: clone, parse: parse, tok: tok, str: str, invert: invert,
    applyMove: applyMove, apply: apply, key: key, index: index, serialize: serialize, SOLVED_STR: SOLVED_STR, faceOfNormal: faceOfNormal,
    centersOk: centersOk, f2lOk: f2lOk, topOriented: topOriented, caseState: caseState, ollSig: ollSig, pllSig: pllSig, check: check, derotate: derotate, simplify: simplify, piecesAt: piecesAt, solvedAt: solvedAt, findPiece: findPiece, homeColors: homeColors, CROSS: CROSS, DC: DC, MID: MID };
})();
if (typeof module !== 'undefined') module.exports = Cube;
