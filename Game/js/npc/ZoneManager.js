import { ACTIVE_ZONE_RADIUS } from './constants.js';
import { ZONE_SIZE } from '../worldgen/constants.js';

/* @tweakable Adjusts how many NPC zones are loaded based on view distance. Lower values load fewer zones. 1.0 is a direct relationship. A lower value is better for performance. */
const NPC_ZONE_VIEW_DISTANCE_RATIO = 0.5;

export class ZoneManager {
    constructor(playerControls, onActivate, onDeactivate) {
        this.playerControls = playerControls;
        this.onActivate = onActivate;
        this.onDeactivate = onDeactivate;
        this.lastActiveZoneRadius = -1;

        this.activeZones = new Set();
        this.playerZoneKey = null;
    }

    _getZoneKey(position) {
        const x = Math.floor((position.x + ZONE_SIZE / 2) / ZONE_SIZE);
        const z = Math.floor((position.z + ZONE_SIZE / 2) / ZONE_SIZE);
        return `${x},${z}`;
    }

    update(viewDistance) {
        const playerPos = this.playerControls.getPlayerModel().position;
        const currentZoneKey = this._getZoneKey(playerPos);
        
        const activeZoneRadius = viewDistance ? Math.ceil((viewDistance / ZONE_SIZE) * NPC_ZONE_VIEW_DISTANCE_RATIO) : 1;

        if (currentZoneKey === this.playerZoneKey && activeZoneRadius === this.lastActiveZoneRadius) {
            return; // No change in zone or view distance radius
        }
        
        this.lastActiveZoneRadius = activeZoneRadius;
        this.playerZoneKey = currentZoneKey;

        const [zoneX, zoneZ] = currentZoneKey.split(',').map(Number);
        const newActiveZones = new Set();

        for (let x = zoneX - activeZoneRadius; x <= zoneX + activeZoneRadius; x++) {
            for (let z = zoneZ - activeZoneRadius; z <= zoneZ + activeZoneRadius; z++) {
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