import React from 'react';

interface GameOverModalProps {
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#FDF3F6] rounded-2xl p-8 text-center shadow-2xl border-2 border-[#E583A0] animate-fade-in">
        <h2 className="text-3xl font-bold text-[#E583A0] mb-4 font-fredoka">Partie Terminée</h2>
        <p className="text-[#B48491] mb-6">Ton panda s'est senti seul et s'est enfui.</p>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-[#84A17D] text-white font-bold rounded-lg
                     transition-transform transform
                     hover:bg-[#9AC093] hover:scale-105
                     active:bg-[#71896B]"
        >
          Rejouer
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameOverModal;