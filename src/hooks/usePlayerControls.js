import { useEffect, useRef } from 'react';

export const usePlayerControls = ({ setShowCharacter, setShowInventory, setShowWorldMap, setShowSettings, setShowMobileControls, setShowAnimations, gameState, setSettings }) => {
    const keysRef = useRef({});

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Prevent panel toggling if an input field is focused
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
                return;
            }
            
            keysRef.current[event.code] = true;

            // Edge-triggered click flag for Interact (F)
            if (event.code === 'KeyF') {
                keysRef.current['KeyFClicked'] = true;
            }

            // NEW: Double-tap Space toggles Dev Flight mode
            if (event.code === 'Space') {
                const now = performance.now();
                const last = keysRef.current.__lastSpaceTs || 0;
                keysRef.current.__lastSpaceTs = now;
                if (now - last < 300) {
                    // Signal toggle; movement system will consume this
                    keysRef.current['DevFlightToggle'] = true;
                }
            }

            const closeAllPanels = () => {
                setShowCharacter(false);
                setShowInventory(false);
                setShowWorldMap(false);
                if (gameState === 'Playing') { // Only close settings in-game with Esc
                    setShowSettings(false);
                    setShowAnimations(false);
                }
            };

            const togglePanel = (setter, key) => {
                setter(prev => {
                    const isOpen = !prev;
                    if (isOpen && gameState === 'Playing') {
                        if (key !== 'c') setShowCharacter(false);
                        if (key !== 'i') setShowInventory(false);
                        if (key !== 'm') setShowWorldMap(false);
                        if (key !== 'p') setShowSettings(false);
                        if (key !== 'b') setShowAnimations(false);
                    } else if (isOpen && gameState !== 'Playing' && key !== 'p') {
                        // In main menu, only allow settings to open
                        return false;
                    }
                    return isOpen;
                });
            };

            switch (event.code) {
                case 'KeyC':
                    togglePanel(setShowCharacter, 'c');
                    break;
                case 'KeyI':
                    togglePanel(setShowInventory, 'i');
                    break;
                case 'KeyM':
                    togglePanel(setShowWorldMap, 'm');
                    break;
                case 'KeyP':
                    togglePanel(setShowSettings, 'p');
                    break;
                case 'KeyB':
                    if (gameState === 'Playing' && setShowAnimations) {
                        togglePanel(setShowAnimations, 'b');
                    }
                    break;
                case 'KeyG':
                    if (setSettings && gameState === 'Playing') {
                        setSettings(prev => ({ ...prev, grid: !prev.grid }));
                    }
                    break;
                case 'KeyZ':
                    if (setShowMobileControls && gameState === 'Playing') {
                        setShowMobileControls(prev => !prev);
                    }
                    break;
                case 'KeyV':
                    // Toggle first-person view (handled in animation loop)
                    keysRef.current['ToggleFirstPerson'] = true;
                    const canvas = document.querySelector('canvas');
                    if (document.pointerLockElement) {
                        document.exitPointerLock();
                    } else if (canvas && canvas.requestPointerLock) {
                        canvas.requestPointerLock();
                    }
                    break;
                case 'Equal': // '=' zoom in
                    keysRef.current['ZoomInClicked'] = true;
                    break;
                case 'Minus': // '-' zoom out
                    keysRef.current['ZoomOutClicked'] = true;
                    break;
                case 'Escape':
                    closeAllPanels();
                    break;
            }
        };

        const handleKeyUp = (event) => {
            keysRef.current[event.code] = false;
        };

        // Mouse buttons (bind left-click for attack)
        const handleMouseDown = (event) => {
            // Only register attacks when clicking on the game canvas to avoid UI clicks triggering attacks
            if (event.button === 0 && event.target && event.target.tagName === 'CANVAS') {
                keysRef.current['MouseLeft'] = true;
                // Edge-triggered click flag (consumed by game logic)
                keysRef.current['MouseLeftClicked'] = true;
            }
        };
        const handleMouseUp = (event) => {
            if (event.button === 0) {
                keysRef.current['MouseLeft'] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [setShowCharacter, setShowInventory, setShowWorldMap, setShowSettings, setShowMobileControls, setShowAnimations, gameState, setSettings]);

    return keysRef;
};