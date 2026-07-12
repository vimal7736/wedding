import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const NUM_PARTICLES = 30;

type ParticleType = 'image' | 'heart' | 'petal';

interface Particle {
  id: number;
  type: ParticleType;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color?: string;
}

export const FallingImage = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const types: ParticleType[] = ['image', 'heart', 'petal', 'heart', 'petal'];
    const colors = ['#d98f3c', '#a98a4b', '#e8dcc0']; // flame, gold, warm beige

    const newParticles = Array.from({ length: NUM_PARTICLES }).map((_, i) => ({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 12 + Math.random() * 15,
      size: 20 + Math.random() * 50,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => {
        if (p.type === 'image') {
          return (
            <motion.img
              key={p.id}
              src="/watermark.jpeg"
              alt=""
              className="absolute rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-[var(--color-gold-line)] mix-blend-multiply"
              style={{
                left: `${p.left}%`,
                width: p.size * 1.5, // make images slightly larger
                height: p.size * 1.5,
                objectFit: 'cover',
              }}
              initial={{ y: '-10vh', rotate: -20 }}
              animate={{ y: '110vh', rotate: 360 }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'linear', repeat: Infinity }}
            />
          );
        } else if (p.type === 'heart') {
          return (
            <motion.svg
              key={p.id}
              viewBox="0 0 24 24"
              className="absolute drop-shadow-md"
              style={{ left: `${p.left}%`, width: p.size, height: p.size, fill: p.color, opacity: 0.8 }}
              initial={{ y: '-10vh', rotate: 0 }}
              animate={{ y: '110vh', rotate: 180, x: [0, 20, -20, 0] }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeInOut', repeat: Infinity }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
          );
        } else {
          // Petal
          return (
            <motion.svg
              key={p.id}
              viewBox="0 0 512 512"
              className="absolute drop-shadow-md"
              style={{ left: `${p.left}%`, width: p.size, height: p.size, fill: p.color, opacity: 0.7 }}
              initial={{ y: '-10vh', rotate: 45 }}
              animate={{ y: '110vh', rotate: 720, x: [0, -30, 30, 0] }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeInOut', repeat: Infinity }}
            >
              <path d="M495.1 76.5c-27.4-44.4-83.3-65.5-133.5-49.3-51.5 16.6-86.7 65.3-85.3 118.8 1.4-53.5-33.8-102.2-85.3-118.8-50.2-16.2-106.1 4.9-133.5 49.3-26.6 43-22 101.3 11.2 139.7 58.1 67.2 166.5 119.5 207.6 270 41.1-150.5 149.5-202.8 207.6-270 33.2-38.4 37.8-96.7 11.2-139.7z" />
            </motion.svg>
          );
        }
      })}
    </div>
  );
};
