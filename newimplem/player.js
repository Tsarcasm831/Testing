import * as THREE from 'three';
import { PlayerControls } from './player-controls.js';
import { PlayerPhysics } from './player-physics.js';
import { PlayerAudio } from './player-audio.js';
import { CHUNK_SIZE } from './config.js';
import { PLAYER_HEIGHT } from './player-controls.js';

export class Player {
    constructor(camera, scene, loadedAssets, username) {
        this.camera = camera;
        
        this.audio = new PlayerAudio(loadedAssets);
        this.controls = new PlayerControls(camera, this.audio);
        this.physics = new PlayerPhysics(this.controls.getControlsObject());
        this.room = null; // Will be set by MultiplayerManager

        this.lastPosition = new THREE.Vector3();
        this.lastQuaternion = new THREE.Quaternion();

        // This ensures the custom spawn location is respected by the physics engine.
        if (username === 'lordtsarcasm') {
            const slabY = 9.5;
            const slabTopY = slabY + 0.25; // Slab is 0.5 thick, centered on slabY. Top is 9.75
            const stagePlatformHeight = 1.0;
            const stageTopY = slabTopY + stagePlatformHeight;
            const spawnPos = new THREE.Vector3(141.0, stageTopY + PLAYER_HEIGHT, -41.0);
            this.position.copy(spawnPos);
            this.physics.teleport(spawnPos);
        }

        this.footstepInterval = 0.4; // seconds
        this.lastNetworkUpdateTime = 0;
        this.networkUpdateInterval = 100; // ms

        scene.add(this.controls.getControlsObject());
        this.prevTime = performance.now();
    }

    get position() {
        return this.controls.getControlsObject().position;
    }

    update(time, terrain, isUnderwater) {
        const delta = (time - this.prevTime) / 1000;

        if (this.controls.isLocked()) {
            this.physics.update(delta, this.controls, terrain, isUnderwater);
            this.updateFootsteps(delta);
            this.checkWorldBounds(terrain);
            this.updateNetwork(time);
        }

        this.prevTime = time;
    }

    setRoom(room) {
        this.room = room;
    }

    updateNetwork(time) {
        if (!this.room || !this.room.clientId) return;

        if (time - this.lastNetworkUpdateTime > this.networkUpdateInterval) {
            const playerObject = this.controls.getControlsObject();
            const position = playerObject.position;
            const quaternion = playerObject.quaternion;

            // OPTIMIZATION: Only send an update if the player has moved.
            if (position.distanceToSquared(this.lastPosition) > 0.0001 || quaternion.angleTo(this.lastQuaternion) > 0.0001) {
                this.room.updatePresence({
                    position: { x: position.x, y: position.y, z: position.z },
                    quaternion: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
                });
                
                this.lastPosition.copy(position);
                this.lastQuaternion.copy(quaternion);
                this.lastNetworkUpdateTime = time;
            }
        }
    }

    updateFootsteps(delta) {
        const isMovingOnGround = (
            this.controls.moveForward || 
            this.controls.moveBackward || 
            this.controls.moveLeft || 
            this.controls.moveRight
        ) && this.physics.canJump;
        
        const currentFootstepInterval = this.controls.isSprinting 
            ? this.footstepInterval / 1.5 
            : this.footstepInterval;

        if (isMovingOnGround) {
            this.audio.footstepTimer += delta;
            if (this.audio.footstepTimer >= currentFootstepInterval) {
                this.audio.playFootstepSound();
                this.audio.footstepTimer = 0;
            }
        } else {
            this.audio.footstepTimer = 0;
        }
    }

    checkWorldBounds(terrain) {
        if (terrain && terrain.worldSize > 0) {
            const worldBoundary = (terrain.worldSize / 2) * CHUNK_SIZE;
            const pos = this.controls.getControlsObject().position;
            pos.x = Math.max(-worldBoundary, Math.min(worldBoundary, pos.x));
            pos.z = Math.max(-worldBoundary, Math.min(worldBoundary, pos.z));
        }
    }
}