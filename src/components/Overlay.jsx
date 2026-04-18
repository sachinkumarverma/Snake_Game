import { memo } from 'react';

function Overlay({ gameState, score, stats, highScore, difficulty, onStart, onDifficultyChange, onClose }) {
  if (gameState === 'playing') return null;

  return (
    <div className="overlay">
      <div className="overlay-content">
        {/* Close button on paused & gameover */}
        {(gameState === 'paused' || gameState === 'gameover') && (
          <button className="overlay-close-btn" onClick={onClose} title="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}

        {gameState === 'idle' && (
          <>
            <div className="logo">
              <span className="logo-icon">{'\uD83D\uDC0D'}</span>
              <h1>SNAKE</h1>
              <p className="subtitle">MODERN EDITION</p>
            </div>

            <div className="difficulty-selector">
              {['easy', 'medium', 'hard', 'insane'].map(d => (
                <button
                  key={d}
                  className={`diff-btn ${d === difficulty ? 'active' : ''}`}
                  onClick={() => onDifficultyChange(d)}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>

            <button className="play-btn" onClick={onStart}>
              PLAY
            </button>

            <div className="controls-info">
              <p>WASD or Arrow Keys to move</p>
              <p>Space to pause &middot; Swipe on mobile</p>
            </div>

            <div className="high-scores">
              <h3>HIGH SCORES</h3>
              <div className="scores-grid">
                {Object.entries(highScore).map(([d, s]) => (
                  <div key={d} className="score-entry">
                    <span className="diff-label">{d}</span>
                    <span className="diff-score">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {gameState === 'paused' && (
          <>
            <h2>PAUSED</h2>
            <p className="pause-hint">Press Space or Escape to resume</p>
            <button className="play-btn" onClick={onStart}>
              RESUME
            </button>
          </>
        )}

        {gameState === 'gameover' && (
          <>
            <h2 className="game-over-title">GAME OVER</h2>
            <div className="final-score">
              <span className="final-label">SCORE</span>
              <span className="final-value">{score}</span>
            </div>

            <div className="stats-grid">
              <div className="stat">
                <span className="stat-value">{stats.foodEaten}</span>
                <span className="stat-label">Food Eaten</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.maxCombo}x</span>
                <span className="stat-label">Max Combo</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.levelsCleared}</span>
                <span className="stat-label">Levels</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.timePlayed}s</span>
                <span className="stat-label">Time</span>
              </div>
            </div>

            {score >= highScore[difficulty] && score > 0 && (
              <div className="new-record">NEW RECORD!</div>
            )}

            <div className="gameover-buttons">
              <button className="play-btn" onClick={onStart}>
                PLAY AGAIN
              </button>
              <button className="close-btn-secondary" onClick={onClose}>
                CLOSE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(Overlay);
