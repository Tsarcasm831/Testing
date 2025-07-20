import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { createAmphitheatreSeating } from './amphi-seats.js';

/* @tweakable Set to true to re-enable amphitheater seating. A page reload is required for this change to take effect. */
const enableSeating = true;

/* @tweakable The color of the stone used for the amphitheater seats and structure. */
const stoneColor = 0x888888;
/* @tweakable The color of the stage platform. */
const stageColor = 0x4a2a0a;
/* @tweakable Set to false to disable the video backdrop, which may prevent console errors from ad-blockers. */
const enableVideoBackdrop = true;

let videoElement;
let videoTexture;

function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function createMicrophoneStand() {
    const standGroup = new THREE.Group();

    /* @tweakable The color of the microphone stand. */
    const standColor = 0x333333;
    /* @tweakable The color of the microphone head. */
    const micColor = 0x111111;

    const standMaterial = new THREE.MeshStandardMaterial({ color: standColor, roughness: 0.4, metalness: 0.8 });
    const micMaterial = new THREE.MeshStandardMaterial({ color: micColor, roughness: 0.6, metalness: 0.2 });

    // Base
    /* @tweakable The radius of the microphone stand base. */
    const baseRadius = 0.3;
    /* @tweakable The height of the microphone stand base. */
    const baseHeight = 0.05;
    const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 16);
    const base = new THREE.Mesh(baseGeometry, standMaterial);
    base.position.y = baseHeight / 2;
    standGroup.add(base);

    // Pole
    /* @tweakable The height of the microphone stand pole. */
    const poleHeight = 1.5;
    /* @tweakable The radius of the microphone stand pole. */
    const poleRadius = 0.02;
    const poleGeometry = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 8);
    const pole = new THREE.Mesh(poleGeometry, standMaterial);
    pole.position.y = baseHeight + poleHeight / 2;
    standGroup.add(pole);

    // Mic head
    /* @tweakable The size of the microphone head. */
    const micHeadRadius = 0.08;
    const micHeadGeometry = new THREE.SphereGeometry(micHeadRadius, 16, 16);
    const micHead = new THREE.Mesh(micHeadGeometry, micMaterial);
    micHead.position.y = baseHeight + poleHeight + micHeadRadius * 0.8;
    standGroup.add(micHead);
    
    standGroup.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
        }
    });

    return standGroup;
}

function createStage(dimensions) {
    const stageGroup = new THREE.Group();
    const stageMaterial = new THREE.MeshStandardMaterial({ color: stageColor, roughness: 0.8, metalness: 0.1 });
    const stageGeometry = new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth);
    const stage = new THREE.Mesh(stageGeometry, stageMaterial);
    stage.position.y = dimensions.height / 2;
    stage.castShadow = true;
    stage.receiveShadow = true;
    stage.userData.isBlock = true;
    stageGroup.add(stage);

    // Add stairs
    /* @tweakable The rotation of the stairs in degrees around the Y axis. */
    const stairRotationY = 0;
    const stairsGroup = new THREE.Group();
    stairsGroup.rotation.y = THREE.MathUtils.degToRad(stairRotationY);
    stageGroup.add(stairsGroup);

    /* @tweakable The number of stairs leading to the stage. */
    const stairCount = 4;
    const stairHeight = dimensions.height / stairCount;
    /* @tweakable The depth of each stair step. */
    const stairDepth = 0.5;
    /* @tweakable The starting Z position of the stairs relative to the stage's front edge. */
    const stairStartZ = -dimensions.depth / 2 - stairDepth / 2;

    for (let i = 0; i < stairCount; i++) {
        /* @tweakable The width of the stairs, which get narrower closer to the stage. */
        const stairWidth = dimensions.width * (0.4 - i * 0.05);
        const stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
        const stair = new THREE.Mesh(stairGeometry, stageMaterial);
    
        stair.position.set(
            0,
            i * stairHeight + stairHeight / 2,
            stairStartZ - (stairCount - 1 - i) * stairDepth
        );
    
        stair.castShadow = true;
        stair.receiveShadow = true;
        stair.userData.isBlock = true;
        stair.userData.isStair = true;
    
        stairsGroup.add(stair);
    }
    return stageGroup;
}

