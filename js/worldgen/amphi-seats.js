import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

/**
 * Creates and adds amphitheater seating to a group.
 * @param {THREE.Group} group The group to add seating to.
 * @param {THREE.Color | number} stoneColor The color of the seats.
 */
/* @tweakable Set to true to enable collision for amphitheater seats. */
const SEAT_COLLISION_ENABLED = false;
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

export function createAmphitheatreSeating(group, stoneColor) {
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

    for (let i = 0; i < numRows; i++) {
        const innerRadius = startRadius + i * (rowDepth + radiusStep);
        const outerRadius = innerRadius + rowDepth;
        const y = i * rowHeight;
        
        const shape = new THREE.Shape();
        shape.moveTo(innerRadius * Math.cos(startAngle), innerRadius * Math.sin(startAngle));
        shape.absarc(0, 0, innerRadius, startAngle, endAngle, false);
        shape.lineTo(outerRadius * Math.cos(endAngle), outerRadius * Math.sin(endAngle));
        shape.absarc(0, 0, outerRadius, endAngle, startAngle, true);
        shape.lineTo(innerRadius * Math.cos(startAngle), innerRadius * Math.sin(startAngle));

        const extrudeSettings = {
            steps: 1,
            depth: rowHeight,
            bevelEnabled: false,
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // The geometry is extruded along Z, then rotated. So we translate Z before rotation.
        geometry.translate(0, 0, y); 
        geometry.rotateX(-Math.PI / 2);
        
        const seatRow = new THREE.Mesh(geometry, material);
        seatRow.castShadow = true;
        seatRow.receiveShadow = true;
        
        if (SEAT_COLLISION_ENABLED) {
            seatRow.userData.isSeatRow = true;
            seatRow.userData.seatRowData = {
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                startAngle: startAngle,
                endAngle: endAngle
            };
            /* @tweakable Set to true to allow players to step up onto seats without jumping. */
            seatRow.userData.isStair = true;
        }
        seatingGroup.add(seatRow);

        if (DEBUG_SEAT_COLLISION_BOX) {
            const wireframeGeometry = new THREE.WireframeGeometry(geometry);
            const line = new THREE.LineSegments(wireframeGeometry);
            line.material.color.set(DEBUG_SEAT_COLLISION_BOX_COLOR);
            line.material.depthTest = false;
            line.material.opacity = 0.5;
            line.material.transparent = true;
            line.userData.isDebugBorder = true;
            line.visible = false;
            seatingGroup.add(line);
        }
        
        // Add individual seats on top of the tier
        const seatRadius = innerRadius + rowDepth / 2;
        const circumferencePortion = angleRad * seatRadius;
        const totalSeatSpace = seatWidth + seatGap;
        const numSeats = Math.floor(circumferencePortion / totalSeatSpace);
        
        // Center the seats within the arc
        const totalAngleOfSeats = numSeats * totalSeatSpace / seatRadius;
        const startAngleForSeats = startAngle + (angleRad - totalAngleOfSeats) / 2;
        const angleStep = totalSeatSpace / seatRadius;

        for (let j = 0; j < numSeats; j++) {
            const seatAngle = startAngleForSeats + (j * angleStep);

            const seat = new THREE.Group();
            
            const x = seatRadius * Math.cos(seatAngle);
            const z = seatRadius * Math.sin(seatAngle);
            seat.position.set(x, y + rowHeight, z);

            // Calculate rotation for each seat to face the center of its curve
            const angleToCenter = Math.atan2(x, z);
            
            /* @tweakable An offset in degrees to adjust the final rotation of individual seats. Use this to fine-tune the direction they face. 0 should make them face the center of the amphitheater arc. */
            const seatRotationOffset = 180;
            seat.rotation.y = angleToCenter + THREE.MathUtils.degToRad(seatRotationOffset);
            
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
}