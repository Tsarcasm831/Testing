import * as THREE from 'three';
import {
    NPC_SPEED,
    MIN_WANDER_WAIT_SECONDS,
    MAX_WANDER_WAIT_SECONDS,
    WANDER_RADIUS,
    POST_INTERACTION_IDLE_SECONDS,
    EYEBOT_HEIGHT_VARIATION,
    MIN_FLY_HEIGHT
} from './constants.js';

export class NPC {
    constructor(model, presetId, zoneKey, isEyebot, startPosition, terrain) {
        this.model = model;
        this.presetId = presetId;
        this.zoneKey = zoneKey;
        this.isEyebot = isEyebot;
        this.startPosition = startPosition;
        this.terrain = terrain;

        this.state = 'idle';
        this.targetPosition = null;
        this.idleTimer = 0;
        this.velocity = new THREE.Vector3();

        if (isEyebot) {
            this.model.userData.baseY = startPosition.y;
        }

        this.setIdle();
    }

    setIdle(durationSeconds = null) {
        this.state = 'idle';
        if (durationSeconds === null) {
            this.idleTimer = (MIN_WANDER_WAIT_SECONDS + Math.random() * (MAX_WANDER_WAIT_SECONDS - MIN_WANDER_WAIT_SECONDS)) * 1000;
        } else {
            this.idleTimer = durationSeconds * 1000;
        }
        this.targetPosition = null;
    }

    setInteracting(isInteracting) {
        if (isInteracting) {
            this.state = 'interacting';
        } else {
            this.setIdle(POST_INTERACTION_IDLE_SECONDS);
        }
    }

    setNewWanderTarget() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * WANDER_RADIUS;
        
        const targetX = this.startPosition.x + Math.cos(angle) * distance;
        const targetZ = this.startPosition.z + Math.sin(angle) * distance;
        let targetY;

        if (this.isEyebot) {
            const terrainHeight = this.terrain.userData.getHeight(targetX, targetZ);
            targetY = this.startPosition.y + (Math.random() - 0.5) * EYEBOT_HEIGHT_VARIATION;
            targetY = Math.max(terrainHeight + MIN_FLY_HEIGHT, targetY);
        } else {
            targetY = this.model.position.y;
        }

        this.targetPosition = new THREE.Vector3(targetX, targetY, targetZ);
        this.state = 'wandering';
    }

    update(delta, isVisible, playerModel) {
        if (!isVisible) return;

        let isMoving = false;

        if (this.state === 'interacting') {
            this.updateAnimation(false, true, isVisible);
            return;
        }

        if (this.state === 'idle') {
            this.idleTimer -= delta;
            if (this.idleTimer <= 0) {
                this.setNewWanderTarget();
            }
            isMoving = false;
        } else if (this.state === 'wandering') {
            isMoving = true;
            if (!this.targetPosition) {
                this.setNewWanderTarget();
                return;
            }

            const direction = this.targetPosition.clone().sub(this.model.position);

            if (!this.isEyebot) {
                direction.y = 0;
            }

            if (direction.length() < 1) { // Reached target
                this.setIdle();
                return;
            }

            direction.normalize();
            
            const step = direction.clone().multiplyScalar(NPC_SPEED);
            const newPos = this.model.position.clone().add(step);
            
            let collision = false;
            if (playerModel) {
                const playerPosition = playerModel.position;
                /* @tweakable The effective collision radius for an NPC for NPC-player collision. */
                const npcCollisionRadius = 0.5;
                /* @tweakable The effective collision radius for the player for NPC-player collision. */
                const playerCollisionRadius = 0.5;
                const minDistance = npcCollisionRadius + playerCollisionRadius;
                
                const npcPos2D = new THREE.Vector2(newPos.x, newPos.z);
                const playerPos2D = new THREE.Vector2(playerPosition.x, playerPosition.z);
                
                if (npcPos2D.distanceTo(playerPos2D) < minDistance) {
                    collision = true;
                }
            }
            
            if (collision) {
                isMoving = false; // NPC stops moving
            } else {
                // No collision, update position
                if (this.isEyebot) {
                    this.model.position.copy(newPos);
                    this.model.userData.baseY = newPos.y;
                } else {
                    const terrainHeight = this.terrain.userData.getHeight(newPos.x, newPos.z) + 0.2;
                    this.model.position.set(newPos.x, terrainHeight, newPos.z);
                }
                
                if (!this.isEyebot) {
                    const angle = Math.atan2(direction.x, direction.z);
                    this.model.rotation.y = angle;
                }
            }
        }
        
        this.updateAnimation(isMoving, false, isVisible);

        if (isVisible && this.model.userData.updateAnimations) {
            this.model.userData.updateAnimations(performance.now() * 0.001);
        }
    }

    updateAnimation(isMoving, isInteracting = false, isVisible = true) {
        if (this.isEyebot) {
            return;
        }
        const leftLeg = this.model.getObjectByName("leftLeg");
        const rightLeg = this.model.getObjectByName("rightLeg");
        
        if (leftLeg && rightLeg) {
            if (isMoving) {
              const walkSpeed = 5;
              const walkAmplitude = 0.3;
              leftLeg.rotation.x = Math.sin(performance.now() * 0.01 * walkSpeed) * walkAmplitude;
              rightLeg.rotation.x = Math.sin(performance.now() * 0.01 * walkSpeed + Math.PI) * walkAmplitude;
            } else {
              leftLeg.rotation.x = 0;
              rightLeg.rotation.x = 0;
            }
        }
        
        if (this.model.userData.isAnimatedGLB) {
            const actions = this.model.userData.actions;
            const fadeDuration = this.model.userData.animationFadeDuration || 0.5;
            
            let newActionName = 'idle';
            if (isInteracting && actions.listen) {
                newActionName = 'listen';
            } else if (isMoving) {
                newActionName = 'walk';
            }
            
            let currentActionName = this.model.userData.currentAction || 'idle';
            
            if (currentActionName !== newActionName) {
                const from = actions[currentActionName];
                const to = actions[newActionName];
                if(from && to) {
                    from.fadeOut(fadeDuration);
                    to.reset().fadeIn(fadeDuration).play();
                } else if(to) { // if from is null
                    to.reset().fadeIn(fadeDuration).play();
                }
                this.model.userData.currentAction = newActionName;
            }
        }
        
        if (isVisible && this.model.userData.mixer) {
            const delta = (performance.now() - (this.model.userData.lastMixerUpdate || performance.now())) / 1000;
            this.model.userData.mixer.update(delta);
            this.model.userData.lastMixerUpdate = performance.now();
        }
    }
}