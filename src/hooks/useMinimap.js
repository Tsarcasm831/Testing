import { useState, useEffect, useRef } from 'react';
import { WORLD_SIZE, TILE_SIZE, TEXTURE_WORLD_UNITS, getBiomeAt, getTerrainTextureForBiome } from '../scene/terrain.js';
import { drawRiver, drawRoads } from '../components/game/objects/konoha_roads.js';

// @tweakable show or hide roads on the minimap/world canvas
const MINIMAP_DRAW_ROADS = true;
// @tweakable show or hide river on the minimap/world canvas
const MINIMAP_DRAW_RIVER = true;
// @tweakable global road opacity for the minimap/world canvas (0..1)
const MINIMAP_ROAD_ALPHA = 0.9;
// @tweakable base road widths on the minimap/world canvas (pixels at world scale 1)
const MINIMAP_W_PRIMARY = 10.0, MINIMAP_W_SECONDARY = 7.0, MINIMAP_W_TERTIARY = 4.0;

export const useMinimap = ({ playerRef, worldObjects, zoomRef }) => {
    const animationFrameId = useRef();
    const minimapCanvasRef = useRef();
    const worldMinimapCanvasRef = useRef(null);
    const posXRef = useRef();
    const posZRef = useRef();
    const zoomLevelRef = useRef();
    const biomeRef = useRef(); // NEW: biome line under minimap

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

    // Build a world-sized canvas where each pixel maps to 1 world unit,
    // using the same biome partitioning and textures as the 3D terrain.
    useEffect(() => {
        const worldSize = WORLD_SIZE;
        const tileSize = TILE_SIZE;
        const textureWorldSize = TEXTURE_WORLD_UNITS; // one texture tile == 20 world units
        const numTiles = worldSize / tileSize;

        const canvas = document.createElement('canvas');
        canvas.width = worldSize;
        canvas.height = worldSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Preload all terrain images used by biomes
        const biomes = ['grass', 'sand', 'dirt', 'rocky', 'snow', 'forest'];
        const uniqueSrcs = new Set(biomes.map(b => getTerrainTextureForBiome(b)));
        const imageMap = new Map();

        const loadImage = (src) =>
            new Promise((resolve) => {
                const img = new Image();
                img.src = `/${src}`;
                img.onload = () => resolve({ src, img });
                img.onerror = () => resolve({ src, img: null });
            });

        (async () => {
            const loaded = await Promise.all([...uniqueSrcs].map(loadImage));
            loaded.forEach(({ src, img }) => {
                if (img) imageMap.set(src, img);
            });

            // Draw per tile with a repeating pattern matching in-game repeats
            for (let i = 0; i < numTiles; i++) {
                for (let j = 0; j < numTiles; j++) {
                    const x = (i - numTiles / 2) * tileSize + tileSize / 2;
                    const z = (j - numTiles / 2) * tileSize + tileSize / 2;

                    // Minimap canvas uses +X to the right, +Z downward; convert world coords to canvas space
                    const canvasX = x + worldSize / 2 - tileSize / 2;
                    const canvasY = z + worldSize / 2 - tileSize / 2;

                    const biome = getBiomeAt(x, z);
                    const texFile = getTerrainTextureForBiome(biome);
                    const img = imageMap.get(texFile);

                    if (!img) {
                        // Fallback fill color per biome if image missing
                        const fallback = {
                            grass: '#2d6a4f',
                            sand: '#e9d8a6',
                            dirt: '#6b4f4f',
                            rocky: '#6d6875',
                            snow: '#e6e6e6',
                            forest: '#1b4332'
                        };
                        ctx.fillStyle = fallback[biome] || '#166534';
                        ctx.fillRect(canvasX, canvasY, tileSize, tileSize);
                        continue;
                    }

                    // Build a small pattern tile: scale the source texture to 20x20 world pixels
                    const patternCanvas = document.createElement('canvas');
                    patternCanvas.width = textureWorldSize;
                    patternCanvas.height = textureWorldSize;
                    const pctx = patternCanvas.getContext('2d');
                    pctx.drawImage(img, 0, 0, patternCanvas.width, patternCanvas.height);

                    const pattern = ctx.createPattern(patternCanvas, 'repeat');
                    if (pattern) {
                        ctx.save();
                        ctx.fillStyle = pattern;
                        ctx.translate(canvasX, canvasY);
                        ctx.fillRect(0, 0, tileSize, tileSize);
                        ctx.restore();
                    } else {
                        // As a last resort, stretch the image to cover the tile
                        ctx.drawImage(img, canvasX, canvasY, tileSize, tileSize);
                    }
                }
            }

            // Draw roads and river on top of terrain for global reuse by minimap and world map
            const scale = 1; // 1 pixel = 1 world unit on this canvas
            const cx = worldSize / 2;
            const cy = worldSize / 2;
            if (MINIMAP_DRAW_ROADS) {
                await drawRoads(ctx, scale, cx, cy, {
                    alpha: MINIMAP_ROAD_ALPHA,
                    wPrimary: MINIMAP_W_PRIMARY,
                    wSecondary: MINIMAP_W_SECONDARY,
                    wTertiary: MINIMAP_W_TERTIARY
                });
            }
            if (MINIMAP_DRAW_RIVER) {
                drawRiver(ctx, scale, cx, cy);
            }
            worldMinimapCanvasRef.current = canvas;
        })();
    }, []);

    useEffect(() => {
        const updateHudElements = () => {
            const now = performance.now();
            const desiredFps = 12; // throttle minimap + HUD text to ~12fps to reduce load
            const frameInterval = 1000 / desiredFps;
            if (!updateHudElements.last) updateHudElements.last = 0;
            if (now - updateHudElements.last < frameInterval) {
                animationFrameId.current = requestAnimationFrame(updateHudElements);
                return;
            }
            updateHudElements.last = now;

            if (playerRef.current) {
                const { x, z } = playerRef.current.position;
                
                if (posXRef.current) {
                    posXRef.current.textContent = `X: ${Math.round(x)}`;
                }
                if (posZRef.current) {
                    posZRef.current.textContent = `Z: ${Math.round(z)}`;
                }
                if (zoomRef?.current && zoomLevelRef.current) {
                    const defaultZoom = 0.2;
                    const multiplier = zoomRef.current / defaultZoom;
                    const zoomLevel = Math.round(multiplier);
                    zoomLevelRef.current.textContent = `Zoom Level: ${zoomLevel}`;
                }
                // NEW: Update biome text
                if (biomeRef.current) {
                    const biomeRaw = getBiomeAt(x, z);
                    const biome = biomeRaw ? biomeRaw.charAt(0).toUpperCase() + biomeRaw.slice(1) : 'Unknown';
                    biomeRef.current.textContent = `Biome: ${biome}`;
                }
                
                const canvas = minimapCanvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (ctx && canvas) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    const minimapViewSize = 120;
                    const viewScale = canvas.width / minimapViewSize;

                    const worldMinimapCanvas = worldMinimapCanvasRef.current;
                    if (worldMinimapCanvas) {
                        const worldSize = WORLD_SIZE;
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
                         // Quick fallback before the world canvas is ready
                         const biome = getBiomeAt(x, z);
                         const fallback = {
                            grass: '#2d6a4f',
                            sand: '#e9d8a6',
                            dirt: '#6b4f4f',
                            rocky: '#6d6875',
                            snow: '#e6e6e6',
                            forest: '#1b4332'
                         };
                         ctx.fillStyle = fallback[biome] || '#166534';
                         ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    
                    // Grid overlay
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

                    // World objects dots
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

                    // Player marker
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

        updateHudElements.last = 0;
        animationFrameId.current = requestAnimationFrame(updateHudElements);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [playerRef, worldObjects, minimapState.width, minimapState.height, zoomRef]);
    
    return { minimapState, minimapCanvasRef, posXRef, posZRef, zoomLevelRef, biomeRef, handleInteractionStart };
};