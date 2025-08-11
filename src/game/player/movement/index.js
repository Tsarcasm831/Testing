import * as THREE from 'three';
import { playAnimation } from '../animations.js';
import { walkSpeed, runSpeed, flySpeed, GRAVITY, JUMP_FORCE, PLAYER_RADIUS } from './constants.js';
import { getGroundYAt } from './ground.js';
import { resolveCollisions } from './collision.js';

/**
 * Updates the player's movement and state each frame.
 */
export function updatePlayerMovement(player, keys, joystick, delta, objectGrid, cameraYaw, cameraPitch = 0) {
    let moved = false;
    let moveDirection = new THREE.Vector2(0, 0);
    let verticalFromCamera = 0;

    // Handle Dev Flight toggle (double-tap Space)
    if (keys['DevFlightToggle']) {
        keys['DevFlightToggle'] = false;
        player.userData.devFlight = !player.userData.devFlight;
        player.userData.velocity.y = 0;
        player.userData.actionLocked = false;

        if (player.userData.devFlight) {
            player.userData.onGround = false;
            player.position.y = Math.max(
                player.position.y,
                getGroundYAt(player.position.x, player.position.z) + 2
            );
        } else {
            const groundY = getGroundYAt(player.position.x, player.position.z);
            player.position.y = groundY;
            player.userData.onGround = true;
        }
    }

    const isDevFlight = !!player.userData.devFlight;
    const isActionLocked = !!player.userData.actionLocked;

    // Determine if running for both speed and animation
    const isRunning = (keys['ShiftLeft'] || (joystick && joystick.force > 0.8)) &&
        player.userData.onGround && !isActionLocked;
    const currentMoveSpeed = isDevFlight ? flySpeed : (isRunning ? runSpeed : walkSpeed);
    const moveDistance = currentMoveSpeed * delta;

    // --- Vertical Movement (Jump & Gravity) ---
    const wasOnGround = player.userData.onGround;
    let landedThisFrame = false;

    // Compute current groundY based on XZ
    let groundY = getGroundYAt(player.position.x, player.position.z);

    // Check for jump input (disabled in flight)
    if (!isDevFlight && keys['Space'] && player.userData.onGround && !isActionLocked) {
        player.userData.velocity.y = JUMP_FORCE;
        player.userData.onGround = false;
        playAnimation(player, 'regularJump');
    }

    // Apply gravity when airborne (disabled in flight)
    if (!isDevFlight && !player.userData.onGround) {
        player.userData.velocity.y -= GRAVITY * delta;
    }

    // Update vertical position
    if (isDevFlight) {
        if (keys['Space']) {
            player.position.y += currentMoveSpeed * delta;
        }
        if (keys['ControlLeft']) {
            player.position.y -= currentMoveSpeed * delta;
        }
        const minY = groundY + 0.1;
        if (player.position.y < minY) player.position.y = minY;
    } else {
        player.position.y += player.userData.velocity.y * delta;
    }

    // Recompute groundY for new XZ (in case we moved horizontally later)
    groundY = getGroundYAt(player.position.x, player.position.z);

    // Ground collision against dynamic ground (terrain or wall top)
    if (!isDevFlight) {
        if (player.position.y <= groundY) {
            if (!player.userData.onGround) {
                landedThisFrame = true;
            }
            player.position.y = groundY;
            player.userData.velocity.y = 0;
            player.userData.onGround = true;

            // If we touched ground while a jump/fall one-shot is active, immediately unlock and allow blend back
            if (player.userData.currentAnimation === 'regularJump' || player.userData.currentAnimation === 'fall1') {
                if (player.userData.mixer && player.userData.actionFinishListener) {
                    try {
                        player.userData.mixer.removeEventListener('finished', player.userData.actionFinishListener);
                    } catch (_) {}
                    player.userData.actionFinishListener = null;
                }
                player.userData.actionLocked = false;
            }
        } else {
            player.userData.onGround = false;
        }
    } else {
        player.userData.onGround = false;
    }

    // --- Actions (Attack, Dodge) ---
    if (!isDevFlight && player.userData.onGround) {
        if (keys['MouseLeftClicked']) {
            keys['MouseLeftClicked'] = false;
            if (!isActionLocked) {
                playAnimation(player, 'punchCombo1');
            }
        } else if (keys['ControlLeft'] && !isActionLocked) {
            playAnimation(player, 'rollDodge');
        }
    }

    // --- Horizontal Movement with Collision (skip collision in flight) ---
    const prevX = player.position.x;
    const prevZ = player.position.z;

    const allowMovement = isDevFlight || !isActionLocked ||
        player.userData.currentAnimation === 'regularJump' || !player.userData.onGround;

    if (allowMovement) {
        // --- Calculate input direction ---
        let inputDirection = new THREE.Vector2(0, 0);

        if (joystick && joystick.force > 0.1) {
            const angle = joystick.angle.radian;
            const force = joystick.force;
            const adjustedAngle = angle - Math.PI / 2;
            const moveX = Math.cos(adjustedAngle);
            const moveZ = Math.sin(adjustedAngle);
            inputDirection.set(moveX * force, moveZ * force);
        }

        let keyMoveX = 0;
        let keyMoveZ = 0;
        if (keys['KeyW'] || keys['ArrowUp']) keyMoveZ = -1; // Forward
        if (keys['KeyS'] || keys['ArrowDown']) keyMoveZ = 1;  // Backward
        if (keys['KeyA'] || keys['ArrowLeft']) keyMoveX = -1; // Left
        if (keys['KeyD'] || keys['ArrowRight']) keyMoveX = 1;  // Right

        if ((keys['KeyW'] || keys['ArrowUp']) && (keys['KeyS'] || keys['ArrowDown'])) keyMoveZ = 0;
        if ((keys['KeyA'] || keys['ArrowLeft']) && (keys['KeyD'] || keys['ArrowRight'])) keyMoveX = 0;

        if (keyMoveX !== 0 || keyMoveZ !== 0) {
            inputDirection.set(keyMoveX, keyMoveZ).normalize();
        }

        // --- Rotate input direction by camera yaw (and pitch in flight) ---
        if (inputDirection.lengthSq() > 0) {
            const cosYaw = Math.cos(cameraYaw);
            const sinYaw = Math.sin(cameraYaw);

            moveDirection.x = inputDirection.x * cosYaw - inputDirection.y * sinYaw;
            moveDirection.y = inputDirection.x * sinYaw + inputDirection.y * cosYaw; // y is our Z axis for movement

            if (isDevFlight) {
                const cosPitch = Math.cos(cameraPitch);
                const sinPitch = Math.sin(cameraPitch);
                moveDirection.x *= cosPitch;
                moveDirection.y *= cosPitch;
                verticalFromCamera = -inputDirection.y * sinPitch;
            }
        }

        if (moveDirection.lengthSq() > 0 || verticalFromCamera !== 0) {
            // Proposed new position
            let newPos = {
                x: player.position.x + moveDirection.x * moveDistance,
                z: player.position.z + moveDirection.y * moveDistance
            };

            if (!isDevFlight) {
                // Resolve collisions in XZ for ground mode
                newPos = resolveCollisions(newPos, PLAYER_RADIUS, objectGrid);
            }

            player.position.x = newPos.x;
            player.position.z = newPos.z;
            if (isDevFlight && verticalFromCamera !== 0) {
                player.position.y += verticalFromCamera * moveDistance;
            }

            // Adjust Y to follow the ground when walking on surfaces (e.g., wall top)
            if (!isDevFlight) {
                const newGroundY = getGroundYAt(player.position.x, player.position.z);
                if (player.userData.onGround) {
                    player.position.y = newGroundY;
                }
            }
        }
    }

    const dx = player.position.x - prevX;
    const dz = player.position.z - prevZ;
    moved = (dx * dx + dz * dz) > 1e-6 || (verticalFromCamera * verticalFromCamera) > 1e-6;

    if (moved && player.userData.model && moveDirection.lengthSq() > 0) {
        const angle = Math.atan2(moveDirection.x, moveDirection.y);
        player.userData.model.rotation.y = angle;
    }

    player.userData.movedLastFrame = moved;

    // --- Animation Logic ---
    if (isDevFlight) {
        if (moved) {
            playAnimation(player, 'running');
        } else {
            playAnimation(player, 'idle11');
        }
    } else if (landedThisFrame) {
        player.userData.actionLocked = false;

        if (moved) {
            playAnimation(player, (keys['ShiftLeft'] || (joystick && joystick.force > 0.8)) ? 'running' : 'walking');
        } else {
            playAnimation(player, 'idle11');
        }
    } else if (isActionLocked) {
        // keep current
    } else if (player.userData.onGround) {
        if (!wasOnGround) {
            playAnimation(player, 'idle11');
        } else if (moved) {
            playAnimation(player, isRunning ? 'running' : 'walking');
        } else {
            playAnimation(player, 'idle11');
        }
    } else {
        if (player.userData.currentAnimation !== 'regularJump' && player.userData.velocity.y < 0) {
            playAnimation(player, 'fall1');
        }
    }
}
