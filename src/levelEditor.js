import * as THREE from 'three';

export class LevelEditor {
    constructor(game) {
        this.game = game;
        this.isEditing = false;
        this.editedObjects = [];
        this.objectMaterial = new THREE.MeshStandardMaterial({ color: 0x8888ff });
    }

    toggle() {
        this.isEditing = !this.isEditing;
        if (this.isEditing) {
            this.enableEditing();
        } else {
            this.disableEditing();
        }
    }

    enableEditing() {
        this.pointerHandler = (event) => this.onPointerDown(event);
        this.game.renderer.domElement.addEventListener('pointerdown', this.pointerHandler);
    }

    disableEditing() {
        this.game.renderer.domElement.removeEventListener('pointerdown', this.pointerHandler);
    }

    onPointerDown(event) {
        const rect = this.game.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        this.game.raycaster.setFromCamera(mouse, this.game.camera);
        const intersects = this.game.raycaster.intersectObjects(this.game.scene.children, true);
        if (intersects.length > 0) {
            const point = intersects[0].point.clone();
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const mesh = new THREE.Mesh(geometry, this.objectMaterial);
            mesh.position.copy(point).add(new THREE.Vector3(0, 0.5, 0));
            this.game.scene.add(mesh);
            this.editedObjects.push(mesh);
        }
    }

    save() {
        const data = this.editedObjects.map(obj => ({ position: obj.position.toArray() }));
        localStorage.setItem('customLevel', JSON.stringify(data));
    }

    load() {
        const raw = localStorage.getItem('customLevel');
        if (!raw) return;
        const objects = JSON.parse(raw);
        objects.forEach(o => {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const mesh = new THREE.Mesh(geometry, this.objectMaterial);
            mesh.position.fromArray(o.position);
            this.game.scene.add(mesh);
            this.editedObjects.push(mesh);
        });
    }
}

