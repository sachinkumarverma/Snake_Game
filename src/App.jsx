import { useEffect, useRef, useCallback } from 'react';
import useSnakeGame from './hooks/useSnakeGame';
import useAudio from './hooks/useAudio';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import Overlay from './components/Overlay';
import Particles from './components/Particles';
import MobileControls from './components/MobileControls';
import './App.css';

export default function App() {
  const game = useSnakeGame();
  const audio = useAudio();
  const containerRef = useRef(null);
  const prevScoreRef = useRef(0);
  const prevLevelRef = useRef(1);

  useEffect(() => {
    if (game.score > prevScoreRef.current) {
      audio.play('eat');
    }
    prevScoreRef.current = game.score;
  }, [game.score, audio]);

  useEffect(() => {
    if (game.level > prevLevelRef.current) {
      audio.play('levelUp');
    }
    prevLevelRef.current = game.level;
  }, [game.level, audio]);

  useEffect(() => {
    if (game.gameState === 'gameover') {
      audio.stopBgm();
      audio.play('die');
    } else if (game.gameState === 'paused') {
      audio.pauseBgm();
    } else if (game.gameState === 'idle') {
      audio.stopBgm();
    }
  }, [game.gameState, audio]);

  useEffect(() => {
    if (game.activePower) {
      audio.play('powerUp');
    }
  }, [game.activePower, audio]);

  useEffect(() => {
    const handler = (e) => game.handleKeyDown(e);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [game.handleKeyDown]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleMobileDirection = useCallback((dir) => {
    game.handleKeyDown({
      key: { UP: 'ArrowUp', DOWN: 'ArrowDown', LEFT: 'ArrowLeft', RIGHT: 'ArrowRight' }[dir],
      preventDefault: () => {},
    });
  }, [game.handleKeyDown]);

  const handleOverlayStart = useCallback(() => {
    if (game.gameState === 'paused') {
      game.togglePause();
      audio.startBgm();
    } else {
      game.startGame();
      audio.startBgm();
    }
  }, [game.gameState, game.startGame, game.togglePause, audio]);

  const handleClose = useCallback(() => {
    game.resetToIdle();
  }, [game.resetToIdle]);

  return (
    <div
      className={`app ${game.screenShake ? 'shake' : ''}`}
      ref={containerRef}
      tabIndex={0}
      onTouchStart={game.handleTouchStart}
      onTouchEnd={game.handleTouchEnd}
    >
      <div className="bg-grid" />
      <div className="bg-gradient" />

      <div className="game-container">
        <HUD
          score={game.score}
          highScore={game.highScore}
          level={game.level}
          combo={game.combo}
          difficulty={game.difficulty}
          activePower={game.activePower}
          isPlaying={game.gameState === 'playing'}
          onPause={game.togglePause}
        />

        <div className="board-wrapper">
          <GameBoard
            snake={game.snake}
            foods={game.foods}
            obstacles={game.obstacles}
            portals={game.portals}
            powerUp={game.powerUp}
            activePower={game.activePower}
            trail={game.trail}
            GRID_SIZE={game.GRID_SIZE}
          />
          <Particles particles={game.particles} />
        </div>

        <Overlay
          gameState={game.gameState}
          score={game.score}
          stats={game.stats}
          highScore={game.highScore}
          difficulty={game.difficulty}
          onStart={handleOverlayStart}
          onDifficultyChange={game.setDifficulty}
          onClose={handleClose}
        />

        <MobileControls onDirection={handleMobileDirection} />
      </div>

      <button className="mute-btn" onClick={audio.toggleMute} title={audio.muted ? 'Unmute' : 'Mute'}>
        {audio.muted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
          </svg>
        )}
      </button>
    </div>
  );
}
