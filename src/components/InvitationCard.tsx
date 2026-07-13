import { motion } from 'framer-motion';
import { Hills, KolamDivider, MapLeaf, FooterLeaf } from './Icons';
import { CountdownTimer } from './CountdownTimer';
import { PhotoCarousel } from './PhotoCarousel';
import { Itinerary } from './Itinerary';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const InvitationCard = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto z-10 p-4 pt-8 md:p-12 mt-4">
      <motion.div 
        className="glass-card rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="relative m-4 md:m-6 border border-[rgba(169,138,75,0.55)] p-2">
          {/* Inner border */}
          <div className="absolute inset-[6px] border border-[rgba(169,138,75,0.35)] pointer-events-none" />
          <div className="relative px-4 py-8 md:px-10 md:py-12 flex flex-col items-center text-center w-full">
            {/* Top tagline */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              className="w-full text-center mb-8"
            >
              <p className="font-['Cormorant_Garamond'] italic text-[24px] md:text-[32px] text-[var(--color-olive-deep)] leading-snug">
              Celebrate the start of our forever
              </p>
              <div className="w-16 h-[1px] bg-[rgba(169,138,75,0.35)] mx-auto my-3" />
              <p className="font-['Cormorant_Garamond'] italic text-[15px] md:text-[18px] text-[var(--color-ink)] opacity-80 tracking-wide leading-relaxed">
                Two hearts bound by destiny, two souls united in
              </p>
              <p className="font-['Cormorant_Garamond'] text-[22px] md:text-[28px] text-[var(--color-olive-deep)] font-semibold tracking-[1px] mt-1">
                Sacred Matrimony
              </p>
              <p className="font-['Cormorant_Garamond'] text-[13px] md:text-[15px] tracking-[4px] text-[var(--color-olive-mid)] uppercase mt-3">
                ✦ &nbsp; Vimal &nbsp; & &nbsp; Aishu &nbsp; ✦
              </p>
            </motion.div>

            <Hills className="w-full max-w-[400px] h-auto mx-auto mb-4 opacity-90" />

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] tracking-[4px] text-[var(--color-olive-deep)] uppercase mt-2 font-medium"
            >
              Together with their families
            </motion.div>

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="mt-4 font-['Cormorant_Garamond'] italic text-[16px] md:text-[19px] tracking-[0.5px] text-[var(--color-ink)] opacity-80"
            >
              Invited by his father Suresh & mother Jessy
            </motion.div>

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="mt-8 flex flex-col gap-6 md:gap-8 items-center w-full"
            >
              <div className="flex flex-col items-center">
                <span className="font-['Cormorant_Garamond'] text-2xl md:text-4xl text-[var(--color-olive-deep)] font-semibold tracking-wide">
                  Vimal Suresh
                </span>
                <span className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] mt-2 text-[var(--color-ink)] opacity-70 font-light tracking-[1px] uppercase">
                  Beloved son of Suresh & Jessy
                </span>
              </div>
              
              <div className="w-[40px] h-[1px] bg-[var(--color-gold-line)] opacity-50 my-1"></div>
              
              <div className="flex flex-col items-center">
                <span className="font-['Cormorant_Garamond'] text-2xl md:text-4xl text-[var(--color-olive-deep)] font-semibold tracking-wide">
                  B. Aishwariya
                </span>
                <span className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] mt-2 text-[var(--color-ink)] opacity-70 font-light tracking-[1px] uppercase">
                  Beloved daughter of Balu & Tamil Selvi
                </span>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="w-[180px] my-10"
            >
              <KolamDivider className="w-full" />
            </motion.div>

            {/* Replaced single image with PhotoCarousel */}
            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}
              className="w-full"
            >
              <PhotoCarousel />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)', letterSpacing: '-0.02em' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.02em' }}
              transition={{ delay: 0.7, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="font-['Cormorant_Garamond'] font-semibold text-[clamp(26px,6.5vw,72px)] leading-[1.2] text-[var(--color-olive-deep)] mt-6 whitespace-nowrap"
            >
              Vimal <span className="font-['Cormorant_Garamond'] italic font-normal text-[0.45em] text-[var(--color-ink)] px-[8px] md:px-[15px] align-middle">weds</span> Aishwariya
            </motion.h1>

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.8 }}
              className="mt-6 font-['Cormorant_Garamond'] text-[15px] md:text-[17px] tracking-[3px] uppercase text-[var(--color-ink)] opacity-80 font-medium"
            >
              You are cordially invited
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, width: 0 }} whileInView={{ opacity: 1, width: 100 }} transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }} viewport={{ once: true }}
              className="h-[1px] bg-[var(--color-gold-line)] my-10 mx-auto"
            />

            <motion.p 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.0 }}
              className="font-['Cormorant_Garamond'] text-[18px] md:text-[22px] leading-[1.8] text-[var(--color-ink)] max-w-[600px] mx-auto font-light"
            >
              Join us for an evening of joy, laughter and celebration
              as we welcome you to our wedding reception —
              a warm gathering to celebrate our new beginning together.
            </motion.p>
            
            <CountdownTimer />

            <Itinerary />

            <div className="w-full max-w-4xl mx-auto mt-12 mb-6 px-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 items-stretch relative">
                
                {/* Column 1: When */}
                <motion.div 
                  variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.1 }}
                  className="flex flex-col items-center justify-center text-center p-6 bg-[rgba(74,90,55,0.03)] rounded-2xl border border-[rgba(169,138,75,0.18)] relative overflow-hidden group hover:bg-[rgba(74,90,55,0.06)] hover:border-[rgba(169,138,75,0.35)] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold-line)] to-transparent opacity-60" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-['Cinzel'] text-[11px] md:text-[12px] tracking-[3px] text-[var(--color-gold-line)] uppercase font-semibold">Date</span>
                    <span className="font-['Cormorant_Garamond'] text-[32px] md:text-[38px] text-black font-semibold mt-1 leading-none">01 Nov</span>
                    <span className="font-['Cormorant_Garamond'] text-[14px] text-[var(--color-ink)] opacity-70 tracking-[2px] uppercase">Sunday</span>
                  </div>
                  
                  <div className="w-12 h-[1px] bg-[rgba(169,138,75,0.3)] my-4" />
                  
                  <div className="flex flex-col items-center">
                    <span className="font-['Cinzel'] text-[9px] md:text-[10px] tracking-[2px] text-[var(--color-olive-deep)] uppercase font-semibold opacity-75">Event</span>
                    <span className="font-['Cormorant_Garamond'] text-[20px] md:text-[22px] text-black font-medium mt-1">Reception</span>
                    <span className="font-['Cormorant_Garamond'] text-[13px] text-[var(--color-ink)] opacity-60 tracking-[1px] uppercase mt-0.5">Evening</span>
                  </div>
                </motion.div>

                {/* Column 2: Where */}
                <motion.div 
                  variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.2 }}
                  className="flex flex-col items-center justify-center text-center p-6 bg-[rgba(74,90,55,0.03)] rounded-2xl border border-[rgba(169,138,75,0.18)] relative overflow-hidden group hover:bg-[rgba(74,90,55,0.06)] hover:border-[rgba(169,138,75,0.35)] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold-line)] to-transparent opacity-60" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-['Cinzel'] text-[11px] md:text-[12px] tracking-[3px] text-[var(--color-gold-line)] uppercase font-semibold">Venue</span>
                    <span className="font-['Cormorant_Garamond'] text-[32px] md:text-[38px] text-black font-semibold mt-2 leading-none italic">PV Garden</span>
                    <span className="font-['Cormorant_Garamond'] text-[15px] md:text-[17px] text-[var(--color-ink)] opacity-75 mt-3 max-w-[200px] leading-relaxed">
                      Bilathikulam, Calicut
                    </span>
                  </div>
                </motion.div>

                {/* Column 3: Directions */}
                <motion.div 
                  variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.3 }}
                  className="flex flex-col items-center justify-center text-center p-6 bg-[rgba(74,90,55,0.03)] rounded-2xl border border-[rgba(169,138,75,0.18)] relative overflow-hidden group hover:bg-[rgba(74,90,55,0.06)] hover:border-[rgba(169,138,75,0.35)] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold-line)] to-transparent opacity-60" />
                  
                  <a href="https://www.google.com/maps/search/?api=1&query=PV+Garden+Bilathikulam+Calicut" target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 no-underline transition-all duration-300 group-hover:scale-105">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[var(--color-gold-line)] opacity-0 group-hover:opacity-10 rounded-full blur-md transition-all duration-300" />
                      <MapLeaf className="w-[80px] h-[80px] relative z-10 drop-shadow-[0_3px_6px_rgba(169,138,75,0.15)]" />
                    </div>
                    <span className="font-['Cinzel'] text-[11px] md:text-[12px] tracking-[3px] text-[var(--color-gold-line)] uppercase font-semibold">Directions</span>
                    <span className="font-['Cormorant_Garamond'] text-[13px] text-[var(--color-ink)] opacity-60 group-hover:text-[var(--color-olive-deep)] transition-colors duration-300">Tap to open Maps</span>
                  </a>
                </motion.div>
              </div>
            </div>

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.4 }}
              className="w-[120px] mt-16 mx-auto"
            >
              <FooterLeaf className="w-full" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
