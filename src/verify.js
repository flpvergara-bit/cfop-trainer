const C = require('./engine.js'), CASES = require('./data.js'), REFS = require('./refs.js');
let bad = 0; const sigs = {};
for (const c of CASES) {
  const kind = c.id.startsWith('EO') ? 'eo' : c.id.startsWith('OLL') ? 'oll' : 'pll';
  const r = C.check(c.a, kind);
  if (!r.ok) { console.log('FALLA', c.id, c.a, r.why); bad++; continue; }
  if (kind === 'eo') continue;
  if (sigs[kind + r.sig]) { console.log('DUPLICADO', c.id, 'igual a', sigs[kind + r.sig]); bad++; }
  sigs[kind + r.sig] = c.id; c._sig = r.sig; c._count = r.count;
  // ¿queda resuelto exacto (PLL)?
  if (kind === 'pll') {
    const end = C.apply(C.clone(r.cs.state), c.a);
    const fin = C.caseState(c.a);
    let auf = null;
    for (const u of ['', 'U', 'U2', "U'"]) { const e = C.apply(C.apply(C.clone(r.cs.state), c.a), u); if (C.centersOk(e) && C.serialize(e) === C.SOLVED_STR) auf = u; }
    if (r.cs.prefix) console.log('  nota', c.id, 'prefijo de orientación', r.cs.prefix);
  }
  for (const alt of (c.alt || [])) {
    const ra = C.check(alt, kind);
    if (!ra.ok || ra.sig !== r.sig) { console.log('ALT NO COINCIDE', c.id, alt, ra.ok ? 'otro caso' : ra.why); bad++; }
    else if (ra.cs.prefix) console.log('  nota alt', c.id, alt, 'prefijo', ra.cs.prefix);
  }
  for (const ref of (REFS[c.id] || [])) {
    const rr = C.check(ref, kind);
    if (!rr.ok) { console.log('  ref inválida', c.id, ref, rr.why); continue; }
    if (rr.sig !== r.sig) { console.log('REF DISTINTA', c.id, '| mío:', c.a, '| ref:', ref); bad++; }
  }
  if (!REFS[c.id]) console.log('  sin referencia:', c.id);
}
const n = k => CASES.filter(c => c.id.startsWith(k)).length;
console.log('OLL', n('OLL'), 'PLL', CASES.length - n('OLL') - n('EO'), 'firmas distintas', Object.keys(sigs).length, 'errores', bad);
const pO = CASES.filter(c => c.id.startsWith('OLL')).reduce((s, c) => s + c._count, 0), pP = CASES.filter(c => !c.id.startsWith('OLL') && !c.id.startsWith('EO')).reduce((s, c) => s + c._count, 0);
console.log('suma estados OLL', pO, '(esperado 215)', 'PLL', pP, '(esperado 284)');
