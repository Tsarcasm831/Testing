import * as THREE from 'three';
import { createAmphitheatreSeating } from './amphi-seats.js';
import { createMicrophoneStand } from './amphi-microphone.js';
import { createStage } from './amphi-stage.js';
import { createBackdropWall, BACKDROP_WALL_HEIGHT } from './amphi-backdrop.js';

/* @tweakable Set to true to re-enable amphitheater seating. A page reload is required for this change to take effect. */
const enableSeating = true;
/* @tweakable The color of the stone used for the amphitheater seats and structure. */
const stoneColor = 0x888888;

let videoElement;
let videoTexture;

export function createAmphitheatre(scene, getHeight) {
    /* @tweakable Position of the amphitheater. */
    const amphitheatrePosition = new THREE.Vector3(55.5, 0, -12.5);
    const baseHeight = getHeight(amphitheatrePosition.x, amphitheatrePosition.z);
    amphitheatrePosition.y = baseHeight;

    const group = new THREE.Group();
    group.name = 'amphitheatre';
    group.position.copy(amphitheatrePosition);
    scene.add(group);

    /* @tweakable Whether the amphitheater ground plane is collidable. */
    const isGroundCollidable = true;

    // Ground plane (removed as per user request)
    /* @tweakable Set to true to re-enable the flat ground plane for the amphitheater. */
    const enableAmphitheatreGroundPlane = false;
    if (enableAmphitheatreGroundPlane) {
        const groundSize = 120;
        const groundGeometry = new THREE.CircleGeometry(groundSize / 2, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });
        const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
        groundPlane.rotation.x = -Math.PI / 2;
        groundPlane.receiveShadow = true;
        if (isGroundCollidable) {
            groundPlane.userData.isBlock = true;
        }
        group.add(groundPlane);
    }

    // Stage
    /* @tweakable Dimensions of the stage platform. */
    const stageDimensions = { width: 20, height: 1.5, depth: 15 };
    const stage = createStage(stageDimensions);
    stage.position.z = 10;
    group.add(stage);

    // Add microphone stand to the stage
    const micStandPosition = { x: 0, y: stageDimensions.height, z: 2 };
    const micStand = createMicrophoneStand();
    micStand.position.set(micStandPosition.x, micStandPosition.y, micStandPosition.z);
    stage.add(micStand);

    // Seating is now disabled by default, but can be re-enabled with the tweakable toggle above.
    // NOTE: The seating feature has been removed, so this block is left as a placeholder.
    if (false) {
        console.warn("Amphitheater seating is enabled, but its associated file 'amphi-seats.js' has been removed. The seats will not be generated.");
    }

    // Backdrop
    /* @tweakable The default video source file for the amphitheater screen. Can be overridden by admin. */
    const defaultVideoSrc = 'https://file.garden/Zy7B0LkdIVpGyzA1/Videos/The%20Weight%20-%20Kronowski%20(AI%20Music%20Video).mp4';

    /* @tweakable If true, a video element will be created for the amphitheater. Set to false on mobile if loading issues persist. */
    const enableVideoElement = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (enableVideoElement) {
        videoElement = document.createElement('video');
        videoElement.id = 'amphitheatre-video';
        videoElement.src = defaultVideoSrc;
        videoElement.crossOrigin = 'anonymous';
        /* @tweakable Whether the amphitheater video should loop. */
        videoElement.loop = true;
        /* @tweakable Whether the amphitheater video should start muted. Required for autoplay in most browsers. */
        videoElement.muted = true;
        videoElement.playsInline = true;
        /* @tweakable Whether the amphitheater video should attempt to play automatically on load. Set to false to require manual play trigger (default: 'p' key). */
        videoElement.autoplay = false;
        videoElement.style.display = 'none';
        document.body.appendChild(videoElement);

        videoTexture = new THREE.VideoTexture(videoElement);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;
    } else {
        videoTexture = null; // Ensure videoTexture is null if element is not created
    }

    /* @tweakable The position of the backdrop behind the stage. */
    const backdropZOffset = 30;
    const backdropPosition = new THREE.Vector3(0, stageDimensions.height + BACKDROP_WALL_HEIGHT / 2, backdropZOffset);
    const backdropData = createBackdropWall(backdropPosition, videoTexture);
    group.add(backdropData.wall);

    // Lighting
    const spotLight1 = new THREE.SpotLight(0xffffff, 200);
    spotLight1.position.set(-20, 30, 40);
    spotLight1.target = stage;
    spotLight1.angle = Math.PI / 8;
    spotLight1.penumbra = 0.3;
    spotLight1.castShadow = true;
    group.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff, 200);
    spotLight2.position.set(20, 30, 40);
    spotLight2.target = stage;
    spotLight2.angle = Math.PI / 8;
    spotLight2.penumbra = 0.3;
    spotLight2.castShadow = true;
    group.add(spotLight2);

    if (enableSeating) {
        createAmphitheatreSeating(group, stoneColor);
    }

    return group;
}
