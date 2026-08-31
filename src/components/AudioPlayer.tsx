import { useEffect } from 'react';
import { playBackgroundMusic } from '../lib/backgroundMusic';

export const AudioPlayer = () => {
  useEffect(() => {
    void playBackgroundMusic();

    const unlock = () => {
      void playBackgroundMusic();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('keydown', unlock);

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  return null;
};
