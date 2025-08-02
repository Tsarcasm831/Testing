import * as THREE from 'three';
import { createAmphitheatreSeating } from './amphi-seats.js';
import { createMicrophoneStand } from './amphi-microphone.js';
import { createStage } from './amphi-stage.js';
import { createBackdropWall, BACKDROP_WALL_HEIGHT } from './amphi-backdrop.js';
import riggingMat from '../mats/stage_rigging.js';
import spotlightMat from '../mats/stage_spotlight.js';
import speakerMat from '../mats/stage_speaker.js';
import monitorMat from '../mats/stage_monitor.js';

/* @tweakable Set to true to re-enable amphitheater seating. A page reload is required for this change to take effect. */
const enableSeating = true;
/* @tweakable The color of the stone used for the amphitheater seats and structure. */
const stoneColor = 0x888888;

let videoElement;
let videoTexture;

export async function createAmphitheatre(scene, getHeight, npcManager, terrain, assetManager) {
    /* @tweakable Position of the amphitheater. */
    const amphitheatrePosition = new THREE.Vector3(55.5, 0, -12.5);
    const baseHeight = getHeight(amphitheatrePosition.x, amphitheatrePosition.z);
    amphitheatrePosition.y = baseHeight;

    const group = new THREE.Group();
    group.name = 'amphitheatre';
    group.position.copy(amphitheatrePosition);
    scene.add(group);

    // Stage
    /* @tweakable Dimensions of the stage platform. */
    const stageDimensions = { width: 20, height: 1.5, depth: 15 };
    const stage = createStage(stageDimensions);
    /* @tweakable The position of the stage within the amphitheater group. */
    stage.position.z = 10;
    group.add(stage);

    // Add microphone stand to the stage
    /* @tweakable The position of the microphone stand on the stage. */
    const micStandPosition = { x: 0, y: stageDimensions.height, z: 2 };
    const micStand = createMicrophoneStand();
    micStand.position.set(micStandPosition.x, micStandPosition.y, micStandPosition.z);
    stage.add(micStand);

    // Lighting Rig, Lights, Speakers, and Monitors
    if (assetManager) {
        // Lighting rig
        const riggingMaterial = await riggingMat(assetManager);
        const trussGroup = new THREE.Group();
        /* @tweakable Height of the lighting rig above the stage */
        const rigHeight = 8;
        /* @tweakable Thickness of the truss beams */
        const trussRadius = 0.2;
        /* @tweakable Z-position of the lighting rig on the stage */
        const rigZPosition = -stageDimensions.depth / 2 + 3;

        const verticalTrussGeo = new THREE.CylinderGeometry(trussRadius, trussRadius, rigHeight, 8);
        const horizontalTrussGeo = new THREE.CylinderGeometry(trussRadius, trussRadius, stageDimensions.width * 0.9, 8);

        const leftSupport = new THREE.Mesh(verticalTrussGeo, riggingMaterial);
        leftSupport.position.set(-stageDimensions.width / 2 * 0.9, stageDimensions.height + rigHeight / 2, rigZPosition);
        trussGroup.add(leftSupport);

        const rightSupport = leftSupport.clone();
        rightSupport.position.x = stageDimensions.width / 2 * 0.9;
        trussGroup.add(rightSupport);

        const topBeam = new THREE.Mesh(horizontalTrussGeo, riggingMaterial);
        topBeam.rotation.z = Math.PI / 2;
        topBeam.position.set(0, stageDimensions.height + rigHeight, rigZPosition);
        trussGroup.add(topBeam);
        
        // Add spotlights to the rig
        const spotlightMaterial = await spotlightMat(assetManager);
        const spotlightGeo = new THREE.CylinderGeometry(0.2, 0.4, 0.5, 12);
        /* @tweakable Number of spotlights on the rig */
        const numSpotlights = 5;
        /* @tweakable Spacing between spotlights on the rig */
        const spotlightSpacing = 4;
        for (let i = 0; i < numSpotlights; i++) {
            const spotlight = new THREE.Mesh(spotlightGeo, spotlightMaterial);
            const xPos = (i - (numSpotlights - 1) / 2) * spotlightSpacing;
            spotlight.position.set(xPos, stageDimensions.height + rigHeight - 0.5, rigZPosition);
            /* @tweakable Downward angle of spotlights in radians. A positive value points them toward the audience. */
            spotlight.rotation.x = Math.PI / 4;
            /* @tweakable Forward/backward rotation of spotlights in radians. Set to Math.PI to face south toward the audience. */
            spotlight.rotation.y = Math.PI;
            trussGroup.add(spotlight);
        }
        
        stage.add(trussGroup);

        // Speakers
        const speakerMaterial = await speakerMat(assetManager);
        /* @tweakable Dimensions of the speakers on stage */
        const speakerSize = { x: 1, y: 1.5, z: 0.8 };
        const speakerGeo = new THREE.BoxGeometry(speakerSize.x, speakerSize.y, speakerSize.z);

        const leftSpeaker = new THREE.Mesh(speakerGeo, speakerMaterial);
        /* @tweakable Position of the left speaker stack */
        const leftSpeakerPos = { x: -stageDimensions.width/2 + 1.5, y: stageDimensions.height + speakerSize.y/2, z: -stageDimensions.depth/2 + 2.5 };
        leftSpeaker.position.set(leftSpeakerPos.x, leftSpeakerPos.y, leftSpeakerPos.z);
        stage.add(leftSpeaker);

        const rightSpeaker = leftSpeaker.clone();
        /* @tweakable Position of the right speaker stack */
        const rightSpeakerPos = { x: stageDimensions.width/2 - 1.5, y: stageDimensions.height + speakerSize.y/2, z: -stageDimensions.depth/2 + 2.5 };
        rightSpeaker.position.set(rightSpeakerPos.x, rightSpeakerPos.y, rightSpeakerPos.z);
        stage.add(rightSpeaker);

        // Monitors
        const monitorMaterial = await monitorMat(assetManager);
        /* @tweakable Dimensions of the stage monitors */
        const monitorSize = { x: 0.8, y: 0.5, z: 0.6 };
        const monitorGeo = new THREE.BoxGeometry(monitorSize.x, monitorSize.y, monitorSize.z);

        const leftMonitor = new THREE.Mesh(monitorGeo, monitorMaterial);
        /* @tweakable Position of the left stage monitor */
        const leftMonitorPos = { x: -2.5, y: stageDimensions.height + monitorSize.y/2, z: -2 };
        leftMonitor.position.set(leftMonitorPos.x, leftMonitorPos.y, leftMonitorPos.z);
        /* @tweakable Upward angle of stage monitors in radians */
        leftMonitor.rotation.x = -Math.PI / 6;
        stage.add(leftMonitor);

        const rightMonitor = leftMonitor.clone();
        /* @tweakable Position of the right stage monitor */
        const rightMonitorPos = { x: 2.5, y: stageDimensions.height + monitorSize.y/2, z: -2 };
        rightMonitor.position.set(rightMonitorPos.x, rightMonitorPos.y, rightMonitorPos.z);
        stage.add(rightMonitor);
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

    let interactableSeats = [];
    if (enableSeating) {
        interactableSeats = createAmphitheatreSeating(group, stoneColor, npcManager, terrain);
    }

    return { group, interactableSeats };
}