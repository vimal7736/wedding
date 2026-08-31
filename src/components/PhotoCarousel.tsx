import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/watermark.jpeg',
  '/rings.png',
  '/Gemini_Generated_Image_qs0u42qs0u42qs0u.png',
  '/Gemini_Generated_Image_qiy5z6qiy5z6qiy5.png',
  '/Gemini_Generated_Image_qs0u42qs0u42qs0u.png',
];

export const PhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center mb-4 w-full">
      <svg width="0" height="0" className="absolute overflow-hidden" aria-hidden>
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.9 C0.18,0.68 0,0.52 0,0.33 C0,0.13 0.14,0 0.33,0 C0.42,0 0.5,0.06 0.5,0.06 C0.5,0.06 0.58,0 0.67,0 C0.86,0 1,0.13 1,0.33 C1,0.52 0.82,0.68 0.5,0.9 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative flex items-center justify-center w-[min(78vw,280px)] aspect-square">
        <div className="relative z-10 w-[84%] h-[84%]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt="Couple"
              className="absolute inset-0 w-full h-full object-cover object-top block"
              style={{ clipPath: 'url(#heartClip)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </AnimatePresence>

          <div
            className="absolute inset-0 pointer-events-none z-[6]"
            style={{
              clipPath: 'url(#heartClip)',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, transparent 45%)',
            }}
          />
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Photo ${i + 1}`}
            onClick={() => setCurrentIndex(i)}
            className="h-1.5 rounded-full border-0 cursor-pointer transition-[width,background] duration-300"
            style={{
              width: i === currentIndex ? 18 : 6,
              background: i === currentIndex ? '#d98f3c' : 'rgba(169,138,75,0.35)',
            }}
          />
        ))}
      </div>
    </div>
  );
};
