import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, children, icon }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-full h-12 md:h-14 bg-[#FDF3F6] rounded-lg shadow-sm
                 text-[#A76B79] font-bold border border-b-4 border-[#FAD1DC]
                 transition-all duration-100 ease-in-out
                 hover:bg-white
                 active:bg-[#F9C2D1]/50 active:shadow-inner active:border-b-2
                 disabled:bg-gray-200/70 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:border-gray-300"
    >
      <div className="w-6 h-6 mr-1.5">{icon}</div>
      <span className="text-sm md:text-base">{children}</span>
    </button>
  );
};

export default ActionButton;
