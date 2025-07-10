import React, { useState } from 'react';

/**
 * Simple build menu allowing placement of entities.
 */
const BuildMenu = ({ onPlaceEntity }) => {
  const [selected, setSelected] = useState(null);
  const entities = ['Tree', 'Rock', 'NPC'];

  return (
    <div style={{ position: 'absolute', bottom: 120, left: 10, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10 }}>
      {entities.map((e) => (
        <button key={e} onClick={() => setSelected(e)}>
          Place {e}
        </button>
      ))}
      <button onClick={() => onPlaceEntity(selected)}>Confirm</button>
    </div>
  );
};

export default BuildMenu;
