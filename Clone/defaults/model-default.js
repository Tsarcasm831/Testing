import { DEFAULT_LANDS } from './parts/lands-custom.js';
import { DEFAULT_ROADS } from './parts/roads.js';
import { DEFAULT_POI } from './parts/poi-full.js';
import { DEFAULT_WALLS } from './parts/walls.js';
import { DEFAULT_RIVERS } from './parts/rivers.js';
import { DEFAULT_TERRAIN } from './parts/terrain.js';

export const DEFAULT_MODEL = {
  lands: DEFAULT_LANDS,
  roads: DEFAULT_ROADS,
  poi: DEFAULT_POI,
  walls: DEFAULT_WALLS,
  rivers: DEFAULT_RIVERS,
  grass: DEFAULT_TERRAIN.grass,
  forest: DEFAULT_TERRAIN.forest,
  mountains: DEFAULT_TERRAIN.mountains
};

