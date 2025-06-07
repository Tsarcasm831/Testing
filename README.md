# Remnants of Earth

"Remnants of Earth" is a web-based homage to the classic post-apocalyptic title "Remnants of Destruction." It aims to recreate that game's gritty atmosphere by building a dynamic "living map" where players can explore factions, events and units directly from the browser.

## Purpose
This project acts as a modern re‑imagining of the original game. It uses Leaflet.js and other web technologies to present a map-centric hub where players interact with game elements and prepare for tactical scenarios. The long‑term goal is an expandable world that honors the tone of the inspiration.

## Features
- **Leaflet map** with grid overlays and subgrid scanning.
- **Modal windows** for factions, bestiary, GDD viewer and more.
- **Event preparation modal** with tabs for team setup, loadouts, briefing and intel.

## Quick Start
1. Serve the repository as static files. For example using Python:
   ```bash
   python3 -m http.server
   ```
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in `index.html` and `components/head.html` with your API key (or inject it via a `GOOGLE_MAPS_API_KEY` environment variable if your server supports substitution).
3. Open `http://localhost:8000` in a browser and explore the map.

See the [Game Design Document modal](./components/gdd-modal.html) for a full overview of the project's vision and gameplay concepts.
