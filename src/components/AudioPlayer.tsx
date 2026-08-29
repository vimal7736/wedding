import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Pause } from 'lucide-react';
import musicSrc from '../assets/m.mp3';

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.volume = 0.85;
      await audio.play();
      setIsPlaying(true);
      setShowHint(false);
    } catch {
      // Browser blocked autoplay — wait for a tap
    }
  }, []);

  // Try as soon as the element can play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      void startPlay();
    };

    if (audio.readyState >= 2) {
      tryPlay();
    } else {
      audio.addEventListener('canplaythrough', tryPlay, { once: true });
    }

    // Immediate attempt (may fail without gesture)
    tryPlay();

    const unlock = () => {
      void startPlay();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('keydown', unlock);

    return () => {
      audio.removeEventListener('canplaythrough', tryPlay);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [startPlay]);

  const togglePlay = async (e: MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        setShowHint(false);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto" playsInline src={musicSrc} />

      <AnimatePresence>
        {showHint && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-5 z-[120] flex flex-col items-center gap-1 pointer-events-none"
          >
            <span className="font-['Cormorant_Garamond'] italic text-[13px] text-[var(--color-gold-line)] opacity-90 whitespace-nowrap">
              tap to start music
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-[var(--color-gold-line)] opacity-60 text-base"
            >
              ▼
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={togglePlay}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[120] flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[rgba(169,138,75,0.4)]"
        style={{
          background: 'rgba(18, 24, 12, 0.85)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
        }}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Pause className="w-5 h-5 text-[var(--color-gold-line)] fill-current" />
            </motion.div>
          ) : (
            <motion.div key="music" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Music className="w-5 h-5 text-[var(--color-gold-line)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {isPlaying && (
          <motion.span
            className="absolute inset-0 rounded-full border border-[rgba(169,138,75,0.4)]"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.button>
    </>
  );
};
