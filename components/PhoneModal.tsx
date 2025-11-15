
import React, { useState } from 'react';
import Shop from './Shop.tsx';
import MiniGame from './MiniGame.tsx';
import MemoryGame from './MemoryGame.tsx'; 
import RPSGame from './RPSGame.tsx';
import PandaSnap from './PandaSnap.tsx';
import GalleryApp from './GalleryApp.tsx';
import PandaChat from './PandaChat.tsx';
import FriendsApp from './FriendsApp.tsx';
import FriendChat from './FriendChat.tsx';
import { AccessoryName, PetState, PetStage, CapturedImage, Friend } from '../types.ts';

interface PhoneModalProps {
  onClose: () => void;
  coins: number;
  ownedAccessories: AccessoryName[];
  equippedAccessory: AccessoryName | null;
  petState: PetState;
  petStage: PetStage;
  onAddCoins: (amount: number) => void;
  onBuyAccessory: (accessory: AccessoryName) => boolean;
  onEquipAccessory: (accessory: AccessoryName) => void;
  userFriendCode: string;
}

type AppName = 'home' | 'shop' | 'game' | 'camera' | 'gallery' | 'chat' | 'friends';
type GameName = 'coin-rush' | 'memory' | 'rps';

const PhoneModal: React.FC<PhoneModalProps> = (props) => {
  const [currentApp, setCurrentApp] = useState<AppName>('home');
  const [activeGame, setActiveGame] = useState<GameName | null>(null);
  const [gallery, setGallery] = useState<CapturedImage[]>([]);
  const [chattingWith, setChattingWith] = useState<Friend | null>(null);
  
  const getHeader = () => {
      if (chattingWith) return `Chat avec ${chattingWith.name}`;

      switch(currentApp) {
          case 'shop': return 'Boutique';
          case 'camera': return 'Panda Snap';
          case 'gallery': return 'Galerie';
          case 'chat': return 'Panda Chat';
          case 'friends': return 'Portail des Amis';
          case 'game':
              if (activeGame === 'coin-rush') return 'Ruée vers les pièces';
              if (activeGame === 'memory') return 'Jeu de Mémoire';
              if (activeGame === 'rps') return 'Pierre-Feuille-Ciseaux';
              return 'Mini-Jeux';
          default: return 'Applications';
      }
  }

  const handleBack = () => {
    if (chattingWith) {
      setChattingWith(null);
      return;
    }
    if (activeGame) {
      setActiveGame(null);
    } else if (currentApp !== 'home') {
      setCurrentApp('home');
    }
  };

  const handleTakePhoto = (photo: CapturedImage) => {
    setGallery(prev => [photo, ...prev]);
  };

  const renderApp = () => {
    switch (currentApp) {
      case 'shop':
        return <Shop 
            coins={props.coins} 
            ownedAccessories={props.ownedAccessories} 
            equippedAccessory={props.equippedAccessory}
            onBuy={props.onBuyAccessory}
            onEquip={props.onEquipAccessory}
        />;
      case 'camera':
        return <PandaSnap 
            state={props.petState}
            stage={props.petStage}
            equippedAccessory={props.equippedAccessory}
            onTakePhoto={handleTakePhoto}
        />;
       case 'gallery':
        return <GalleryApp gallery={gallery} />;
      case 'chat':
        return <PandaChat petState={props.petState} />;
      case 'friends':
        return chattingWith ? 
          <FriendChat friend={chattingWith} /> : 
          <FriendsApp onSelectFriend={setChattingWith} userFriendCode={props.userFriendCode} />;
      case 'game':
          if (!activeGame) {
            return (
              <div className="grid grid-cols-2 gap-4 text-center pt-4">
                 <AppIcon icon="💰" label="Ruée" color="text-yellow-500" onClick={() => setActiveGame('coin-rush')} />
                 <AppIcon icon="🧠" label="Mémoire" color="text-pink-500" onClick={() => setActiveGame('memory')} />
                 <AppIcon icon="✌️" label="PFC" color="text-blue-500" onClick={() => setActiveGame('rps')} />
              </div>
            );
          }
          switch(activeGame) {
            case 'coin-rush':
              return <MiniGame onGameEnd={props.onAddCoins} />;
            case 'memory':
              return <MemoryGame onGameEnd={props.onAddCoins} />;
            case 'rps':
              return <RPSGame onGameEnd={props.onAddCoins} />;
          }
        return null;
      case 'home':
      default:
        return (
          <div className="grid grid-cols-3 gap-2 text-center pt-4">
             <AppIcon icon="🛍️" label="Boutique" color="text-yellow-500" onClick={() => setCurrentApp('shop')} />
             <AppIcon icon="🎮" label="Jeu" color="text-green-500" onClick={() => setCurrentApp('game')} />
             <AppIcon icon="📸" label="Photo" color="text-indigo-500" onClick={() => setCurrentApp('camera')} />
             <AppIcon icon="🖼️" label="Galerie" color="text-orange-500" onClick={() => setCurrentApp('gallery')} />
             <AppIcon icon="💬" label="Chat" color="text-purple-500" onClick={() => setCurrentApp('chat')} />
             <AppIcon icon="🌀" label="Portail" color="text-cyan-500" onClick={() => setCurrentApp('friends')} />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-[#FDF3F6] rounded-3xl p-3 w-full max-w-xs md:max-w-sm border-2 border-[#F7A6B9] shadow-2xl relative flex flex-col h-[500px] md:h-[600px]">
         <div className="flex justify-between items-center mb-2 text-[#B48491] px-2">
            {currentApp !== 'home' || activeGame || chattingWith ? (
                <button onClick={handleBack} className="hover:text-[#E583A0] transition-colors text-xl font-bold">←</button>
            ) : <div className="w-4"></div> }
            <div className="text-sm font-bold">
              <span>Pandagotchi OS</span>
            </div>
            <button onClick={props.onClose} className="hover:text-[#E583A0] transition-colors text-xl">×</button>
         </div>

         <div className="bg-white/80 rounded-2xl p-4 flex-grow overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-center text-[#E583A0] font-fredoka">{getHeader()}</h2>
                 <div className="font-bold text-yellow-500 flex items-center bg-white/50 px-2 py-1 rounded-full text-sm">
                    <span className="text-yellow-600 mr-1">💰</span>
                    {props.coins}
                 </div>
            </div>
            {renderApp()}
         </div>
         
      </div>
       <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

interface AppIconProps {
    icon: string;
    label: string;
    color: string;
    onClick: () => void;
}
const AppIcon: React.FC<AppIconProps> = ({ icon, label, color, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-[#F9C2D1]/40 transition-colors">
        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white flex items-center justify-center mb-1 shadow-sm`}>
            <div className={`text-3xl md:text-4xl`}>
                {icon}
            </div>
        </div>
        <span className="text-xs md:text-sm text-[#B48491]">{label}</span>
    </button>
);

export default PhoneModal;