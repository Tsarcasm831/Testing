import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useRef } from "react";
import { initialPlayerStats, initialInventory } from "./game/initialState.js";
import { useThreeScene } from "./hooks/useThreeScene.js";
import { usePlayerControls } from "./hooks/usePlayerControls.js";
import CharacterPanel from "./components/UI/CharacterPanel.jsx";
import { InventoryPanel } from "./components/UI/InventoryPanel.jsx";
import { WorldMapPanel } from "./components/UI/WorldMapPanel.jsx";
import { HUD } from "./components/UI/HUD.jsx";
import SettingsPanel from "./components/UI/SettingsPanel.jsx";
const OpenWorldGame = () => {
  const mountRef = useRef(null);
  const [playerStats, setPlayerStats] = useState(initialPlayerStats);
  const [inventory, setInventory] = useState(initialInventory);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 });
  const [worldObjects, setWorldObjects] = useState([]);
  const [settings, setSettings] = useState({
    shadows: true,
    shadowQuality: "medium",
    // low, medium, high
    antialiasing: true,
    grid: true,
    objectDensity: "medium",
    fpsLimit: "60 FPS"
  });
  const [showCharacter, setShowCharacter] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const uiState = {
    setShowCharacter,
    setShowInventory,
    setShowWorldMap,
    setShowSettings
  };
  const keysRef = usePlayerControls(uiState);
  const { playerRef } = useThreeScene({ mountRef, keysRef, setPlayerPosition, settings, setWorldObjects });
  return /* @__PURE__ */ jsxDEV("div", { className: "relative w-full h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV("div", { ref: mountRef, className: "w-full h-full" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 46,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(HUD, { playerStats, playerRef, worldObjects }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 48,
      columnNumber: 7
    }),
    showCharacter && /* @__PURE__ */ jsxDEV(CharacterPanel, { playerStats, onClose: () => setShowCharacter(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 51,
      columnNumber: 25
    }),
    showInventory && /* @__PURE__ */ jsxDEV(InventoryPanel, { inventory, setInventory, onClose: () => setShowInventory(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 52,
      columnNumber: 25
    }),
    showWorldMap && /* @__PURE__ */ jsxDEV(WorldMapPanel, { playerPosition, onClose: () => setShowWorldMap(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 53,
      columnNumber: 24
    }),
    showSettings && /* @__PURE__ */ jsxDEV(SettingsPanel, { settings, setSettings, onClose: () => setShowSettings(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 54,
      columnNumber: 24
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 45,
    columnNumber: 5
  });
};
var stdin_default = OpenWorldGame;
export {
  stdin_default as default
};
