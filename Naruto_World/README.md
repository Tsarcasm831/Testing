# Sairon World Map Editor

This project provides a browser-based SVG overlay editor for creating and editing areas, roads, POIs, and terrain overlays on a Sairon World map.

## Development

1. Install dependencies: `npm install`
2. Start the local dev server: `npm run dev`
3. Build for production: `npm run build`
4. Preview the production build: `npm run preview`

Vite serves `index.html` from the project root so existing relative asset paths continue to work without modification.

## Land detail pages

Prebuilt land and island detail views now live under `land-pages/`. Use `node generate-land-pages.js` to regenerate them from the current defaults; the same folder contains the reusable template (`land.html`) and module (`land.js`).
