import { state } from './model.js';
import { drawAll } from './render.js';
import { dumpJSON } from './export-utils.js';
import { updateBrushPanel, initBrushControls } from './ui/brush-controls.js';
import { initModeAndVisibilityControls, initMobileMenuToggle, initLandColorControl } from './ui/general-controls.js';
import { initCanvasEvents } from './ui/canvas-events.js';
import { initKeyboardShortcuts } from './ui/keyboard.js';
import { initPoiControls } from './ui/poi-controls.js';
import { initSelectionPanel } from './ui/selection-panel.js';
import { initImportExportControls } from './ui/import-export.js';
import { initZoom, resetViewBox } from './ui/zoom.js';
import { initPieceInspector, updatePieceView } from './ui/piece-inspector.js';
import { initMiniLandModal } from './ui/mini-land-modal.js';

export function initUI() {
  initModeAndVisibilityControls(updateBrushPanel);
  initMobileMenuToggle();
  initLandColorControl();
  initSelectionPanel();
  initPoiControls();
  initImportExportControls();
  initBrushControls();
  initCanvasEvents();
  initZoom();
  initKeyboardShortcuts();
  initPieceInspector();
  initMiniLandModal();

  document.body.dataset.mode = state.mode;
  resetViewBox();
  drawAll(); dumpJSON(); updateBrushPanel(); updatePieceView();
}
