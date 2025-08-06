# MP - Minimalist 3D Multiplayer Prototype

This project is an experimental web-based game built with [Three.js](https://threejs.org/). It demonstrates a lightweight multiplayer world with AI-assisted building tools.

## Features
- **Character creator** – enter a text prompt and the AI assembles primitive shapes into a humanoid character.
- **Building tools** – construct objects in the world using basic and advanced build modes.
- **Multiplayer** – synchronise player positions, chat and builds via WebSockets.
- **Day/night cycle** – dynamic lighting tied to the server's clock.

## Technology stack
- [Three.js](https://threejs.org/) for 3D rendering
- Optional WebSocket room for real-time communication
- Simple AI builder modules for generating characters and structures
- Vanilla JavaScript modules and import maps

## Getting started
1. Install [Node.js](https://nodejs.org/) 18 or later.
2. Run `npm install` to install project dependencies (none are required but this ensures the environment is ready).
3. Start a local web server from the project root. Any static server works:
   ```bash
   npx http-server -c-1 -p 8080
   # or
   python -m http.server 8080
   ```
   Loading the project directly from `file://` may fail due to browser security restrictions.
4. Open `http://localhost:8080` in your browser.

Multiplayer features require a compatible WebSocket server. When none is available, the world still loads in single-player mode.

## Architecture overview
`Game.js` orchestrates scene setup and delegates to small modules for player creation, world generation, UI managers and multiplayer handlers. Build tools send updates to the server through the `MultiplayerManager`, while `World` and `GridManager` generate the environment. This modular layout keeps rendering, input and network logic separate so new features can be added with minimal friction.
