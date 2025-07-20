import * as THREE from 'three';
import { CollisionSystem } from './collision.js';
import { settings } from './settings.js';
import { PLAYER_HEIGHT } from './player-controls.js';

const GRAVITY = 30.0;
const BUOYANCY = 25.0; // Upward force when underwater
const JUMP_VELOCITY = 10.0;
const MOVEMENT_SPEED = 8.0;
const WATER_SPEED_MULTIPLIER = 0.4;
const AIR_DAMPING = 5.0; // Friction/drag in air, higher is more friction
const MAX_SLOPE_ANGLE = 50 * (Math.PI / 180); // Max angle in radians player can climb.
const MAX_SLOPE = Math.cos(MAX_SLOPE_ANGLE);

export class PlayerPhysics {
    constructor(playerObject) {
        this.playerObject = playerObject;
        this.collisionSystem = new CollisionSystem(playerObject);
        
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.canJump = false;
        this.isUnderwater = false;
        this.groundNormal = new THREE.Vector3(0, 1, 0); // Initialize ground normal
    }

    teleport(position) {
        this.playerObject.position.copy(position);
        this.velocity.set(0, 0, 0);
    }

    update(delta, controls, terrain, isUnderwater) {
        this.isUnderwater = isUnderwater;

        // Apply gravity & buoyancy
        this.velocity.y -= GRAVITY * delta;
        if (isUnderwater) {
            this.velocity.y += BUOYANCY * delta;
            // Clamp upward velocity in water to prevent shooting out
            this.velocity.y = Math.min(this.velocity.y, 4.0);
        }
        
        // Apply vertical velocity from gravity
        this.playerObject.position.y += this.velocity.y * delta;
        // Check for ground collision and correct position *after* gravity is applied
        this.checkCollision(terrain);

        // Now handle user input for horizontal movement
        this.updateHorizontalVelocity(delta, controls);
        this.applyHorizontalVelocity(delta, terrain);

        // Safety net to prevent falling out of the world
        if (this.playerObject.position.y < -150) {
            const pos = this.playerObject.position;
            pos.set(pos.x, 150, pos.z);
            this.velocity.set(0, 0, 0);
        }
    }

    updateHorizontalVelocity(delta, controls) {
        // Calculate target velocity based on input
        this.direction.z = Number(controls.moveForward) - Number(controls.moveBackward);
        this.direction.x = Number(controls.moveRight) - Number(controls.moveLeft);
        this.direction.normalize(); // Ensures consistent movement speed

        let currentSpeed = MOVEMENT_SPEED;
        if (this.isUnderwater) {
            currentSpeed *= WATER_SPEED_MULTIPLIER;
        } else if (controls.isSprinting) {
            currentSpeed *= settings.get('sprintSpeed');
        }

        const targetVelocity = new THREE.Vector3();
        if (controls.moveForward || controls.moveBackward || controls.moveLeft || controls.moveRight) {
             const forwardVector = new THREE.Vector3();
             this.playerObject.getWorldDirection(forwardVector);
             forwardVector.y = 0;
             forwardVector.normalize();

             const rightVector = new THREE.Vector3().crossVectors(this.playerObject.up, forwardVector).negate();
             
             const moveVector = new THREE.Vector3();
             moveVector.addScaledVector(forwardVector, this.direction.z);
             moveVector.addScaledVector(rightVector, this.direction.x);
             moveVector.normalize();

             targetVelocity.x = moveVector.x * currentSpeed;
             targetVelocity.z = moveVector.z * currentSpeed;
        }

        // Apply friction / interpolate to target velocity. This prevents the "sliding" feel.
        const lerpFactor = this.canJump ? 10.0 * delta : 2.0 * delta; // Accelerate/decelerate faster on ground
        this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, targetVelocity.x, lerpFactor);
        this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, targetVelocity.z, lerpFactor);
        
        // Handle jumping
        if (controls.wantsToJump && (this.canJump || this.isUnderwater)) {
            // Can't jump if trying to climb a wall that's too steep
            if (this.groundNormal.y < MAX_SLOPE) return;
            this.velocity.y = JUMP_VELOCITY * (this.isUnderwater ? 0.6 : 1.0);
            this.canJump = false;
        }
    }
    
    applyHorizontalVelocity(delta, terrain) {
        let horizontalVelocity = new THREE.Vector3(this.velocity.x, 0, this.velocity.z);
        
        // --- Slope-based velocity adjustment ---
        if (this.canJump) {
            // Project the velocity onto the ground plane
            horizontalVelocity.projectOnPlane(this.groundNormal);
        }

        // --- Sliding down steep slopes ---
        if (this.canJump && this.groundNormal.y < MAX_SLOPE) {
            const slideDirection = new THREE.Vector3(this.groundNormal.x, 0, this.groundNormal.z).normalize();
            const slideSpeed = 10.0 * (1.0 - this.groundNormal.y); // Faster slide on steeper slopes
            horizontalVelocity.add(slideDirection.multiplyScalar(slideSpeed));
        }

        const totalMovement = horizontalVelocity.clone().multiplyScalar(delta);

        // Check for horizontal collisions and adjust the movement vector
        const adjustedMovement = this.collisionSystem.checkHorizontalCollisions(totalMovement, terrain);

        // Apply the final, collision-aware movement
        this.playerObject.position.add(adjustedMovement);
    }

    checkCollision(terrain) {
        const { onObject, groundY, groundNormal } = this.collisionSystem.checkCollision(terrain);
        this.groundNormal = groundNormal;

        if (onObject) {
            // Only correct position if falling or on the ground, preventing sticking to ceilings
            if (this.velocity.y <= 0 && this.playerObject.position.y < groundY + PLAYER_HEIGHT) {
                this.velocity.y = 0;
                this.playerObject.position.y = groundY + PLAYER_HEIGHT;
                this.canJump = true;
            }
        } else {
             this.canJump = false;
        }
    }
}