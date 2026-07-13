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
  const [leaves, setLeaves] = useState<{ id: number; left: number; top: number; delay: number; duration: number; scale: number; color: string }[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    // Initialize 10 falling leaf particles
    const colors = ['var(--color-gold-line)', 'var(--color-olive-deep)'];
    const leafParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 220 + 50, // spread across width of heart
      top: Math.random() * 80 + 30,  // start near top lobes
      delay: Math.random() * 4,
      duration: 5 + Math.random() * 5,
      scale: 0.6 + Math.random() * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setLeaves(leafParticles);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center mb-6">
      {/* SVG clipPath + neumorphic filter defs */}
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.9 C0.18,0.68 0,0.52 0,0.33 C0,0.13 0.14,0 0.33,0 C0.42,0 0.5,0.06 0.5,0.06 C0.5,0.06 0.58,0 0.67,0 C0.86,0 1,0.13 1,0.33 C1,0.52 0.82,0.68 0.5,0.9 Z" />
          </clipPath>

          {/* SVG inset shadow filter */}
          <filter id="heartInset" x="-5%" y="-5%" width="110%" height="110%">
            <feFlood floodColor="rgba(0,0,0,0.7)" result="black" />
            <feComposite in="black" in2="SourceGraphic" operator="in" result="shadow" />
            <feGaussianBlur in="shadow" stdDeviation="6" result="blurShadow" />
            <feOffset in="shadow" dx="4" dy="4" result="darkShadow" />
            <feFlood floodColor="rgba(255,255,255,0.1)" result="white" />
            <feComposite in="white" in2="SourceGraphic" operator="in" result="lightShadow" />
            <feGaussianBlur in="lightShadow" stdDeviation="5" result="blurLight" />
            <feOffset in="blurLight" dx="-3" dy="-3" result="lightOffset" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="darkShadow" />
              <feMergeNode in="lightOffset" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Container wrapper for concentric rings and heart photo */}
      <div className="relative flex items-center justify-center w-[320px] h-[320px]">
        {/* Falling leaves from the wreath */}
        {leaves.map((leaf) => (
          <motion.svg
            key={leaf.id}
            viewBox="0 0 20 20"
            className="absolute pointer-events-none z-30"
            style={{
              left: leaf.left,
              width: 12 * leaf.scale,
              height: 12 * leaf.scale,
              fill: leaf.color,
            }}
            initial={{ y: leaf.top, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: [leaf.top, 280],
              x: [0, 15, -15, 5],
              opacity: [0, 0.75, 0.75, 0],
              rotate: [0, 180, 360, 540],
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <path d="M0,0 Q5,-3 8,0 Q5,3 0,0" transform="translate(5, 10) scale(1.5)" />
          </motion.svg>
        ))}

        {/* Outer glow ring mimicking neumorphic raised edge */}
        <div
          style={{
            width: 270,
            height: 270,
            position: 'relative',
            zIndex: 10,
            filter: [
              'drop-shadow(4px 4px 10px rgba(0,0,0,0.15))',
              'drop-shadow(-2px -2px 6px rgba(255,255,255,0.8))',
              'drop-shadow(0 0 1px rgba(169,138,75,0.3))',
            ].join(' '),
          }}
        >
          {/* Photo layer */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt="Couple"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                clipPath: 'url(#heartClip)',
                display: 'block',
                position: 'relative',
                zIndex: 5,
              }}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </AnimatePresence>

          {/* Inset dark shadow — top-left */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'url(#heartClip)',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, transparent 45%)',
              pointerEvents: 'none',
              zIndex: 6,
            }}
          />

          {/* Inset light highlight — bottom-right */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'url(#heartClip)',
              background: 'linear-gradient(315deg, rgba(255,255,255,0.4) 0%, transparent 45%)',
              pointerEvents: 'none',
              zIndex: 6,
            }}
          />

          {/* Inset border shimmer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'url(#heartClip)',
              background: 'radial-gradient(ellipse at 30% 20%, rgba(169,138,75,0.18) 0%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 6,
            }}
          />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: i === currentIndex ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background: i === currentIndex ? '#d98f3c' : 'rgba(169,138,75,0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
};
