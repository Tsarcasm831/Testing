import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import PropTypes from "prop-types";
import { PlayerInfo } from "./hud/PlayerInfo.jsx";
import { ControlsInfo } from "./hud/ControlsInfo.jsx";
import { Minimap } from "./hud/Minimap.jsx";
const HUDComponent = ({ playerStats, playerRef, worldObjects }) => {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 left-4 flex flex-col space-y-2 z-10", children: [
      /* @__PURE__ */ jsxDEV(PlayerInfo, { playerStats }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 10,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV(ControlsInfo, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 11,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Minimap, { playerRef, worldObjects }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 14,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 8,
    columnNumber: 9
  });
};
HUDComponent.propTypes = {
  playerStats: PropTypes.object.isRequired,
  playerRef: PropTypes.shape({ current: PropTypes.any }),
  worldObjects: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.object,
      color: PropTypes.string
    })
  )
};
const HUD = React.memo(HUDComponent);
export {
  HUD
};
