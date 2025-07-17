import * as THREE from 'three';

const stoneColor = 0x888888;
const seatDepth = 1.5;
const seatRoughness = 0.9;
const seatMetalness = 0.05;

export function createSeatRow(rowIndex, radius, seatCount, rowHeight) {
    const rowGroup = new THREE.Group();
    
    /* @tweakable The starting angle for the amphitheater seats, in radians. Math.PI is the default for a backward-facing amphitheater. 0 would make it forward-facing. */
    const angleOffset = 0;
    const seatMaterial = new THREE.MeshStandardMaterial({ color: stoneColor, roughness: seatRoughness, metalness: seatMetalness });

    for (let i = 0; i < seatCount; i++) {
        const angle = angleOffset + Math.PI * (i / (seatCount - 1));

        const y = rowIndex * rowHeight;

        const innerRadius = radius - seatDepth / 2;
        const outerRadius = radius + seatDepth / 2;

        const baseShape = new THREE.Shape();
        const startAngle = angle - (Math.PI / seatCount) / 2;
        const endAngle = angle + (Math.PI / seatCount) / 2;
        baseShape.absarc(0, 0, innerRadius, startAngle, endAngle, false);
        baseShape.absarc(0, 0, outerRadius, endAngle, startAngle, true);
        baseShape.closePath();
        
        const extrudeSettings = {
            steps: 1,
            depth: rowHeight,
            bevelEnabled: false,
        };
        const geometry = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
        geometry.computeBoundingSphere();
        geometry.computeBoundingBox();
        const baseMesh = new THREE.Mesh(geometry, seatMaterial);
        baseMesh.rotation.x = -Math.PI / 2;
        baseMesh.position.y = y;
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        baseMesh.userData.isBlock = true;
        baseMesh.userData.isStair = true;
        baseMesh.userData.isSeatRow = true;
        baseMesh.userData.seatRowData = {
            innerRadius: innerRadius,
            outerRadius: outerRadius,
            height: rowHeight,
            y,
            startAngle,
            endAngle,
        };

        rowGroup.add(baseMesh);
    }
    
    return rowGroup;
}