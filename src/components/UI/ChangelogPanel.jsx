import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const changelogData = [
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
        lineNumber: 15,
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
          lineNumber: 16,
          columnNumber: 17
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 14,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "p-4 space-y-4 max-h-[60vh] overflow-y-auto", children: changelogData.map((entry) => /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-900 p-3 rounded-lg border border-gray-700", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-baseline mb-2", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-bold text-md", children: [
          "Version ",
          entry.version
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 29,
          columnNumber: 30
        }),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400", children: entry.date }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 30,
          columnNumber: 30
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 28,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("ul", { className: "list-disc list-inside text-sm space-y-1 text-gray-300", children: entry.changes.map((change, index) => /* @__PURE__ */ jsxDEV("li", { children: change }, index, false, {
        fileName: "<stdin>",
        lineNumber: 35,
        columnNumber: 33
      })) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 33,
        columnNumber: 25
      })
    ] }, entry.version, true, {
      fileName: "<stdin>",
      lineNumber: 27,
      columnNumber: 21
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 25,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 12,
    columnNumber: 9
  });
};
var stdin_default = ChangelogPanel;
export {
  ChangelogPanel,
  stdin_default as default
};
