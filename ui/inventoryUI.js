export class InventoryUI {
    constructor(dependencies) {
        this.objectCreator = dependencies.objectCreator;
        this.inventoryManager = dependencies.inventoryManager;
        this.panel = null;
    }

    create() {
        const uiContainer = document.getElementById('ui-container');

        const inventoryButton = document.createElement('div');
        inventoryButton.id = 'inventory-button';
        inventoryButton.classList.add('circle-button');
        inventoryButton.setAttribute('data-tooltip', 'Inventory (I)');
        /* @tweakable The URL for the inventory icon. */
        const inventoryIconUrl = "https://file.garden/Zy7B0LkdIVpGyzA1/Public/Images/Icons/inventory_icon.png";
        /* @tweakable The size of the inventory icon. */
        const inventoryIconSize = "28px";
        inventoryButton.innerHTML = `<img src="${inventoryIconUrl}" alt="Inventory" style="width: ${inventoryIconSize}; height: ${inventoryIconSize};">`;
        uiContainer.appendChild(inventoryButton);

        const inventoryPanel = document.createElement('div');
        inventoryPanel.id = 'inventory-panel';
        inventoryPanel.innerHTML = `
            <div id="inventory-header">
                <h2>Inventory</h2>
                <div id="close-inventory-button" data-tooltip="Close Inventory">✕</div>
            </div>
            <div id="inventory-body">
                <div id="equipped-panel">
                    <div id="player-preview-container">
                        <div id="player-preview-placeholder"></div>
                        <div class="equip-slot" id="equip-helmet" data-tooltip="Helmet"></div>
                        <div class="equip-slot" id="equip-necklace" data-tooltip="Necklace"></div>
                        <div class="equip-slot" id="equip-shoulders" data-tooltip="Shoulders"></div>
                        <div class="equip-slot" id="equip-chest" data-tooltip="Chest Armor"></div>
                        <div class="equip-slot" id="equip-belt" data-tooltip="Belt"></div>
                        <div class="equip-slot" id="equip-pants" data-tooltip="Pants"></div>
                        <div class="equip-slot" id="equip-gloves" data-tooltip="Gloves"></div>
                        <div class="equip-slot" id="equip-boots" data-tooltip="Boots"></div>
                        <div class="equip-slot" id="equip-ring1" data-tooltip="Ring 1"></div>
                        <div class="equip-slot" id="equip-ring2" data-tooltip="Ring 2"></div>
                    </div>
                </div>
                <div class="inventory-grid-container">
                    <div class="inventory-grid"></div>
                </div>
            </div>
        `;
        uiContainer.appendChild(inventoryPanel);
        this.panel = inventoryPanel;

        const objectGrid = this.panel.querySelector('.inventory-grid');
        
        /* @tweakable The total number of inventory slots in the grid. */
        const inventorySlots = 80;

        // Add existing items from object library
        if (this.objectCreator && this.objectCreator.objectLibrary) {
            this.objectCreator.objectLibrary.forEach(obj => {
                const itemEl = document.createElement('div');
                itemEl.className = 'inventory-item occupied';
                itemEl.setAttribute('data-tooltip', `Place a ${obj.name}`);
                itemEl.innerHTML = `<div class="item-icon"></div><span>${obj.name}</span>`;
                itemEl.addEventListener('click', () => {
                    this.objectCreator.createObject(obj.name);
                    this.inventoryManager.toggle(); // Close inventory after creating an item
                });
                objectGrid.appendChild(itemEl);
            });
        }
        
        // Add empty slots to fill up the grid
        const existingItems = objectGrid.children.length;
        for (let i = 0; i < inventorySlots - existingItems; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'inventory-item';
            objectGrid.appendChild(emptySlot);
        }

        inventoryButton.addEventListener('click', () => {
            this.inventoryManager.toggle();
        });

        document.getElementById('close-inventory-button').addEventListener('click', () => {
            this.inventoryManager.toggle();
        });
    }

    toggle(visible) {
        if (this.panel) {
            this.panel.style.display = visible ? 'flex' : 'none';
        }
    }
}