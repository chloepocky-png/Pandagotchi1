
import React from 'react';
import { Stat } from '../types.ts';
import { MAX_STAT } from '../constants.ts';

interface StatusBarProps {
  stats: Record<Stat, number>;
  isSleeping: boolean;
}

const HungerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#A5D09F" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 2H3v7c0 2.21 1.79 4 4 4h2c2.21 0 4-1.79 4-4V2h-2v7c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V2H5z"/>
        <path d="M7 14h2v8H7v-8z"/>
        <path d="M15 2v20h2c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-2z"/>
    </svg>
);
const HappinessIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#F9DF8D"/><path d="M15.5 13.5C15.5 13.5 14.25 15.5 12 15.5C9.75 15.5 8.5 13.5 8.5 13.5" stroke="#B48491" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="9" r="1.5" fill="#B48491"/><circle cx="15" cy="9" r="1.5" fill="#B48491"/></svg>;
const CleanlinessIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#B4D8E4" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 11H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z"/>
        <path d="M16 7H8c-.6 0-1-.4-1-1V5c0-1.7 1.3-3 3-3h2c1.7 0 3 1.3 3 3v1c0 .6-.4 1-1 1z" opacity="0.6"/>
    </svg>
);
const SleepIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#AEC8D0" className="opacity-80"><text x="5" y="18" fontSize="14" fontWeight="bold" className="font-fredoka">z</text><text x="11" y="14" fontSize="14" fontWeight="bold" className="font-fredoka">Z</text></svg>;

const StatBar: React.FC<{value: number, color: string, bgColor: string}> = ({ value, color, bgColor }) => {
    const percentage = (value / MAX_STAT) * 100;
    return (
      <div className="w-full h-3 rounded-full" style={{ backgroundColor: bgColor }}>
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    );
};

const StatusBar: React.FC<StatusBarProps> = ({ stats, isSleeping }) => {
  return (
    <div className="flex justify-between items-center gap-2 w-full">
      <HungerIcon />
      <StatBar value={stats.hunger} color="#A5D09F" bgColor="#E3EFE2" />
      <HappinessIcon />
      <StatBar value={stats.happiness} color="#F9DF8D" bgColor="#FDF8E4" />
      <CleanlinessIcon />
      <StatBar value={stats.cleanliness} color="#B4D8E4" bgColor="#E7F2F6" />
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {isSleeping && <SleepIcon />}
      </div>
    </div>
  );
};

export default StatusBar;