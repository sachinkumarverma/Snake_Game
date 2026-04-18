import { useState, useCallback, useRef, useEffect } from 'react';

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

const DIFFICULTY_SPEEDS = {
  easy: 120,
  medium: 85,
  hard: 55,
  insane: 35,
};

const GRID_SIZE = 25;

function randomPosition(snake = []) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function generateFood(snake, count = 1) {
  const foods = [];
  for (let i = 0; i < count; i++) {
    foods.push({ ...randomPosition([...snake, ...foods]), type: Math.random() < 0.15 ? 'bonus' : 'normal' });
  }
  return foods;
}

function generateObstacles(level, snake) {
  if (level < 3) return [];
  const count = Math.min(Math.floor(level / 2), 15);
  const obstacles = [];
  for (let i = 0; i < count; i++) {
    obstacles.push(randomPosition([...snake, ...obstacles]));
  }
  return obstacles;
}

function generatePortals(level) {
  if (level < 5) return [];
  const a = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
  let b;
  do {
    b = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
  } while (a.x === b.x && a.y === b.y);
  return [a, b];
}

const INITIAL_SNAKE = [
  { x: 12, y: 12 },
  { x: 11, y: 12 },
  { x: 10, y: 12 },
];

export default function useSnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [foods, setFoods] = useState(() => generateFood(INITIAL_SNAKE, 2));
  const [direction, setDirection] = useState('RIGHT');
  const [gameState, setGameState] = useState('idle'); // idle | playing | paused | gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-modern-highscore');
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0, insane: 0 };
  });
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState('medium');
  const [obstacles, setObstacles] = useState([]);
  const [portals, setPortals] = useState([]);
  const [combo, setCombo] = useState(0);
  const [comboTimer, setComboTimer] = useState(null);
  const [particles, setParticles] = useState([]);
  const [screenShake, setScreenShake] = useState(false);
  const [stats, setStats] = useState({ foodEaten: 0, timePlayed: 0, maxCombo: 0, levelsCleared: 0 });
  const [powerUp, setPowerUp] = useState(null); // null | { type, position, expiresAt }
  const [activePower, setActivePower] = useState(null); // null | { type, expiresAt }
  const [trail, setTrail] = useState([]);

  const dirRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodsRef = useRef(foods);
  const gameStateRef = useRef(gameState);
  const intervalRef = useRef(null);
  const lastDirRef = useRef(direction);
  const obstaclesRef = useRef(obstacles);
  const portalsRef = useRef(portals);
  const scoreRef = useRef(score);
  const levelRef = useRef(level);
  const comboRef = useRef(combo);
  const powerUpRef = useRef(powerUp);
  const activePowerRef = useRef(activePower);
  const startTimeRef = useRef(null);
  const inputQueueRef = useRef([]);

  useEffect(() => { dirRef.current = direction; }, [direction]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodsRef.current = foods; }, [foods]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { obstaclesRef.current = obstacles; }, [obstacles]);
  useEffect(() => { portalsRef.current = portals; }, [portals]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { powerUpRef.current = powerUp; }, [powerUp]);
  useEffect(() => { activePowerRef.current = activePower; }, [activePower]);

  const spawnParticles = useCallback((x, y, color, count = 8) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      x: x * (100 / GRID_SIZE) + (100 / GRID_SIZE) / 2,
      y: y * (100 / GRID_SIZE) + (100 / GRID_SIZE) / 2,
      color,
      angle: (Math.PI * 2 * i) / count + Math.random() * 0.5,
      speed: 2 + Math.random() * 3,
      life: 1,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 600);
  }, []);

  const triggerShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);
  }, []);

  const advanceLevel = useCallback((currentSnake, currentLevel) => {
    const newLevel = currentLevel + 1;
    const newObstacles = generateObstacles(newLevel, currentSnake);
    const newPortals = generatePortals(newLevel);
    setLevel(newLevel);
    setObstacles(newObstacles);
    setPortals(newPortals);
    setFoods(generateFood(currentSnake, Math.min(2 + Math.floor(newLevel / 3), 5)));
    setStats(s => ({ ...s, levelsCleared: s.levelsCleared + 1 }));
    return { obstacles: newObstacles, portals: newPortals };
  }, []);

  const maybeSpawnPowerUp = useCallback((currentSnake) => {
    if (powerUpRef.current || Math.random() > 0.12) return;
    const types = ['speed', 'ghost', 'magnet', 'shrink'];
    const type = types[Math.floor(Math.random() * types.length)];
    const position = randomPosition(currentSnake);
    setPowerUp({ type, position, spawnedAt: Date.now() });
  }, []);

  const tick = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;

    // Process input queue
    const queue = inputQueueRef.current;
    if (queue.length > 0) {
      const nextDir = queue.shift();
      if (nextDir !== OPPOSITE[lastDirRef.current]) {
        dirRef.current = nextDir;
      }
    }

    const currentSnake = [...snakeRef.current];
    const currentFoods = [...foodsRef.current];
    const currentDir = DIRECTIONS[dirRef.current];
    const head = { ...currentSnake[0] };

    lastDirRef.current = dirRef.current;

    head.x += currentDir.x;
    head.y += currentDir.y;

    // Wall handling
    const isGhost = activePowerRef.current?.type === 'ghost';
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      if (!isGhost) {
        // wrap mode
        head.x = (head.x + GRID_SIZE) % GRID_SIZE;
        head.y = (head.y + GRID_SIZE) % GRID_SIZE;
      } else {
        head.x = (head.x + GRID_SIZE) % GRID_SIZE;
        head.y = (head.y + GRID_SIZE) % GRID_SIZE;
      }
    }

    // Portal check
    const currentPortals = portalsRef.current;
    if (currentPortals.length === 2) {
      if (head.x === currentPortals[0].x && head.y === currentPortals[0].y) {
        head.x = currentPortals[1].x;
        head.y = currentPortals[1].y;
      } else if (head.x === currentPortals[1].x && head.y === currentPortals[1].y) {
        head.x = currentPortals[0].x;
        head.y = currentPortals[0].y;
      }
    }

    // Self collision
    if (!isGhost && currentSnake.some(s => s.x === head.x && s.y === head.y)) {
      setGameState('gameover');
      triggerShake();
      spawnParticles(head.x, head.y, '#ef4444', 16);
      clearInterval(intervalRef.current);

      setStats(s => {
        const timePlayed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        return { ...s, timePlayed: s.timePlayed + timePlayed };
      });

      setHighScore(prev => {
        const currentDiff = difficulty;
        const currentScore = scoreRef.current;
        if (currentScore > prev[currentDiff]) {
          const next = { ...prev, [currentDiff]: currentScore };
          localStorage.setItem('snake-modern-highscore', JSON.stringify(next));
          return next;
        }
        return prev;
      });
      return;
    }

    // Obstacle collision
    const currentObstacles = obstaclesRef.current;
    if (!isGhost && currentObstacles.some(o => o.x === head.x && o.y === head.y)) {
      setGameState('gameover');
      triggerShake();
      spawnParticles(head.x, head.y, '#ef4444', 16);
      clearInterval(intervalRef.current);
      setHighScore(prev => {
        const currentDiff = difficulty;
        const currentScore = scoreRef.current;
        if (currentScore > prev[currentDiff]) {
          const next = { ...prev, [currentDiff]: currentScore };
          localStorage.setItem('snake-modern-highscore', JSON.stringify(next));
          return next;
        }
        return prev;
      });
      return;
    }

    const newSnake = [head, ...currentSnake];

    // Food collision
    let ate = false;
    const eatenIndices = [];
    currentFoods.forEach((food, idx) => {
      const dist = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
      const magnetRange = activePowerRef.current?.type === 'magnet' ? 3 : 0;
      if (dist <= magnetRange && dist > 0) {
        // magnet pull food
        const dx = Math.sign(head.x - food.x);
        const dy = Math.sign(head.y - food.y);
        currentFoods[idx] = { ...food, x: food.x + dx, y: food.y + dy };
      }
      if (head.x === food.x && head.y === food.y) {
        ate = true;
        eatenIndices.push(idx);
        const points = food.type === 'bonus' ? 5 : 1;
        const comboMultiplier = Math.min(comboRef.current + 1, 8);
        setScore(s => s + points * comboMultiplier);
        setCombo(c => {
          const nc = c + 1;
          setStats(st => ({ ...st, maxCombo: Math.max(st.maxCombo, nc), foodEaten: st.foodEaten + 1 }));
          return nc;
        });
        spawnParticles(food.x, food.y, food.type === 'bonus' ? '#fbbf24' : '#22d3ee', 10);

        // Reset combo timer
        if (comboTimer) clearTimeout(comboTimer);
        const timer = setTimeout(() => setCombo(0), 3000);
        setComboTimer(timer);
      }
    });

    // PowerUp collision
    const currentPowerUp = powerUpRef.current;
    if (currentPowerUp && head.x === currentPowerUp.position.x && head.y === currentPowerUp.position.y) {
      setActivePower({ type: currentPowerUp.type, expiresAt: Date.now() + 8000 });
      setPowerUp(null);
      spawnParticles(head.x, head.y, '#a78bfa', 12);

      if (currentPowerUp.type === 'shrink' && newSnake.length > 4) {
        newSnake.splice(newSnake.length - 3, 3);
      }

      setTimeout(() => setActivePower(null), 8000);
    }

    if (!ate) {
      newSnake.pop();
    } else {
      const remaining = currentFoods.filter((_, i) => !eatenIndices.includes(i));
      const newFoods = [...remaining, ...generateFood(newSnake, eatenIndices.length)];
      setFoods(newFoods);
      maybeSpawnPowerUp(newSnake);

      // Level up every 10 food
      const currentScore = scoreRef.current;
      if (Math.floor(currentScore / 10) > Math.floor((currentScore - 1) / 10) && currentScore > 0) {
        advanceLevel(newSnake, levelRef.current);
      }
    }

    // Update trail
    setTrail(prev => {
      const next = [{ ...head, opacity: 0.6 }, ...prev.map(t => ({ ...t, opacity: t.opacity - 0.08 }))];
      return next.filter(t => t.opacity > 0).slice(0, 12);
    });

    setSnake(newSnake);
  }, [difficulty, triggerShake, spawnParticles, advanceLevel, maybeSpawnPowerUp, comboTimer]);

  const startGame = useCallback(() => {
    const initialSnake = INITIAL_SNAKE;
    setSnake(initialSnake);
    setFoods(generateFood(initialSnake, 2));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    lastDirRef.current = 'RIGHT';
    inputQueueRef.current = [];
    setScore(0);
    setLevel(1);
    setCombo(0);
    setObstacles([]);
    setPortals([]);
    setPowerUp(null);
    setActivePower(null);
    setTrail([]);
    setParticles([]);
    setGameState('playing');
    startTimeRef.current = Date.now();

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, DIFFICULTY_SPEEDS[difficulty]);
  }, [tick, difficulty]);

  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      clearInterval(intervalRef.current);
    } else if (gameState === 'paused') {
      setGameState('playing');
      intervalRef.current = setInterval(tick, DIFFICULTY_SPEEDS[difficulty]);
    }
  }, [gameState, tick, difficulty]);

  const handleKeyDown = useCallback((e) => {
    const keyMap = {
      ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
      w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
    };

    if (e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      if (gameState === 'idle' || gameState === 'gameover') {
        startGame();
      } else {
        togglePause();
      }
      return;
    }

    const newDir = keyMap[e.key];
    if (newDir && gameState === 'playing') {
      e.preventDefault();
      inputQueueRef.current.push(newDir);
      if (inputQueueRef.current.length > 3) inputQueueRef.current.shift();
    }
  }, [gameState, startGame, togglePause]);

  const resetToIdle = useCallback(() => {
    clearInterval(intervalRef.current);
    setSnake(INITIAL_SNAKE);
    setFoods(generateFood(INITIAL_SNAKE, 2));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    lastDirRef.current = 'RIGHT';
    inputQueueRef.current = [];
    setScore(0);
    setLevel(1);
    setCombo(0);
    setObstacles([]);
    setPortals([]);
    setPowerUp(null);
    setActivePower(null);
    setTrail([]);
    setParticles([]);
    setGameState('idle');
  }, []);

  // Swipe support
  const touchStartRef = useRef(null);
  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
      const newDir = dx > 0 ? 'RIGHT' : 'LEFT';
      inputQueueRef.current.push(newDir);
    } else if (Math.abs(dy) > minSwipe) {
      const newDir = dy > 0 ? 'DOWN' : 'UP';
      inputQueueRef.current.push(newDir);
    }
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Expire power-up after 10 seconds
  useEffect(() => {
    if (!powerUp) return;
    const timer = setTimeout(() => setPowerUp(null), 10000);
    return () => clearTimeout(timer);
  }, [powerUp]);

  return {
    snake, foods, direction: dirRef.current, gameState, score, highScore,
    level, difficulty, setDifficulty, obstacles, portals, combo,
    particles, screenShake, stats, powerUp, activePower, trail,
    startGame, togglePause, resetToIdle, handleKeyDown, handleTouchStart, handleTouchEnd,
    GRID_SIZE,
  };
}
