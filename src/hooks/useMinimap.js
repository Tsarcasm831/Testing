import { useState, useEffect, useRef } from 'react';

export const useMinimap = ({ playerRef, worldObjects }) => {
    const animationFrameId = useRef();
    const minimapCanvasRef = useRef();
    const worldMinimapCanvasRef = useRef(null);
    const posXRef = useRef();
    const posZRef = useRef();

    const [minimapState, setMinimapState] = useState({
        left: window.innerWidth - 16 - 128,
        top: 16,
        width: 128,
        height: 128,
    });

    const [interaction, setInteraction] = useState({
        active: false,
        type: null, // 'move', 'resize-br', 'resize-bl', 'resize-tr', 'resize-tl'
        initialMouse: { x: 0, y: 0 },
        initialState: {},
    });

    // Update minimap position on window resize
    useEffect(() => {
        const handleResize = () => {
            setMinimapState(prev => ({
                ...prev,
                left: Math.min(prev.left, window.innerWidth - prev.width - 16),
                top: Math.min(prev.top, window.innerHeight - prev.height - 16),
            }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleInteractionStart = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setInteraction({
            active: true,
            type: type,
            initialMouse: { x: e.clientX, y: e.clientY },
            initialState: { ...minimapState },
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!interaction.active) return;
            
            const dx = e.clientX - interaction.initialMouse.x;
            const dy = e.clientY - interaction.initialMouse.y;

            let newState = {};
            const minSize = 64;

            switch (interaction.type) {
                case 'move':
                    newState = {
                        top: interaction.initialState.top + dy,
                        left: interaction.initialState.left + dx,
                    };
                    break;
                case 'resize-br': {
                    const dSize = Math.abs(dx) > Math.abs(dy) ? dx : dy;
                    const newSize = Math.max(minSize, interaction.initialState.width + dSize);
                    newState = { width: newSize, height: newSize };
                    break;
                }
                case 'resize-bl': {
                    const dSize = Math.abs(dx) > Math.abs(dy) ? -dx : dy;
                    const newSize = Math.max(minSize, interaction.initialState.width + dSize);
                    const sizeChange = newSize - interaction.initialState.width;
                    newState = { 
                        width: newSize, 
                        height: newSize,
                        left: interaction.initialState.left - sizeChange
                    };
                    break;
                }
                case 'resize-tr': {
                    const dSize = Math.abs(dx) > Math.abs(dy) ? dx : -dy;
                    const newSize = Math.max(minSize, interaction.initialState.width + dSize);
                    const sizeChange = newSize - interaction.initialState.width;
                    newState = { 
                        width: newSize, 
                        height: newSize,
                        top: interaction.initialState.top - sizeChange
                    };
                    break;
                }
                case 'resize-tl': {
                    const dSize = Math.abs(dx) > Math.abs(dy) ? -dx : -dy;
                    const newSize = Math.max(minSize, interaction.initialState.width + dSize);
                    const sizeChange = newSize - interaction.initialState.width;
                     newState = {
                        width: newSize,
                        height: newSize,
                        left: interaction.initialState.left - sizeChange,
                        top: interaction.initialState.top - sizeChange,
                    };
                    break;
                }
                default:
                    return;
            }
            setMinimapState(prev => ({ ...prev, ...newState }));
        };

        const handleMouseUp = () => {
            if (!interaction.active) return;
            setInteraction(prev => ({ ...prev, active: false }));
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [interaction]);

    useEffect(() => {
        const worldSize = 2000;
        const worldMinimapScale = 1; // 1 pixel per world unit.

        const canvas = document.createElement('canvas');
        canvas.width = worldSize * worldMinimapScale;
        canvas.height = worldSize * worldMinimapScale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = '#166534';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.src = '/ground_texture.png';
        img.onload = () => {
            // In the 3D scene, the 2000-unit ground plane repeats the texture 100 times.
            // This means one texture tile covers 2000 / 100 = 20 world units.
            const textureWorldSize = 20;

            // Create a small canvas to hold one scaled-down tile of the texture.
            const patternCanvas = document.createElement('canvas');
            patternCanvas.width = textureWorldSize * worldMinimapScale;
            patternCanvas.height = textureWorldSize * worldMinimapScale;
            const patternCtx = patternCanvas.getContext('2d');

            if (patternCtx) {
                // Draw the full texture image into the small canvas, effectively scaling it down.
                patternCtx.drawImage(img, 0, 0, patternCanvas.width, patternCanvas.height);
                
                // Create a repeating pattern from this small, scaled-down canvas.
                const pattern = ctx.createPattern(patternCanvas, 'repeat');
                if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            } else {
                // Fallback to original behavior if creating the pattern canvas fails.
                const pattern = ctx.createPattern(img, 'repeat');
                if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }

            worldMinimapCanvasRef.current = canvas;
        };
    }, []);

    useEffect(() => {
        const updateHudElements = () => {
            if (playerRef.current) {
                const { x, z } = playerRef.current.position;
                
                if (posXRef.current) {
                    posXRef.current.textContent = `X: ${Math.round(x)}`;
                }
                if (posZRef.current) {
                    posZRef.current.textContent = `Z: ${Math.round(z)}`;
                }
                
                const canvas = minimapCanvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (ctx && canvas) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    const minimapViewSize = 120;
                    const viewScale = canvas.width / minimapViewSize;

                    const worldMinimapCanvas = worldMinimapCanvasRef.current;
                    if (worldMinimapCanvas) {
                        const worldSize = 2000;
                        const sourceSize = minimapViewSize;
                        const sourceX = (x + worldSize / 2) - (sourceSize / 2);
                        const sourceY = (z + worldSize / 2) - (sourceSize / 2);
                        
                        ctx.drawImage(
                            worldMinimapCanvas,
                            sourceX, sourceY,
                            sourceSize, sourceSize,
                            0, 0,
                            canvas.width, canvas.height
                        );
                    } else {
                         ctx.fillStyle = '#166534';
                         ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.lineWidth = 0.5;
                    for(let i = 0; i < 8; i++) {
                        ctx.beginPath();
                        ctx.moveTo(i * canvas.width/8, 0);
                        ctx.lineTo(i * canvas.width/8, canvas.height);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(0, i * canvas.height/8);
                        ctx.lineTo(canvas.width, i * canvas.height/8);
                        ctx.stroke();
                    }

                    const halfCanvas = canvas.width / 2;

                    worldObjects.forEach(obj => {
                        const dx = obj.position.x - x;
                        const dz = obj.position.z - z;
                        const distSq = dx * dx + dz * dz;

                        if (distSq < (minimapViewSize / 2) * (minimapViewSize / 2)) {
                            const mapX = halfCanvas + dx * viewScale;
                            const mapZ = halfCanvas + dz * viewScale;
                            
                            ctx.fillStyle = `#${obj.color}`;
                            ctx.beginPath();
                            ctx.arc(mapX, mapZ, 2, 0, 2 * Math.PI);
                            ctx.fill();
                        }
                    });

                    ctx.fillStyle = 'red';
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(halfCanvas, halfCanvas, 4, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            animationFrameId.current = requestAnimationFrame(updateHudElements);
        };

        animationFrameId.current = requestAnimationFrame(updateHudElements);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [playerRef, worldObjects, minimapState.width, minimapState.height]);

    return { minimapState, minimapCanvasRef, posXRef, posZRef, handleInteractionStart };
};