import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const PLAYER_HEIGHT = 2.8;
const PLAYER_RADIUS = 0.5;

export class OtherPlayer {
    constructor(peerInfo, scene) {
        this.peerInfo = peerInfo;
        this.scene = scene;

        this.targetPosition = new THREE.Vector3();
        this.targetQuaternion = new THREE.Quaternion();

        this.group = new THREE.Group();
        this.scene.add(this.group);

        // Create player model (capsule)
        const geometry = new THREE.CapsuleGeometry(PLAYER_RADIUS, PLAYER_HEIGHT - (PLAYER_RADIUS * 2), 4, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x8888ff,
            roughness: 0.8,
            metalness: 0.1,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = PLAYER_HEIGHT / 2;
        this.group.add(this.mesh);
        
        // Create nametag
        const labelDiv = document.createElement('div');
        labelDiv.className = 'player-label';
        labelDiv.textContent = this.peerInfo.username || 'Player';
        this.label = new CSS2DObject(labelDiv);
        this.label.position.y = PLAYER_HEIGHT + 0.5;
        this.group.add(this.label);
    }

    setData(presenceData, teleport = false) {
        if (presenceData.position) {
            this.targetPosition.set(presenceData.position.x, presenceData.position.y, presenceData.position.z);
        }
        if (presenceData.quaternion) {
            this.targetQuaternion.set(
                presenceData.quaternion.x,
                presenceData.quaternion.y,
                presenceData.quaternion.z,
                presenceData.quaternion.w
            );
        }
        
        if (teleport) {
            this.group.position.copy(this.targetPosition);
            this.group.quaternion.copy(this.targetQuaternion);
        }
    }

    update(delta) {
        // Smoothly interpolate position and rotation
        const lerpFactor = Math.min(delta * 10, 1.0); // Adjust speed of interpolation
        this.group.position.lerp(this.targetPosition, lerpFactor);
        this.group.quaternion.slerp(this.targetQuaternion, lerpFactor);
    }

    dispose() {
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
        if (this.label && this.label.element.parentNode) {
            this.label.element.parentNode.removeChild(this.label.element);
        }
        this.scene.remove(this.group);
    }
}