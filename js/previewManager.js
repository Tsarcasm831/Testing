import * as THREE from 'three';
import { CLUSTER_SIZE } from './worldgen/constants.js';

/* @tweakable Opacity of the preview object in build mode. */
const PREVIEW_OPACITY = 0.6;
/* @tweakable The size of the grid snap for object placement. */
const GRID_SNAP_SIZE = 1.0;

export class PreviewManager {
    constructor(scene, camera, buildMaterials, terrain) {
        this.scene = scene;
        this.camera = camera;
        this.buildMaterials = buildMaterials;
        this.terrain = terrain;

        this.previewMesh = null;
        this.currentMaterialIndex = 0;
        this.currentHeight = 0.5;

        this.shapes = [
            { geometry: new THREE.BoxGeometry(1, 1, 1), name: 'BoxGeometry' },
            { geometry: new THREE.SphereGeometry(0.5, 16, 16), name: 'SphereGeometry' },
            { geometry: new THREE.CylinderGeometry(0.5, 0.5, 1, 16), name: 'CylinderGeometry' },
            { geometry: new THREE.ConeGeometry(0.5, 1, 16), name: 'ConeGeometry' },
            { geometry: new THREE.TorusGeometry(0.5, 0.2, 16, 32), name: 'TorusGeometry' },
            { geometry: new THREE.ConeGeometry(0.5, 1, 4), name: 'Pyramid' }
        ];
        this.currentShapeIndex = 0;
        this.staticIntersectableObjects = [];

        this.raycaster = new THREE.Raycaster();
        this.mousePosition = new THREE.Vector2();

        this.createPreviewMesh();
    }

    rebuildIntersectionList() {
        this.staticIntersectableObjects = [];
        this.scene.traverse(child => {
            if (child.isMesh && (child.userData.isTerrain || (child.userData.isBarrier && !child.userData.isPlayer && !child.userData.isNpc))) {
                this.staticIntersectableObjects.push(child);
            }
        });
    }

    createPreviewMesh() {
        if (this.previewMesh) {
            this.scene.remove(this.previewMesh);
        }
        const geometry = this.shapes[this.currentShapeIndex].geometry.clone();
        const material = this.buildMaterials[this.currentMaterialIndex].clone();
        material.transparent = true;
        material.opacity = PREVIEW_OPACITY;

        this.previewMesh = new THREE.Mesh(geometry, material);
        this.previewMesh.castShadow = false;
        this.previewMesh.receiveShadow = false;
        this.previewMesh.userData.heightAdjusted = false;
        this.previewMesh.userData.shapeName = this.shapes[this.currentShapeIndex].name;
        this.scene.add(this.previewMesh);
    }

    updatePosition(mousePosition, buildObjects) {
        if (!this.previewMesh) return;

        this.mousePosition.copy(mousePosition);
        this.raycaster.setFromCamera(this.mousePosition, this.camera);
        const allIntersectable = [...this.staticIntersectableObjects, ...buildObjects];
        const intersects = this.raycaster.intersectObjects(allIntersectable, false);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object === this.previewMesh) {
                continue;
            }

            const point = intersects[i].point;
            const halfSize = CLUSTER_SIZE / 2;

            point.x = Math.round(point.x / GRID_SNAP_SIZE) * GRID_SNAP_SIZE;
            point.z = Math.round(point.z / GRID_SNAP_SIZE) * GRID_SNAP_SIZE;

            // Clamp position to world boundaries
            /* @tweakable The padding from the edge of the world where object placement is disallowed. */
            const buildBoundaryPadding = 1.0;
            point.x = Math.max(-halfSize + buildBoundaryPadding, Math.min(halfSize - buildBoundaryPadding, point.x));
            point.z = Math.max(-halfSize + buildBoundaryPadding, Math.min(halfSize - buildBoundaryPadding, point.z));

