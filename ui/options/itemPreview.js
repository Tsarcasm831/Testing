import * as THREE from 'three';
import * as houseItems from '../../js/items/houseItems.js';
import * as stageItems from '../../js/items/stageItems.js';

export class ItemPreview {
    constructor(ui) {
        this.ui = ui;
        this.itemPreviewScene = null;
        this.itemPreviewCamera = null;
        this.itemPreviewRenderer = null;
        this.itemPreviewModel = null;
        this.itemPreviewAnimationId = null;
        this.itemPreviewContainer = null;
        this.isDraggingItem = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.itemPreviewContainer = this.ui.modal.querySelector('#item-preview-container');
        this.itemPreviewScene = new THREE.Scene();
        const previewBackgroundColor = 0x2a2a2a;
        this.itemPreviewScene.background = new THREE.Color(previewBackgroundColor);

        this.itemPreviewCamera = new THREE.PerspectiveCamera(
            50,
            this.itemPreviewContainer.clientWidth / this.itemPreviewContainer.clientHeight,
            0.1,
            1000
        );
        this.itemPreviewCamera.position.set(0, 1.5, 3);
        this.itemPreviewCamera.lookAt(0, 0.5, 0);

        this.itemPreviewRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.itemPreviewRenderer.setSize(
            this.itemPreviewContainer.clientWidth,
            this.itemPreviewContainer.clientHeight
        );
        this.itemPreviewContainer.appendChild(this.itemPreviewRenderer.domElement);

        const ambientLightIntensity = 0.8;
        const ambLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
        this.itemPreviewScene.add(ambLight);

        const directionalLightIntensity = 1.5;
        const dirLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity);
        dirLight.position.set(5, 10, 7.5);
        this.itemPreviewScene.add(dirLight);

        this.populateItemList();
        this.animate();
        this.setupEventListeners();
        this.initialized = true;
    }

    setupEventListeners() {
        this.itemPreviewContainer.addEventListener('mousedown', (e) => {
            this.isDraggingItem = true;
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.itemPreviewContainer.addEventListener('mousemove', (e) => {
            if (!this.isDraggingItem || !this.itemPreviewModel) return;
            const rotationSpeed = 0.01;
            const deltaX = e.clientX - this.previousMousePosition.x;
            const deltaY = e.clientY - this.previousMousePosition.y;
            this.itemPreviewModel.rotation.y += deltaX * rotationSpeed;
            this.itemPreviewModel.rotation.x += deltaY * rotationSpeed;
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.itemPreviewContainer.addEventListener('mouseup', () => {
            this.isDraggingItem = false;
        });

        this.itemPreviewContainer.addEventListener('mouseleave', () => {
            this.isDraggingItem = false;
        });
    }

    populateItemList() {
        const listContainer = this.ui.modal.querySelector('.item-list');
        listContainer.innerHTML = '';

        const categories = [
            { label: 'House Items', items: houseItems },
            { label: 'Stage Items', items: stageItems }
        ];

        let index = 0;
        categories.forEach(category => {
            const heading = document.createElement('div');
            heading.className = 'item-category-heading';
            heading.textContent = category.label;
            listContainer.appendChild(heading);

            Object.keys(category.items).forEach((itemName) => {
                const itemFunc = category.items[itemName];
                if (typeof itemFunc === 'function') {
                    const button = document.createElement('button');
                    button.className = 'item-list-entry';
                    button.textContent = itemName
                        .replace('create', '')
                        .replace(/([A-Z])/g, ' $1')
                        .trim();
                    button.addEventListener('click', (e) => {
                        this.showItemInPreview(itemFunc);
                        listContainer.querySelectorAll('.item-list-entry').forEach((btn) =>
                            btn.classList.remove('active')
                        );
                        e.target.classList.add('active');
                    });
                    listContainer.appendChild(button);
                    if (index === 0) {
                        button.classList.add('active');
                        this.showItemInPreview(itemFunc);
                    }
                    index++;
                }
            });
        });
    }

    async showItemInPreview(itemFunc) {
        if (this.itemPreviewModel) {
            this.itemPreviewScene.remove(this.itemPreviewModel);
        }
        this.itemPreviewModel = await itemFunc(this.ui.assetReplacementManager);
        const box = new THREE.Box3().setFromObject(this.itemPreviewModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxSize;
        this.itemPreviewModel.scale.set(scale, scale, scale);
        this.itemPreviewModel.position.sub(center.multiplyScalar(scale));
        this.itemPreviewScene.add(this.itemPreviewModel);
    }

    animate() {
        this.itemPreviewAnimationId = requestAnimationFrame(this.animate.bind(this));
        if (this.itemPreviewModel && !this.isDraggingItem) {
            const idleRotationSpeed = 0.005;
            this.itemPreviewModel.rotation.y += idleRotationSpeed;
        }
        if (this.itemPreviewRenderer) {
            this.itemPreviewRenderer.render(this.itemPreviewScene, this.itemPreviewCamera);
        }
    }

    stopAnimation() {
        if (this.itemPreviewAnimationId) {
            cancelAnimationFrame(this.itemPreviewAnimationId);
            this.itemPreviewAnimationId = null;
        }
    }
}
