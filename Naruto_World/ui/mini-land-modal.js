import { MODEL } from '../model.js';
import { LAND_ICONS } from '../constants.js';
import { pointInPolygon } from '../utils.js';
import { POI_PAGE_MAP } from '../poi-pages/poi-page-map.js';

export function initMiniLandModal() {
  const closeBtn = document.getElementById('mmClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('miniLandModal').hidden = true;
    });
  }

  // Setup Land Page Overlay
  const overlay = document.getElementById('landOverlay');
  const iframe = document.getElementById('landFrame');
  const overlayClose = document.getElementById('closeOverlayBtn');
  const mmLink = document.getElementById('mmLink');

  if (overlay && iframe && overlayClose && mmLink) {
    const closeOverlay = () => {
      overlay.hidden = true;
      iframe.src = 'about:blank'; // Unload content
      document.getElementById('miniLandModal').hidden = false; // Restore mini modal? Or maybe just close it.
    };

    overlayClose.addEventListener('click', closeOverlay);

    // Intercept Enter Land click to open in overlay
    mmLink.addEventListener('click', (e) => {
      e.preventDefault();
      const url = mmLink.getAttribute('href');
      if (url && url !== '#') {
        document.getElementById('miniLandModal').hidden = true; // Hide mini modal
        iframe.src = url;
        overlay.hidden = false;
      }
    });

    // Listen for close requests from within the iframe
    window.addEventListener('message', (e) => {
      if (e.data === 'close-land-overlay') {
        closeOverlay();
      }
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
    mmLink.textContent = 'Enter Land';

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

  window.__showCityModal = function(key) {
    const poi = MODEL.poi[key];
    if (!poi) return;

    const modal = document.getElementById('miniLandModal');
    const mmName = document.getElementById('mmName');
    const mmDesc = document.getElementById('mmDesc');
    const mmIcon = document.getElementById('mmIcon');
    const mmLink = document.getElementById('mmLink');

    mmName.textContent = poi.name || poi.id;
    
    // Find containing land
    let foundLand = null;
    const pt = [poi.x, poi.y];
    for (const lid in MODEL.lands) {
      if (pointInPolygon(pt, MODEL.lands[lid].points)) {
        foundLand = MODEL.lands[lid];
        break;
      }
    }
    
    let desc = poi.desc || '';
    if (foundLand) {
       if (desc) desc += ` (${foundLand.name})`;
       else desc = `Located in ${foundLand.name}`;
    }
    mmDesc.textContent = desc || 'No description.';

    // Icon logic
    const iconSrc = poi.image || (foundLand ? LAND_ICONS[foundLand.id] : null) || 'assets/icons/C.png';
    if (iconSrc) {
      mmIcon.src = iconSrc;
      mmIcon.hidden = false;
    } else {
      mmIcon.hidden = true;
    }

    mmLink.textContent = "Travel to City";
    
    const pageUrl = POI_PAGE_MAP[poi.id] || POI_PAGE_MAP[poi.name];
    
    if (pageUrl) {
       mmLink.href = pageUrl;
       mmLink.hidden = false;
    } else if (foundLand) {
       const isBuiltIn = /^(Land|Island)\d+$/.test(foundLand.id);
       mmLink.href = isBuiltIn ? `land-pages/${foundLand.id}.html` : `land-pages/land.html?id=${foundLand.id}`;
       mmLink.hidden = false;
    } else {
       mmLink.hidden = true;
    }

    modal.hidden = false;
  };
}
