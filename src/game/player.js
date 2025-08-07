import * as THREE from 'three';

let lastLightUpdatePosition = new THREE.Vector3();
let shadowCastingObjects = new Set();

export function resetPlayerState() {
    // This function is called from useThreeScene when objects are regenerated
    // to prevent holding references to old objects.
    lastLightUpdatePosition.set(0, 0, 0);
    shadowCastingObjects.clear();
}

export function createPlayer(settings) {
    const playerGeometry = new THREE.CylinderGeometry(2, 2, 8, 8);
    const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, 4, 0);
    player.castShadow = settings.shadows;
    return player;
}

export function updatePlayer(player, keys, camera, light, throttledSetPlayerPosition, objectGrid, delta) {
    const moveSpeed = 120; // Units per second
    const moveDistance = moveSpeed * delta;
    let moved = false;

    // Player movement
    if (keys['KeyW'] || keys['ArrowUp']) {
        player.position.z -= moveDistance;
        moved = true;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        player.position.z += moveDistance;
        moved = true;
    }
    if (keys['KeyA'] || keys['ArrowLeft']) {
        player.position.x -= moveDistance;
        moved = true;
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
        player.position.x += moveDistance;
        moved = true;
    }

    // Constrain player to world bounds
    const worldBounds = 990;
    player.position.x = Math.max(-worldBounds, Math.min(worldBounds, player.position.x));
    player.position.z = Math.max(-worldBounds, Math.min(worldBounds, player.position.z));

    const playerPosition = player.position;

    // Update camera to follow player
    const cameraOffset = new THREE.Vector3(0, 50, 50);
    camera.position.copy(playerPosition).add(cameraOffset);
    camera.lookAt(playerPosition);
    
    // Update light and shadows
    if (light) {
        // The light's shadow camera should follow the player's position
        // to ensure shadows are always rendered around the player.
        light.position.copy(playerPosition).add(new THREE.Vector3(30, 80, 40));
        light.target.position.copy(playerPosition);
        light.target.updateMatrixWorld();

        // Dynamically enable/disable shadow casting for objects based on distance.
        // This is an expensive operation, so we throttle it to only run when the
        // player has moved a certain distance, not on every single frame.
        if (playerPosition.distanceTo(lastLightUpdatePosition) > 15) {
            const shadowCastDistance = 150;
            const maxShadowCasters = 10;
            
            // Use the object grid to efficiently get nearby objects
            const nearbyObjects = objectGrid.getObjectsNear(playerPosition, shadowCastDistance);

            // Sort only the nearby objects by distance.
            nearbyObjects.sort((a, b) => a.position.distanceToSquared(playerPosition) - b.position.distanceToSquared(playerPosition));

            const newShadowCasters = new Set();
            for (let i = 0; i < Math.min(nearbyObjects.length, maxShadowCasters); i++) {
                newShadowCasters.add(nearbyObjects[i]);
            }

            // Turn off shadows for objects that are no longer in the new set.
            shadowCastingObjects.forEach(obj => {
                if (!newShadowCasters.has(obj)) {
                    // It's an LOD, so toggle shadow on its high-detail child mesh
                    if (obj.isLOD && obj.children[0]) {
                        obj.children[0].castShadow = false;
                    }
                }
            });

            // Turn on shadows for new objects in the set.
            newShadowCasters.forEach(obj => {
                 // It's an LOD, so toggle shadow on its high-detail child mesh
                if (obj.isLOD && obj.children[0]) {
                    if (!obj.children[0].castShadow) {
                        obj.children[0].castShadow = true;
                    }
                }
            });
            
            // Update our list of which objects are casting shadows.
            shadowCastingObjects = newShadowCasters;
            lastLightUpdatePosition.copy(playerPosition);
        }
    }

    if (moved) {
        // Use throttled function to update React state, reducing re-renders
        throttledSetPlayerPosition({
            x: Math.round(playerPosition.x),
            z: Math.round(playerPosition.z)
        });
    }
}