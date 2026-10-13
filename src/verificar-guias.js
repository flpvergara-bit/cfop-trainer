/* Comprueba los algoritmos de las guías impresas (guias.js) contra los casos de la app.
   Uso: node src/verificar-guias.js */
const C = require('./engine.js'), G = require('./guias.js'), D = require('./data.js'), F = require('./f2l-data.js');
const kindOf = c => c.set === 'F2L' ? 'f2l' : c.set === 'F2Lb' ? c.k : c.set === 'EO' ? 'eo' : (c.id.startsWith('OLL') ? 'oll' : 'pll');
const all = D.concat(F).map(c => Object.assign({}, c, { kind: kindOf(c) }));
all.forEach(c => { c.sig = C.check(c.a, c.kind).sig; });
const norm = a => C.str(C.parse(a));
let malos = 0;
for (const g of G) {
  console.log('== ' + g.name);
  g.algs.forEach((a, i) => {
    const r = C.check(a, g.kind);
    if (!r.ok) { malos++; console.log(String(i + 1).padStart(2), 'NO VÁLIDO ', a, '-', r.why); return; }
    const c = all.find(x => x.kind === g.kind && x.sig === r.sig);
    const rel = norm(a) === norm(c.a) ? 'igual al principal' : 'distinto (alternativa)';
    console.log(String(i + 1).padStart(2), (c.id + ' ' + (c.n || c.name || '')).padEnd(26), rel.padEnd(24), a);
  });
}
console.log(malos ? malos + ' algoritmo(s) de las guías no son válidos (erratas conocidas)' : 'Todos los algoritmos de las guías son válidos');
