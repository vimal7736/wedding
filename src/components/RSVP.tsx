import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export const RSVP = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [attending, setAttending] = useState('yes');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmitted(true);
      // Here you would typically send the data to a backend
      console.log('RSVP:', { name, attending, message });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md mx-auto mt-20 mb-10 p-8 bg-[rgba(30,36,20,0.5)] backdrop-blur-xl rounded-2xl border border-[rgba(169,138,75,0.3)] shadow-[inset_2px_2px_10px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="text-center font-['Cinzel'] text-[16px] tracking-[4px] text-[var(--color-gold-line)] uppercase mb-8">
        RSVP
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div>
              <input 
                type="text" 
                required
                placeholder="Your Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[rgba(0,0,0,0.2)] border-b border-[rgba(169,138,75,0.4)] text-[var(--color-beige-paper)] font-['Jost'] px-4 py-3 outline-none focus:border-[var(--color-gold-line)] transition-colors placeholder:text-[rgba(255,255,255,0.3)]"
              />
            </div>
            
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="attending" 
                  value="yes" 
                  checked={attending === 'yes'}
                  onChange={(e) => setAttending(e.target.value)}
                  className="hidden peer"
                />
                <div className="text-center py-3 px-4 rounded-lg border border-[rgba(169,138,75,0.3)] text-[var(--color-beige-warm)] font-['Jost'] text-[14px] uppercase tracking-[1px] peer-checked:bg-[rgba(169,138,75,0.2)] peer-checked:border-[var(--color-gold-line)] transition-all">
                  Joyfully Accept
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="attending" 
                  value="no" 
                  checked={attending === 'no'}
                  onChange={(e) => setAttending(e.target.value)}
                  className="hidden peer"
                />
                <div className="text-center py-3 px-4 rounded-lg border border-[rgba(169,138,75,0.3)] text-[var(--color-beige-warm)] font-['Jost'] text-[14px] uppercase tracking-[1px] peer-checked:bg-[rgba(255,255,255,0.05)] transition-all">
                  Regretfully Decline
                </div>
              </label>
            </div>

            <div>
              <textarea 
                placeholder="Leave a wish for the couple (optional)" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[rgba(0,0,0,0.2)] border-b border-[rgba(169,138,75,0.4)] text-[var(--color-beige-paper)] font-['Jost'] px-4 py-3 outline-none focus:border-[var(--color-gold-line)] transition-colors placeholder:text-[rgba(255,255,255,0.3)] resize-none h-24"
              />
            </div>

            <button 
              type="submit"
              className="mt-2 flex items-center justify-center gap-3 w-full py-4 bg-[var(--color-gold-line)] hover:bg-[#c2a25a] text-[var(--color-olive-deep)] font-semibold rounded-lg transition-colors group"
            >
              <span className="font-['Cinzel'] tracking-[2px] uppercase text-[14px]">Send RSVP</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.form>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-[var(--color-gold-line)] mb-4" />
            <h3 className="font-['Cormorant_Garamond'] text-[28px] text-[var(--color-beige-paper)] mb-2">Thank You!</h3>
            <p className="font-['Jost'] text-[15px] text-[var(--color-beige-warm)] opacity-80">
              We have received your response.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
