import * as THREE from 'three';

/* @tweakable Set to false to disable the video backdrop, which may prevent console errors from ad-blockers. */
const enableVideoBackdrop = true;
/* @tweakable Set to true to show a visible outline box for debugging the backdrop wall collision. */
const DEBUG_BACKDROP_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the backdrop wall. */
const DEBUG_BACKDROP_COLLISION_BOX_COLOR = 0xffff00;

export const BACKDROP_WALL_HEIGHT = 15;

export function createBackdropWall(position, videoTexture) {
    const wallGroup = new THREE.Group();
    /* @tweakable Width of the backdrop wall */
    const backdropWidth = 40;
    const wallThickness = 0.5;

    // Right side (YouTube video or static color if disabled)
    if (enableVideoBackdrop && videoTexture) {
        /* @tweakable The side of the video screen material to render. Use THREE.FrontSide, THREE.BackSide, or THREE.DoubleSide. */
        const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });

        const screenGeometry = new THREE.PlaneGeometry(backdropWidth, BACKDROP_WALL_HEIGHT);
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
    const wallGeometry = new THREE.BoxGeometry(backdropWidth, BACKDROP_WALL_HEIGHT, wallThickness);
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
