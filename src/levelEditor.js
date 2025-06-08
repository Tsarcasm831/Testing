import * as THREE from 'three';

export class LevelEditor {
    constructor(game) {
        this.game = game;
        this.isEditing = false;
        this.editedObjects = [];
        this.objectMaterial = new THREE.MeshStandardMaterial({ color: 0x8888ff });
        this.highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xff8888 });
        this.selectedObject = null;
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
        this.keyHandler = (event) => this.onKeyDown(event);
        this.game.renderer.domElement.addEventListener('pointerdown', this.pointerHandler);
        window.addEventListener('keydown', this.keyHandler);
    }

    disableEditing() {
        this.game.renderer.domElement.removeEventListener('pointerdown', this.pointerHandler);
        window.removeEventListener('keydown', this.keyHandler);
        this.deselectObject();
    }

    onPointerDown(event) {
        const rect = this.game.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        this.game.raycaster.setFromCamera(mouse, this.game.camera);
        const intersects = this.game.raycaster.intersectObjects(this.editedObjects, true);
        if (intersects.length > 0) {
            this.selectObject(intersects[0].object);
        } else {
            const intersectsScene = this.game.raycaster.intersectObjects(this.game.scene.children, true);
            if (intersectsScene.length > 0) {
                const point = intersectsScene[0].point.clone();
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const mesh = new THREE.Mesh(geometry, this.objectMaterial);
                mesh.position.copy(point).add(new THREE.Vector3(0, 0.5, 0));
                this.game.scene.add(mesh);
                this.editedObjects.push(mesh);
                this.selectObject(mesh);
            }
        }
    }

    onKeyDown(event) {
        if (!this.selectedObject) return;
        const step = 0.5;
        switch (event.key) {
            case 'Delete':
                this.game.scene.remove(this.selectedObject);
                this.editedObjects = this.editedObjects.filter(o => o !== this.selectedObject);
                this.selectedObject = null;
                break;
            case 'ArrowUp':
                this.selectedObject.position.z -= step;
                break;
            case 'ArrowDown':
                this.selectedObject.position.z += step;
                break;
            case 'ArrowLeft':
                this.selectedObject.position.x -= step;
                break;
            case 'ArrowRight':
                this.selectedObject.position.x += step;
                break;
        }
    }

    selectObject(obj) {
        this.deselectObject();
        this.selectedObject = obj;
        if (this.selectedObject) {
            this.selectedObject.material = this.highlightMaterial;
        }
    }

    deselectObject() {
        if (this.selectedObject) {
            this.selectedObject.material = this.objectMaterial;
            this.selectedObject = null;
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

