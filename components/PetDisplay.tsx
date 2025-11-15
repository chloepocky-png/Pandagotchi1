import React from 'react';
import { PetState, PetStage } from '../types';

interface PetDisplayProps {
  state: PetState;
  stage: PetStage;
  equippedAccessory: null; // Accessories removed to match reference image
}

// New color palette from user's SVG
const PANDA_CREAM = '#FFF6EE';
const PANDA_DARK = '#71363A';
const PANDA_STROKE = '#7A3F44';
const PANDA_BLUSH = '#FFB6C7';


const Bubbles: React.FC = () => (
    <g className="animate-bubbles" style={{ pointerEvents: 'none' }}>
        <circle cx="20" cy="90" r="8" />
        <circle cx="120" cy="85" r="12" />
        <circle cx="60" cy="120" r="6" />
        <circle cx="45" cy="105" r="10" />
    </g>
);

const Sparkles: React.FC = () => (
    <g className="animate-sparkle" style={{ pointerEvents: 'none' }}>
        <path d="M 10 0 L 12 8 L 20 10 L 12 12 L 10 20 L 8 12 L 0 10 L 8 8 Z" transform="translate(25, 30) scale(0.6)" />
        <path d="M 10 0 L 12 8 L 20 10 L 12 12 L 10 20 L 8 12 L 0 10 L 8 8 Z" transform="translate(110, 50) scale(0.8)" />
        <path d="M 10 0 L 12 8 L 20 10 L 12 12 L 10 20 L 8 12 L 0 10 L 8 8 Z" transform="translate(35, 120) scale(0.7)" />
    </g>
);


const PandaFace: React.FC<{ state: PetState }> = ({ state }) => {
    const eyes = () => {
        switch (state) {
            case 'sad':
                return (
                    <g fill={PANDA_STROKE}>
                        {/* Smaller, sad eyes */}
                        <circle cx="-45" cy="-140" r="9" />
                        <circle cx="45" cy="-140" r="9" />
                    </g>
                );
            case 'sleeping':
            case 'bathing':
                 return (
                    <g stroke={PANDA_STROKE} strokeWidth="7" fill="none" strokeLinecap="round">
                        <path d="M -65 -140 q 20 22 40 0" />
                        <path d="M 25 -140 q 20 22 40 0" />
                    </g>
                );
            default: // happy, hungry, dirty
                return (
                    <g>
                        {/* Big, cute, round eyes with highlights */}
                        <circle cx="-45" cy="-140" r="12" fill={PANDA_STROKE} />
                        <circle cx="-42" cy="-143" r="4" fill="white" />
                        <circle cx="45" cy="-140" r="12" fill={PANDA_STROKE} />
                        <circle cx="48" cy="-143" r="4" fill="white" />
                    </g>
                );
        }
    };

    const mouth = () => {
        switch (state) {
            case 'sad':
                return (
                     <g stroke={PANDA_STROKE} strokeWidth="6" fill="none" strokeLinecap="round">
                        <path d="M -12 -105 q 12 -8 24 0" />
                    </g>
                );
            case 'hungry':
                 return (
                    <g>
                       <ellipse cx="0" cy="-105" rx="8" ry="10" fill={PANDA_STROKE} />
                    </g>
                );
            default: // happy, sleeping, bathing, dirty
                return (
                    <g stroke={PANDA_STROKE} strokeWidth="6" fill="none" strokeLinecap="round">
                        {/* Classic 'w' kawaii mouth */}
                        <path d="M 0 -115 q -8 10 -18 0" />
                        <path d="M 0 -115 q 8 10 18 0" />
                        <path d="M -10 -105 q 10 18 20 0" />
                    </g>
                );
        }
    };
    
    const cheeks = state !== 'sad' && (
        <g fill={PANDA_BLUSH}>
            <circle cx="-85" cy="-120" r="22" />
            <circle cx="85" cy="-120" r="22" />
        </g>
    );

    return (
        <g>
            {eyes()}
            {mouth()}
            {cheeks}
        </g>
    );
};

