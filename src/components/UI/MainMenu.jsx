import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const MainMenu = ({ onStart, onOptions, onChangelog, onCredits, version }) => {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "w-full h-full bg-cover bg-center flex flex-col items-center justify-center text-white",
      style: { backgroundImage: "url('/menu.png')" },
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-black bg-opacity-60 p-12 rounded-xl shadow-2xl border-2 border-yellow-500 flex flex-col items-center gap-6 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-300 -mt-4", children: version }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 10,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-4 w-64", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: onStart,
                className: "bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200",
                children: "Start Game"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 12,
                columnNumber: 21
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: onOptions,
                className: "bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200",
                children: "Options"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 18,
                columnNumber: 21
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: onChangelog,
                className: "bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200",
                children: "Changelog"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 24,
                columnNumber: 21
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: onCredits,
                className: "bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200",
                children: "Credits"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 30,
                columnNumber: 21
              }
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 11,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 9,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: "https://websim.com/@LordTsarcasm",
            target: "_blank",
            rel: "noreferrer",
            className: "absolute bottom-4 right-4 text-yellow-300 hover:text-yellow-200 hover:underline bg-black/50 px-3 py-1 rounded border border-yellow-600 text-sm",
            title: "View profile",
            children: "@LordTsarcasm"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 39,
            columnNumber: 13
          }
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 5,
      columnNumber: 9
    }
  );
};
var stdin_default = MainMenu;
export {
  MainMenu,
  stdin_default as default
};
