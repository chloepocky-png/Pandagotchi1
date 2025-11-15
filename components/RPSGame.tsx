import React, { useState, useEffect } from 'react';

interface RPSGameProps {
  onGameEnd: (score: number) => void;
}

type Choice = 'rock' | 'paper' | 'scissors';
const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];
const EMOJIS: Record<Choice, string> = { rock: '✊', paper: '✋', scissors: '✌️' };
const MAX_ROUNDS = 5;

const RPSGame: React.FC<RPSGameProps> = ({ onGameEnd }) => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('Fais ton choix !');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    if (playerChoice) {
      setIsResolving(true);
      const compChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
      setComputerChoice(compChoice);

      setTimeout(() => {
        if (playerChoice === compChoice) {
          setResult('Égalité ! (+2 pièces)');
          setScore(s => s + 2);
        } else if (
          (playerChoice === 'rock' && compChoice === 'scissors') ||
          (playerChoice === 'paper' && compChoice === 'rock') ||
          (playerChoice === 'scissors' && compChoice === 'paper')
        ) {
          setResult('Gagné ! (+5 pièces)');
          setScore(s => s + 5);
        } else {
          setResult('Perdu... (+1 pièce)');
          setScore(s => s + 1);
        }
        setRound(r => r + 1);
        setIsResolving(false);
      }, 1000);
    }
  }, [playerChoice]);

  useEffect(() => {
    if (round >= MAX_ROUNDS && !isFinished) {
      setIsFinished(true);
      onGameEnd(score);
    }
  }, [round, onGameEnd, score, isFinished]);

  const handleChoice = (choice: Choice) => {
    if (isFinished || isResolving) return;
    setPlayerChoice(choice);
    // This will trigger the useEffect
  };
  
  const handlePlayAgain = () => {
      setPlayerChoice(null);
      setComputerChoice(null);
      setResult('Fais ton choix !');
      setScore(0);
      setRound(0);
      setIsFinished(false);
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-[#B48491]">
        <h3 className="text-xl font-bold mb-2 text-[#E583A0]">Partie Terminée !</h3>
        <p className="text-lg mb-4">Tu as gagné un total de <span className="font-bold text-yellow-500">{score}</span> pièces !</p>
        <button onClick={handlePlayAgain} className="px-4 py-2 bg-[#E583A0] text-white rounded-lg hover:bg-[#d86f8f] transition-colors">Rejouer</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-sm mb-2 text-[#B48491]">Manche <span className="font-bold">{round + 1} / {MAX_ROUNDS}</span></p>
      
      <div className="flex justify-around w-full my-4 h-20 items-center">
        <div className="flex flex-col items-center">
            <span className="text-4xl animate-shake">{playerChoice ? EMOJIS[playerChoice] : '🤔'}</span>
            <span className="text-sm font-bold text-[#A76B79] mt-1">Toi</span>
        </div>
        <span className="text-lg font-bold text-[#E583A0]">vs</span>
        <div className="flex flex-col items-center">
            <span className="text-4xl animate-shake">{computerChoice && isResolving ? '❓' : computerChoice ? EMOJIS[computerChoice] : '🤔'}</span>
            <span className="text-sm font-bold text-[#A76B79] mt-1">Panda</span>
        </div>
      </div>

      <p className="text-lg font-bold h-10 my-2 text-[#B48491]">{result}</p>
      
      <div className="flex justify-center gap-4 mt-4">
        {CHOICES.map(choice => (
          <button
            key={choice}
            onClick={() => handleChoice(choice)}
            disabled={isResolving}
            className="w-16 h-16 text-4xl bg-[#FDF3F6] rounded-full shadow-md border-b-4 border-[#FAD1DC] transition-all hover:bg-white active:shadow-inner disabled:opacity-50"
          >
            {EMOJIS[choice]}
          </button>
        ))}
      </div>
      <style>{`
        @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-15deg); }
            75% { transform: rotate(15deg); }
        }
        .animate-shake {
             animation: ${isResolving && playerChoice ? 'shake 0.5s ease-in-out infinite' : 'none'};
        }
      `}</style>
    </div>
  );
};

export default RPSGame;