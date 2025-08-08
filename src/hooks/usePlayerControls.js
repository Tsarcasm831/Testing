import { useEffect, useRef } from 'react';

export const usePlayerControls = ({ setShowCharacter, setShowInventory, setShowWorldMap, setShowSettings, setShowMobileControls, gameState }) => {
    const keysRef = useRef({});

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Prevent panel toggling if an input field is focused
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
                return;
            }
            
            keysRef.current[event.code] = true;

            const closeAllPanels = () => {
                setShowCharacter(false);
                setShowInventory(false);
                setShowWorldMap(false);
                if (gameState === 'Playing') { // Only close settings in-game with Esc
                    setShowSettings(false);
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
                case 'KeyZ':
                    if (setShowMobileControls && gameState === 'Playing') {
                        setShowMobileControls(prev => !prev);
                    }
                    break;
                case 'Escape':
                    closeAllPanels();
                    break;
            }
        };

        const handleKeyUp = (event) => {
            keysRef.current[event.code] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [setShowCharacter, setShowInventory, setShowWorldMap, setShowSettings, setShowMobileControls, gameState]);

    return keysRef;
};