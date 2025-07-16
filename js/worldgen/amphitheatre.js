import * as THREE from 'three';

/* =====================
   GENERAL TWEAKABLES
   ===================== */
/* @tweakable The color of the stone used for the amphitheater seats and structure. */
const stoneColor = 0x888888;
/* @tweakable The color of the stage platform. */
const stageColor = 0x4a2a0a;
/* @tweakable Set to false to disable the video backdrop, which may prevent console errors from ad-blockers. */
const enableVideoBackdrop = true;

/* =====================
   MICROPHONE STAND
   ===================== */
function createMicrophoneStand() {
    const standGroup = new THREE.Group();

    /* @tweakable The color of the microphone stand. */
    const standColor = 0x333333;
    /* @tweakable The color of the microphone head. */
    const micColor = 0x111111;

    const standMaterial = new THREE.MeshStandardMaterial({ color: standColor, roughness: 0.4, metalness: 0.8 });
    const micMaterial = new THREE.MeshStandardMaterial({ color: micColor, roughness: 0.6, metalness: 0.2 });

    // Base
    const baseRadius = 0.3;
    const baseHeight = 0.05;
    const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 16);
    const base = new THREE.Mesh(baseGeometry, standMaterial);
    base.position.y = baseHeight / 2;
    standGroup.add(base);

    // Pole
    const poleHeight = 1.5;
    const poleRadius = 0.02;
    const poleGeometry = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 8);
    const pole = new THREE.Mesh(poleGeometry, standMaterial);
    pole.position.y = baseHeight + poleHeight / 2;
    standGroup.add(pole);

    // Mic head
    const micHeadRadius = 0.08;
    const micHeadGeometry = new THREE.SphereGeometry(micHeadRadius, 16, 16);
    const micHead = new THREE.Mesh(micHeadGeometry, micMaterial);
    micHead.position.y = baseHeight + poleHeight + micHeadRadius * 0.8;
    standGroup.add(micHead);

    standGroup.traverse(child => { if (child.isMesh) child.castShadow = true; });
    return standGroup;
}

/* =====================
   STAGE
   ===================== */
function createStage(dimensions) {
    const stageGroup = new THREE.Group();
    const stageMaterial = new THREE.MeshStandardMaterial({ color: stageColor, roughness: 0.8, metalness: 0.1 });

    // Platform
    const stageGeometry = new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth);
    const stage = new THREE.Mesh(stageGeometry, stageMaterial);
    stage.position.y = dimensions.height / 2;
    stage.castShadow = true;
    stage.receiveShadow = true;
    stage.userData.isBlock = true;
    stageGroup.add(stage);

    // Central Stairs
    const stairRotationY = 0;
    const stairsGroup = new THREE.Group();
    stairsGroup.rotation.y = THREE.MathUtils.degToRad(stairRotationY);
    stageGroup.add(stairsGroup);

    const stairCount = 4;
    const stairHeight = dimensions.height / stairCount;
    const stairDepth = 0.5;
    const stairStartZ = -dimensions.depth / 2 - stairDepth / 2;

    for (let i = 0; i < stairCount; i++) {
        const stairWidth = dimensions.width * (0.4 - i * 0.05);
        const stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
        const stair = new THREE.Mesh(stairGeometry, stageMaterial);
        stair.position.set(0, i * stairHeight + stairHeight / 2, stairStartZ - (stairCount - 1 - i) * stairDepth);
        stair.castShadow = true;
        stair.receiveShadow = true;
        stair.userData.isBlock = true;
        stair.userData.isStair = true;
        stairsGroup.add(stair);
    }

    return stageGroup;
}

/* =====================
   SEATING ROWS (NEW)
   ===================== */
const tierThickness = 0.3;
const tierDepth = 1.6;
const benchWidth = 1.2;
const benchDepth = 0.5;
const benchHeight = 0.6;

