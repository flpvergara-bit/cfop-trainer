/* Une las piezas en un solo HTML: dist/entrenador-oll-pll.html
   Uso (desde la carpeta del proyecto):  node src/build.js */
const fs = require('fs'), path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const strip = s => s.replace(/\nif \(typeof module[^\n]*\n?/g, '\n');
const out = src('head.html') + src('body.html') +
  '<script>\n' + ['engine.js', 'data.js', 'f2l-data.js', 'guias.js'].map(f => strip(src(f))).join('\n') + '\n' + src('app.js') + '</script>\n';
const dest = path.join(__dirname, '..', 'dist', 'entrenador-oll-pll.html');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log('Listo:', path.relative(process.cwd(), dest), '(' + out.length + ' bytes)');
