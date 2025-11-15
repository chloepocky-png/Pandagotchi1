import React, { useState, useEffect, useRef } from 'react';

interface MiniGameProps {
  onGameEnd: (score: number) => void;
}

const GAME_DURATION = 30; // seconds
const GAME_AREA_SIZE = 200; // px
const COIN_SIZE = 40; // px

const MiniGame: React.FC<MiniGameProps> = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [coinPosition, setCoinPosition] = useState({ top: 0, left: 0 });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);

  useEffect(() => {
    if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('finished');
      onGameEnd(score);
    }
  }, [timeLeft, gameState, onGameEnd, score]);


  const moveCoin = () => {
    const top = Math.random() * (GAME_AREA_SIZE - COIN_SIZE);
    const left = Math.random() * (GAME_AREA_SIZE - COIN_SIZE);
    setCoinPosition({ top, left });
  };
  
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    moveCoin();
  };

  const handleCoinClick = () => {
    if (gameState === 'playing') {
        setScore(score + 1);
        moveCoin();
    }
  };
  
  const handlePlayAgain = () => {
      setGameState('idle');
      setTimeLeft(GAME_DURATION);
      setScore(0);
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-[#B48491]">
        <h3 className="text-xl font-bold mb-2 text-[#E583A0]">Partie Terminée !</h3>
        <p className="text-lg mb-4">Tu as collecté <span className="font-bold text-yellow-500">{score}</span> pièces !</p>
        <button onClick={handlePlayAgain} className="px-4 py-2 bg-[#E583A0] text-white rounded-lg hover:bg-[#d86f8f] transition-colors">Rejouer</button>
      </div>
    );
  }
  
  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-[#B48491]">
        <h3 className="text-xl font-bold mb-2 text-[#E583A0]">Instructions</h3>
        <p className="text-sm mb-4">Clique sur la pièce autant de fois que possible en {GAME_DURATION} secondes !</p>
        <button onClick={startGame} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Démarrer le jeu</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
       <div className="flex justify-between w-full mb-2 font-mono text-[#B48491]">
           <span>Score : {score}</span>
           <span>Temps : {timeLeft}</span>
       </div>
      <div 
        className="relative bg-[#FDF3F6] border border-[#F7A6B9]/50 rounded-lg"
        style={{ width: `${GAME_AREA_SIZE}px`, height: `${GAME_AREA_SIZE}px` }}
      >
        <button
          onClick={handleCoinClick}
          className="absolute text-yellow-400 text-4xl transition-all duration-100 ease-linear"
          style={{ top: `${coinPosition.top}px`, left: `${coinPosition.left}px` }}
          aria-label="Pièce cliquable"
        >
          💰
        </button>
      </div>
    </div>
  );
};

export default MiniGame;
