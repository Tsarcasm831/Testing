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
            <h2>Inventory</h2>
            <div class="inventory-grid"></div>
            <button id="close-inventory-button" data-tooltip="Close Inventory">Close</button>
        `;
        uiContainer.appendChild(inventoryPanel);
        this.panel = inventoryPanel;

        const objectGrid = this.panel.querySelector('.inventory-grid');
        if (this.objectCreator && this.objectCreator.objectLibrary) {
            this.objectCreator.objectLibrary.forEach(obj => {
                const itemEl = document.createElement('div');
                itemEl.className = 'inventory-item';
                itemEl.textContent = obj.name;
                itemEl.addEventListener('click', () => {
                    this.objectCreator.createObject(obj.name);
                    this.inventoryManager.toggle(); // Close inventory after creating an item
                });
                objectGrid.appendChild(itemEl);
            });
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
            this.panel.style.display = visible ? 'block' : 'none';
        }
    }
}