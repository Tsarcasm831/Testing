// konoha_roads.js
// NOTE: This file was refactored to improve maintainability.
// It now re-exports from './objects/index.js' and keeps tombstone comments
// to indicate where major sections were moved.

// export * from './objects/index.js'; // remove invalid re-export that breaks module resolution

// New: Konoha roads builder + renderer (reads ../json/konoha_roads.json)

/** Cached roads/config singleton */
let __roadsCache = null;

import { parseGridLabel, posForCell } from '../../../game/objects/utils/gridLabel.js';

/**
 * Load the JSON config once.
 * @returns {Promise<Object>}
 */
async function loadConfig() {
  if (loadConfig._cfg) return loadConfig._cfg;
  const res = await fetch('/src/components/json/konoha_roads.json');
  const cfg = await res.json();
  loadConfig._cfg = cfg;
  return cfg;
}

/**
 * Build a normalized roads object from config.
 * Roads: { type: 'ring'|'radial', r, ang0, ang1 } in degrees for angles.
 * Also grouped by district.
 */
function buildRoadsFromConfig(cfg) {
  const toRadials = (stepDeg) => {
    const arr = [];
    for (let a = 0; a < 360; a += stepDeg) arr.push(a);
    return arr;
  };

  const primaryAngles = toRadials(cfg.primary_step_deg); // e.g., 0,45,90...
  const primaryRings = cfg.primary_radii.slice();
  const secondaryRings = cfg.secondary_radii.slice();

  const roads = [];
  const by_district = {};

  // Primary radials
  primaryAngles.forEach(a => {
    roads.push({ id: `radial_primary_${a}`, type: 'radial', angle: a, r0: 0, r1: cfg.max_radius, tier: 'primary' });
  });
  // Primary rings
  primaryRings.forEach(r => {
    roads.push({ id: `ring_primary_${r}`, type: 'ring', r, ang0: 0, ang1: 360, tier: 'primary' });
  });

  // District internals: radials every district_step_deg within wedge; secondary rings
  cfg.districts.forEach(d => {
    const list = [];
    by_district[d.name] = list;

    // Secondary rings (full arcs but recorded with district for convenience)
    secondaryRings.forEach(r => {
      const ringRoad = { id: `ring_secondary_${d.name}_${r}`, type: 'ring', r, ang0: d.ang0, ang1: d.ang1, tier: 'secondary' };
      roads.push(ringRoad);
      list.push(ringRoad);
    });

    // Radials within district bounds
    const start = d.ang0;
    const end = d.ang1;
    for (let a = start; a <= end; a += cfg.district_step_deg) {
      const rounded = Math.round(a * 1000) / 1000;
      // Skip if angle is a primary radial to avoid duplicate thick lines
      if (primaryAngles.includes(Math.round(rounded))) continue;
      const radial = { id: `radial_secondary_${d.name}_${rounded}`, type: 'radial', angle: rounded, r0: 0, r1: cfg.max_radius, tier: 'tertiary' };
      roads.push(radial);
      list.push(radial);
    }
  });

  return {
    config: cfg,
    roads: {
      all: roads,
      by_district
    }
  };
}

/**
 * Public loader returning cached roads structure
 */
export async function loadKonohaRoads() {
  if (__roadsCache) return __roadsCache;
  const cfg = await loadConfig();
  __roadsCache = buildRoadsFromConfig(cfg);
  return __roadsCache;
}

/**
 * Draw the roads to a 2D canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} scale pixels per map unit
 * @param {number} cx center x
 * @param {number} cy center y
 * @param {Object} options drawing options
 */
/* @tweakable primary road stroke color */
const ROAD_PRIMARY_COLOR = '#d9c3a3';
/* @tweakable secondary road stroke color */
const ROAD_SECONDARY_COLOR = '#b9a78a';
/* @tweakable tertiary road stroke color */
const ROAD_TERTIARY_COLOR = '#9b8a73';
/* @tweakable overall road opacity (0..1) */
const ROAD_OPACITY = 0.85;
/* @tweakable width of primary roads in pixels */
const ROAD_PRIMARY_WIDTH = 12.0;
/* @tweakable width of secondary roads in pixels */
const ROAD_SECONDARY_WIDTH = 8.0;
/* @tweakable width of tertiary roads in pixels */
const ROAD_TERTIARY_WIDTH = 5.0;

