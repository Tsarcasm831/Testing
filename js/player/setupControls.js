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
      const instructionsDiv = document.createElement('div');
      instructionsDiv.className = "instructions";
      instructionsDiv.style.display = 'none'; // Hidden by default, shown after load

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
        <p class="click-to-begin"><b>This message will hide automatically. Click the Help button to see it again.</b></p>
      `;

      instructionsDiv.innerHTML = `<h2>${instructionsTitle}</h2>${instructionsContent}`;
      document.getElementById('game-container').appendChild(instructionsDiv);
      pc.instructionsDiv = instructionsDiv;

      const createHelpButton = () => {
        let helpButton = document.getElementById('help-button');
        if (helpButton) {
          helpButton.style.display = 'flex';
          return;
        }

        helpButton = document.createElement('div');
        helpButton.id = 'help-button';
        helpButton.classList.add('circle-button');
        helpButton.setAttribute('data-tooltip', 'Help');
        /* @tweakable The URL for the help icon. */
        const helpIconUrl = "https://file.garden/Zy7B0LkdIVpGyzA1/Public/Images/Icons/information.png";
        /* @tweakable The size of the help icon. */
        const helpIconSize = "28px";
        helpButton.innerHTML = `<img src="${helpIconUrl}" alt="Help" style="width: ${helpIconSize}; height: ${helpIconSize};">`;
        document.getElementById('ui-container').appendChild(helpButton);

        helpButton.addEventListener('click', () => {
          if (instructionsDiv) {
            instructionsDiv.style.display = instructionsDiv.style.display === 'none' ? 'block' : 'none';
          }
        });

        // Add a click listener to the instructions to hide them
        if (instructionsDiv) {
          instructionsDiv.addEventListener('click', () => {
            instructionsDiv.style.display = 'none';
          });
        }
      };

      // This is now handled in Game.js, after the loading screen is hidden
      // createHelpButton will be called from there. We leave the function here for use.
      pc.createHelpButton = createHelpButton;
    }
  }