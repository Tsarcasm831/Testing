import * as THREE from 'three';
import { CLUSTER_SIZE } from './worldgen/constants.js';

/* @tweakable The radius around the player to check for collisions. Lower values can improve performance but may cause missed collisions with distant objects. */
const COLLISION_CHECK_RADIUS = 10;
/* @tweakable Maximum height the player can step onto without jumping. This also affects amphitheater seats. */
const STEP_HEIGHT = 1.6;
/* @tweakable Additional padding around NPCs for collision detection. */
const NPC_COLLISION_PADDING = 0.2;
/* @tweakable Additional padding around Ogres for collision detection. */
const OGRE_COLLISION_PADDING = 0.4;
/* @tweakable Padding for player collision with the inside radius of amphitheater seats. A larger value makes it harder to fall into the gap. */
const SEAT_INNER_RADIUS_PADDING = 0.1;
/* @tweakable Padding for player collision with the outside radius of amphitheater seats. A larger value makes it harder to fall off the back. */
const SEAT_OUTER_RADIUS_PADDING = 0.1;
/* @tweakable Vertical tolerance for landing on a seat or stair. A small positive value helps prevent falling through edges. */
const SEAT_LANDING_TOLERANCE = 0.25;
/* @tweakable Additional padding around the player for side collisions with seats to prevent clipping through. */
const SEAT_SIDE_COLLISION_PADDING = 0.1;
/* @tweakable Padding for player collision to prevent clipping into static objects. */
const STATIC_OBJECT_COLLISION_PADDING = 0.0;

export class CollisionManager {
    constructor(scene) {
        this.scene = scene;
        this.terrain = null;
    }

    setTerrain(terrain) {
        this.terrain = terrain;
    }

    getGroundHeight(x, z) {
        if (!this.terrain) return 0;
    
        const raycaster = new THREE.Raycaster();
        /* @tweakable The starting height of the raycast used to detect ground collision. Should be higher than the highest point in the world. */
        const rayOriginHeight = 50;
        const rayOrigin = new THREE.Vector3(x, rayOriginHeight, z);
        const rayDirection = new THREE.Vector3(0, -1, 0);
        raycaster.set(rayOrigin, rayDirection);
    
        // Only check for intersection with the terrain object
        const intersects = raycaster.intersectObject(this.terrain);
    
        if (intersects.length > 0) {
          return intersects[0].point.y; // Return the precise intersection point's y-coordinate
        }
    
        // Fallback to the noise function if raycast fails for some reason
        return this.terrain.userData.getHeight(x, z);
    }

