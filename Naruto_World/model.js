import { CITIES } from './defaults/parts/cities.js';

export const MODEL = {
  lands: {},
  roads: [],
  poi: [],
  rivers: [],
  forest: [],
  mountains: [],
  units: []
};

export const state = {
  mode:'select', edit:false, snap:false,
  selected:null, 
  drawing:null, 
  addingPOI:false,
  brush:{
    road:{type:'street', width:4},
    river:{width:7},
    forest:{width:40},
    mountain:{shape:'line', width:10, triSize:8}
  },
  locks: {
    landsLocked: false,  // set to true to prevent land edits
    poiLocked: false         // set to true to prevent POI edits
  }
};

export async function loadData() {
  let data = null;
  try {
    const saved = localStorage.getItem('konoha-map-v3'); // Prefer autosave
    if(saved) data = JSON.parse(saved);
    else {
       // Fallback to explicit default save if autosave missing
       const def = localStorage.getItem('konoha-default-model-v3');
       if(def) data = JSON.parse(def);
    }
  } catch(e) { console.warn('Storage load failed', e); }

  if (!data) {
    // No local data, load built-in defaults
    // This dynamic import prevents blocking the main thread with 30+ file requests at startup
    const m = await import('./user-defaults.js');
    data = m.DEFAULT_MODEL;
  }
  
  if(data) {
    Object.assign(MODEL, data);
    
    // Data migration / sanitation
    MODEL.rivers = MODEL.rivers || [];
    if(!Array.isArray(MODEL.grass)) MODEL.grass = [];
    if(!Array.isArray(MODEL.forest)) MODEL.forest = [];
    if(!Array.isArray(MODEL.mountains)) MODEL.mountains = [];
    
    // Legacy migration
    if(MODEL.districts && !MODEL.lands) {
      MODEL.lands = MODEL.districts;
      delete MODEL.districts;
    }
    if(!MODEL.lands) MODEL.lands = {};
  }

  // Sync named cities from CITIES constant (overrides local storage metadata)
  if (Array.isArray(MODEL.poi)) {
    MODEL.poi = MODEL.poi.map(p => {
      const def = CITIES.find(c => c.id === p.id);
      if (def) {
        return {
          ...p,
          name: def.name,
          desc: def.desc,
          type: def.type,
          icon: def.icon,
          image: def.image
        };
      }
      return p;
    });
  }

  return MODEL;
}