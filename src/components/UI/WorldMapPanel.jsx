import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const WorldMapPanel = ({ playerPosition, onClose }) => /* @__PURE__ */ jsxDEV("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-95 border-2 border-yellow-600 rounded-lg p-6 w-96 h-96 text-white shadow-2xl", children: [
  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-yellow-400", children: "World Map" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 6,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: onClose,
        className: "text-red-400 hover:text-red-300 text-xl font-bold",
        children: "\xD7"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 7,
        columnNumber: 9
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 5,
    columnNumber: 7
  }),
  /* @__PURE__ */ jsxDEV("div", { className: "relative w-full h-64 bg-green-800 border-2 border-gray-600 rounded", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 opacity-30", children: [
      Array.from({ length: 10 }, (_, i) => /* @__PURE__ */ jsxDEV("div", { className: "absolute w-full border-t border-gray-400", style: { top: `${i * 10}%` } }, `h-${i}`, false, {
        fileName: "<stdin>",
        lineNumber: 18,
        columnNumber: 13
      })),
      Array.from({ length: 10 }, (_, i) => /* @__PURE__ */ jsxDEV("div", { className: "absolute h-full border-l border-gray-400", style: { left: `${i * 10}%` } }, `v-${i}`, false, {
        fileName: "<stdin>",
        lineNumber: 21,
        columnNumber: 13
      }))
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 16,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2",
        style: {
          left: `${50 + playerPosition.x / 2e3 * 100}%`,
          top: `${50 + playerPosition.z / 2e3 * 100}%`
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 25,
        columnNumber: 9
      }
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-2 left-2 text-xs", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-1", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-red-500 rounded-full" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 35,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("span", { children: "You" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 36,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 34,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 33,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-2 right-2 text-xs", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        "X: ",
        playerPosition.x
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 41,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV("div", { children: [
        "Z: ",
        playerPosition.z
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 42,
        columnNumber: 11
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 40,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 14,
    columnNumber: 7
  })
] }, void 0, true, {
  fileName: "<stdin>",
  lineNumber: 4,
  columnNumber: 5
});
export {
  WorldMapPanel
};
