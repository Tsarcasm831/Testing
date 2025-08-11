import * as TWEEN from '@tweenjs/tween.js';
import { updatePlayer } from '../game/player/index.js';

/**
 * Starts the main animation loop and returns a stop() function.
 */
export function startAnimationLoop({
    sceneRef,
    cameraRef,
    rendererRef,
    lightRef,
    playerRef,
    objectGridRef,
    randomObjectsRef,
    keysRef,
    throttledSetPlayerPosition,
    joystickRef,
    zoomRef,
    cameraOrbitRef,
    // NEW: camera pitch ref
    cameraPitchRef,
    fpsLimit,
    // Grid labels (virtualized)
    gridLabelsGroupRef,
    gridLabelsArrayRef,     // kept for backward compatibility; unused with virtualization
    visibleLabelsRef,       // kept for backward compatibility; unused with virtualization
    gridLabelsUpdateRef,    // new: function ref to call per-frame
    clockRef,
    // New: object tooltips
    objectTooltipsUpdateRef,
    // New: interaction prompt
    interactPromptRef,
    // NEW: first-person toggle ref
    firstPersonRef
}) {
    let animationId = null;
    const fpsIntervals = {
        'Unlimited': 0,
        '60 FPS': 1000 / 60,
        '30 FPS': 1000 / 30,
    };
    const fpsInterval = fpsIntervals[fpsLimit] || 0;
    let lastFrameTime = 0;

    const interactionDistance = 10; // world units to interact
    let lastInteractObj = null;
    let promptHideTimeout = null;

    const clampPitch = (v) => Math.max(-0.9, Math.min(0.9, v));
    const normalizeAngle = (a) => {
        const twoPI = Math.PI * 2;
        a = ((a % twoPI) + twoPI) % twoPI;
        if (a > Math.PI) a -= twoPI;
        return a;
    };

    const onPointerMove = (e) => {
        if (!firstPersonRef.current) return;
        if (document.pointerLockElement !== rendererRef.current?.domElement) return;
        const sens = 0.002;
        if (cameraOrbitRef) {
            const next = (cameraOrbitRef.current || 0) - e.movementX * sens;
            cameraOrbitRef.current = normalizeAngle(next);
        }
        if (cameraPitchRef) {
            const nextP = (cameraPitchRef.current || 0) - e.movementY * sens;
            cameraPitchRef.current = clampPitch(nextP);
        }
    };
    document.addEventListener('mousemove', onPointerMove);

    const onPointerLockChange = () => {
        if (document.pointerLockElement !== rendererRef.current?.domElement) {
            firstPersonRef.current = false;
        }
    };
    document.addEventListener('pointerlockchange', onPointerLockChange);

    function setPrompt(text, visible) {
        const el = interactPromptRef?.current;
        if (!el) return;
        if (visible) {
            el.textContent = text;
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    }

    function findNearestInteractable(playerPosition) {
        if (!objectGridRef.current) return null;
        const nearby = objectGridRef.current.getObjectsNear(playerPosition, interactionDistance + 5) || [];
        let best = null;
        let bestD2 = Infinity;
        for (let i = 0; i < nearby.length; i++) {
            const o = nearby[i];
            if (!o || !o.position) continue;
            const dx = o.position.x - playerPosition.x;
            const dz = o.position.z - playerPosition.z;
            const d2 = dx * dx + dz * dz;
            if (d2 <= interactionDistance * interactionDistance && d2 < bestD2) {
                best = o;
                bestD2 = d2;
            }
        }
        return best;
    }

    function animate(timestamp) {
        animationId = requestAnimationFrame(animate);

        const elapsed = timestamp - lastFrameTime;
        if (fpsInterval > 0 && elapsed < fpsInterval) {
            return;
        }
        lastFrameTime = fpsInterval > 0 ? timestamp - (elapsed % fpsInterval) : timestamp;

        TWEEN.update(timestamp);

        if (!playerRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current || !objectGridRef.current) return;

        // Handle first-person toggle (V)
        if (keysRef.current['ToggleFirstPerson']) {
            keysRef.current['ToggleFirstPerson'] = false;
            firstPersonRef.current = !firstPersonRef.current;
            if (!firstPersonRef.current && document.pointerLockElement) {
                document.exitPointerLock();
            }
        }

        const delta = clockRef.current.getDelta();

        // Grid label visibility (virtualized: delegate to update function)
        if (gridLabelsGroupRef.current && gridLabelsGroupRef.current.visible && gridLabelsUpdateRef?.current) {
            gridLabelsUpdateRef.current(playerRef.current.position);
        } else if (gridLabelsGroupRef.current && !gridLabelsGroupRef.current.visible && visibleLabelsRef?.current?.size > 0) {
            // Legacy cleanup path if visibleLabelsRef is used elsewhere
            visibleLabelsRef.current.forEach(label => (label.visible = false));
            visibleLabelsRef.current.clear();
        }

        // Object tooltips update
        if (objectTooltipsUpdateRef?.current) {
            objectTooltipsUpdateRef.current(
                playerRef.current.position,
                objectGridRef.current,
                randomObjectsRef.current
            );
        }

        // Interaction prompt handling
        const playerPos = playerRef.current.position;
        const focusObj = findNearestInteractable(playerPos);
        if (focusObj) {
            const name = focusObj.userData?.label || focusObj.name || 'Object';
            setPrompt(`Press F to interact (${name})`, true);
        } else {
            setPrompt('', false);
        }

        // Handle Interact key (edge-triggered)
        if (keysRef.current['KeyFClicked']) {
            keysRef.current['KeyFClicked'] = false;
            const target = focusObj;
            if (target) {
                const name = target.userData?.label || target.name || 'Object';
                setPrompt(`Interacted with ${name}`, true);
                if (promptHideTimeout) clearTimeout(promptHideTimeout);
                promptHideTimeout = setTimeout(() => setPrompt('', false), 1200);
                // Call custom interaction if provided
                if (typeof target.userData?.onInteract === 'function') {
                    try {
                        target.userData.onInteract(target, playerRef.current);
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.warn('Interaction handler error:', e);
                    }
                }
            }
        }

        // Player update
        updatePlayer(
            playerRef.current,
            keysRef.current,
            cameraRef.current,
            lightRef.current,
            throttledSetPlayerPosition,
            objectGridRef.current,
            delta,
            joystickRef.current,
            zoomRef.current,
            cameraOrbitRef,
            // NEW: pass pitch ref
            cameraPitchRef,
            // NEW: pass first-person ref
            firstPersonRef
        );

        rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    animate(0);

    return function stop() {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = null;
        throttledSetPlayerPosition.cancel?.();
        document.removeEventListener('mousemove', onPointerMove);
        document.removeEventListener('pointerlockchange', onPointerLockChange);
        if (document.pointerLockElement) document.exitPointerLock();
    };
}