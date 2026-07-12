import { motion } from 'framer-motion';

export const BackgroundWatermark = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
      >
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: 'url(/watermark.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'grayscale(50%) sepia(30%)',
          }}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 1, 0, -1, 0],
          }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </motion.div>
    </div>
  );
};
