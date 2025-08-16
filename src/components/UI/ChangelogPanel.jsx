import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const LATEST_VERSION = "0.023.9";
const LATEST_DATE = "2025-08-16";
const LATEST_CHANGES = [
  "Version: Bumped to 0.023.9 and synchronized across UI title and in-game labels.",
  "Zoom: Hard-capped camera zoom-out at 50 across desktop, mobile, and keyboard controls.",
  "Map: Editor opens in a 98% modal from Main Menu; live districts/walls render on minimap & world map.",
  "Fix: parseGridLabel import for rivers; all districts now loaded from map/ data.",
  "UX: FPV toggle added to mobile; tooltips and interact prompt refined near objects.",
  "World: Konoha town avoids roads; precise OBB colliders for Hokage Monument and Palace walls."
];
const changelogData = [
  { version: LATEST_VERSION, date: LATEST_DATE, changes: LATEST_CHANGES },
  { version: "0.007.5", date: "2025-08-16", changes: [
    "Version set to 0.007.5.",
    "Changelog updated with latest changes.",
    "UI version label is now tweakable (VERSION_PREFIX / OVERRIDE_VERSION)."
  ] },
  { version: "0.007.4", date: "2025-08-15", changes: [
    "Collision: Round Konoha buildings now use precise spherical colliders.",
    "Credits: Added cooroinuzuka (DeviantArt) link to Credits and Special Thanks.",
    "Mobile: Fixed joystick vertical inversion and restored free-look; no longer forces south.",
    "FPV: Corrected mouse-look direction and preserved facing when entering/exiting FPV.",
    "UX: Version and changelog updated."
  ] },
  { version: "0.006.1", date: "2025-08-14", changes: [
    "Walls: South opening cut cleanly and Konoha Gates placed; sealed stray gaps on the East side.",
    "Movement: WASD made camera-relative in both 3rd and 1st person; right-click drag (desktop) and cam pad (mobile) control yaw/pitch.",
    "Feature: First\u2011person view toggle (V) with pointer lock; auto-hide player model in FPV.",
    "UX: Nearby object tooltips (pooled sprites) and on-screen interaction prompt (F).",
    "Performance: Grid labels virtualized, bound to terrain, fixed 5u cells; wall details instanced; FPS limit + render scale cap.",
    "Assets: Loader caches only essential player animations and core images for faster startup.",
    "World: Hokage Palace, Hokage Monument, Ichiraku, Town cluster integrated with precise colliders.",
    "Mobile: Pinch-to-zoom, refined joystick smoothing; improved camera pad responsiveness."
  ] },
  { version: "0.004.0", date: "2025-08-11", changes: [
    "Movement: W now always moves the player forward relative to the direction they are facing.",
    "Movement: A and D are strafe-only and no longer rotate the player.",
    "Movement: Player now faces the direction of travel; fixed D moving opposite/right issues.",
    "Camera: Player rotation and camera orbit are unified to feel consistent.",
    "Feature: First\u2011person view toggle (V). Uses pointer lock with mouse\u2011look.",
    "UX: Interaction prompt shows \u201CPress F to interact (Name)\u201D for nearby objects.",
    "World: Ichiraku Ramen is now placed in the world at LF480 (with collider).",
    "World: Hokage Palace placed at KN182 with detailed colliders.",
    "World: Hokage Monument GLB placed at KN129 and scaled up."
  ] },
  { version: "0.003.9", date: "2025-08-11", changes: [
    "Version bump to 0.003.9.",
    "Added Ichiraku Ramen shop prototype (ichiraku.js) \u2014 file only, not yet integrated into the world."
  ] },
  { version: "0.002.51", date: "2025-08-09", changes: [
    "Performance: Capped renderer pixel ratio via Settings \u2192 Render Scale (default 1.25x).",
    "Performance: Minimap/HUD updates throttled to ~12 FPS.",
    "Performance: Central wall details (crenellations, buttresses) converted to InstancedMesh (massive draw-call reduction).",
    "Performance: Slightly reduced wall segment count for smoother rendering.",
    "Quality: Settings panel exposes Render Scale control."
  ] },
  { version: "0.002.5", date: "2025-08-09", changes: [
    "Version bump and new changelog entry.",
    "Jump animation now immediately transitions to walk/run/idle upon landing.",
    "Grid labels are bound to terrain height and grid cell size is locked.",
    "Second loading overlay stays visible until the 3D scene and player are fully ready.",
    "Prevented scene re-initialization when moving (no reload on movement).",
    "Updated splash and main menu backgrounds; added Credits modal."
  ] },
  { version: "0.002.1", date: "Upcoming", changes: ["Added basic combat moves: Attack (F) and Dodge (Ctrl).", "Animation system now handles one-shot actions, preventing movement during attacks/dodges.", "Integrated a wider range of animations to make the player more dynamic."] },
  { version: "0.001.6", date: "Upcoming", changes: ["Added Main Menu with game start, options, and changelog.", "Implemented asset pre-loading for smoother game start."] },
  { version: "0.001.5", date: "2024-05-22", changes: ["Implemented asset downloader and caching system.", "Added diverse terrain types (sand, snow, rocky, forest).", "Player can now jump with Spacebar and gravity feels more responsive."] },
  { version: "0.001.4", date: "2024-05-21", changes: ["Added mobile joystick controls (toggle with Z key).", "Unified movement speed for both keyboard and joystick.", "Fixed inverted vertical axis on joystick."] },
  { version: "0.001.3", date: "2024-05-20", changes: ["Renamed MP to Chakra across all UI elements.", "Added character panel (C), inventory (I), map (M), and settings (P) panels."] }
];
const ChangelogPanel = ({ onClose }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-98 border-2 border-gray-600 rounded-lg shadow-2xl z-50 w-[500px] text-white", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-700 px-4 py-2 rounded-t-lg border-b border-gray-600 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-yellow-400 font-bold text-lg", children: "Changelog" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 83,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: onClose,
          className: "text-red-400 hover:text-red-300 text-xl font-bold w-6 h-6 flex items-center justify-center",
          children: "\xD7"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 84,
          columnNumber: 17
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 82,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "px-4 pt-2 text-xs text-gray-300", children: "by Lord Tsarcasm" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 92,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "p-4 space-y-4 max-h-[60vh] overflow-y-auto", children: changelogData.map((entry) => /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-900 p-3 rounded-lg border border-gray-700", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-baseline mb-2", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-bold text-md", children: [
          "Version ",
          entry.version
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 98,
          columnNumber: 30
        }),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400", children: entry.date }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 99,
          columnNumber: 30
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 97,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("ul", { className: "list-disc list-inside text-sm space-y-1 text-gray-300", children: entry.changes.map((change, index) => /* @__PURE__ */ jsxDEV("li", { children: change }, index, false, {
        fileName: "<stdin>",
        lineNumber: 104,
        columnNumber: 33
      })) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 102,
        columnNumber: 25
      })
    ] }, entry.version, true, {
      fileName: "<stdin>",
      lineNumber: 96,
      columnNumber: 21
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 80,
    columnNumber: 9
  });
};
var stdin_default = ChangelogPanel;
export {
  ChangelogPanel,
  changelogData,
  stdin_default as default
};