    /**
     * Checks for collisions and updates player's new position and velocity.
     * @param {THREE.Vector3} currentPosition - The player's current position.
     * @param {THREE.Vector3} proposedPosition - The proposed movement vector for this frame.
     * @param {THREE.Vector3} velocity - The player's current velocity.
     * @param {number} playerRadius - The radius of the player's collision cylinder.
     * @param {number} playerHeight - The height of the player's collision cylinder.
     * @returns {{
     *  finalPosition: THREE.Vector3,
     *  finalVelocity: THREE.Vector3,
     *  canJump: boolean,
     *  standingOnBlock: boolean
     * }}
     */
    checkCollisions(currentPosition, proposedPosition, velocity, playerRadius, playerHeight, selfObject = null) {
        const blockMeshes = [];
        const worldPosition = new THREE.Vector3();

        this.scene.traverse(child => {
            // This is a more robust way of collecting collidable objects,
            // as it checks the entire scene graph, not just direct children.
            if (child === selfObject) return;
            if ((child.userData.isBlock || child.userData.isBarrier || (child.type === "Group" && child.userData.isTree) || child.userData.isNpc || child.userData.isPlayer) && child.userData.isCollidable !== false) {
                child.getWorldPosition(worldPosition);
                /* @tweakable The distance from the player to check for collidable objects. Lowering may improve performance but can cause missed collisions with large objects. */
                const effectiveCollisionRadius = COLLISION_CHECK_RADIUS + (child.geometry?.boundingSphere?.radius || 0);
                if (worldPosition.distanceTo(currentPosition) < effectiveCollisionRadius) {
                    blockMeshes.push(child);
                }
            }
        });

        let finalPosition = proposedPosition.clone();
        let finalVelocity = velocity.clone();
        let canJump = false;
        let standingOnBlock = false;
        
        const movementVector = new THREE.Vector3().subVectors(proposedPosition, currentPosition);

        blockMeshes.forEach(block => {
            let result;
            if (block.userData.isSeatRow) {
                result = this._checkCollisionWithSeatRow(currentPosition, finalPosition, finalVelocity, playerRadius, playerHeight, block);
            } else {
                result = this._checkCollisionWithBlock(currentPosition, finalPosition, finalVelocity, playerRadius, playerHeight, block);
            }
            
            if(result.standingOnBlock) {
                standingOnBlock = true;
                finalPosition.y = result.newY;
                finalVelocity.y = 0;
                canJump = true;
            } else if (result.collided) {
                const boundingBox = new THREE.Box3().setFromObject(block);
                const blockCenter = new THREE.Vector3();
                boundingBox.getCenter(blockCenter);
                const blockSize = new THREE.Vector3();
                boundingBox.getSize(blockSize);

                let collisionPadding = STATIC_OBJECT_COLLISION_PADDING;
                if(block.userData.isNpc) {
                    collisionPadding = NPC_COLLISION_PADDING;
                }

                const effectivePlayerRadius = playerRadius + collisionPadding;

                // Check overlap based on proposed position
                const overlapX = (blockSize.x / 2 + effectivePlayerRadius) - Math.abs(proposedPosition.x - blockCenter.x);
                const overlapZ = (blockSize.z / 2 + effectivePlayerRadius) - Math.abs(proposedPosition.z - blockCenter.z);

                if (overlapX > 0 && overlapZ > 0) {
                     // If colliding with an NPC, use a simple pushback for smoother interaction
                    if (block.userData.isNpc) {
                        const pushback = new THREE.Vector3().subVectors(finalPosition, blockCenter);
                        pushback.y = 0;
                        if (pushback.lengthSq() > 0) {
                            pushback.normalize();
                            const totalRadius = effectivePlayerRadius + Math.max(blockSize.x, blockSize.z) / 2;
                            const currentDistance = new THREE.Vector2(finalPosition.x - blockCenter.x, finalPosition.z - blockCenter.z).length();
                            const penetration = totalRadius - currentDistance;
                            if (penetration > 0) {
                                finalPosition.addScaledVector(pushback, penetration);
                            }
                        }
                    } else {
                        // For static objects, resolve collision by sliding along the axis of least penetration
                        if (overlapX < overlapZ) {
                            const sign = Math.sign(proposedPosition.x - blockCenter.x);
                            finalPosition.x = blockCenter.x + sign * (blockSize.x / 2 + effectivePlayerRadius);
                        } else {
                            const sign = Math.sign(proposedPosition.z - blockCenter.z);
                            finalPosition.z = blockCenter.z + sign * (blockSize.z / 2 + effectivePlayerRadius);
                        }
                    }
                }
            }
        });
        
        // Terrain collision check after object collisions
        const terrainHeight = this.getGroundHeight(finalPosition.x, finalPosition.z);
        /* @tweakable The vertical offset of the player model from the ground to prevent clipping. */
        const groundOffset = 0;
        const groundLevel = terrainHeight + groundOffset;

        if (standingOnBlock) {
             if (finalPosition.y < groundLevel) {
                finalPosition.y = groundLevel;
                finalVelocity.y = 0;
                canJump = true;
            }
        } else {
            if (finalPosition.y < groundLevel) {
                finalPosition.y = groundLevel;
                finalVelocity.y = 0;
                canJump = true;
            }
        }

        return { finalPosition, finalVelocity, canJump, standingOnBlock };
    }
    
    _checkCollisionWithBlock(currentPosition, newPosition, velocity, playerRadius, playerHeight, block) {
        if (block.userData.isSeatRow) {
            return { collided: false, standingOnBlock: false, newY: newPosition.y };
        }

        const boundingBox = new THREE.Box3().setFromObject(block);
        const blockSize = new THREE.Vector3();
        boundingBox.getSize(blockSize);
        const blockCenter = new THREE.Vector3();
        boundingBox.getCenter(blockCenter); // Correctly get the world-space center

        // Allow override for trees which are groups
        let blockWidth = blockSize.x;
        let blockHeight = blockSize.y;
        let blockDepth = blockSize.z;
        if (block.type === "Group" && block.userData.isTree) {
             blockWidth = 1.0;
             blockHeight = 2.0;
             blockDepth = 1.0;
        }

        let collisionPadding = 0;
        if (block.userData.isNpc) {
            if (block.name.toLowerCase().includes('ogre')) {
                collisionPadding = OGRE_COLLISION_PADDING;
            } else {
                collisionPadding = NPC_COLLISION_PADDING;
            }
        }
        const effectivePlayerRadius = playerRadius + collisionPadding;

        const blockTop = blockCenter.y + blockHeight / 2;
        let standingOnBlock = false;
        let newY = newPosition.y;
        let collided = false;

        // Check if player is landing on top of the block
        if (
            (!block.userData.isNpc &&
             velocity.y <= 0 &&
             currentPosition.y >= blockTop - 0.2 &&
             newPosition.y <= (blockTop + SEAT_LANDING_TOLERANCE) &&
             Math.abs(newPosition.x - blockCenter.x) < (blockWidth / 2 + effectivePlayerRadius) &&
             Math.abs(newPosition.z - blockCenter.z) < (blockDepth / 2 + effectivePlayerRadius))
            ||
            (block.userData.isStair &&
             velocity.y <= 0 &&
             currentPosition.y >= blockTop - STEP_HEIGHT &&
             newPosition.y <= blockTop + SEAT_LANDING_TOLERANCE &&
             Math.abs(newPosition.x - blockCenter.x) < (blockWidth / 2 + effectivePlayerRadius) &&
             Math.abs(newPosition.z - blockCenter.z) < (blockDepth / 2 + effectivePlayerRadius))
        ) {
            standingOnBlock = true;
            newY = blockTop;
        }

        // Check for side collision, regardless of whether we are standing on the block or not.
        // This prevents clipping through edges of stairs/platforms.
        if (
            Math.abs(newPosition.x - blockCenter.x) < (blockWidth / 2 + effectivePlayerRadius) &&
            Math.abs(newPosition.z - blockCenter.z) < (blockDepth / 2 + effectivePlayerRadius) &&
            newPosition.y < (blockTop + 0.1) && // Bottom of player is below top of block
            newPosition.y + playerHeight > (blockCenter.y - blockHeight / 2) // Top of player is above bottom of block
        ) {
            // If we are standing on top, don't register a side collision.
            // This prevents getting stuck on edges.
            if (!standingOnBlock) {
                collided = true;
            }
        }

        return { collided, standingOnBlock, newY };
    }

