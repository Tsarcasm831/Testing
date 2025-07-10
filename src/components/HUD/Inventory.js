import React from 'react';

const Inventory = ({ items }) => {
  return (
    <div style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10 }}>
      {items.map((item, index) => (
        <div key={index} style={{ color: 'white' }}>{item}</div>
      ))}
    </div>
  );
};

export default Inventory;
