import { memo } from 'react';

function MobileControls({ onDirection }) {
  const handleDir = (dir) => {
    onDirection(dir);
  };

  return (
    <div className="mobile-controls">
      <button className="dpad-btn up" onTouchStart={() => handleDir('UP')} onClick={() => handleDir('UP')}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>
      </button>
      <button className="dpad-btn left" onTouchStart={() => handleDir('LEFT')} onClick={() => handleDir('LEFT')}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l8-8v5h8v6h-8v5z"/></svg>
      </button>
      <button className="dpad-btn right" onTouchStart={() => handleDir('RIGHT')} onClick={() => handleDir('RIGHT')}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-8 8v-5H4v-6h8V4z"/></svg>
      </button>
      <button className="dpad-btn down" onTouchStart={() => handleDir('DOWN')} onClick={() => handleDir('DOWN')}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20l8-8h-5V4H9v8H4z"/></svg>
      </button>
    </div>
  );
}

export default memo(MobileControls);
