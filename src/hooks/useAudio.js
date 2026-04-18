import { useRef, useCallback, useState, useEffect } from 'react';

const SOUND_FILES = {
  eat: '/music/food.mp3',
  die: '/music/gameover.mp3',
  move: '/music/move.mp3',
  levelUp: '/music/food.mp3',
  powerUp: '/music/food.mp3',
};

const BGM_FILE = '/music/music.mp3';

export default function useAudio() {
  const soundsRef = useRef({});
  const bgmRef = useRef(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(() => {
    const val = localStorage.getItem('snake-muted') === 'true';
    mutedRef.current = val;
    return val;
  });

  useEffect(() => {
    localStorage.setItem('snake-muted', muted);
    mutedRef.current = muted;

    if (bgmRef.current) {
      bgmRef.current.muted = muted;
    }
  }, [muted]);

  // Preload all sound effects
  useEffect(() => {
    Object.entries(SOUND_FILES).forEach(([name, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.4;
      soundsRef.current[name] = audio;
    });

    const bgm = new Audio(BGM_FILE);
    bgm.loop = true;
    bgm.volume = 0.25;
    bgm.preload = 'auto';
    bgmRef.current = bgm;

    return () => {
      bgm.pause();
      bgm.src = '';
    };
  }, []);

  // Stable callbacks — use refs to avoid dependency on muted state
  const play = useCallback((name) => {
    if (mutedRef.current) return;

    const audio = soundsRef.current[name];
    if (!audio) return;

    try {
      const clone = audio.cloneNode();
      clone.volume = audio.volume;
      clone.play().catch(() => {});
    } catch {
      // Audio not available
    }
  }, []);

  const startBgm = useCallback(() => {
    if (!bgmRef.current) return;
    if (mutedRef.current) return;
    bgmRef.current.currentTime = 0;
    bgmRef.current.play().catch(() => {});
  }, []);

  const pauseBgm = useCallback(() => {
    if (!bgmRef.current) return;
    bgmRef.current.pause();
  }, []);

  const stopBgm = useCallback(() => {
    if (!bgmRef.current) return;
    bgmRef.current.pause();
    bgmRef.current.currentTime = 0;
  }, []);

  const toggleMute = useCallback(() => setMuted(m => !m), []);

  return { play, muted, toggleMute, startBgm, pauseBgm, stopBgm };
}
