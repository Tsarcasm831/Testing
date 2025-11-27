import { W, H, unitLayer } from './constants.js';
import { mk } from './utils.js';
import { MODEL, state } from './model.js';
import { select } from './interactions.js';
import { registerRenderer } from './render.js';

// Kunai icon path
// A simple diamond shape with a ring at the end
const KUNAI_PATH = "M 0 0 L 4 -12 L 0 -35 L -4 -12 Z";
const RING_PATH = "M 0 -35 m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0";

// We'll use a group to hold the paths
const KUNAI_SVG_CONTENT = `
  <path d="${KUNAI_PATH}" fill="#ccc" stroke="#333" stroke-width="1" />
  <path d="${RING_PATH}" fill="none" stroke="#333" stroke-width="1" />
  <circle cx="0" cy="0" r="1.5" fill="#333" />
`;

const UNIT_SPEED = 0.012; // Reduced speed (approx 1/2 of original)

const DEFAULT_UNITS = [
  {
    "id": "u1",
    "path": [
      [
        42.3867,
        29.6296
      ],
      [
        41.5,
        24.5
      ],
      [
        43.6297,
        17.9739
      ],
      [
        43.95770539469241,
        12.959153198998822
      ],
      [
        48.6436,
        7.9034]
    ],
    "currentSegment": 1,
    "t": 0.7521066361827995,
    "direction": 1
  },
  {
    "id": "u2",
    "path": [
      [
        42.386712634493186,
        29.62963009668776
      ],
      [
        35.635022236462426,
        30.06933543307722
      ],
      [
        32.88562227560167,
        35.8023083899632
      ],
      [
        27.88521217690938,
        35.83878130952189
      ]
    ],
    "currentSegment": 2,
    "t": 0.9513924259628085,
    "direction": 1
  }
];

let pathsGroup, markersGroup;

export function initUnits() {
    // Merge defaults if missing to ensure new units appear
    if (!MODEL.units) MODEL.units = [];
    
    // Update existing default units to match the definition (in case coordinates changed)
    MODEL.units.forEach(u => {
        const def = DEFAULT_UNITS.find(d => d.id === u.id);
        if (def) {
            // specific logic: update path if it looks like the old default path or user requested route update
            // For now, we simply overwrite the path for u1 and u2 to ensure the request is met
            if (u.id === 'u1' || u.id === 'u2') {
                u.path = JSON.parse(JSON.stringify(def.path));
            }
        }
    });

    // Check if we need to seed defaults (if array is empty or we want to ensure these specific defaults exist)
    // Simple check: if u1 or u2 is missing, add them
    const existingIds = new Set(MODEL.units.map(u => u.id));
    DEFAULT_UNITS.forEach(def => {
        if (!existingIds.has(def.id)) {
            MODEL.units.push(JSON.parse(JSON.stringify(def)));
        }
    });

    // Ensure layer structure
    if (!pathsGroup) {
        pathsGroup = mk('g', {class: 'unit-paths'});
        markersGroup = mk('g', {class: 'unit-markers'});
        unitLayer.appendChild(pathsGroup);
        unitLayer.appendChild(markersGroup);
    }

    registerRenderer('units', drawUnitPaths);
    drawUnitPaths(); // Initial draw

    requestAnimationFrame(animateUnits);
}

function animateUnits() {
    updateUnits();
    drawUnitMarkers();
    requestAnimationFrame(animateUnits);
}

function updateUnits() {
    (MODEL.units || []).forEach(u => {
        if (!u.path || u.path.length < 2) return;
        
        // Ensure currentSegment is valid
        if (u.currentSegment >= u.path.length - 1) {
            u.currentSegment = u.path.length - 2;
            u.t = 1;
        }

        const p1 = u.path[u.currentSegment];
        const p2 = u.path[u.currentSegment + 1];
        
        // Calculate segment length to maintain constant speed
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Advance t based on speed
        // speed / distance = change in t per frame
        // Avoid division by zero
        const dt = dist > 0.001 ? (UNIT_SPEED / dist) : 0;
        
        u.t += dt * u.direction;
        
        // Handle segment transitions
        if (u.t >= 1) {
            if (u.currentSegment < u.path.length - 2) {
                u.t -= 1;
                u.currentSegment++;
            } else {
                u.t = 1;
                u.direction = -1; // Turn around at end
            }
        } else if (u.t <= 0) {
            if (u.currentSegment > 0) {
                u.t += 1;
                u.currentSegment--;
            } else {
                u.t = 0;
                u.direction = 1; // Turn around at start
            }
        }
    });
}

export function drawUnitPaths() {
    if (!pathsGroup) return;
    while(pathsGroup.firstChild) pathsGroup.removeChild(pathsGroup.firstChild);
    
    (MODEL.units || []).forEach((u, i) => {
        if (!u.path || u.path.length < 2) return;

        const isSel = state.selected && state.selected.kind === 'unit' && state.selected.key === i;
        const points = u.path.map(p => `${p[0] * W / 100},${p[1] * H / 100}`).join(' ');
        
        // Invisible hit path (wider for easier clicking)
        const hitPath = mk('polyline', {
            points: points,
            fill: 'none',
            stroke: 'transparent',
            'stroke-width': '16',
            style: 'cursor: pointer; pointer-events: stroke;'
        });
        
        hitPath.addEventListener('mousemove', (e) => {
            if (state.mode === 'select') {
                e.stopPropagation();
                select('unit', i);
            }
        });

        // Visible path trace
        const visPath = mk('polyline', {
            points: points,
            fill: 'none',
            stroke: isSel ? 'rgba(255, 200, 0, 0.8)' : 'rgba(255,255,255,0.4)',
            'stroke-width': isSel ? '3' : '1.5',
            'stroke-dasharray': isSel ? 'none' : '4,4',
            style: 'pointer-events: none;'
        });

        pathsGroup.appendChild(hitPath);
        pathsGroup.appendChild(visPath);
    });
}

function drawUnitMarkers() {
    if (!markersGroup) return;
    while(markersGroup.firstChild) markersGroup.removeChild(markersGroup.firstChild);
    
    (MODEL.units || []).forEach((u, i) => {
        if (!u.path || u.path.length < 2) return;

        const isSel = state.selected && state.selected.kind === 'unit' && state.selected.key === i;

        // Draw Kunai
        const p1 = u.path[u.currentSegment];
        const p2 = u.path[u.currentSegment + 1];
        
        // Lerp position on current segment
        const x = p1[0] + (p2[0] - p1[0]) * u.t;
        const y = p1[1] + (p2[1] - p1[1]) * u.t;
        
        // Calculate angle based on current direction of travel
        const dirX = (p2[0] - p1[0]) * u.direction;
        const dirY = (p2[1] - p1[1]) * u.direction;
        
        const angle = Math.atan2(dirY, dirX) * 180 / Math.PI + 270;

        const g = mk('g', {
            transform: `translate(${x * W / 100}, ${y * H / 100}) rotate(${angle}) scale(0.8)`
        });
        g.innerHTML = KUNAI_SVG_CONTENT;
        g.style.filter = "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))";
        
        // Kunai selection
        g.addEventListener('mousemove', (e) => {
            if (state.mode === 'select') {
                e.stopPropagation();
                select('unit', i);
            }
        });

        markersGroup.appendChild(g);
    });
}
