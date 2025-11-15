import React from 'react';

interface StatBarProps {
  value: number;
  maxValue: number;
  iconComponent: React.ReactNode;
  color: string;
  trackColor: string;
}

const StatBar: React.FC<StatBarProps> = ({ value, maxValue, iconComponent, color, trackColor }) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="w-full flex items-center gap-1.5" title={`${Math.ceil(value)}%`}>
        <div className="w-6 h-6 flex-shrink-0">{iconComponent}</div>
        <div className="w-full rounded-full h-3 p-0.5 border border-[#F7A6B9]/50" style={{backgroundColor: trackColor}}>
            <div 
            className="h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${percentage}%`, backgroundColor: color }}
            ></div>
        </div>
    </div>
  );
};

export default StatBar;