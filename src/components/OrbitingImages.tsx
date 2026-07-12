import { motion } from 'framer-motion';

// Only hearts and petals orbit — no photos
const orbitItems = [
  { id: 0, angle: 0,   radius: 40, size: 30, duration: 22, delay: 0,   kind: 'heart', color: '#d98f3c' },
  { id: 1, angle: 72,  radius: 44, size: 22, duration: 28, delay: -5,  kind: 'petal', color: '#a98a4b' },
  { id: 2, angle: 144, radius: 38, size: 28, duration: 25, delay: -10, kind: 'heart', color: '#e8dcc0' },
  { id: 3, angle: 216, radius: 42, size: 20, duration: 30, delay: -15, kind: 'petal', color: '#d98f3c' },
  { id: 4, angle: 288, radius: 46, size: 26, duration: 20, delay: -3,  kind: 'heart', color: '#a98a4b' },
  { id: 5, angle: 36,  radius: 50, size: 18, duration: 35, delay: -8,  kind: 'petal', color: '#c8a96e' },
  { id: 6, angle: 108, radius: 36, size: 24, duration: 27, delay: -12, kind: 'heart', color: '#e8dcc0' },
  { id: 7, angle: 180, radius: 48, size: 20, duration: 24, delay: -6,  kind: 'petal', color: '#d98f3c' },
];

export const OrbitingImages = () => {
  const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbitItems.map((item) => {
        const rad = (item.angle * Math.PI) / 180;
        const rx = item.radius * (cx / 100) * 1.6;
        const ry = item.radius * (cy / 100) * 1.2;

        return (
          <motion.div
            key={item.id}
            className="absolute"
            style={{ left: '50%', top: '50%', marginLeft: -item.size / 2, marginTop: -item.size / 2 }}
            animate={{
              x: [
                Math.cos(rad) * rx,
                Math.cos(rad + Math.PI / 2) * rx,
                Math.cos(rad + Math.PI) * rx,
                Math.cos(rad + 3 * Math.PI / 2) * rx,
                Math.cos(rad + 2 * Math.PI) * rx,
              ],
              y: [
                Math.sin(rad) * ry,
                Math.sin(rad + Math.PI / 2) * ry,
                Math.sin(rad + Math.PI) * ry,
                Math.sin(rad + 3 * Math.PI / 2) * ry,
                Math.sin(rad + 2 * Math.PI) * ry,
              ],
            }}
            transition={{ duration: item.duration, delay: item.delay, ease: 'linear', repeat: Infinity }}
          >
            {item.kind === 'heart' ? (
              <svg viewBox="0 0 24 24" width={item.size} height={item.size} fill={item.color} opacity={0.65}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg viewBox="0 0 512 512" width={item.size} height={item.size} fill={item.color} opacity={0.55}>
                <path d="M495.1 76.5c-27.4-44.4-83.3-65.5-133.5-49.3-51.5 16.6-86.7 65.3-85.3 118.8 1.4-53.5-33.8-102.2-85.3-118.8-50.2-16.2-106.1 4.9-133.5 49.3-26.6 43-22 101.3 11.2 139.7 58.1 67.2 166.5 119.5 207.6 270 41.1-150.5 149.5-202.8 207.6-270 33.2-38.4 37.8-96.7 11.2-139.7z" />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
