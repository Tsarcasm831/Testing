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
            this.continuousDegrees = -this.lastCameraAngle * (180 / Math.PI);
        }
    }
    
    populateHeadingBar() {
        const directions = {
            0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW'
        };
        const numberDegrees = [30, 60, 120, 150, 210, 240, 300, 330];

        const totalWidth = 360 * this.pixelsPerDegree;
        
        // We create two copies of the 360-degree ticks to allow for seamless looping
        for(let cycle = -1; cycle <= 1; cycle++) { // Create 3 cycles for smooth wrapping
            const cycleOffset = cycle * totalWidth;

            // Add major ticks with direction labels
            for (const deg in directions) {
                const tickContainer = document.createElement('div');
                tickContainer.className = 'heading-tick-container';
                tickContainer.style.left = `${cycleOffset + parseInt(deg) * this.pixelsPerDegree}px`;
                
                const tick = document.createElement('div');
                tick.className = 'heading-tick major';
                tickContainer.appendChild(tick);

                const label = document.createElement('span');
                label.className = 'heading-label direction';
                label.textContent = directions[deg];
                if (parseInt(deg) === 0) {
                    label.classList.add('north');
                }
                tickContainer.appendChild(label);
                
                this.headingBar.appendChild(tickContainer);
            }

            // Add major ticks with number labels
            numberDegrees.forEach(deg => {
                const tickContainer = document.createElement('div');
                tickContainer.className = 'heading-tick-container';
                tickContainer.style.left = `${cycleOffset + deg * this.pixelsPerDegree}px`;

                const tick = document.createElement('div');
                tick.className = 'heading-tick major';
                tickContainer.appendChild(tick);

                const label = document.createElement('span');
                label.className = 'heading-label number';
                label.textContent = deg;
                tickContainer.appendChild(label);

                this.headingBar.appendChild(tickContainer);
            });
            
            // Add minor ticks
            for (let i = 0; i < 360; i += 10) {
                if (!directions[i] && !numberDegrees.includes(i)) {
                    const tickContainer = document.createElement('div');
                    tickContainer.className = 'heading-tick-container';
                    tickContainer.style.left = `${cycleOffset + i * this.pixelsPerDegree}px`;
                    const tick = document.createElement('div');
                    tick.className = 'heading-tick minor';
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
        this.continuousDegrees -= diff * (180 / Math.PI);
        
        // Correct degrees so North is 0. atan2(x,z) gives 0 for +Z, which we want as North (0 deg)
        // No correction needed here, but an offset might be desired for calibration.
        let correctedDegrees = this.continuousDegrees;
        
        // Normalize to 0-360 range for display/logic if needed, but use continuous for transform
        let displayDegrees = (correctedDegrees + 360) % 360;
        
        const adjustedDegrees = correctedDegrees + this.rotationOffset;
        
        const barWidth = this.container.offsetWidth;

        // Center the current degree in the middle of the container
        const offset = -adjustedDegrees * this.pixelsPerDegree + barWidth / 2;
        
        // Use modulo to wrap the offset for seamless scrolling with 3 cycles
        const totalBarWidth = 360 * this.pixelsPerDegree;
        const wrappedOffset = offset % totalBarWidth;
        
        this.headingBar.style.transform = `translateX(${wrappedOffset}px)`;

        const playerModel = this.playerControls.getPlayerModel();
        if (!playerModel) return;
        const pos = playerModel.position;
        this.coordsDisplay.textContent = `X: ${pos.x.toFixed(1)} | Y: ${pos.y.toFixed(1)} | Z: ${pos.z.toFixed(1)}`;
    }
}