export const DEFAULTS = {
    renderDistance: 8,
    shadowQuality: 2048, // 1024, 2048, 4096, 0 (off)
    grassDensity: 0.35,
    rockDensity: 0.015,
    scatterRockDensity: 0.04,
    treeDensity: 0.01,
    mouseSensitivity: 1.0,
    sprintSpeed: 1.8,
    biomeFog: true,
};

export const MOBILE_DEFAULTS = {
    renderDistance: 4,
    shadowQuality: 0, // Shadows off for mobile performance
    grassDensity: 0.1,
    rockDensity: 0.005,
    scatterRockDensity: 0.015,
    treeDensity: 0.004,
    mouseSensitivity: 1.2,
    sprintSpeed: 1.8,
    biomeFog: true,
};

class Settings {
    constructor() {
        this.values = {};
        this.changeListeners = {};
        this.isMobile = 'ontouchstart' in window;
        this.load();
    }

    load() {
        const baseDefaults = this.isMobile ? MOBILE_DEFAULTS : DEFAULTS;
        try {
            const storedSettings = localStorage.getItem('terrain_walker_settings');
            if (storedSettings) {
                this.values = { ...baseDefaults, ...JSON.parse(storedSettings) };
            } else {
                this.values = { ...baseDefaults };
            }
        } catch (e) {
            console.error("Failed to load settings from localStorage", e);
            this.values = { ...baseDefaults };
        }
    }

    save() {
        try {
            localStorage.setItem('terrain_walker_settings', JSON.stringify(this.values));
        } catch (e) {
            console.error("Failed to save settings to localStorage", e);
        }
    }

    get(key) {
        return this.values[key];
    }

    set(key, value) {
        const baseDefaults = this.isMobile ? MOBILE_DEFAULTS : DEFAULTS;
        // Coerce to number if the default is a number
        if (typeof baseDefaults[key] === 'number') {
            value = Number(value);
        }
        // Coerce to boolean if the default is a boolean
        if (typeof baseDefaults[key] === 'boolean') {
            value = Boolean(value);
        }
        
        const oldValue = this.values[key];
        if (oldValue !== value) {
            this.values[key] = value;
            this.save();
            if (this.changeListeners[key]) {
                this.changeListeners[key].forEach(cb => cb(value, oldValue));
            }
        }
    }

    onChange(key, callback) {
        if (!this.changeListeners[key]) {
            this.changeListeners[key] = [];
        }
        this.changeListeners[key].push(callback);
    }
}

export const settings = new Settings();