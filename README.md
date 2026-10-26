# Shader Art — The tile, alive

The cross-stitch motifs from the [ucalyptus.me](https://ucalyptus.me) background, alive. Like snowflakes, no two are alike.

The page uses the site's stitch geometry, scale and faint ink (`#141414` under a 0.88 white scrim), and fills the window at the site's density of 12 motifs per 720px square. Each of the site's five original motifs appears once. The rest are grown fresh on every visit, and every organism on screen has a different design. Every mark is a real *x* stitch drawn on a canvas.

## Designs

`designs.js` grows each motif the way a snowflake forms. It builds one eighth of the motif and mirrors it into all eight symmetries of the square. Each design picks at random from these parts:

- **Core:** a dot, ring, disc, filled square or diamond.
- **Arms:** straight and/or diagonal, solid or a running stitch, sometimes with a thick root.
- **Branches:** side branches and feathers along the arms.
- **Tips:** T-bars, arrows, forks, diamonds, blobs, anchors, petals or hooks.
- **Rings:** nested squares, diamonds or circles, solid or dotted.

Every design is checked against the site's originals and the rest of the brood, so none repeat.

## Motion

- **The centre stays still.** Stitches within three stitches of the middle never move.
- **The arms contract and expand.** Every arm stretches and shortens along its length by up to 20%. Each beat contracts fast and relaxes slowly. It starts at the root and reaches the tips later, so the arm ripples. One side reaches further, and the tips curl like tentacles.
- **Each organism has its own rhythm.** Period, phase, vigour and starting heading are all random.
- **It travels.** Every contraction pushes the organism along a slowly wandering heading. The window wraps at its edges.
- **It keeps its distance.** Each organism draws its own personal space at random between `SPACE_MIN` (0) and `SPACE_MAX` (6 stitches). If a neighbour comes inside that gap, it steers away. An organism with little or no space doesn't steer, so bodies can still touch. When arm tips meet, they rebound elastically, weighted by stitch count, and both organisms flinch.

Click an organism to startle it: it flinches and darts away from the pointer. Controls: Pause, Full ink, New brood and Tempo. With reduced motion on, you see the brood standing still.

URL options: `?bare` hides the UI (for embedding as a background), `?ink=full`, and `?seed=N` to bring back the same brood.

## Files

- `index.html`: the renderer, the motion and the swimming physics. It uses Canvas 2D and has no dependencies. Tuning constants sit at the top of the script: `CORE`, `PULSE`, `LAG` and `CURL` for the pulse; `THRUST`, `DRAG`, `SPACE_MIN`, `SPACE_MAX`, `AVOID` and `RESTITUTION` for travel.
- `designs.js`: the design generator.
- `stitches.js`: the site's stitch geometry and its five motifs. It is generated, so don't edit it by hand.
- `scripts/extract-stitches.py`: regenerates `stitches.js` from the site's SVG tile:

  ```sh
  python3 scripts/extract-stitches.py ../ucalyptus.github.io/assets/images/stitch-tile-ink.svg > stitches.js
  ```

Serve the folder over HTTP (`python3 -m http.server`) or open `index.html` directly.
