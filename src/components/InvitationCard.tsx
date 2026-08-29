import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { Hills, KolamDivider, MapLeaf, FooterLeaf } from './Icons';
import { CountdownTimer } from './CountdownTimer';
import { PhotoCarousel } from './PhotoCarousel';
import { Itinerary } from './Itinerary';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const InvitationCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  const yFar = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [36, -36]);
  const yMid = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [20, -20]);
  const yNear = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [10, -10]);
  const yNames = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [16, -28]);
  const yHills = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [28, -40]);
  const scaleCard = useTransform(smooth, [0, 0.35, 0.7, 1], reduceMotion ? [1, 1, 1, 1] : [0.98, 1, 1, 0.99]);
  const rotateY = useTransform(smooth, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [0.8, 0, -0.8]);
  const borderColor = useTransform(
    smooth,
    [0, 0.4, 0.7, 1],
    reduceMotion
      ? [
          'rgba(169,138,75,0.35)',
          'rgba(169,138,75,0.35)',
          'rgba(169,138,75,0.35)',
          'rgba(169,138,75,0.35)',
        ]
      : [
          'rgba(169,138,75,0.25)',
          'rgba(169,138,75,0.55)',
          'rgba(169,138,75,0.55)',
          'rgba(169,138,75,0.3)',
        ],
  );

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-6xl mx-auto z-10 px-1 pt-4 sm:p-4 sm:pt-8 md:p-12 mt-2 sm:mt-4"
      style={{ perspective: 1400 }}
    >
      {/* Depth shadow layer — drifts slower behind the card */}
      <motion.div
        className="absolute inset-6 sm:inset-10 md:inset-14 rounded-xl pointer-events-none -z-[1]"
        style={{
          y: yFar,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28), transparent 70%)',
          filter: 'blur(28px)',
        }}
        aria-hidden
      />

      <motion.div
        className="glass-card rounded-xl overflow-visible will-change-transform"
        style={{ y: yNear, scale: scaleCard, rotateY }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          className="relative m-2 sm:m-4 md:m-6 border p-1.5 sm:p-2"
          style={{ borderColor }}
        >
          {/* Parallax gold border sheen */}
          <motion.div
            className="absolute inset-[4px] sm:inset-[6px] border pointer-events-none"
            style={{
              y: yMid,
              borderColor: 'rgba(169,138,75,0.35)',
            }}
          />

          <div className="relative px-3 py-6 sm:px-6 sm:py-8 md:px-10 md:py-12 flex flex-col items-center text-center w-full min-w-0">
            {/* Top tagline */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="w-full text-center mb-6 sm:mb-8"
              style={{ y: yMid }}
            >
              <p className="font-['Cormorant_Garamond'] italic text-[20px] sm:text-[24px] md:text-[32px] text-[var(--color-olive-deep)] leading-snug px-1">
                Celebrate the start of our forever
              </p>
              <div className="w-16 h-[1px] bg-[rgba(169,138,75,0.35)] mx-auto my-3" />
              <p className="font-['Cormorant_Garamond'] italic text-[14px] md:text-[18px] text-[var(--color-ink)] opacity-80 tracking-wide leading-relaxed px-1">
                Two hearts bound by destiny, two souls united in
              </p>
              <p className="font-['Cormorant_Garamond'] text-[20px] sm:text-[22px] md:text-[28px] text-[var(--color-olive-deep)] font-semibold tracking-[1px] mt-1">
                Sacred Matrimony
              </p>
              <p className="font-['Cormorant_Garamond'] text-[12px] md:text-[15px] tracking-[3px] sm:tracking-[4px] text-[var(--color-olive-mid)] uppercase mt-3">
                ✦ &nbsp; Vimal &nbsp; & &nbsp; Aishu &nbsp; ✦
              </p>
            </motion.div>

            <motion.div style={{ y: yHills }} className="w-full flex justify-center">
              <Hills className="w-full max-w-[400px] h-auto mx-auto mb-4 opacity-90" />
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] tracking-[4px] text-[var(--color-olive-deep)] uppercase mt-2 font-medium"
            >
              Together with their families
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 font-['Cormorant_Garamond'] italic text-[16px] md:text-[19px] tracking-[0.5px] text-[var(--color-ink)] opacity-80"
            >
              Invited by their parents Suresh & Jessy and Balu & Tamil Selvi
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-col gap-6 md:gap-8 items-center w-full"
              style={{ y: yNames }}
            >
              <div className="flex flex-col items-center">
                <span className="font-['Cormorant_Garamond'] text-xl sm:text-2xl md:text-4xl text-[var(--color-olive-deep)] font-semibold tracking-wide">
                  Vimal Suresh
                </span>
                <span className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] mt-2 text-[var(--color-ink)] opacity-70 font-light tracking-[1px] uppercase">
                  Beloved son of Suresh & Jessy
                </span>
              </div>

              <div className="w-[40px] h-[1px] bg-[var(--color-gold-line)] opacity-50 my-1" />

              <div className="flex flex-col items-center">
                <span className="font-['Cormorant_Garamond'] text-xl sm:text-2xl md:text-4xl text-[var(--color-olive-deep)] font-semibold tracking-wide">
                  B. Aishwariya
                </span>
                <span className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] mt-2 text-[var(--color-ink)] opacity-70 font-light tracking-[1px] uppercase">
                  Beloved daughter of Balu & Tamil Selvi
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="w-[180px] my-10"
              style={{ y: yMid }}
            >
              <KolamDivider className="w-full" />
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="w-full"
              style={{ y: yNear }}
            >
              <PhotoCarousel />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="font-['Cormorant_Garamond'] font-semibold text-[clamp(22px,7vw,64px)] leading-[1.25] text-[var(--color-olive-deep)] mt-4 sm:mt-6 px-1"
              style={{ y: yNames }}
            >
              Vimal{' '}
              <span className="font-['Cormorant_Garamond'] italic font-normal text-[0.5em] text-[var(--color-ink)] px-[6px] md:px-[15px] align-middle">
                weds
              </span>{' '}
              Aishwariya
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-6 font-['Cormorant_Garamond'] text-[15px] md:text-[17px] tracking-[3px] uppercase text-[var(--color-ink)] opacity-80 font-medium"
            >
              You are cordially invited
            </motion.div>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: 100 }}
              transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="h-[1px] bg-[var(--color-gold-line)] my-10 mx-auto"
            />

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.95 }}
              className="w-full max-w-xl mx-auto mb-6 sm:mb-10 px-0 sm:px-2"
              style={{ y: yMid }}
            >
              <p className="font-['Cinzel'] text-[10px] md:text-[12px] tracking-[3px] sm:tracking-[4px] text-[var(--color-gold-line)] uppercase font-semibold mb-3 sm:mb-4">
                Wedding Ceremony
              </p>
              <div className="flex flex-col items-center text-center p-4 sm:p-6 md:p-8 bg-[rgba(74,90,55,0.03)] rounded-xl sm:rounded-2xl border border-[rgba(169,138,75,0.18)] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold-line)] to-transparent opacity-60" />
                <span className="font-['Cormorant_Garamond'] text-[24px] sm:text-[28px] md:text-[34px] text-black font-semibold leading-none">
                  25 October 2026
                </span>
                <span className="font-['Cormorant_Garamond'] text-[13px] sm:text-[14px] text-[var(--color-ink)] opacity-70 tracking-[2px] uppercase mt-2">
                  Sunday
                </span>
                <div className="w-12 h-[1px] bg-[rgba(169,138,75,0.3)] my-3 sm:my-4" />
                <span className="font-['Cormorant_Garamond'] text-[16px] sm:text-[18px] md:text-[20px] text-black font-medium">
                  7:45 am – 8:45 am
                </span>
                <div className="w-12 h-[1px] bg-[rgba(169,138,75,0.3)] my-3 sm:my-4" />
                <span className="font-['Cormorant_Garamond'] text-[20px] sm:text-[22px] md:text-[26px] text-black font-semibold italic leading-none">
                  Velu Mahal
                </span>
                <span className="font-['Cormorant_Garamond'] text-[14px] sm:text-[15px] md:text-[16px] text-[var(--color-ink)] opacity-75 mt-2 sm:mt-3 max-w-[280px] leading-relaxed px-2">
                  Thadicombu Road, Bye-Pass, Dindigul
                </span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Velu+Mahal+Thadicombu+Road+Bye-Pass+Dindigul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 font-['Cinzel'] text-[10px] md:text-[11px] tracking-[2px] text-[var(--color-gold-line)] uppercase font-semibold no-underline hover:opacity-80 transition-opacity"
                >
                  Open in Maps
                </a>
              </div>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
              className="font-['Cormorant_Garamond'] text-[18px] md:text-[22px] leading-[1.8] text-[var(--color-ink)] max-w-[600px] mx-auto font-light"
            >
              Join us for an evening of joy, laughter and celebration as we welcome you to our
              wedding reception — a warm gathering to celebrate our new beginning together.
            </motion.p>

            <CountdownTimer />

            <Itinerary />

            <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-12 mb-4 sm:mb-6 px-0 sm:px-2">
              <p className="font-['Cinzel'] text-[10px] md:text-[12px] tracking-[3px] sm:tracking-[4px] text-[var(--color-gold-line)] uppercase font-semibold mb-4 sm:mb-6 text-center">
                Reception · Calicut
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 items-stretch relative">
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-[rgba(74,90,55,0.03)] rounded-xl sm:rounded-2xl border border-[rgba(169,138,75,0.18)] relative overflow-hidden"
                  style={{ y: yFar }}
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold-line)] to-transparent opacity-60" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-['Cinzel'] text-[10px] md:text-[12px] tracking-[3px] text-[var(--color-gold-line)] uppercase font-semibold">
                      Date
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-[28px] sm:text-[32px] md:text-[38px] text-black font-semibold mt-1 leading-none">
                      01 Nov
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-[13px] sm:text-[14px] text-[var(--color-ink)] opacity-70 tracking-[2px] uppercase">
                      Sunday
                    </span>
                  </div>

                  <div className="w-12 h-[1px] bg-[rgba(169,138,75,0.3)] my-3 sm:my-4" />

                  <div className="flex flex-col items-center">
                    <span className="font-['Cinzel'] text-[9px] md:text-[10px] tracking-[2px] text-[var(--color-olive-deep)] uppercase font-semibold opacity-75">
                      Event
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-[18px] sm:text-[20px] md:text-[22px] text-black font-medium mt-1">
                      Reception
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-[12px] sm:text-[13px] text-[var(--color-ink)] opacity-60 tracking-[1px] uppercase mt-0.5">
                      Evening
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-[rgba(74,90,55,0.03)] rounded-xl sm:rounded-2xl border border-[rgba(169,138,75,0.18)] relative overflow-hidden"
                  style={{ y: yMid }}
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold-line)] to-transparent opacity-60" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-['Cinzel'] text-[10px] md:text-[12px] tracking-[3px] text-[var(--color-gold-line)] uppercase font-semibold">
                      Venue
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-[28px] sm:text-[32px] md:text-[38px] text-black font-semibold mt-2 leading-none italic">
                      PV Garden
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-[14px] sm:text-[15px] md:text-[17px] text-[var(--color-ink)] opacity-75 mt-2 sm:mt-3 max-w-[200px] leading-relaxed">
                      Bilathikulam, Calicut
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-[rgba(74,90,55,0.03)] rounded-xl sm:rounded-2xl border border-[rgba(169,138,75,0.18)] relative overflow-hidden"
                  style={{ y: yNear }}
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold-line)] to-transparent opacity-60" />

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=PV+Garden+Bilathikulam+Calicut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 no-underline"
                  >
                    <MapLeaf className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px]" />
                    <span className="font-['Cinzel'] text-[10px] md:text-[12px] tracking-[3px] text-[var(--color-gold-line)] uppercase font-semibold">
                      Directions
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-[12px] sm:text-[13px] text-[var(--color-ink)] opacity-60">
                      Tap to open Maps
                    </span>
                  </a>
                </motion.div>
              </div>
            </div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 1.4 }}
              className="w-[120px] mt-16 mx-auto"
              style={{ y: yFar }}
            >
              <FooterLeaf className="w-full" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
