import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Pause } from 'lucide-react';

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startPlay = useCallback(async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.play();
        setIsPlaying(true);
        setShowHint(false);
      }
    } catch {
      // autoplay still blocked
    }
  }, []);

  // Try autoplay on first user interaction with the page
  useEffect(() => {
    const handleFirstInteraction = () => {
      startPlay();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [startPlay]);

  // Attempt autoplay after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      startPlay();
    }, 5000);
    return () => clearTimeout(timer);
  }, [startPlay]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
      setShowHint(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="/Melliname.mp3" preload="auto" />

      {/* Pulsing hint to tap anywhere */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="fixed bottom-24 right-5 z-50 flex flex-col items-center gap-1 pointer-events-none"
          >
            <span className="font-['Cormorant_Garamond'] italic text-[13px] text-[var(--color-gold-line)] opacity-80 whitespace-nowrap">
              tap to start music
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-[var(--color-gold-line)] opacity-60 text-base"
            >▼</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full border border-[rgba(169,138,75,0.4)]"
        style={{
          background: 'rgba(18, 24, 12, 0.75)',
          backdropFilter: 'blur(10px)',
          boxShadow: [
            'inset 3px 3px 8px rgba(0,0,0,0.7)',
            'inset -2px -2px 6px rgba(255,255,255,0.06)',
            '0 6px 20px rgba(0,0,0,0.4)',
          ].join(', '),
        }}
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

        {/* Ripple ring when playing */}
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
