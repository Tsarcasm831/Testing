export class BestiaryUI {
    constructor(dependencies) {
        this.npcManager = dependencies.npcManager;
        this.playerControls = dependencies.playerControls;
        this.modal = null;
        this.isOpen = false;
    }

    create() {
        const uiContainer = document.getElementById('ui-container');

        const button = document.createElement('div');
        button.id = 'bestiary-button';
        button.classList.add('circle-button');
        button.setAttribute('data-tooltip', 'Bestiary (B)');
        const iconUrl = 'https://file.garden/Zy7B0LkdIVpGyzA1/Public/Images/Icons/book_icon.png';
        const iconSize = '28px';
        button.innerHTML = `<img src="${iconUrl}" alt="Bestiary" style="width: ${iconSize}; height: ${iconSize};">`;
        uiContainer.appendChild(button);

        const modal = document.createElement('div');
        modal.id = 'bestiary-modal';
        modal.innerHTML = `
            <div id="bestiary-header">
                <h2>Bestiary</h2>
                <div id="close-bestiary" data-tooltip="Close">✕</div>
            </div>
            <div id="bestiary-list"></div>
        `;
        uiContainer.appendChild(modal);
        this.modal = modal;

        button.addEventListener('click', () => this.toggle());
        modal.querySelector('#close-bestiary').addEventListener('click', () => this.toggle());

        window.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
            if (e.key.toLowerCase() === 'b') {
                this.toggle();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.modal) {
            this.modal.style.display = this.isOpen ? 'flex' : 'none';
        }
        if (this.playerControls) {
            this.playerControls.enabled = !this.isOpen;
        }
        if (this.isOpen) {
            this.populate();
        }
    }

    populate() {
        if (!this.modal || !this.npcManager) return;
        const listEl = this.modal.querySelector('#bestiary-list');
        listEl.innerHTML = '';
        this.npcManager.npcs.forEach(npc => {
            const entry = document.createElement('div');
            entry.className = 'bestiary-entry';
            const img = document.createElement('img');
            img.src = 'https://via.placeholder.com/80';
            img.alt = npc.model.name || 'NPC';
            const label = document.createElement('div');
            label.textContent = npc.model.name || npc.presetId || 'NPC';
            entry.appendChild(img);
            entry.appendChild(label);
            listEl.appendChild(entry);
        });
    }
}
