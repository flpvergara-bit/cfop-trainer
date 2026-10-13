# CFOP Trainer · Entrenador CFOP

Página para aprender y practicar el método CFOP del cubo de Rubik 3×3: F2L (principiante y los 41 casos), OLL (57 casos) y PLL (21 casos), con cubo 3D animado, práctica cronometrada, tarjetas de repaso y guía de notación.

Todo funciona en un solo archivo HTML, sin instalar nada: `dist/cfop-trainer.html`.

## Idiomas

La app está en inglés (idioma por defecto) y en español. Se cambia con el botón **ES / EN** de arriba o en **Customize → Language**; la elección se guarda con el progreso. Los textos de los dos idiomas están juntos en `src/app.js`, como pares `L('español', 'English')`.

## Página web pública (gratis)

La app se publica con GitHub Pages en: **https://flpvergara-bit.github.io/entrenador-cubo/**

- Usa el archivo `docs/index.html`, que `build.js` genera junto con `dist/cfop-trainer.html` (es el mismo contenido como página web completa).
- Para activarla por primera vez: en GitHub, pestaña **Settings** → **Pages** → en "Branch" elige `main` y la carpeta `/docs` → **Save**.
- Cada cambio que se sube a la rama `main` actualiza la página sola en uno o dos minutos.
- En esa web el progreso se guarda en el navegador de cada persona (no se sincroniza entre dispositivos).

## Qué hay en cada carpeta

| Archivo | Qué es |
|---|---|
| `dist/cfop-trainer.html` | La página terminada. Se abre con doble clic en cualquier navegador. |
| `docs/index.html` | La misma página, lista para GitHub Pages. |
| `src/engine.js` | Simulador del cubo: aplica movimientos y comprueba que un algoritmo resuelve su caso. |
| `src/data.js` | Casos de OLL y PLL con sus algoritmos. |
| `src/f2l-data.js` | Casos de F2L (generado por `f2lgen.js`). |
| `src/guias.js` | Algoritmos de las guías impresas "OLL / PLL / F2L reducido" de myrubik.com. |
| `src/app.js`, `src/head.html`, `src/body.html` | La interfaz: pantallas, estilos y comportamiento. |
| `src/build.js` | Une todas las piezas en el HTML final de `dist/`. |
| `src/verify.js` | Verifica los 57 OLL y 21 PLL: que cada uno resuelve su caso y que no falta ninguno. |
| `src/f2lgen.js` | Verifica los algoritmos de F2L y busca con el simulador los que falten. |
| `src/verificar-guias.js` | Compara los algoritmos de las guías con los de la app. |
| `src/refs.js` | Algoritmos de referencia usados para confirmar la numeración de OLL y los nombres de PLL. |

## Cómo se verifican los algoritmos

Ningún algoritmo entra a la app sin pasar por el simulador (`engine.js`). Para cada uno se arma el caso aplicando el algoritmo al revés sobre un cubo resuelto, y se comprueba que:

- deja resuelto lo que debe (la cara amarilla en OLL, toda la capa en PLL, la pareja en F2L) sin desarmar lo demás;
- no hay dos algoritmos para el mismo caso con distinto nombre, ni casos faltantes (57 OLL, 21 PLL, 41 F2L).

## Cómo volver a generar la página (opcional)

Solo hace falta si cambias algún archivo de `src/`. Necesitas **Node.js** (gratis, en nodejs.org; instala la versión "LTS").

1. Abre una terminal:
   - **Windows:** menú Inicio, escribe `cmd` y pulsa Enter.
   - **Mac:** abre Spotlight (Cmd + Espacio), escribe `Terminal` y pulsa Enter.
2. Entra a la carpeta del proyecto. Escribe `cd ` (con un espacio), arrastra la carpeta `entrenador-cubo` a la ventana y pulsa Enter.
3. Escribe estos comandos, uno por uno, pulsando Enter después de cada uno:
   - `node src/verify.js` — revisa OLL y PLL. Al final debe decir `errores 0`.
   - `node src/verificar-guias.js` — revisa los algoritmos de las guías.
   - `node src/build.js` — crea de nuevo `dist/cfop-trainer.html`.

## Progreso

El progreso (casos dominados, tiempos, algoritmos elegidos, secciones, estilo) se guarda en el navegador. En la versión publicada dentro de Claude también se guarda en tu cuenta.

## Créditos

Algoritmos de las guías: myrubik.com. Numeración de OLL y nombres de PLL contrastados con la wiki de speedsolving.com.