function createSeatRow(rowIndex, innerRadius, seatCount, rowHeightStep) {
    const rowGroup = new THREE.Group();
    const seatingMaterial = new THREE.MeshStandardMaterial({ color: stoneColor, roughness: 0.9, metalness: 0.05 });

    const outerRadius = innerRadius + tierDepth;
    const yBase = rowIndex * rowHeightStep;

    const platformShape = new THREE.Shape();
    platformShape.absarc(0, 0, innerRadius, 0, Math.PI, false);
    platformShape.absarc(0, 0, outerRadius, Math.PI, 0, true);
    platformShape.closePath();

    const extrudeSettings = { depth: tierThickness, bevelEnabled: false, steps: 1 };
    const platformGeo = new THREE.ExtrudeGeometry(platformShape, extrudeSettings);
    const platformMesh = new THREE.Mesh(platformGeo, seatingMaterial);
    platformMesh.rotation.x = -Math.PI / 2;
    platformMesh.position.y = yBase;
    platformMesh.castShadow = true;
    platformMesh.receiveShadow = true;
    platformMesh.userData.isBlock = true;
    rowGroup.add(platformMesh);

    platformMesh.userData.isSeatRow = true;
    platformMesh.userData.seatRowData = {
        innerRadius,
        outerRadius,
        height: tierThickness,
        y: yBase
    };

    const benchGeometry = new THREE.BoxGeometry(benchWidth, benchHeight, benchDepth);
    for (let i = 0; i < seatCount; i++) {
        const angle = Math.PI * ((i + 0.5) / seatCount);
        const radiusForBench = innerRadius + tierDepth / 2;
        const x = radiusForBench * Math.cos(angle);
        const z = radiusForBench * Math.sin(angle);
        const bench = new THREE.Mesh(benchGeometry, seatingMaterial);
        bench.position.set(x, yBase + tierThickness + benchHeight / 2, z);
        bench.rotation.y = -angle + Math.PI / 2;
        bench.castShadow = true;
        bench.receiveShadow = true;
        bench.userData.isBlock = true;
        rowGroup.add(bench);
    }

    return rowGroup;
}

/* =====================
   BACKDROP WALL (unchanged)
   ===================== */
function createBackdropWall(position, videoSrc, listener) {
    const wallGroup = new THREE.Group();

    const wallHeight = 15;
    const backdropWidth = 40;
    const wallThickness = 0.5;

    if (enableVideoBackdrop && videoSrc) {
        const video = document.createElement('video');
        video.src = videoSrc;
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.playsInline = true;

        if (listener) {
            video.muted = true;
            const sound = new THREE.PositionalAudio(listener);
            sound.setMediaElementSource(video);
            sound.setRefDistance(20);
            sound.setRolloffFactor(1);
            sound.setVolume(0.5);
            wallGroup.add(sound);
        } else {
            video.muted = true;
        }

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.body.addEventListener('click', () => { if (video.paused) video.play(); }, { once: true });
            });
        }

        const texture = new THREE.VideoTexture(video);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
        const geometry = new THREE.PlaneGeometry(backdropWidth, wallHeight);
        const videoMesh = new THREE.Mesh(geometry, material);
        videoMesh.position.set(0, 0, wallThickness / 2 + 0.01);
        videoMesh.rotation.y = Math.PI;
        wallGroup.add(videoMesh);
    }

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.2 });
    const wallGeometry = new THREE.BoxGeometry(backdropWidth, wallHeight, wallThickness);
    const backingWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backingWall.castShadow = true;
    backingWall.receiveShadow = true;
    wallGroup.add(backingWall);

    wallGroup.position.copy(position);
    return { wall: wallGroup };
}

/* =====================
   MAIN CONSTRUCTION API
   ===================== */
export function createAmphitheatre(scene, getHeight, listener) {
    const amphitheatrePosition = new THREE.Vector3(49.5, 0, 16.5);
    amphitheatrePosition.y = getHeight(amphitheatrePosition.x, amphitheatrePosition.z);

    const group = new THREE.Group();
    group.name = 'amphitheatre';
    group.position.copy(amphitheatrePosition);
    scene.add(group);

    const stageDimensions = { width: 20, height: 1.5, depth: 15 };
    const stage = createStage(stageDimensions);
    stage.position.z = 10;
    group.add(stage);

    const micStand = createMicrophoneStand();
    micStand.position.set(0, stageDimensions.height, 2);
    stage.add(micStand);

    const numRows = 12;
    const startRadius = 25;
    const rowSpacing = 3.5;
    const rowHeightStep = 0.8;

    for (let i = 0; i < numRows; i++) {
        const innerRadius = startRadius + i * rowSpacing;
        const arcLength = Math.PI * innerRadius;
        const seatCount = Math.max(6, Math.floor(arcLength / (benchWidth * 1.1)));
        const seatRowGroup = createSeatRow(i, innerRadius, seatCount, rowHeightStep);
        group.add(seatRowGroup);
    }

    const videoSrc = 'https://cdn.pixabay.com/video/2023/07/25/174411-849537965_large.mp4';
    const backdropZOffset = 30;
    const wallHeight = 15;
    const backdropPosition = new THREE.Vector3(0, stageDimensions.height + wallHeight / 2, backdropZOffset);
    const backdropData = createBackdropWall(backdropPosition, videoSrc, listener);
    group.add(backdropData.wall);

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
