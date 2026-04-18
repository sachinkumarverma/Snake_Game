import { memo, useEffect, useState } from 'react';

function Particles({ particles }) {
  const [animated, setAnimated] = useState([]);

  useEffect(() => {
    if (particles.length === 0) {
      setAnimated([]);
      return;
    }
    setAnimated(particles.map(p => ({
      ...p,
      tx: Math.cos(p.angle) * p.speed * 15,
      ty: Math.sin(p.angle) * p.speed * 15,
    })));
  }, [particles]);

  return (
    <div className="particles-layer">
      {animated.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
          }}
        />
      ))}
    </div>
  );
}

export default memo(Particles);
