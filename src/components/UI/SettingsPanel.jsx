import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const SettingsPanel = ({ settings, setSettings, onClose }) => {
  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-98 border-2 border-gray-600 rounded-lg shadow-2xl z-50 w-96 text-white", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-700 px-4 py-2 rounded-t-lg border-b border-gray-600 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-yellow-400 font-bold text-lg", children: "Settings" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 12,
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
          lineNumber: 13,
          columnNumber: 17
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 11,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-bold text-md", children: "Graphics" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 22,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "shadows-toggle", children: "Enable Shadows" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 24,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "checkbox",
            id: "shadows-toggle",
            checked: settings.shadows,
            onChange: (e) => handleSettingChange("shadows", e.target.checked),
            className: "form-checkbox h-5 w-5 text-yellow-500 bg-gray-700 border-gray-500 rounded focus:ring-yellow-500"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 25,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 23,
        columnNumber: 17
      }),
      settings.shadows && /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block mb-2", children: "Shadow Quality" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 35,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between", children: ["Low", "Medium", "High"].map((level) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => handleSettingChange("shadowQuality", level.toLowerCase()),
            className: `px-4 py-1 rounded text-sm ${settings.shadowQuality === level.toLowerCase() ? "bg-yellow-500 text-black" : "bg-gray-700 hover:bg-gray-600"}`,
            children: level
          },
          level,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 38,
            columnNumber: 33
          }
        )) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 36,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 34,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "antialias-toggle", children: "Antialiasing (reloads renderer)" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 50,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "checkbox",
            id: "antialias-toggle",
            checked: settings.antialiasing,
            onChange: (e) => handleSettingChange("antialiasing", e.target.checked),
            className: "form-checkbox h-5 w-5 text-yellow-500 bg-gray-700 border-gray-500 rounded focus:ring-yellow-500"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 51,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 49,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "grid-toggle", children: "Show Grid" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 60,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "checkbox",
            id: "grid-toggle",
            checked: settings.grid,
            onChange: (e) => handleSettingChange("grid", e.target.checked),
            className: "form-checkbox h-5 w-5 text-yellow-500 bg-gray-700 border-gray-500 rounded focus:ring-yellow-500"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 61,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 59,
        columnNumber: 18
      }),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block mb-2", children: "Object Density" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 70,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between", children: ["Low", "Medium", "High"].map((level) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => handleSettingChange("objectDensity", level.toLowerCase()),
            className: `px-4 py-1 rounded text-sm ${settings.objectDensity === level.toLowerCase() ? "bg-yellow-500 text-black" : "bg-gray-700 hover:bg-gray-600"}`,
            children: level
          },
          level,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 73,
            columnNumber: 30
          }
        )) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 71,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 69,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block mb-2", children: "Framerate Limit" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 85,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between", children: ["Unlimited", "60 FPS", "30 FPS"].map((level) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => handleSettingChange("fpsLimit", level),
            className: `px-4 py-1 rounded text-sm ${settings.fpsLimit === level ? "bg-yellow-500 text-black" : "bg-gray-700 hover:bg-gray-600"}`,
            children: level
          },
          level,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 88,
            columnNumber: 30
          }
        )) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 86,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 84,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-400 pt-2 border-t border-gray-700", children: /* @__PURE__ */ jsxDEV("p", { children: "Reducing graphics settings can improve performance on less powerful devices." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 100,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 99,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 21,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 9,
    columnNumber: 9
  });
};
var stdin_default = SettingsPanel;
export {
  SettingsPanel,
  stdin_default as default
};
