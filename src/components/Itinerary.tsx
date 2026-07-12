import { motion, type Variants } from 'framer-motion';

const events = [
  { label: "", title: "Welcome", desc: "Join us as we gather together with warm hearts and warm drinks to begin a beautiful evening." },
  { label: "", title: "Reception Ceremony", desc: "The couple's grand entrance — a moment of joy, love, and celebration." },
  { label: "", title: "Dinner & Celebration", desc: "A  feast to celebrate their new beginning, followed by music, laughter, and dancing." }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' as const } }
};

export const Itinerary = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="w-full max-w-lg mx-auto mt-16 mb-12 relative"
    >
      <div className="text-center mb-8 font-['Cinzel'] text-[14px] tracking-[6px] text-[var(--color-gold-line)] uppercase">
        Evening Flow
      </div>

      <div className="relative border-l border-[rgba(169,138,75,0.3)] ml-4 md:ml-8 pl-8 md:pl-12 py-4">
        {events.map((event, idx) => (
          <motion.div key={idx} variants={itemVariants} className="mb-10 relative">
            <div className="absolute w-3 h-3 bg-[var(--color-gold-line)] rounded-full -left-[38px] md:-left-[54px] top-1.5 shadow-[0_0_10px_rgba(169,138,75,0.8)]" />
            <div className="font-['Cinzel'] text-[11px] md:text-[13px] text-[var(--color-gold-line)] mb-1 tracking-[4px] uppercase">
              {event.label}
            </div>
            <div className="font-['Cormorant_Garamond'] text-[24px] md:text-[28px] text-[var(--color-beige-paper)] font-medium leading-none mb-2">
              {event.title}
            </div>
            <div className="font-['Jost'] text-[14px] md:text-[16px] text-[var(--color-beige-warm)] opacity-80 font-light leading-relaxed">
              {event.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
