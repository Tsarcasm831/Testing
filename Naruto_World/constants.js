export const W = 1018, H = 968; // viewBox

export const svg = document.getElementById('map');
export const dLayer = document.getElementById('landLayer');
export const landBaseLayer = document.getElementById('landBaseLayer');
export const rLayer = document.getElementById('roadLayer');
export const riverLayer = document.getElementById('riverLayer');
export const pLayer = document.getElementById('poiLayer');
export const unitLayer = document.getElementById('unitLayer');
export const hLayer = document.getElementById('handleLayer');
export const tip = document.getElementById('tip');
export const out = document.getElementById('json');
export const oceanMaskShapes = document.getElementById('oceanMaskShapes');

export const $ = sel => document.querySelector(sel);

/* add paint layers */
export const forestLayer = document.getElementById('forestLayer');
export const mountainLayer = document.getElementById('mountainLayer');

export const LAND_ICONS = {
  'Land01': '/leaf.png',          // Land of Fire
  'Land15': '/sand.png',          // Land of Wind
  'Land12': '/stone.png',         // Land of Earth
  'Land22': '/mist.png',          // Land of Water
  'Land13': '/cloud.png',         // Land of Lightning
  'Land08': '/sound.png',         // Land of Sound
  'Land17': '/grass.png',         // Land of Grass
  'Land09': '/waterfall.png',     // Land of Waterfalls
  'Land23': '/yurei.png'          // Land of Ghosts
};