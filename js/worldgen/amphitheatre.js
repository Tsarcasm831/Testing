import * as THREE from 'three';

/**
 * Creates an amphitheater with tiered seating and a central stage.
 * @param {THREE.Scene} scene - The main scene to add the amphitheater to.
 * @param {function} getHeight - A function to get the terrain height at a given x, z position.
 * @returns {THREE.Group} A group containing the entire amphitheater structure.
 */
export function createAmphitheatre(scene, getHeight) {
    /* @tweakable The position of the amphitheater. */
    const amphitheatrePosition = new THREE.Vector3(-20.5, 0, 90.5);

    const amphitheatreGroup = new THREE.Group();
    scene.add(amphitheatreGroup);
    amphitheatreGroup.position.copy(amphitheatrePosition);

    /* @tweakable The radius of the amphitheatre's flat ground area. */
    const groundRadius = 35;
    /* @tweakable The color of the amphitheatre's ground. */
    const groundColor = 0x5a5a5a;
    const groundHeightOffset = 0.1; // To prevent z-fighting with terrain
    const baseHeight = getHeight(amphitheatrePosition.x, amphitheatrePosition.z);

    const groundGeo = new THREE.CircleGeometry(groundRadius, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: groundColor, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = baseHeight + groundHeightOffset;
    ground.receiveShadow = true;
    amphitheatreGroup.add(ground);

    // Create Stage
    createStage(10, ground.position.y);

    // Create Seating
    createAllSeats(12, 15, 2.5, ground.position.y);

    // Create Entrance Pillars
    createEntrancePillars(groundRadius, ground.position.y);

    // Set userData for the entire group to help with collision detection
    amphitheatreGroup.userData.isStructure = true;

    function createEntrancePillars(radius, baseY) {
        /* @tweakable The color of the entrance pillars. */
        const pillarColor = 0x999999;
        /* @tweakable The height of the entrance pillars. */
        const pillarHeight = 10;
        /* @tweakable The radius of the entrance pillars. */
        const pillarRadius = 1;
        /* @tweakable The spacing between the two entrance pillars. */
        const pillarSpacing = 15;

        const pillarMat = new THREE.MeshStandardMaterial({ color: pillarColor, roughness: 0.6 });
        const pillarGeo = new THREE.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, 16);
        pillarGeo.translate(0, pillarHeight / 2, 0);

        const pillarLeft = new THREE.Mesh(pillarGeo, pillarMat);
        pillarLeft.position.set(-pillarSpacing / 2, baseY, radius - 2);
        pillarLeft.castShadow = true;
        pillarLeft.receiveShadow = true;
        pillarLeft.userData.isBarrier = true;

        const pillarRight = new THREE.Mesh(pillarGeo, pillarMat);
        pillarRight.position.set(pillarSpacing / 2, baseY, radius - 2);
        pillarRight.castShadow = true;
        pillarRight.receiveShadow = true;
        pillarRight.userData.isBarrier = true;

        amphitheatreGroup.add(pillarLeft, pillarRight);
    }

    function createStage(radius, baseY) {
        /* @tweakable The color of the stage. */
        const stageColor = 0x333333;
        /* @tweakable The height of the stage. A taller stage might require steps. */
        const stageHeight = 1.0;
        const stageGeo = new THREE.CylinderGeometry(radius, radius, stageHeight, 64);
        const stageMat = new THREE.MeshStandardMaterial({ color: stageColor });
        const stage = new THREE.Mesh(stageGeo, stageMat);
        stage.position.set(0, baseY + stageHeight / 2, 0);
        stage.castShadow = true;
        stage.receiveShadow = true;
        stage.userData.isBarrier = true;
        amphitheatreGroup.add(stage);

        /* @tweakable The color of the stage's backdrop. */
        const backdropColor = 0x222222;
        /* @tweakable The height of the stage's backdrop. */
        const backdropHeight = 8;
        const backdrop = new THREE.PlaneGeometry(radius * 2, backdropHeight);
        const backMat = new THREE.MeshStandardMaterial({ color: backdropColor, side: THREE.DoubleSide });
        const screen = new THREE.Mesh(backdrop, backMat);
        screen.position.set(0, baseY + backdropHeight / 2, -radius - 0.5);
        screen.castShadow = true;
        screen.receiveShadow = true;
        screen.userData.isBarrier = true;
        amphitheatreGroup.add(screen);

        /* @tweakable The color of the arch over the stage. */
        const archColor = 0x888888;
        const archPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-radius * 1.1, 0, 0),
            new THREE.Vector3(-radius * 0.5, backdropHeight * 1.2, 0),
            new THREE.Vector3(radius * 0.5, backdropHeight * 1.2, 0),
            new THREE.Vector3(radius * 1.1, 0, 0)
        ]);

        const archGeo = new THREE.TubeGeometry(archPath, 20, 0.5, 8, false);
        const archMat = new THREE.MeshStandardMaterial({ color: archColor });
        const arch = new THREE.Mesh(archGeo, archMat);
        arch.position.set(0, baseY, -radius - 1);
        arch.userData.isBarrier = true;
        amphitheatreGroup.add(arch);
    }

    function createSeat(x, y, z, rotationY) {
        /* @tweakable The color of the seats. */
        const seatColor = 0xaaaaaa;
        const seatMat = new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.7 });
        const seatGroup = new THREE.Group();

        /* @tweakable The dimensions of the seat base. */
        const seatBaseSize = { width: 1.2, height: 0.1, depth: 0.5 };
        const baseGeo = new THREE.BoxGeometry(seatBaseSize.width, seatBaseSize.height, seatBaseSize.depth);
        const base = new THREE.Mesh(baseGeo, seatMat);
        base.position.y = seatBaseSize.height / 2;
        seatGroup.add(base);

        /* @tweakable The dimensions of the seat backrest. */
        const seatBackSize = { width: 1.2, height: 0.6, depth: 0.1 };
        const backGeo = new THREE.BoxGeometry(seatBackSize.width, seatBackSize.height, seatBackSize.depth);
        const back = new THREE.Mesh(backGeo, seatMat);
        back.position.y = seatBaseSize.height + (seatBackSize.height / 2);
        back.position.z = -seatBaseSize.depth / 2 + seatBackSize.depth / 2;
        seatGroup.add(back);

        seatGroup.position.set(x, y, z);
        seatGroup.rotation.y = rotationY;

        // Set isBarrier on the group for collision detection
        seatGroup.userData.isBarrier = true;

        seatGroup.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        amphitheatreGroup.add(seatGroup);
        return seatGroup;
    }

    function createAllSeats(rowCount, seatsPerRow, rowSpacing, baseY) {
        /* @tweakable The number of rows of seats. */
        const seatRowCount = rowCount;
        /* @tweakable The number of seats per row. */
        const numSeatsPerRow = seatsPerRow;
        /* @tweakable The spacing between rows. */
        const seatRowSpacing = rowSpacing;
        /* @tweakable The starting radius for the first row of seats. */
        const startRadius = 12;
        /* @tweakable The height increase per row. */
        const rowHeightStep = 0.6;
        /* @tweakable The arc of the seating area in degrees. 180 is a semi-circle. */
        const seatingArcDegrees = 180;
        /* @tweakable The color of the seating area floor. */
        const floorColor = 0x6b6b6b;
        /* @tweakable The thickness of the floor under each row of seats. */
        const floorThickness = 0.1;

        const floorMat = new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.85 });

        for (let row = 0; row < seatRowCount; row++) {
            const radius = startRadius + row * seatRowSpacing;
            const y = baseY + row * rowHeightStep;
            const arc = THREE.MathUtils.degToRad(seatingArcDegrees);
            
            // Add flooring for the row
            const floorInnerRadius = radius - seatRowSpacing / 2;
            const floorOuterRadius = radius + seatRowSpacing / 2;
            const floorGeo = new THREE.RingGeometry(floorInnerRadius, floorOuterRadius, 64, 1, -arc / 2, arc);
            const floorMesh = new THREE.Mesh(floorGeo, floorMat);
            floorMesh.rotation.x = -Math.PI / 2;
            floorMesh.position.y = y - floorThickness / 2;
            floorMesh.receiveShadow = true;
            floorMesh.userData.isBarrier = true;
            amphitheatreGroup.add(floorMesh);

            for (let i = 0; i < numSeatsPerRow; i++) {
                const theta = (i / (numSeatsPerRow - 1)) * arc - arc / 2;
                const x = radius * Math.sin(theta);
                const z = radius * Math.cos(theta);
                createSeat(x, y, z, -theta + Math.PI);
            }
        }
    }

    return amphitheatreGroup;
}