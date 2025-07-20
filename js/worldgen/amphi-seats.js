import * as THREE from 'three';

/**
 * Creates and adds amphitheater seating to a group.
 * @param {THREE.Group} group The group to add seating to.
 * @param {THREE.Color | number} stoneColor The color of the seats.
 */
export function createAmphitheatreSeating(group, stoneColor) {
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
        seatRow.userData.isSeatRow = true;
        
        // Normalize angles to be in the [0, 2*PI] range for consistent collision checks.
        const normalizedStartAngle = startAngle < 0 ? startAngle + 2 * Math.PI : startAngle;
        const normalizedEndAngle = endAngle < 0 ? endAngle + 2 * Math.PI : endAngle;

        seatRow.userData.seatRowData = {
            innerRadius,
            outerRadius,
            startAngle: normalizedStartAngle,
            endAngle: normalizedEndAngle
        };
        group.add(seatRow);
    }
}