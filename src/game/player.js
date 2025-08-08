import * as THREE from 'three';

let lastLightUpdatePosition = new THREE.Vector3();
let shadowCastingObjects = new Set();
const ROTATION_SPEED = 10; // For turning the character

export function resetPlayerState() {
    // This function is called from useThreeScene when objects are regenerated
    // to prevent holding references to old objects.
    lastLightUpdatePosition.set(0, 0, 0);
    shadowCastingObjects.clear();
}

export function createPlayer(model, animations, settings) {
    const player = model;
    player.position.set(0, 0, 0); // Model's origin should be at the feet.
    player.scale.set(5, 5, 5); // Adjust scale to fit the world
    
    // Enable shadows for all meshes in the model
    player.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = settings.shadows;
            node.receiveShadow = settings.shadows;
        }
    });

    // Animation setup
    const mixer = new THREE.AnimationMixer(player);
    const actions = {};
    animations.forEach(clip => {
        const action = mixer.clipAction(clip);
        actions[clip.name] = action;
    });

    // Add custom properties for physics and state
    player.userData = {
        ...player.userData,
        velocity: new THREE.Vector3(0, 0, 0),
        onGround: true,
        mixer,
        actions,
        currentAction: 'idle',
        targetRotation: new THREE.Quaternion()
    };

    // Start with idle animation
    actions.idle.play();

    return player;
}

export function updatePlayer(player, keys, camera, light, throttledSetPlayerPosition, objectGrid, delta, joystick) {
    const moveSpeed = 120; // Units per second
    const moveDistance = moveSpeed * delta;
    const GRAVITY = 140;
    const JUMP_FORCE = 70;
    const GROUND_Y = 0;

    let moved = false;
    let moveDirection = new THREE.Vector2(0, 0);
    const { mixer, actions, currentAction } = player.userData;

    // --- Animation State Machine ---
    const switchToAction = (newActionName) => {
        if (currentAction === newActionName) return;

        const oldAction = actions[currentAction];
        const newAction = actions[newActionName];
        
        if (oldAction) oldAction.fadeOut(0.2);
        if (newAction) {
            newAction.reset().fadeIn(0.2).play();
        }

        player.userData.currentAction = newActionName;
    };

    // --- Vertical Movement (Jump & Gravity) ---
    // Check for jump input
    if (keys['Space'] && player.userData.onGround) {
        player.userData.velocity.y = JUMP_FORCE;
        player.userData.onGround = false;
        switchToAction('jump');
    }

    // Apply gravity
    if (!player.userData.onGround) {
        player.userData.velocity.y -= GRAVITY * delta;
    }

    // Update vertical position
    player.position.y += player.userData.velocity.y * delta;

    // Check for ground collision
    if (player.position.y <= GROUND_Y) {
        player.position.y = GROUND_Y;
        player.userData.velocity.y = 0;
        if (!player.userData.onGround) {
             player.userData.onGround = true;
             // Don't immediately switch to idle, let movement logic decide
        }
    }

    // --- Horizontal Movement ---
    // Joystick movement
    if (joystick && joystick.force > 0.1) {
        const angle = joystick.angle.radian;
        const force = joystick.force;
        
        const moveX = Math.cos(angle);
        const moveZ = -Math.sin(angle);

        moveDirection.set(moveX * force, moveZ * force);
    }

    // Keyboard movement - This will override joystick if both are used.
    let keyMoveX = 0;
    let keyMoveZ = 0;
    if (keys['KeyW'] || keys['ArrowUp']) keyMoveZ = -1;
    if (keys['KeyS'] || keys['ArrowDown']) keyMoveZ = 1;
    if (keys['KeyA'] || keys['ArrowLeft']) keyMoveX = -1;
    if (keys['KeyD'] || keys['ArrowRight']) keyMoveX = 1;
    
    // Check for two-key presses to combine directions
    if ((keys['KeyW'] || keys['ArrowUp']) && (keys['KeyS'] || keys['ArrowDown'])) keyMoveZ = 0;
    if ((keys['KeyA'] || keys['ArrowLeft']) && (keys['KeyD'] || keys['ArrowRight'])) keyMoveX = 0;
    
    if (keyMoveX !== 0 || keyMoveZ !== 0) {
        moveDirection.set(keyMoveX, keyMoveZ);
        moveDirection.normalize(); 
    }
    
    // Apply movement if there is any
    if (moveDirection.lengthSq() > 0) {
        player.position.x += moveDirection.x * moveDistance;
        player.position.z += moveDirection.y * moveDistance;
        moved = true;
        
        // --- Character Rotation ---
        const targetAngle = Math.atan2(moveDirection.x, moveDirection.y);
        player.userData.targetRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetAngle);
    }
    
    player.quaternion.slerp(player.userData.targetRotation, ROTATION_SPEED * delta);

    // Update animation based on state
    if (player.userData.onGround) {
        if (moved) {
            // Check if shift is pressed for running
            if (keys['ShiftLeft'] || keys['ShiftRight']) {
                switchToAction('run');
            } else {
                switchToAction('walk');
            }
        } else {
            switchToAction('idle');
        }
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
            const shadowCastDistance = 300;
            const maxShadowCasters = 20;
            
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
    
    // Update animation mixer
    if (mixer) {
        mixer.update(delta);
    }

    if (moved) {
        // Use throttled function to update React state, reducing re-renders
        throttledSetPlayerPosition({
            x: Math.round(playerPosition.x),
            z: Math.round(playerPosition.z)
        });
    }
}