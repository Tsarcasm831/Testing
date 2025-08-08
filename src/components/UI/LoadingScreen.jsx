import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const LoadingScreen = ({ progress }) => {
  const loadingMessages = [
    "Conjuring mythical beasts...",
    "Polishing ancient artifacts...",
    "Sharpening swords...",
    "Mapping uncharted territories...",
    "Awakening the spirits...",
    "Brewing powerful potions...",
    "Unfurling ancient scrolls...",
    "Assembling the realm..."
  ];
  const messageIndex = Math.floor(progress / (100 / loadingMessages.length)) % loadingMessages.length;
  const currentMessage = progress < 100 ? loadingMessages[messageIndex] : "Loading complete!";
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "w-full h-full bg-cover bg-center flex flex-col items-center justify-center text-white",
      style: { backgroundImage: "url('/rocky_ground_texture.png')" },
      children: /* @__PURE__ */ jsxDEV("div", { className: "bg-black bg-opacity-70 p-12 rounded-xl shadow-2xl border-2 border-yellow-500 flex flex-col items-center gap-6 backdrop-blur-sm w-3/4 max-w-4xl", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-4xl font-bold text-yellow-400 mb-2 font-serif tracking-wide drop-shadow-lg", children: "Loading Game Assets..." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 24,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-gray-900 bg-opacity-80 rounded-full h-8 border-2 border-yellow-700 shadow-inner overflow-hidden", children: /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full text-center text-black font-bold leading-8 transition-all duration-300 ease-linear flex items-center justify-center relative",
            style: { width: `${progress}%` },
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "z-10 drop-shadow-md", children: [
                progress,
                "%"
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 32,
                columnNumber: 25
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 left-0 h-full w-full bg-gradient-to-r from-white via-transparent to-white opacity-20 animate-pulse" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 34,
                columnNumber: 25
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 28,
            columnNumber: 21
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 27,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("p", { className: "mt-4 text-gray-300 text-lg h-6", children: currentMessage }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 38,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 23,
        columnNumber: 13
      })
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 19,
      columnNumber: 9
    }
  );
};
var stdin_default = LoadingScreen;
export {
  LoadingScreen,
  stdin_default as default
};
