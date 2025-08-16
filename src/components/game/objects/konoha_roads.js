import { DEFAULT_ROADS } from '../../../../map/defaults/parts/roads.js';
import { DEFAULT_DISTRICTS } from '../../../../map/defaults/parts/districts.js';
import { parseGridLabel, posForCell } from '../../../game/objects/utils/gridLabel.js';

// World dimension in world units
const WORLD_SIZE = 3000;

let __roadsCache = null;

/**
 * Load roads and districts from the map defaults.
 * Data is cached after first call.
 */
export async function loadKonohaRoads() {
  if (__roadsCache) return __roadsCache;
  __roadsCache = {
    roads: { all: DEFAULT_ROADS },
    districts: DEFAULT_DISTRICTS
  };
  return __roadsCache;
}

// Road drawing defaults
const ROAD_COLOR = '#d9c3a3';
const ROAD_OPACITY = 0.85;
const ROAD_BASE_WIDTH = 6; // pixels when r.width == 3

/**
 * Draw polyline roads loaded from the map defaults.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} scale  pixels per world unit
 * @param {number} cx     canvas x coordinate of world origin
 * @param {number} cy     canvas y coordinate of world origin
 * @param {Object} options drawing options
 */
export async function drawRoads(ctx, scale, cx, cy, options = {}) {
  const { roads } = await loadKonohaRoads();
  const opt = {
    color: options.primaryColor || ROAD_COLOR,
    alpha: typeof options.alpha === 'number' ? options.alpha : ROAD_OPACITY,
    baseWidth: options.wPrimary || ROAD_BASE_WIDTH
  };

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = opt.alpha;
  ctx.strokeStyle = opt.color;

  for (const r of roads.all) {
    if (!r.points || r.points.length < 2) continue;
    ctx.beginPath();
    r.points.forEach(([x, y], idx) => {
      const wx = (x / 100) * WORLD_SIZE - WORLD_SIZE / 2;
      const wz = (y / 100) * WORLD_SIZE - WORLD_SIZE / 2;
      const px = cx + wx * scale;
      const py = cy + wz * scale;
      if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    const widthFactor = (r.width || 3) / 3;
    ctx.lineWidth = opt.baseWidth * widthFactor;
    ctx.stroke();
  }

  ctx.restore();
}

// District drawing defaults
const DISTRICT_STROKE = '#ffffff';
const DISTRICT_FILL = '#ffffff';

/**
 * Draw district polygons.
 */
export async function drawDistricts(ctx, scale, cx, cy, options = {}) {
  const { districts } = await loadKonohaRoads();
  const opt = {
    stroke: options.stroke || DISTRICT_STROKE,
    fill: options.fill || DISTRICT_FILL,
    alpha: typeof options.alpha === 'number' ? options.alpha : 0.2,
    lineWidth: options.lineWidth || 2
  };

  ctx.save();
  ctx.globalAlpha = opt.alpha;
  for (const d of Object.values(districts)) {
    if (!d.points || d.points.length < 3) continue;
    ctx.beginPath();
    d.points.forEach(([x, y], idx) => {
      const wx = (x / 100) * WORLD_SIZE - WORLD_SIZE / 2;
      const wz = (y / 100) * WORLD_SIZE - WORLD_SIZE / 2;
      const px = cx + wx * scale;
      const py = cy + wz * scale;
      if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = opt.fill;
    ctx.fill();
    ctx.strokeStyle = opt.stroke;
    ctx.lineWidth = opt.lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/* River rendering re-used from previous implementation */
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
  const p0 = posForCell(si, sj, WORLD_SIZE);
  const p1 = posForCell(ei, ej, WORLD_SIZE);

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

export const KONOHA_ROADS = {
  get roads() { return __roadsCache?.roads || null; },
  get districts() { return __roadsCache?.districts || null; }
};
