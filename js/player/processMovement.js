export function processMovement(pc, delta) {
    // Skip movement processing if controls are disabled
    if (!pc.enabled) return;

    if (pc.isFlying) {
        /* @tweakable The speed of the player while flying. */
        const flightSpeed = SPEED * 4;
        pc.velocity.y = 0;

        const cameraDirection = new THREE.Vector3();
        pc.camera.getWorldDirection(cameraDirection);

        const rightVector = new THREE.Vector3();
        rightVector.crossVectors(pc.camera.up, cameraDirection).normalize();
        
        const moveDir = pc.inputManager.getMovementDirection();
        
        const movement = new THREE.Vector3();
        movement.addScaledVector(cameraDirection, moveDir.z * flightSpeed);
        movement.addScaledVector(rightVector, -moveDir.x * flightSpeed);
        
        if (pc.inputManager.keysPressed.has(" ")) { // Go up
            movement.y += flightSpeed;
        }
        /* @tweakable Key used to fly down. */
        const flyDownKey = "shift";
        if (pc.inputManager.keysPressed.has(flyDownKey)) { // Go down
            movement.y -= flightSpeed;
        }
        
        pc.playerModel.position.add(movement);

        const isMovingNow = moveDir.lengthSq() > 0.001 || Math.abs(movement.y) > 0.001;
        pc.isMoving = isMovingNow;

        if (pc.playerModel) {
            if (moveDir.lengthSq() > 0.001) {
                const horizontalMovement = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
                const angle = Math.atan2(horizontalMovement.x, horizontalMovement.z);
                const offset = pc.playerModel.userData.isAnimatedGLB ? (pc.playerModel.userData.rotationOffset || 0) : 0;
                pc.playerModel.rotation.y = angle - offset;
            }

            if (pc.playerModel.userData.isAnimatedGLB) {
                const actions = pc.playerModel.userData.actions;
                const fadeDuration = pc.playerModel.userData.animationFadeDuration || 0.5;
                /* @tweakable The animation to play while flying. Options: 'idle', 'walk', 'run'. */
                const flyAnimation = 'run';
                let newActionName = isMovingNow ? flyAnimation : 'idle';
                
                if (pc.currentAction !== newActionName) {
                    const from = actions[pc.currentAction];
                    const to = actions[newActionName];
                    if(from && to) {
                        from.fadeOut(fadeDuration);
                        to.reset().fadeIn(fadeDuration).play();
                    } else if (to) {
                        to.reset().fadeIn(fadeDuration).play();
                    }
                    pc.currentAction = newActionName;
                }
            } else {
                const leftLeg = pc.playerModel.getObjectByName("leftLeg");
                const rightLeg = pc.playerModel.getObjectByName("rightLeg");
                if (leftLeg && rightLeg) {
                    leftLeg.rotation.x = 0;
                    rightLeg.rotation.x = 0;
                }
            }
            
            const newTarget = new THREE.Vector3(pc.playerModel.position.x, pc.playerModel.position.y + 1, pc.playerModel.position.z);
            if (pc.controls) pc.controls.target.copy(newTarget);
            pc.camera.position.copy(newTarget).add(pc.cameraOffset);
            
            if (pc.room && (
                pc.lastPosition.distanceTo(pc.playerModel.position) > 0.01 ||
                pc.isMoving !== pc.wasMoving ||
                pc.isFlying !== pc.wasFlying
              )) {
              
              const offset = pc.playerModel.userData.rotationOffset || 0;
              const presenceData = {
                x: pc.playerModel.position.x,
                y: pc.playerModel.position.y,
                z: pc.playerModel.position.z,
                rotation: pc.playerModel.rotation.y - offset,
                moving: pc.isMoving,
                running: false,
                sprinting: false,
                flying: pc.isFlying
              };
              
              if (pc.playerModel.userData.isGLB) {
                presenceData.isGLB = true;
              } else if (pc.playerModel.userData.characterSpec) {
                presenceData.characterSpec = pc.playerModel.userData.characterSpec;
              }
              
              pc.room.updatePresence(presenceData);
              
              pc.lastPosition.copy(pc.playerModel.position);
              pc.wasMoving = pc.isMoving;
              pc.wasFlying = pc.isFlying;
            }
        }
        
        if (pc.controls) pc.controls.update();

        if (pc.isMobile) {
          // Mobile camera logic is now event-driven in initializeControls
        }
    } else {

      if (pc.inputManager.isJumping() && pc.canJump) {
        pc.velocity.y = JUMP_FORCE;
        pc.canJump = false;
      }
      
      const x = pc.playerModel.position.x;
      const y = pc.playerModel.position.y;
      const z = pc.playerModel.position.z;
      
      const moveDir = pc.inputManager.getMovementDirection();
      pc.isRunning = pc.inputManager.isRunning();
      pc.isSprinting = pc.inputManager.isSprinting();
      
      const cameraDirection = new THREE.Vector3();
      pc.camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0; 
      cameraDirection.normalize();
      
      const rightVector = new THREE.Vector3();
      rightVector.crossVectors(pc.camera.up, cameraDirection).normalize();
      
      const movement = new THREE.Vector3();
      movement.addScaledVector(cameraDirection, moveDir.z);
      movement.addScaledVector(rightVector, -moveDir.x);
      
      if (movement.length() > 0) {
          let moveSpeed = pc.isMobile ? SPEED * MOBILE_SPEED_MULTIPLIER : SPEED;
          if (pc.isSprinting) {
              moveSpeed *= SPRINT_SPEED_MULTIPLIER;
          } else if (pc.isRunning) {
            moveSpeed *= RUN_SPEED_MULTIPLIER;
          }
          movement.normalize().multiplyScalar(moveSpeed);
      }

      pc.velocity.y -= GRAVITY;
      
      let newX = x + movement.x;
      let newY = y + pc.velocity.y;
      let newZ = z + movement.z;
      
      // Use the CollisionManager to check for collisions
      const { finalPosition, finalVelocity, canJump, standingOnBlock } = pc.collisionManager.checkCollisions(
          pc.playerModel.position,
          new THREE.Vector3(newX, newY, newZ),
          pc.velocity,
          PLAYER_COLLISION_RADIUS,
          PLAYER_COLLISION_HEIGHT
      );
      
      newX = finalPosition.x;
      newY = finalPosition.y;
      newZ = finalPosition.z;
      pc.velocity.copy(finalVelocity);
      
      if (canJump) {
          pc.canJump = true;
      }
      
      // Ground collision logic moved here to always check against terrain after object collision
      const terrainHeight = pc.collisionManager.getGroundHeight(newX, newZ);
      /* @tweakable The vertical offset of the player model from the ground to prevent clipping. */
      const groundOffset = 0;
      const groundLevel = terrainHeight + groundOffset;

      // If standing on a block, the newY is already set by the collision manager.
      // We just need to make sure we don't fall through it to the terrain below.
      if (standingOnBlock) {
          if (newY < groundLevel) {
              // This case is unlikely but handles situations where a block might be slightly below terrain
              newY = groundLevel;
              pc.velocity.y = 0;
              pc.canJump = true;
          }
      } else {
          // Not standing on a block, so check against terrain.
          // Apply gravity.
          pc.velocity.y -= GRAVITY;
          newY = pc.playerModel.position.y + pc.velocity.y;

          if (newY < groundLevel) {
              newY = groundLevel;
              pc.velocity.y = 0;
              pc.canJump = true;
          }
      }
      
      const isMovingNow = movement.length() > 0.001;
      pc.isMoving = isMovingNow;
      
      if (pc.playerModel) {
        pc.playerModel.position.set(newX, newY, newZ);
        
        if (isMovingNow) {
          const angle = Math.atan2(movement.x, movement.z);
          const offset = pc.playerModel.userData.isAnimatedGLB ? (pc.playerModel.userData.rotationOffset || 0) : 0;
          pc.playerModel.rotation.y = angle - offset; 
        }
        
        // Handle animations
        if (pc.playerModel.userData.isAnimatedGLB) {
          const actions = pc.playerModel.userData.actions;
          const fadeDuration = pc.playerModel.userData.animationFadeDuration || 0.5;
          
          let newActionName = 'idle';
          if (isMovingNow) {
            newActionName = pc.isSprinting ? 'sprint' : pc.isRunning ? 'run' : 'walk';
          }
          
          if (pc.currentAction !== newActionName) {
              const from = actions[pc.currentAction];
              const to = actions[newActionName];
              if(from && to) {
                  from.fadeOut(fadeDuration);
                  to.reset().fadeIn(fadeDuration).play();
              }
              pc.currentAction = newActionName;
          }
        } else {
          if (isMovingNow) {
              const leftLeg = pc.playerModel.getObjectByName("leftLeg");
              const rightLeg = pc.playerModel.getObjectByName("rightLeg");
              
              if (leftLeg && rightLeg) {
                /* @tweakable Speed of the procedural leg swing animation. */
                const walkSpeed = 5; 
                /* @tweakable Amplitude of the procedural leg swing animation. */
                const walkAmplitude = 0.3;
                leftLeg.rotation.x = Math.sin(pc.time * walkSpeed) * walkAmplitude;
                rightLeg.rotation.x = Math.sin(pc.time * walkSpeed + Math.PI) * walkAmplitude;
              }
          } else {
              const leftLeg = pc.playerModel.getObjectByName("leftLeg");
              const rightLeg = pc.playerModel.getObjectByName("rightLeg");
              
              if (leftLeg && rightLeg) {
                leftLeg.rotation.x = 0;
                rightLeg.rotation.x = 0;
              }
          }
        }
        
        const newTarget = new THREE.Vector3(pc.playerModel.position.x, pc.playerModel.position.y + 1, pc.playerModel.position.z);
        if (pc.controls) pc.controls.target.copy(newTarget);
        pc.camera.position.copy(newTarget).add(pc.cameraOffset);
        
        if (pc.room && (
            Math.abs(pc.lastPosition.x - newX) > 0.01 ||
            Math.abs(pc.lastPosition.y - newY) > 0.01 ||
            Math.abs(pc.lastPosition.z - newZ) > 0.01 ||
            pc.isMoving !== pc.wasMoving ||
            pc.isRunning !== pc.wasRunning ||
            pc.isSprinting !== pc.wasSprinting ||
            pc.isFlying !== pc.wasFlying
          )) {
          
          const offset = pc.playerModel.userData.rotationOffset || 0;
          const presenceData = {
            x: newX,
            y: newY,
            z: newZ,
            rotation: pc.playerModel.rotation.y - offset,
            moving: pc.isMoving,
            running: pc.isRunning,
            sprinting: pc.isSprinting,
            flying: pc.isFlying
          };
  
          if (pc.playerModel.userData.isGLB) {
            presenceData.isGLB = true;
          } else if (pc.playerModel.userData.characterSpec) {
            presenceData.characterSpec = pc.playerModel.userData.characterSpec;
          }
          
          pc.room.updatePresence(presenceData);
          
          pc.lastPosition.set(newX, newY, newZ);
          pc.wasMoving = pc.isMoving;
          pc.wasRunning = pc.isRunning;
          pc.wasSprinting = pc.isSprinting;
          pc.wasFlying = pc.isFlying;
        }
      }
      
      // Still update controls for camera movement when player movement is disabled
      if (pc.controls) {
          // Mobile camera rotation is now handled by OrbitControls directly.
          pc.controls.update();
      }

      if (pc.isMobile) {
        // Mobile camera logic is now event-driven in initializeControls
      }
      
      // Update animation mixer if it exists
      if (pc.playerModel && pc.playerModel.userData.mixer) {
          pc.playerModel.userData.mixer.update(delta);
      }
    }
}
