import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type Phase = 'idle' | 'opening' | 'done';

type EnvelopeUnlockProps = {
  onOpened: () => void;
};

export const EnvelopeUnlock = ({ onOpened }: EnvelopeUnlockProps) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOpen = () => {
    if (phase !== 'idle') return;
    if (reduceMotion) {
      onOpened();
      return;
    }
    setPhase('opening');
    window.setTimeout(() => {
      setPhase('done');
      onOpened();
    }, 1450);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 40%, #3a472c 0%, #232c19 55%, #12160c 100%)',
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Wedding invitation envelope"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(169,138,75,0.18) 0%, transparent 50%)',
        }}
      />

      {!reduceMotion &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[var(--color-beige-warm)]"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${12 + i * 14}%`,
              top: `${20 + (i % 4) * 18}%`,
              opacity: 0.35,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

      {/* Title sits ABOVE the envelope so it is always readable */}
      <motion.p
        className="relative z-10 font-['Cinzel'] text-[11px] sm:text-[13px] tracking-[0.45em] sm:tracking-[0.55em] text-[var(--color-beige-warm)] uppercase mb-2 font-semibold"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
      >
        Wedding Invitation
      </motion.p>
      <motion.p
        className="relative z-10 font-['Cormorant_Garamond'] italic text-[20px] sm:text-[24px] text-[var(--color-beige-paper)] mb-8 sm:mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Vimal & Aishwariya
      </motion.p>

      <motion.button
        type="button"
        onClick={handleOpen}
        disabled={phase !== 'idle'}
        className="relative z-10 w-[min(88vw,380px)] aspect-[5/3.4] cursor-pointer border-0 bg-transparent p-0 appearance-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold-line)]"
        style={{ perspective: 1200 }}
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={
          phase === 'idle'
            ? { opacity: 1, y: [0, -6, 0], scale: 1 }
            : phase === 'opening'
              ? { opacity: 1, y: 0, scale: 1.02 }
              : { opacity: 0, scale: 1.15, y: -20 }
        }
        transition={
          phase === 'idle'
            ? {
                y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.9 },
                scale: { duration: 0.9 },
              }
            : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
        }
        aria-label="Open wedding invitation"
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          <div
            className="absolute inset-0 rounded-sm overflow-hidden shadow-[0_28px_60px_-12px_rgba(0,0,0,0.55)]"
            style={{
              background: 'linear-gradient(165deg, #f7f0e2 0%, #ebe0c8 48%, #e0d2b4 100%)',
              border: '1px solid rgba(169,138,75,0.35)',
            }}
          >
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(74,90,55,0.06) 0.6px, transparent 0.6px)',
                backgroundSize: '4px 4px',
              }}
            />
            <div
              className="absolute inset-y-0 left-0 w-[18%] opacity-30"
              style={{
                background: 'linear-gradient(90deg, rgba(74,90,55,0.12), transparent)',
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-[18%] opacity-30"
              style={{
                background: 'linear-gradient(270deg, rgba(74,90,55,0.12), transparent)',
              }}
            />

            {/* Peek card — text kept below flap tip so nothing is hidden */}
            <motion.div
              className="absolute left-[10%] right-[10%] bottom-[8%] top-[52%] rounded-sm overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #fbf7ef, #f2ead9)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: '1px solid rgba(169,138,75,0.25)',
              }}
              animate={
                phase === 'opening' || phase === 'done'
                  ? { y: '-55%', opacity: 1, scale: 1.05 }
                  : { y: '0%', opacity: 1, scale: 1 }
              }
              transition={{
                duration: 1.15,
                delay: phase === 'opening' ? 0.5 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex flex-col items-center justify-center h-full px-3 py-2">
                <span className="font-['Cormorant_Garamond'] italic text-[15px] sm:text-[18px] text-[var(--color-olive-deep)] leading-tight">
                  Vimal & Aishwariya
                </span>
                <div className="w-8 h-px bg-[rgba(169,138,75,0.45)] my-1.5" />
                <span className="font-['Cormorant_Garamond'] text-[10px] tracking-[0.2em] text-[var(--color-ink)] opacity-75 uppercase">
                  25 Oct 2026
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="absolute left-0 right-0 top-0 origin-top"
            style={{
              height: '52%',
              transformStyle: 'preserve-3d',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: 'linear-gradient(180deg, #efe6d2 0%, #e4d7bc 100%)',
              borderTop: '1px solid rgba(169,138,75,0.4)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              zIndex: 3,
            }}
            animate={
              phase === 'opening' || phase === 'done'
                ? { rotateX: -168, opacity: 0.95 }
                : { rotateX: 0, opacity: 1 }
            }
            transition={{ duration: 0.95, ease: [0.33, 1, 0.68, 1] }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, transparent 40%, rgba(74,90,55,0.08) 100%)',
              }}
            />
          </motion.div>

          <AnimatePresence>
            {phase === 'idle' && (
              <motion.div
                className="absolute left-1/2 top-[48%] z-10 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.35, opacity: 0, filter: 'blur(3px)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <motion.div
                  className="relative flex items-center justify-center rounded-full"
                  style={{
                    width: 42,
                    height: 42,
                    background: `
                      repeating-conic-gradient(
                        from 0deg,
                        #f7f2e8 0deg 6deg,
                        #ebe4d6 6deg 12deg
                      )
                    `,
                    boxShadow:
                      '0 3px 10px rgba(0,0,0,0.28), inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(80,70,50,0.18)',
                  }}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Soft dome + groove depth */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55) 0%, transparent 42%, rgba(90,78,55,0.12) 100%)',
                    }}
                  />
                  {/* Outer rim grooves */}
                  <div
                    className="absolute inset-[-2px] rounded-full opacity-90 pointer-events-none"
                    style={{
                      background:
                        'repeating-conic-gradient(from 0deg, #e8e0d2 0deg 5deg, #d9d0c0 5deg 10deg)',
                      mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))',
                      WebkitMask:
                        'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))',
                    }}
                  />
                  <span className="relative font-['Cormorant_Garamond'] text-[10px] font-semibold text-[#4a5a37] tracking-wide select-none">
                    V
                    <span className="text-[6px] mx-0.5 opacity-90">♥</span>A
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      <motion.p
        className="relative z-10 mt-10 sm:mt-12 font-['Cormorant_Garamond'] italic text-[16px] sm:text-[18px] text-[var(--color-beige-paper)] tracking-wide text-center"
        initial={{ opacity: 0 }}
        animate={phase === 'idle' ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
        transition={
          phase === 'idle'
            ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      >
        Tap the seal to open
      </motion.p>

      <motion.p
        className="relative z-10 mt-3 font-['Cinzel'] text-[9px] tracking-[0.35em] text-[var(--color-beige-warm)] uppercase opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'idle' ? 0.5 : 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        You have arrived · Dindigul
      </motion.p>
    </motion.div>
  );
};
