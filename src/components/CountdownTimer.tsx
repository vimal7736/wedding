import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const targetDate = new Date('2026-11-01T00:00:00').getTime();

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="mt-12 mb-8 bg-[rgba(30,36,20,0.4)] backdrop-blur-lg rounded-2xl p-8 
                 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.08),6px_6px_20px_rgba(0,0,0,0.5)] 
                 border border-[rgba(255,255,255,0.05)]"
    >
      <div className="text-[12px] tracking-[5px] uppercase text-[var(--color-gold-line)] mb-6 text-center font-['Cinzel']">
        Countdown to the Big Day
      </div>
      <div className="flex justify-center gap-6 sm:gap-12">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Mins', value: timeLeft.minutes },
          { label: 'Secs', value: timeLeft.seconds },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-4xl sm:text-5xl font-['Cormorant_Garamond'] text-[var(--color-beige-paper)] font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {item.value.toString().padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs uppercase tracking-[3px] text-[var(--color-olive-soft)] mt-2 font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
