import { motion } from 'framer-motion';

// Leaf particles falling in the background
const leaves = [
  { id: 'lf1', left: 4, delay: 0, duration: 18, size: 14, color: '#e8dcc0' },
  { id: 'lf2', left: 8, delay: 5, duration: 24, size: 12, color: '#98a97e' },
  { id: 'lf3', left: 12, delay: 10, duration: 20, size: 15, color: '#a98a4b' },
  { id: 'lf4', left: 16, delay: 3, duration: 22, size: 11, color: '#98a97e' },
  { id: 'lf5', left: 82, delay: 2, duration: 19, size: 14, color: '#e8dcc0' },
  { id: 'lf6', left: 86, delay: 7, duration: 25, size: 12, color: '#98a97e' },
  { id: 'lf7', left: 90, delay: 12, duration: 21, size: 15, color: '#a98a4b' },
  { id: 'lf8', left: 95, delay: 4, duration: 23, size: 11, color: '#98a97e' },
  { id: 'lf9', left: 20, delay: 8, duration: 26, size: 13, color: '#e8dcc0' },
  { id: 'lf10', left: 78, delay: 6, duration: 28, size: 13, color: '#a98a4b' },
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
      {/* Falling leaf petals in the background */}
      {leaves.map((lf) => (
        <motion.svg
          key={lf.id}
          viewBox="0 0 20 20"
          className="absolute drop-shadow-sm"
          style={{
            left: `${lf.left}%`,
            width: lf.size,
            height: lf.size,
            fill: lf.color,
            opacity: 0.6,
          }}
          initial={{ y: '-5vh', rotate: 0 }}
          animate={{
            y: '108vh',
            x: [0, 15, -15, 0],
            rotate: 360,
          }}
          transition={{
            duration: lf.duration,
            delay: lf.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path d="M0,0 Q5,-3 8,0 Q5,3 0,0" transform="translate(5, 10) scale(1.5)" />
        </motion.svg>
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
