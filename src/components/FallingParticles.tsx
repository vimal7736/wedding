import { motion } from 'framer-motion';

// Minimal: 3 "Aishu" on left side, 3 "Vimal" on right side, a few slow hearts
const leftTexts = [
  { id: 'l1', label: '✦ Aishu', left: 2, delay: 0, duration: 22, size: 15 },
  { id: 'l2', label: 'Aishu ✦', left: 5, delay: 7, duration: 28, size: 13 },
  { id: 'l3', label: '✦ Aishu', left: 1, delay: 14, duration: 25, size: 16 },
];

const rightTexts = [
  { id: 'r1', label: 'Vimal ✦', left: 92, delay: 3, duration: 24, size: 15 },
  { id: 'r2', label: '✦ Vimal', left: 88, delay: 10, duration: 30, size: 13 },
  { id: 'r3', label: 'Vimal ✦', left: 94, delay: 17, duration: 26, size: 16 },
];

const hearts = [
  { id: 'h1', left: 8,  delay: 4,  duration: 30, size: 18, color: '#d98f3c' },
  { id: 'h2', left: 85, delay: 11, duration: 35, size: 14, color: '#a98a4b' },
  { id: 'h3', left: 15, delay: 19, duration: 28, size: 16, color: '#e8dcc0' },
  { id: 'h4', left: 90, delay: 2,  duration: 32, size: 12, color: '#d98f3c' },
];

export const FallingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Left side: "Aishu" text */}
      {leftTexts.map((p) => (
        <motion.span
          key={p.id}
          className="absolute font-['Cormorant_Garamond'] italic font-semibold select-none"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            color: '#d98f3c',
            opacity: 0.75,
            whiteSpace: 'nowrap',
            textShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
          initial={{ y: '-5vh' }}
          animate={{ y: '108vh' }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear', repeat: Infinity }}
        >
          {p.label}
        </motion.span>
      ))}

      {/* Right side: "Vimal" text */}
      {rightTexts.map((p) => (
        <motion.span
          key={p.id}
          className="absolute font-['Cormorant_Garamond'] italic font-semibold select-none"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            color: '#a98a4b',
            opacity: 0.75,
            whiteSpace: 'nowrap',
            textShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
          initial={{ y: '-5vh' }}
          animate={{ y: '108vh' }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear', repeat: Infinity }}
        >
          {p.label}
        </motion.span>
      ))}

      {/* Slow falling hearts - minimal */}
      {hearts.map((h) => (
        <motion.svg
          key={h.id}
          viewBox="0 0 24 24"
          className="absolute drop-shadow"
          style={{ left: `${h.left}%`, width: h.size, height: h.size, fill: h.color, opacity: 0.55 }}
          initial={{ y: '-5vh', rotate: 0 }}
          animate={{ y: '108vh', rotate: 20 }}
          transition={{ duration: h.duration, delay: h.delay, ease: 'linear', repeat: Infinity }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </motion.svg>
      ))}
    </div>
  );
};
