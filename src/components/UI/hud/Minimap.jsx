import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { useMinimap } from "../../../hooks/useMinimap.js";
const Minimap = ({ playerRef, worldObjects }) => {
  const {
    minimapState,
    minimapCanvasRef,
    posXRef,
    posZRef,
    handleInteractionStart
  } = useMinimap({ playerRef, worldObjects });
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        position: "absolute",
        left: `${minimapState.left}px`,
        top: `${minimapState.top}px`,
        width: `${minimapState.width}px`
      },
      className: "z-10 flex flex-col shadow-2xl",
      children: [
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: { height: `${minimapState.height}px` },
            className: "bg-black bg-opacity-70 border-2 border-b-0 border-gray-600 rounded-t overflow-hidden relative group",
            onMouseDown: (e) => handleInteractionStart(e, "move"),
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 cursor-move" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 29,
                columnNumber: 17
              }),
              /* @__PURE__ */ jsxDEV("canvas", { ref: minimapCanvasRef, width: minimapState.width, height: minimapState.height, className: "w-full h-full" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 30,
                columnNumber: 17
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute -left-1 -top-1 w-4 h-4 cursor-nwse-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity", onMouseDown: (e) => handleInteractionStart(e, "resize-tl") }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 33,
                columnNumber: 17
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute -right-1 -top-1 w-4 h-4 cursor-nesw-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity", onMouseDown: (e) => handleInteractionStart(e, "resize-tr") }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 34,
                columnNumber: 17
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute -left-1 -bottom-1 w-4 h-4 cursor-nesw-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity", onMouseDown: (e) => handleInteractionStart(e, "resize-bl") }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 35,
                columnNumber: 17
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute -right-1 -bottom-1 w-4 h-4 cursor-nwse-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity", onMouseDown: (e) => handleInteractionStart(e, "resize-br") }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 36,
                columnNumber: 17
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 24,
            columnNumber: 13
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-black bg-opacity-70 text-white p-2 rounded-b text-sm border-2 border-t-0 border-gray-600", children: [
          /* @__PURE__ */ jsxDEV("div", { ref: posXRef, children: "X: 0" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 41,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("div", { ref: posZRef, children: "Z: 0" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 42,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 40,
          columnNumber: 13
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 14,
      columnNumber: 9
    }
  );
};
export {
  Minimap
};