function createBackdropWall(position) {
    const wallGroup = new THREE.Group();
    /* @tweakable Height of the backdrop wall */
    const wallHeight = 15;
    /* @tweakable Width of the backdrop wall */
    const backdropWidth = 40;
    const wallThickness = 0.5;

    // Right side (YouTube video or static color if disabled)
    if (enableVideoBackdrop && videoTexture) {
        /* @tweakable The side of the video screen material to render. Use THREE.FrontSide, THREE.BackSide, or THREE.DoubleSide. */
        const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });

        const screenGeometry = new THREE.PlaneGeometry(backdropWidth, wallHeight);
        const videoMesh = new THREE.Mesh(screenGeometry, screenMaterial);
        /* @tweakable Set to false to disable frustum culling on the video mesh, forcing it to render even when outside the camera's view frustum. Helps with visibility issues. */
        videoMesh.frustumCulled = false;
        videoMesh.name = 'amphitheatre-video-screen';
        
        // Position relative to the wallGroup center, facing the audience
        /* @tweakable The rotation of the video screen in radians. 0 faces south, Math.PI (3.14) faces north. */
        videoMesh.rotation.y = Math.PI;
        /* @tweakable The forward offset of the video screen from the backdrop wall to prevent z-fighting. */
        videoMesh.position.set(0, 0, -wallThickness / 2 - 0.05);

        wallGroup.add(videoMesh);
    }
    
    // Add a solid backing wall. This will be visible if the video fails to load or is disabled.
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a, // A dark color for the wall itself
        roughness: 0.7,
        metalness: 0.2,
    });
    const wallGeometry = new THREE.BoxGeometry(backdropWidth, wallHeight, wallThickness);
    const backingWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backingWall.position.set(0, 0, 0);
    backingWall.castShadow = true;
    backingWall.receiveShadow = true;
    wallGroup.add(backingWall);

    wallGroup.position.copy(position);
    return { wall: wallGroup };
}

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
    const micStand = createMicrophoneStand();
    /* @tweakable The position of the microphone stand on the stage. */
    micStand.position.set(0, stageDimensions.height, 2);
    stage.add(micStand);

    // Seating is now disabled by default, but can be re-enabled with the tweakable toggle above.
    // NOTE: The seating feature has been removed, so this block is left as a placeholder.
    if (false) {
        console.warn("Amphitheater seating is enabled, but its associated file 'amphi-seats.js' has been removed. The seats will not be generated.");
    }

    // Backdrop
    /* @tweakable The default video source file for the amphitheater screen. Can be overridden by admin. */
    const defaultVideoSrc = 'assets/videos/local/The Weight - Kronowski (AI Music Video).mp4';

    videoElement = document.createElement('video');
    videoElement.src = defaultVideoSrc;
    videoElement.crossOrigin = 'anonymous';
    /* @tweakable Whether the amphitheater video should loop. */
    videoElement.loop = true;
    /* @tweakable Whether the amphitheater video should start muted. Required for autoplay in most browsers. */
    videoElement.muted = true;
    videoElement.playsInline = true;
    /* @tweakable Whether the amphitheater video should attempt to play automatically on load. */
    videoElement.autoplay = true;
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);
    videoElement.play().catch(e => console.error("Video autoplay failed:", e));

    videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;

    /* @tweakable The position of the backdrop behind the stage. */
    const backdropZOffset = 30;
    const wallHeight = 15; // from createBackdropWall
    const backdropPosition = new THREE.Vector3(0, stageDimensions.height + wallHeight/2, backdropZOffset);
    const backdropData = createBackdropWall(backdropPosition);
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