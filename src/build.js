/* Une las piezas en un solo HTML: dist/cfop-trainer.html
   Uso (desde la carpeta del proyecto):  node src/build.js */
const fs = require('fs'), path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const strip = s => s.replace(/\nif \(typeof module[^\n]*\n?/g, '\n');
const out = src('head.html') + src('body.html') +
  '<script>\n' + ['engine.js', 'data.js', 'f2l-data.js', 'guias.js'].map(f => strip(src(f))).join('\n') + '\n' + src('app.js') + '</script>\n';
const dest = path.join(__dirname, '..', 'dist', 'cfop-trainer.html');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log('Listo:', path.relative(process.cwd(), dest), '(' + out.length + ' bytes)');
/* Página para GitHub Pages: el mismo contenido dentro de un documento HTML completo */
const web = path.join(__dirname, '..', 'docs', 'index.html');
fs.mkdirSync(path.dirname(web), { recursive: true });
const SITE = 'https://flpvergara-bit.github.io/cfop-trainer/';
const TITLE = 'CFOP Trainer – Learn F2L, OLL & PLL for the Rubik\'s Cube | Entrenador CFOP';
const DESC = 'Free CFOP trainer: learn and practice F2L, OLL and PLL algorithms with an animated 3D cube, random practice cards and beginner 2-look or full methods. Aprende y practica F2L, OLL y PLL del cubo Rubik con algoritmos y práctica aleatoria.';
const ld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'CFOP Trainer', alternateName: 'Entrenador CFOP', url: SITE, description: DESC, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', inLanguage: ['en', 'es'], offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } });
const head = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '<title>' + TITLE + '</title>\n<meta name="description" content="' + DESC + '">\n' +
  '<meta name="keywords" content="CFOP, F2L, OLL, PLL, Rubik, Rubik\'s cube, speedcubing, algorithms, algoritmos, cubo de Rubik">\n' +
  '<link rel="canonical" href="' + SITE + '">\n<link rel="icon" type="image/svg+xml" href="favicon.svg">\n' +
  '<meta property="og:type" content="website">\n<meta property="og:site_name" content="CFOP Trainer">\n<meta property="og:title" content="CFOP Trainer – Learn F2L, OLL & PLL">\n<meta property="og:description" content="Learn and practice F2L, OLL and PLL with an animated 3D cube. Aprende y practica el método CFOP.">\n<meta property="og:url" content="' + SITE + '">\n<meta property="og:image" content="' + SITE + 'og.png">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n' +
  '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="CFOP Trainer – Learn F2L, OLL & PLL">\n<meta name="twitter:description" content="Learn and practice F2L, OLL and PLL with an animated 3D cube.">\n<meta name="twitter:image" content="' + SITE + 'og.png">\n' +
  '<script type="application/ld+json">' + ld + '</script>\n' +
  '<style>body{margin:0}[hidden]{display:none!important}</style>\n</head>\n<body>\n';
fs.writeFileSync(web, head + out.replace('<title>CFOP Trainer</title>\n', '') + '</body>\n</html>\n');
const dd = path.dirname(web);
fs.writeFileSync(path.join(dd, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + 'sitemap.xml\n');
fs.writeFileSync(path.join(dd, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>' + SITE + '</loc><lastmod>' + new Date().toISOString().slice(0, 10) + '</lastmod></url>\n</urlset>\n');
fs.writeFileSync(path.join(path.dirname(web), '.nojekyll'), '');
console.log('Listo:', path.relative(process.cwd(), web));
