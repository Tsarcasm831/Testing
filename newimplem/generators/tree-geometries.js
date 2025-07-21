import * as THREE from 'three';

let palmTreeGeometry = null;
let aspenTreeGeometry = null;
let pineTreeGeometry = null;
let oakTreeGeometry = null;


export function createPalmTreeGeometry() {
    if (palmTreeGeometry) return palmTreeGeometry;

    // Trunk
    const trunkHeight = 10;
    const trunkRadius = 0.4;
    const trunkGeo = new THREE.CylinderGeometry(trunkRadius * 0.7, trunkRadius, trunkHeight, 8, 4);
    trunkGeo.translate(0, trunkHeight / 2, 0);
    
    // Bend the trunk
    const pos = trunkGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const bendFactor = Math.pow(y / trunkHeight, 2);
        pos.setX(i, pos.getX(i) + bendFactor * 2.0);
    }
    trunkGeo.computeVertexNormals();

    // Leaves
    const leafGeometries = [];
    const leafCount = 9;
    const leafLength = 6;
    const leafWidth = 2.5;
    
    for (let i = 0; i < leafCount; i++) {
        const leafGeo = new THREE.PlaneGeometry(leafWidth, leafLength, 1, 4);
        leafGeo.translate(0, leafLength / 2, 0); // anchor at base
        
        const angle = (i / leafCount) * Math.PI * 2 + (i % 2) * 0.5;
        const frondGeo = leafGeo.clone();
        
        // Bend the frond
        const leafPos = frondGeo.attributes.position;
        for(let j = 0; j < leafPos.count; j++) {
            const y = leafPos.getY(j);
            const bend = Math.pow(y / leafLength, 2) * -2.0;
            leafPos.setZ(j, leafPos.getZ(j) + bend);
        }

        frondGeo.rotateX(THREE.MathUtils.randFloat(0.6, 1.2)); // Angle down
        frondGeo.rotateY(angle);
        
        const bendOffset = new THREE.Vector3(Math.pow(trunkHeight/trunkHeight, 2) * 2.0, trunkHeight - 0.5, 0);
        frondGeo.translate(bendOffset.x, bendOffset.y, bendOffset.z);
        
        leafGeometries.push(frondGeo);
    }
    
    // Manual merge since BufferGeometryUtils is not available
    const positions = [];
    const uvs = [];
    const normals = [];
    for (const geo of leafGeometries) {
        geo.computeVertexNormals();
        positions.push(...geo.attributes.position.array);
        uvs.push(...geo.attributes.uv.array);
        normals.push(...geo.attributes.normal.array);
    }
    const mergedLeavesGeo = new THREE.BufferGeometry();
    mergedLeavesGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    mergedLeavesGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    mergedLeavesGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

    palmTreeGeometry = { trunk: trunkGeo, leaves: mergedLeavesGeo };
    return palmTreeGeometry;
}

export function createAspenTreeGeometry() {
    if (aspenTreeGeometry) return aspenTreeGeometry;

    // Trunk
    const trunkHeight = 12;
    const trunkRadius = 0.25;
    const trunkGeo = new THREE.CylinderGeometry(trunkRadius * 0.8, trunkRadius, trunkHeight, 8, 4);
    trunkGeo.translate(0, trunkHeight / 2, 0);
    trunkGeo.computeVertexNormals();

    // Leaves as simple clusters
    const leafGeometries = [];
    const leafClusterCount = 15;
    const leafSize = 4.0;

    for (let i = 0; i < leafClusterCount; i++) {
        const leafGeo = new THREE.PlaneGeometry(leafSize, leafSize);
        
        // Position clusters along the top part of the trunk
        const yOffset = trunkHeight * (0.6 + Math.random() * 0.4);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2.0;

        leafGeo.lookAt(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize());
        leafGeo.translate(
            Math.cos(angle) * radius,
            yOffset,
            Math.sin(angle) * radius
        );
        
        leafGeometries.push(leafGeo);
    }
    
    // Manual merge
    const positions = [];
    const uvs = [];
    const normals = [];
    for (const geo of leafGeometries) {
        geo.computeVertexNormals();
        positions.push(...geo.attributes.position.array);
        uvs.push(...geo.attributes.uv.array);
        normals.push(...geo.attributes.normal.array);
    }
    const mergedLeavesGeo = new THREE.BufferGeometry();
    mergedLeavesGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    mergedLeavesGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    mergedLeavesGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

    aspenTreeGeometry = { trunk: trunkGeo, leaves: mergedLeavesGeo };
    return aspenTreeGeometry;
}

