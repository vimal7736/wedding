import { CalendarPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export const AddToCalendar = () => {
  const handleDownloadIcs = () => {
    const event = {
      title: "Aishwariya & Vimal's Wedding Reception",
      description: "Join us for an evening of joy, laughter and celebration as we welcome you to our wedding reception.",
      location: "PV Garden, Bilathikulam, Calicut",
      startDate: "20261101T183000",
      endDate: "20261101T230000"
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aishwariya & Vimal//Wedding Invitation//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@wedding.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;TZID=Asia/Kolkata:${event.startDate}
DTEND;TZID=Asia/Kolkata:${event.endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Aishwariya_Vimal_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex justify-center mt-12"
    >
      <button 
        onClick={handleDownloadIcs}
        className="flex items-center gap-3 px-8 py-4 bg-[rgba(169,138,75,0.15)] hover:bg-[rgba(169,138,75,0.25)] border border-[rgba(169,138,75,0.4)] rounded-full transition-all duration-300 group shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-sm"
      >
        <CalendarPlus className="w-5 h-5 text-[var(--color-gold-line)] group-hover:scale-110 transition-transform duration-300" />
        <span className="font-['Cinzel'] text-[13px] tracking-[3px] text-[var(--color-beige-paper)] uppercase">
          Save The Date
        </span>
      </button>
    </motion.div>
  );
};
