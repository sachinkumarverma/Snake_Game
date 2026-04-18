import { memo } from 'react';

function HUD({ score, highScore, level, combo, difficulty, activePower, isPlaying, onPause }) {
  return (
    <div className="hud">
      <div className="hud-item score-display">
        <span className="hud-label">SCORE</span>
        <span className="hud-value">{score}</span>
      </div>
      <div className="hud-item">
        <span className="hud-label">BEST</span>
        <span className="hud-value best">{highScore[difficulty]}</span>
      </div>
      <div className="hud-item">
        <span className="hud-label">LEVEL</span>
        <span className="hud-value level">{level}</span>
      </div>
      {combo > 1 && (
        <div className="hud-item combo-display">
          <span className="combo-text">{combo}x COMBO</span>
        </div>
      )}
      {activePower && (
        <div className={`hud-item active-power ${activePower.type}`}>
          <span className="power-label">
            {activePower.type === 'speed' ? '\u26A1 SPEED' :
             activePower.type === 'ghost' ? '\uD83D\uDC7B GHOST' :
             activePower.type === 'magnet' ? '\uD83E\uDDF2 MAGNET' : '\u2702\uFE0F SHRINK'}
          </span>
        </div>
      )}
      {isPlaying && (
        <button className="hud-pause-btn" onClick={onPause} title="Pause">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export default memo(HUD);
