import React from 'react';

const HealthBar = ({ health }) => {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10 }}>
      <div style={{ width: 100, height: 20, backgroundColor: 'red' }}>
        <div style={{ width: `${health}%`, height: 20, backgroundColor: 'green' }}></div>
      </div>
    </div>
  );
};

export default HealthBar;
