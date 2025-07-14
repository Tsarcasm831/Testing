import { ACTIVE_ZONE_RADIUS } from './constants.js';
import { ZONE_SIZE } from '../worldGeneration.js';

export class ZoneManager {
    constructor(playerControls, onActivate, onDeactivate) {
        this.playerControls = playerControls;
        this.onActivate = onActivate;
        this.onDeactivate = onDeactivate;

        this.activeZones = new Set();
        this.playerZoneKey = null;
    }

    _getZoneKey(position) {
        const x = Math.floor((position.x + ZONE_SIZE / 2) / ZONE_SIZE);
        const z = Math.floor((position.z + ZONE_SIZE / 2) / ZONE_SIZE);
        return `${x},${z}`;
    }

    update() {
        const playerPos = this.playerControls.getPlayerModel().position;
        const currentZoneKey = this._getZoneKey(playerPos);

        if (currentZoneKey === this.playerZoneKey) {
            return; // No change in zone
        }
        this.playerZoneKey = currentZoneKey;

        const [zoneX, zoneZ] = currentZoneKey.split(',').map(Number);
        const newActiveZones = new Set();

        for (let x = zoneX - ACTIVE_ZONE_RADIUS; x <= zoneX + ACTIVE_ZONE_RADIUS; x++) {
            for (let z = zoneZ - ACTIVE_ZONE_RADIUS; z <= zoneZ + ACTIVE_ZONE_RADIUS; z++) {
                newActiveZones.add(`${x},${z}`);
            }
        }

        const zonesToDeactivate = [...this.activeZones].filter(zone => !newActiveZones.has(zone));
        const zonesToActivate = [...newActiveZones].filter(zone => !this.activeZones.has(zone));

        zonesToDeactivate.forEach(zoneKey => this.onDeactivate(zoneKey));
        zonesToActivate.forEach(zoneKey => this.onActivate(zoneKey));

        this.activeZones = newActiveZones;
    }

    reset() {
        this.playerZoneKey = null;
        this.activeZones.clear();
    }
}