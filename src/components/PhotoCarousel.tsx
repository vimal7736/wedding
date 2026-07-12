import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/watermark.jpeg',
  '/rings.png',
];

export const PhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
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
            <feOffset in="blurShadow" dx="4" dy="4" result="darkShadow" />
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

      {/* Outer glow ring mimicking neumorphic raised edge */}
      <div
        style={{
          width: 270,
          height: 270,
          position: 'relative',
          filter: [
            'drop-shadow(6px 6px 14px rgba(0,0,0,0.75))',
            'drop-shadow(-3px -3px 8px rgba(255,255,255,0.06))',
            'drop-shadow(0 0 1px rgba(169,138,75,0.5))',
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
            background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 45%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Inset light highlight — bottom-right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: 'url(#heartClip)',
            background: 'linear-gradient(315deg, rgba(255,255,255,0.1) 0%, transparent 45%)',
            pointerEvents: 'none',
            zIndex: 2,
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
            zIndex: 2,
          }}
        />
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
