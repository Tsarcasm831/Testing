import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const CreditsPanel = ({ onClose }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-black bg-opacity-60", onClick: onClose }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 7,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "relative bg-gray-900 text-white border-2 border-yellow-600 rounded-xl shadow-2xl overflow-hidden",
        style: { width: "60vw", height: "60vh" },
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "credits-title",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between px-5 py-3 bg-gray-800 border-b border-gray-700", children: [
            /* @__PURE__ */ jsxDEV("h2", { id: "credits-title", className: "text-yellow-400 font-bold text-xl", children: "Credits" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 18,
              columnNumber: 11
            }),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: onClose,
                className: "text-red-400 hover:text-red-300 text-2xl font-bold w-8 h-8 flex items-center justify-center",
                "aria-label": "Close credits",
                title: "Close",
                children: "\xD7"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 19,
                columnNumber: 11
              }
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 17,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "p-5 h-[calc(60vh-56px)] overflow-y-auto space-y-6", children: [
            /* @__PURE__ */ jsxDEV("section", { children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-semibold mb-2", children: "Core Team" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 31,
                columnNumber: 13
              }),
              /* @__PURE__ */ jsxDEV("ul", { className: "list-disc list-inside text-sm text-gray-200 space-y-1", children: [
                /* @__PURE__ */ jsxDEV("li", { children: "Project Lead: Lord Tsarcasm" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 33,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: "Gameplay Programming: Lord Tsarcasm" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 34,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: "3D/Environment: Lord Tsarcasm" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 35,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: "UI/UX Design: Lord Tsarcasm" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 36,
                  columnNumber: 15
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 32,
                columnNumber: 13
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 30,
              columnNumber: 11
            }),
            /* @__PURE__ */ jsxDEV("section", { children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-semibold mb-2", children: "Assets" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 41,
                columnNumber: 13
              }),
              /* @__PURE__ */ jsxDEV("ul", { className: "list-disc list-inside text-sm text-gray-200 space-y-1", children: [
                /* @__PURE__ */ jsxDEV("li", { children: "Animations: meshy" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 43,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: "Textures: gpt4o" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 44,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: "Iconography: gpt5" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 45,
                  columnNumber: 15
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 42,
                columnNumber: 13
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 40,
              columnNumber: 11
            }),
            /* @__PURE__ */ jsxDEV("section", { children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-semibold mb-2", children: "Libraries & Tech" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 50,
                columnNumber: 13
              }),
              /* @__PURE__ */ jsxDEV("ul", { className: "list-disc list-inside text-sm text-gray-200 space-y-1", children: [
                /* @__PURE__ */ jsxDEV("li", { children: "Three.js" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 52,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: "React" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 53,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: "Tailwind CSS" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 54,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: "@tweenjs/tween.js" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 55,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: "nipplejs (mobile joystick)" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 56,
                  columnNumber: 15
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 51,
                columnNumber: 13
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 49,
              columnNumber: 11
            }),
            /* @__PURE__ */ jsxDEV("section", { children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-semibold mb-2", children: "Special Thanks" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 61,
                columnNumber: 13
              }),
              /* @__PURE__ */ jsxDEV("ul", { className: "list-disc list-inside text-sm text-gray-200 space-y-1", children: [
                /* @__PURE__ */ jsxDEV("li", { children: "gpt5" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 63,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV("li", { children: [
                  "Inspiration and references:",
                  " ",
                  /* @__PURE__ */ jsxDEV(
                    "a",
                    {
                      className: "text-blue-400 hover:underline",
                      href: "https://www.pinterest.com/hozayfamohammad/",
                      target: "_blank",
                      rel: "noreferrer",
                      children: "https://www.pinterest.com/hozayfamohammad/"
                    },
                    void 0,
                    false,
                    {
                      fileName: "<stdin>",
                      lineNumber: 66,
                      columnNumber: 17
                    }
                  )
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 64,
                  columnNumber: 15
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 62,
                columnNumber: 13
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 60,
              columnNumber: 11
            }),
            /* @__PURE__ */ jsxDEV("section", { children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-semibold mb-2", children: "Community" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 79,
                columnNumber: 13
              }),
              /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-300", children: "Thank you to everyone providing feedback and ideas during early development." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 80,
                columnNumber: 13
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 78,
              columnNumber: 11
            }),
            /* @__PURE__ */ jsxDEV("section", { children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-semibold mb-2", children: "Legal\u2011ish" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 86,
                columnNumber: 13
              }),
              /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-300", children: "Disclaimer: Naruto, all related characters, and assets are property of Masashi Kishimoto, Shueisha, and associated rights holders. This is a fan-made, non-commercial project created by a lone, over-caffeinated indie dev with no affiliation to said owners. Please don\u2019t sue me \u2014 I can barely afford instant ramen, let alone lawyers." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 87,
                columnNumber: 13
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 85,
              columnNumber: 11
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 29,
            columnNumber: 9
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 9,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 5,
    columnNumber: 5
  });
};
var stdin_default = CreditsPanel;
export {
  CreditsPanel,
  stdin_default as default
};
