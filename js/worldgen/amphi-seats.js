import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { createPlayerModel } from '../playerModel.js';
import { NPC } from '../npc/NPC.js';
import { presetCharacters } from '../characters/presets.js';
import { createSpectatorSpec } from '../characters/presets/spectator.js';

/**
 * Creates and adds amphitheater seating to a group.
 * @param {THREE.Group} group The group to add seating to.
 * @param {THREE.Color | number} stoneColor The color of the seats.
 */
/* @tweakable Set to true to enable collision for amphitheater seats. */
const SEAT_COLLISION_ENABLED = true;
/* @tweakable The number of segments to approximate the curve of each seat row. More segments are more accurate but less performant. */
const SEAT_ROW_SEGMENTS = 20;
/* @tweakable Set to true to spawn crowd NPCs in the amphitheater seats. NOTE: This may contribute to loading timeouts on some platforms. */
const SPAWN_CROWD_NPCS = true;
/* @tweakable Set to true to use simplified, low-poly models for crowd NPCs to improve performance. */
const USE_SPECTATOR_MODELS = true;
/* @tweakable Set to true to enable collision for the foundation under the seats. */
const SEAT_FOUNDATION_COLLISION_ENABLED = false;
/* @tweakable Set to true to show a visible outline box for debugging seat row collision. */
const DEBUG_SEAT_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for seat rows. */
const DEBUG_SEAT_COLLISION_BOX_COLOR = 0xffff00;
/* @tweakable Set to true to show a visible outline box for debugging the seat foundation collision. */
const DEBUG_FOUNDATION_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the seat foundation. */
const DEBUG_FOUNDATION_COLLISION_BOX_COLOR = 0xff00ff;
/* @tweakable Set to true to show a visible outline box for debugging individual seats. */
const DEBUG_INDIVIDUAL_SEAT_BOX = true;
/* @tweakable The color of the debug collision box for individual seats. */
const DEBUG_INDIVIDUAL_SEAT_BOX_COLOR = 0xffa500;

/* @tweakable Vertical offset for simplified spectator NPCs to position them in a sitting posture on seats. */
const spectatorNpcVerticalOffset = -0.4;
/* @tweakable Vertical offset for full-detail crowd NPCs to position them on seats. May require adjustment if they appear to float or sink. */
const fullNpcVerticalOffset = 0;

/**
 * Creates stairs leading up to the first row of amphitheater seats.
 * @param {THREE.Group} group The group to add the stairs to.
 * @param {object} options Options for stairs creation.
 * @param {number} options.startRadius The starting radius of the seats.
 * @param {number} options.rowHeight The height of one seating tier.
 * @param {THREE.Material} options.material The material for the stairs.
 */
/* @tweakable Set to true to add stairs leading to the amphitheater seats. */
const ENABLE_SEATING_STAIRS = true;
/* @tweakable Set to true to enable collision on the amphitheater stairs. */
const SEATING_STAIRS_COLLISION_ENABLED = true;
function createStairsToSeats(group, options) {
    if (!ENABLE_SEATING_STAIRS) return;

    const { startRadius, rowHeight, material } = options;
    const stairsGroup = new THREE.Group();

    /* @tweakable The number of steps for the amphitheater seating stairs. */
    const stairCount = 10;
    /* @tweakable The width of the amphitheater seating stairs. */
    const stairWidth = 8;
    /* @tweakable The total depth of the amphitheater seating staircase. */
    const totalStairDepth = 8;
    
    const stairHeight = rowHeight / stairCount;
    const stairDepth = totalStairDepth / stairCount;

    for (let i = 0; i < stairCount; i++) {
        const stepGeo = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
        const step = new THREE.Mesh(stepGeo, material);
        step.position.set(
            0,
            i * stairHeight + stairHeight / 2,
            -startRadius + totalStairDepth / 2 - i * stairDepth - stairDepth / 2
        );

        step.castShadow = true;
        step.receiveShadow = true;
        step.userData.isBarrier = SEATING_STAIRS_COLLISION_ENABLED;
        step.userData.isStair = SEATING_STAIRS_COLLISION_ENABLED;
        stairsGroup.add(step);
    }

    group.add(stairsGroup);
}

