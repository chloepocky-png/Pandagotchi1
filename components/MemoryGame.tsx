import React, { useState, useEffect } from 'react';

interface MemoryGameProps {
  onGameEnd: (score: number) => void;
}

const EMOJIS = ['🐼', '🎋', '💖', '⭐', '🎀', '🎉'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const generateCards = (): Card[] => {
  const duplicatedEmojis = [...EMOJIS, ...EMOJIS];
  const shuffled = duplicatedEmojis.sort(() => Math.random() - 0.5);
  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryGame: React.FC<MemoryGameProps> = ({ onGameEnd }) => {
  const [cards, setCards] = useState<Card[]>(generateCards());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.emoji === secondCard.emoji) {
        // Match
        setCards(prevCards =>
          prevCards.map(card =>
            card.emoji === firstCard.emoji ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedIndices([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedIndices, cards]);
  
  useEffect(() => {
    const allMatched = cards.every(card => card.isMatched);
    if (allMatched && cards.length > 0 && gameState === 'playing') {
      setGameState('finished');
      const score = Math.max(10, 50 - moves * 2); // Assure un gain minimum
      onGameEnd(score);
    }
  }, [cards, moves, onGameEnd, gameState]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].isFlipped) {
      return;
    }
    setCards(prevCards =>
      prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedIndices(prev => [...prev, index]);
  };
  
  const handlePlayAgain = () => {
      setCards(generateCards());
      setFlippedIndices([]);
      setMoves(0);
      setGameState('playing');
  }

  if (gameState === 'finished') {
     const score = Math.max(10, 50 - moves * 2);
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-[#B48491]">
        <h3 className="text-xl font-bold mb-2 text-[#E583A0]">Bravo !</h3>
        <p className="text-lg mb-1">Terminé en <span className="font-bold text-[#E583A0]">{moves}</span> coups.</p>
        <p className="text-lg mb-4">Tu as gagné <span className="font-bold text-yellow-500">{score}</span> pièces !</p>
        <button onClick={handlePlayAgain} className="px-4 py-2 bg-[#E583A0] text-white rounded-lg hover:bg-[#d86f8f] transition-colors">Rejouer</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
        <p className="text-sm text-center mb-4 text-[#B48491]">Trouve toutes les paires !</p>
        <div className="grid grid-cols-3 gap-2">
            {cards.map((card, index) => (
            <div key={card.id} className="w-16 h-20 perspective" onClick={() => handleCardClick(index)}>
                <div className={`relative w-full h-full preserve-3d transition-transform duration-500 ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-[#F9C2D1] rounded-lg flex items-center justify-center text-3xl text-white font-fredoka">?</div>
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-[#FDF3F6] rounded-lg flex items-center justify-center text-3xl rotate-y-180">{card.emoji}</div>
                </div>
            </div>
            ))}
        </div>
        <p className="mt-4 font-mono text-[#B48491]">Coups : {moves}</p>
        <style>{`
            .perspective { perspective: 1000px; }
            .preserve-3d { transform-style: preserve-3d; }
            .rotate-y-180 { transform: rotateY(180deg); }
            .backface-hidden { backface-visibility: hidden; }
        `}</style>
    </div>
  );
};

export default MemoryGame;