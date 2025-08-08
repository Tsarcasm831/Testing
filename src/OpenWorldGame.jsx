import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useRef, useCallback } from "react";
import { initialPlayerStats, initialInventory } from "./game/initialState.js";
import { useThreeScene } from "./hooks/useThreeScene.js";
import { usePlayerControls } from "./hooks/usePlayerControls.js";
import { initializeAssetLoader, startCaching } from "./utils/assetLoader.js";
import { MainMenu } from "./components/UI/MainMenu.jsx";
import { LoadingScreen } from "./components/UI/LoadingScreen.jsx";
import CharacterPanel from "./components/UI/CharacterPanel.jsx";
import { InventoryPanel } from "./components/UI/InventoryPanel.jsx";
import { WorldMapPanel } from "./components/UI/WorldMapPanel.jsx";
import { HUD } from "./components/UI/HUD.jsx";
import SettingsPanel from "./components/UI/SettingsPanel.jsx";
import ChangelogPanel from "./components/UI/ChangelogPanel.jsx";
import ErrorBoundary from "./components/UI/ErrorBoundary.jsx";
import { MobileControls } from "./components/UI/MobileControls.jsx";
const OpenWorldGame = () => {
  const mountRef = useRef(null);
  const [gameState, setGameState] = useState("MainMenu");
  const [loadingProgress, setLoadingProgress] = useState(0);
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
  const [showChangelog, setShowChangelog] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const uiState = {
    setShowCharacter,
    setShowInventory,
    setShowWorldMap,
    setShowSettings,
    setShowMobileControls,
    gameState
  };
  const keysRef = usePlayerControls(uiState);
  const joystickRef = useRef(null);
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const onPlayerLoaded = useCallback(() => {
    setGameState("Playing");
  }, []);
  const { playerRef } = useThreeScene({
    mountRef,
    keysRef,
    joystickRef,
    setPlayerPosition,
    settings,
    setWorldObjects,
    isPlaying: gameState === "Loading" || gameState === "Playing",
    onPlayerLoaded
  });
  const handleStartGame = async () => {
    setGameState("Loading");
    await initializeAssetLoader();
    await startCaching(setLoadingProgress);
  };
  const handleQuickStart = () => {
    setGameState("Loading");
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "relative w-full h-screen overflow-hidden bg-black", children: [
    gameState === "MainMenu" && /* @__PURE__ */ jsxDEV(MainMenu, { onStart: handleStartGame, onOptions: () => setShowSettings(true), onChangelog: () => setShowChangelog(true) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 73,
      columnNumber: 9
    }),
    gameState === "Loading" && /* @__PURE__ */ jsxDEV(LoadingScreen, { progress: loadingProgress }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 74,
      columnNumber: 9
    }),
    (gameState === "Loading" || gameState === "Playing") && /* @__PURE__ */ jsxDEV("div", { ref: mountRef, className: "w-full h-full" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 76,
      columnNumber: 9
    }),
    gameState === "Playing" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(HUD, { playerStats, playerRef, worldObjects }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 78,
      columnNumber: 38
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 78,
      columnNumber: 9
    }),
    gameState === "Playing" && (isTouchDevice || showMobileControls) && /* @__PURE__ */ jsxDEV(MobileControls, { joystickRef }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 80,
      columnNumber: 27
    }),
    gameState === "Playing" && showCharacter && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(CharacterPanel, { playerStats, onClose: () => setShowCharacter(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 83,
      columnNumber: 44
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 83,
      columnNumber: 27
    }),
    gameState === "Playing" && showInventory && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(InventoryPanel, { inventory, setInventory, onClose: () => setShowInventory(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 84,
      columnNumber: 44
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 84,
      columnNumber: 27
    }),
    gameState === "Playing" && showWorldMap && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(WorldMapPanel, { playerPosition, onClose: () => setShowWorldMap(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 85,
      columnNumber: 43
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 85,
      columnNumber: 26
    }),
    showSettings && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(SettingsPanel, { settings, setSettings, onClose: () => setShowSettings(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 87,
      columnNumber: 36
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 87,
      columnNumber: 21
    }),
    showChangelog && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(ChangelogPanel, { onClose: () => setShowChangelog(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 88,
      columnNumber: 38
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 88,
      columnNumber: 23
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 71,
    columnNumber: 5
  });
};
var stdin_default = OpenWorldGame;
export {
  stdin_default as default
};
