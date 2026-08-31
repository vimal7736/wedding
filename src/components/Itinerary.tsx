import { motion, useReducedMotion, type Variants } from 'framer-motion';

const events = [
  { label: "", title: "Welcome", desc: "Join us as we gather together with warm hearts and warm drinks to begin a beautiful evening." },
  { label: "", title: "Reception Ceremony", desc: "The couple's  entrance — a moment of joy, love, and celebration." },
  { label: "", title: "Dinner & Celebration", desc: "A  feast to celebrate their new beginning, followed by music, laughter, and dancing." }
];

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.04 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0.001, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

export const Itinerary = () => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="w-full max-w-lg mx-auto mt-10 sm:mt-16 mb-8 sm:mb-12 relative px-1">
        <div className="text-center mb-6 sm:mb-8 font-['Cinzel'] text-[12px] sm:text-[14px] tracking-[4px] sm:tracking-[6px] text-[var(--color-olive-deep)] uppercase">
          Evening Flow
        </div>
        <div className="relative border-l border-[rgba(169,138,75,0.3)] ml-3 sm:ml-4 md:ml-8 pl-6 sm:pl-8 md:pl-12 py-2 sm:py-4">
          {events.map((event, idx) => (
            <div key={idx} className="mb-8 sm:mb-10 relative">
              <div className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[var(--color-olive-deep)] rounded-full -left-[29px] sm:-left-[38px] md:-left-[54px] top-1.5" />
              <div className="font-['Cinzel'] text-[11px] md:text-[13px] text-[var(--color-olive-deep)] mb-1 tracking-[4px] uppercase">
                {event.label}
              </div>
              <div className="font-['Cormorant_Garamond'] text-[20px] sm:text-[24px] md:text-[28px] text-[var(--color-olive-deep)] font-semibold leading-none mb-2">
                {event.title}
              </div>
              <div className="font-['Jost'] text-[13px] sm:text-[14px] md:text-[16px] text-[var(--color-ink)] opacity-80 font-light leading-relaxed">
                {event.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05, margin: '0px 0px 22% 0px' }}
      className="w-full max-w-lg mx-auto mt-10 sm:mt-16 mb-8 sm:mb-12 relative px-1"
    >
      <motion.div
        variants={itemVariants}
        className="text-center mb-6 sm:mb-8 font-['Cinzel'] text-[12px] sm:text-[14px] tracking-[4px] sm:tracking-[6px] text-[var(--color-olive-deep)] uppercase"
      >
        Evening Flow
      </motion.div>

      <div className="relative border-l border-[rgba(169,138,75,0.3)] ml-3 sm:ml-4 md:ml-8 pl-6 sm:pl-8 md:pl-12 py-2 sm:py-4">
        {events.map((event, idx) => (
          <motion.div key={idx} variants={itemVariants} className="mb-8 sm:mb-10 relative">
            <div className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[var(--color-olive-deep)] rounded-full -left-[29px] sm:-left-[38px] md:-left-[54px] top-1.5" />
            <div className="font-['Cinzel'] text-[11px] md:text-[13px] text-[var(--color-olive-deep)] mb-1 tracking-[4px] uppercase">
              {event.label}
            </div>
            <div className="font-['Cormorant_Garamond'] text-[20px] sm:text-[24px] md:text-[28px] text-[var(--color-olive-deep)] font-semibold leading-none mb-2">
              {event.title}
            </div>
            <div className="font-['Jost'] text-[13px] sm:text-[14px] md:text-[16px] text-[var(--color-ink)] opacity-80 font-light leading-relaxed">
              {event.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
