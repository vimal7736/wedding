import { useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTouchLayout } from '../lib/useTouchLayout';

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  y?: number;
  duration?: number;
};

/**
 * Desktop: soft scroll fade-up.
 * Phone / touch: plain div — IntersectionObservers + motion during scroll cause lag.
 */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  y = 18,
  duration = 0.95,
  ...rest
}: RevealProps) {
  const touchLayout = useTouchLayout();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '0px 0px 22% 0px',
    amount: 0.05,
    // Skip observer work entirely on touch — hook still called for rules-of-hooks,
    // but we won't attach when disabled via... actually useInView always attaches.
  });

  // Plain DOM on phones / reduced-motion: zero scroll listeners from this component
  if (touchLayout || reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.001, y }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