    _checkCollisionWithSeatRow(currentPosition, newPosition, velocity, playerRadius, playerHeight, block) {
        const seatData = block.userData.seatRowData;
        if (!seatData || !block.parent || seatData.startAngle === undefined || seatData.endAngle === undefined) {
            return { collided: false, standingOnBlock: false, newY: newPosition.y };
        }

        block.updateWorldMatrix(true, false); // Ensure world matrix is up to date
        const boundingBox = new THREE.Box3().setFromObject(block);
        const seatTopY = boundingBox.max.y;
        const seatBottomY = boundingBox.min.y;

        const amphitheatreCenter = new THREE.Vector3();
        block.parent.getWorldPosition(amphitheatreCenter);
        
        const playerToAmphiCenter = new THREE.Vector2(newPosition.x - amphitheatreCenter.x, newPosition.z - amphitheatreCenter.z);
        const dist = playerToAmphiCenter.length();

        // More accurate radial check
        /* @tweakable Padding for player collision with the inside radius of amphitheater seats. A larger value makes it harder to fall into the gap. */
        const innerRadius = seatData.innerRadius - playerRadius - SEAT_INNER_RADIUS_PADDING;
        /* @tweakable Padding for player collision with the outside radius of amphitheater seats. A larger value makes it harder to fall off the back. */
        const outerRadius = seatData.outerRadius + playerRadius + SEAT_OUTER_RADIUS_PADDING;
        
        // Angular check
        let playerAngle = Math.atan2(playerToAmphiCenter.y, playerToAmphiCenter.x);

        const amphitheatreRotation = block.parent.rotation.y;
        
        // Normalize all angles to the range [0, 2*PI] for consistent comparison
        const normalizeAngle = (angle) => {
            const newAngle = angle % (2 * Math.PI);
            return newAngle < 0 ? newAngle + 2 * Math.PI : newAngle;
        };

        let normalizedPlayerAngle = normalizeAngle(playerAngle - amphitheatreRotation);
        let startAngle = normalizeAngle(seatData.startAngle);
        let endAngle = normalizeAngle(seatData.endAngle);
        
        let inAngle = false;
        if (startAngle < endAngle) {
            inAngle = normalizedPlayerAngle >= startAngle && normalizedPlayerAngle <= endAngle;
        } else { // Wraps around 0/2PI, e.g. from 315deg to 45deg
            inAngle = normalizedPlayerAngle >= startAngle || normalizedPlayerAngle <= endAngle;
        }
        
        // Vertical collision check
        let standingOnBlock = false;
        let newY = newPosition.y;
        let collided = false;

        // Check for landing on top
        if (
            velocity.y <= 0 &&
            currentPosition.y >= seatTopY - STEP_HEIGHT && // Can step up
            newPosition.y <= seatTopY + SEAT_LANDING_TOLERANCE && // Feet are at or below the top
            dist >= seatData.innerRadius - SEAT_INNER_RADIUS_PADDING &&
            dist <= seatData.outerRadius + SEAT_OUTER_RADIUS_PADDING &&
            inAngle
        ) {
            standingOnBlock = true;
            newY = seatTopY;
        } 
        // Check for side collision
        else if (
            newPosition.y < seatTopY && // player bottom is below seat top
            newPosition.y + playerHeight > seatBottomY // player top is above seat bottom
        ) {
            // Check for side collisions (hitting the ends of the arc) or radial collisions (hitting inner/outer walls)
            if (dist >= innerRadius && dist <= outerRadius && !inAngle) {
                // If within the radii but outside the angle, it's a side collision
                collided = true;
            } else if (inAngle && (dist < innerRadius || dist > outerRadius)) {
                // If within the angle but outside radii, it's a radial wall collision
                collided = true;
            }
        }

        return { collided, standingOnBlock, newY };
    }
}