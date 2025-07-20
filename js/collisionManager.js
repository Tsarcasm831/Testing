import * as THREE from 'three';

/* @tweakable The radius around the player to check for collisions. Lower values can improve performance but may cause missed collisions with distant objects. */
const COLLISION_CHECK_RADIUS = 10;
/* @tweakable Maximum height the player can step onto without jumping. This also affects amphitheater seats. */
const STEP_HEIGHT = 1.0;
/* @tweakable Additional padding around NPCs for collision detection. */
const NPC_COLLISION_PADDING = 0.2;
/* @tweakable Additional padding around Ogres for collision detection. */
const OGRE_COLLISION_PADDING = 0.4;
/* @tweakable Padding for player collision with the inside radius of amphitheater seats. A larger value makes it harder to fall into the gap. */
const SEAT_INNER_RADIUS_PADDING = 0.3;
/* @tweakable Padding for player collision with the outside radius of amphitheater seats. A larger value makes it harder to fall off the back. */
const SEAT_OUTER_RADIUS_PADDING = 0.3;
/* @tweakable Vertical tolerance for landing on a seat. A small positive value helps prevent falling through edges. */
const SEAT_LANDING_TOLERANCE = 0.2;
/* @tweakable Additional padding around the player for side collisions with seats to prevent clipping through. */
const SEAT_SIDE_COLLISION_PADDING = 0.1;

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
    checkCollisions(currentPosition, proposedPosition, velocity, playerRadius, playerHeight) {
        const blockMeshes = [];
        const worldPosition = new THREE.Vector3();

        this.scene.traverse(child => {
            // This is a more robust way of collecting collidable objects,
            // as it checks the entire scene graph, not just direct children.
            if (child.userData.isBlock || child.userData.isBarrier || (child.type === "Group" && child.userData.isTree) || child.userData.isNpc || child.userData.isSeatRow) {
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
                // When colliding, revert the player's position to the last known non-colliding state
                // and then adjust based on which axis has less overlap to simulate sliding.
                const boundingBox = new THREE.Box3().setFromObject(block);
                const blockCenter = new THREE.Vector3();
                boundingBox.getCenter(blockCenter);
                const blockSize = new THREE.Vector3();
                boundingBox.getSize(blockSize);

                /* @tweakable Padding for player collision to prevent clipping into objects. */
                const collisionPadding = 0.05;
                const effectivePlayerRadius = playerRadius + (block.userData.isNpc ? NPC_COLLISION_PADDING : 0) + collisionPadding;

                // Check overlap based on proposed position
                const overlapX = (blockSize.x / 2 + effectivePlayerRadius) - Math.abs(proposedPosition.x - blockCenter.x);
                const overlapZ = (blockSize.z / 2 + effectivePlayerRadius) - Math.abs(proposedPosition.z - blockCenter.z);

                if (overlapX > 0 && overlapZ > 0) {
                     // Determine which axis had less penetration *before* this frame's movement
                    const prevOverlapX = (blockSize.x / 2 + effectivePlayerRadius) - Math.abs(currentPosition.x - blockCenter.x);
                    const prevOverlapZ = (blockSize.z / 2 + effectivePlayerRadius) - Math.abs(currentPosition.z - blockCenter.z);

                    if (prevOverlapX > prevOverlapZ) {
                        // Was penetrating more on X axis before, so nullify Z movement
                        finalPosition.z = currentPosition.z;
                    } else {
                        // Was penetrating more on Z axis before, so nullify X movement
                        finalPosition.x = currentPosition.x;
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
            !block.userData.isNpc && // Prevent standing on NPCs
            velocity.y <= 0 &&
            currentPosition.y >= blockTop - 0.2 &&
            newPosition.y <= (blockTop + 0.20) &&
            Math.abs(newPosition.x - blockCenter.x) < (blockWidth / 2 + effectivePlayerRadius) &&
            Math.abs(newPosition.z - blockCenter.z) < (blockDepth / 2 + effectivePlayerRadius)
        ) {
            standingOnBlock = true;
            newY = blockTop; // Player's feet height
        } else if (
            block.userData.isStair &&
            velocity.y <= 0 &&
            currentPosition.y >= blockTop - STEP_HEIGHT &&
            newPosition.y <= blockTop + 0.2 &&
            Math.abs(newPosition.x - blockCenter.x) < (blockWidth / 2 + effectivePlayerRadius) &&
            Math.abs(newPosition.z - blockCenter.z) < (blockDepth / 2 + effectivePlayerRadius)
        ) {
            // Allow stepping onto stairs and seat rows without jumping
            standingOnBlock = true;
            newY = blockTop;
        }
        // Check for side collision
        else if (
            Math.abs(newPosition.x - blockCenter.x) < (blockWidth / 2 + effectivePlayerRadius) &&
            Math.abs(newPosition.z - blockCenter.z) < (blockDepth / 2 + effectivePlayerRadius) &&
            newPosition.y < (blockTop + 0.1) && // Bottom of player is below top of block
            newPosition.y + playerHeight > (blockCenter.y - blockHeight / 2) // Top of player is above bottom of block
        ) {
            collided = true;
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
        const distSq = playerToAmphiCenter.lengthSq();

        // More accurate radial check
        const innerRadius = seatData.innerRadius - playerRadius - SEAT_INNER_RADIUS_PADDING;
        const outerRadius = seatData.outerRadius + playerRadius + SEAT_OUTER_RADIUS_PADDING;
        if (distSq < innerRadius * innerRadius || distSq > outerRadius * outerRadius) {
            return { collided: false, standingOnBlock: false, newY: newPosition.y };
        }
        
        // Angular check
        let playerAngle = Math.atan2(playerToAmphiCenter.y, playerToAmphiCenter.x);
        if (playerAngle < 0) playerAngle += 2 * Math.PI;

        const startAngle = seatData.startAngle;
        const endAngle = seatData.endAngle;

        let inAngle = false;
        // The startAngle and endAngle are now always in [0, 2*PI]
        if (startAngle < endAngle) {
            // Normal case, e.g. start at 270 deg, end at 90 deg (crossing 360/0)
            inAngle = playerAngle >= startAngle && playerAngle <= endAngle;
        } else { // Handles wrap around (e.g. startAngle is 300deg, endAngle is 60deg)
            inAngle = playerAngle >= startAngle || playerAngle <= endAngle;
        }

        if (!inAngle) {
            return { collided: false, standingOnBlock: false, newY: newPosition.y };
        }
        
        // Vertical collision check
        let standingOnBlock = false;
        let newY = newPosition.y;
        let collided = false;

        // Check for landing on top
        if (
            velocity.y <= 0 &&
            currentPosition.y >= seatTopY - STEP_HEIGHT && // Can step up
            newPosition.y <= seatTopY + SEAT_LANDING_TOLERANCE // Feet are at or below the top
        ) {
            standingOnBlock = true;
            newY = seatTopY;
        } 
        // Check for side collision
        else if (
            newPosition.y < seatTopY && // player bottom is below seat top
            newPosition.y + playerHeight > seatBottomY // player top is above seat bottom
        ) {
            collided = true;
        }

        return { collided, standingOnBlock, newY };
    }
}