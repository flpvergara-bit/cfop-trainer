(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function h(tag, attrs, kids) {
    var e = document.createElement(tag), k;
    if (attrs) for (k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v);
    }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  var ICON = {
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>',
    pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg>',
    prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.5 2.5v11L4 8z"/></svg>',
    next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.5v11L12 8z"/></svg>',
    reset: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2.5h2v11H3zM13.5 2.5v11L6 8z"/></svg>',
    luna: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.2 1.3a6.8 6.8 0 1 0 8.5 8.5A5.6 5.6 0 0 1 6.2 1.3z"/></svg>',
    sol: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.2"/><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M8 .8v2.2M8 13v2.2M.8 8H3M13 8h2.2M2.9 2.9l1.6 1.6M11.5 11.5l1.6 1.6M2.9 13.1l1.6-1.6M11.5 4.5l1.6-1.6"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.3 2.2 8 6.9l4.7-4.7 1.1 1.1L9.1 8l4.7 4.7-1.1 1.1L8 9.1l-4.7 4.7-1.1-1.1L6.9 8 2.2 3.3z"/></svg>'
  };

  /* ---------- Contenido ---------- */
  var STAGES = [
    { n: 1, t: 'F2L principiante', sub: '8 casos · repaso',
      how: 'Es el método por capas que ya conoces, para repasarlo y tomarte el tiempo. <strong>Primero las esquinas blancas:</strong> pon la esquina justo encima de su lugar (adelante a la derecha) y mira hacia dónde apunta el blanco. Si dudas, repite R U R\' U\' hasta que entre: con 1, 3 o 5 repeticiones queda bien.<br><strong>Después las aristas del medio:</strong> gira la capa de arriba hasta que el color del frente de la arista coincida con su centro. El color de arriba de la arista te dice si va a la derecha o a la izquierda.' },
    { n: 2, t: 'OLL en 2 pasos', sub: '10 algoritmos',
      how: '<strong>Paso A, la cruz.</strong> Mira solo las cuatro aristas de arriba: verás un punto, una L o una línea. Uno de los 3 primeros algoritmos te deja la cruz amarilla.<br><strong>Paso B, las esquinas.</strong> Con la cruz hecha quedan 7 casos. Cuenta cuántas esquinas tienen el amarillo arriba: ninguna, una o dos.' },
    { n: 3, t: 'PLL en 2 pasos', sub: '6 algoritmos',
      how: '<strong>Paso A, las esquinas.</strong> Busca un lado donde las dos esquinas sean del mismo color («faros»). Si existe, déjalo a la izquierda y haz la T. Si ningún lado tiene faros, haz la Y desde cualquier ángulo.<br><strong>Paso B, las aristas.</strong> Con las esquinas en su sitio quedan 4 casos: Ua, Ub, H y Z.' },
    { n: 4, t: 'F2L completo', sub: '41 casos',
      how: 'En vez de meter primero la esquina y después la arista, las juntas arriba y entran en un solo paso. Son 41 casos, pero se entienden más de lo que se memorizan: casi todos juntan la pareja arriba y la meten con R U R\' o con F\' U\' F. Mira cada uno animado y busca esa idea.<br><strong>Orden sugerido:</strong> Directo, Blanco arriba y Al costado, que son los que más salen; después los casos con piezas metidas en el hueco. <strong>Para los otros tres huecos</strong>, gira el cubo (y) hasta dejar el hueco adelante a la derecha. Y haz la cruz con el blanco abajo: así empiezas el F2L sin girar el cubo.' },
    { n: 5, t: 'PLL completo', sub: 'los 15 restantes',
      how: 'Con los 21 casos resuelves la permutación con un solo algoritmo en vez de dos. <strong>Orden sugerido:</strong> Jb (comparte casi todo con la T), Ja, Aa y Ab, luego Ra, Rb, F y V. Deja las cuatro G y las dos N para el final.' },
    { n: 6, t: 'OLL completo', sub: 'los 50 restantes',
      how: 'Son muchos, así que avanza por formas y no por número. <strong>Empieza por las cortas:</strong> T, cuadrados y P. Deja los puntos para el final. Mientras tanto, lo que no sepas se resuelve con los 2 pasos de la etapa 2.' }
  ];
  var GROUPS = {
    f2lc: ['Esquinas de la primera capa', 'Pon la esquina justo encima de su lugar, adelante a la derecha.'],
    f2le: ['Aristas de la capa del medio', 'El color del frente de la arista debe coincidir con el centro del frente.'],
    fd: ['Directo', 'Se resuelven en 3 o 4 movimientos.'],
    fa: ['Blanco arriba', 'Esquina y arista arriba; la esquina tiene el blanco mirando hacia arriba.'],
    fc: ['Al costado', 'Esquina y arista arriba; la esquina tiene el blanco mirando hacia un costado.'],
    fe: ['Arista abajo', 'La arista ya está en su hueco y la esquina está arriba.'],
    fk: ['Esquina abajo', 'La esquina ya está en su hueco y la arista está arriba.'],
    fh: ['En el hueco', 'Las dos piezas están en su hueco, pero mal colocadas.'],
    cruz2: ['Paso A · hacer la cruz', 'Solo importan las aristas. Las esquinas, marcadas con trama, pueden estar de cualquier forma.'],
    cruz: ['Paso B · cruz hecha, orientar esquinas', 'Las cuatro aristas ya tienen el amarillo arriba.'],
    t: ['Forma de T', ''], cuadrado: ['Cuadrado', ''], p: ['Forma de P', ''], c: ['Forma de C', ''], w: ['Forma de W', ''],
    esquinas: ['Esquinas ya orientadas', 'Solo faltan aristas.'], pez: ['Pez', ''], i: ['Línea (forma de I)', ''],
    caballo: ['Salto de caballo', ''], rayo: ['Rayo', ''], l: ['L pequeña', ''], incomodo: ['Formas incómodas', ''],
    punto: ['Punto', 'Ninguna arista tiene el amarillo arriba.'],
    adyacente: ['Intercambio de esquinas vecinas', 'Hay un lado con las dos esquinas del mismo color.'],
    diagonal: ['Intercambio de esquinas en diagonal', 'Ningún lado tiene las dos esquinas del mismo color.'],
    aristas: ['Solo aristas', 'Las cuatro esquinas ya están en su sitio.'],
    esquinasp: ['Solo esquinas', 'Las cuatro aristas ya están en su sitio.']
  };
  var GROUP_ORDER = ['f2lc', 'f2le', 'fd', 'fa', 'fc', 'fe', 'fk', 'fh', 'cruz2', 'cruz', 'adyacente', 'diagonal', 'aristas', 'esquinasp', 't', 'cuadrado', 'p', 'c', 'w', 'esquinas', 'pez', 'i', 'caballo', 'rayo', 'l', 'incomodo', 'punto'];
  var ESTADO = ['Sin empezar', 'Aprendiendo', 'Dominado'];
  /* Movimientos con nombre de la comunidad. El usuario puede editar la lista en Personalizar. */
  var TRIG_DEF = [
    { n: 'Sexy move', a: "R U R' U'", d: 'El más común de todos.' },
    { n: 'Sexy inverso', a: "U R U' R'", d: 'El sexy move al revés.' },
    { n: 'Sexy zurdo', a: "L' U' L U", d: 'El espejo del sexy move, con la mano izquierda.' },
    { n: 'Sexy ancho', a: "r U R' U'", d: 'Igual que el sexy, empezando con r.' },
    { n: 'Sledgehammer', a: "R' F R F'", d: 'El «martillo».' },
    { n: 'Hedgeslammer', a: "F R' F' R", d: 'El sledgehammer al revés.' },
    { n: 'Sune', a: "R U R' U R U2 R'", d: 'OLL 27 completo; aparece dentro de muchos otros.' },
    { n: 'Antisune', a: "R U2 R' U' R U' R'", d: 'OLL 26 completo; el Sune al revés.' },
    { n: 'Niklas', a: "R U' L' U R' U' L", d: 'Mueve tres esquinas de la capa de arriba.' }
  ];
  var TRIG = [];
  function trigList() { return store.prefs.trigs || TRIG_DEF.map(function (t) { return { n: t.n, a: t.a }; }); }
  function trigValid(t) { var ms = Cube.parse(t.a); return t.n && t.n.trim() && ms.length >= 2 && ms.length <= 30; }
  function rebuildTrig() {
    TRIG = store.prefs.trigOn === false ? [] : trigList().filter(trigValid).map(function (t) { return { k: Cube.str(Cube.parse(t.a)).split(' '), n: t.n.trim() }; })
      .sort(function (x, y) { return y.k.length - x.k.length; });
  }
  function trigOf(toks) { for (var t = 0; t < TRIG.length; t++) if (TRIG[t].k.join(' ') === toks.join(' ')) return TRIG[t]; return null; }

  var BY_ID = {};
  CASES = F2L_CASES.concat(CASES);
  function isF2L(c) { return c.kind === 'f2l' || c.kind === 'f2lc' || c.kind === 'f2le'; }
  CASES.forEach(function (c) {
    c.kind = c.set === 'F2L' ? 'f2l' : c.set === 'F2Lb' ? c.k : c.set === 'EO' ? 'eo' : (c.id.indexOf('OLL') === 0 ? 'oll' : 'pll');
    c.label = c.kind === 'oll' ? 'OLL ' + c.id.slice(3) : c.kind === 'pll' ? 'PLL ' + c.id : c.name;
    c.short = c.kind === 'oll' ? c.id.slice(3) : c.kind === 'pll' ? c.id : c.name.replace('Cruz · ', '');
    var r = Cube.check(c.a, c.kind);
    c.sig = r.sig || null;
    c.freq = c.kind === 'oll' ? Math.round(216 / r.count) : c.kind === 'pll' ? Math.round(288 / r.count) : 0;
    BY_ID[c.id] = c;
  });
  /* Guías impresas: cada algoritmo válido se asocia a su caso; si es nuevo, entra como alternativa */
  function normA(x) { return Cube.str(Cube.parse(x)); }
  var GUIA_FALLIDOS = [];
  GUIAS.forEach(function (g) {
    g.algs.forEach(function (x) {
      var r = Cube.check(x, g.kind), c = r.ok && CASES.filter(function (k) { return k.kind === g.kind && k.sig === r.sig; })[0];
      if (!c) { GUIA_FALLIDOS.push(x); return; }
      c.guia = c.guia || {}; c.guia[normA(x)] = g.name;
      if ([c.a].concat(c.alt || []).map(normA).indexOf(normA(x)) < 0) (c.alt = c.alt || []).push(x);
    });
  });
  (function () { /* errata de la guía F2L: el algoritmo impreso desarma otras piezas */
    var ok = "U' R U2 R' U F' U' F", r = Cube.check(ok, 'f2l'), c = CASES.filter(function (k) { return k.kind === 'f2l' && k.sig === r.sig; })[0];
    if (c) { c.guia = c.guia || {}; c.guia[normA(ok)] = 'F2L reducido'; c.guiaNota = "En la guía impresa aparece como U' R' U2 R U F' U' F, pero así desarma otras piezas. Esta es la versión que funciona: cambia R' U2 R por R U2 R'."; }
  })();
  function guiaDe(c, alg) { return c.guia && c.guia[normA(alg)] || ''; }
  function guiaTag(c, alg) { var g = guiaDe(c, alg); return g ? h('span', { class: 'guia', title: 'Algoritmo de tu guía ' + g, text: 'Guía' }) : null; }

  /* ---------- Progreso (navegador + cuenta) ---------- */
  var LS_KEY = 'ollpll.progreso.v1';
  var store = { v: 1, cases: {}, prefs: { speed: 420, auf: false, set: '', tema: 'auto', marca: { k: 'none', txt: '', img: '' } }, updatedAt: 0 };
  function limpiaTxt(t) { return String(t || '').replace(/["\\<>\u0000-\u001f]/g, '').trim().slice(0, 4); }
  function normalize(o) {
    var out = { v: 1, cases: {}, prefs: { speed: 420, auf: false, set: '', tema: 'auto', marca: { k: 'none', txt: '', img: '' } }, updatedAt: +o.updatedAt || 0 };
    if (o.prefs) { out.prefs.speed = [0, 240, 420, 620, 900].indexOf(+o.prefs.speed) >= 0 ? +o.prefs.speed : 420; out.prefs.auf = !!o.prefs.auf; out.prefs.set = String(o.prefs.set || ''); out.prefs.tema = o.prefs.tema === 'dark' || o.prefs.tema === 'light' ? o.prefs.tema : 'auto'; out.prefs.fcset = String(o.prefs.fcset || ''); out.prefs.estilo = ['base', 'crono', 'pop', 'mini'].indexOf(o.prefs.estilo) >= 0 ? o.prefs.estilo : 'base'; out.prefs.fcrot = !!o.prefs.fcrot; out.prefs.trigOn = o.prefs.trigOn !== false;
      out.prefs.trigs = Array.isArray(o.prefs.trigs) ? o.prefs.trigs.slice(0, 40).map(function (t) { return { n: String((t && t.n) || '').slice(0, 30), a: String((t && t.a) || '').slice(0, 120) }; }) : null;
      var mk = o.prefs.marca || {}, img = typeof mk.img === 'string' && mk.img.indexOf('data:image/') === 0 && mk.img.length < 200000 ? mk.img : '';
      out.prefs.marca = { k: /^(none|e[0-4]|txt|img)$/.test(mk.k) ? mk.k : 'none', txt: limpiaTxt(mk.txt), img: img }; }
    for (var id in (o.cases || {})) if (BY_ID[id]) {
      var p = o.cases[id] || {};
      out.cases[id] = { s: [0, 1, 2].indexOf(p.s) >= 0 ? p.s : 0, w: +p.w || 3, n: +p.n || 0, ok: +p.ok || 0, streak: +p.streak || 0,
        best: +p.best || 0, last: Array.isArray(p.last) ? p.last.slice(-12).map(Number) : [], alg: typeof p.alg === 'string' ? p.alg : '', grp: cleanGrp(p.grp) };
    }
    return out;
  }
  function loadLocal() { try { var s = localStorage.getItem(LS_KEY); if (s) store = normalize(JSON.parse(s)); } catch (e) { } }
  function saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) { } }
  function cleanGrp(g) {
    var o = {}; if (!g || typeof g !== 'object') return o;
    for (var k in g) if (Array.isArray(g[k])) { var v = g[k].map(Number).filter(function (x) { return x > 0 && x < 80 && x === Math.floor(x); }); if (v.length) o[k] = v.sort(function (x, y) { return x - y; }); }
    return o;
  }
  function P(id) { var p = store.cases[id] || (store.cases[id] = { s: 0, w: 3, n: 0, ok: 0, streak: 0, best: 0, last: [], alg: '', grp: {} }); if (!p.grp) p.grp = {}; return p; }
  function peek(id) { return store.cases[id] || { s: 0, w: 3, n: 0, ok: 0, streak: 0, best: 0, last: [], alg: '', grp: {} }; }
  /* Secciones propias del usuario: índices de corte (antes del movimiento i) para un algoritmo concreto */
  function cutsOf(c, alg) { var g = peek(c.id).grp; return (g && g[Cube.str(Cube.parse(alg))]) || null; }
  function setCuts(c, alg, cuts) { var p = P(c.id), k = Cube.str(Cube.parse(alg)); if (cuts && cuts.length) p.grp[k] = cuts.slice().sort(function (x, y) { return x - y; }); else delete p.grp[k]; touch(); }
  function algOf(c) { return peek(c.id).alg || c.a; }
  var remote = { doc: null, timer: 0, writing: false, dirty: false, retry: 0 };
  function setSync(s) {
    var el = $('#sync'); el.dataset.s = s;
    el.textContent = s === 'cloud' ? 'Progreso guardado en tu cuenta' : s === 'saving' ? 'Guardando…' : 'Progreso guardado en este navegador';
  }
  function touch() { store.updatedAt = Date.now(); saveLocal(); queueRemote(); }
  function queueRemote() { if (!remote.doc) return; remote.dirty = true; remote.retry = 0; clearTimeout(remote.timer); remote.timer = setTimeout(flush, 1500); }
  function flush() {
    if (!remote.doc || remote.writing || !remote.dirty) return;
    remote.writing = true; remote.dirty = false; setSync('saving');
    remote.doc.set(JSON.parse(JSON.stringify(store))).then(function () { setSync('cloud'); }, function (e) {
      if (e && e.code === 'unavailable' && remote.retry < 1) { remote.retry++; remote.dirty = true; setSync('cloud'); }
      else { remote.doc = null; setSync('local'); }
    }).then(function () {
      remote.writing = false;
      if (remote.dirty && remote.doc) { clearTimeout(remote.timer); remote.timer = setTimeout(flush, 2500); }
    });
  }
  function initRemote() {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function (r) {
      var db = r[0], user = r[1]; if (!db || !user) return;
      return user.id().then(function (id) {
        if (!id) return;
        var doc = db.doc('data/users/' + id + '/progreso');
        return doc.get().then(function (snap) {
          remote.doc = doc;
          var d = snap.exists ? snap.data() : null;
          if (d && d.cases && (+d.updatedAt || 0) >= (store.updatedAt || 0)) {
            if ((+d.updatedAt || 0) > (store.updatedAt || 0)) { store = normalize(JSON.parse(JSON.stringify(d))); saveLocal(); refreshAll(); }
          } else if (store.updatedAt) queueRemote();
          setSync('cloud');
        });
      });
    }).catch(function () { remote.doc = null; setSync('local'); });
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden && remote.dirty) { clearTimeout(remote.timer); flush(); } });

  /* ---------- Utilidades de algoritmos ---------- */
  function simplify(ms) {
    var out = [];
    ms.forEach(function (m) {
      var l = out[out.length - 1];
      if (l && l.b === m.b) { l.t = (l.t + m.t) % 4; if (!l.t) out.pop(); } else out.push({ b: m.b, t: m.t });
    });
    return out;
  }
  function inv1(m) { return { b: m.b, t: (4 - m.t) % 4 }; }
  function setupOf(alg, pre, post) {
    if (Cube.caseState(alg).prefix) alg = Cube.str(Cube.derotate(Cube.parse(alg)));   /* algoritmos con y, d…: mezcla sin girar el cubo */
    var cs = Cube.caseState(alg, pre, post);
    return { state: cs.state, prefix: cs.prefix, moves: simplify(Cube.parse(pre || '').concat(Cube.parse(cs.prefix), Cube.invert(Cube.parse(alg)), Cube.parse(post || ''))) };
  }
  /* Dibuja un algoritmo como movimientos; agrupa los gatillos conocidos. lead/tail = ajustes de U entre paréntesis */
  /* Bloques de gatillos conocidos: [{s, e, n}] */
  function trigBlocks(moves) {
    var toks = moves.map(Cube.tok), out = [], i = 0;
    while (i < moves.length) {
      var hit = null;
      for (var t = 0; t < TRIG.length && !hit; t++) {
        var k = TRIG[t].k, ok = i + k.length <= moves.length;
        for (var j = 0; ok && j < k.length; j++) if (toks[i + j] !== k[j]) ok = false;
        if (ok) hit = TRIG[t];
      }
      if (hit) { out.push({ s: i, e: i + hit.k.length, n: hit.n }); i += hit.k.length; } else i++;
    }
    return out;
  }
  function trigCuts(moves) {
    var cuts = [];
    trigBlocks(moves).forEach(function (b) { [b.s, b.e].forEach(function (x) { if (x > 0 && x < moves.length && cuts.indexOf(x) < 0) cuts.push(x); }); });
    return cuts.sort(function (x, y) { return x - y; });
  }
  function grpText(moves, cuts) {
    if (!cuts || !cuts.length) {
      var out = [], i = 0, bl = trigBlocks(moves), bi = 0;
      while (i < moves.length) { var b = bl[bi]; if (b && b.s === i) { out.push('(' + Cube.str(moves.slice(b.s, b.e)) + ')'); i = b.e; bi++; } else { out.push(Cube.tok(moves[i])); i++; } }
      return out.join(' ');
    }
    var parts = [], last = 0; cuts.concat([moves.length]).forEach(function (x) { parts.push(Cube.str(moves.slice(last, x))); last = x; });
    return parts.join('  ·  ');
  }
  function algoEl(moves, lead, tail, cuts) {
    var box = h('div', { class: 'algo' }), toks = moves.map(Cube.tok), i = 0, idx = 0, off = (lead || []).length;
    function mv(m, cls) { var s = h('span', { class: 'mv' + (cls ? ' ' + cls : ''), text: (cls ? '(' : '') + Cube.tok(m) + (cls ? ')' : '') }); s.dataset.i = idx++; return s; }
    (lead || []).forEach(function (m) { box.appendChild(mv(m, 'auf')); });
    if (cuts && cuts.length) {
      box.classList.add('con-grupos');
      var last = 0;
      cuts.concat([moves.length]).forEach(function (x, n) {
        if (x <= last) return;
        var tn = trigOf(toks.slice(last, x));
        var g = h('span', { class: 'grp' + (tn ? ' grp-trg' : ''), 'data-n': n + 1, 'data-s': last + off, 'data-e': x + off, title: 'Sección ' + (n + 1) + (tn ? ' · ' + tn.n : '') });
        for (var q = last; q < x; q++) g.appendChild(mv(moves[q]));
        if (tn) g.appendChild(h('span', { class: 'trg-n', text: tn.n }));
        box.appendChild(g); last = x;
      });
      i = moves.length;
    }
    var blocks = i < moves.length ? trigBlocks(moves) : [], bi = 0;
    while (i < moves.length) {
      var b = blocks[bi];
      if (b && b.s === i) {
        var g = h('span', { class: 'trg', title: b.n });
        for (var q = b.s; q < b.e; q++) g.appendChild(mv(moves[q]));
        g.appendChild(h('span', { class: 'trg-n', text: b.n }));
        box.appendChild(g); i = b.e; bi++;
      } else { box.appendChild(mv(moves[i])); i++; }
    }
    if (box.querySelector('.trg-n')) box.classList.add('con-nombres');
    (tail || []).forEach(function (m) { box.appendChild(mv(m, 'auf')); });
    return box;
  }

  /* ---------- Diagramas vistos desde arriba ---------- */
  function topData(st) {
    var ix = Cube.index(st), u = [], s = { B: [], R: [], F: [], L: [] }, x, z;
    for (z = -1; z <= 1; z++) for (x = -1; x <= 1; x++) u.push(ix[Cube.key([x, 1, z], [0, 1, 0])]);
    for (x = -1; x <= 1; x++) { s.B.push(ix[Cube.key([x, 1, -1], [0, 0, -1])]); s.F.push(ix[Cube.key([x, 1, 1], [0, 0, 1])]); }
    for (z = -1; z <= 1; z++) { s.R.push(ix[Cube.key([1, 1, z], [1, 0, 0])]); s.L.push(ix[Cube.key([-1, 1, z], [-1, 0, 0])]); }
    return { u: u, s: s };
  }
  function pllArrows(st) {
    var ix = Cube.index(st), mv = [], x, z;
    for (x = -1; x <= 1; x++) for (z = -1; z <= 1; z++) {
      if (!x && !z) continue;
      var hx = 0, hz = 0;
      if (x) { var a = Cube.FACE_N[ix[Cube.key([x, 1, z], [x, 0, 0])]]; hx += a[0]; hz += a[2]; }
      if (z) { var b = Cube.FACE_N[ix[Cube.key([x, 1, z], [0, 0, z])]]; hx += b[0]; hz += b[2]; }
      if (hx !== x || hz !== z) mv.push({ f: [x, z], t: [hx, hz] });
    }
    var out = '';
    mv.forEach(function (m, i) {
      var two = false, skip = false;
      mv.forEach(function (o, j) { if (o.f[0] === m.t[0] && o.f[1] === m.t[1] && o.t[0] === m.f[0] && o.t[1] === m.f[1]) { two = true; if (j < i) skip = true; } });
      if (skip) return;
      var x1 = 26 + (m.f[0] + 1) * 24, y1 = 26 + (m.f[1] + 1) * 24, x2 = 26 + (m.t[0] + 1) * 24, y2 = 26 + (m.t[1] + 1) * 24;
      var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, pad = 6, hd = 6;
      var ax = x1 + ux * pad, ay = y1 + uy * pad, bx = x2 - ux * pad, by = y2 - uy * pad;
      function head(px, py, sx, sy) {
        var qx = px - sx * hd, qy = py - sy * hd, nx = -sy * 3.1, ny = sx * 3.1;
        return '<polygon class="ah" points="' + [px, py, qx + nx, qy + ny, qx - nx, qy - ny].map(function (v) { return v.toFixed(1); }).join(' ') + '"/>';
      }
      var sx1 = two ? ax + ux * (hd - 1) : ax, sy1 = two ? ay + uy * (hd - 1) : ay;
      out += '<line class="ar" x1="' + sx1.toFixed(1) + '" y1="' + sy1.toFixed(1) + '" x2="' + (bx - ux * (hd - 1)).toFixed(1) + '" y2="' + (by - uy * (hd - 1)).toFixed(1) + '"/>' + head(bx, by, ux, uy);
      if (two) out += head(ax, ay, -ux, -uy);
    });
    return out;
  }
  /* F2L: deja en gris las piezas que no importan para el caso (los centros nunca) */
  function viewState(c, st) {
    if (!isF2L(c)) return st;
    var m = Cube.piecesAt(st), want = [];
    if (c.kind !== 'f2le') want.push(['D', 'F', 'R']);
    if (c.kind === 'f2l') want.push(['F', 'R']);
    if (c.kind === 'f2le') Cube.MID.forEach(function (p) { if (!Cube.solvedAt(m, p)) want.push(Cube.homeColors(p)); });
    var keep = {};
    want.forEach(function (cols) { var f = Cube.findPiece(st, cols); if (f) keep[f.p.join(',')] = 1; });
    var out = Cube.clone(st);
    out.forEach(function (s) {
      var k = s.p.join(','), n = Math.abs(s.p[0]) + Math.abs(s.p[1]) + Math.abs(s.p[2]);
      if (n < 2 || keep[k]) return;
      if (s.p[1] === 1 || (c.kind === 'f2lc' && s.p[1] === 0)) s.c = 'X';
    });
    return out;
  }
  function isoDiagram(c, st) {
    var cos = 0.866, o = '<svg class="dg" viewBox="-3 -3.15 6 6.3" role="img" aria-label="Diagrama de ' + c.label + ' en perspectiva">';
    function P(v) { return ((v[0] - v[2]) * cos).toFixed(3) + ',' + (-v[1] + (v[0] + v[2]) * 0.5).toFixed(3); }
    function quad(cen, u, v, k) { return [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(function (s) { return P([cen[0] + (u[0] * s[0] + v[0] * s[1]) * k, cen[1] + (u[1] * s[0] + v[1] * s[1]) * k, cen[2] + (u[2] * s[0] + v[2] * s[1]) * k]); }).join(' '); }
    var TAN = { '0,1,0': [[1, 0, 0], [0, 0, 1]], '1,0,0': [[0, 1, 0], [0, 0, 1]], '0,0,1': [[1, 0, 0], [0, 1, 0]] };
    ['0,1,0', '1,0,0', '0,0,1'].forEach(function (nk) { var n = nk.split(',').map(Number), t = TAN[nk]; o += '<polygon class="bg" points="' + quad([n[0] * 1.5, n[1] * 1.5, n[2] * 1.5], t[0], t[1], 1.56) + '"/>'; });
    st.forEach(function (s) {
      var nk = s.n.join(','); if (!TAN[nk]) return;
      var t = TAN[nk], cen = [s.p[0] + s.n[0] * 0.5, s.p[1] + s.n[1] * 0.5, s.p[2] + s.n[2] * 0.5];
      o += '<polygon class="c' + s.c + '" points="' + quad(cen, t[0], t[1], 0.43) + '"/>';
    });
    return o + '</svg>';
  }
  var dgCache = {};
  function diagram(c, alg, state) {
    var ck = c.id + '|' + alg;
    if (!state && dgCache[ck]) return dgCache[ck];
    if (isF2L(c)) { var iso = isoDiagram(c, viewState(c, state || Cube.caseState(alg).state)); if (!state) dgCache[ck] = iso; return iso; }
    var st = state || Cube.caseState(alg).state, d = topData(st), o = '<svg class="dg" viewBox="0 0 100 100" role="img" aria-label="Diagrama de ' + c.label + ' visto desde arriba"><rect class="bg" x="12" y="12" width="76" height="76" rx="6"/>';
    for (var i = 0; i < 9; i++) {
      var col = i % 3, row = (i - col) / 3, corner = col !== 1 && row !== 1;
      var cls = c.kind === 'pll' ? 'u' : (c.kind === 'eo' && corner) ? 'unk' : (d.u[i] === 'U' ? 'u' : 'off');
      o += '<rect class="' + cls + '" x="' + (15 + col * 24) + '" y="' + (15 + row * 24) + '" width="22" height="22" rx="3"/>';
    }
    [['B', 0], ['F', 1], ['L', 2], ['R', 3]].forEach(function (sd) {
      d.s[sd[0]].forEach(function (color, k) {
        if (c.kind !== 'pll' && color !== 'U') return;
        if (c.kind === 'eo' && k !== 1) return;
        var a = 15 + k * 24, cls = c.kind === 'pll' ? 'c' + color : 'u';
        if (sd[1] === 0) o += '<rect class="' + cls + '" x="' + a + '" y="2.5" width="22" height="6.5" rx="2"/>';
        if (sd[1] === 1) o += '<rect class="' + cls + '" x="' + a + '" y="91" width="22" height="6.5" rx="2"/>';
        if (sd[1] === 2) o += '<rect class="' + cls + '" x="2.5" y="' + a + '" width="6.5" height="22" rx="2"/>';
        if (sd[1] === 3) o += '<rect class="' + cls + '" x="91" y="' + a + '" width="6.5" height="22" rx="2"/>';
      });
    });
    if (c.kind === 'pll') o += pllArrows(st);
    o += '</svg>';
    if (!state) dgCache[ck] = o;
    return o;
  }
  var DIR = { '1,0,0': 'la derecha', '-1,0,0': 'la izquierda', '0,0,1': 'el frente', '0,0,-1': 'atrás', '0,1,0': 'arriba', '0,-1,0': 'abajo' };
  function f2lFacts(c, st) {
    var m = Cube.piecesAt(st), corner = Cube.findPiece(st, ['D', 'F', 'R']);
    var cTxt = corner.p[1] === 1 ? 'arriba, con el blanco hacia ' + DIR[corner.n.join(',')] : (Cube.solvedAt(m, Cube.DC[0]) ? 'en su hueco y bien colocada' : 'en su hueco pero girada, con el blanco hacia ' + DIR[corner.n.join(',')]);
    if (c.kind === 'f2lc') return 'Esquina blanca: ' + cTxt + '.';
    if (c.kind === 'f2le') {
      var tg = Cube.MID.filter(function (p) { return !Cube.solvedAt(m, p); })[0], ed = Cube.findPiece(st, Cube.homeColors(tg));
      if (ed.p[1] !== 1) return 'La arista está en su hueco, pero al revés. Sácala con el algoritmo de la derecha y vuelve a meterla.';
      return 'La arista va hacia ' + (tg[0] > 0 ? 'la derecha' : 'la izquierda') + ': su color de arriba coincide con el centro de ese lado.';
    }
    var edge = Cube.findPiece(st, ['F', 'R']), eTxt;
    if (edge.p[1] === 1) eTxt = 'arriba';
    else eTxt = Cube.solvedAt(m, Cube.MID[0]) ? 'en su hueco y bien colocada' : 'en su hueco pero al revés';
    var pair = '';
    if (corner.p[1] === 1 && edge.p[1] === 1) {
      var cs = m[corner.p.join(',')], es = m[edge.p.join(',')];
      var adj = Math.abs(corner.p[0] - edge.p[0]) + Math.abs(corner.p[2] - edge.p[2]) === 1;
      var match = adj && es.every(function (e) { return cs.some(function (k) { return k.n.join(',') === e.n.join(',') && k.c === e.c; }); });
      pair = match ? ' Ya están juntas formando la pareja: solo falta meterla.' : (adj ? ' Están juntas, pero no combinan: hay que separarlas y volver a juntarlas.' : ' Están separadas.');
    }
    return 'Esquina: ' + cTxt + '. Arista: ' + eTxt + '.' + pair;
  }
  function facts(c, alg) {
    if (isF2L(c)) return f2lFacts(c, Cube.caseState(alg).state);
    var d = topData(Cube.caseState(alg).state);
    if (c.kind === 'pll') {
      var bar = 0, far = 0, blo = 0;
      ['F', 'R', 'B', 'L'].forEach(function (k) { var s = d.s[k]; if (s[0] === s[1] && s[1] === s[2]) bar++; else if (s[0] === s[2]) far++; else if (s[0] === s[1] || s[1] === s[2]) blo++; });
      var parts = [];
      if (bar) parts.push(bar === 1 ? 'un lado completo de un solo color' : bar + ' lados completos');
      if (far) parts.push(far === 1 ? 'un lado con faros (esquinas iguales, arista distinta)' : far + ' lados con faros (esquinas iguales, arista distinta)');
      if (blo) parts.push(blo === 1 ? 'un bloque de 2 pegatinas iguales juntas' : blo + ' bloques de 2 pegatinas iguales juntas');
      return 'Mirando los lados de la última capa: ' + (parts.length ? parts.join(', ') : 'ningún par de pegatinas iguales juntas ni faros') + '.';
    }
    var e = [1, 3, 5, 7].filter(function (i) { return d.u[i] === 'U'; }).length, k = [0, 2, 6, 8].filter(function (i) { return d.u[i] === 'U'; }).length;
    if (c.kind === 'eo') return 'Arriba hay ' + (e === 0 ? 'ninguna arista amarilla' : e + ' aristas amarillas') + '. Las esquinas no importan en este paso.';
    return 'Amarillo arriba: ' + e + (e === 1 ? ' arista' : ' aristas') + ' y ' + k + (k === 1 ? ' esquina' : ' esquinas') + ', además del centro.';
  }

  /* ---------- Cubo 3D ---------- */
  var MK_R = { F: [1, 0, 0], B: [-1, 0, 0], R: [0, 0, -1], L: [0, 0, 1], U: [1, 0, 0], D: [1, 0, 0] };
  var MK_UP = { F: [0, 1, 0], B: [0, 1, 0], R: [0, 1, 0], L: [0, 1, 0], U: [0, 0, -1], D: [0, 0, 1] };
  /* opts.white: cubo con el blanco arriba (se usa fuera de OLL y PLL). La marca va siempre en el centro blanco. */
  function Cube3D(host, opts) {
    var self = this;
    this.host = host; host.classList.add('c3d');
    this.mf = opts && opts.white ? 'U' : 'D'; if (opts && opts.white) host.classList.add('blanca');
    this.state = Cube.solved(); this.rx = -27; this.ry = -33; this.anims = [];
    this.rot = h('div', { class: 'c3d-rot' }); host.appendChild(this.rot);
    /* Etiqueta en el suelo, fija en la escena: el frente no depende de los colores */
    this.rot.appendChild(h('div', { class: 'c3d-frente', 'aria-hidden': 'true', text: 'FRENTE' }));
    this.cubies = [];
    for (var x = -1; x <= 1; x++) for (var y = -1; y <= 1; y++) for (var z = -1; z <= 1; z++) {
      if (!x && !y && !z) continue;
      var c = h('div', { class: 'cubie' }); c._p = [x, y, z]; c._f = {};
      for (var f in Cube.FACE_N) { var fe = h('div', { class: 'cf cf-' + f }); c._f[f] = fe; c.appendChild(fe); }
      this.cubies.push(c); this.rot.appendChild(c);
    }
    this.resetMark(); this.layout(); this.view(); this.paint();
    if (window.ResizeObserver) new ResizeObserver(function () { self.layout(); }).observe(host);
    var drag = null;
    host.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY }; try { host.setPointerCapture(e.pointerId); } catch (er) { } self.rot.style.transition = 'none'; });
    host.addEventListener('pointermove', function (e) {
      if (!drag) return;
      self.ry += (e.clientX - drag.x) * 0.55; self.rx = Math.max(-85, Math.min(85, self.rx - (e.clientY - drag.y) * 0.55));
      drag.x = e.clientX; drag.y = e.clientY; self.view();
    });
    ['pointerup', 'pointercancel'].forEach(function (n) { host.addEventListener(n, function () { drag = null; }); });
  }
  Cube3D.prototype.layout = function () {
    var w = this.host.clientWidth; if (!w) return;
    var S = Math.max(16, Math.floor(w / 5.6)); if (S === this.S) return; this.S = S;
    this.host.style.setProperty('--s', S + 'px');
    this.cubies.forEach(function (c) { c._base = 'translate3d(' + (c._p[0] * S) + 'px,' + (-c._p[1] * S) + 'px,' + (c._p[2] * S) + 'px)'; c.style.transform = c._base; });
  };
  Cube3D.prototype.view = function () { this.rot.style.transform = 'rotateX(' + this.rx.toFixed(1) + 'deg) rotateY(' + this.ry.toFixed(1) + 'deg)'; };
  Cube3D.prototype.flip = function () {
    var back = Math.cos(this.ry * Math.PI / 180) < 0;
    this.rot.style.transition = 'transform .4s ease'; this.ry = back ? -33 : 147; this.rx = -27; this.view();
  };
  Cube3D.prototype.resetMark = function () {
    var mf = this.mf, s = this.state.filter(function (x) { return x.c === mf && Math.abs(x.p[0]) + Math.abs(x.p[1]) + Math.abs(x.p[2]) === 1; })[0];
    this.mp = s.p.slice(); this.mt = MK_UP[Cube.faceOfNormal(s.n)].slice();
  };
  Cube3D.prototype.paint = function () {
    var ix = Cube.index(this.state), mf = this.mf, mt = this.mt;
    this.cubies.forEach(function (c) {
      for (var f in Cube.FACE_N) {
        var n = Cube.FACE_N[f], out = c._p[0] * n[0] + c._p[1] * n[1] + c._p[2] * n[2] === 1;
        if (out) c._f[f].dataset.c = ix[Cube.key(c._p, n)]; else delete c._f[f].dataset.c;
        if (out && Math.abs(c._p[0]) + Math.abs(c._p[1]) + Math.abs(c._p[2]) === 1) {
          var on = c._f[f].dataset.c === mf, r = MK_R[f], u = MK_UP[f];
          c._f[f].classList.toggle('marca', on);
          if (on) c._f[f].style.setProperty('--mr', Math.round(Math.atan2(mt[0] * r[0] + mt[1] * r[1] + mt[2] * r[2], mt[0] * u[0] + mt[1] * u[1] + mt[2] * u[2]) * 180 / Math.PI) + 'deg');
        }
      }
    });
  };
  Cube3D.prototype.setState = function (st) { this.cancel(); this.state = st; this.resetMark(); this.paint(); };
  Cube3D.prototype.cancel = function () { var a = this.anims; this.anims = []; a.forEach(function (x) { try { x.cancel(); } catch (e) { } }); };
  Cube3D.prototype.move = function (m, dur) {
    var self = this, def = Cube.MOVES[m.b];
    function done() {
      for (var k = 0; k < m.t; k++) if (def.l.indexOf(self.mp[def.a]) >= 0) { self.mp = Cube.rot(self.mp, def.a, def.d); self.mt = Cube.rot(self.mt, def.a, def.d); }
      Cube.applyMove(self.state, m); self.paint();
    }
    if (!dur || !this.S || !this.host.animate) { done(); return Promise.resolve(); }
    var turns = m.t === 3 ? -1 : m.t, phi = def.d * 90 * turns, css = def.a === 1 ? phi : -phi, ax = 'XYZ'.charAt(def.a);
    var anims = this.cubies.filter(function (c) { return def.l.indexOf(c._p[def.a]) >= 0; }).map(function (c) {
      return c.animate([{ transform: 'rotate' + ax + '(0deg) ' + c._base }, { transform: 'rotate' + ax + '(' + css + 'deg) ' + c._base }], { duration: dur * (m.t === 2 ? 1.45 : 1), easing: 'cubic-bezier(.35,.05,.3,1)' });
    });
    this.anims = anims;
    return Promise.all(anims.map(function (a) { return a.finished; })).then(function () { if (self.anims === anims) { self.anims = []; done(); } else throw new Error('cancel'); });
  };

  /* Reproductor: lleva un algoritmo paso a paso sobre un cubo y marca el movimiento actual */
  function Player(cube) { this.cube = cube; this.moves = []; this.i = 0; this.playing = false; this.busy = false; this.gen = 0; this.box = null; this.onstate = null; }
  Player.prototype.load = function (state, moves, box) { this.gen++; this.playing = false; this.busy = false; this.start = Cube.clone(state); this.moves = moves; this.box = box; this.i = 0; this.cube.setState(Cube.clone(state)); this.mark(-1); this.emit(); };
  Player.prototype.emit = function () { if (this.onstate) this.onstate(this); };
  Player.prototype.mark = function (cur) {
    if (!this.box) return; var i = this.i;
    Array.prototype.forEach.call(this.box.querySelectorAll('.mv'), function (s) { var k = +s.dataset.i; s.classList.toggle('on', k === cur); s.classList.toggle('hecho', k < i && k !== cur); });
  };
  Player.prototype.step = function (dir) {
    var self = this, g = this.gen;
    if (this.busy) return Promise.resolve(false);
    if (dir > 0 && this.i >= this.moves.length) return Promise.resolve(false);
    if (dir < 0 && this.i <= 0) return Promise.resolve(false);
    var k = dir > 0 ? this.i : this.i - 1, m = dir > 0 ? this.moves[k] : inv1(this.moves[k]);
    this.busy = true; this.mark(k);
    return this.cube.move(m, store.prefs.speed).then(function () {
      if (g !== self.gen) return false;
      self.busy = false; self.i += dir; self.mark(-1); self.emit(); return true;
    }, function () { if (g === self.gen) self.busy = false; return false; });
  };
  Player.prototype.play = function () {
    var self = this, g;
    if (this.playing) { this.playing = false; this.stopAt = null; this.emit(); return; }
    if (this.stopAt == null && this.i >= this.moves.length) this.reset();
    g = this.gen; this.playing = true; this.emit();
    (function loop() {
      if (!self.playing || g !== self.gen) return;
      if (self.i >= (self.stopAt != null ? self.stopAt : self.moves.length)) { self.playing = false; self.stopAt = null; self.emit(); return; }
      self.step(1).then(function (ok) { if (ok) setTimeout(loop, store.prefs.speed ? 70 : 450); else if (g === self.gen) { self.playing = false; self.emit(); } });
    })();
  };
  Player.prototype.goTo = function (k) {
    this.gen++; this.playing = false; this.busy = false; this.stopAt = null;
    var st = Cube.clone(this.start); for (var j = 0; j < k; j++) Cube.applyMove(st, this.moves[j]);
    this.cube.setState(st); this.i = k; this.mark(-1); this.emit();
  };
  Player.prototype.playRange = function (s, e) { this.goTo(s); this.stopAt = e; this.play(); };
  function bindGroups(box, pl) {
    box.addEventListener('click', function (e) {
      var g = e.target.closest && e.target.closest('.grp'); if (!g || !box.contains(g)) return;
      pl.playRange(+g.dataset.s, +g.dataset.e);
    });
  }
  Player.prototype.reset = function () { this.gen++; this.playing = false; this.busy = false; this.i = 0; this.cube.setState(Cube.clone(this.start)); this.mark(-1); this.emit(); };
  Player.prototype.halt = function () { this.gen++; this.playing = false; this.busy = false; this.cube.cancel(); };
  function controls(pl, withSpeed) {
    var bPlay = fixedBtn('btn pri', [['play', 'Reproducir'], ['seguir', 'Seguir'], ['pausa', 'Pausa']], function () { pl.play(); });
    var bPrev = h('button', { class: 'btn', 'aria-label': 'Paso atrás', html: ICON.prev, onclick: function () { pl.playing = false; pl.step(-1); } });
    var bNext = h('button', { class: 'btn', 'aria-label': 'Paso adelante', html: ICON.next, onclick: function () { pl.playing = false; pl.step(1); } });
    var bReset = h('button', { class: 'btn', 'aria-label': 'Volver al inicio', html: ICON.reset, onclick: function () { pl.reset(); } });
    var kids = [bReset, bPrev, bPlay, bNext];
    if (withSpeed) {
      var sel = h('select', { id: 'vel-' + withSpeed, 'aria-label': 'Velocidad', onchange: function () { store.prefs.speed = +sel.value; touch(); } },
        [['900', 'Muy lento'], ['620', 'Lento'], ['420', 'Normal'], ['240', 'Rápido'], ['0', 'Sin animación']].map(function (o) { return h('option', { value: o[0], text: o[1] }); }));
      sel.value = String(store.prefs.speed); if (!sel.value) sel.value = '420';
      kids.push(sel);
    }
    pl.onstate = function () {
      if (pl.playing) bPlay.show('pausa', ICON.pause); else bPlay.show(pl.i > 0 && pl.i < pl.moves.length ? 'seguir' : 'play', ICON.play);
      bPrev.disabled = pl.i <= 0; bNext.disabled = pl.i >= pl.moves.length; bReset.disabled = pl.i <= 0;
    };
    pl.onstate();
    return h('div', { class: 'ctrl' }, kids);
  }
  /* Botón que cambia de texto sin cambiar de ancho: mide siempre la etiqueta más larga */
  function fixedBtn(cls, labels, onclick) {
    var ic = h('span', { class: 'ic' }), box = h('span', { class: 'lbls' }), map = {};
    labels.forEach(function (l) { map[l[0]] = h('span', { html: l[1] }); box.appendChild(map[l[0]]); });
    var b = h('button', { class: cls, onclick: onclick }, [ic, box]);
    b.show = function (k, icon) {
      ic.innerHTML = icon || ''; ic.hidden = !icon;
      for (var x in map) map[x].classList.toggle('on', x === k);
      b.setAttribute('aria-label', map[k].textContent.trim());
    };
    return b;
  }
  function fmt(ms) { return ms ? (ms / 1000).toFixed(2) : '—'; }
  var toastT = 0;
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('ver'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('ver'); }, 3200); }

  /* ---------- Vista: Casos ---------- */
  var ui = { stage: 1, status: -1, view: 'casos' };
  function stageCases(n) { return CASES.filter(function (c) { return c.e === n; }); }
  function renderRuta() {
    var box = $('#ruta'); box.textContent = '';
    STAGES.forEach(function (s) {
      var cs = stageCases(s.n), ok = cs.filter(function (c) { return peek(c.id).s === 2; }).length, lr = cs.filter(function (c) { return peek(c.id).s === 1; }).length;
      box.appendChild(h('button', { class: 'etapa', 'aria-pressed': ui.stage === s.n ? 'true' : 'false', onclick: function () { ui.stage = ui.stage === s.n ? 0 : s.n; renderCasos(); } }, [
        h('span', { class: 'eyebrow', text: 'Etapa ' + s.n + ' · ' + s.sub }), h('b', { text: s.t }),
        h('span', { class: 'meter', 'aria-hidden': 'true' }, [h('span', { class: 'm-ok', style: 'width:' + (100 * ok / cs.length) + '%' }), h('span', { class: 'm-warn', style: 'width:' + (100 * lr / cs.length) + '%' })]),
        h('span', { class: 'cnt', text: ok + ' de ' + cs.length + ' dominados' + (lr ? ' · ' + lr + ' en curso' : '') })
      ]));
    });
  }
  function renderCasos() {
    renderRuta();
    var como = $('#como'); como.textContent = '';
    if (ui.stage) { var s = STAGES[ui.stage - 1]; como.appendChild(h('h2', { text: 'Etapa ' + s.n + ': ' + s.t })); como.appendChild(h('p', { html: s.how })); }
    else {
      var tot = CASES.filter(function (c) { return peek(c.id).s === 2; }).length;
      como.appendChild(h('h2', { text: 'Las seis etapas' }));
      como.appendChild(h('p', { text: 'Llevas ' + tot + ' de ' + CASES.length + ' algoritmos dominados. Toca una etapa para ver solo sus casos y cómo abordarla.' }));
    }
    var fl = $('#filtros'); fl.textContent = '';
    [[-1, 'Todos'], [0, 'Sin empezar'], [1, 'Aprendiendo'], [2, 'Dominados']].forEach(function (f) {
      fl.appendChild(h('button', { class: 'chip', 'aria-pressed': ui.status === f[0] ? 'true' : 'false', text: f[1], onclick: function () { ui.status = f[0]; renderCasos(); } }));
    });
    fl.appendChild(h('span', { class: 'leyenda', html: '<span><i class="dot" data-s="0"></i>Sin empezar</span><span><i class="dot" data-s="1"></i>Aprendiendo</span><span><i class="dot" data-s="2"></i>Dominado</span>' }));
    var list = $('#lista'); list.textContent = '';
    var shown = CASES.filter(function (c) { return (!ui.stage || c.e === ui.stage) && (ui.status < 0 || peek(c.id).s === ui.status); });
    if (!shown.length) { list.appendChild(h('div', { class: 'vacio' }, [h('p', { text: 'No hay casos con ese estado en esta etapa.' }), h('button', { class: 'btn', text: 'Ver todos', onclick: function () { ui.status = -1; renderCasos(); } })])); return; }
    GROUP_ORDER.forEach(function (g) {
      var cs = shown.filter(function (c) { return c.g === g; }); if (!cs.length) return;
      var grid = h('div', { class: 'casos' });
      cs.forEach(function (c) {
        var p = peek(c.id), alg = algOf(c);
        grid.appendChild(h('button', { class: 'caso', onclick: function () { openDetalle(c); } }, [
          h('span', { html: diagram(c, alg) }),
          h('span', { class: 'nm' }, [c.kind === 'eo' ? c.short.charAt(0).toUpperCase() + c.short.slice(1) : c.label, c.n ? h('span', { class: 'ap', text: c.n }) : null, guiaTag(c, alg)]),
          h('i', { class: 'dot', 'data-s': p.s, role: 'img', 'aria-label': ESTADO[p.s] }),
          h('span', { class: 'alg', text: grpText(Cube.parse(alg), cutsOf(c, alg)) })
        ]));
      });
      list.appendChild(h('div', { class: 'grupo' }, [h('div', { class: 'grupo-h' }, [h('h3', { text: GROUPS[g][0] }), GROUPS[g][1] ? h('p', { text: GROUPS[g][1] }) : null]), grid]));
    });
  }

  /* ---------- Detalle de un caso ---------- */
  var dlg = $('#detalle'), det = { c: null, cube: null, pl: null };
  function openDetalle(c) {
    if (det.c !== c) det.edit = false;
    det.c = c;
    if (!det.cube) { det.host = h('div'); det.cube = new Cube3D(det.host); det.pl = new Player(det.cube); }
    renderDetalle();
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
    dlg.scrollTop = 0; fitDetPlay(); det.cube.layout();
  }
  /* Escritorio: el cubo usa el alto que deja libre el algoritmo; si no alcanza, el panel crece */
  function fitDetPlay() {
    var play = document.querySelector('#detalle .det-play'); if (!play) return;
    var esc = play.querySelector('.escena'); if (!esc) return;
    if (window.innerWidth < 861) { esc.style.height = ''; return; }
    var rest = 0; Array.prototype.forEach.call(play.children, function (ch) { if (ch !== esc) rest += ch.getBoundingClientRect().height; });
    var gaps = 12 * (play.children.length - 1), pad = 30;
    esc.style.height = Math.max(190, window.innerHeight - 72 - pad - gaps - rest) + 'px';
  }
  window.addEventListener('resize', function () { if (dlg.open) fitDetPlay(); });
  function closeDetalle() { if (det.pl) det.pl.halt(); if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function () { if (det.pl) det.pl.halt(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDetalle(); });
  function renderDetalle() {
    var c = det.c, p = peek(c.id), alg = algOf(c), su = setupOf(alg), moves = Cube.parse(alg), box = $('#det');
    det.pl.halt(); box.textContent = '';
    var cuts = cutsOf(c, alg), algo = algoEl(moves, null, null, cuts);
    det.pl.load(viewState(c, su.state), moves, algo);
    bindGroups(algo, det.pl);
    var trigs = []; trigBlocks(moves).forEach(function (b) { if (trigs.indexOf(b.n) < 0) trigs.push(b.n); });
    box.appendChild(h('div', { class: 'det-h' }, [
      h('span', { html: diagram(c, alg) }),
      h('div', null, [h('p', { class: 'eyebrow', text: GROUPS[c.g][0] }), h('h2', { id: 'det-nombre', text: c.label + (c.n ? ' · ' + c.n : '') }), c.freq ? h('p', { class: 'nota', text: 'Aparece en 1 de cada ' + c.freq + ' resoluciones.' }) : null]),
      h('button', { class: 'btn sm x', 'aria-label': 'Cerrar', html: ICON.x, onclick: closeDetalle })
    ]));
    var play = h('div', { class: 'det-play' }), info = h('div', { class: 'det-info' });
    box.appendChild(play); box.appendChild(info);
    play.appendChild(h('div', { class: 'escena' }, [det.host]));
    play.appendChild(h('div', { class: 'bajo-cubo' }, [h('span', { text: 'FRENTE marca la cara F, la que te mira. Arrastra para girar.' }), h('button', { class: 'btn sm', text: 'Ver por detrás', onclick: function () { det.cube.flip(); } })]));
    play.appendChild(h('div', { class: 'bloque' }, [
      h('div', { class: 'eb-fila' }, [h('p', { class: 'eyebrow eb-guia' }, ['Algoritmo · ' + moves.length + ' movimientos', guiaTag(c, alg)]),
        h('button', { class: 'btn sm', text: det.edit ? 'Listo' : (cuts ? 'Editar secciones' : 'Agrupar en secciones'), onclick: function () { det.edit = !det.edit; renderDetalle(); } })]),
      det.edit ? grpEditor(c, alg, moves) : algo,
      det.edit ? null : (cuts ? h('p', { class: 'nota', text: 'Toca una sección para verla sola en el cubo, desde su inicio. Así puedes repetirla hasta que te salga.' }) : null),
      det.edit ? null : controls(det.pl, 'det'),
      h('p', { class: 'nota teclas-hint', text: 'Con el teclado: ← y → paso a paso, Espacio reproduce o pausa.' })
    ]));
    if (trigs.length) info.appendChild(h('div', { class: 'bloque' }, [h('p', { class: 'eyebrow', text: 'Gatillos' }), h('p', { class: 'nota', text: (cuts ? 'Este algoritmo contiene: ' : 'Subrayado en el algoritmo: ') + trigs.join(', ') + '. Son secuencias que se repiten en muchos casos; apréndelas como un solo gesto.' })]));
    info.appendChild(h('div', { class: 'bloque' }, [h('p', { class: 'eyebrow', text: 'Cómo reconocerlo' }), h('p', { text: facts(c, alg) })]));
    info.appendChild(h('div', { class: 'bloque' }, [
      h('p', { class: 'eyebrow', text: 'Para armarlo en tu cubo' }), h('p', { class: 'mono', style: 'font-weight:600;overflow-wrap:anywhere', text: Cube.str(su.moves) }),
      h('p', { class: 'nota', text: 'Parte con el cubo resuelto, amarillo arriba y verde al frente.' })
    ]));
    var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Estado' }, ESTADO.map(function (t, i) {
      return h('button', { 'data-s': i, 'aria-pressed': p.s === i ? 'true' : 'false', text: t, onclick: function () { var q = P(c.id); q.s = i; if (i !== 2) q.streak = 0; touch(); renderDetalle(); renderCasos(); } });
    }));
    var avg = p.last.length ? p.last.slice(-5).reduce(function (a, b) { return a + b; }, 0) / Math.min(5, p.last.length) : 0;
    info.appendChild(h('div', { class: 'bloque' }, [h('p', { class: 'eyebrow', text: 'Tu progreso' }), seg,
      h('dl', { class: 'datos' }, [
        h('div', null, [h('dt', { text: 'Intentos' }), h('dd', { text: String(p.n) })]),
        h('div', null, [h('dt', { text: 'Mejor (s)' }), h('dd', { text: fmt(p.best) })]),
        h('div', null, [h('dt', { text: 'Media últimos 5 (s)' }), h('dd', { text: fmt(avg) })])
      ]),
      h('button', { class: 'btn pri', text: 'Practicar este caso', onclick: function () { closeDetalle(); practiceOnly(c); } })
    ]));
    /* Alternativas */
    if (c.guiaNota && guiaDe(c, alg)) info.appendChild(h('div', { class: 'bloque' }, [h('p', { class: 'eyebrow', text: 'Nota sobre tu guía' }), h('p', { class: 'nota', text: c.guiaNota })]));
    var list = [c.a].concat(c.alt || []), cur = Cube.str(moves), msg = h('p', { class: 'msg', role: 'status' });
    if (list.map(function (a) { return Cube.str(Cube.parse(a)); }).indexOf(cur) < 0) list.push(alg);
    var alts = h('div', { class: 'alts' }, list.map(function (a) {
      var txt = Cube.str(Cube.parse(a));
      return h('button', { class: 'alt', 'aria-pressed': txt === cur ? 'true' : 'false', onclick: function () { P(c.id).alg = a === c.a ? '' : a; touch(); renderDetalle(); renderCasos(); } }, [h('i'), h('span', { text: grpText(Cube.parse(a), cutsOf(c, a)) }), guiaTag(c, a)]);
    }));
    var kids = [h('p', { class: 'eyebrow', text: list.length > 1 ? 'Elige tu algoritmo' : 'Tu propio algoritmo' }), list.length > 1 ? alts : null];
    if (c.kind !== 'eo') {
      var inp = h('input', { type: 'text', id: 'alg-propio', placeholder: "Escribe otro, p. ej. R U R' U'…", 'aria-label': 'Algoritmo propio', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
      var use = function () {
        var txt = inp.value.trim(), ms = Cube.parse(txt);
        msg.className = 'msg bad';
        if (!ms.length) { msg.textContent = 'Escribe los movimientos separados por espacios.'; return; }
        var r = Cube.check(txt, c.kind);
        if (!r.ok) { msg.textContent = (isF2L(c) ? 'Ese algoritmo no resuelve este paso de F2L: desarma otras piezas ya colocadas o no deja la pareja en su sitio.' : 'Ese algoritmo no resuelve un caso de ' + (c.kind === 'oll' ? 'OLL' : 'PLL') + ': desarma las dos primeras capas o no deja la cara como corresponde.'); return; }
        if (r.sig !== c.sig) { var o = CASES.filter(function (x) { return x.sig === r.sig; })[0]; msg.textContent = 'Ese algoritmo resuelve otro caso' + (o ? ' (' + o.label + ')' : '') + ', no este.'; return; }
        P(c.id).alg = Cube.str(ms); touch(); renderDetalle(); renderCasos(); toast('Algoritmo cambiado para ' + c.label);
      };
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); use(); } });
      kids.push(h('div', { class: 'campo' }, [inp, h('button', { class: 'btn', text: 'Usar', onclick: use })]));
      kids.push(msg);
      kids.push(h('p', { class: 'nota', text: 'Se comprueba en el simulador antes de guardarlo: solo se acepta si resuelve este mismo caso.' }));
    }
    info.appendChild(h('div', { class: 'bloque' }, kids));
    if (dlg.open) requestAnimationFrame(fitDetPlay);
  }

  function detKey(e) { return dlg.open && !e.metaKey && !e.ctrlKey && !e.altKey && !/^(INPUT|SELECT|TEXTAREA)$/.test((e.target && e.target.tagName) || ''); }
  document.addEventListener('keydown', function (e) {
    if (!detKey(e) || !det.pl) return;
    if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); if (!e.repeat) det.pl.play(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); det.pl.playing = false; det.pl.step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); det.pl.playing = false; det.pl.step(-1); }
  });
  document.addEventListener('keyup', function (e) { if (detKey(e) && (e.code === 'Space' || e.key === ' ')) e.preventDefault(); });

  /* Editor de secciones: tocar el espacio entre dos movimientos separa o une */
  function grpEditor(c, alg, moves) {
    var cuts = (cutsOf(c, alg) || []).slice(), wrap = h('div', { class: 'bloque' }), ed = h('div', { class: 'algo editando' });
    function paint() {
      ed.textContent = '';
      moves.forEach(function (m, i) {
        if (i > 0) {
          var on = cuts.indexOf(i) >= 0;
          ed.appendChild(h('button', { class: 'corte' + (on ? ' on' : ''), 'aria-label': (on ? 'Unir' : 'Separar') + ' antes de ' + Cube.tok(m) + ' (movimiento ' + (i + 1) + ')', 'aria-pressed': on ? 'true' : 'false', onclick: function () {
            var k = cuts.indexOf(i); if (k >= 0) cuts.splice(k, 1); else cuts.push(i);
            setCuts(c, alg, cuts); paint(); renderCasos();
          } }));
        }
        ed.appendChild(h('span', { class: 'mv', text: Cube.tok(m) }));
      });
      cnt.textContent = (cuts.length + 1) + (cuts.length ? ' secciones' : ' sección (sin separar)');
    }
    var cnt = h('span', { class: 'nota' });
    wrap.appendChild(h('p', { class: 'nota', text: 'Toca el espacio entre dos movimientos para separar o unir. Cada sección es un trozo para aprender por separado; se guarda con tu progreso.' }));
    wrap.appendChild(ed);
    wrap.appendChild(h('div', { class: 'acc' }, [
      h('button', { class: 'btn sm', text: 'Sugerir con los gatillos', onclick: function () { cuts = trigCuts(moves); setCuts(c, alg, cuts); paint(); renderCasos(); } }),
      h('button', { class: 'btn sm', text: 'Partir en mitades', onclick: function () { cuts = [Math.ceil(moves.length / 2)]; setCuts(c, alg, cuts); paint(); renderCasos(); } }),
      h('button', { class: 'btn sm', text: 'Quitar secciones', onclick: function () { cuts = []; setCuts(c, alg, cuts); paint(); renderCasos(); } }),
      cnt
    ]));
    paint();
    return wrap;
  }

  /* ---------- Vista: Practicar ---------- */
  var pr = { cube: null, pl: null, cur: null, phase: 'idle', t0: 0, ms: null, raf: 0, revealed: false, last: null, session: [], only: null, els: {} };
  function baseOptions() {
    var nl = CASES.filter(function (c) { return peek(c.id).s === 1; }).length;
    return [['aprendiendo', 'Los que estoy aprendiendo (' + nl + ')']].concat(STAGES.map(function (s) { return ['e' + s.n, 'Etapa ' + s.n + ' · ' + s.t]; }), [['f2l', 'Todo F2L (41)'], ['oll', 'Todo OLL (57)'], ['pll', 'Todo PLL (21)']]);
  }
  function casesOf(v) {
    if (v === 'aprendiendo') return CASES.filter(function (c) { return peek(c.id).s === 1; });
    if (v === 'f2l' || v === 'oll' || v === 'pll') return CASES.filter(function (c) { return c.kind === v; });
    return stageCases(+String(v).slice(1));
  }
  function setOptions() {
    var sel = $('#pr-set'), nl = CASES.filter(function (c) { return peek(c.id).s === 1; }).length, v = store.prefs.set;
    var opts = baseOptions();
    if (pr.only) opts.push(['uno', 'Solo ' + pr.only.label]);
    sel.textContent = ''; opts.forEach(function (o) { sel.appendChild(h('option', { value: o[0], text: o[1] })); });
    if (!v || (v === 'uno' && !pr.only)) v = nl ? 'aprendiendo' : 'e1';
    sel.value = v; store.prefs.set = v;
  }
  function pool() {
    var v = store.prefs.set;
    if (v === 'uno' && pr.only) return [pr.only];
    if (v === 'aprendiendo') return CASES.filter(function (c) { return peek(c.id).s === 1; });
    if (v === 'f2l') return CASES.filter(function (c) { return c.kind === 'f2l'; });
    if (v === 'oll') return CASES.filter(function (c) { return c.kind === 'oll'; });
    if (v === 'pll') return CASES.filter(function (c) { return c.kind === 'pll'; });
    return stageCases(+v.slice(1));
  }
  function practiceOnly(c) { pr.only = c; store.prefs.set = 'uno'; setView('practicar'); setOptions(); nextCase(); }
  function pick(list) {
    var cand = list.length > 1 && pr.last ? list.filter(function (c) { return c !== pr.last; }) : list;
    var tot = cand.reduce(function (s, c) { return s + (peek(c.id).w || 3); }, 0), r = Math.random() * tot;
    for (var i = 0; i < cand.length; i++) { r -= (peek(cand[i].id).w || 3); if (r <= 0) return cand[i]; }
    return cand[cand.length - 1];
  }
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function stopTimer() { cancelAnimationFrame(pr.raf); pr.phase = 'idle'; }
  function nextCase() {
    stopTimer(); if (pr.pl) pr.pl.halt();
    var list = pool(), body = $('#pr-cuerpo'); body.textContent = '';
    if (!list.length) {
      pr.cur = null;
      body.appendChild(h('div', { class: 'vacio' }, [
        h('h3', { text: 'Todavía no hay casos marcados como «Aprendiendo»' }),
        h('p', { class: 'nota', text: 'Abre un caso en la pestaña Casos y márcalo, o practica una etapa completa.' }),
        h('div', { class: 'acc' }, [h('button', { class: 'btn pri', text: 'Practicar la etapa 1', onclick: function () { store.prefs.set = 'e1'; touch(); setOptions(); nextCase(); } }), h('button', { class: 'btn', text: 'Ir a Casos', onclick: function () { setView('casos'); } })])
      ]));
      return;
    }
    var c = pick(list), alg = algOf(c), moves = Cube.parse(alg), pre = '', post = '';
    if (store.prefs.auf) { post = rnd(['', 'U', "U'", 'U2']); if (c.kind === 'pll' && !Cube.caseState(alg).prefix) pre = rnd(['', 'U', "U'", 'U2']); }
    var su = setupOf(alg, pre, post), lead = Cube.invert(Cube.parse(post)), tail = Cube.invert(Cube.parse(pre));
    pr.last = c; pr.cur = { c: c, alg: alg, su: su, lead: lead, tail: tail, all: lead.concat(moves, tail), moves: moves };
    pr.ms = null; pr.revealed = false; pr.phase = 'ready';
    if (!pr.cube) { pr.host = h('div'); pr.cube = new Cube3D(pr.host); pr.pl = new Player(pr.cube); }
    pr.cube.setState(viewState(c, Cube.clone(su.state)));
    var E = pr.els = {};
    E.crono = h('div', { class: 'crono', 'data-f': 'ready', 'aria-live': 'off', text: '0.00' });
    E.go = fixedBtn('btn pri', [['ir', 'Empezar <kbd>Espacio</kbd>'], ['parar', 'Detener <kbd>Espacio</kbd>']], function () { blurAct(); toggleTimer(); });
    E.ver = h('button', { class: 'btn', text: 'Ver algoritmo', onclick: function () { blurAct(); reveal(); } });
    E.skip = h('button', { class: 'btn', text: 'Saltar', onclick: function () { blurAct(); nextCase(); } });
    E.rev = h('div', { class: 'revela', hidden: true });
    E.eval = h('div', { class: 'eval', hidden: true }, [h('p', { class: 'eyebrow', text: '¿Cómo te fue?' }), h('div', { class: 'acc' }, [
      h('button', { class: 'btn e-ok', html: 'Lo sabía <kbd>1</kbd>', onclick: function () { rate(0); } }),
      h('button', { class: 'btn e-warn', html: 'Dudé <kbd>2</kbd>', onclick: function () { rate(1); } }),
      h('button', { class: 'btn e-bad', html: 'No lo recordé <kbd>3</kbd>', onclick: function () { rate(2); } })
    ])]);
    body.appendChild(h('div', { class: 'pr' }, [
      h('div', { class: 'pr-izq' }, [h('div', { class: 'escena' }, [pr.host]), h('div', { class: 'bajo-cubo' }, [h('span', { text: 'Así debe quedar tu cubo' }), h('button', { class: 'btn sm', text: 'Ver por detrás', onclick: function () { pr.cube.flip(); } })])]),
      h('div', { class: 'pr-der' }, [
        h('div', { class: 'bloque' }, [h('p', { class: 'eyebrow', text: 'Mezcla para armar el caso' }), h('p', { class: 'mezcla', text: Cube.str(su.moves) }), h('p', { class: 'nota', text: 'Parte con el cubo resuelto, amarillo arriba y verde al frente.' })]),
        E.crono, h('div', { class: 'acc' }, [E.go, E.ver, E.skip]), E.rev, E.eval
      ])
    ]));
    pr.cube.layout(); paintGo();
  }
  function blurAct() { try { document.activeElement && document.activeElement.blur(); } catch (e) { } }
  function paintGo() {
    var E = pr.els; if (!E.go) return;
    E.go.show(pr.phase === 'running' ? 'parar' : 'ir');
    E.go.disabled = pr.phase === 'done'; E.crono.dataset.f = pr.phase;
  }
  function toggleTimer() {
    if (!pr.cur) return;
    if (pr.phase === 'ready') {
      pr.phase = 'running'; pr.t0 = performance.now(); paintGo();
      (function tick() { if (pr.phase !== 'running') return; pr.els.crono.textContent = ((performance.now() - pr.t0) / 1000).toFixed(2); pr.raf = requestAnimationFrame(tick); })();
    } else if (pr.phase === 'running') {
      var ms = performance.now() - pr.t0; cancelAnimationFrame(pr.raf); pr.phase = 'done';
      pr.ms = pr.revealed ? null : Math.round(ms); pr.els.crono.textContent = (ms / 1000).toFixed(2); paintGo(); reveal();
    }
  }
  function reveal() {
    var E = pr.els, cu = pr.cur; if (!cu || !E.rev) return;
    if (pr.phase === 'running') { cancelAnimationFrame(pr.raf); pr.phase = 'done'; pr.ms = null; paintGo(); }
    if (!pr.revealed) {
      pr.revealed = true; E.rev.textContent = '';
      var algo = algoEl(cu.moves, cu.lead, cu.tail, cutsOf(cu.c, cu.alg));
      pr.pl.load(viewState(cu.c, cu.su.state), cu.all, algo);
      bindGroups(algo, pr.pl);
      E.rev.appendChild(h('div', { class: 'quien' }, [h('b', { text: cu.c.label + (cu.c.n ? ' · ' + cu.c.n : '') }), h('span', { class: 'nota', text: GROUPS[cu.c.g][0] }), guiaTag(cu.c, cu.alg)]));
      E.rev.appendChild(algo);
      if (cu.lead.length || cu.tail.length) E.rev.appendChild(h('p', { class: 'nota', text: 'Entre paréntesis: el ajuste de la capa de arriba que pide este ángulo.' }));
      E.rev.appendChild(controls(pr.pl, false));
    }
    E.rev.hidden = false; E.eval.hidden = false; E.ver.disabled = true;
  }
  function rate(r) {
    var cu = pr.cur; if (!cu || pr.els.eval.hidden) return;
    var c = cu.c, p = P(c.id);
    p.n++;
    if (r === 0) { p.ok++; p.streak++; p.w = Math.max(1, p.w - 1); } else { p.streak = 0; p.w = Math.min(8, p.w + (r === 1 ? 1 : 3)); }
    if (pr.ms && r !== 2) { p.last.push(pr.ms); p.last = p.last.slice(-12); if (!p.best || pr.ms < p.best) p.best = pr.ms; }
    if (p.s === 0) p.s = 1;
    if (r === 0 && p.streak >= 5 && p.s !== 2) { p.s = 2; toast(c.label + ' pasa a Dominado: 5 aciertos seguidos'); }
    else if (r === 2 && p.s === 2) { p.s = 1; toast(c.label + ' vuelve a Aprendiendo'); }
    pr.session.unshift({ label: c.label + (c.n ? ' · ' + c.n : ''), ms: r !== 2 ? pr.ms : null, r: r });
    touch(); renderSesion(); setOptions(); nextCase();
  }
  function renderSesion() {
    var box = $('#sesion'); box.textContent = ''; if (!pr.session.length) return;
    var ok = pr.session.filter(function (s) { return s.r === 0; }).length;
    box.appendChild(h('p', { class: 'eyebrow', text: 'Esta sesión · ' + pr.session.length + (pr.session.length === 1 ? ' intento' : ' intentos') + ' · ' + ok + (ok === 1 ? ' sabido' : ' sabidos') }));
    box.appendChild(h('ol', null, pr.session.slice(0, 10).map(function (s) {
      return h('li', null, [h('span', { text: s.label }), h('span', { text: s.ms ? fmt(s.ms) : '—' }), h('span', { class: 'pill', 'data-r': s.r, text: ['Lo sabía', 'Dudé', 'No lo recordé'][s.r] })]);
    })));
  }
  $('#pr-set').addEventListener('change', function (e) { store.prefs.set = e.target.value; touch(); nextCase(); });
  $('#pr-auf').addEventListener('change', function (e) { store.prefs.auf = e.target.checked; touch(); nextCase(); });
  function prKey(e) {
    if (ui.view !== 'practicar' || dlg.open || aj.dlg.open || e.metaKey || e.ctrlKey || e.altKey) return false;
    return !/^(INPUT|SELECT|TEXTAREA)$/.test((e.target && e.target.tagName) || '');
  }
  document.addEventListener('keydown', function (e) {
    if (!prKey(e)) return;
    if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); if (!e.repeat) toggleTimer(); }
    else if (e.key === '1' || e.key === '2' || e.key === '3') rate(+e.key - 1);
  });
  /* Espacio es del cronómetro: evita que además active el botón que tenga el foco */
  document.addEventListener('keyup', function (e) { if (prKey(e) && (e.code === 'Space' || e.key === ' ')) e.preventDefault(); });

  /* ---------- Vista: Tarjetas ---------- */
  var fc = { cur: null, last: null, rot: 0, open: false, n: 0, ok: 0, els: null };
  function fcOptions() {
    var sel = $('#fc-set'), v = store.prefs.fcset, opts = baseOptions();
    sel.textContent = ''; opts.forEach(function (o) { sel.appendChild(h('option', { value: o[0], text: o[1] })); });
    if (!v || !opts.some(function (o) { return o[0] === v; })) v = casesOf('aprendiendo').length ? 'aprendiendo' : 'e' + (ui.stage || 2);
    sel.value = v; store.prefs.fcset = v; $('#fc-girar').checked = !!store.prefs.fcrot;
  }
  function fcSetLabel(c) { return isF2L(c) ? 'F2L' : c.kind === 'pll' ? 'PLL' : 'OLL'; }
  function fcNext() {
    var list = casesOf(store.prefs.fcset), box = $('#fc-cuerpo'); box.textContent = '';
    if (!list.length) {
      fc.cur = null;
      box.appendChild(h('div', { class: 'vacio' }, [h('h3', { text: 'No hay casos en este grupo' }), h('p', { class: 'nota', text: 'Marca casos como «Aprendiendo» en la pestaña Casos, o elige una etapa.' })]));
      return;
    }
    var cand = list.length > 1 && fc.last ? list.filter(function (c) { return c !== fc.last; }) : list;
    var tot = cand.reduce(function (s, c) { return s + (peek(c.id).w || 3); }, 0), r = Math.random() * tot, c = cand[cand.length - 1];
    for (var i = 0; i < cand.length; i++) { r -= (peek(cand[i].id).w || 3); if (r <= 0) { c = cand[i]; break; } }
    fc.cur = c; fc.last = c; fc.open = false;
    fc.rot = store.prefs.fcrot && !isF2L(c) ? Math.floor(Math.random() * 4) * 90 : 0;
    var alg = algOf(c), moves = Cube.parse(alg);
    var front = h('div', { class: 'cara frente' }, [
      h('p', { class: 'eyebrow', text: fcSetLabel(c) + ' · ¿qué algoritmo es?' }),
      h('span', { class: 'fc-dg', html: diagram(c, alg), style: fc.rot ? 'transform:rotate(' + fc.rot + 'deg)' : null }),
      h('p', { class: 'nota', text: 'Toca la tarjeta para ver la respuesta' })
    ]);
    var back = h('div', { class: 'cara dorso' }, [
      h('p', { class: 'eyebrow', text: GROUPS[c.g][0] }),
      h('h2', { text: c.label + (c.n ? ' · ' + c.n : '') }), guiaTag(c, alg),
      algoEl(moves, null, null, cutsOf(c, alg)),
      fc.rot ? h('div', { class: 'fc-pos' }, [h('span', { class: 'fc-mini', html: diagram(c, alg) }), h('p', { class: 'nota', text: 'Antes de empezar, gira la capa de arriba hasta dejar el caso así.' })]) : null
    ]);
    var card = h('button', { class: 'flash', 'aria-label': 'Mostrar la respuesta', onclick: function () { blurAct(); fcFlip(); } }, [h('div', { class: 'flash-in' }, [front, back])]);
    var acc = h('div', { class: 'fc-acc' });
    box.appendChild(card); box.appendChild(acc);
    fc.els = { card: card, acc: acc };
    fcPaint();
  }
  function fcPaint() {
    var E = fc.els; if (!E) return;
    E.card.classList.toggle('vuelta', fc.open);
    E.card.setAttribute('aria-label', fc.open ? 'Ocultar la respuesta' : 'Mostrar la respuesta');
    E.acc.textContent = '';
    if (!fc.open) {
      E.acc.appendChild(h('button', { class: 'btn pri', html: 'Ver respuesta <kbd>Espacio</kbd>', onclick: function () { blurAct(); fcFlip(); } }));
      E.acc.appendChild(h('button', { class: 'btn', html: 'Otra <kbd>→</kbd>', onclick: function () { blurAct(); fcNext(); } }));
    } else {
      E.acc.appendChild(h('button', { class: 'btn e-bad', html: 'No la sabía <kbd>1</kbd>', onclick: function () { fcRate(false); } }));
      E.acc.appendChild(h('button', { class: 'btn e-ok', html: 'La sabía <kbd>2</kbd>', onclick: function () { fcRate(true); } }));
      E.acc.appendChild(h('button', { class: 'btn', text: 'Verla animada', onclick: function () { openDetalle(fc.cur); } }));
    }
    $('#fc-sesion').textContent = fc.n ? 'Esta sesión: ' + fc.n + (fc.n === 1 ? ' tarjeta' : ' tarjetas') + ', ' + fc.ok + (fc.ok === 1 ? ' sabida' : ' sabidas') + '.' : '';
  }
  function fcFlip() { if (!fc.cur) return; fc.open = !fc.open; fcPaint(); }
  function fcRate(ok) {
    if (!fc.cur || !fc.open) return;
    var p = P(fc.cur.id); p.w = ok ? Math.max(1, p.w - 1) : Math.min(8, p.w + 2);
    fc.n++; if (ok) fc.ok++; touch(); blurAct(); fcNext();
  }
  $('#fc-set').addEventListener('change', function (e) { store.prefs.fcset = e.target.value; touch(); fcNext(); });
  $('#fc-girar').addEventListener('change', function (e) { store.prefs.fcrot = e.target.checked; touch(); fcNext(); });
  function fcKey(e) { return ui.view === 'tarjetas' && !dlg.open && !aj.dlg.open && !e.metaKey && !e.ctrlKey && !e.altKey && !/^(INPUT|SELECT|TEXTAREA)$/.test((e.target && e.target.tagName) || ''); }
  document.addEventListener('keydown', function (e) {
    if (!fcKey(e)) return;
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) fcFlip(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); fcNext(); }
    else if (e.key === '1' && fc.open) fcRate(false);
    else if (e.key === '2' && fc.open) fcRate(true);
  });
  document.addEventListener('keyup', function (e) { if (fcKey(e) && (e.code === 'Space' || e.key === ' ' || e.key === 'Enter')) e.preventDefault(); });

  /* ---------- Vista: Notación ---------- */
  var nt = { cube: null, mod: '', q: Promise.resolve() };
  var MOVE_TXT = {
    R: 'La cara derecha. Sentido normal: horario mirándola desde la derecha (la fila de adelante sube).', L: 'La cara izquierda. Sentido normal: horario mirándola desde la izquierda (la fila de adelante baja).',
    U: 'La cara de arriba. Sentido normal: horario mirándola desde arriba.', D: 'La cara de abajo. Sentido normal: horario mirándola desde abajo.',
    F: 'La cara del frente. Sentido normal: horario mirándola de frente.', B: 'La cara de atrás. Sentido normal: horario mirándola desde atrás.',
    r: 'R ancho: la cara derecha junto con la capa del medio.', l: 'L ancho: la cara izquierda junto con la capa del medio.', u: 'U ancho: la cara de arriba junto con la capa del medio.',
    d: 'D ancho: la cara de abajo junto con la capa del medio.', f: 'F ancho: la cara del frente junto con la capa del medio.', b: 'B ancho: la cara de atrás junto con la capa del medio.',
    M: 'La capa del medio entre izquierda y derecha. Gira en el mismo sentido que L.', E: 'La capa del medio entre arriba y abajo. Gira en el mismo sentido que D.', S: 'La capa del medio entre frente y atrás. Gira en el mismo sentido que F.',
    x: 'El cubo entero, en el sentido de R. No es un giro de capa: cambias cómo lo sostienes.', y: 'El cubo entero, en el sentido de U.', z: 'El cubo entero, en el sentido de F.'
  };
  var MOD_TXT = { '': 'Sin marca: un cuarto de vuelta en su sentido normal.', "'": 'Con apóstrofo: un cuarto de vuelta al revés.', '2': 'Con un 2: media vuelta.' };
  function initNotacion() {
    if (nt.cube) return;
    nt.cube = new Cube3D($('#not-cubo'), { white: true });
    function run(alg, label, txt) {
      $('#not-lee').innerHTML = ''; $('#not-lee').appendChild(h('b', { text: label })); $('#not-lee').appendChild(document.createTextNode(txt));
      Cube.parse(alg).forEach(function (m) { nt.q = nt.q.then(function () { return nt.cube.move(m, 380); }).catch(function () { }); });
    }
    $('#not-reset').addEventListener('click', function () { nt.q = Promise.resolve(); nt.cube.setState(Cube.solved()); $('#not-lee').textContent = 'Toca una letra para ver el giro en el cubo.'; });
    var der = $('#not-der'), mods = h('div', { class: 'filtros', role: 'group', 'aria-label': 'Tipo de giro' });
    function paintMods() {
      mods.textContent = '';
      [['', 'R  normal'], ["'", "R'  al revés"], ['2', 'R2  doble']].forEach(function (m) { mods.appendChild(h('button', { class: 'chip mono', 'aria-pressed': nt.mod === m[0] ? 'true' : 'false', text: m[1], onclick: function () { nt.mod = m[0]; paintMods(); } })); });
    }
    paintMods();
    der.appendChild(h('div', { class: 'fam' }, [h('h2', { text: '¿Cuál es el frente?' }),
      h('p', { text: 'El frente (F) es la cara que te mira cuando sostienes el cubo. No es un color fijo: depende de cómo lo tengas en la mano. Desde ahí se nombran las demás: U arriba, D abajo, R a tu derecha, L a tu izquierda y B atrás.' }),
      h('p', { text: 'En los cubos 3D, la etiqueta FRENTE del suelo marca ese lado y no se mueve aunque cambien los colores. En los diagramas vistos desde arriba, el frente es el borde de abajo.' }),
      h('div', { class: 'acc' }, [h('button', { class: 'btn sm', text: 'Probar: girar el cubo entero (y)', onclick: function () { run('y', 'y', ' El verde se fue a la izquierda y ahora el frente es otro color. La etiqueta sigue en su sitio: el frente es una posición, no una cara pintada.'); } })]),
      h('p', { text: 'En esta página, los casos de OLL y PLL parten con amarillo arriba y verde al frente. Aquí en Notación, con blanco arriba y verde al frente.' })]));
    der.appendChild(h('div', { class: 'fam' }, [h('h2', { text: 'Cómo se lee un algoritmo' }),
      h('p', { text: 'Cada letra es una capa. Sola, gira un cuarto de vuelta en sentido horario mirando esa cara de frente. Con apóstrofo (R\') gira al revés, y con un 2 (R2) da media vuelta. Elige el tipo de giro y toca las letras.' }), mods]));
    [['Caras', 'Las seis caras, en mayúscula. Con F2L ya usas casi todas.', 'RLUDFB'],
     ['Giros anchos', 'En minúscula: la cara y la capa del medio se mueven juntas. Aparecen mucho en OLL (r, l, f).', 'rludfb'],
     ['Capas del medio', 'M es la más usada: está en las PLL de aristas (Ua, Ub, H, Z).', 'MES'],
     ['Cubo entero', 'x, y, z giran todo el cubo en la mano. No cuentan como movimiento.', 'xyz']].forEach(function (f) {
      der.appendChild(h('div', { class: 'fam' }, [h('h3', { text: f[0] }), h('p', { text: f[1] }), h('div', { class: 'teclas' }, f[2].split('').map(function (b) {
        return h('button', { class: 'tecla', text: b, 'aria-label': 'Giro ' + b, onclick: function () { run(b + nt.mod, b + nt.mod, MOVE_TXT[b] + ' ' + MOD_TXT[nt.mod]); } });
      }))]));
    });
    der.appendChild(h('div', { class: 'fam' }, [h('h3', { text: 'Gatillos' }),
      h('p', { text: 'Secuencias cortas que se repiten dentro de muchos algoritmos. Si las haces de un tirón, un OLL de 10 movimientos pasa a ser 3 gestos. En los casos aparecen subrayadas, con su nombre debajo. Puedes editar esta lista en Personalizar.' }),
      h('div', { class: 'gat', id: 'not-gat' })]));
    nt.run = run; renderGatNotacion();
    der.appendChild(h('div', { class: 'fam' }, [h('h3', { text: 'Paréntesis y ajustes' }),
      h('p', { text: 'Un (U) entre paréntesis es un ajuste de la capa de arriba: se hace para dejar el caso en el ángulo correcto antes del algoritmo, o para alinear la capa al terminar. En competencia se le dice AUF.' })]));
  }

  /* ---------- Estilos completos de la interfaz ---------- */
  var ESTILOS = [
    ['base', 'Pizarra', 'El diseño original: claro u oscuro, con acento cobalto.', ['#eceff4', '#1b4fd6', '#131926', '#f6d21c']],
    ['crono', 'Cronómetro', 'Oscuro, pantallas tipo LCD y menú lateral.', ['#101215', '#aebba3', '#e5483f', '#e9ecef']],
    ['pop', 'Juguete pop', 'Colores vivos, bordes gruesos y tarjetas grandes.', ['#eef6ff', '#ff7a00', '#17142b', '#1ea34a']],
    ['mini', 'Minimal compacto', 'Denso y sobrio: los casos en lista.', ['#f7f7f5', '#0f766e', '#1c1c1a', '#e2e2dd']]
  ];
  function applyEstilo() { document.documentElement.setAttribute('data-estilo', store.prefs.estilo || 'base'); }

  /* ---------- Mi cubo: marca propia en el centro blanco ---------- */
  function svgUri(body) { return 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>" + body + '</svg>'); }
  var INK = '#1a1d24';
  var EMB = [
    ['Estrella', svgUri("<path fill='" + INK + "' d='M12 1c1 6 4 9 11 11-7 2-10 5-11 11-1-6-4-9-11-11 7-2 10-5 11-11z'/>")],
    ['Rayo', svgUri("<path fill='" + INK + "' d='M14 1 4 14h6l-2 9 12-14h-7z'/>")],
    ['Hexágono', svgUri("<path fill='none' stroke='" + INK + "' stroke-width='2.4' stroke-linejoin='round' d='M12 2 20.7 7v10L12 22 3.3 17V7z'/><circle cx='12' cy='12' r='3.3' fill='" + INK + "'/>")],
    ['Espiral', svgUri("<path fill='none' stroke='" + INK + "' stroke-width='2.4' stroke-linecap='square' d='M12 12h3V9H9v6h9V6H6v12h14'/>")],
    ['Rombo', svgUri("<path fill='" + INK + "' fill-rule='evenodd' d='M12 1.5 22.5 12 12 22.5 1.5 12zM12 7.5 7.5 12l4.5 4.5 4.5-4.5z'/>")]
  ];
  function applyMarca() {
    var m = store.prefs.marca, st = document.documentElement.style, img = 'none', txt = '""';
    if (m.k === 'img' && m.img) img = 'url("' + m.img + '")';
    else if (/^e[0-4]$/.test(m.k)) img = 'url("' + EMB[+m.k.charAt(1)][1] + '")';
    else if (m.k === 'txt' && m.txt) txt = JSON.stringify(m.txt);
    st.setProperty('--marca-img', img); st.setProperty('--marca-txt', txt);
    st.setProperty('--marca-fs', String([0.36, 0.36, 0.36, 0.27, 0.21][m.txt.length] || 0.36));
  }
  var aj = { dlg: $('#ajustes'), cube: null, host: null };
  function setMarca(k) { store.prefs.marca.k = k; touch(); applyMarca(); renderAjustes(); }
  function renderAjustes() {
    var m = store.prefs.marca, box = $('#aj'); box.textContent = '';
    function opt(k, label, inner) {
      return h('button', { class: 'marca-b', 'aria-pressed': m.k === k ? 'true' : 'false', onclick: function () { setMarca(k); } }, [inner, h('span', { text: label })]);
    }
    var msg = h('p', { class: 'msg bad', role: 'status' });
    box.appendChild(h('div', { class: 'det-h' }, [h('div', null, [h('h2', { id: 'aj-titulo', text: 'Personalizar' })]),
      h('button', { class: 'btn sm x', 'aria-label': 'Cerrar', html: ICON.x, onclick: function () { aj.dlg.close(); } })]));
    box.appendChild(h('div', { class: 'bloque' }, [h('p', { class: 'eyebrow', text: 'Estilo de la app' }),
      h('div', { class: 'estilos' }, ESTILOS.map(function (e) {
        return h('button', { class: 'estilo-b', 'aria-pressed': store.prefs.estilo === e[0] ? 'true' : 'false', onclick: function () { store.prefs.estilo = e[0]; touch(); applyEstilo(); renderAjustes(); } }, [
          h('span', { class: 'estilo-mues', style: 'background:' + e[3][0] }, e[3].slice(1).map(function (col) { return h('i', { style: 'background:' + col }); })),
          h('b', { text: e[1] }), h('span', { text: e[2] })
        ]);
      })),
      store.prefs.estilo === 'crono' ? h('p', { class: 'nota', text: 'Este estilo es siempre oscuro, como la pantalla de un cronómetro.' }) : null
    ]));
    var conGuia = CASES.filter(function (c) { return c.guia && !guiaDe(c, c.a); });
    var usando = conGuia.filter(function (c) { return guiaDe(c, algOf(c)); }).length;
    box.appendChild(h('div', { class: 'bloque' }, [h('p', { class: 'eyebrow', text: 'Algoritmos de tus guías' }),
      h('p', { class: 'nota', text: 'En ' + conGuia.length + ' casos tus guías (OLL, PLL y F2L reducidos) usan un algoritmo distinto al de la app. Ahora usas el de la guía en ' + usando + '. Los de la guía llevan la marca «Guía».' }),
      h('div', { class: 'acc' }, [
        h('button', { class: 'btn sm', text: 'Usar los de mis guías', onclick: function () { conGuia.forEach(function (c) { if (!guiaDe(c, algOf(c))) P(c.id).alg = (c.alt || []).filter(function (x) { return guiaDe(c, x); })[0] || ''; }); touch(); renderAjustes(); refreshAll(); toast('Ahora usas los algoritmos de tus guías'); } }),
        h('button', { class: 'btn sm', text: 'Volver a los de la app', onclick: function () { conGuia.forEach(function (c) { if (guiaDe(c, algOf(c))) P(c.id).alg = ''; }); touch(); renderAjustes(); refreshAll(); toast('Volviste a los algoritmos de la app'); } })
      ])]));
    box.appendChild(trigEditor());
    box.appendChild(h('p', { class: 'eyebrow', text: 'Tu cubo' }));
    box.appendChild(h('div', { class: 'escena' }, [aj.host]));
    var kids = [opt('none', 'Sin marca', h('i'))];
    EMB.forEach(function (e, i) { kids.push(opt('e' + i, e[0], h('i', { style: 'background-image:url("' + e[1] + '")' }))); });
    kids.push(opt('txt', 'Mis iniciales', h('i', { text: m.txt || 'Aa' })));
    kids.push(opt('img', 'Mi imagen', h('i', { style: m.img ? 'background-image:url("' + m.img + '")' : null, text: m.img ? '' : '+' })));
    box.appendChild(h('div', { class: 'bloque' }, [h('p', { class: 'eyebrow', text: 'Marca en el centro blanco' }), h('div', { class: 'marcas' }, kids)]));
    if (m.k === 'txt') {
      var inp = h('input', { type: 'text', id: 'marca-txt', maxlength: '4', value: m.txt, placeholder: 'Hasta 4 letras', 'aria-label': 'Iniciales', autocomplete: 'off' });
      inp.addEventListener('input', function () { store.prefs.marca.txt = limpiaTxt(inp.value); touch(); applyMarca(); });
      box.appendChild(h('div', { class: 'campo' }, [inp]));
    }
    if (m.k === 'img') {
      var file = h('input', { type: 'file', id: 'marca-img', accept: 'image/*', 'aria-label': 'Imagen para el centro' });
      file.addEventListener('change', function () {
        var f = file.files && file.files[0]; if (!f) return;
        if (!/^image\//.test(f.type)) { msg.textContent = 'Ese archivo no es una imagen. Prueba con un PNG o JPG.'; return; }
        var rd = new FileReader();
        rd.onload = function () {
          var im = new Image();
          im.onload = function () {
            var cv = document.createElement('canvas'); cv.width = cv.height = 128;
            var sc = Math.min(128 / im.width, 128 / im.height), w = im.width * sc, hh = im.height * sc;
            cv.getContext('2d').drawImage(im, (128 - w) / 2, (128 - hh) / 2, w, hh);
            var url = cv.toDataURL('image/png');
            if (url.length >= 200000) { msg.textContent = 'La imagen tiene demasiado detalle para guardarla. Prueba con una más simple.'; return; }
            store.prefs.marca.img = url; store.prefs.marca.k = 'img'; touch(); applyMarca(); renderAjustes();
          };
          im.onerror = function () { msg.textContent = 'No se pudo leer esa imagen. Prueba con un PNG o JPG.'; };
          im.src = rd.result;
        };
        rd.readAsDataURL(f);
      });
      box.appendChild(h('div', { class: 'bloque' }, [file, h('p', { class: 'nota', text: 'Un dibujo tuyo, tu firma o el emblema de tu club. Se guarda reducida a 128 px; lo mejor es fondo blanco o transparente.' }), msg]));
    }
    box.appendChild(h('p', { class: 'nota', text: 'La marca aparece en el centro blanco de todos los cubos. En los casos de OLL y PLL el blanco queda abajo: arrastra el cubo para verla.' }));
  }
  function trigEditor() {
    var wrap = h('div', { class: 'bloque' }), rows = h('div', { class: 'trig-lista' });
    function save(list) { store.prefs.trigs = list; touch(); }
    function current() { return (store.prefs.trigs || trigList()).map(function (t) { return { n: t.n, a: t.a }; }); }
    function paint() {
      rows.textContent = '';
      current().forEach(function (t, i) {
        var msg = h('p', { class: 'msg bad trig-msg' });
        function check() { var ms = Cube.parse(inA.value); msg.textContent = !inN.value.trim() ? 'Ponle un nombre.' : ms.length < 2 ? 'Escribe al menos 2 movimientos.' : ms.length > 30 ? 'Máximo 30 movimientos.' : ''; }
        var inN = h('input', { type: 'text', id: 'trig-n-' + i, value: t.n, maxlength: '30', placeholder: 'Nombre', 'aria-label': 'Nombre del movimiento ' + (i + 1), autocomplete: 'off' });
        var inA = h('input', { type: 'text', id: 'trig-a-' + i, value: t.a, class: 'mono', placeholder: "R U R' U'", 'aria-label': 'Movimientos de ' + (t.n || 'la fila ' + (i + 1)), autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
        function upd() { var l = current(); l[i] = { n: inN.value, a: inA.value }; save(l); check(); }
        inN.addEventListener('input', upd); inA.addEventListener('input', upd);
        inN.addEventListener('change', refreshAlgViews); inA.addEventListener('change', refreshAlgViews);
        rows.appendChild(h('div', { class: 'trig-fila' }, [inN, inA, h('button', { class: 'btn sm', 'aria-label': 'Quitar ' + (t.n || 'fila'), html: ICON.x, onclick: function () { var l = current(); l.splice(i, 1); save(l); paint(); refreshAlgViews(); } }), msg]));
        check();
      });
    }
    var on = h('input', { type: 'checkbox', id: 'trig-on' }); on.checked = store.prefs.trigOn !== false;
    on.addEventListener('change', function () { store.prefs.trigOn = on.checked; touch(); refreshAlgViews(); });
    wrap.appendChild(h('p', { class: 'eyebrow', text: 'Movimientos con nombre' }));
    wrap.appendChild(h('p', { class: 'nota', text: 'Cuando un algoritmo contiene una de estas secuencias, la app la agrupa y le pone el nombre debajo, en todas las pantallas.' }));
    wrap.appendChild(h('label', { class: 'check', for: 'trig-on' }, [on, ' Mostrar los nombres en los algoritmos']));
    wrap.appendChild(rows);
    wrap.appendChild(h('div', { class: 'acc' }, [
      h('button', { class: 'btn sm', text: 'Agregar movimiento con nombre', onclick: function () { var l = current(); l.push({ n: '', a: '' }); save(l); paint(); var last = rows.querySelector('.trig-fila:last-child input'); if (last) last.focus(); } }),
      h('button', { class: 'btn sm', text: 'Restablecer predeterminados', onclick: function () { store.prefs.trigs = null; store.prefs.trigOn = true; on.checked = true; touch(); paint(); refreshAlgViews(); toast('Lista de movimientos con nombre restablecida'); } })
    ]));
    paint();
    return wrap;
  }
  function openAjustes() {
    if (!aj.cube) { aj.host = h('div'); aj.cube = new Cube3D(aj.host, { white: true }); aj.cube.rx = -38; aj.cube.view(); }
    renderAjustes();
    if (!aj.dlg.open) { if (aj.dlg.showModal) aj.dlg.showModal(); else aj.dlg.setAttribute('open', ''); }
    aj.cube.layout();
  }
  aj.dlg.addEventListener('click', function (e) { if (e.target === aj.dlg) aj.dlg.close(); });
  $('#btn-cubo').addEventListener('click', openAjustes);

  /* ---------- Tema claro u oscuro ---------- */
  var temaBase = document.documentElement.getAttribute('data-theme');   /* lo que haya fijado el visor */
  function temaActual() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTema() {
    var t = store.prefs.tema, r = document.documentElement;
    if (t === 'dark' || t === 'light') r.setAttribute('data-theme', t);
    else if (temaBase) r.setAttribute('data-theme', temaBase); else r.removeAttribute('data-theme');
    var osc = temaActual() === 'dark';
    $('#btn-tema').innerHTML = (osc ? ICON.sol : ICON.luna) + '<span>' + (osc ? 'Modo claro' : 'Modo oscuro') + '</span>';
  }
  $('#btn-tema').addEventListener('click', function () { store.prefs.tema = temaActual() === 'dark' ? 'light' : 'dark'; touch(); applyTema(); });

  function renderGatNotacion() {
    var box = document.getElementById('not-gat'); if (!box || !nt.run) return; box.textContent = '';
    var list = trigList().filter(trigValid);
    if (!list.length) { box.appendChild(h('p', { class: 'nota', text: 'No hay movimientos con nombre. Agrégalos en Personalizar.' })); return; }
    list.forEach(function (t) {
      var def = TRIG_DEF.filter(function (d) { return d.n === t.n && Cube.str(Cube.parse(d.a)) === Cube.str(Cube.parse(t.a)); })[0];
      var alg = Cube.str(Cube.parse(t.a));
      box.appendChild(h('button', { onclick: function () { nt.q = Promise.resolve(); nt.cube.setState(Cube.solved()); nt.run(alg, t.n, ' ' + alg + (def ? '. ' + def.d : '.')); } }, [h('b', { text: alg }), h('span', { text: t.n + (def ? '. ' + def.d : '') })]));
    });
  }
  /* Volver a dibujar todo lo que muestra algoritmos cuando cambia la lista de nombres */
  function refreshAlgViews() { rebuildTrig(); if (ui.view === 'casos') renderCasos(); if (dlg.open && det.c) renderDetalle(); renderGatNotacion(); if (ui.view === 'tarjetas' && fc.cur && fc.open) { fc.open = false; fcNext(); } }

  /* ---------- Navegación e inicio ---------- */
  function setView(v) {
    if (['casos', 'practicar', 'tarjetas', 'notacion'].indexOf(v) < 0) v = 'casos';
    ui.view = v;
    ['casos', 'practicar', 'tarjetas', 'notacion'].forEach(function (n) { $('#v-' + n).hidden = n !== v; $('#tab-' + n).setAttribute('aria-selected', n === v ? 'true' : 'false'); });
    if (v !== 'practicar') { stopTimer(); if (pr.pl) pr.pl.halt(); }
    if (v === 'casos') renderCasos();
    if (v === 'practicar') { setOptions(); $('#pr-auf').checked = store.prefs.auf; if (!pr.cur || pr.phase === 'idle') nextCase(); else pr.cube.layout(); renderSesion(); }
    if (v === 'tarjetas') { fcOptions(); if (!fc.cur) fcNext(); }
    if (v === 'notacion') { initNotacion(); nt.cube.layout(); }
    try { history.replaceState(null, '', '#' + v); } catch (e) { }
  }
  function refreshAll() { dgCache = {}; rebuildTrig(); applyEstilo(); applyMarca(); applyTema(); if (aj.dlg.open) renderAjustes(); if (ui.view === 'casos') renderCasos(); if (ui.view === 'practicar') { setOptions(); $('#pr-auf').checked = store.prefs.auf; } if (ui.view === 'tarjetas') fcOptions(); if (dlg.open && det.c) renderDetalle(); }
  Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (t) { t.addEventListener('click', function () { setView(t.dataset.v); }); });
  loadLocal(); rebuildTrig(); applyEstilo(); applyMarca(); applyTema();
  var first = 0, n;
  for (n = 1; n <= STAGES.length && !first; n++) if (stageCases(n).some(function (c) { return peek(c.id).s === 1; })) first = n;
  for (n = 1; n <= STAGES.length && !first; n++) if (stageCases(n).some(function (c) { return peek(c.id).s !== 2; })) first = n;
  ui.stage = first || 1;
  setView((location.hash || '').replace('#', '') || 'casos');
  initRemote();
})();
