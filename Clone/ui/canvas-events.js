import { svg } from '../constants.js';
import { canvasDown, finishDrawing } from '../interactions.js';

export function initCanvasEvents() {
  svg.addEventListener('dblclick', finishDrawing);
  // Use mousemove to avoid resetting state on every mouse movement while hovering the map
  svg.addEventListener('mousemove', canvasDown);
  svg.addEventListener('mousemove', e => {
    if (window.innerWidth <= 980) {
      const side = document.getElementById('side');
      if (side.classList.contains('open') && !side.contains(e.target) && e.target.id !== 'mobileMenuBtn') {
        side.classList.remove('open');
      }
    }
  });
}
