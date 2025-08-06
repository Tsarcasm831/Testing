export class ClockUI {
    constructor(dependencies) {
        // dependencies are not used currently but kept for future extension
        this.container = null;
        this.timeDisplay = null;
    }

    create() {
        const uiContainer = document.getElementById('ui-container');
        this.container = document.createElement('div');
        this.container.id = 'clock-container';
        this.timeDisplay = document.createElement('div');
        this.timeDisplay.id = 'clock-display';
        this.container.appendChild(this.timeDisplay);
        uiContainer.appendChild(this.container);
        this.update();
    }

    update() {
        const now = new Date();
        const denverNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
        const hours = denverNow.getHours().toString().padStart(2, '0');
        const minutes = denverNow.getMinutes().toString().padStart(2, '0');
        this.timeDisplay.textContent = `${hours}:${minutes}`;
    }
}
