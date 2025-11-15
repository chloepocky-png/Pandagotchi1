import React from 'react';
import { Friend } from '../types.ts';

interface FriendsAppProps {
    onSelectFriend: (friend: Friend) => void;
    userFriendCode: string;
}

// Composant de remplacement pour éviter le crash lié à l'API.
const FriendsApp: React.FC<FriendsAppProps> = ({ userFriendCode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-[#B48491]">
      <p className="font-bold text-lg">Fonctionnalité en construction</p>
      <p className="text-sm mt-2">Le portail des amis arrive bientôt !</p>
      <div className="mt-4 p-2 bg-white/80 rounded-lg text-xs">
        <p>Ton code ami : <span className="font-bold">{userFriendCode}</span></p>
      </div>
    </div>
  );
};

export default FriendsApp;
