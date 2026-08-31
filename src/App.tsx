import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { InvitationCard } from './components/InvitationCard';
import { AudioPlayer } from './components/AudioPlayer';
import { FallingParticles } from './components/FallingParticles';
import { OrbitingImages } from './components/OrbitingImages';
import { EnvelopeUnlock } from './components/EnvelopeUnlock';
import { MapJourney } from './components/MapJourney';
import { Reveal } from './components/Reveal';
import { useTouchLayout } from './lib/useTouchLayout';

const OPEN_KEY = 'wedding-envelope-opened';

type Stage = 'journey' | 'envelope' | 'invite';

function getInitialStage(): Stage {
  if (typeof window === 'undefined') return 'journey';
  try {
    return sessionStorage.getItem(OPEN_KEY) === '1' ? 'invite' : 'journey';
  } catch {
    return 'journey';
  }
}

function App() {
  const reduceMotion = useReducedMotion();
  const touchLayout = useTouchLayout();
  const [stage, setStage] = useState<Stage>(getInitialStage);

  const handleJourneyDone = useCallback(() => {
    setStage('envelope');
  }, []);

  const handleOpened = useCallback(() => {
    try {
      sessionStorage.setItem(OPEN_KEY, '1');
    } catch {
      /* ignore */
    }
    setStage('invite');
  }, []);

  const opened = stage === 'invite';
  // Continuous fixed-layer animations fight scroll on phones
  const showAmbientMotion = opened && !touchLayout && !reduceMotion;

  return (
    <>
      {/* Music from the very first screen (map → seal → invite) */}
      <AudioPlayer />

      <AnimatePresence mode="wait">
        {stage === 'journey' && (
          <MapJourney key="journey" onComplete={handleJourneyDone} />
        )}
        {stage === 'envelope' && (
          <EnvelopeUnlock key="envelope" onOpened={handleOpened} />
        )}
      </AnimatePresence>

      {opened && (
        <motion.main
          className="relative min-h-screen w-full flex flex-col items-center justify-start py-6 sm:py-12 px-3 sm:px-4 overflow-x-hidden bg-[var(--color-olive-deep)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            reduceMotion || touchLayout
              ? { duration: 0.25 }
              : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {showAmbientMotion && (
            <>
              <OrbitingImages />
              <FallingParticles />
            </>
          )}

          <Reveal
            delay={0.05}
            y={20}
            duration={1.2}
            className="relative z-10 text-center mb-1 mt-10 sm:mt-16 select-none pointer-events-none px-2"
          >
            <span className="font-['Cinzel'] text-[10px] md:text-[13px] tracking-[0.4em] sm:tracking-[0.5em] text-[var(--color-beige-warm)] font-bold uppercase opacity-95 block mb-2 sm:mb-3">
              Wedding Invitation
            </span>
            <h2 className="font-['Cormorant_Garamond'] italic text-[28px] sm:text-3xl md:text-5xl text-[var(--color-beige-paper)] font-light tracking-wide">
              Vimal & Aishwariya
            </h2>
            <div className="w-16 h-[1px] bg-[rgba(169,138,75,0.35)] mx-auto mt-3 sm:mt-4" />
          </Reveal>

          <InvitationCard />

          <Reveal
            y={28}
            duration={1.15}
            className="relative z-10 w-full max-w-3xl mx-auto text-center px-6 pb-20 pt-8 flex flex-col items-center gap-5"
          >
            <div className="flex items-center gap-4 mt-2 opacity-50 w-full">
              <div className="flex-1 h-[1px] bg-[rgba(200,169,110,0.4)]" />
              <svg viewBox="0 0 24 24" width={18} height={18} fill="#c8a96e">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <div className="flex-1 h-[1px] bg-[rgba(200,169,110,0.4)]" />
            </div>

            <p className="font-['Cinzel'] text-[10px] md:text-[11px] tracking-[4px] text-[var(--color-beige-warm)] font-bold uppercase opacity-90">
              Vimal &nbsp;✦&nbsp; Aishwariya &nbsp;·&nbsp; 25 October 2026
            </p>
          </Reveal>
        </motion.main>
      )}
    </>
  );
}

export default App;
