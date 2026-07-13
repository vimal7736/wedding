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
      className="mt-12 mb-8 bg-[rgba(74,90,55,0.06)] backdrop-blur-lg rounded-2xl p-8 
                 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.03),inset_-2px_-2px_6px_rgba(255,255,255,0.5)] 
                 border border-[rgba(74,90,55,0.12)]"
    >
      <div className="text-[12px] tracking-[5px] uppercase text-[var(--color-olive-deep)] mb-6 text-center font-['Cinzel']">
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
            <div className="text-4xl sm:text-5xl font-['Cormorant_Garamond'] text-[var(--color-olive-deep)] font-semibold">
              {item.value.toString().padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs uppercase tracking-[3px] text-[var(--color-ink)] opacity-70 mt-2 font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
