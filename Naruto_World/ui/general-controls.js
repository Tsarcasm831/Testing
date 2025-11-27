import { MODEL, state } from '../model.js';
import { drawAll } from '../render.js';
import { dumpJSON } from '../export-utils.js';
import { autosave } from '../utils.js';
import { select } from '../interactions.js';

export function initModeAndVisibilityControls(onModeChange) {
  document.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener('change', e => {
    state.mode = e.target.value;
    state.drawing = null;
    document.body.dataset.mode = state.mode;
    drawAll();
    onModeChange?.();
  }));
  document.getElementById('edit').addEventListener('change', e => { state.edit = e.target.checked; drawAll(); });
  const dm = document.getElementById('darkMode');
  if (dm) {
    dm.addEventListener('change', e => {
      if (e.target.checked) document.body.classList.add('dark');
      else document.body.classList.remove('dark');
    });
  }
  document.getElementById('hideBackground')?.addEventListener('change', e => {
    const bgImg = document.getElementById('backgroundImage');
    if (bgImg) bgImg.style.display = e.target.checked ? 'none' : '';
    drawAll();
  });
  const onToggle = id => { const el = document.getElementById(id); if (el) el.addEventListener('change', drawAll); };
  ['toggleLands', 'toggleRoads', 'toggleWalls', 'togglePOI', 'toggleRivers', 'toggleGrass', 'toggleForest', 'toggleMountains'].forEach(onToggle);
}

export function initMobileMenuToggle() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (!menuBtn) return;
  menuBtn.addEventListener('click', () => {
    document.getElementById('side').classList.toggle('open');
  });
}

export function initLandColorControl() {
  const sColor = document.getElementById('sColor');
  if (!sColor) return;
  sColor.addEventListener('input', e => {
    if (state.selected && state.selected.kind === 'land') {
      const land = MODEL.lands[state.selected.key];
      if (land) {
        land.color = e.target.value;
        drawAll();
      }
    }
  });
  sColor.addEventListener('change', () => {
    dumpJSON(); autosave(MODEL);
  });
}

export function initLegendControl() {
  const btn = document.getElementById('legendBtn');
  const modal = document.getElementById('landListModal');
  const close = document.getElementById('llClose');
  const list = document.getElementById('landList');

  if (!btn || !modal || !list) return;

  const populate = () => {
    list.innerHTML = '';
    const lands = Object.values(MODEL.lands).sort((a, b) => {
        const getNum = id => {
            const match = id.match(/Land(\d+)/);
            return match ? parseInt(match[1]) : 9999;
        };
        const na = getNum(a.id);
        const nb = getNum(b.id);
        if (na !== nb) return na - nb;
        return a.id.localeCompare(b.id);
    });
    
    lands.forEach(land => {
      const li = document.createElement('li');
      
      if (land.id.includes('_Island')) {
         li.style.paddingLeft = '36px';
         li.innerHTML = `<b style="border:none; background:transparent; color: var(--ink); min-width:20px">•</b> <span>${land.name || land.id}</span>`;
      } else {
         const num = land.id.replace(/\D/g, '');
         li.innerHTML = `<b>${num}</b> <span>${land.name || land.id}</span>`;
      }

      li.addEventListener('click', () => {
         select('land', land.id);
         modal.hidden = true;
      });
      list.appendChild(li);
    });
  };

  btn.addEventListener('click', () => {
    populate();
    modal.hidden = false;
  });

  close?.addEventListener('click', () => {
    modal.hidden = true;
  });
}
