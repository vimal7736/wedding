import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useTouchLayout } from '../lib/useTouchLayout';

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
  duration?: number;
};

/**
 * Phone/touch: plain div (no observers — scroll stays native).
 * Desktop: soft one-shot fade-up when entering view.
 */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  y = 18,
  duration = 0.95,
}: RevealProps) {
  const touchLayout = useTouchLayout();
  const reduceMotion = useReducedMotion();

  if (touchLayout || reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <RevealMotion
      className={className}
      style={style}
      delay={delay}
      y={y}
      duration={duration}
    >
      {children}
    </RevealMotion>
  );
}

function RevealMotion({
  children,
  className,
  style,
  delay = 0,
  y = 18,
  duration = 0.95,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '0px 0px 22% 0px',
    amount: 0.05,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.001, y }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
