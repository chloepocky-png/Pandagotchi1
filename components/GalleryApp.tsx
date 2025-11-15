import React from 'react';
import { CapturedImage, BackgroundKey } from '../types';
import PetDisplay from './PetDisplay';

interface GalleryAppProps {
  gallery: CapturedImage[];
}

const backgrounds: Record<BackgroundKey, { name: string; style: string }> = {
  none: { name: 'Aucun', style: 'linear-gradient(to bottom, #fde4e9, #fcebec)' },
  park: { name: 'Parc', style: 'linear-gradient(to bottom, #a8e063, #56ab2f)' },
  beach: { name: 'Plage', style: 'linear-gradient(to bottom, #2980b9, #6dd5fa, #ffffff)' },
  space: { name: 'Espace', style: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)' },
};

const GalleryApp: React.FC<GalleryAppProps> = ({ gallery }) => {
  return (
    <div className="flex flex-col h-full">
        <div className="grid grid-cols-2 gap-2 overflow-y-auto p-1 flex-grow">
            {gallery.length === 0 ? (
                <p className="col-span-2 text-center text-[#B48491] mt-8">Votre galerie est vide. Prenez une photo avec Panda Snap !</p>
            ) : (
                gallery.map(photo => (
                    <div key={photo.id} className="bg-white p-2 pb-4 rounded-sm shadow-md">
                        <div 
                            className="w-full aspect-square rounded-sm overflow-hidden" 
                            style={{ background: backgrounds[photo.background].style }}
                        >
                            <PetDisplay 
                                state={photo.state} 
                                stage={photo.stage} 
                                equippedAccessory={photo.equippedAccessory} 
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default GalleryApp;
