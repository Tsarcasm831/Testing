import React from 'react';

const ActionButtons = ({
  holdRun,
  onRunDown,
  onRunUp,
  onInteract,
  onJump,
  onAttack,
  onDodge
}) => (
  <>
    <div className="flex gap-3">
      <button
        onTouchStart={onRunDown}
        onTouchEnd={onRunUp}
        onMouseDown={onRunDown}
        onMouseUp={onRunUp}
        className={`w-16 h-16 rounded-full border-2 ${holdRun ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-black/60 text-yellow-300 border-yellow-500'} shadow-xl active:scale-95 transition-transform font-bold`}
        aria-label="Run (hold)"
      >
        Run
      </button>
      <button
        onTouchStart={onInteract}
        onMouseDown={onInteract}
        className="w-16 h-16 rounded-full border-2 bg-black/60 text-blue-300 border-blue-500 shadow-xl active:scale-95 transition-transform font-bold"
        aria-label="Interact"
      >
        F
      </button>
    </div>
    <div className="flex gap-3">
      <button
        onTouchStart={onJump}
        onMouseDown={onJump}
        className="w-16 h-16 rounded-full border-2 bg-black/60 text-green-300 border-green-500 shadow-xl active:scale-95 transition-transform font-bold"
        aria-label="Jump"
      >
        ⤴︎
      </button>
      <button
        onTouchStart={onAttack}
        onMouseDown={onAttack}
        className="w-20 h-20 rounded-full border-2 bg-black/70 text-red-300 border-red-500 shadow-2xl active:scale-95 transition-transform font-bold text-xl"
        aria-label="Attack"
      >
        ⚔️
      </button>
      <button
        onTouchStart={onDodge}
        onMouseDown={onDodge}
        className="w-16 h-16 rounded-full border-2 bg-black/60 text-purple-300 border-purple-500 shadow-xl active:scale-95 transition-transform font-bold"
        aria-label="Dodge"
      >
        ⇲
      </button>
    </div>
  </>
);

export default ActionButtons;
