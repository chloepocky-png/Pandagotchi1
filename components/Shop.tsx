import React from 'react';
import { ACCESSORIES, ACCESSORY_NAMES_FR } from '../constants';
import { AccessoryName } from '../types';

interface ShopProps {
  coins: number;
  ownedAccessories: AccessoryName[];
  equippedAccessory: AccessoryName | null;
  onBuy: (accessory: AccessoryName) => boolean;
  onEquip: (accessory: AccessoryName) => void;
}

const AccessoryItem: React.FC<{ name: string }> = ({ name }) => {
  if (name === 'tophat') return <div className="text-4xl">🎩</div>;
  if (name === 'sunglasses') return <div className="text-4xl">😎</div>;
  if (name === 'partyhat') return <div className="text-4xl">🎉</div>;
  if (name === 'bowtie') return <div className="text-4xl">🎀</div>;
  return null;
};

const Shop: React.FC<ShopProps> = ({ coins, ownedAccessories, equippedAccessory, onEquip, onBuy }) => {
  const accessoryKeys = Object.keys(ACCESSORIES) as AccessoryName[];

  return (
    <div className="space-y-3">
      {accessoryKeys.map(key => {
        const accessory = ACCESSORIES[key];
        const isOwned = ownedAccessories.includes(key);
        const isEquipped = equippedAccessory === key;
        const canAfford = coins >= accessory.price;

        return (
          <div key={key} className="flex items-center justify-between bg-[#FDF3F6] p-3 rounded-lg border border-[#F7A6B9]/50">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md mr-3">
                <AccessoryItem name={key} />
              </div>
              <div>
                <p className="font-bold text-[#B48491] capitalize">{ACCESSORY_NAMES_FR[key]}</p>
                {!isOwned && (
                   <p className="text-sm text-yellow-600 flex items-center font-semibold">
                     <span className="mr-1">💰</span> {accessory.price}
                   </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isOwned ? (
                <>
                  <button 
                    onClick={() => onEquip(key)}
                    disabled={isEquipped}
                    className="px-3 py-1 rounded-md text-sm font-semibold transition-colors text-white
                               bg-[#E583A0] hover:bg-[#d86f8f]
                               disabled:bg-[#e6a8b9] disabled:cursor-not-allowed"
                  >
                    {isEquipped ? 'Équipé' : 'Équiper'}
                  </button>
                  {isEquipped && (
                     <button
                        onClick={() => onEquip(key)} // Toggles off
                        className="px-3 py-1 rounded-md text-sm font-semibold transition-colors bg-red-500 text-white hover:bg-red-600"
                      >
                        Déséquiper
                      </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => onBuy(key)}
                  disabled={!canAfford}
                  className="px-3 py-1 rounded-md text-sm font-semibold transition-colors text-white
                             bg-green-500 hover:bg-green-600
                             disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Acheter
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Shop;