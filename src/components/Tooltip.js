import React from 'react';

const Tooltip = ({ text, position }) => {
  if (!text) return null;
  return (
    <div style={{ position: 'absolute', left: position.x, top: position.y, backgroundColor: 'white', padding: 5 }}>
      {text}
    </div>
  );
};

export default Tooltip;