const PandaBody: React.FC = () => {
    const cream = PANDA_CREAM;
    const dark = PANDA_DARK;
    const stroke = PANDA_STROKE;
    
    return (
        <g>
            {/* Body */}
            <ellipse fill={cream} stroke={stroke} strokeWidth="8" cx="0" cy="50" rx="130" ry="110"/>
            
            {/* Feet */}
            <ellipse fill={dark} stroke={stroke} strokeWidth="6" cx="-70" cy="135" rx="40" ry="30"/>
            <ellipse fill={dark} stroke={stroke} strokeWidth="6" cx="70" cy="135" rx="40" ry="30"/>
            
            {/* Arms */}
            <ellipse fill={dark} stroke={stroke} strokeWidth="6" cx="-110" cy="45" rx="35" ry="50" transform="rotate(-10, -110, 45)"/>
            <ellipse fill={dark} stroke={stroke} strokeWidth="6" cx="110" cy="45" rx="35" ry="50" transform="rotate(10, 110, 45)"/>
            
            {/* Head */}
            <circle fill={cream} stroke={stroke} strokeWidth="8" cx="0" cy="-130" r="115"/>
            
            {/* Ears */}
            <circle fill={dark} stroke={stroke} strokeWidth="6" cx="-80" cy="-220" r="45"/>
            <circle fill={dark} stroke={stroke} strokeWidth="6" cx="80" cy="-220" r="45"/>
            
            {/* Eye Patches */}
            <ellipse fill={dark} stroke={stroke} strokeWidth="6" cx="-45" cy="-140" rx="45" ry="40"/>
            <ellipse fill={dark} stroke={stroke} strokeWidth="6" cx="45" cy="-140" rx="45" ry="40"/>
        </g>
    );
};

const PandaExtras: React.FC<{ state: PetState }> = ({ state }) => {
    if (state === 'dirty') {
        return (
            <g fill="#BCA38C" opacity="0.6">
              <path d="M -90 -100 Q -80 -110 -70 -95 Z" />
              <circle cx="80" cy="60" r="12" />
            </g>
        );
    }
    return null;
};

const CurrentPet: React.FC<{ state: PetState }> = ({ state }) => {
    return (
        <g className={state === 'happy' ? 'animate-happy-bounce' : ''}>
            <PandaBody />
            <PandaFace state={state} />
            <PandaExtras state={state} />
        </g>
    );
};


const PetDisplay: React.FC<PetDisplayProps> = ({ state, stage }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes happy-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-happy-bounce {
          animation: happy-bounce 0.8s ease-in-out infinite;
        }

        @keyframes rise-and-pop {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translateY(-80px) scale(1.2); opacity: 0; }
        }
        .animate-bubbles > * {
          animation: rise-and-pop 2s infinite ease-out;
          transform-origin: center;
          fill: rgba(180, 216, 228, 0.7);
          stroke: rgba(255, 255, 255, 0.9);
          stroke-width: 1.5;
        }
        .animate-bubbles > *:nth-child(2) { animation-delay: 0.5s; animation-duration: 2.5s; }
        .animate-bubbles > *:nth-child(3) { animation-delay: 1.2s; animation-duration: 1.8s; }
        .animate-bubbles > *:nth-child(4) { animation-delay: 1.6s; animation-duration: 2.2s; }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        .animate-sparkle > * {
          animation: sparkle 1.5s infinite ease-out;
          transform-origin: center;
          fill: rgba(255, 255, 255, 0.9);
          stroke: rgba(180, 216, 228, 0.9);
          stroke-width: 0.5;
        }
        .animate-sparkle > *:nth-child(2) { animation-delay: 0.3s; }
        .animate-sparkle > *:nth-child(3) { animation-delay: 0.6s; }
      `}</style>
      <svg viewBox="-150 -320 300 450" className="w-full h-full">
        <CurrentPet state={state} />
         {state === 'bathing' && (
            <g transform="translate(-50, -50)"> {/* Adjust position of effects */}
                <Bubbles />
                <Sparkles />
            </g>
        )}
      </svg>
    </div>
  );
};

export default PetDisplay;