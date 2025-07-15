import { BuildUI } from '../ui/buildUI.js';
import { AdvancedBuildUI } from '../ui/advancedBuildUI.js';
import { ChatUI } from '../ui/chatUI.js';
import { ChangelogUI } from '../ui/changelogUI.js';
import { CharacterCreatorUI } from '../ui/characterCreatorUI.js';
import { AdModal } from '../ui/adModal.js';
import { InventoryUI } from '../ui/inventoryUI.js';
import { MapUI } from '../ui/mapUI.js';
import { OptionsUI } from '../ui/optionsUI.js';
import { CompassUI } from '../ui/compassUI.js';

export class UIManager {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.inventoryUI = null;
        this.mapUI = null;
        this.optionsUI = null;
        this.chatUI = null;
        this.compassUI = null;
        this.tooltipElement = null;
    }

    init() {
        new BuildUI(this.dependencies).create();
        new AdvancedBuildUI(this.dependencies).create();
        new ChangelogUI(this.dependencies).create();
        
        this.chatUI = new ChatUI(this.dependencies);
        this.chatUI.create();
        
        new CharacterCreatorUI(this.dependencies).create();
        
        this.optionsUI = new OptionsUI(this.dependencies);
        this.optionsUI.create();
        
        new AdModal(this.dependencies).setup();

        this.inventoryUI = new InventoryUI(this.dependencies);
        this.inventoryUI.create();

        this.mapUI = new MapUI(this.dependencies);
        this.mapUI.create();

        this.compassUI = new CompassUI(this.dependencies);
        this.compassUI.create();

        this.initTooltip();

        return {
            inventoryUI: this.inventoryUI,
            mapUI: this.mapUI,
        };
    }

    initTooltip() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'tooltip';
        document.body.appendChild(this.tooltipElement);
        
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.tooltipElement.textContent = target.getAttribute('data-tooltip');
                this.tooltipElement.style.opacity = '1';
                this.updateTooltipPosition(e);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.tooltipElement.style.opacity = '0';
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.tooltipElement.style.opacity === '1') {
                this.updateTooltipPosition(e);
            }
        });
    }

    updateTooltipPosition(event) {
        let x = event.clientX + 15;
        let y = event.clientY + 15;
        
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();

        if (x + tooltipRect.width > bodyRect.width) {
            x = event.clientX - tooltipRect.width - 15;
        }
        if (y + tooltipRect.height > bodyRect.height) {
            y = event.clientY - tooltipRect.height - 15;
        }

        this.tooltipElement.style.left = `${x}px`;
        this.tooltipElement.style.top = `${y}px`;
    }

    update() {
        if (this.chatUI) {
            this.chatUI.update();
        }
        if (this.compassUI) {
            this.compassUI.update();
        }
    }
}