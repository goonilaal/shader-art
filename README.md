# Shader Art — The tile, alive

The cross-stitch background tile from [ucalyptus.me](https://ucalyptus.me), alive.

The page opens on the site background exactly: the same motifs, stitch for stitch, at the same 720px tile size and faint ink (`#141414` under a 0.88 white scrim). It then eases into motion. Every mark is a real *x* stitch drawn on a canvas, so nothing is warped or resampled.

Each motif moves like its own organism:

- **The centre stays still.** Stitches within three stitches of the middle never move.
- **The arms contract and expand.** Every arm stretches and shortens along its length by up to 20%. Each beat contracts fast and relaxes slowly. It starts at the root and reaches the tips later, so the arm ripples.
- **One side reaches further.** The strongest side turns slowly, and the tips curl to the side like tentacles.
- **Each motif has its own rhythm.** Period and phase differ per motif, so the tile never pulses in unison.

Click a motif to startle it: the arms snap in, then ripple back out. Controls: Pause, Full ink, Drift (slow pan) and Tempo. With reduced motion on, you see the still tile.

URL options: `?bare` hides the UI (for embedding as a background), `?ink=full`, `?drift`.

## Files

- `index.html`: the renderer and the motion. It uses Canvas 2D and has no dependencies. The tuning constants (`CORE`, `PULSE`, `LAG`, `CURL`) sit at the top of the script.
- `stitches.js`: motif shapes and positions. It is generated, so don't edit it by hand.
- `scripts/extract-stitches.py`: regenerates `stitches.js` from the site's SVG tile:

  ```sh
  python3 scripts/extract-stitches.py ../ucalyptus.github.io/assets/images/stitch-tile-ink.svg > stitches.js
  ```

Serve the folder over HTTP (`python3 -m http.server`) or open `index.html` directly.
