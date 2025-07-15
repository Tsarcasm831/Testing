import * as THREE from 'three';

/* @tweakable The color of the stone used for the amphitheater seats and structure. */
const stoneColor = 0x888888;
/* @tweakable The color of the stage platform. */
const stageColor = 0x4a2a0a;
/* @tweakable Set to false to disable the video backdrop, which may prevent console errors from ad-blockers. */
const enableVideoBackdrop = true;

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
    
        stairsGroup.add(stair);
    }
    return stageGroup;
}

function createSeatRow(rowIndex, radius, seatCount, rowHeight) {
    const rowGroup = new THREE.Group();
    const seatMaterial = new THREE.MeshStandardMaterial({ color: stoneColor, roughness: 0.9, metalness: 0.05 });

    for (let i = 0; i < seatCount; i++) {
        const angle = Math.PI * (i / (seatCount - 1)); // 180 degree arc
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        // Tiered seating
        const y = rowIndex * rowHeight;

        // Base for the seat row
        const baseRadius = radius + 0.75;
        const baseShape = new THREE.Shape();
        const startAngle = angle - (Math.PI / seatCount) / 2;
        const endAngle = angle + (Math.PI / seatCount) / 2;
        baseShape.absarc(0, 0, baseRadius-1.5, startAngle, endAngle, false);
        baseShape.absarc(0, 0, baseRadius, endAngle, startAngle, true);
        baseShape.closePath();
        
        const extrudeSettings = {
            steps: 1,
            depth: rowHeight,
            bevelEnabled: false,
        };
        const geometry = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
        const baseMesh = new THREE.Mesh(geometry, seatMaterial);
        baseMesh.rotation.x = -Math.PI / 2;
        baseMesh.position.y = y;
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        baseMesh.userData.isBlock = true;

        rowGroup.add(baseMesh);
    }
    
    return rowGroup;
}

function createBackdropWall(position, videoSrc, listener) {
    const wallGroup = new THREE.Group();
    /* @tweakable Height of the backdrop wall */
    const wallHeight = 15;
    /* @tweakable Width of the backdrop wall */
    const backdropWidth = 40;
    const wallThickness = 0.5;

    // Right side (YouTube video or static color if disabled)
    if (enableVideoBackdrop && videoSrc) {
        const video = document.createElement('video');
        video.src = videoSrc;
        video.crossOrigin = 'anonymous'; // Important for textures
        video.loop = true;
        video.playsInline = true;
        
        if (listener) {
            video.muted = true; // Mute element so positional audio can control it.
            const sound = new THREE.PositionalAudio(listener);
            sound.setMediaElementSource(video);
            /* @tweakable The reference distance for positional audio rolloff. */
            sound.setRefDistance(20);
            /* @tweakable The rolloff factor for positional audio. */
            sound.setRolloffFactor(1);
            /* @tweakable The volume of the video on the amphitheater screen. */
            sound.setVolume(0.5);
            wallGroup.add(sound);
        } else {
            video.muted = true; // Mute if no listener, to prevent global sound
        }
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Video autoplay was prevented. User interaction needed to start video.", error);
                document.body.addEventListener('click', () => { if (video.paused) video.play(); }, { once: true });
            });
        }
        
        const texture = new THREE.VideoTexture(video);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
        const geometry = new THREE.PlaneGeometry(backdropWidth, wallHeight);
        const videoMesh = new THREE.Mesh(geometry, material);
        videoMesh.position.set(0, 0, wallThickness / 2 + 0.01); // Place in front of the wall
        videoMesh.rotation.y = Math.PI; // Face the audience
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

export function createAmphitheatre(scene, getHeight, listener) {
    /* @tweakable Position of the amphitheater. */
    const amphitheatrePosition = new THREE.Vector3(49.5, 0, 16.5);
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

    // Seating
    /* @tweakable Number of seating rows. */
    const numRows = 12;
    /* @tweakable Base radius for the first row of seats. */
    const startRadius = 25;
    /* @tweakable Distance between each row of seats. */
    const rowSpacing = 3.5;
     /* @tweakable Height difference between each row. */
    const rowHeightStep = 0.8;

    for (let i = 0; i < numRows; i++) {
        const radius = startRadius + i * rowSpacing;
        const seatCount = Math.floor(radius * 0.8);
        const seatRow = createSeatRow(i, radius, seatCount, rowHeightStep);
        group.add(seatRow);
    }

    // Backdrop
    /* @tweakable The URL for the video to be displayed on the amphitheater screen. Must be a direct link to a video file (e.g., .mp4). */
    const videoSrc = 'https://cdn.pixabay.com/video/2023/07/25/174411-849537965_large.mp4';
    
    /* @tweakable The position of the backdrop behind the stage. */
    const backdropZOffset = 30;
    const wallHeight = 15; // from createBackdropWall
    const backdropPosition = new THREE.Vector3(0, stageDimensions.height + wallHeight/2, backdropZOffset);
    const backdropData = createBackdropWall(backdropPosition, videoSrc, listener);
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

    return group;
}