export function createPineTreeGeometry() {
    if (pineTreeGeometry) return pineTreeGeometry;

    // Trunk
    const trunkHeight = 15;
    const trunkRadius = 0.35;
    const trunkGeo = new THREE.CylinderGeometry(trunkRadius * 0.7, trunkRadius, trunkHeight, 8, 4);
    trunkGeo.translate(0, trunkHeight / 2, 0);
    trunkGeo.computeVertexNormals();

    // Leaves as stacked discs/planes of needles
    const leafGeometries = [];
    const layerCount = 6;
    const baseRadius = 5;

    for (let i = 0; i < layerCount; i++) {
        const layerY = trunkHeight * (0.3 + (i / layerCount) * 0.7);
        // Gradually decrease radius, more sharply at the top
        const layerRadius = baseRadius * (1.0 - Math.pow(i / layerCount, 1.5) * 0.95);
        
        // Use PlaneGeometry so the texture can be mapped across the branch
        const leafGeo = new THREE.PlaneGeometry(layerRadius * 2, layerRadius * 2);
        leafGeo.lookAt(new THREE.Vector3(0, 1, 0.2)); // Slight downward droop
        leafGeo.translate(0, layerY, 0);

        leafGeometries.push(leafGeo);
    }
    
    // Manual merge
    const positions = [];
    const uvs = [];
    const normals = [];
    for (const geo of leafGeometries) {
        geo.computeVertexNormals();
        positions.push(...geo.attributes.position.array);
        uvs.push(...geo.attributes.uv.array);
        normals.push(...geo.attributes.normal.array);
    }
    const mergedLeavesGeo = new THREE.BufferGeometry();
    mergedLeavesGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    mergedLeavesGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    mergedLeavesGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

    pineTreeGeometry = { trunk: trunkGeo, leaves: mergedLeavesGeo };
    return pineTreeGeometry;
}

export function createOakTreeGeometry() {
    if (oakTreeGeometry) return oakTreeGeometry;

    // Trunk
    const trunkHeight = 8;
    const trunkRadius = 0.5;
    const trunkGeo = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 10, 3);
    trunkGeo.translate(0, trunkHeight / 2, 0);
    trunkGeo.computeVertexNormals();

    // Leaves as a large rounded canopy
    const leafGeometries = [];
    const leafClusterCount = 25;
    const canopyRadius = 5.0;
    const leafSize = 4.5;

    for (let i = 0; i < leafClusterCount; i++) {
        const leafGeo = new THREE.PlaneGeometry(leafSize, leafSize);
        
        // Position clusters in a sphere-like shape at the top of the trunk
        const phi = Math.acos(1 - 2 * Math.random());
        const theta = Math.random() * Math.PI * 2;
        
        const yOffset = trunkHeight * 0.9 + Math.sin(phi) * canopyRadius * 0.7;
        const xzRadius = Math.cos(phi) * canopyRadius;

        leafGeo.lookAt(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize());
        leafGeo.translate(
            Math.cos(theta) * xzRadius,
            yOffset,
            Math.sin(theta) * xzRadius
        );
        
        leafGeometries.push(leafGeo);
    }
    
    // Manual merge
    const positions = [];
    const uvs = [];
    const normals = [];
    for (const geo of leafGeometries) {
        geo.computeVertexNormals();
        positions.push(...geo.attributes.position.array);
        uvs.push(...geo.attributes.uv.array);
        normals.push(...geo.attributes.normal.array);
    }
    const mergedLeavesGeo = new THREE.BufferGeometry();
    mergedLeavesGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    mergedLeavesGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    mergedLeavesGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

    oakTreeGeometry = { trunk: trunkGeo, leaves: mergedLeavesGeo };
    return oakTreeGeometry;
}