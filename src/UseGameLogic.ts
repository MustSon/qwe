import { useState, useEffect, useRef, useCallback } from "react";
import { getFeedback } from "./components/ScoreCalc";

export const GAME_CONFIG = {
  INITIAL_DIFFICULTY_MENU: 150,
  INITIAL_DIFFICULTY_GAME: 3,
  MAX_SPEED: 160,
  TILE_ACTIVE_DURATION: 350,
  LETTER_ACTIVE_DURATION: 100,
  GAME_INTERVAL_START: 510,
  GAME_INTERVAL_MENU: "200",
  SPLASH_DURATION: 300,
  TIMER_INTERVAL: 20,
  TIMING_TOLERANCE: 100,
  PEFECT_HIT_MULTI: 5
} as const;

export const TILES_DATA = [
  { color: "red", letter: "Q" },
  { color: "green", letter: "W" },
  { color: "yellow", letter: "E" },
] as const;

const NUM_NOTES = 1148;
const NOTES = Array.from(
  { length: NUM_NOTES },
  (_, i) => `noteSounds/gamesNotes/note_${i}.mp3`
);

function playNote(index: number): void {
  const audio = new Audio(NOTES[index]);
  audio.currentTime = 0;
  audio.play().catch(err => console.error("Audio playback failed:", err));
}

export function useGameLogic() {

  const [started, setStarted] = useState(false);
  const [menuWait, setMenuWait] = useState(true);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [lost, setLost] = useState(false);
  const [splashEffect, setSplashEffect] = useState(false);
  const [splashTime, setSplashTime] = useState(0);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeTile, setActiveTile] = useState<number | null>(null);

  const gameInterval = useRef<number>(Number(GAME_CONFIG.GAME_INTERVAL_MENU));
  const speedChange = useRef(0);
  const currentTiles = useRef<number[]>([]);
  const time = useRef(0);
  const attempts = useRef(0);
  const difficulty =  useRef<number>(Number(GAME_CONFIG.INITIAL_DIFFICULTY_MENU));
  const tileIndex = useRef(0);
  const firstNote = useRef(true);

  const resetGame = useCallback(() => {
    currentTiles.current = [];
    tileIndex.current = 0;
    attempts.current = 0;
    firstNote.current = true;
    time.current = 0;
    difficulty.current = GAME_CONFIG.INITIAL_DIFFICULTY_MENU;
    setLost(true);
    setPlayerTurn(false);
    setStarted(false);
  }, []);

  const restartGame = useCallback(() => {
    setMenuWait(false);
    currentTiles.current = [];
    tileIndex.current = 0;
    attempts.current = 0;
    firstNote.current = true;
    time.current = 0;
    speedChange.current = 0;
    difficulty.current = GAME_CONFIG.INITIAL_DIFFICULTY_GAME;
    gameInterval.current = GAME_CONFIG.GAME_INTERVAL_START;
    setStarted(true);
    setLost(false);
    setScore(0);
    setCombo(1);
    setPlayerTurn(false);
  }, []);

  const startGame = useCallback(() => {
    restartGame();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!playerTurn|| lost) return;

      const key = e.key.toUpperCase();
      setActiveLetter(key);
      setTimeout(() => setActiveLetter(null), GAME_CONFIG.LETTER_ACTIVE_DURATION);
      
      playNote(attempts.current);

      const tileToPress = currentTiles.current[attempts.current];
      const expectedLetter = TILES_DATA[tileToPress].letter;
      const isCorrectKey = key === expectedLetter;

      const isInTimeWindow =
        time.current >= gameInterval.current - GAME_CONFIG.TIMING_TOLERANCE &&
        time.current <= gameInterval.current + GAME_CONFIG.TIMING_TOLERANCE;

      const isFirstNote = firstNote.current;
      const isValidInput = isFirstNote ? isCorrectKey : isCorrectKey && isInTimeWindow;
      if (isValidInput) {

        const feedback = getFeedback(time.current, firstNote.current,gameInterval.current);

        if (feedback.multi !== 0) {
            if(feedback.multi===GAME_CONFIG.PEFECT_HIT_MULTI){
              console.log("lul");
                setCombo((prev) => prev+0.05);
            }else {
                setCombo(1);
            }
          setScore((prev) =>
            prev === 0 ? 1 + feedback.multi : Math.round((prev + feedback.multi)*combo)
          );
        }

        setSplashTime(time.current);
        setSplashEffect(true);
        setTimeout(() => setSplashEffect(false), GAME_CONFIG.SPLASH_DURATION);

        time.current = 0;
        setTimeout(() => (firstNote.current = false), GAME_CONFIG.SPLASH_DURATION-speedChange.current);

        attempts.current += 1;

        if (currentTiles.current.length === attempts.current) {
          setPlayerTurn(false);
          difficulty.current += 1;
          attempts.current = 0;
          gameInterval.current-=20;
          if(speedChange.current<GAME_CONFIG.MAX_SPEED) speedChange.current += 20;
        }
      } else {
        resetGame();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playerTurn, lost, resetGame]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if ((!started || playerTurn || lost) &&!menuWait) return;

      if (currentTiles.current.length < difficulty.current) {
        const rand = Math.floor(Math.random() * TILES_DATA.length);
        currentTiles.current.push(rand);
      }

      const currentIndex = tileIndex.current;
      setActiveTile(currentTiles.current[currentIndex]);
      playNote(currentIndex);
      tileIndex.current += 1;

      if (tileIndex.current === difficulty.current) {
        tileIndex.current = 0;
        firstNote.current = true;
        setPlayerTurn(true);
      }

      setTimeout(() => setActiveTile(null), GAME_CONFIG.TILE_ACTIVE_DURATION-(speedChange.current)*0.1);
    }, gameInterval.current);

    return () => clearInterval(id);
  }, [started, playerTurn, lost]);

  useEffect(() => {
    if (!playerTurn) return;

    const id = window.setInterval(() => {
      time.current += GAME_CONFIG.TIMER_INTERVAL;
    }, GAME_CONFIG.TIMER_INTERVAL);

    return () => clearInterval(id);
  }, [playerTurn]);

  return {
    started,
    score,
    playerTurn,
    lost,
    splashEffect,
    splashTime,
    activeLetter,
    activeTile,
    firstNote: firstNote.current,
    gameInterval: gameInterval.current,
    combo,
    menuWait,
    startGame,
    resetGame,
    restartGame,
  };
}