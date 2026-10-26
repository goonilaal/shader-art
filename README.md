# Shader Art — The tile, alive

The cross-stitch background tile from [ucalyptus.me](https://ucalyptus.me), set moving.

At rest the page is the site background: the same motifs, stitch for stitch, at the same 720px tile size and faint ink (`#141414` under a 0.88 white scrim). Every mark is a real *x* stitch drawn on a canvas, so nothing is warped or resampled. Motion comes from moving stitches:

- **Crawl**: a motif moves into a neighbouring empty cell. Its leading edge goes first, the tail catches up, and a sideways ripple runs down the body.
- **Re-stitch**: a motif re-forms as another motif, turning a quarter-turn as it goes. Each stitch travels to a matched stitch in the new shape. Leftover stitches grow in or shrink away.

Click a motif to re-stitch it. Click an empty cell to pull a neighbour into it. Controls: Pause, Full ink, Drift (slow pan) and Tempo. Reduced motion shows the still tile.

URL options: `?bare` hides the UI (for embedding as a background), `?ink=full`, `?drift`.

## Files

- `index.html`: the renderer and choreography. It uses Canvas 2D and has no dependencies.
- `stitches.js`: motif shapes and the 4x4 cell grid. It is generated, so don't edit it by hand.
- `scripts/extract-stitches.py`: regenerates `stitches.js` from the site's SVG tile:

  ```sh
  python3 scripts/extract-stitches.py ../ucalyptus.github.io/assets/images/stitch-tile-ink.svg > stitches.js
  ```

Serve the folder over HTTP (`python3 -m http.server`) or open `index.html` directly.
