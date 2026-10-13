/* Algoritmos de las guías de myrubik.com (OLL, PLL y F2L reducidos), tal como aparecen impresos */
var GUIAS = [
  { kind: 'oll', name: 'OLL reducido', algs: ["R U2 R' U' R U R' U' R U' R'", "R U2 R2 U' R2 U' R2 U2 R", "L' U R U' L U R'", "R U' L' U R' U' L", "R2 D' R U2 R' D R U2 R", "r U R' U' r' F R F'", "R' F' L' F R F' L F"] },
  { kind: 'pll', name: 'PLL reducido', algs: ["l' U R' D2 R U' R' D2 R2", "R U' R U x U F' U F U2 R U R' U' R'", "M2 U M2 U2 M2 U M2", "M2 U' M2 U' M' U2 M2 U2 M' U2", "R' U R' U' R' U' R' U R U R2", "R U R' U R' U' R2 U' R' U R' U R U2"] },
  { kind: 'f2l', name: 'F2L reducido', algs: ["U R U' R'", "U' F' U F", "F' U' F", "R U R'",
    "R U' R' U R U' R' U2", "U' R' U2 R U F' U' F", "R U' R' U2 F' U' F", "F' U F U2 R U R'",
    "U' R U' R' U R U R'", "d R' U R U' R' U' R", "U F' U' F U2 F' U F", "U' R U R' U' R U2 R'",
    "U' R U R' U R U R'", "U' R U' R' U F' U' F", "y' U' R' U2 R U2 R' U R", "U' R U2 R' U2 R U' R'",
    "R U R' U2 R U R' U' R U R'", "R U R' U R U2 R' F' U2 F", "F' U2 F U F' U' F", "R U2 R' U' R U R'",
    "U' F' U2 F U' F' U F", "U R U2 R' U R U' R'", "U2 R U R' U R U' R'", "U2 F' U' F U' F' U F"] }
];
if (typeof module !== 'undefined') module.exports = GUIAS;
