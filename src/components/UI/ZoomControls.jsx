import React from 'react';

const ZoomControls = ({ onZoomIn, onZoomOut }) => (
  <div className="flex flex-col items-center gap-2 mb-2">
    <button
      onTouchStart={onZoomIn}
      onMouseDown={onZoomIn}
      className="w-12 h-12 rounded-full border-2 bg-black/60 text-white border-gray-400 shadow-xl active:scale-95 transition-transform font-bold text-xl"
      aria-label="Zoom In"
      title="Zoom In"
    >
      ＋
    </button>
    <button
      onTouchStart={onZoomOut}
      onMouseDown={onZoomOut}
      className="w-12 h-12 rounded-full border-2 bg-black/60 text-white border-gray-400 shadow-xl active:scale-95 transition-transform font-bold text-xl"
      aria-label="Zoom Out"
      title="Zoom Out"
    >
      －
    </button>
  </div>
);

export default ZoomControls;
