import React, { useState, useEffect, useCallback } from 'react';
import PetDisplay from './components/PetDisplay.tsx';
import StatusBar from './components/StatusBar.tsx';
import PhoneModal from './components/PhoneModal.tsx';
import ActionButton from './components/ActionButton.tsx';
import GameOverModal from './components/GameOverModal.tsx';
import { PetState, Stat, PetStage, AccessoryName } from './types.ts';
import { GAME_SPEED, MAX_STAT, STAT_DECAY_RATE, ACTION_AMOUNTS, EVOLUTION_AGE, ACCESSORIES, ACCESSORY_NAMES_FR, DAY_CYCLE_TICKS, NIGHT_START_TICK, SLEEP_STAT_DECAY_RATE } from './constants.ts';
import { useGameLoop } from './hooks/useGameLoop.ts';

const BambooIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.1511 20.8351C9.64333 21.0378 9.07333 21.0191 8.56333 20.7818C8.05333 20.5444 7.64333 20.1064 7.42167 19.5668L7.33333 19.3334C7.11167 18.7938 7.08556 18.2044 7.26 17.6667C6.44 17.3734 6 16.5867 6 15.6667V15.5C6 14.58 6.44 13.7934 7.26 13.5C7.08556 12.9624 7.11167 12.3729 7.33333 11.8334L7.42167 11.6C7.64333 11.0604 8.05333 10.6224 8.56333 10.3851C9.07333 10.1478 9.64333 10.1291 10.1511 10.3318L10.5 10.5V3C10.5 2.44772 10.9477 2 11.5 2C12.0523 2 12.5 2.44772 12.5 3V20.8351H10.1511Z" fill="#84A17D"/></svg>;
const JouerIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#F4A7A7"/><path d="M10.5 15.5V8.5L15.5 12L10.5 15.5Z" fill="white"/></svg>;
const ToilettesIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 11C7 9.89543 7.89543 9 9 9H15C16.1046 9 17 9.89543 17 11V18C17 19.1046 16.1046 20 15 20H9C7.89543 20 7 19.1046 7 18V11Z" fill="#B4D8E4"/><path d="M9 9H15V6C15 4.89543 14.1046 4 13 4H11C9.89543 4 9 4.89543 9 6V9Z" fill="#D6EBF2"/><rect x="10" y="7" width="4" height="2" rx="1" fill="#FFFFFF"/></svg>;
const BainIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.3636C4 11.259 4.89543 10.3636 6 10.3636H18C19.1046 10.3636 20 11.259 20 12.3636V13.3636H4V12.3636Z" fill="#DCD5F2"/><path d="M5.61364 12.0911C5.33642 10.1983 6.83028 8.5 8.74768 8.5H15.2523C17.1697 8.5 18.6636 10.1983 18.3864 12.0911L17.0359 21.0911C16.8138 22.5931 15.5288 23.6667 14.0019 23.6667H9.99811C8.47119 23.6667 7.18615 22.5931 6.96408 21.0911L5.61364 12.0911Z" fill="#C3B6E0"/><path d="M6 8C6 6.89543 6.89543 6 8 6H9V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V6H16C17.1046 6 18 6.89543 18 8V10H6V8Z" fill="#DCD5F2"/></svg>;
const PhoneIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="2" width="12" height="20" rx="2" fill="#D3C9E3"/><rect x="8" y="4" width="8" height="14" rx="1" fill="white"/><circle cx="12" cy="19" r="1" fill="#D3C9E3"/></svg>;


