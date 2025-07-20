import * as THREE from 'three';
import { getHeight, getBiome } from './terrain-generator.js';

export class HUD {
    constructor(player, camera) {
        this.player = player;
        this.camera = camera;
        this.hudEl = document.getElementById('hud');
        
        this.coordsEl = document.getElementById('hud-coords');
        this.biomeEl = document.getElementById('hud-biome');
        this.compassEl = document.getElementById('hud-compass');
        this.timeEl = document.getElementById('hud-time');

        this.lastHudUpdateTime = 0;
        this.hudUpdateInterval = 200; // ms
        
        this.cameraDirection = new THREE.Vector3();
    }

    init() {
        if (this.hudEl) {
            this.hudEl.style.display = 'block';
        }
    }

    update(time, sky) {
        if (!this.hudEl || !this.player) return;
        
        if (time - this.lastHudUpdateTime > this.hudUpdateInterval) {
            const playerPosition = this.player.position;
            
            // Update Coords
            const x = playerPosition.x.toFixed(1);
            const y = playerPosition.y.toFixed(1);
            const z = playerPosition.z.toFixed(1);
            this.coordsEl.textContent = `X:${x} Y:${y} Z:${z}`;

            // Update Biome
            const biome = getBiome(playerPosition.x, playerPosition.z);
            this.biomeEl.textContent = `Biome: ${biome}`;
            if(sky){
                sky.setBiome(biome);
            }
            
            // Update Compass
            this.camera.getWorldDirection(this.cameraDirection);
            const angle = Math.atan2(this.cameraDirection.x, -this.cameraDirection.z); // Flip Z-axis for correct direction
            this.compassEl.textContent = this.getCompassDirection(angle);

            // Update Time
            const cyclePosition = sky.getCyclePosition();
            const gameHours = Math.floor(cyclePosition * 24);
            const gameMinutes = Math.floor(((cyclePosition * 24) % 1) * 60);
            this.timeEl.textContent = `${String(gameHours).padStart(2, '0')}:${String(gameMinutes).padStart(2, '0')}`;
            
            this.lastHudUpdateTime = time;
        }
    }

    getCompassDirection(angle) {
        const degrees = (angle * 180 / Math.PI + 360) % 360;
        if (degrees >= 337.5 || degrees < 22.5) return ' N ';
        if (degrees < 67.5) return 'NE';
        if (degrees < 112.5) return ' E ';
        if (degrees < 157.5) return 'SE';
        if (degrees < 202.5) return ' S ';
        if (degrees < 247.5) return 'SW';
        if (degrees < 292.5) return ' W ';
        return 'NW';
    }
}