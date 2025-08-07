import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
const DraggedItemCursor = ({ item }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  if (!item) return null;
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "fixed pointer-events-none z-[70] transform -translate-x-1/2 -translate-y-1/2",
      style: { left: position.x, top: position.y },
      children: /* @__PURE__ */ jsxDEV("div", { className: "text-4xl bg-black bg-opacity-50 rounded-full p-2", children: item.icon }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 21,
        columnNumber: 13
      })
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 17,
      columnNumber: 9
    }
  );
};
export {
  DraggedItemCursor
};
