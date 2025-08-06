export function setupEventListeners(pc) {
    // Listen for jump/flight key on desktop
    document.addEventListener("keydown", (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
          return;
      }
      if (e.key === " " && !pc.isMobile) {
        if (e.repeat) return; // Ignore holding down space
        const now = performance.now();
        if (now - pc.lastSpacebarTime < pc.doubleTapThreshold) {
            pc.toggleFlightMode();
            pc.lastSpacebarTime = 0; // Reset after double tap
        } else {
            pc.lastSpacebarTime = now;
        }
      }
      if (e.key.toLowerCase() === 'c') {
        pc.toggleFirstPersonView();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      pc.camera.aspect = window.innerWidth / window.innerHeight;
      pc.camera.updateProjectionMatrix();
      if (pc.renderer) {
        pc.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });

    // Handle click for pointer lock
    pc.domElement.addEventListener('click', () => {
        if (pc.isFirstPerson && document.pointerLockElement !== pc.domElement) {
            pc.domElement.requestPointerLock();
        }
    });

    // Handle pointer lock change
    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === pc.domElement) {
            // Pointer is locked
        } else {
            // Pointer is unlocked
        }
    }, false);
  }