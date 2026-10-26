# Minecraft block-circle rasterization demo

A small, dependency-free browser demo for generating symmetric odd or even block-circle and ellipse masks.

The demo uses a half-cell-aware center and radius convention:

```text
center = ((width - 1) / 2, (depth - 1) / 2)
radius = (width / 2, depth / 2)
```

Filled cells are selected with a normalized ellipse test. Outlines are derived from the filled mask with repeated four-neighbor erosion, keeping every outline cell inside the corresponding filled plan.

## Run it

Open `index.html` in a modern browser. No build step, package installation, server, or external JavaScript is required.

The default 15×15 one-block outline contains 40 cells. A 16×16 outline contains 44 cells because its center lies between the middle grid cells.

## CodePen

Paste `codepen.html`, `style.css`, and `script.js` into their corresponding CodePen panels.

## Full build planner

This repository intentionally stays small and focuses on the geometry. The [GamerCubic Minecraft Circle Generator](https://gamercubic.com/minecraft-circle-generator/) adds row instructions, material totals, coordinates, progress tracking, and exports.

GamerCubic is an independent project and is not affiliated with Mojang or Microsoft.

## License

MIT
