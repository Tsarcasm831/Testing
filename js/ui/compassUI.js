import * as THREE from 'three';

export class CompassUI {
    constructor(dependencies) {
        this.playerControls = dependencies.playerControls;
        this.container = null;
        this.headingBar = null;
        this.coordsDisplay = null;
        this.lastCameraAngle = 0;
        this.continuousDegrees = 0;

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

        // Initialize with current camera angle
        if (this.playerControls && this.playerControls.camera) {
            const cameraDirection = new THREE.Vector3();
            this.playerControls.camera.getWorldDirection(cameraDirection);
            this.lastCameraAngle = Math.atan2(cameraDirection.x, cameraDirection.z);
            this.continuousDegrees = this.lastCameraAngle * (180 / Math.PI);
        }
    }
    
    populateHeadingBar() {
        const directions = {
            0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW'
        };
        const numberDegrees = [0, 30, 60, 120, 150, 210, 240, 300, 330];

        const totalWidth = 360 * this.pixelsPerDegree;
        
        // We create two copies of the 360-degree ticks to allow for seamless looping
        for(let cycle = 0; cycle < 2; cycle++) {
            const cycleOffset = cycle * totalWidth;

            for (let i = 0; i < 360; i++) {
                const tickContainer = document.createElement('div');
                tickContainer.className = 'heading-tick-container';
                tickContainer.style.left = `${cycleOffset + i * this.pixelsPerDegree}px`;
                
                let tick;

                if (directions[i]) {
                    tick = document.createElement('div');
                    tick.className = 'heading-tick major';
                    
                    const label = document.createElement('span');
                    label.className = 'heading-label direction';
                    label.textContent = directions[i];
                    if (i === 0) {
                        label.classList.add('north');
                    }
                    tickContainer.appendChild(label);
                } else if (numberDegrees.includes(i)) {
                    tick = document.createElement('div');
                    tick.className = 'heading-tick major';

                    const label = document.createElement('span');
                    label.className = 'heading-label number';
                    label.textContent = i;
                    tickContainer.appendChild(label);
                }
                else if (i % 10 === 0) { // Ticks every 10 degrees
                    tick = document.createElement('div');
                    tick.className = 'heading-tick minor';
                }

                if (tick) {
                    tickContainer.appendChild(tick);
                    this.headingBar.appendChild(tickContainer);
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
        
        // Unwrap the angle to get a continuous value, preventing "jumps" at the 180/-180 degree mark.
        let diff = angleRad - this.lastCameraAngle;
        if (diff > Math.PI) {
            diff -= 2 * Math.PI;
        } else if (diff < -Math.PI) {
            diff += 2 * Math.PI;
        }
        this.lastCameraAngle = angleRad;
        this.continuousDegrees += diff * (180 / Math.PI);
        
        const adjustedDegrees = this.continuousDegrees - this.rotationOffset;
        
        const barWidth = this.container.offsetWidth;

        // Center the current degree in the middle of the container
        const offset = -adjustedDegrees * this.pixelsPerDegree + barWidth / 2;
        
        this.headingBar.style.transform = `translateX(${offset}px)`;

        const playerModel = this.playerControls.getPlayerModel();
        if (!playerModel) return;
        const pos = playerModel.position;
        this.coordsDisplay.textContent = `X: ${pos.x.toFixed(1)} | Y: ${pos.y.toFixed(1)} | Z: ${pos.z.toFixed(1)}`;
    }
}