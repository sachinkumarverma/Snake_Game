import { memo } from 'react';

const CELL_PERCENT = 100 / 25;

function GameBoard({ snake, foods, obstacles, portals, powerUp, activePower, trail }) {
  const isGhost = activePower?.type === 'ghost';

  return (
    <div className="game-board">
      {/* Grid lines */}
      <div className="grid-overlay" />

      {/* Trail */}
      {trail.map((t, i) => (
        <div
          key={`trail-${i}`}
          className="trail-cell"
          style={{
            left: `${t.x * CELL_PERCENT}%`,
            top: `${t.y * CELL_PERCENT}%`,
            width: `${CELL_PERCENT}%`,
            height: `${CELL_PERCENT}%`,
            opacity: t.opacity * 0.3,
          }}
        />
      ))}

      {/* Obstacles */}
      {obstacles.map((o, i) => (
        <div
          key={`obs-${i}`}
          className="cell obstacle"
          style={{
            left: `${o.x * CELL_PERCENT}%`,
            top: `${o.y * CELL_PERCENT}%`,
            width: `${CELL_PERCENT}%`,
            height: `${CELL_PERCENT}%`,
          }}
        />
      ))}

      {/* Portals */}
      {portals.map((p, i) => (
        <div
          key={`portal-${i}`}
          className="cell portal"
          style={{
            left: `${p.x * CELL_PERCENT}%`,
            top: `${p.y * CELL_PERCENT}%`,
            width: `${CELL_PERCENT}%`,
            height: `${CELL_PERCENT}%`,
          }}
        >
          <div className="portal-inner" />
        </div>
      ))}

      {/* Food */}
      {foods.map((f, i) => (
        <div
          key={`food-${i}`}
          className={`cell food ${f.type}`}
          style={{
            left: `${f.x * CELL_PERCENT}%`,
            top: `${f.y * CELL_PERCENT}%`,
            width: `${CELL_PERCENT}%`,
            height: `${CELL_PERCENT}%`,
          }}
        />
      ))}

      {/* Power-up */}
      {powerUp && (
        <div
          className={`cell power-up ${powerUp.type}`}
          style={{
            left: `${powerUp.position.x * CELL_PERCENT}%`,
            top: `${powerUp.position.y * CELL_PERCENT}%`,
            width: `${CELL_PERCENT}%`,
            height: `${CELL_PERCENT}%`,
          }}
        >
          <span className="power-icon">
            {powerUp.type === 'speed' ? '\u26A1' : powerUp.type === 'ghost' ? '\uD83D\uDC7B' : powerUp.type === 'magnet' ? '\uD83E\uDDF2' : '\u2702\uFE0F'}
          </span>
        </div>
      )}

      {/* Snake */}
      {snake.map((s, i) => {
        const isHead = i === 0;
        const progress = i / snake.length;
        return (
          <div
            key={`snake-${i}`}
            className={`cell snake-segment ${isHead ? 'head' : ''} ${isGhost ? 'ghost' : ''}`}
            style={{
              left: `${s.x * CELL_PERCENT}%`,
              top: `${s.y * CELL_PERCENT}%`,
              width: `${CELL_PERCENT}%`,
              height: `${CELL_PERCENT}%`,
              '--segment-index': i,
              '--segment-progress': progress,
              zIndex: snake.length - i,
            }}
          >
            {isHead && (
              <div className="snake-eyes">
                <div className="eye left" />
                <div className="eye right" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default memo(GameBoard);
