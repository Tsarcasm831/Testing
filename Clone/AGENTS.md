# Naruto_World Agent Guide

This repository hosts a static interactive map editor for the Naruto universe. The app renders a Konohagakure map background and overlays editable lands, roads/bridges, POIs, rivers, walls, and terrain paint layers. The code is plain HTML/CSS/JS; there is no build step.

## How the app fits together
- **Entry point:** `index.html` declares the SVG canvas (`#map`), modals, and control sidebar. It loads `app.css` for styling and `main.js`, which immediately calls `init()` from `app-core.js` to start the UI.
- **UI wiring:** `app-core.js` simply imports dependencies and delegates to `initUI()` in `ui.js`. The `ui.js` module attaches all DOM listeners, toggles drawing modes, wires modals, handles import/export buttons, and forwards pointer/keyboard input to interaction helpers.
- **State and data:** `model.js` loads the default model from `user-defaults.js` (which re-exports `defaults/index.js`). It initializes the `MODEL` object (lands, roads, poi, walls, rivers, grass, forest, mountains) and the global `state` (current mode, brush settings, edit flags, locks). Autosave/localStorage defaults are respected where available.
- **Rendering:** `render.js` (imported by `ui.js`) redraws the SVG layers (`districtLayer`, `roadLayer`, `poiLayer`, `wallLayer`, plus paint layers like `grassLayer`) based on `MODEL`. `constants.js` exposes the frequently used DOM references and viewBox dimensions.
- **Interaction helpers:** `interactions.js` contains canvas pointer handlers (`canvasDown`, `finishDrawing`, `cancelDrawing`, `select`, etc.) used by `ui.js` to manage drawing and selection logic. `utils.js` provides helpers such as coordinate conversion, clamping, element creation, downloads, and autosave/storage utilities.
- **Exports and defaults:** `export-utils.js` builds JSON, SVG, and JS exports of the current map. The `defaults/parts/` directory holds modular data definitions (lands, POI sets, terrain defaults) that are combined by `defaults/model-default.js` and surfaced through `defaults/index.js` and `user-defaults.js`.
- **Static land pages:** The `land-pages/` directory contains the land detail template (`land.html`), the supporting script (`land.js`), and the generated static `LandXX.html`/`IslandXX.html` files. Run `node generate-land-pages.js` to rebuild them from default land data.
- **Assets:** Background/texture images live alongside the HTML/JS (`Map of Naruto2.jpg`, `leaf.png`, `cloud.png`, etc.). Styling for the editor and modals resides in `app.css`.

## Working guidelines
- No build tooling is required; open `index.html` in a browser to use the editor. Keep modules ES-module friendly—imports are relative paths resolved by the browser.
- When adding new UI controls or behaviors, place DOM wiring in `ui.js`, rendering changes in `render.js`, and data mutations through `MODEL`/`state` in `model.js` helpers. Avoid mixing DOM selection logic into utility files.
- Preserve overlay layer ordering defined in `index.html` (`grass`/`forest`/`mountain` → roads/rivers → districts/walls → POI → handles) to keep visuals readable.
- Default data should flow through `defaults/` and `user-defaults.js`. If you need new seed data, extend `defaults/parts/*` and ensure `defaults/model-default.js` aggregates it.
- For new export/import formats, update `export-utils.js` alongside any parsing changes in `ui.js` file import handlers.
- Keep `MODEL` and `state` mutations centralized and ensure `drawAll()` plus `dumpJSON()/autosave()` are called after edits so UI and data exports stay in sync.

## Testing and verification
- Manual testing is expected. Open `index.html` in a modern browser and verify drawing, selection, modal edits, import/export buttons, and autosave flows.
- If you generate land pages, run `node generate-land-pages.js` and spot-check a few output HTML files to ensure titles and `data-land-id` attributes are correct.

## Scope
This guide applies to the entire repository. Add more focused AGENTS.md files in subdirectories if future changes need narrower instructions.
