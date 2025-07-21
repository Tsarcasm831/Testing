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

/* @tweakable The acceleration of the NPC in units per second squared. Higher is more responsive, lower is smoother. */
const NPC_ACCELERATION = 2.0;
/* @tweakable The distance from the target at which the NPC starts to decelerate. */
const DECELERATION_DISTANCE = 5.0;

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
        this.npcManager = null; // Will be set by NPCManager
        this.avoidTimer = 0;
        this.avoidDirection = new THREE.Vector3();
        this.currentSpeed = 0;
        /* @tweakable The radius of an eyebot's collision sphere. */
        this.eyebotCollisionRadius = 1.0;

        // Calculate per-model collision bounds
        this.boundingBox = new THREE.Box3().setFromObject(this.model);
        const size = new THREE.Vector3();
        this.boundingBox.getSize(size);
        this.collisionRadius = Math.max(size.x, size.z) / 2;
        this.collisionHeight = size.y;
        // Eyebots use a spherical bound
        if (isEyebot) {
            this.eyebotCollisionRadius = this.collisionRadius;
        }

        if (isEyebot) {
            this.model.userData.baseY = startPosition.y;
        }

        this.setIdle();
    }

    setIdle(durationSeconds = null) {
        this.state = 'idle';
        this.currentSpeed = 0;
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

    _checkEyebotCollisions(proposedPosition) {
        if (!this.npcManager || !this.npcManager.collisionManager) return null;

        const collidables = [];
        this.npcManager.scene.traverse(child => {
            if (child.userData.isBarrier || child.userData.isTree) {
                collidables.push(child);
            }
        });

        // Check against other NPCs
        this.getOtherNpcs().forEach(npc => collidables.push(npc.model));
        // Check against player
        if (this.npcManager.playerControls) {
            collidables.push(this.npcManager.playerControls.getPlayerModel());
        }

        const eyebotBoundingSphere = new THREE.Sphere(proposedPosition, this.eyebotCollisionRadius);

        for (const collidable of collidables) {
            const collidableBox = new THREE.Box3().setFromObject(collidable);
            if (collidableBox.intersectsSphere(eyebotBoundingSphere)) {
                const collisionNormal = new THREE.Vector3().subVectors(proposedPosition, collidable.position).normalize();
                return collisionNormal;
            }
        }

        return null;
    }

    update(delta, isVisible, playerModel) {
        if (!isVisible) return;

        let isMoving = false;
        const deltaSeconds = delta / 1000;

        if (this.state === 'interacting') {
            this.updateAnimation(false, true, isVisible);
            return;
        }

        if (this.state === 'avoiding') {
            this.avoidTimer -= delta;
            if (this.avoidTimer <= 0) {
                this.setIdle(0); // Go to idle and immediately decide next action
            }
        }

        if (this.state === 'idle') {
            this.idleTimer -= delta;
            if (this.idleTimer <= 0) {
                this.setNewWanderTarget();
            }
            isMoving = false;
        } else if (this.state === 'wandering') {
            if (!this.targetPosition) {
                this.setNewWanderTarget();
                return;
            }

            const direction = this.targetPosition.clone().sub(this.model.position);
            const distanceToTarget = this.isEyebot ? direction.length() : new THREE.Vector2(direction.x, direction.z).length();

            if (distanceToTarget < 0.5) { // A small threshold to stop
                this.setIdle();
                return;
            }

            let targetSpeed = NPC_SPEED;

            // Decelerate if close to the target
            if (distanceToTarget < DECELERATION_DISTANCE) {
                // Smoothly interpolate speed based on distance
                targetSpeed = NPC_SPEED * (distanceToTarget / DECELERATION_DISTANCE);
                // Clamp to a minimum speed to avoid getting stuck
                targetSpeed = Math.max(targetSpeed, NPC_SPEED * 0.1);
            }

            // Accelerate/decelerate towards target speed
            if (this.currentSpeed < targetSpeed) {
                this.currentSpeed = Math.min(this.currentSpeed + NPC_ACCELERATION * deltaSeconds, targetSpeed);
            } else if (this.currentSpeed > targetSpeed) {
                this.currentSpeed = Math.max(this.currentSpeed - NPC_ACCELERATION * deltaSeconds, 0);
            }
            
            isMoving = this.currentSpeed > 0.01;

            if(isMoving) {
                const moveDistance = this.currentSpeed * deltaSeconds;

                if (this.isEyebot) {
                    const step = direction.clone().normalize().multiplyScalar(moveDistance);
                    const proposedPosition = this.model.position.clone().add(step);
                    const collisionNormal = this._checkEyebotCollisions(proposedPosition);
    
                    if (collisionNormal) {
                        this.state = 'avoiding';
                        this.avoidTimer = 500;
                        this.avoidDirection.copy(collisionNormal);
                    } else {
                        this.model.position.copy(proposedPosition);
                        this.model.userData.baseY = proposedPosition.y;
                    }
                } else { // Ground NPC
                    direction.y = 0;
    
                    if (direction.lengthSq() > 0) {
                        const step = direction.normalize().multiplyScalar(moveDistance);
                        const proposedPosition = this.model.position.clone().add(step);
    
                        let finalPosition = proposedPosition;
                        let collision = false;
                        
                        if (this.npcManager && this.npcManager.collisionManager) {
                            const result = this.npcManager.collisionManager.checkCollisions(
                                this.model.position,
                                proposedPosition,
                                new THREE.Vector3(), // Velocity is not used for simple NPC movement
                                this.collisionRadius,
                                this.collisionHeight
                            );
                            finalPosition = result.finalPosition;
                            // Check if a collision occurred by seeing if the final position is different from proposed
                            if (finalPosition.distanceTo(proposedPosition) > 0.01) {
                                collision = true;
                            }
                        }
    
                        // Player collision check
                        if (playerModel) {
                            const playerPosition = playerModel.position;
                            /* @tweakable The effective collision radius for an NPC for NPC-player collision. */
                            const npcCollisionRadius = this.collisionRadius;
                            /* @tweakable The effective collision radius for the player for NPC-player collision. */
                            const playerCollisionRadius = 0.5;
                            const minDistance = npcCollisionRadius + playerCollisionRadius;
                            
                            const npcPos2D = new THREE.Vector2(finalPosition.x, finalPosition.z);
                            const playerPos2D = new THREE.Vector2(playerPosition.x, playerPosition.z);
                            
                            if (npcPos2D.distanceTo(playerPos2D) < minDistance) {
                                collision = true;
                            }
                        }
    
                        // NPC-NPC collision check
                        const otherNpcs = this.getOtherNpcs(); // Assumes a method to get other NPCs
                        for (const otherNpc of otherNpcs) {
                            const distanceToOther = finalPosition.distanceTo(otherNpc.model.position);
                            const minDistance = this.collisionRadius + (otherNpc.collisionRadius || 0.5);
                            if (distanceToOther < minDistance) {
                                collision = true;
                                break;
                            }
                        }
                        
                        if (collision) {
                            this.state = 'avoiding';
                            /* @tweakable The duration in milliseconds for an NPC's avoidance maneuver after a collision. */
                            this.avoidTimer = 500;
                            this.avoidDirection.copy(direction).normalize().negate();
                            // Add some randomness so it doesn't just go back and forth
                            const randomAngle = (Math.random() - 0.5) * (Math.PI / 2); // +/- 45 degrees
                            this.avoidDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), randomAngle);
                        } else {
                            // No collision, update position
                            const terrainHeight = this.terrain.userData.getHeight(finalPosition.x, finalPosition.z) + 0.2;
                            this.model.position.set(finalPosition.x, terrainHeight, finalPosition.z);
        
                            if (!this.isEyebot) {
                                const angle = Math.atan2(direction.x, direction.z);
                                this.model.rotation.y = angle;
                            }
                        }
                    }
                }
            }
        } else if (this.state === 'avoiding') {
            isMoving = true;
            const moveDistance = NPC_SPEED * deltaSeconds;
            const step = this.avoidDirection.clone().normalize().multiplyScalar(moveDistance);
            const proposedPosition = this.model.position.clone().add(step);

            if (this.isEyebot) {
                // No collision check while actively avoiding to prevent getting stuck
                this.model.position.copy(proposedPosition);
                this.model.userData.baseY = proposedPosition.y;
            } else {
                const terrainHeight = this.terrain.userData.getHeight(proposedPosition.x, proposedPosition.z) + 0.2;
                this.model.position.set(proposedPosition.x, terrainHeight, proposedPosition.z);
            }

            if (!this.isEyebot) {
                const angle = Math.atan2(this.avoidDirection.x, this.avoidDirection.z);
                this.model.rotation.y = angle;
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

    getOtherNpcs() {
        if (!this.npcManager) return [];
        return this.npcManager.npcs.filter(npc => npc !== this);
    }
}