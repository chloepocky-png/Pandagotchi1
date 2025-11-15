import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: () => void, delay: number | null) => {
  // FIX: Initialize useRef with the callback to provide an initial value and resolve the error.
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
