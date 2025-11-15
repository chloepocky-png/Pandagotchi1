import React from 'react';
import { Friend } from '../types';

interface FriendChatProps {
    friend: Friend;
}

// Composant de remplacement pour éviter le crash lié à l'API.
const FriendChat: React.FC<FriendChatProps> = ({ friend }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-[#B48491]">
      <p className="font-bold text-lg">Fonctionnalité en construction</p>
      <p className="text-sm mt-2">Le chat avec {friend.name} sera bientôt disponible !</p>
    </div>
  );
};

export default FriendChat;