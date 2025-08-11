import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useRef, useState } from "react";
import nipplejs from "nipplejs";
const clampPitch = (v) => Math.max(-0.9, Math.min(0.9, v));
const MobileControls = ({ joystickRef, keysRef, zoomRef, cameraOrbitRef, cameraPitchRef }) => {
  const zoneRef = useRef(null);
  const managerRef = useRef(null);
  const lookPadRef = useRef(null);
  const lookTargetRef = useRef({ yaw: 0, pitch: 0 });
  const lookRafRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const smoothedRef = useRef({ force: 0, angle: { radian: 0 } });
  const targetRef = useRef({ force: 0, angle: { radian: 0 } });
  const rafRef = useRef(null);
  const DEADZONE = 0.12;
  const SMOOTHING = 0.18;
  const buzz = (ms = 15) => {
    try {
      window.navigator?.vibrate?.(ms);
    } catch (_) {
    }
  };
  const [holdRun, setHoldRun] = useState(false);
  useEffect(() => {
    if (!zoneRef.current) return;
    const preventDefault = (e) => {
      if (e.cancelable) e.preventDefault();
    };
    if (visible) {
      zoneRef.current.addEventListener("touchmove", preventDefault, { passive: false });
      zoneRef.current.addEventListener("touchstart", preventDefault, { passive: false });
      zoneRef.current.addEventListener("touchend", preventDefault, { passive: false });
    }
    if (visible) {
      const manager = nipplejs.create({
        zone: zoneRef.current,
        mode: "dynamic",
        color: "rgba(255, 255, 255, 0.85)",
        size: 130,
        restJoystick: true,
        multitouch: false,
        maxNumberOfNipples: 1,
        fadeTime: 100
      });
      managerRef.current = manager;
      manager.on("start", () => {
      });
      manager.on("move", (_, data) => {
        const rawForce = Math.max(0, data.force || 0);
        const force = rawForce < DEADZONE ? 0 : Math.min(1, rawForce);
        const rad = data.angle?.radian ?? 0;
        targetRef.current = { force, angle: { radian: rad } };
      });
      manager.on("end", () => {
        targetRef.current = { force: 0, angle: { radian: smoothedRef.current.angle.radian } };
      });
    }
    const tick = () => {
      const s = smoothedRef.current;
      const t = targetRef.current;
      s.force += (t.force - s.force) * SMOOTHING;
      let delta = t.angle.radian - s.angle.radian;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      s.angle.radian = s.angle.radian + delta * SMOOTHING;
      joystickRef.current = { force: s.force, angle: { radian: s.angle.radian } };
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (managerRef.current) {
        managerRef.current.destroy();
        managerRef.current = null;
      }
      if (zoneRef.current) {
        zoneRef.current.removeEventListener("touchmove", preventDefault);
        zoneRef.current.removeEventListener("touchend", preventDefault);
      }
    };
  }, [joystickRef, visible]);
  const pressKey = (code) => {
    if (!keysRef?.current) return;
    keysRef.current[code] = true;
  };
  const releaseKey = (code) => {
    if (!keysRef?.current) return;
    keysRef.current[code] = false;
  };
  const clickKey = (code, clickFlag) => {
    if (!keysRef?.current) return;
    keysRef.current[code] = true;
    if (clickFlag) keysRef.current[clickFlag] = true;
    setTimeout(() => releaseKey(code), 0);
  };
  const clampZoom = (z) => Math.max(0.2, Math.min(2.5, z));
  const handleZoomIn = () => {
    if (!zoomRef) return;
    zoomRef.current = clampZoom((zoomRef.current ?? 0.2) * 0.9);
    buzz(6);
  };
  const handleZoomOut = () => {
    if (!zoomRef) return;
    zoomRef.current = clampZoom((zoomRef.current ?? 0.2) * 1.1);
    buzz(6);
  };
  const handleRunDown = () => {
    setHoldRun(true);
    pressKey("ShiftLeft");
    buzz(8);
  };
  const handleRunUp = () => {
    setHoldRun(false);
    releaseKey("ShiftLeft");
  };
  const handleJump = () => {
    clickKey("Space");
    buzz(12);
  };
  const handleAttack = () => {
    clickKey("MouseLeft", "MouseLeftClicked");
    buzz(10);
  };
  const handleDodge = () => {
    clickKey("ControlLeft");
    buzz(10);
  };
  const handleInteract = () => {
    clickKey("KeyF", "KeyFClicked");
    buzz(8);
  };
  useEffect(() => {
    if (!lookPadRef.current) return;
    let active = false;
    let lastX = 0;
    let lastY = 0;
    const BASE_SENS_X = 8e-3;
    const BASE_SENS_Y = 0.01;
    const EASE = 0.22;
    const MOMENTUM = 0;
    const normalizeAngle = (a) => {
      const twoPI = Math.PI * 2;
      a = (a % twoPI + twoPI) % twoPI;
      if (a > Math.PI) a -= twoPI;
      return a;
    };
    if (cameraOrbitRef) lookTargetRef.current.yaw = cameraOrbitRef.current || 0;
    if (cameraPitchRef) lookTargetRef.current.pitch = clampPitch(cameraPitchRef.current || 0);
    const lookTick = () => {
      const tgt = lookTargetRef.current;
      if (cameraOrbitRef) {
        const cur = cameraOrbitRef.current || 0;
        const next = cur + (tgt.yaw - cur) * EASE;
        cameraOrbitRef.current = normalizeAngle(next);
      }
      if (cameraPitchRef) {
        const curP = cameraPitchRef.current || 0;
        cameraPitchRef.current = clampPitch(curP + (tgt.pitch - curP) * EASE);
      }
      lookRafRef.current = requestAnimationFrame(lookTick);
    };
    lookRafRef.current = requestAnimationFrame(lookTick);
    const onStart = (e) => {
      active = true;
      const t = e.touches && e.touches[0] || e;
      lastX = t.clientX;
      lastY = t.clientY;
      if (e.cancelable) e.preventDefault();
    };
    const onMove = (e) => {
      if (!active) return;
      const t = e.touches && e.touches[0] || e;
      const dx = t.clientX - lastX;
      const dy = t.clientY - lastY;
      lastX = t.clientX;
      lastY = t.clientY;
      const zoom = zoomRef?.current ?? 0.2;
      const zoomScale = 0.2 / Math.max(0.12, Math.min(2.5, zoom));
      const sensX = BASE_SENS_X * zoomScale;
      const sensY = BASE_SENS_Y * zoomScale;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      const sum = Math.max(1, ax + ay);
      const weightY = ay / sum;
      const weightX = ax / sum;
      lookTargetRef.current.yaw = normalizeAngle(
        lookTargetRef.current.yaw - dx * sensX * (0.6 + 0.4 * weightX)
      );
      const proposedPitch = lookTargetRef.current.pitch - dy * sensY * (0.6 + 0.4 * weightY);
      lookTargetRef.current.pitch = clampPitch(proposedPitch);
      if (e.cancelable) e.preventDefault();
    };
    const onEnd = () => {
      active = false;
    };
    const el = lookPadRef.current;
    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: false });
    el.addEventListener("touchcancel", onEnd, { passive: false });
    el.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
      el.removeEventListener("mousedown", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      if (lookRafRef.current) cancelAnimationFrame(lookRafRef.current);
    };
  }, [cameraOrbitRef, cameraPitchRef, visible, zoomRef]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 right-4 z-30", children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        onTouchStart: () => setVisible((v) => !v),
        onMouseDown: () => setVisible((v) => !v),
        className: `px-3 py-2 rounded-full border-2 shadow-lg text-sm ${visible ? "bg-black/70 text-white border-gray-400" : "bg-yellow-500 text-black border-yellow-300"}`,
        "aria-label": "Toggle mobile controls",
        title: "Toggle controls",
        children: visible ? "Hide Controls" : "Show Controls"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 301,
        columnNumber: 17
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 300,
      columnNumber: 13
    }),
    visible && /* @__PURE__ */ jsxDEV(
      "div",
      {
        ref: zoneRef,
        className: "absolute bottom-0 left-0 w-1/2 h-full z-20",
        style: { touchAction: "none" }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 314,
        columnNumber: 17
      }
    ),
    visible ? /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-6 right-6 z-20 flex flex-col gap-4 items-end select-none", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onTouchStart: handleZoomIn,
            onMouseDown: handleZoomIn,
            className: "w-12 h-12 rounded-full border-2 bg-black/60 text-white border-gray-400 shadow-xl active:scale-95 transition-transform font-bold text-xl",
            "aria-label": "Zoom In",
            title: "Zoom In",
            children: "\uFF0B"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 326,
            columnNumber: 25
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onTouchStart: handleZoomOut,
            onMouseDown: handleZoomOut,
            className: "w-12 h-12 rounded-full border-2 bg-black/60 text-white border-gray-400 shadow-xl active:scale-95 transition-transform font-bold text-xl",
            "aria-label": "Zoom Out",
            title: "Zoom Out",
            children: "\uFF0D"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 335,
            columnNumber: 25
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 325,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          ref: lookPadRef,
          className: "w-20 h-20 rounded-full border-2 border-amber-400 bg-black/50 shadow-2xl flex items-center justify-center text-amber-300 font-bold select-none",
          style: { touchAction: "none" },
          "aria-label": "Camera look pad (drag to rotate camera)",
          title: "Look (drag to rotate camera)",
          children: "Cam"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 347,
          columnNumber: 21
        }
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onTouchStart: handleRunDown,
            onTouchEnd: handleRunUp,
            onMouseDown: handleRunDown,
            onMouseUp: handleRunUp,
            className: `w-16 h-16 rounded-full border-2 ${holdRun ? "bg-yellow-400 text-black border-yellow-300" : "bg-black/60 text-yellow-300 border-yellow-500"} shadow-xl active:scale-95 transition-transform font-bold`,
            "aria-label": "Run (hold)",
            children: "Run"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 359,
            columnNumber: 25
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onTouchStart: handleInteract,
            onMouseDown: handleInteract,
            className: "w-16 h-16 rounded-full border-2 bg-black/60 text-blue-300 border-blue-500 shadow-xl active:scale-95 transition-transform font-bold",
            "aria-label": "Interact",
            children: "F"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 369,
            columnNumber: 25
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 358,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onTouchStart: handleJump,
            onMouseDown: handleJump,
            className: "w-16 h-16 rounded-full border-2 bg-black/60 text-green-300 border-green-500 shadow-xl active:scale-95 transition-transform font-bold",
            "aria-label": "Jump",
            children: "\u2934\uFE0E"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 381,
            columnNumber: 25
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onTouchStart: handleAttack,
            onMouseDown: handleAttack,
            className: "w-20 h-20 rounded-full border-2 bg-black/70 text-red-300 border-red-500 shadow-2xl active:scale-95 transition-transform font-bold text-xl",
            "aria-label": "Attack",
            children: "\u2694\uFE0F"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 389,
            columnNumber: 25
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onTouchStart: handleDodge,
            onMouseDown: handleDodge,
            className: "w-16 h-16 rounded-full border-2 bg-black/60 text-purple-300 border-purple-500 shadow-xl active:scale-95 transition-transform font-bold",
            "aria-label": "Dodge",
            children: "\u21F2"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 397,
            columnNumber: 25
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 380,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 323,
      columnNumber: 17
    }) : (
      // Compact "Show Controls" button when hidden
      /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-6 right-6 z-20", children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          onTouchStart: () => setVisible(true),
          onMouseDown: () => setVisible(true),
          className: "px-3 py-2 rounded-full bg-black/60 text-white border border-gray-400 text-sm shadow-lg",
          "aria-label": "Show mobile controls",
          title: "Show controls",
          children: "Controls"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 410,
          columnNumber: 21
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 409,
        columnNumber: 17
      })
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 298,
    columnNumber: 9
  });
};
export {
  MobileControls
};
