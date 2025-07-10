import { useEffect } from 'react';

const Controls = ({ player }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Basic control placeholder
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player]);

  return null;
};

export default Controls;
