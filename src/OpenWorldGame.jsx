import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useRef, useEffect, useCallback } from "react";
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
import CreditsPanel from "./components/UI/CreditsPanel.jsx";
import AnimationsPanel from "./components/UI/AnimationsPanel.jsx";
import { changelogData } from "./components/UI/ChangelogPanel.jsx";
const OpenWorldGame = () => {
  const mountRef = useRef(null);
  const [gameState, setGameState] = useState("MainMenu");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [version, setVersion] = useState("");
  const [gameReady, setGameReady] = useState(false);
  useEffect(() => {
    const latest = changelogData?.[0]?.version || "";
    setVersion(latest ? `v${latest}` : "");
  }, []);
  const [playerStats, setPlayerStats] = useState(initialPlayerStats);
  const [inventory, setInventory] = useState(initialInventory);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 });
  const [worldObjects, setWorldObjects] = useState([]);
  const [settings, setSettings] = useState({
    // Defaults tuned for performance; you can raise these in Settings if your device allows
    shadows: false,
    shadowQuality: "low",
    antialiasing: true,
    grid: false,
    objectDensity: "medium",
    fpsLimit: "60 FPS",
    // Lower default render scale for better FPS; adjustable in Settings
    maxPixelRatio: 1
  });
  const [showCharacter, setShowCharacter] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showAnimations, setShowAnimations] = useState(false);
  const uiState = {
    setShowCharacter,
    setShowInventory,
    setShowWorldMap,
    setShowSettings,
    setShowMobileControls,
    setShowAnimations,
    gameState,
    setSettings
  };
  const keysRef = usePlayerControls(uiState);
  const joystickRef = useRef(null);
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const { playerRef, zoomRef, cameraOrbitRef, cameraPitchRef } = useThreeScene({ mountRef, keysRef, joystickRef, setPlayerPosition, settings, setWorldObjects, isPlaying: gameState === "Playing", onReady: useCallback(() => setGameReady(true), []) });
  const handleStartGame = async () => {
    setGameReady(false);
    setGameState("Loading");
    if (!window.assetLoaderInitialized) {
      await initializeAssetLoader();
      window.assetLoaderInitialized = true;
    }
    await startCaching(setLoadingProgress);
    setGameState("Playing");
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "relative w-full h-screen overflow-hidden bg-black", children: [
    gameState === "MainMenu" && /* @__PURE__ */ jsxDEV(MainMenu, { version, onStart: handleStartGame, onOptions: () => setShowSettings(true), onChangelog: () => setShowChangelog(true), onCredits: () => setShowCredits(true) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 54,
      columnNumber: 9
    }),
    // Show initial asset caching progress
    gameState === "Loading" && /* @__PURE__ */ jsxDEV(LoadingScreen, { progress: loadingProgress }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 55,
      columnNumber: 9
    }),
    // Mount the 3D scene
    gameState === "Playing" && /* @__PURE__ */ jsxDEV("div", { ref: mountRef, className: "w-full h-full" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 58,
      columnNumber: 9
    }),
    // Keep a second loading overlay visible until the scene/player is fully ready
    gameState === "Playing" && !gameReady && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 z-30", children: /* @__PURE__ */ jsxDEV(LoadingScreen, { progress: 100 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 61,
      columnNumber: 62
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 61,
      columnNumber: 27
    }),
    gameState === "Playing" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(HUD, { playerStats, playerRef, worldObjects, zoomRef }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 63,
      columnNumber: 38
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 63,
      columnNumber: 9
    }),
    gameState === "Playing" && (isTouchDevice || showMobileControls) && /* @__PURE__ */ jsxDEV(MobileControls, { joystickRef, keysRef, zoomRef, cameraOrbitRef, cameraPitchRef }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 62,
      columnNumber: 27
    }),
    gameState === "Playing" && showCharacter && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(CharacterPanel, { playerStats, onClose: () => setShowCharacter(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 65,
      columnNumber: 44
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 65,
      columnNumber: 27
    }),
    gameState === "Playing" && showInventory && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(InventoryPanel, { inventory, setInventory, onClose: () => setShowInventory(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 66,
      columnNumber: 44
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 66,
      columnNumber: 27
    }),
    gameState === "Playing" && showWorldMap && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(WorldMapPanel, { playerPosition, onClose: () => setShowWorldMap(false), worldObjects }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 67,
      columnNumber: 43
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 67,
      columnNumber: 26
    }),
    showSettings && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(SettingsPanel, { settings, setSettings, onClose: () => setShowSettings(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 69,
      columnNumber: 36
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 69,
      columnNumber: 21
    }),
    showChangelog && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(ChangelogPanel, { onClose: () => setShowChangelog(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 70,
      columnNumber: 38
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 70,
      columnNumber: 23
    }),
    showCredits && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(CreditsPanel, { onClose: () => setShowCredits(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 71,
      columnNumber: 36
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 71,
      columnNumber: 21
    }),
    gameState === "Playing" && showAnimations && /* @__PURE__ */ jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ jsxDEV(AnimationsPanel, { playerRef, onClose: () => setShowAnimations(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 72,
      columnNumber: 51
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 72,
      columnNumber: 34
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 52,
    columnNumber: 5
  });
};
var stdin_default = OpenWorldGame;
export {
  stdin_default as default
};
