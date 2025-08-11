import * as THREE from 'three';
import { playAnimation } from './animations.js';

const walkSpeed = 25; // Units per second for walking
const runSpeed = 50;  // Units per second for running
const flySpeed = 60;  // NEW: flight speed
const GRAVITY = 140;
const JUMP_FORCE = 70;

// Dynamic ground: base ground is y=0, but we also support standing on top of the central wall.
const BASE_GROUND_Y = 0;

// Central wall parameters (must match objects/index.js)
const WALL_RADIUS = 960;
const WALL_THICKNESS = 5;
const WALL_HEIGHT = 30;

// Player collision radius on XZ plane
const PLAYER_RADIUS = 2;

function isOverWallTop(x, z) {
    const r = Math.sqrt(x * x + z * z);
    const inner = WALL_RADIUS - WALL_THICKNESS / 2;
    const outer = WALL_RADIUS + WALL_THICKNESS / 2;
    return r >= inner && r <= outer;
}

function getGroundYAt(x, z) {
    // If the player is over the wall's top ring, the ground is the top surface
    if (isOverWallTop(x, z)) {
        return WALL_HEIGHT;
    }
    // Otherwise ground is the terrain baseline
    return BASE_GROUND_Y;
}

function resolveCollisions(newPos, playerRadius, objectGrid) {
    if (!objectGrid) return newPos;

    // Query nearby objects within a reasonable radius
    const searchRadius = 50;
    const nearby = objectGrid.getObjectsNear(newPos, searchRadius);
    if (!nearby || nearby.length === 0) return newPos;

    // Helper: resolve collision against an oriented (rotated) rectangle in XZ plane (OBB).
    // obb = { center: {x,z}, halfExtents: {x: hx, z: hz}, rotationY: radians }
    function resolveOBB(localNewPos, obb) {
        // Translate into OBB local space
        const dx = localNewPos.x - obb.center.x;
        const dz = localNewPos.z - obb.center.z;

        const cos = Math.cos(-obb.rotationY);
        const sin = Math.sin(-obb.rotationY);

        // Rotate by -rotation to align OBB with axes
        const lx = dx * cos - dz * sin;
        const lz = dx * sin + dz * cos;

        const hx = Math.max(0.0001, obb.halfExtents.x);
        const hz = Math.max(0.0001, obb.halfExtents.z);

        // Expand by player radius (Minkowski sum)
        const ex = hx + playerRadius;
        const ez = hz + playerRadius;

        // Check overlap in local space
        const ox = ex - Math.abs(lx);
        const oz = ez - Math.abs(lz);

        if (ox > 0 && oz > 0) {
            // Penetrating; push out along the axis of least penetration
            if (ox < oz) {
                // Push along X
                const sx = lx < 0 ? -1 : 1;
                const nx = sx; // local normal
                const nz = 0;
                // Move point out to the boundary
                const newLx = sx * ex;
                // Apply delta in local, then rotate back to world
                const dLx = newLx - lx;
                const dW_x = dLx * Math.cos(obb.rotationY) - 0 * Math.sin(obb.rotationY);
                const dW_z = dLx * Math.sin(obb.rotationY) + 0 * Math.cos(obb.rotationY);
                localNewPos.x += dW_x;
                localNewPos.z += dW_z;
                return true;
            } else {
                // Push along Z
                const sz = lz < 0 ? -1 : 1;
                const nx = 0;
                const nz = sz;
                const newLz = sz * ez;
                const dLz = newLz - lz;
                const dW_x = 0 * Math.cos(obb.rotationY) - dLz * Math.sin(obb.rotationY);
                const dW_z = 0 * Math.sin(obb.rotationY) + dLz * Math.cos(obb.rotationY);
                localNewPos.x += dW_x;
                localNewPos.z += dW_z;
                return true;
            }
        }
        return false;
    }

    // Iteratively resolve to avoid deep penetration
    for (let iter = 0; iter < 3; iter++) {
        let adjusted = false;

        for (let i = 0; i < nearby.length; i++) {
            const obj = nearby[i];
            const col = obj.userData && obj.userData.collider;
            if (!col) continue;

            if (col.type === 'sphere') {
                const cx = obj.position.x;
                const cz = obj.position.z;
                const r = (col.radius || 0) + playerRadius;

                const dx = newPos.x - cx;
                const dz = newPos.z - cz;
                const distSq = dx * dx + dz * dz;
                if (distSq < r * r) {
                    const dist = Math.sqrt(Math.max(distSq, 1e-8));
                    const nx = dist > 1e-6 ? dx / dist : 1;
                    const nz = dist > 1e-6 ? dz / dist : 0;
                    const overlap = r - dist;
                    newPos.x += nx * overlap;
                    newPos.z += nz * overlap;
                    adjusted = true;
                }
            } else if (col.type === 'aabb') {
                const cx = col.center?.x ?? obj.position.x;
                const cz = col.center?.z ?? obj.position.z;
                const hx = Math.max(0.1, col.halfExtents?.x ?? 8);
                const hz = Math.max(0.1, col.halfExtents?.z ?? 6);

                const closestX = Math.max(cx - hx, Math.min(newPos.x, cx + hx));
                const closestZ = Math.max(cz - hz, Math.min(newPos.z, cz + hz));

                let dx = newPos.x - closestX;
                let dz = newPos.z - closestZ;
                const distSq = dx * dx + dz * dz;

                if (distSq < playerRadius * playerRadius) {
                    if (distSq > 1e-8) {
                        const dist = Math.sqrt(distSq);
                        const nx = dx / dist;
                        const nz = dz / dist;
                        const overlap = playerRadius - dist;
                        newPos.x += nx * overlap;
                        newPos.z += nz * overlap;
                    } else {
                        const dx1 = (cx + hx) - newPos.x; // right
                        const dx2 = newPos.x - (cx - hx); // left
                        const dz1 = (cz + hz) - newPos.z; // front
                        const dz2 = newPos.z - (cz - hz); // back

                        const minX = Math.min(dx1, dx2);
                        const minZ = Math.min(dz1, dz2);
                        if (minX < minZ) {
                            if (dx1 < dx2) newPos.x = (cx + hx) + playerRadius;
                            else newPos.x = (cx - hx) - playerRadius;
                        } else {
                            if (dz1 < dz2) newPos.z = (cz + hz) + playerRadius;
                            else newPos.z = (cz - hz) - playerRadius;
                        }
                    }
                    adjusted = true;
                }
            } else if (col.type === 'obb' || col.type === 'orientedBox') {
                // Expect: center {x,z}, halfExtents {x,z}, rotationY
                const obb = {
                    center: { x: col.center?.x ?? obj.position.x, z: col.center?.z ?? obj.position.z },
                    halfExtents: { x: Math.max(0.0001, col.halfExtents?.x ?? 1), z: Math.max(0.0001, col.halfExtents?.z ?? 1) },
                    rotationY: col.rotationY ?? 0
                };
                if (resolveOBB(newPos, obb)) {
                    adjusted = true;
                }
            }
        }

        if (!adjusted) break;
    }

    return newPos;
}