            if (!this.previewMesh.userData.heightAdjusted) {
                const terrainHeight = this.terrain ? this.terrain.userData.getHeight(point.x, point.z) : 0;
                point.y = terrainHeight + this.currentHeight;
                if (point.y < terrainHeight + 0.5) point.y = terrainHeight + 0.5;
            } else {
                this.previewMesh.position.x = point.x;
                this.previewMesh.position.z = point.z;
                return;
            }

            this.previewMesh.position.copy(point);
            break;
        }
    }

    changeShape() {
        if (!this.previewMesh) return;

        const oldPosition = this.previewMesh.position.clone();
        const oldRotation = this.previewMesh.rotation.clone();
        const oldScale = this.previewMesh.scale.clone();
        const oldHeightAdjusted = this.previewMesh.userData.heightAdjusted;

        this.scene.remove(this.previewMesh);

        this.currentShapeIndex = (this.currentShapeIndex + 1) % this.shapes.length;

        const geometry = this.shapes[this.currentShapeIndex].geometry.clone();
        const material = this.buildMaterials[this.currentMaterialIndex].clone();
        material.transparent = true;
        material.opacity = PREVIEW_OPACITY;
        this.previewMesh = new THREE.Mesh(geometry, material);

        this.previewMesh.position.copy(oldPosition);
        this.previewMesh.rotation.copy(oldRotation);
        this.previewMesh.scale.copy(oldScale);
        this.previewMesh.userData.heightAdjusted = oldHeightAdjusted;
        this.previewMesh.castShadow = false;
        this.previewMesh.receiveShadow = false;
        this.previewMesh.userData.shapeName = this.shapes[this.currentShapeIndex].name;
        this.scene.add(this.previewMesh);
    }

    changeMaterial() {
        if (!this.previewMesh) return;
        this.currentMaterialIndex = (this.currentMaterialIndex + 1) % this.buildMaterials.length;
        const material = this.buildMaterials[this.currentMaterialIndex].clone();
        material.transparent = true;
        material.opacity = PREVIEW_OPACITY;
        this.previewMesh.material = material;
    }

    changeSize() {
        if (!this.previewMesh) return;
        const scales = [
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(0.5, 0.5, 0.5),
            new THREE.Vector3(2, 2, 2),
            new THREE.Vector3(1, 2, 1),
            new THREE.Vector3(2, 1, 1),
            new THREE.Vector3(1, 1, 2)
        ];
        let nextScaleIndex = 0;
        for (let i = 0; i < scales.length; i++) {
            if (this.previewMesh.scale.equals(scales[i])) {
                nextScaleIndex = (i + 1) % scales.length;
                break;
            }
        }
        this.previewMesh.scale.copy(scales[nextScaleIndex]);
    }

    rotate() {
        if (!this.previewMesh) return;
        this.previewMesh.rotation.y += Math.PI / 2;
    }
    
    adjustHeight(delta) {
        if (!this.previewMesh) return;
        this.previewMesh.position.y += delta;
        const terrainHeight = this.terrain ? this.terrain.userData.getHeight(this.previewMesh.position.x, this.previewMesh.position.z) : 0;
        if (this.previewMesh.position.y < terrainHeight + 0.5) this.previewMesh.position.y = terrainHeight + 0.5;
        this.previewMesh.userData.heightAdjusted = true;
        return this.previewMesh.position.y;
    }

    setCurrentHeight(height) {
        this.currentHeight = height;
        if (this.previewMesh) {
            const terrainHeight = this.terrain ? this.terrain.userData.getHeight(this.previewMesh.position.x, this.previewMesh.position.z) : 0;
            this.previewMesh.position.y = terrainHeight + this.currentHeight;
            this.previewMesh.userData.heightAdjusted = false;
        }
    }

    getMesh() {
        return this.previewMesh;
    }

    show() {
        if (this.previewMesh) this.previewMesh.visible = true;
    }

    hide() {
        if (this.previewMesh) this.previewMesh.visible = false;
    }
    
    getCurrentMaterialIndex() {
        return this.currentMaterialIndex;
    }
}