import React, { useState } from 'react';
import { PetState, PetStage, AccessoryName, CapturedImage, BackgroundKey } from '../types';
import PetDisplay from './PetDisplay';

interface PandaSnapProps {
  state: PetState;
  stage: PetStage;
  equippedAccessory: AccessoryName | null;
  onTakePhoto: (photo: CapturedImage) => void;
}

const backgrounds = {
  none: { name: 'Aucun', style: 'linear-gradient(to bottom, #fde4e9, #fcebec)' },
  park: { name: 'Parc', style: 'linear-gradient(to bottom, #a8e063, #56ab2f)' },
  beach: { name: 'Plage', style: 'linear-gradient(to bottom, #2980b9, #6dd5fa, #ffffff)' },
  space: { name: 'Espace', style: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)' },
};


const PandaSnap: React.FC<PandaSnapProps> = (props) => {
  const [selectedBg, setSelectedBg] = useState<BackgroundKey>('none');
  const [isFlashing, setIsFlashing] = useState(false);

  const handleTakePhoto = () => {
    setIsFlashing(true);
    setTimeout(() => {
        const newPhoto: CapturedImage = { 
            id: Date.now(), 
            state: props.state,
            stage: props.stage,
            equippedAccessory: props.equippedAccessory,
            background: selectedBg 
        };
        props.onTakePhoto(newPhoto);
        setIsFlashing(false);
    }, 300);
  };
  
  return (
     <div className="flex flex-col items-center h-full">
        <div 
            className="w-full h-48 rounded-lg mb-4 border-2 border-white/80 shadow-inner flex items-center justify-center p-2 relative overflow-hidden"
            style={{ background: backgrounds[selectedBg].style }}
        >
            <PetDisplay state={props.state} stage={props.stage} equippedAccessory={props.equippedAccessory} />
             {isFlashing && <div className="absolute inset-0 bg-white opacity-80 animate-flash"></div>}
        </div>
        
        <div className="mb-2">
            <p className="text-sm font-bold text-center text-[#A76B79] mb-2">Arrière-plans :</p>
            <div className="flex gap-2 justify-center">
                {(Object.keys(backgrounds) as BackgroundKey[]).map(key => (
                    <button 
                        key={key}
                        onClick={() => setSelectedBg(key)}
                        className={`w-10 h-10 rounded-full border-2 transition-transform ${selectedBg === key ? 'border-pink-400 scale-110' : 'border-white'}`}
                        style={{ background: backgrounds[key].style }}
                        title={backgrounds[key].name}
                        aria-label={`Choisir l'arrière-plan ${backgrounds[key].name}`}
                    ></button>
                ))}
            </div>
        </div>
        
        <div className="mt-auto w-full flex justify-center items-center">
             <button 
                onClick={handleTakePhoto}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 active:bg-gray-200"
                aria-label="Prendre une photo"
            >
                <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-white"></div>
            </button>
        </div>
        <style>{`
            @keyframes flash {
                from { opacity: 0.8; }
                to { opacity: 0; }
            }
            .animate-flash {
                animation: flash 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default PandaSnap;