function spawnCrowdNPCs(group, presets, transforms, npcManager, terrain, seatBaseHeight) {
    // Shuffle transforms for random seating
    for (let i = transforms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [transforms[i], transforms[j]] = [transforms[j], transforms[i]];
    }

    const numToSpawn = Math.min(presets.length, transforms.length);

    for (let i = 0; i < numToSpawn; i++) {
        const preset = presets[i];
        const transform = transforms[i];

        const specToUse = USE_SPECTATOR_MODELS && preset.spectatorSpec ? preset.spectatorSpec : preset.spec;
        const model = createPlayerModel(THREE, preset.name, specToUse);
        
        model.position.copy(transform.position);
        model.rotation.copy(transform.rotation);
        
        // Adjust position to be on top of the seat.
        const verticalOffset = USE_SPECTATOR_MODELS ? spectatorNpcVerticalOffset : fullNpcVerticalOffset;
        model.position.y += seatBaseHeight + verticalOffset;
        
        model.userData.isNpc = true;
        model.name = preset.name;
        group.add(model);

        const npc = new NPC(model, preset.id, 'amphitheatre_crowd', false, model.position.clone(), terrain);
        
        // Override update to make them stationary
        npc.update = () => {
             // The base NPC update handles animation, we just need to prevent movement
             if (model.userData.isAnimatedGLB && model.userData.mixer) {
                const delta = (performance.now() - (model.userData.lastMixerUpdate || performance.now())) / 1000;
                model.userData.mixer.update(delta);
                model.userData.lastMixerUpdate = performance.now();
            }
        };
        npcManager.addNpc(npc);
    }
}

