import { useEffect, useRef } from 'react';

export const usePlayerControls = ({ setShowCharacter, setShowInventory, setShowWorldMap, setShowSettings }) => {
    const keysRef = useRef({});

    useEffect(() => {
        const handleKeyDown = (event) => {
            keysRef.current[event.code] = true;

            if (event.code === 'KeyC') {
                setShowCharacter(prev => !prev);
                setShowInventory(false);
                setShowWorldMap(false);
                setShowSettings(false);
            }
            if (event.code === 'KeyI') {
                setShowInventory(prev => !prev);
                setShowCharacter(false);
                setShowWorldMap(false);
                setShowSettings(false);
            }
            if (event.code === 'KeyM') {
                setShowWorldMap(prev => !prev);
                setShowCharacter(false);
                setShowInventory(false);
                setShowSettings(false);
            }
            if (event.code === 'KeyP') {
                setShowSettings(prev => !prev);
                setShowCharacter(false);
                setShowInventory(false);
                setShowWorldMap(false);
            }
            if (event.code === 'Escape') {
                setShowCharacter(false);
                setShowInventory(false);
                setShowWorldMap(false);
                setShowSettings(false);
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
    }, [setShowCharacter, setShowInventory, setShowWorldMap, setShowSettings]);

    return keysRef;
};