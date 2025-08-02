import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { presetCharacters } from '../characters/presets.js';

import {
    SEAT_COLLISION_ENABLED,
    SPAWN_CROWD_NPCS,
    SEAT_ROW_SEGMENTS,
    SEAT_FOUNDATION_COLLISION_ENABLED,
    DEBUG_SEAT_COLLISION_BOX,
    DEBUG_SEAT_COLLISION_BOX_COLOR,
    DEBUG_FOUNDATION_COLLISION_BOX,
    DEBUG_FOUNDATION_COLLISION_BOX_COLOR,
    DEBUG_INDIVIDUAL_SEAT_BOX,
    DEBUG_INDIVIDUAL_SEAT_BOX_COLOR
} from "./amphi-seat-config.js";
import { createStairsToSeats } from "./amphi-seat-stairs.js";
import { spawnCrowdNPCs } from "./amphi-seat-npcs.js";
/**
 * Creates and adds amphitheater seating to a group.
 * @param {THREE.Group} group The group to add seating to.
 * @param {THREE.Color | number} stoneColor The color of the seats.
 */

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
    const interactableSeatBases = [];

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
                /* @tweakable Marking the seat rows as isStair allows players to walk up them without jumping. Adjust STEP_HEIGHT in collisionManager.js if players get stuck. */
                segmentMesh.userData.isStair = true;
                /* @tweakable This custom flag helps the collision manager identify these meshes and use the specialized seat collision logic. */
                segmentMesh.userData.isSeatRow = true;
                /*
                 * Attach the collision parameters for this seat row segment so
                 * the CollisionManager can perform radial collision checks.
                 */
                segmentMesh.userData.seatRowData = {
                    innerRadius: innerRadius,
                    outerRadius: innerRadius + rowDepth,
                    startAngle: startAngle + j * segmentAngleStep,
                    endAngle: startAngle + (j + 1) * segmentAngleStep,
                };
            }
            seatingGroup.add(segmentMesh);

            if (DEBUG_SEAT_COLLISION_BOX) {
                const wireframeGeo = new THREE.WireframeGeometry(segmentMesh.geometry);
                const line = new THREE.LineSegments(wireframeGeo);
                line.material.color.set(DEBUG_SEAT_COLLISION_BOX_COLOR);
                line.material.depthTest = false;
                /* @tweakable The opacity of the seat row debug wireframe. */
                line.material.opacity = 0.75;
                line.material.transparent = true;
                line.position.copy(segmentMesh.position);
                line.rotation.copy(segmentMesh.rotation);
                line.userData.isDebugBorder = true;
                line.visible = false;
                seatingGroup.add(line);
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
            if (SEAT_COLLISION_ENABLED) {
                seatBase.userData.isBarrier = true;
                /*
                 * Marking seat bases as stairs allows players to smoothly step
                 * onto them, similar to the stage platform.
                 */
                seatBase.userData.isStair = true;
            }
            seat.add(seatBase);

            /* @tweakable A flag to make seat bases interactable. */
            const isSeatInteractable = true;
            if(isSeatInteractable) {
                seatBase.userData.isInteractable = true;
                seatBase.userData.interactionType = 'seat';
                seatBase.userData.seatLabel = `R${i + 1}-S${j + 1}`;
                /* @tweakable The prompt text shown when near an interactable seat. */
                seatBase.userData.interactionPrompt = 'Press F to view coordinates';
                interactableSeatBases.push(seatBase);
            }

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

                /* @tweakable Set to true to store seat coordinates in a hidden element for later use. */
                const storeSeatCoordinates = true;
                if (storeSeatCoordinates) {
                    const coordsElement = document.createElement('div');
                    coordsElement.className = 'seat-coordinates';
                    coordsElement.style.display = 'none'; // Not visible to user
                    /* @tweakable Precision for stored seat coordinates. */
                    const coordPrecision = 2;
                    coordsElement.textContent = `X:${seat.position.x.toFixed(coordPrecision)},Y:${seat.position.y.toFixed(coordPrecision)},Z:${seat.position.z.toFixed(coordPrecision)}`;
                    labelDiv.appendChild(coordsElement);
                }
                
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
    return interactableSeatBases;
}