import * as THREE from 'three';

const PLAYER_HEIGHT = 2.0;
const PLAYER_RADIUS = 0.4;

export class CollisionSystem {
    constructor(playerObject) {
        this.playerObject = playerObject;

        // Downward raycasters for ground check
        this.raycasters = [
            new THREE.Raycaster(), // Center
            new THREE.Raycaster(), // Front
            new THREE.Raycaster(), // Back
            new THREE.Raycaster(), // Left
            new THREE.Raycaster()  // Right
        ];
        
        this.raycasterOffsets = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, PLAYER_RADIUS),
            new THREE.Vector3(0, 0, -PLAYER_RADIUS),
            new THREE.Vector3(-PLAYER_RADIUS, 0, 0),
            new THREE.Vector3(PLAYER_RADIUS, 0, 0)
        ];
        
        // Horizontal raycaster for wall check
        this.horizontalRaycaster = new THREE.Raycaster();
    }

    checkHorizontalCollisions(movementVector, terrain) {
        if (movementVector.lengthSq() === 0) {
            return movementVector;
        }
    
        const playerPos = this.playerObject.position;
        const movementDir = movementVector.clone().normalize();
        const movementLen = movementVector.length();
        let collisionFound = false;
        let collisionNormal = new THREE.Vector3();

        const rayHeights = [0.2, PLAYER_HEIGHT / 2, PLAYER_HEIGHT - 0.2];
        let minCollisionDistance = movementLen + PLAYER_RADIUS;
    
        for (const height of rayHeights) {
            const rayOrigin = new THREE.Vector3(playerPos.x, playerPos.y - PLAYER_HEIGHT + height, playerPos.z);
            this.horizontalRaycaster.set(rayOrigin, movementDir);
            this.horizontalRaycaster.far = movementLen + PLAYER_RADIUS;
    
            const intersections = this.horizontalRaycaster.intersectObjects(terrain.chunkGroup.children, true);
    
            for (const intersect of intersections) {
                if (intersect.object.name === 'terrain' || intersect.object.name === 'rock' || intersect.object.name === 'palm_trunk' || intersect.object.name === 'aspen_trunk' || intersect.object.name === 'scatter_rock' || intersect.object.name === 'pine_trunk' || intersect.object.name === 'oak_trunk' || intersect.object.name === 'concrete_slab' || intersect.object.name.startsWith('stage_')) {
                    if (intersect.distance < minCollisionDistance) {
                        minCollisionDistance = intersect.distance;
                        collisionFound = true;
                        
                        // Get the world normal of the collided face
                        const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersect.object.matrixWorld);
                        collisionNormal.copy(intersect.face.normal).applyMatrix3(normalMatrix).normalize();
                    }
                    break; 
                }
            }
        }
    
        if (collisionFound) {
            // Allow player to slide along the wall
            const slideVector = movementVector.clone();
            const distToCollision = Math.max(0, minCollisionDistance - PLAYER_RADIUS);
            
            // Move player to point of collision
            const positionCorrection = movementDir.clone().multiplyScalar(distToCollision);
            
            // Project remaining movement along the wall
            const remainingMovement = movementVector.length() - distToCollision;
            slideVector.projectOnPlane(collisionNormal).setLength(remainingMovement);

            return positionCorrection.add(slideVector);
        }
    
        return movementVector;
    }

    checkCollision(terrain) {
        const origin = this.playerObject.position;
        let highestIntersectionY = -Infinity;
        let onObject = false;
        let groundNormal = new THREE.Vector3(0, 1, 0);
        let bestIntersection = null;

        // Start raycast from slightly above the player's feet to avoid starting inside geometry
        const raycastStartY = origin.y + 0.1; 

        for (let i = 0; i < this.raycasters.length; i++) {
            const raycaster = this.raycasters[i];
            const offset = this.raycasterOffsets[i];

            // Apply world rotation to offset
            const worldOffset = offset.clone().applyQuaternion(this.playerObject.quaternion);
            const rayOrigin = new THREE.Vector3(origin.x + worldOffset.x, raycastStartY, origin.z + worldOffset.z);
            
            raycaster.set(rayOrigin, new THREE.Vector3(0, -1, 0));
            raycaster.far = PLAYER_HEIGHT + 0.2; // Cast down past player's height

            const intersections = raycaster.intersectObjects(terrain.chunkGroup.children, true);
            
            // Find the highest intersection point among all valid objects
            for (const intersection of intersections) {
                if (intersection.object.name === 'terrain' || intersection.object.name === 'rock' || intersection.object.name === 'palm_trunk' || intersection.object.name === 'aspen_trunk' || intersection.object.name === 'scatter_rock' || intersection.object.name === 'pine_trunk' || intersection.object.name === 'oak_trunk' || intersection.object.name === 'concrete_slab' || intersection.object.name.startsWith('stage_')) {
                    if (intersection.point.y > highestIntersectionY) {
                        highestIntersectionY = intersection.point.y;
                        bestIntersection = intersection;
                        onObject = true;
                    }
                }
            }
        }

        if (bestIntersection && bestIntersection.face) {
             const normalMatrix = new THREE.Matrix3().getNormalMatrix(bestIntersection.object.matrixWorld);
             groundNormal.copy(bestIntersection.face.normal).applyMatrix3(normalMatrix).normalize();
             
             if (bestIntersection.object.isInstancedMesh) {
                const instanceMatrix = new THREE.Matrix4();
                bestIntersection.object.getMatrixAt(bestIntersection.instanceId, instanceMatrix);
                const instanceWorldMatrix = bestIntersection.object.matrixWorld.clone().multiply(instanceMatrix);
                const instanceNormalMatrix = new THREE.Matrix3().getNormalMatrix(instanceWorldMatrix);
                groundNormal.copy(bestIntersection.face.normal).applyMatrix3(instanceNormalMatrix).normalize();
            }
        }
        
        return { onObject, groundY: highestIntersectionY, groundNormal };
    }
}