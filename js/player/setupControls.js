import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mobileMinZoom, mobileMaxZoom } from "./constants.js";

export function initializeControls(pc) {
    // Use OrbitControls for third-person view on both platforms
    pc.controls = new OrbitControls(pc.camera, pc.domElement);
    pc.controls.enableDamping = true;
    pc.controls.dampingFactor = 0.1;
    pc.controls.maxPolarAngle = Math.PI * 0.9; // Prevent going below ground
    pc.controls.minDistance = pc.isMobile ? mobileMinZoom : 3; // Minimum zoom distance
    pc.controls.maxDistance = pc.isMobile ? mobileMaxZoom : 10; // Maximum zoom distance
    /* @tweakable The rotation speed of the camera. */
    pc.controls.rotateSpeed = 0.5;
     /* @tweakable The zoom speed of the camera. */
    pc.controls.zoomSpeed = 0.8;
    
    // Update camera offset when controls change
    pc.controls.addEventListener('change', () => {
      pc.cameraOffset.copy(pc.camera.position).sub(pc.controls.target);
    });

    if (pc.isMobile) {
      // The InputManager handles the creation of joysticks and touch listeners.
      // We just need to make sure the UI elements are visible.
      document.getElementById('joystick').style.display = 'block';
      document.getElementById('jump-button').style.display = 'block';
    } else {
      // Add instructions for desktop
      /* @tweakable Delay in milliseconds before showing the welcome message. */
      const welcomeMessageDelay = 5000;

      setTimeout(() => {
        const instructionsDiv = document.createElement('div');
        instructionsDiv.className = "instructions";
  
        /* @tweakable The title for the instructions popup. */
        const instructionsTitle = "Welcome to the World!";
        /* @tweakable The content for the instructions popup. Can include HTML. */
        const instructionsContent = `
          <div class="instructions-section">
              <strong>Controls:</strong>
              <ul>
                  <li><b>WASD:</b> Move</li>
                  <li><b>Space:</b> Jump/Double tap to fly</li>
                  <li><b>Shift:</b> Run</li>
                  <li><b>Ctrl:</b> Sprint</li>
                  <li><b>F:</b> Interact with NPCs</li>
                  <li><b>/:</b> Open Chat</li>
              </ul>
          </div>
          <div class="instructions-section">
              <strong>Features:</strong>
              <ul>
                  <li>Explore four distinct biomes with unique trees and structures.</li>
                  <li>Use the <b>Build Mode</b> (hammer icon) to create your own structures.</li>
                  <li>Customize your character with the <b>Character Creator</b> (top-left icon).</li>
                  <li>Chat and build with other players online!</li>
              </ul>
          </div>
          <p class="click-to-begin"><b>Click anywhere to begin your adventure.</b></p>
        `;
  
        instructionsDiv.innerHTML = `<h2>${instructionsTitle}</h2>${instructionsContent}`;
  
        document.getElementById('game-container').appendChild(instructionsDiv);
      }, welcomeMessageDelay);
      
      // Hide instructions on first click
      document.addEventListener('click', () => {
        if (document.querySelector(".instructions")) {
          document.querySelector(".instructions").style.display = 'none';
        }
      }, { once: true });
    }
  }