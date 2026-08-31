import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from 'framer-motion';

/** Soft ease — slow rise without overshoot. */
const EASE = [0.22, 1, 0.36, 1] as const;

/** Fire once when a slice of the block enters the viewport. */
export const revealViewport = {
  once: true as const,
  amount: 0.18,
  margin: '0px 0px -6% 0px',
};

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  /** Starting translateY in px — keep modest so GPU stays cheap. */
  y?: number;
  duration?: number;
};

/**
 * Scroll-triggered fade/slide. Opacity + transform only — no scroll listeners,
 * so scrolling stays smooth even with many reveals on the page.
 */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  y = 32,
  duration = 1.1,
  ...rest
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