export function createAmphitheatreSeating(group, stoneColor, npcManager, terrain) {
    /* @tweakable The rotation of the amphitheater seats in degrees. */
    const seatingRotation = 90;
    const seatingGroup = new THREE.Group();
    seatingGroup.rotation.y = THREE.MathUtils.degToRad(seatingRotation);
    group.add(seatingGroup);

    /* @tweakable The number of seating rows. */
    const numRows = 8;
    /* @tweakable The height of each seating row. */
    const rowHeight = 0.6;
    /* @tweakable The depth of each seating row. */
    const rowDepth = 1.2;
    /* @tweakable The starting radius of the first seating row. */
    const startRadius = 20;
    /* @tweakable The gap between seating rows. */
    const radiusStep = 0.5;
    /* @tweakable The angular size of the seating area in degrees. */
    const angle = 160;
    
    const angleRad = THREE.MathUtils.degToRad(angle);
    const startAngle = -angleRad / 2;
    const endAngle = angleRad / 2;
    
    const material = new THREE.MeshStandardMaterial({ color: stoneColor, roughness: 0.85, metalness: 0.1 });

    /* @tweakable The thickness of the foundation under the amphitheater seats. A larger value helps prevent it from appearing to float on uneven terrain. */
    const foundationThickness = 10.0;
    /* @tweakable The color of the foundation under the amphitheater seats. */
    const foundationColor = 0x666666;
    const foundationMaterial = new THREE.MeshStandardMaterial({ color: foundationColor, roughness: 0.9, metalness: 0.1 });
    
    const firstRowInnerRadius = startRadius;
    const lastRowOuterRadius = startRadius + numRows * (rowDepth + radiusStep) - radiusStep;

    const foundationShape = new THREE.Shape();
    foundationShape.moveTo(firstRowInnerRadius * Math.cos(startAngle), firstRowInnerRadius * Math.sin(startAngle));
    foundationShape.absarc(0, 0, firstRowInnerRadius, startAngle, endAngle, false);
    foundationShape.lineTo(lastRowOuterRadius * Math.cos(endAngle), lastRowOuterRadius * Math.sin(endAngle));
    foundationShape.absarc(0, 0, lastRowOuterRadius, endAngle, startAngle, true);
    foundationShape.lineTo(firstRowInnerRadius * Math.cos(startAngle), firstRowInnerRadius * Math.sin(startAngle));

    const foundationExtrudeSettings = {
        steps: 1,
        depth: foundationThickness,
        bevelEnabled: false,
    };

    const foundationGeometry = new THREE.ExtrudeGeometry(foundationShape, foundationExtrudeSettings);
    foundationGeometry.translate(0, 0, -foundationThickness); // Extrude downwards from y=0
    foundationGeometry.rotateX(-Math.PI / 2);

    const foundationMesh = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundationMesh.castShadow = true;
    foundationMesh.receiveShadow = true;
    if (SEAT_FOUNDATION_COLLISION_ENABLED) {
        foundationMesh.userData.isBarrier = true;
    }
    seatingGroup.add(foundationMesh);

    if (DEBUG_FOUNDATION_COLLISION_BOX) {
        const wireframeGeometry = new THREE.WireframeGeometry(foundationGeometry);
        const line = new THREE.LineSegments(wireframeGeometry);
        line.material.color.set(DEBUG_FOUNDATION_COLLISION_BOX_COLOR);
        line.material.depthTest = false;
        line.material.opacity = 0.5;
        line.material.transparent = true;
        line.userData.isDebugBorder = true;
        line.visible = false;
        seatingGroup.add(line);
    }

    /* @tweakable The width of an individual seat. */
    const seatWidth = 0.8;
    /* @tweakable The depth of an individual seat base. */
    const seatDepth = 0.5;
    /* @tweakable The height/thickness of the seat base. */
    const seatBaseHeight = 0.1;
    /* @tweakable The height of the seat backrest. */
    const backrestHeight = 0.7;
    /* @tweakable The thickness of the seat backrest. */
    const backrestThickness = 0.08;
    /* @tweakable The gap between individual seats. */
    const seatGap = 0.15;
    /* @tweakable The color of the individual seats (e.g., a wood color). */
    const seatColor = 0x5a4a3a;

    const seatMaterial = new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.8, metalness: 0.1 });
    const seatBaseGeom = new THREE.BoxGeometry(seatWidth, seatBaseHeight, seatDepth);
    const seatBackGeom = new THREE.BoxGeometry(seatWidth, backrestHeight, backrestThickness);

    /* @tweakable The target point for all seats to face. */
    const targetPoint = new THREE.Vector3(55.625, 0, -63.125); // Corresponds to grid IK200

    const seatTransforms = [];

    for (let i = 0; i < numRows; i++) {
        const innerRadius = startRadius + i * (rowDepth + radiusStep);
        const y = i * rowHeight;
        
        // Create a series of box segments to approximate the curved seating row for collision
        const midRadius = innerRadius + rowDepth / 2;
        const segmentAngleStep = angleRad / SEAT_ROW_SEGMENTS;
        const segmentWidth = segmentAngleStep * midRadius; // Arc length for a segment

        for (let j = 0; j < SEAT_ROW_SEGMENTS; j++) {
            const currentAngle = startAngle + (j + 0.5) * segmentAngleStep;
            
            const x = midRadius * Math.cos(currentAngle);
            const z = midRadius * Math.sin(currentAngle);

            const segmentGeo = new THREE.BoxGeometry(segmentWidth, rowHeight, rowDepth);
            const segmentMesh = new THREE.Mesh(segmentGeo, material);

            segmentMesh.position.set(x, y + rowHeight / 2, z);
            segmentMesh.lookAt(0, y + rowHeight / 2, 0); // Orient segment along the curve

            segmentMesh.castShadow = true;
            segmentMesh.receiveShadow = true;

            if (SEAT_COLLISION_ENABLED) {
                segmentMesh.userData.isBarrier = true;
                segmentMesh.userData.isStair = true;
            }
            seatingGroup.add(segmentMesh);

            if (DEBUG_SEAT_COLLISION_BOX) {
                const segmentHelper = new THREE.BoxHelper(segmentMesh, DEBUG_SEAT_COLLISION_BOX_COLOR);
                segmentHelper.userData.isDebugBorder = true;
                segmentHelper.visible = false;
                seatingGroup.add(segmentHelper);
            }
        }
        
        // Add individual seats on top of the tier
        const seatRadius = innerRadius + rowDepth / 2;
        const circumferencePortion = angleRad * seatRadius;
        const totalSeatSpace = seatWidth + seatGap;
        const numSeats = Math.floor(circumferencePortion / totalSeatSpace);
        
        // Center the seats within the arc
        const totalAngleOfSeats = numSeats * totalSeatSpace / seatRadius;
        const startAngleForSeats = startAngle + (angleRad - totalAngleOfSeats) / 2;
        const seatAngleStep = totalSeatSpace / seatRadius;

        for (let j = 0; j < numSeats; j++) {
            const seatAngle = startAngleForSeats + (j * seatAngleStep);

            const seat = new THREE.Group();
            
            const x = seatRadius * Math.cos(seatAngle);
            const z = seatRadius * Math.sin(seatAngle);
            seat.position.set(x, y + rowHeight, z);

            // Calculate rotation for each seat to face the center of its curve
            const angleToCenter = Math.atan2(x, z);
            
            /* @tweakable An offset in degrees to adjust the final rotation of individual seats. Use this to fine-tune the direction they face. 0 should make them face the center of the amphitheater arc. */
            const seatRotationOffset = 180;
            seat.rotation.y = angleToCenter + THREE.MathUtils.degToRad(seatRotationOffset);
            
            seatTransforms.push({ position: seat.position.clone(), rotation: seat.rotation.clone() });

            const seatBase = new THREE.Mesh(seatBaseGeom, seatMaterial);
            seatBase.position.y = seatBaseHeight / 2;
            seatBase.castShadow = true;
            seat.add(seatBase);
            if (DEBUG_INDIVIDUAL_SEAT_BOX) {
                const seatBaseHelper = new THREE.BoxHelper(seatBase, DEBUG_INDIVIDUAL_SEAT_BOX_COLOR);
                seatBaseHelper.userData.isDebugBorder = true;
                seatBaseHelper.visible = false;
                seat.add(seatBaseHelper);
            }

            const seatBack = new THREE.Mesh(seatBackGeom, seatMaterial);
            seatBack.position.y = backrestHeight / 2;
            seatBack.position.z = -seatDepth / 2 + backrestThickness / 2;
            seatBack.castShadow = true;
            seat.add(seatBack);
            if (DEBUG_INDIVIDUAL_SEAT_BOX) {
                const seatBackHelper = new THREE.BoxHelper(seatBack, DEBUG_INDIVIDUAL_SEAT_BOX_COLOR);
                seatBackHelper.userData.isDebugBorder = true;
                seatBackHelper.visible = false;
                seat.add(seatBackHelper);
            }
            
            seatingGroup.add(seat);

            /* @tweakable Set to true to enable unique labels on each seatback, visible with the grid. */
            const enableSeatLabels = true;
            if (enableSeatLabels) {
                const labelDiv = document.createElement('div');
                labelDiv.className = 'seat-label';
                labelDiv.textContent = `R${i + 1}-S${j + 1}`;
                
                const seatLabel = new CSS2DObject(labelDiv);
                seatLabel.userData.isSeatLabel = true;
                seatLabel.visible = false; // Initially hidden, toggled by GridManager

                const labelPosition = seatBack.position.clone();
                /* @tweakable Vertical offset of the seat label from the top of the seatback. */
                const seatLabelVerticalOffset = 0.1;
                labelPosition.y += backrestHeight / 2 + seatLabelVerticalOffset;
                seatLabel.position.copy(labelPosition);

                seat.add(seatLabel);
            }
        }
    }

    if (SPAWN_CROWD_NPCS && npcManager && terrain) {
        /* @tweakable The types of crowd NPCs to spawn, one of each will be chosen randomly. */
        const crowdTypesToSpawn = ['bot', 'male', 'female', 'alien'];
        const allCrowdPresets = presetCharacters.filter(p => p.id.startsWith('crowd_'));
        
        const presetsToSpawn = [];
        crowdTypesToSpawn.forEach(type => {
            const presetsOfType = allCrowdPresets.filter(p => p.id.startsWith(`crowd_${type}_`));
            if (presetsOfType.length > 0) {
                const chosenPreset = presetsOfType[Math.floor(Math.random() * presetsOfType.length)];
                presetsToSpawn.push(chosenPreset);
            }
        });

        spawnCrowdNPCs(seatingGroup, presetsToSpawn, seatTransforms, npcManager, terrain, seatBaseHeight);
    }

    createStairsToSeats(seatingGroup, { startRadius, rowHeight, material });
}