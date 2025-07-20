import * as THREE from 'three';
import { settings } from './settings.js';

export class MobileControlsHandler {
    constructor(playerControls) {
        this.playerControls = playerControls;
        this.camera = playerControls.camera;
        this.uiManager = playerControls.uiManager;
        this.init();
    }
    
    init() {
        const mobileControlsEl = document.getElementById('mobile-controls');
        const desktopInstructions = document.getElementById('desktop-instructions');
        const mobileInstructions = document.getElementById('mobile-instructions');
        const mobileSettingsBtn = document.getElementById('mobile-settings-button');
        const mobilePlayersBtn = document.getElementById('mobile-players-button');
        const mobileMapBtn = document.getElementById('mobile-map-button');
        
        mobileControlsEl.style.display = 'block';
        desktopInstructions.style.display = 'none';
        mobileInstructions.style.display = 'block';
        mobileSettingsBtn.style.display = 'block';
        mobilePlayersBtn.style.display = 'block';
        mobileMapBtn.style.display = 'block';

        const joystickArea = document.getElementById('joystick-area');
        const joystickContainer = document.getElementById('joystick-container');
        const joystickThumb = document.getElementById('joystick-thumb');
        const jumpButton = document.getElementById('jump-button');
        const lookArea = document.getElementById('look-area');

        let joystickTouchId = null;
        let lookTouchId = null;
        let lastLookPosition = { x: 0, y: 0 };
        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        const PI_2 = Math.PI / 2;

        joystickArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (joystickTouchId === null) {
                joystickTouchId = e.changedTouches[0].identifier;
                const touch = e.changedTouches[0];
                joystickContainer.style.left = `${touch.clientX}px`;
                joystickContainer.style.top = `${touch.clientY}px`;
                joystickContainer.style.display = 'block';
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === joystickTouchId) {
                    const rect = joystickContainer.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    let dx = touch.clientX - centerX;
                    let dy = touch.clientY - centerY;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    const maxDist = rect.width / 2;

                    if (distance > maxDist) {
                        dx *= maxDist / distance;
                        dy *= maxDist / distance;
                    }
                    
                    joystickThumb.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;

                    const normalizedX = dx / maxDist;
                    const normalizedY = dy / maxDist;

                    this.playerControls.moveForward = normalizedY < -0.2;
                    this.playerControls.moveBackward = normalizedY > 0.2;
                    this.playerControls.moveLeft = normalizedX < -0.2;
                    this.playerControls.moveRight = normalizedX > 0.2;

                    this.playerControls.isSprinting = distance > maxDist * 0.8;
                } else if (touch.identifier === lookTouchId) {
                    const movementX = touch.clientX - lastLookPosition.x;
                    const movementY = touch.clientY - lastLookPosition.y;

                    const sensitivity = settings.get('mouseSensitivity');
                    euler.setFromQuaternion(this.camera.quaternion);
                    euler.y -= movementX * 0.002 * sensitivity;
                    euler.x -= movementY * 0.002 * sensitivity;
                    euler.x = Math.max(PI_2 - 1.5, Math.min(PI_2 - 0.1, euler.x));
                    this.camera.quaternion.setFromEuler(euler);

                    lastLookPosition = { x: touch.clientX, y: touch.clientY };
                }
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === joystickTouchId) {
                    joystickTouchId = null;
                    joystickThumb.style.transform = 'translate(-50%, -50%)';
                    joystickContainer.style.display = 'none';
                    this.playerControls.moveForward = false;
                    this.playerControls.moveBackward = false;
                    this.playerControls.moveLeft = false;
                    this.playerControls.moveRight = false;
                    this.playerControls.isSprinting = false;
                } else if (touch.identifier === lookTouchId) {
                    lookTouchId = null;
                }
            }
        });

        jumpButton.addEventListener('touchstart', (e) => { e.preventDefault(); this.playerControls.wantsToJump = true; }, { passive: false });
        jumpButton.addEventListener('touchend', (e) => { e.preventDefault(); this.playerControls.wantsToJump = false; }, { passive: false });
        
        lookArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (lookTouchId === null) {
                const touch = e.changedTouches[0];
                lookTouchId = touch.identifier;
                lastLookPosition = { x: touch.clientX, y: touch.clientY };
            }
        }, { passive: false });
        
        mobileSettingsBtn.addEventListener('click', () => this.uiManager.toggleSettings());
        mobilePlayersBtn.addEventListener('click', () => this.uiManager.toggleOnlinePlayers());
        mobileMapBtn.addEventListener('click', () => this.uiManager.toggleMap());
    }
}