/* @tweakable path to primary road texture */
const ROAD_PRIMARY_TEXTURE = '/primary_road_texture.png';
/* @tweakable path to secondary road texture */
const ROAD_SECONDARY_TEXTURE = '/secondary_road_texture.png';
/* @tweakable path to tertiary road texture */
const ROAD_TERTIARY_TEXTURE = '/tertiary_road_texture.png';

/* @tweakable primary road texture scale (1 = original texture size) */
const ROAD_PRIMARY_TEX_SCALE = 0.6;
/* @tweakable secondary road texture scale (1 = original texture size) */
const ROAD_SECONDARY_TEX_SCALE = 0.7;
/* @tweakable tertiary road texture scale (1 = original texture size) */
const ROAD_TERTIARY_TEX_SCALE = 0.8;
/* @tweakable primary road texture rotation in degrees */
const ROAD_PRIMARY_TEX_ROT_DEG = 0;
/* @tweakable secondary road texture rotation in degrees */
const ROAD_SECONDARY_TEX_ROT_DEG = 0;
/* @tweakable tertiary road texture rotation in degrees */
const ROAD_TERTIARY_TEX_ROT_DEG = 0;

// Image cache to avoid reloading textures repeatedly
const textureCache = {};
async function loadTexture(src) {
    if (textureCache[src]) {
        if (textureCache[src] instanceof Promise) {
            return await textureCache[src];
        }
        return textureCache[src];
    }
    const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            textureCache[src] = img;
            resolve(img);
        };
        img.onerror = () => {
            textureCache[src] = null; // Mark as failed
            reject(`Failed to load texture: ${src}`);
        };
        img.src = src;
    });
    textureCache[src] = promise;
    return await promise;
}

/* @tweakable river start grid label */
const RIVER_START_LABEL = 'WB88';
/* @tweakable river end grid label */
const RIVER_END_LABEL = 'VP99';
/* @tweakable river width in grid cells */
const RIVER_WIDTH_CELLS = 3;
/* @tweakable river color */
const RIVER_COLOR = '#3aa0ff';
/* @tweakable river opacity (0..1) */
const RIVER_ALPHA = 0.78;
/* @tweakable river meander amount (world units) */
const RIVER_MEANDER = 120;

/**
 * Draw a single river ribbon between two grid labels.
 * ctx: 2D context; scale: pixels per world unit; (cx,cy): canvas coords of world (0,0)
 */
export function drawRiver(ctx, scale, cx, cy, opts = {}) {
  const startLabel = opts.startLabel || RIVER_START_LABEL;
  const endLabel = opts.endLabel || RIVER_END_LABEL;
  const widthCells = opts.widthCells || RIVER_WIDTH_CELLS;
  const rgba = opts.color || RIVER_COLOR;
  const alpha = (typeof opts.alpha === 'number') ? opts.alpha : RIVER_ALPHA;
  const meander = (typeof opts.meander === 'number') ? opts.meander : RIVER_MEANDER;

  const { i: si, j: sj } = parseGridLabel(startLabel);
  const { i: ei, j: ej } = parseGridLabel(endLabel);
  const p0 = posForCell(si, sj, 3000); // WORLD_SIZE known = 3000
  const p1 = posForCell(ei, ej, 3000);

  const mid = { x: (p0.x + p1.x) / 2, z: (p0.z + p1.z) / 2 };
  const dx = p1.x - p0.x, dz = p1.z - p0.z;
  const len = Math.hypot(dx, dz) || 1;
  const nx = -dz / len, nz = dx / len;
  const c = { x: mid.x + nx * meander, z: mid.z + nz * meander };

  const w = Math.max(1, widthCells * 5) * scale; // 5 world units per grid cell
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = rgba;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(cx + p0.x * scale, cy - p0.z * scale);
  ctx.quadraticCurveTo(cx + c.x * scale, cy - c.z * scale, cx + p1.x * scale, cy - p1.z * scale);
  ctx.stroke();
  ctx.restore();
}

