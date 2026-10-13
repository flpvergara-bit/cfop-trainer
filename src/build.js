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
/* Página para GitHub Pages: el mismo contenido dentro de un documento HTML completo */
const web = path.join(__dirname, '..', 'docs', 'index.html');
fs.mkdirSync(path.dirname(web), { recursive: true });
fs.writeFileSync(web, '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="description" content="Learn and practice F2L, OLL and PLL for the Rubik\'s cube with an animated 3D cube.">\n<style>body{margin:0}[hidden]{display:none!important}</style>\n</head>\n<body>\n' + out + '</body>\n</html>\n');
fs.writeFileSync(path.join(path.dirname(web), '.nojekyll'), '');
console.log('Listo:', path.relative(process.cwd(), web));
