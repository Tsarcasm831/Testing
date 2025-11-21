import { MODEL } from '../model.js';
import { LAND_ICONS } from '../constants.js';

export function initMiniLandModal() {
  const closeBtn = document.getElementById('mmClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('miniLandModal').hidden = true;
    });
  }

  window.__showMiniLandModal = function(key) {
    const land = MODEL.lands[key];
    if (!land) return;

    const modal = document.getElementById('miniLandModal');
    const mmName = document.getElementById('mmName');
    const mmDesc = document.getElementById('mmDesc');
    const mmIcon = document.getElementById('mmIcon');
    const mmLink = document.getElementById('mmLink');

    mmName.textContent = land.name || land.id;
    mmDesc.textContent = land.desc || 'No description.';

    const iconSrc = LAND_ICONS[land.id] || LAND_ICONS[key];
    if (iconSrc) {
      mmIcon.src = iconSrc;
      mmIcon.hidden = false;
    } else {
      mmIcon.hidden = true;
    }

    const isBuiltIn = /^(Land|Island)\d+$/.test(land.id || key);
    mmLink.href = isBuiltIn ? `land-pages/${land.id || key}.html` : `land-pages/land.html?id=${land.id || key}`;

    modal.hidden = false;
  };
}