const App: React.FC = () => {
  const [stats, setStats] = useState<Record<Stat, number>>({
    hunger: MAX_STAT,
    happiness: MAX_STAT,
    cleanliness: MAX_STAT,
  });
  const [petState, setPetState] = useState<PetState>('sleeping');
  const [message, setMessage] = useState('Zzz... Ton panda dort paisiblement.');
  const [ageInTicks, setAgeInTicks] = useState(0);
  const [stage, setStage] = useState<PetStage>('baby');
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [coins, setCoins] = useState(0);
  const [ownedAccessories, setOwnedAccessories] = useState<AccessoryName[]>([]);
  const [equippedAccessory, setEquippedAccessory] = useState<AccessoryName | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('night');
  const [isBathing, setIsBathing] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [friendCode] = useState(() => {
    try {
      let code = localStorage.getItem('pandaFriendCode');
      if (!code) {
        code = `PANDA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        localStorage.setItem('pandaFriendCode', code);
      }
      return code;
    } catch (error) {
      console.error("Impossible d'accéder au localStorage pour le code ami :", error);
      return `PANDA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
  });

  const ageInDays = Math.floor(ageInTicks / DAY_CYCLE_TICKS);

  const handleStatDecay = useCallback(() => {
    if (isGameOver) return;

    const isSleeping = petState === 'sleeping';

    setStats(prevStats => {
      const decayRates = isSleeping ? SLEEP_STAT_DECAY_RATE : STAT_DECAY_RATE;
      const newStats: Record<Stat, number> = { ...prevStats };
      let statChanged = false;
      for (const key in newStats) {
        const stat = key as Stat;
        if (newStats[stat] > 0) {
          newStats[stat] = Math.max(0, newStats[stat] - decayRates[stat]);
          statChanged = true;
        }
      }
      return statChanged ? newStats : prevStats;
    });

    setAgeInTicks(prevTicks => {
      const newTicks = prevTicks + 1;
      const currentTickInDay = newTicks % DAY_CYCLE_TICKS;
      setTimeOfDay(currentTickInDay >= NIGHT_START_TICK ? 'night' : 'day');
      return newTicks;
    });
  }, [petState, isGameOver]);

  useGameLoop(handleStatDecay, GAME_SPEED);
  
  useEffect(() => {
    if (stage === 'baby' && ageInDays >= EVOLUTION_AGE) {
      setStage('adult');
      setMessage('Wow ! Ton panda évolue !');
      setStats({
        hunger: MAX_STAT,
        happiness: MAX_STAT,
        cleanliness: MAX_STAT,
      });
      setTimeout(() => setMessage(''), 3000);
    }
  }, [ageInDays, stage]);

  const handleWakeUp = useCallback(() => {
    if (petState === 'sleeping' && timeOfDay === 'day') {
        setMessage('Ton panda est réveillé et plein d\'énergie !');
        setPetState('happy');
        setTimeout(() => setMessage(''), 2000);
    }
  }, [petState, timeOfDay]);

  useEffect(() => {
    handleWakeUp();
  }, [timeOfDay, handleWakeUp]);
  
  useEffect(() => {
    if (isGameOver) {
      setPetState('sad');
      return;
    }
    if (stats.hunger <= 0 || stats.happiness <= 0) {
        setIsGameOver(true);
        setMessage('Oh non ! Ton panda est parti...');
        return;
    }
    
    if (isBathing) return;

    const canSleep = stats.happiness > 50 && stats.hunger > 40 && stats.cleanliness > 40;
    if (timeOfDay === 'night' && canSleep) {
      if (petState !== 'sleeping') {
        setPetState('sleeping');
        setMessage('Zzz... Ton panda dort paisiblement.');
      }
      return;
    }
    
    if (petState === 'sleeping' && timeOfDay === 'day') {
      handleWakeUp();
    }

    if (petState !== 'sleeping') {
       if (stats.hunger < 20) {
         setPetState('hungry');
       } else if (stats.cleanliness < 30) {
         setPetState('dirty');
       } else if (stats.happiness < 30) {
         setPetState('sad');
       } else {
         setPetState('happy');
       }
    }
  }, [stats, timeOfDay, isBathing, isGameOver, petState, handleWakeUp]);

  const performAction = (stat: Stat, amount: number, message: string) => {
    if (petState === 'sleeping' || isGameOver) return;
    setStats(prev => ({ ...prev, [stat]: Math.min(MAX_STAT, prev[stat] + amount) }));
    setMessage(message);
    setCoins(prev => prev + 1); // Gagne 1 pièce par action
    setTimeout(() => setMessage(''), 2000);
  };
  
  const handleFeed = () => performAction('hunger', ACTION_AMOUNTS.hunger, 'Miam ! C\'est bon le bambou !');
  const handlePlay = () => performAction('happiness', ACTION_AMOUNTS.happiness, 'On s\'amuse bien !');
  const handleClean = () => {
    if (petState === 'sleeping' || isGameOver) return;
    setIsBathing(true);
    setMessage('Splash ! Tout propre !');
    
    setTimeout(() => {
      performAction('cleanliness', ACTION_AMOUNTS.cleanliness, 'Je suis tout propre maintenant !');
      setIsBathing(false);
    }, 3000);
  };
  
  const handlePoo = () => {
    setMessage('Oops, il fallait bien que ça sorte...');
    setStats(prev => ({ ...prev, cleanliness: Math.max(0, prev.cleanliness - 40) }));
    setTimeout(() => setMessage(''), 2000);
  };

  const buyAccessory = (accessoryName: AccessoryName): boolean => {
    const accessory = ACCESSORIES[accessoryName];
    if (coins >= accessory.price) {
      setCoins(coins - accessory.price);
      setOwnedAccessories([...ownedAccessories, accessoryName]);
      return true;
    }
    return false;
  };

  const equipAccessory = (accessoryName: AccessoryName) => {
    if (equippedAccessory === accessoryName) {
      setEquippedAccessory(null); // Toggle off
    } else {
      setEquippedAccessory(accessoryName);
    }
  };
  
  const getPetState = (): PetState => {
      if (isGameOver) return 'sad';
      if (isBathing) return 'bathing';
      return petState;
  }
  
  const handleRestart = () => {
    setStats({
      hunger: MAX_STAT,
      happiness: MAX_STAT,
      cleanliness: MAX_STAT,
    });
    setPetState(timeOfDay === 'night' ? 'sleeping' : 'happy');
    setMessage(timeOfDay === 'night' ? 'Zzz...' : 'Prêt pour un nouveau départ !');
    setAgeInTicks(0);
    setStage('baby');
    setCoins(0);
    setOwnedAccessories([]);
    setEquippedAccessory(null);
    setIsGameOver(false);
  };

  const actionButtonsDisabled = petState === 'sleeping' || isBathing || isGameOver;

  return (
    <div className="bg-[#EAE6F9] min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-center text-[#A76B79] mb-4 font-fredoka">Pandagotchi</h1>
      <div className="relative w-full max-w-sm mx-auto bg-[#FDF3F6] rounded-[50px] border-8 border-b-16 border-[#F7A6B9] shadow-2xl p-4 pt-6 flex flex-col gap-3">
          
          <div className="absolute top-2 right-6 bg-[#F7A6B9] text-white px-3 py-1 rounded-full text-sm font-bold shadow-inner">
              Jour: {ageInDays}
          </div>
          
          <div className="flex justify-between items-center px-2">
            <div className="w-12 h-4 bg-[#F7A6B9]/50 rounded-full"></div>
            <div className="w-12 h-4 bg-[#F7A6B9]/50 rounded-full"></div>
          </div>

        <div className="bg-[#A76B79] rounded-2xl h-64 md:h-80 w-full shadow-inner overflow-hidden relative">
          <PetDisplay state={getPetState()} stage={stage} equippedAccessory={equippedAccessory} />
        </div>
        
        <div className="px-2 mt-2">
            <StatusBar stats={stats} isSleeping={petState === 'sleeping'} />
        </div>

        <p className="text-center text-sm text-[#B48491] mt-2 h-6">{message}</p>

        <div className="grid grid-cols-2 gap-3 mt-2">
            <ActionButton icon={<BambooIcon />} onClick={handleFeed} disabled={actionButtonsDisabled}>Nourrir</ActionButton>
            <ActionButton icon={<JouerIcon />} onClick={handlePlay} disabled={actionButtonsDisabled}>Jouer</ActionButton>
            <ActionButton icon={<ToilettesIcon />} onClick={handlePoo} disabled={actionButtonsDisabled}>Toilettes</ActionButton>
            <ActionButton icon={<BainIcon />} onClick={handleClean} disabled={actionButtonsDisabled}>Bain</ActionButton>
        </div>
        
        <div className="flex justify-center mt-3">
            <button onClick={() => setIsPhoneOpen(true)} className="p-3 bg-[#FDF3F6] rounded-full shadow-md border-b-4 border-[#FAD1DC] transition-all hover:bg-white active:shadow-inner">
                <PhoneIcon />
            </button>
        </div>
        
        {isPhoneOpen && <PhoneModal 
            onClose={() => setIsPhoneOpen(false)} 
            coins={coins}
            ownedAccessories={ownedAccessories}
            equippedAccessory={equippedAccessory}
            onAddCoins={(amount) => setCoins(c => c + amount)}
            onBuyAccessory={buyAccessory}
            onEquipAccessory={equipAccessory}
            petState={getPetState()}
            petStage={stage}
            userFriendCode={friendCode}
        />}

        {isGameOver && <GameOverModal onRestart={handleRestart} />}

      </div>
    </div>
  );
};

export default App;
