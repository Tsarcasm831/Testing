import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { settings } from './settings.js';
import { UIManager } from './ui-manager.js';
import { MobileControlsHandler } from './mobile-controls-handler.js';

export const PLAYER_HEIGHT = 2.0;
const PLAYER_START_Y = 10; // Start high enough to be above terrain

export class PlayerControls {
    constructor(camera, playerAudio) {
        camera.position.y = PLAYER_START_Y;
        this.camera = camera;
        this.controls = new PointerLockControls(camera, document.body);
        this.playerAudio = playerAudio;

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.isSprinting = false;
        this.wantsToJump = false;

        this.isMobile = 'ontouchstart' in window;
        
        this.uiManager = new UIManager(this);

        if (!this.isMobile) {
            this.patchPointerLockControls(camera);
        } else {
            new MobileControlsHandler(this);
        }

        this.initDesktopListeners();
    }

    getControlsObject() {
        return this.controls.getObject();
    }
    
    isLocked() {
        // On mobile, "locked" means the instructions screen is hidden.
        return this.isMobile ? this.uiManager.isGameActive() : this.controls.isLocked;
    }

    setOnlinePlayersUI(ui) {
        this.uiManager.setOnlinePlayersUI(ui);
    }

    patchPointerLockControls(camera) {
        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        const PI_2 = Math.PI / 2;

        this.controls.onMouseMove = (event) => {
            if (this.controls.isLocked === false) return;

            const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            const sensitivity = settings.get('mouseSensitivity');

            euler.setFromQuaternion(camera.quaternion);

            euler.y -= movementX * 0.002 * sensitivity;
            euler.x -= movementY * 0.002 * sensitivity;

            euler.x = Math.max(PI_2 - this.controls.maxPolarAngle, Math.min(PI_2 - this.controls.minPolarAngle, euler.x));

            camera.quaternion.setFromEuler(euler);
        };
    }

    initDesktopListeners() {
        if(this.isMobile) return;
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    onKeyDown(event) {
        if (this.isMobile) return;

        if (event.code === 'Backquote') { // ` key
            if(this.controls.isLocked || this.uiManager.isSettingsOpen()) {
                 this.uiManager.toggleSettings();
            }
            return;
        }

        if (event.code === 'KeyP') {
            if (this.controls.isLocked || this.uiManager.isOnlinePlayersOpen()) {
                this.uiManager.toggleOnlinePlayers();
            }
            return;
        }

        if (event.code === 'KeyM') {
            if (this.controls.isLocked || this.uiManager.isMapOpen()) {
                this.uiManager.toggleMap();
            }
            return;
        }

        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'Space':
                this.wantsToJump = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.isSprinting = true;
                break;
        }
    }

    onKeyUp(event) {
        if (this.isMobile) return;
        
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;
            case 'Space':
                this.wantsToJump = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.isSprinting = false;
                break;
        }
    }
}