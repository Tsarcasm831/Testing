import * as THREE from 'three';
import * as houseItems from '../../js/items/houseItems.js';

// @tweakable Item categories for the options menu.
const itemCategories = {
    Furniture: ['createWoodChair', 'createRoundTable', 'createBed', 'createBookshelf', 'createSofa', 'createCoffeeTable', 'createDesk', 'createCabinet', 'createWardrobe', 'createDiningTable', 'createNightstand', 'createTVStand', 'createRug', 'createStorageCrate'],
    Kitchen: ['createKitchenCounter', 'createStove', 'createRefrigerator', 'createSink'],
    Bathroom: ['createBathtub', 'createToilet'],
    Lighting: ['createFloorLamp', 'createCeilingFan'],
    Decor: ['createFlowerPot', 'createWindowFrame', 'createDoorFrame']
};

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
        this.isPanning = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.initialTarget = new THREE.Vector3(0, 0.5, 0);
        this.initialized = false;
        this.orbitControls = null;
    }

    init() {
        if (this.initialized) return;
        this.itemPreviewContainer = this.ui.modal.querySelector('#item-preview-container');
        this.itemPreviewScene = new THREE.Scene();
        /* @tweakable The background color of the item preview canvas. */
        const previewBackgroundColor = 0x2a2a2a;
        this.itemPreviewScene.background = new THREE.Color(previewBackgroundColor);

        this.itemPreviewCamera = new THREE.PerspectiveCamera(
            50,
            this.itemPreviewContainer.clientWidth / this.itemPreviewContainer.clientHeight,
            0.1,
            1000
        );
        this.itemPreviewCamera.position.set(0, 1.5, 3);
        this.itemPreviewCamera.lookAt(this.initialTarget);

        this.itemPreviewRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.itemPreviewRenderer.setSize(
            this.itemPreviewContainer.clientWidth,
            this.itemPreviewContainer.clientHeight
        );
        this.itemPreviewContainer.appendChild(this.itemPreviewRenderer.domElement);
        
        const gridHelper = new THREE.GridHelper(4, 4, 0x555555, 0x333333);
        this.itemPreviewScene.add(gridHelper);

        /* @tweakable The intensity of the ambient light in the item preview. */
        const ambientLightIntensity = 0.8;
        const ambLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
        this.itemPreviewScene.add(ambLight);

        /* @tweakable The intensity of the directional light in the item preview. */
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
            if (e.button === 0) { // Left mouse button
                this.isDraggingItem = true;
            } else if (e.button === 2) { // Right mouse button
                this.isPanning = true;
            }
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.itemPreviewContainer.addEventListener('mousemove', (e) => {
            if (!this.itemPreviewModel) return;
            
            const deltaX = e.clientX - this.previousMousePosition.x;
            const deltaY = e.clientY - this.previousMousePosition.y;

            if (this.isDraggingItem) {
                /* @tweakable The rotation speed when dragging an item in the preview. */
                const rotationSpeed = 0.01;
                this.itemPreviewModel.rotation.y += deltaX * rotationSpeed;
                this.itemPreviewModel.rotation.x += deltaY * rotationSpeed;
            } else if (this.isPanning) {
                 /* @tweakable The panning speed when right-click dragging in the preview. */
                const panSpeed = 0.003;
                this.itemPreviewCamera.position.x -= deltaX * panSpeed;
                this.itemPreviewCamera.position.y += deltaY * panSpeed;
                this.initialTarget.x -= deltaX * panSpeed;
                this.initialTarget.y += deltaY * panSpeed;
                this.itemPreviewCamera.lookAt(this.initialTarget);
            }

            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.itemPreviewContainer.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.isDraggingItem = false;
            } else if (e.button === 2) {
                this.isPanning = false;
            }
        });

        this.itemPreviewContainer.addEventListener('mouseleave', () => {
            this.isDraggingItem = false;
            this.isPanning = false;
        });

        this.itemPreviewContainer.addEventListener('wheel', (e) => {
            if (!this.itemPreviewModel) return;
            /* @tweakable The zoom speed when using the mouse wheel in the preview. */
            const zoomSpeed = 0.1;
            this.itemPreviewCamera.position.z += e.deltaY > 0 ? zoomSpeed : -zoomSpeed;
            /* @tweakable The minimum zoom distance in the item preview. */
            this.itemPreviewCamera.position.z = Math.max(1, this.itemPreviewCamera.position.z);
            /* @tweakable The maximum zoom distance in the item preview. */
            this.itemPreviewCamera.position.z = Math.min(10, this.itemPreviewCamera.position.z);
        });

        const searchInput = this.ui.modal.querySelector('#item-search');
        searchInput.addEventListener('input', (e) => {
            this.filterItems(e.target.value.toLowerCase());
        });
    }

    populateItemList() {
        const listContainer = this.ui.modal.querySelector('.item-list');
        listContainer.innerHTML = '';
        let firstItemName = null;

        for (const category in itemCategories) {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'item-category';
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'item-category-header';
            categoryHeader.textContent = category;
            categoryHeader.addEventListener('click', () => {
                categoryContainer.classList.toggle('collapsed');
            });
            categoryContainer.appendChild(categoryHeader);

            const categoryContent = document.createElement('div');
            categoryContent.className = 'item-category-content';

            itemCategories[category].forEach((itemName) => {
                if (typeof houseItems[itemName] === 'function') {
                    if (!firstItemName) firstItemName = itemName;
                    const button = document.createElement('button');
                    button.className = 'item-list-entry';
                    const friendlyName = itemName.replace('create', '').replace(/([A-Z])/g, ' $1').trim();
                    button.textContent = friendlyName;
                    button.dataset.itemName = friendlyName.toLowerCase();

                    button.addEventListener('click', (e) => {
                        this.showItemInPreview(itemName);
                        listContainer.querySelectorAll('.item-list-entry').forEach((btn) =>
                            btn.classList.remove('active')
                        );
                        e.target.classList.add('active');
                    });
                    categoryContent.appendChild(button);
                }
            });
            categoryContainer.appendChild(categoryContent);
            listContainer.appendChild(categoryContainer);
        }

        if (firstItemName) {
             const firstButton = listContainer.querySelector('.item-list-entry');
             if (firstButton) {
                firstButton.classList.add('active');
                this.showItemInPreview(firstItemName);
             }
        }
    }

    filterItems(query) {
        const allButtons = this.ui.modal.querySelectorAll('.item-list-entry');
        const categories = this.ui.modal.querySelectorAll('.item-category');

        allButtons.forEach(button => {
            const matches = button.dataset.itemName.includes(query);
            button.style.display = matches ? '' : 'none';
        });

        categories.forEach(category => {
            const content = category.querySelector('.item-category-content');
            const visibleButtons = content.querySelectorAll('.item-list-entry[style=""]');
            category.style.display = visibleButtons.length > 0 ? '' : 'none';
        });
    }

    async showItemInPreview(itemName) {
        if (this.itemPreviewModel) {
            this.itemPreviewScene.remove(this.itemPreviewModel);
        }
        this.itemPreviewModel = await houseItems[itemName](this.ui.assetReplacementManager);
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
        if (this.itemPreviewModel && !this.isDraggingItem && !this.isPanning) {
             /* @tweakable The idle rotation speed for items in the preview. */
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