import * as THREE from 'three';

/* @tweakable The radius around the player to check for collisions. Lower values can improve performance but may cause missed collisions with distant objects. */
const COLLISION_CHECK_RADIUS = 10;
/* @tweakable Maximum height the player can step onto without jumping. */
const STEP_HEIGHT = 1.0;
/* @tweakable Additional padding around NPCs for collision detection. */
const NPC_COLLISION_PADDING = 0.2;
/* @tweakable Padding for player collision with the inside radius of amphitheater seats. */
const SEAT_INNER_RADIUS_PADDING = 0.3;
/* @tweakable Padding for player collision with the outside radius of amphitheater seats. */
const SEAT_OUTER_RADIUS_PADDING = 0.3;

export class CollisionManager {
    constructor(scene) {
        this.scene = scene;
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
            if (child.userData.isBlock || child.userData.isBarrier || (child.type === "Group" && child.userData.isTree) || child.userData.isNpc) {
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
            if (block.userData.isSeatRow) {
                // Use specialized collision for seats
                const result = this._checkCollisionWithSeatRow(currentPosition, finalPosition, velocity, playerRadius, playerHeight, block);
                if(result.collided) {
                     if (result.standingOnBlock) {
                        standingOnBlock = true;
                        finalPosition.y = result.newY;
                        finalVelocity.y = 0;
                        canJump = true;
                    } else {
                        // Horizontal collision
                        const backStep = new THREE.Vector3().subVectors(finalPosition, currentPosition).normalize().multiplyScalar(0.01);
                        finalPosition.sub(backStep); // Move back slightly to prevent getting stuck
                        if (Math.abs(movementVector.x) > Math.abs(movementVector.z)) {
                             finalPosition.x = currentPosition.x;
                        } else {
                             finalPosition.z = currentPosition.z;
                        }
                    }
                }
            } else {
                // Use standard AABB collision for other blocks
                const result = this._checkCollisionWithBlock(currentPosition, finalPosition, finalVelocity, playerRadius, playerHeight, block);
                if(result.standingOnBlock) {
                    standingOnBlock = true;
                    finalPosition.y = result.newY;
                    finalVelocity.y = 0;
                    canJump = true;
                } else if (result.collided) {
                    if (Math.abs(movementVector.x) > 0) finalPosition.x = currentPosition.x;
                    if (Math.abs(movementVector.z) > 0) finalPosition.z = currentPosition.z;
                }
            }
        });

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
        boundingBox.getCenter(blockCenter);

        // Allow override for trees which are groups
        let blockWidth = blockSize.x;
        let blockHeight = blockSize.y;
        let blockDepth = blockSize.z;
        if (block.type === "Group" && block.userData.isTree) {
             blockWidth = 1.0;
             blockHeight = 2.0;
             blockDepth = 1.0;
        }

        const collisionPadding = block.userData.isNpc ? NPC_COLLISION_PADDING : 0;
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
            newPosition.y < (blockTop) && // Bottom of player is below top of block
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

        const amphitheatreCenter = block.parent.position;
        const seatBaseY = amphitheatreCenter.y + seatData.y;
        const seatTopY = seatBaseY + seatData.height;

        const playerToAmphiCenter = new THREE.Vector2(newPosition.x - amphitheatreCenter.x, newPosition.z - amphitheatreCenter.z);
        const distSq = playerToAmphiCenter.lengthSq();

        // Use a simple bounding box for the whole amphitheater as a broad phase check
        const amphitheaterRadius = 60;
        if (distSq > amphitheaterRadius * amphitheaterRadius) {
            return { collided: false };
        }

        // More accurate radial check
        const innerRadius = seatData.innerRadius - playerRadius;
        const outerRadius = seatData.outerRadius + playerRadius;
        if (distSq < innerRadius * innerRadius || distSq > outerRadius * outerRadius) {
            return { collided: false };
        }
        
        // Angular check
        let playerAngle = Math.atan2(playerToAmphiCenter.y, playerToAmphiCenter.x);
        if (playerAngle < 0) playerAngle += 2 * Math.PI;

        const startAngle = seatData.startAngle;
        const endAngle = seatData.endAngle;

        let inAngle = false;
        if (startAngle < endAngle) {
            inAngle = playerAngle >= startAngle && playerAngle <= endAngle;
        } else { // Handles wrap around from PI to -PI (e.g. crossing the -X axis)
            inAngle = playerAngle >= startAngle || playerAngle <= endAngle;
        }

        if (!inAngle) {
            return { collided: false };
        }
        
        // Vertical collision check
        let standingOnBlock = false;
        let newY = newPosition.y;
        let collided = false;

        // Check for landing on top
        if (
            velocity.y <= 0 &&
            currentPosition.y >= seatTopY - STEP_HEIGHT && // Can step up
            newPosition.y <= seatTopY + 0.1 // Feet are at or below the top
        ) {
            standingOnBlock = true;
            collided = true;
            newY = seatTopY;
        } 
        // Check for side collision
        else if (
            newPosition.y < seatTopY &&
            newPosition.y + playerHeight > seatBaseY
        ) {
            collided = true;
        }

        return { collided, standingOnBlock, newY };
    }
}