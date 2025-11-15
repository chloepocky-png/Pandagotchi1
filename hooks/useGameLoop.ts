import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  // Se souvenir du dernier callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Mettre en place l'intervalle.
  useEffect(() => {
    function tick() {
      // On s'assure que le callback est défini avant de l'appeler
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
