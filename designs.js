// Grows one-of-a-kind cross-stitch motifs in the style of the ucalyptus.me tile.
//
// Like a snowflake, every design is built in one eighth of the plane and
// mirrored into all eight symmetries of the square, so it always reads as a
// finished motif: a core, straight or diagonal arms, side branches, tip
// ornaments and rings. Each choice is random, so no two designs are alike.
(function () {
  "use strict";

  var MAX = 14;       // outer radius in stitches, the size of the site's largest motif
  var MIN_COUNT = 50, MAX_COUNT = 240;

  function grow(rand) {
    var cells = new Set();
    function int(a, b) { return a + Math.floor(rand() * (b - a + 1)); }
    function chance(p) { return rand() < p; }
    function pick(list) { return list[Math.floor(rand() * list.length)]; }
    // one stitch in the first octant, mirrored eight ways
    function add(x, y) {
      if (Math.hypot(x, y) > MAX + 0.5) return;
      [[x, y], [y, x], [-x, y], [-y, x], [x, -y], [y, -x], [-x, -y], [-y, -x]].forEach(function (p) {
        cells.add(p[0] + "," + p[1]);
      });
    }

    var R = int(9, MAX);   // how far the arms reach
    var x, y, i, j, k;

    // core: where the body sits still
    var c = int(1, 3), core = pick(["dot", "ring", "disc", "square", "diamond"]), e = c + 1;
    if (core === "dot") { add(0, 0); if (c > 1) add(1, 0); e = c > 1 ? 2 : 1; }
    if (core === "ring") { for (j = 0; j <= c; j++) add(c, j); if (chance(0.6)) add(0, 0); }
    if (core === "disc") { for (x = 0; x <= c; x++) for (y = 0; y <= x; y++) if (x * x + y * y <= (c + 0.5) * (c + 0.5)) add(x, y); }
    if (core === "square") {
      for (x = 0; x < c; x++) for (y = 0; y <= x; y++) add(x, y);
      for (j = 0; j <= c + 1; j++) add(c + 1, j);
      e = c + 2;
    }
    if (core === "diamond") { for (j = 0; 2 * j <= e; j++) add(e - j, j); add(0, 0); e += 1; }

    var ortho = chance(0.85), diag = chance(0.7);
    if (!ortho && !diag) ortho = true;
    var dashed = chance(0.3);   // a running stitch: every other step, like the starburst's arms

    // straight arms along the axes
    if (ortho) {
      var L = R - 1;
      for (x = e; x <= L; x++) if (!dashed || x % 2 === L % 2) add(x, 0);
      if (chance(0.35)) for (x = e; x <= int(e, L - 2); x++) add(x, 1);   // a thick root
      for (k = int(0, 3); k > 0; k--) {
        var p = int(e + 1, L - 2), len = int(1, 3), vee = chance(0.6);
        for (i = 1; i <= len; i++) add(vee ? p + i : p, i);
      }
      var w = int(1, 2);
      switch (pick(["none", "T", "arrow", "fork", "diamond", "blob", "anchor"])) {
        case "T": for (i = 1; i <= w; i++) add(L, i); break;
        case "arrow": for (i = 1; i <= w; i++) add(L - i, i); break;
        case "fork": for (i = 1; i <= w; i++) add(L + i, i); break;
        case "diamond": add(L + 1, 1); add(L + 2, 0); break;
        case "blob": add(L, 1); add(L + 1, 0); add(L + 1, 1); break;
        case "anchor": add(L, 1); add(L, 2); add(L - 1, 3); break;
      }
    }

    // diagonal arms
    if (diag) {
      var Ld = Math.floor((R - 1) / Math.SQRT2), de = Math.ceil(e / Math.SQRT2);
      for (i = de; i <= Ld; i++) if (!dashed || i % 2 === Ld % 2) add(i, i);
      if (chance(0.35)) for (i = de; i <= int(de, Ld - 1); i++) add(i + 1, i);
      for (k = int(0, 2); k > 0; k--) {
        var q = int(de + 1, Ld - 1);
        for (i = int(1, 3); i > 0; i--) add(q + i, q);   // feathers off the diagonal
      }
      var s = int(1, 2);
      switch (pick(["none", "petal", "bar", "hook"])) {
        case "petal": for (i = 0; i <= s; i++) for (j = 0; j <= s; j++) add(Ld + i, Ld - j); break;
        case "bar": for (i = 1; i <= s + 1; i++) add(Ld + i, Ld - i); break;
        case "hook": add(Ld + 1, Ld); add(Ld + 2, Ld); add(Ld + 2, Ld - 1); break;
      }
    }

    // rings: nested squares, diamonds or circles, solid or dotted
    for (k = int(0, diag ? 1 : 2); k > 0; k--) {
      var r = int(e + 2, R - 1), dotted = chance(0.5), shape = pick(["square", "diamond", "circle"]);
      if (shape === "square") for (j = 0; j <= r; j++) { if (!dotted || j % 2 === 0) add(r, j); }
      if (shape === "diamond") for (j = 0; 2 * j <= r; j++) { if (!dotted || j % 2 === 0) add(r - j, j); }
      if (shape === "circle") {
        for (i = 0; i <= Math.ceil(r * Math.PI / 4); i++) {
          if (dotted && i % 2) continue;
          var a = i / r;
          if (a <= Math.PI / 4 + 1e-9) add(Math.round(r * Math.cos(a)), Math.round(r * Math.sin(a)));
        }
      }
    }

    var flat = [];
    cells.forEach(function (key) { var xy = key.split(","); flat.push(+xy[0], +xy[1]); });
    return flat;
  }

  function signature(flat) {
    var keys = [];
    for (var i = 0; i < flat.length; i += 2) keys.push(flat[i] + "," + flat[i + 1]);
    return keys.sort().join(" ");
  }

  // `count` designs, every one different from each other and from `taken`
  // (flat [x, y, ...] arrays, e.g. the site's own motifs).
  window.growDesigns = function (rand, count, taken) {
    var seen = new Set((taken || []).map(signature)), out = [];
    while (out.length < count) {
      var flat = grow(rand), n = flat.length / 2, sig = signature(flat);
      if (n < MIN_COUNT || n > MAX_COUNT || seen.has(sig)) continue;
      seen.add(sig);
      out.push(flat);
    }
    return out;
  };
})();
