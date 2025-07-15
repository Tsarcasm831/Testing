import * as THREE from 'three';

export class CompassUI {
    constructor(dependencies) {
        this.playerControls = dependencies.playerControls;
        this.container = null;
        this.headingBar = null;
        this.coordsDisplay = null;

        /* @tweakable The number of pixels per degree of rotation on the heading bar. Controls scroll speed. */
        this.pixelsPerDegree = 5;
        
        /* @tweakable An optional rotation offset in degrees to calibrate the compass direction. */
        this.rotationOffset = 0;
    }

    create() {
        const uiContainer = document.getElementById('ui-container');

        this.container = document.createElement('div');
        this.container.id = 'heading-bar-container';

        this.headingBar = document.createElement('div');
        this.headingBar.id = 'heading-bar';
        this.container.appendChild(this.headingBar);
        
        const centerMarker = document.createElement('div');
        centerMarker.id = 'heading-center-marker';
        this.container.appendChild(centerMarker);

        this.coordsDisplay = document.createElement('div');
        this.coordsDisplay.id = 'compass-coords';
        
        uiContainer.appendChild(this.container);
        uiContainer.appendChild(this.coordsDisplay);

        this.populateHeadingBar();
    }
    
    populateHeadingBar() {
        const directions = {
            0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW'
        };

        const totalWidth = 360 * this.pixelsPerDegree;
        
        // We create two copies of the 360-degree ticks to allow for seamless looping
        for(let cycle = 0; cycle < 2; cycle++) {
            const cycleOffset = cycle * totalWidth;

            for (let i = 0; i < 360; i++) {
                if (directions[i]) {
                    const majorTick = document.createElement('div');
                    majorTick.className = 'heading-tick major';
                    majorTick.style.left = `${cycleOffset + i * this.pixelsPerDegree}px`;
                    
                    const label = document.createElement('span');
                    label.className = 'heading-label';
                    label.textContent = directions[i];
                    majorTick.appendChild(label);
    
                    this.headingBar.appendChild(majorTick);
                } else if (i % 10 === 0) { // Ticks every 10 degrees
                    const tick = document.createElement('div');
                    tick.className = 'heading-tick minor';
                    tick.style.left = `${cycleOffset + i * this.pixelsPerDegree}px`;
                    this.headingBar.appendChild(tick);
                }
            }
        }
    }

    update() {
        if (!this.playerControls || !this.headingBar) return;

        const camera = this.playerControls.camera;
        if (!camera) return;

        // Get camera direction
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);

        // Calculate horizontal angle (azimuth)
        const angleRad = Math.atan2(cameraDirection.x, cameraDirection.z);
        const rotationDegrees = angleRad * (180 / Math.PI);
        
        const adjustedDegrees = rotationDegrees - this.rotationOffset;

        // Normalize degrees to be within the 0-360 range for the compass logic
        const normalizedDegrees = ((adjustedDegrees % 360) + 360) % 360;
        
        const barWidth = this.container.offsetWidth;
        const totalStripWidth = 360 * this.pixelsPerDegree;

        // Center the current degree in the middle of the container
        const offset = -normalizedDegrees * this.pixelsPerDegree + barWidth / 2;
        
        this.headingBar.style.transform = `translateX(${offset}px)`;

        const playerModel = this.playerControls.getPlayerModel();
        if (!playerModel) return;
        const pos = playerModel.position;
        this.coordsDisplay.textContent = `X: ${pos.x.toFixed(1)} | Y: ${pos.y.toFixed(1)} | Z: ${pos.z.toFixed(1)}`;
    }
}