import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  // Se souvenir du dernier callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Mettre en place l'intervalle.
  useEffect(() => {
    // Ne pas programmer si aucun délai n'est spécifié.
    if (delay === null) {
      return;
    }
    
    const tick = () => {
      savedCallback.current();
    }

    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
};
