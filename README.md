# Snake - Modern Edition

A feature-rich, modern snake game built with React and Vite. Classic gameplay reimagined with levels, power-ups, combos, and a sleek dark UI.

## Features

- **4 Difficulty Modes** -- Easy, Medium, Hard, Insane with different game speeds
- **Level Progression** -- levels advance as you score, introducing new challenges
- **Obstacles** -- appear from level 3 onwards, increasing in count
- **Portals** -- appear from level 5, teleporting the snake across the board
- **Combo System** -- eat food quickly for score multipliers up to 8x
- **Multiple Food Items** -- normal and bonus food (5x points) on the board
- **Power-ups** -- Speed, Ghost (pass through walls/self), Magnet (pull food), Shrink (reduce tail)
- **Persistent High Scores** -- per-difficulty high scores saved to localStorage
- **Background Music & Sound Effects** -- original MP3 audio with mute toggle
- **End-game Stats** -- food eaten, max combo, levels cleared, time played
- **Mobile Support** -- swipe controls + on-screen D-pad for touch devices
- **Responsive Design** -- works on desktop, tablet, and mobile
- **Particle Effects** -- explosions on eating food and on death
- **Screen Shake** -- impact feedback on collision

## Tech Stack

- **React 19** -- component-based UI
- **Vite** -- fast dev server and build tool
- **Web Audio API** -- MP3 playback for music and sound effects
- **localStorage** -- high score persistence
- **Pure CSS** -- animations, gradients, and responsive layout (no CSS framework)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/sachinkumarverma/Snake_Game.git
cd Snake_Game
npm install
```

### Development

```bash
npm run dev
```

Opens the game at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Controls

| Action     | Desktop             | Mobile         |
| ---------- | ------------------- | -------------- |
| Move       | WASD or Arrow Keys  | Swipe or D-pad |
| Pause      | Space or Escape     | Pause button   |
| Mute       | Mute button (top-right) | Same       |

## Project Structure

```
src/
  App.jsx              -- Main app component, audio integration
  App.css              -- All styles, responsive breakpoints
  main.jsx             -- Entry point
  components/
    GameBoard.jsx      -- Renders snake, food, obstacles, portals, power-ups
    HUD.jsx            -- Score, level, combo, pause button
    Overlay.jsx        -- Start screen, pause menu, game over screen
    Particles.jsx      -- Particle explosion effects
    MobileControls.jsx -- On-screen D-pad for touch devices
  hooks/
    useSnakeGame.js    -- Core game logic, state, collision, levels
    useAudio.js        -- Sound effects and background music
public/
  music/               -- MP3 audio files (food, gameover, move, music)
  favicon.svg          -- Snake favicon
```

## License

MIT
