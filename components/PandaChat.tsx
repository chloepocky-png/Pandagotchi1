import React from 'react';
import { PetState } from '../types.ts';

// Composant de remplacement pour éviter le crash lié à l'API.
const PandaChat: React.FC<{ petState: PetState }> = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-[#B48491]">
      <p className="font-bold text-lg">Fonctionnalité en construction</p>
      <p className="text-sm mt-2">Le chat avec ton panda sera bientôt disponible !</p>
    </div>
  );
};

export default PandaChat;
