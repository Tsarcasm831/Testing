import { getColor, getHeight } from './terrain-generator.js';
import * as THREE from 'three';

class MapRenderer {
    constructor() {
        this.modal = document.getElementById('map-modal');
        this.canvas = document.getElementById('map-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
        this.playerMarker = document.getElementById('map-player-marker');
        this.mapContainer = document.getElementById('map-container');
        this.loadingText = document.getElementById('map-loading-text');

        this.player = null;
        this.multiplayerManager = null;
        this.isVisible = false;
        
        this.otherPlayerMarkers = new Map();
        this.markerUpdateInterval = null;

        this.mapSize = 512; // Increased from 256 for better resolution
        this.worldViewSize = 2048; // The area of the world the map shows
        this.cachedMapData = null; // To store the generated map
        this.isGenerating = false;
    }

    init(player, multiplayerManager) {
        this.player = player;
        this.multiplayerManager = multiplayerManager;
        if (this.canvas) {
            this.canvas.width = this.mapSize;
            this.canvas.height = this.mapSize;
        }
    }

    async pregenerateMap() {
        if (!this.ctx || this.cachedMapData || this.isGenerating) return;

        console.log("Starting map pre-generation...");
        this.isGenerating = true;

        const imageData = this.ctx.createImageData(this.mapSize, this.mapSize);
        const data = imageData.data;
        const color = new THREE.Color();

        // Generate map centered on world origin
        const mapCenterWorldX = 0;
        const mapCenterWorldZ = 0;
        
        const startX = mapCenterWorldX - this.worldViewSize / 2;
        const startZ = mapCenterWorldZ - this.worldViewSize / 2;
        
        const unitsPerPixel = this.worldViewSize / this.mapSize;

        let lastYieldTime = performance.now();

        for (let y = 0; y < this.mapSize; y++) {
            for (let x = 0; x < this.mapSize; x++) {
                const worldX = startX + x * unitsPerPixel;
                const worldZ = startZ + y * unitsPerPixel;
                
                const height = getHeight(worldX, worldZ);
                getColor(height, color);
                
                const index = (y * this.mapSize + x) * 4;
                data[index]     = color.r * 255;
                data[index + 1] = color.g * 255;
                data[index + 2] = color.b * 255;
                data[index + 3] = 255;
            }
            // Yield if we've been working for more than a frame's worth of time
            const now = performance.now();
            if (now - lastYieldTime > 16) {
                await new Promise(resolve => setTimeout(resolve, 0));
                lastYieldTime = now;
            }
        }
        
        this.cachedMapData = imageData;
        this.isGenerating = false;
        console.log("Map pre-generation complete.");
    }

    updateMarkers() {
        if (!this.player || !this.playerMarker || !this.mapContainer) return;

        // The map is now static and centered at world origin (0,0)
        const mapTopLeftWorldX = -this.worldViewSize / 2;
        const mapTopLeftWorldZ = -this.worldViewSize / 2;
        
        // Calculate the scale of the canvas element relative to its native size
        const canvasRect = this.canvas.getBoundingClientRect();
        const canvasElementSize = Math.min(canvasRect.width, canvasRect.height);
        const unitsPerPixel = this.worldViewSize / canvasElementSize;

        // --- Update local player marker ---
        const playerPos = this.player.position;
        const playerOffsetX = playerPos.x - mapTopLeftWorldX;
        const playerOffsetZ = playerPos.z - mapTopLeftWorldZ;
        const markerX = playerOffsetX / unitsPerPixel;
        const markerY = playerOffsetZ / unitsPerPixel;
        
        if (markerX >= 0 && markerX < canvasElementSize && markerY >= 0 && markerY < canvasElementSize) {
            this.playerMarker.style.display = 'block';
            this.playerMarker.style.left = `${markerX}px`;
            this.playerMarker.style.top = `${markerY}px`;
            
            const playerDir = new THREE.Vector3();
            this.player.camera.getWorldDirection(playerDir);
            const angle = Math.atan2(playerDir.x, playerDir.z);
            this.playerMarker.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
        } else {
            this.playerMarker.style.display = 'none';
        }

        // --- Update other player markers ---
        const room = this.multiplayerManager?.getRoom();
        if (!room || !room.peers) return;
        
        const currentPeerIds = Object.keys(room.peers);
        const myId = room.clientId;

        // Remove markers for disconnected players
        for (const [clientId, marker] of this.otherPlayerMarkers.entries()) {
             if (!currentPeerIds.includes(clientId) || clientId === myId) {
                marker.remove();
                this.otherPlayerMarkers.delete(clientId);
            }
        }
        
        for (const clientId in room.peers) {
            if (clientId === myId) continue;
            
            const otherPlayer = this.multiplayerManager.otherPlayers.get(clientId);
            if (!otherPlayer) continue;

            const otherPlayerPos = otherPlayer.group.position;
            
            const otherPlayerOffsetX = otherPlayerPos.x - mapTopLeftWorldX;
            const otherPlayerOffsetZ = otherPlayerPos.z - mapTopLeftWorldZ;
            const otherMarkerX = otherPlayerOffsetX / unitsPerPixel;
            const otherMarkerY = otherPlayerOffsetZ / unitsPerPixel;

            if (otherMarkerX >= 0 && otherMarkerX < canvasElementSize && otherMarkerY >= 0 && otherMarkerY < canvasElementSize) {
                let marker = this.otherPlayerMarkers.get(clientId);
                if (!marker) {
                    marker = document.createElement('div');
                    marker.className = 'map-peer-marker';
                    const username = room.peers[clientId]?.username || 'P';
                    marker.textContent = username.substring(0, 1).toUpperCase();
                    marker.title = username;
                    this.mapContainer.appendChild(marker);
                    this.otherPlayerMarkers.set(clientId, marker);
                }
                marker.style.left = `${otherMarkerX}px`;
                marker.style.top = `${otherMarkerY}px`;
                marker.style.display = 'flex';
            } else {
                let marker = this.otherPlayerMarkers.get(clientId);
                if (marker) {
                    marker.style.display = 'none';
                }
            }
        }
    }

    show() {
        if (this.isVisible || !this.modal) return;
        this.isVisible = true;
        this.modal.style.display = 'flex';
        
        if (this.cachedMapData) {
            this.loadingText.style.display = 'none';
            this.canvas.style.display = 'block';
            this.ctx.putImageData(this.cachedMapData, 0, 0);
            this.updateMarkers();
        } else {
            this.loadingText.textContent = 'Map is being generated...';
            this.loadingText.style.display = 'block';
            this.canvas.style.display = 'none';
        }
        
        this.markerUpdateInterval = setInterval(() => {
            if (this.isVisible) {
                this.updateMarkers();
            }
        }, 500);
    }
    
    hide() {
        if (!this.isVisible || !this.modal) return;
        this.isVisible = false;
        this.modal.style.display = 'none';
        
        if (this.markerUpdateInterval) {
            clearInterval(this.markerUpdateInterval);
            this.markerUpdateInterval = null;
        }

        for (const marker of this.otherPlayerMarkers.values()) {
            marker.remove();
        }
        this.otherPlayerMarkers.clear();
    }
}

export const mapRenderer = new MapRenderer();