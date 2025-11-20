# Codex-

This repository now includes a runnable CapCut-style web demo alongside the design blueprint.

## What's here
- `capcut_design.md`: Product and UX blueprint for a CapCut-style editor.
- `index.html`, `style.css`, `script.js`: A static front-end prototype with timeline, preview, text overlays, and markers.

## How to run
The demo is a static page. From the repo root, start a simple server and open the URL in your browser:

```bash
python -m http.server 8000
```

Then navigate to [http://localhost:8000](http://localhost:8000) to interact with the editor UI. Use the **Add B-Roll Clip** and **Add Text Overlay** buttons to populate the timeline and adjust properties in the Inspector.