export async function drawRoads(ctx, scale, cx, cy, options = {}) {
  const { roads, config } = await loadKonohaRoads();
  const all = roads.all;

  const opt = {
    primaryColor: options.primaryColor || ROAD_PRIMARY_COLOR,
    secondaryColor: options.secondaryColor || ROAD_SECONDARY_COLOR,
    tertiaryColor: options.tertiaryColor || ROAD_TERTIARY_COLOR,
    alpha: typeof options.alpha === 'number' ? options.alpha : ROAD_OPACITY,
    wPrimary: options.wPrimary || ROAD_PRIMARY_WIDTH,
    wSecondary: options.wSecondary || ROAD_SECONDARY_WIDTH,
    wTertiary: options.wTertiary || ROAD_TERTIARY_WIDTH,
    // texture transforms (per-tier)
    tPrimaryScale: options.tPrimaryScale || ROAD_PRIMARY_TEX_SCALE,
    tSecondaryScale: options.tSecondaryScale || ROAD_SECONDARY_TEX_SCALE,
    tTertiaryScale: options.tTertiaryScale || ROAD_TERTIARY_TEX_SCALE,
    tPrimaryRotDeg: options.tPrimaryRotDeg || ROAD_PRIMARY_TEX_ROT_DEG,
    tSecondaryRotDeg: options.tSecondaryRotDeg || ROAD_SECONDARY_TEX_ROT_DEG,
    tTertiaryRotDeg: options.tTertiaryRotDeg || ROAD_TERTIARY_TEX_ROT_DEG
  };

  // Load textures and create patterns
  let primaryPattern, secondaryPattern, tertiaryPattern;
  // helper: apply DOMMatrix transform to a CanvasPattern when supported
  function applyPatternTransform(p, scaleXY, rotDeg) {
    try {
      if (p && typeof p.setTransform === 'function') {
        const rad = (rotDeg || 0) * Math.PI / 180;
        const s = Math.max(0.01, scaleXY || 1);
        // Scale first (shrink/expand texture), then rotate
        const m = new DOMMatrix().scaleSelf(s, s).rotateSelf((rotDeg || 0));
        p.setTransform(m);
      }
    } catch (_) {}
  }
  try {
    const [primaryTex, secondaryTex, tertiaryTex] = await Promise.all([
      loadTexture(ROAD_PRIMARY_TEXTURE),
      loadTexture(ROAD_SECONDARY_TEXTURE),
      loadTexture(ROAD_TERTIARY_TEXTURE)
    ]);
    if (primaryTex) { primaryPattern = ctx.createPattern(primaryTex, 'repeat'); applyPatternTransform(primaryPattern, opt.tPrimaryScale, opt.tPrimaryRotDeg); }
    if (secondaryTex){ secondaryPattern = ctx.createPattern(secondaryTex, 'repeat'); applyPatternTransform(secondaryPattern, opt.tSecondaryScale, opt.tSecondaryRotDeg); }
    if (tertiaryTex){ tertiaryPattern = ctx.createPattern(tertiaryTex, 'repeat'); applyPatternTransform(tertiaryPattern, opt.tTertiaryScale, opt.tTertiaryRotDeg); }
  } catch (e) {
      console.warn("Could not load road textures, falling back to solid colors.", e);
  }

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = opt.alpha;

  const R = config.max_radius;

  const strokeForTier = (tier) => {
    if (tier === 'primary') { ctx.strokeStyle = primaryPattern || opt.primaryColor; ctx.lineWidth = opt.wPrimary; }
    else if (tier === 'secondary') { ctx.strokeStyle = secondaryPattern || opt.secondaryColor; ctx.lineWidth = opt.wSecondary; }
    else { ctx.strokeStyle = tertiaryPattern || opt.tertiaryColor; ctx.lineWidth = opt.wTertiary; }
  };

  // Draw rings first (under), then radials over them
  const rings = all.filter(r => r.type === 'ring');
  const radials = all.filter(r => r.type === 'radial');

  // Rings
  rings.forEach(r => {
    strokeForTier(r.tier);
    const ang0 = (r.ang0 ?? 0) * Math.PI / 180;
    const ang1 = (r.ang1 ?? 360) * Math.PI / 180;
    ctx.beginPath();
    ctx.arc(cx, cy, r.r * scale, -ang0 + Math.PI/2, -ang1 + Math.PI/2, false);
    ctx.stroke();
  });

  // Radials
  radials.forEach(rd => {
    strokeForTier(rd.tier);
    const a = rd.angle * Math.PI / 180;
    const x0 = cx + Math.cos(a) * (rd.r0 ?? 0) * scale;
    const y0 = cy - Math.sin(a) * (rd.r0 ?? 0) * scale;
    const x1 = cx + Math.cos(a) * (rd.r1 ?? R) * scale;
    const y1 = cy - Math.sin(a) * (rd.r1 ?? R) * scale;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  });

  ctx.restore();
}

/** Export readonly descriptor for consumers wanting meta without async draw */
export const KONOHA_ROADS = {
  get roads() { return __roadsCache?.roads || null; },
  get config() { return __roadsCache?.config || null; }
};