export function updatePlayerMovement(player, keys, joystick, delta, objectGrid, cameraYaw) {
    let moved = false;
    let moveDirection = new THREE.Vector2(0, 0);

    // NEW: handle Dev Flight toggle (double-tap Space)
    if (keys['DevFlightToggle']) {
        keys['DevFlightToggle'] = false;
        player.userData.devFlight = !player.userData.devFlight;
        // Reset vertical velocity and unlock actions on toggle
        player.userData.velocity.y = 0;
        player.userData.actionLocked = false;

        if (player.userData.devFlight) {
            // Entering flight: lift slightly off the ground for clarity
            player.userData.onGround = false;
            player.position.y = Math.max(player.position.y, getGroundYAt(player.position.x, player.position.z) + 2);
        } else {
            // Exiting flight: snap to ground
            const groundY = getGroundYAt(player.position.x, player.position.z);
            player.position.y = groundY;
            player.userData.onGround = true;
        }
    }

    const isDevFlight = !!player.userData.devFlight;

    const isActionLocked = !!player.userData.actionLocked;

    // Determine if running. We define this early to use for both speed and animation.
    const isRunning = (keys['ShiftLeft'] || (joystick && joystick.force > 0.8)) && player.userData.onGround && !isActionLocked;
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
        // Free vertical control in flight
        if (keys['Space']) {
            player.position.y += currentMoveSpeed * delta;
        }
        if (keys['ControlLeft']) {
            player.position.y -= currentMoveSpeed * delta;
        }
        // Prevent dipping below ground unintentionally
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

    const allowMovement = isDevFlight || !isActionLocked || player.userData.currentAnimation === 'regularJump' || !player.userData.onGround;

    if (allowMovement) {
        // --- Calculate input direction ---
        let inputDirection = new THREE.Vector2(0, 0);

        if (joystick && joystick.force > 0.1) {
            const angle = joystick.angle.radian;
            const force = joystick.force;
            // Joystick angle is often absolute; we'll treat it as relative to an upward-facing "neutral"
            // and rotate it by camera yaw. 0 rad is right, PI/2 is up. We need to adjust.
            // Let's assume joystick's 0 is right. We want up to be forward.
            // Forward is -Z, so that's angle -PI/2.
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

        // --- Rotate input direction by camera yaw ---
        if (inputDirection.lengthSq() > 0) {
            const cosYaw = Math.cos(cameraYaw);
            const sinYaw = Math.sin(cameraYaw);
            
            // Rotate the input vector
            moveDirection.x = inputDirection.x * cosYaw - inputDirection.y * sinYaw;
            moveDirection.y = inputDirection.x * sinYaw + inputDirection.y * cosYaw; // .y is our Z axis for movement
        }
        
        if (moveDirection.lengthSq() > 0) {
            // Proposed new position
            let newPos = { x: player.position.x + moveDirection.x * moveDistance, z: player.position.z + moveDirection.y * moveDistance };

            if (!isDevFlight) {
                // Resolve collisions in XZ for ground mode
                newPos = resolveCollisions(newPos, PLAYER_RADIUS, objectGrid);
            }

            player.position.x = newPos.x;
            player.position.z = newPos.z;

            // Adjust Y to follow the ground when walking on surfaces (e.g., wall top)
            if (!isDevFlight) {
                const newGroundY = getGroundYAt(player.position.x, player.position.z);
                if (player.userData.onGround) {
                    player.position.y = newGroundY;
                }
            }

            const dx = player.position.x - prevX;
            const dz = player.position.z - prevZ;
            moved = (dx * dx + dz * dz) > 1e-6;

            if (moved && player.userData.model) {
                const angle = Math.atan2(dx, dz);
                player.userData.model.rotation.y = angle;
            }
        }
    }
    
    player.userData.movedLastFrame = moved;

    // --- Animation Logic ---
    if (isDevFlight) {
        // Keep simple animation behavior in flight
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