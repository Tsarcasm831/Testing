import { svg } from '../constants.js';
import { canvasDown, finishDrawing } from '../interactions.js';

export function initCanvasEvents() {
  svg.addEventListener('dblclick', finishDrawing);
  svg.addEventListener('mousedown', canvasDown);
  
  let moveThrottle = null;
  svg.addEventListener('mousemove', e => {
    if (moveThrottle) return;
    moveThrottle = requestAnimationFrame(() => {
      moveThrottle = null;
      if (window.innerWidth <= 980) {
        const side = document.getElementById('side');
        if (side.classList.contains('open') && !side.contains(e.target) && e.target.id !== 'mobileMenuBtn') {
          side.classList.remove('open');
        }
      }
    });
  });
}
