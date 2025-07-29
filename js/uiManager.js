import { BuildUI } from '../ui/buildUI.js';
import { AdvancedBuildUI } from '../ui/advancedBuildUI.js';
import { CharacterCreatorUI } from '../ui/characterCreatorUI.js';
import { InventoryUI } from '../ui/inventoryUI.js';
import { ChatUI } from '../ui/chatUI.js';
import { MapUI } from '../ui/mapUI.js';
import { ChangelogUI } from '../ui/changelogUI.js';
import { MusicUI } from '../ui/musicUI.js';
import { OptionsUI } from '../ui/optionsUI.js';
import { CompassUI } from '../ui/compassUI.js';
import { ClockUI } from '../ui/clockUI.js';
import { BestiaryUI } from '../ui/bestiaryUI.js';
import { AdModal } from '../ui/adModal.js';
import { presetCharacters } from '../js/characters/presets.js';

export class UIManager {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.buildUI = new BuildUI(dependencies);
        this.advancedBuildUI = new AdvancedBuildUI(dependencies);
        this.characterCreatorUI = new CharacterCreatorUI(dependencies);
        this.inventoryUI = new InventoryUI(dependencies);
        this.chatUI = new ChatUI(dependencies);
        this.mapUI = new MapUI(dependencies);
        this.changelogUI = new ChangelogUI(dependencies);
        this.musicUI = new MusicUI(dependencies);
        this.optionsUI = new OptionsUI(dependencies);
        this.compassUI = new CompassUI(dependencies);
        this.clockUI = new ClockUI(dependencies);
        this.bestiaryUI = new BestiaryUI({ ...dependencies, presetCharacters });
        this.adModal = new AdModal(dependencies);

        this.tooltip = null;

        this.boundOnTooltipMouseOver = this.onTooltipMouseOver.bind(this);
        this.boundOnTooltipMouseOut = this.onTooltipMouseOut.bind(this);
        this.boundOnTooltipMouseMove = this.onTooltipMouseMove.bind(this);
    }

    init() {
        this.buildUI.create();
        this.advancedBuildUI.create();
        this.characterCreatorUI.create();
        this.inventoryUI.create();
        this.chatUI.create();
        this.mapUI.create();
        this.changelogUI.create();
        this.musicUI.create();
        this.optionsUI.create();
        this.compassUI.create();
        this.clockUI.create();
        this.bestiaryUI.create();
        this.adModal.setup();

        this.createTooltip();
        this.setupTooltipListeners();

        return { inventoryUI: this.inventoryUI };
    }

    update() {
        if (this.mapUI.isOpen) {
            this.mapUI.update();
        }
        this.compassUI.update();
        this.clockUI.update();
        this.chatUI.update();
    }

    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        document.getElementById('ui-container').appendChild(tooltip);
        this.tooltip = tooltip;
    }

    setupTooltipListeners() {
        document.body.addEventListener('mouseover', this.boundOnTooltipMouseOver);
        document.body.addEventListener('mouseout', this.boundOnTooltipMouseOut);
        document.body.addEventListener('mousemove', this.boundOnTooltipMouseMove);
    }

    onTooltipMouseOver(e) {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            this.tooltip.textContent = target.getAttribute('data-tooltip');
            this.tooltip.style.opacity = '1';
            this.updateTooltipPosition(e);
        }
    }

    onTooltipMouseOut(e) {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            this.tooltip.style.opacity = '0';
        }
    }

    onTooltipMouseMove(e) {
        if (this.tooltip.style.opacity === '1') {
            this.updateTooltipPosition(e);
        }
    }

    updateTooltipPosition(e) {
        let x = e.clientX + 10;
        let y = e.clientY - 30;

        if (x + this.tooltip.offsetWidth > window.innerWidth) {
            x = e.clientX - this.tooltip.offsetWidth - 10;
        }
        if (y < 0) {
            y = e.clientY + 20;
        }

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    destroy() {
        document.body.removeEventListener('mouseover', this.boundOnTooltipMouseOver);
        document.body.removeEventListener('mouseout', this.boundOnTooltipMouseOut);
        document.body.removeEventListener('mousemove', this.boundOnTooltipMouseMove);
        
        // Add destroy calls for child UI components if they have destroy methods.
        // For now, this is a placeholder for good practice.
    }
}