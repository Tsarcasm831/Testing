import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useRef } from "react";
import nipplejs from "nipplejs";
const MobileControls = ({ joystickRef }) => {
  const zoneRef = useRef(null);
  useEffect(() => {
    if (!zoneRef.current) return;
    const options = {
      zone: zoneRef.current,
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "rgba(255, 255, 255, 0.5)",
      size: 150,
      fadeTime: 250
    };
    const manager = nipplejs.create(options);
    manager.on("move", (evt, data) => {
      joystickRef.current = data;
    });
    manager.on("end", () => {
      joystickRef.current = null;
    });
    return () => {
      manager.destroy();
    };
  }, [joystickRef]);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      ref: zoneRef,
      className: "absolute bottom-8 left-8 w-52 h-52 z-20"
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 36,
      columnNumber: 9
    }
  );
};
export {
  MobileControls
};
