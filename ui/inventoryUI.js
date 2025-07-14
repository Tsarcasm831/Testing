export class InventoryUI {
    constructor(dependencies) {
        this.objectCreator = dependencies.objectCreator;
        this.inventoryManager = dependencies.inventoryManager;
        this.panel = null;
    }

    create() {
        const inventoryButton = document.createElement('div');
        inventoryButton.id = 'inventory-button';
        inventoryButton.classList.add('circle-button');
        inventoryButton.setAttribute('data-tooltip', 'Inventory (I)');
        inventoryButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.88 4.02A1.5 1.5 0 0017.5 3h-11a1.5 1.5 0 00-1.38 1.02L2.5 12.19l-1 5A1.5 1.5 0 003 19h18a1.5 1.5 0 001.5-1.81l-1-5-2.62-8.17zM12 11.5a2.5 2.5 0 01-2.5-2.5A2.5 2.5 0 0112 6.5a2.5 2.5 0 012.5 2.5A2.5 2.5 0 0112 11.5z"/></svg>`;
        document.getElementById('game-container').appendChild(inventoryButton);

        const inventoryPanel = document.createElement('div');
        inventoryPanel.id = 'inventory-panel';
        inventoryPanel.innerHTML = `
            <h2>Inventory</h2>
            <div class="inventory-grid"></div>
            <button id="close-inventory-button" data-tooltip="Close Inventory">Close</button>
        `;
        document.getElementById('game-container').appendChild(inventoryPanel);
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