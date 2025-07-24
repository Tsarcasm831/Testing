import * as THREE from 'three';
import { createAmphitheatreSeating } from './amphi-seats.js';

/* @tweakable Set to true to re-enable amphitheater seating. A page reload is required for this change to take effect. */
const enableSeating = true;

/* @tweakable Set to true to enable collision for the amphitheater stage, stairs, and foundation. */
const AMPHITHEATRE_COLLISION_ENABLED = false;
/* @tweakable The color of the stone used for the amphitheater seats and structure. */
const stoneColor = 0x888888;
/* @tweakable The color of the stage platform. */
const stageColor = 0x4a2a0a;
/* @tweakable Set to false to disable the video backdrop, which may prevent console errors from ad-blockers. */
const enableVideoBackdrop = true;
/* @tweakable Set to true to show a visible outline box for debugging stage collision. */
const DEBUG_STAGE_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the stage. */
const DEBUG_STAGE_COLLISION_BOX_COLOR = 0x00ffff;
/* @tweakable Set to true to show a visible outline box for debugging stair collision. */
const DEBUG_STAIR_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the stairs. */
const DEBUG_STAIR_COLLISION_BOX_COLOR = 0x00ff00;
/* @tweakable Set to true to show a visible outline box for debugging the stage foundation. */
const DEBUG_FOUNDATION_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the stage foundation. */
const DEBUG_FOUNDATION_COLLISION_BOX_COLOR = 0xff00ff;
/* @tweakable Set to true to show a visible outline box for debugging the backdrop wall collision. */
const DEBUG_BACKDROP_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the backdrop wall. */
const DEBUG_BACKDROP_COLLISION_BOX_COLOR = 0xffff00;
/* @tweakable Set to false to disable collision for the microphone stand on the stage. */
const MIC_STAND_COLLISION_ENABLED = false;
/* @tweakable Set to true to show a visible outline box for debugging microphone collision. */
const DEBUG_MIC_COLLISION_BOX = false;
/* @tweakable The color of the debug collision box for the microphone. */
const DEBUG_MIC_COLLISION_BOX_COLOR = 0xff0000;

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
    if (DEBUG_MIC_COLLISION_BOX) {
        const micHelper = new THREE.BoxHelper(base, DEBUG_MIC_COLLISION_BOX_COLOR);
        micHelper.userData.isDebugBorder = true;
        micHelper.visible = false;
        standGroup.add(micHelper);
    }

    // Pole
    /* @tweakable The height of the microphone stand pole. */
    const poleHeight = 1.5;
    /* @tweakable The radius of the microphone stand pole. */
    const poleRadius = 0.02;
    const poleGeometry = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 8);
    const pole = new THREE.Mesh(poleGeometry, standMaterial);
    pole.position.y = baseHeight + poleHeight / 2;
    standGroup.add(pole);
    if (DEBUG_MIC_COLLISION_BOX) {
        const poleHelper = new THREE.BoxHelper(pole, DEBUG_MIC_COLLISION_BOX_COLOR);
        poleHelper.userData.isDebugBorder = true;
        poleHelper.visible = false;
        standGroup.add(poleHelper);
    }

    // Mic head
    /* @tweakable The size of the microphone head. */
    const micHeadRadius = 0.08;
    const micHeadGeometry = new THREE.SphereGeometry(micHeadRadius, 16, 16);
    const micHead = new THREE.Mesh(micHeadGeometry, micMaterial);
    micHead.position.y = baseHeight + poleHeight + micHeadRadius * 0.8;
    standGroup.add(micHead);
    if (DEBUG_MIC_COLLISION_BOX) {
        const micHeadHelper = new THREE.BoxHelper(micHead, DEBUG_MIC_COLLISION_BOX_COLOR);
        micHeadHelper.userData.isDebugBorder = true;
        micHeadHelper.visible = false;
        standGroup.add(micHeadHelper);
    }
    
    standGroup.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            // Explicitly set collidable status based on the tweakable constant
            child.userData.isBarrier = MIC_STAND_COLLISION_ENABLED;
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
    if (AMPHITHEATRE_COLLISION_ENABLED) {
        stage.userData.isBlock = true;
    }
    stageGroup.add(stage);

    if (DEBUG_STAGE_COLLISION_BOX) {
        const stageHelper = new THREE.BoxHelper(stage, DEBUG_STAGE_COLLISION_BOX_COLOR);
        stageHelper.userData.isDebugBorder = true;
        stageHelper.visible = false;
        stageGroup.add(stageHelper);
    }

    /* @tweakable The height of the foundation under the stage. */
    const foundationHeight = 2.0;
    /* @tweakable The color of the stage foundation. */
    const foundationColor = 0x331a00;
    const foundationMaterial = new THREE.MeshStandardMaterial({ color: foundationColor, roughness: 0.9, metalness: 0.1 });
    const foundationGeometry = new THREE.BoxGeometry(dimensions.width, foundationHeight, dimensions.depth);
    const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundation.position.y = -foundationHeight / 2;
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    stageGroup.add(foundation);
    if (DEBUG_FOUNDATION_COLLISION_BOX) {
        const foundationHelper = new THREE.BoxHelper(foundation, DEBUG_FOUNDATION_COLLISION_BOX_COLOR);
        foundationHelper.userData.isDebugBorder = true;
        foundationHelper.visible = false;
        stageGroup.add(foundationHelper);
    }

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
        if (AMPHITHEATRE_COLLISION_ENABLED) {
            stair.userData.isBlock = true;
            stair.userData.isStair = true;
        }
    
        stairsGroup.add(stair);

        if (DEBUG_STAIR_COLLISION_BOX) {
            const stairHelper = new THREE.BoxHelper(stair, DEBUG_STAIR_COLLISION_BOX_COLOR);
            stairHelper.userData.isDebugBorder = true;
            stairHelper.visible = false;
            stairsGroup.add(stairHelper);
        }
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
        if (DEBUG_BACKDROP_COLLISION_BOX) {
            const videoHelper = new THREE.BoxHelper(videoMesh, DEBUG_BACKDROP_COLLISION_BOX_COLOR);
            videoHelper.userData.isDebugBorder = true;
            videoHelper.visible = false;
            videoMesh.add(videoHelper);
        }

        const lyricsCanvas = document.createElement('canvas');
        lyricsCanvas.id = 'lyrics-display';
        lyricsCanvas.width = 1024;
        lyricsCanvas.height = 128;
        lyricsCanvas.style.display = 'none';
        document.body.appendChild(lyricsCanvas);

        const lyricsCtx = lyricsCanvas.getContext('2d');
        lyricsCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        lyricsCtx.fillRect(0, 0, lyricsCanvas.width, lyricsCanvas.height);
        lyricsCtx.font = 'bold 64px Arial';
        lyricsCtx.fillStyle = 'white';
        lyricsCtx.textAlign = 'center';
        lyricsCtx.textBaseline = 'middle';

        const lyricsTexture = new THREE.CanvasTexture(lyricsCanvas);
        lyricsCanvas.texture = lyricsTexture;

        const lyricsGeometry = new THREE.PlaneGeometry(backdropWidth, 5);
        const lyricsMaterial = new THREE.MeshBasicMaterial({ map: lyricsTexture, transparent: true });
        const lyricsMesh = new THREE.Mesh(lyricsGeometry, lyricsMaterial);
        lyricsMesh.name = 'amphitheatre-lyrics-display';

        lyricsMesh.rotation.copy(videoMesh.rotation);

        /* @tweakable The vertical position of the lyrics on the screen. Negative values are lower. The bottom of the video screen is at -7.5. */
        const lyricsYOffset = -5;
        /* @tweakable The forward offset of the lyrics display from the video screen to prevent z-fighting. A more negative value moves it closer to the audience. */
        const lyricsZOffset = -0.08;
        lyricsMesh.position.set(
            videoMesh.position.x,
            videoMesh.position.y + lyricsYOffset,
            videoMesh.position.z + lyricsZOffset
        );

        wallGroup.add(lyricsMesh);
        if (DEBUG_BACKDROP_COLLISION_BOX) {
            const lyricsHelper = new THREE.BoxHelper(lyricsMesh, DEBUG_BACKDROP_COLLISION_BOX_COLOR);
            lyricsHelper.userData.isDebugBorder = true;
            lyricsHelper.visible = false;
            lyricsMesh.add(lyricsHelper);
        }
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
    if (DEBUG_BACKDROP_COLLISION_BOX) {
        const backingWallHelper = new THREE.BoxHelper(backingWall, DEBUG_BACKDROP_COLLISION_BOX_COLOR);
        backingWallHelper.userData.isDebugBorder = true;
        backingWallHelper.visible = false;
        backingWall.add(backingWallHelper);
    }

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