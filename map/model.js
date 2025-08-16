import { DEFAULT_MODEL } from './user-defaults.js';
export const MODEL = DEFAULT_MODEL;

export const state = {
  mode:'select', edit:false, snap:false,
  selected:null, 
  drawing:null, 
  addingPOI:false
};

// ensure rivers array exists for new feature
if(!Array.isArray(MODEL.rivers)) MODEL.rivers = [];
// ensure paint layers exist
if(!Array.isArray(MODEL.grass)) MODEL.grass = [];
if(!Array.isArray(MODEL.forest)) MODEL.forest = [];
if(!Array.isArray(MODEL.mountains)) MODEL.mountains = [];