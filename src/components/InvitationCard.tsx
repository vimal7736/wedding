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
              <p className="font-['Cormorant_Garamond'] italic text-[24px] md:text-[32px] text-[#e8dcc0] leading-snug">
                May your union be forever blessed
              </p>
              <div className="w-16 h-[1px] bg-[rgba(169,138,75,0.35)] mx-auto my-3" />
              <p className="font-['Cormorant_Garamond'] italic text-[15px] md:text-[18px] text-[var(--color-beige-warm)] opacity-80 tracking-wide leading-relaxed">
                Two hearts bound by destiny, two souls united in
              </p>
              <p className="font-['Cormorant_Garamond'] text-[22px] md:text-[28px] text-[var(--color-gold-line)] font-semibold tracking-[1px] mt-1">
                Sacred Matrimony
              </p>
              <p className="font-['Cormorant_Garamond'] text-[13px] md:text-[15px] tracking-[4px] text-[var(--color-beige-warm)] opacity-60 uppercase mt-3">
                ✦ &nbsp; Vimal &nbsp; & &nbsp; Aishu &nbsp; ✦
              </p>
            </motion.div>

            <Hills className="w-full max-w-[400px] h-auto mx-auto mb-4 opacity-90" />

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] tracking-[4px] text-[var(--color-gold-line)] uppercase mt-2 font-medium"
            >
              Together with their families
            </motion.div>

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="mt-4 font-['Cormorant_Garamond'] italic text-[16px] md:text-[19px] tracking-[0.5px] text-[var(--color-beige-warm)] opacity-80"
            >
              Invited by his father Suresh & mother Jessy
            </motion.div>

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="mt-8 flex flex-col gap-6 md:gap-8 items-center w-full"
            >
              <div className="flex flex-col items-center">
                <span className="font-['Cormorant_Garamond'] text-2xl md:text-4xl text-[var(--color-gold-line)] font-semibold tracking-wide">
                  Vimal Suresh
                </span>
                <span className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] mt-2 text-[var(--color-beige-paper)] opacity-80 font-light tracking-[1px] uppercase">
                  Beloved son of Suresh & Jessy
                </span>
              </div>
              
              <div className="w-[40px] h-[1px] bg-[var(--color-gold-line)] opacity-50 my-1"></div>
              
              <div className="flex flex-col items-center">
                <span className="font-['Cormorant_Garamond'] text-2xl md:text-4xl text-[var(--color-gold-line)] font-semibold tracking-wide">
                  B. Aishwariya
                </span>
                <span className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] mt-2 text-[var(--color-beige-paper)] opacity-80 font-light tracking-[1px] uppercase">
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
              initial={{ opacity: 0, y: 14, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.7, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }} viewport={{ once: true }}
              className="font-['Cormorant_Garamond'] font-semibold text-[clamp(40px,8vw,72px)] leading-[1.2] text-[var(--color-beige-paper)] mt-6"
            >
              Aishwariya <span className="font-['Cormorant_Garamond'] italic font-normal text-[0.4em] text-[var(--color-gold-line)] px-[15px] align-middle">weds</span> Vimal
            </motion.h1>

            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.8 }}
              className="mt-6 font-['Cormorant_Garamond'] text-[15px] md:text-[17px] tracking-[3px] uppercase text-[var(--color-beige-warm)] opacity-80 font-medium"
            >
              You are cordially invited
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, width: 0 }} whileInView={{ opacity: 1, width: 100 }} transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }} viewport={{ once: true }}
              className="h-[1px] bg-[var(--color-gold-line)] my-10 mx-auto"
            />

            <motion.p 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.0 }}
              className="font-['Cormorant_Garamond'] text-[18px] md:text-[22px] leading-[1.8] text-[var(--color-mist)] max-w-[600px] mx-auto font-light"
            >
              Join us for an evening of joy, laughter and celebration
              as we welcome you to our wedding reception —
              a warm gathering to celebrate our new beginning together.
            </motion.p>
            
            <CountdownTimer />

            <Itinerary />

            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 w-full mt-8">
              <motion.div 
                variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.1 }}
                className="flex justify-center gap-10 md:gap-16 flex-wrap"
              >
                <div className="min-w-[120px]">
                  <div className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] tracking-[2px] text-[var(--color-gold-line)] uppercase mb-3 font-semibold">Date</div>
                  <div className="font-['Cormorant_Garamond'] text-[28px] md:text-[36px] text-[var(--color-beige-paper)] font-medium">01 Nov</div>
                  <div className="font-['Cormorant_Garamond'] text-[14px] text-[var(--color-beige-warm)] opacity-80 mt-1 tracking-[1px] uppercase">Sunday</div>
                </div>
                <div className="w-[1px] bg-[rgba(169,138,75,0.4)] self-stretch hidden md:block" />
                <div className="min-w-[120px]">
                  <div className="font-['Cormorant_Garamond'] text-[14px] md:text-[16px] tracking-[2px] text-[var(--color-gold-line)] uppercase mb-3 font-semibold">Event</div>
                  <div className="font-['Cormorant_Garamond'] text-[28px] md:text-[36px] text-[var(--color-beige-paper)] font-medium">Reception</div>
                  <div className="font-['Cormorant_Garamond'] text-[14px] text-[var(--color-beige-warm)] opacity-80 mt-1 tracking-[1px] uppercase">Evening</div>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.2 }}
                className="flex flex-col items-center"
              >
                <div className="text-[14px] md:text-[16px] tracking-[2px] uppercase text-[var(--color-gold-line)] mb-3 font-['Cormorant_Garamond'] font-semibold">Venue</div>
                <div className="font-['Cormorant_Garamond'] text-[28px] md:text-[36px] italic text-[var(--color-beige-paper)]">PV Garden</div>
                <div className="font-['Cormorant_Garamond'] text-[16px] md:text-[18px] text-[var(--color-beige-warm)] opacity-80 mt-2 tracking-[0.5px]">Bilathikulam, Calicut</div>
              </motion.div>

              <motion.div 
                variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.3 }}
                className="flex flex-col items-center group mt-4 md:mt-0"
              >
                <a href="https://www.google.com/maps/search/?api=1&query=PV+Garden+Bilathikulam+Calicut" target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 no-underline transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105">
                  <MapLeaf className="w-[90px] h-[90px]" />
                </a>
                <div className="font-['Cormorant_Garamond'] text-[12px] md:text-[14px] tracking-[2px] uppercase text-[var(--color-beige-warm)] opacity-80 mt-3">Tap for map</div>
              </motion.div>
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
