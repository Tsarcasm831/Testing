import React, { useEffect, useRef, useState } from 'react';
import { useJoystick } from '../../hooks/useJoystick.js';
import ZoomControls from './ZoomControls.jsx';
import ActionButtons from './ActionButtons.jsx';

const clampPitch = (v) => Math.max(-0.9, Math.min(0.9, v));

export const MobileControls = ({ joystickRef, keysRef, zoomRef, cameraOrbitRef, cameraPitchRef }) => {
  const [visible, setVisible] = useState(true);
  const lookPadRef = useRef(null);
  const lookTargetRef = useRef({ yaw: 0, pitch: 0 });
  const lookRafRef = useRef(null);
  const zoneRef = useJoystick(joystickRef, visible);
  const [holdRun, setHoldRun] = useState(false);

  const buzz = (ms = 15) => {
    try {
      window.navigator?.vibrate?.(ms);
    } catch (_) {}
  };

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
    pressKey('ShiftLeft');
    buzz(8);
  };
  const handleRunUp = () => {
    setHoldRun(false);
    releaseKey('ShiftLeft');
  };
  const handleJump = () => {
    clickKey('Space');
    buzz(12);
  };
  const handleAttack = () => {
    clickKey('MouseLeft', 'MouseLeftClicked');
    buzz(10);
  };
  const handleDodge = () => {
    clickKey('ControlLeft');
    buzz(10);
  };
  const handleInteract = () => {
    clickKey('KeyF', 'KeyFClicked');
    buzz(8);
  };

  useEffect(() => {
    if (!lookPadRef.current) return;
    let active = false;
    let lastX = 0;
    let lastY = 0;
    const BASE_SENS_X = 0.008;
    const BASE_SENS_Y = 0.010;
    const EASE = 0.22;
    const normalizeAngle = (a) => {
      const twoPI = Math.PI * 2;
      a = ((a % twoPI) + twoPI) % twoPI;
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
      const t = (e.touches && e.touches[0]) || e;
      lastX = t.clientX;
      lastY = t.clientY;
      if (e.cancelable) e.preventDefault();
    };
    const onMove = (e) => {
      if (!active) return;
      const t = (e.touches && e.touches[0]) || e;
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
    el.addEventListener('touchstart', onStart, { passive: false });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: false });
    el.addEventListener('touchcancel', onEnd, { passive: false });
    el.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
      el.removeEventListener('mousedown', onStart);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      if (lookRafRef.current) cancelAnimationFrame(lookRafRef.current);
    };
  }, [cameraOrbitRef, cameraPitchRef, visible, zoomRef]);

  return (
    <>
      <div className="absolute top-4 right-4 z-30">
        <button
          onTouchStart={() => setVisible((v) => !v)}
          onMouseDown={() => setVisible((v) => !v)}
          className={`px-3 py-2 rounded-full border-2 shadow-lg text-sm ${visible ? 'bg-black/70 text-white border-gray-400' : 'bg-yellow-500 text-black border-yellow-300'}`}
          aria-label="Toggle mobile controls"
          title="Toggle controls"
        >
          {visible ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>
      {visible && (
        <div
          ref={zoneRef}
          className="absolute bottom-0 left-0 w-1/2 h-full z-20"
          style={{ touchAction: 'none' }}
        />
      )}
      {visible ? (
        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-4 items-end select-none">
          <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
          <div
            ref={lookPadRef}
            className="w-20 h-20 rounded-full border-2 border-amber-400 bg-black/50 shadow-2xl flex items-center justify-center text-amber-300 font-bold select-none"
            style={{ touchAction: 'none' }}
            aria-label="Camera look pad (drag to rotate camera)"
            title="Look (drag to rotate camera)"
          >
            Cam
          </div>
          <ActionButtons
            holdRun={holdRun}
            onRunDown={handleRunDown}
            onRunUp={handleRunUp}
            onInteract={handleInteract}
            onJump={handleJump}
            onAttack={handleAttack}
            onDodge={handleDodge}
          />
        </div>
      ) : (
        <div className="absolute bottom-6 right-6 z-20">
          <button
            onTouchStart={() => setVisible(true)}
            onMouseDown={() => setVisible(true)}
            className="px-3 py-2 rounded-full bg-black/60 text-white border border-gray-400 text-sm shadow-lg"
            aria-label="Show mobile controls"
            title="Show controls"
          >
            Controls
          </button>
        </div>
      )}
    </>
  );
};
