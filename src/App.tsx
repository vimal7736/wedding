import { InvitationCard } from './components/InvitationCard';
import { AudioPlayer } from './components/AudioPlayer';
import { FallingParticles } from './components/FallingParticles';
import { OrbitingImages } from './components/OrbitingImages';


function App() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-start py-12 px-4 overflow-hidden bg-[var(--color-olive-deep)]">


      <OrbitingImages />
      <FallingParticles />
      <AudioPlayer />
      
      {/* Elegant Header */}
      <div className="relative z-10 text-center mb-2 mt-16 select-none pointer-events-none">
        <span className="font-['Cinzel'] text-[11px] md:text-[13px] tracking-[0.5em] text-[var(--color-beige-warm)] font-bold uppercase opacity-95 block mb-3">
          Wedding Invitation
        </span>
        <h2 className="font-['Cormorant_Garamond'] italic text-3xl md:text-5xl text-[var(--color-beige-paper)] font-light tracking-wide">
          Vimal & Aishwariya
        </h2>
        <div className="w-16 h-[1px] bg-[rgba(169,138,75,0.35)] mx-auto mt-4" />
      </div>

      <InvitationCard />

      {/* Blessing Footer */}
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-6 pb-20 pt-8 flex flex-col items-center gap-5">


        <div className="flex items-center gap-4 mt-2 opacity-50">
          <div className="flex-1 h-[1px] bg-[rgba(200,169,110,0.4)]" />
          <svg viewBox="0 0 24 24" width={18} height={18} fill="#c8a96e">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <div className="flex-1 h-[1px] bg-[rgba(200,169,110,0.4)]" />
        </div>

        <p className="font-['Cinzel'] text-[10px] md:text-[11px] tracking-[4px] text-[var(--color-beige-warm)] font-bold uppercase opacity-90">
          Vimal &nbsp;✦&nbsp; Aishwariya &nbsp;·&nbsp; 01 November 2026
        </p>
      </div>

    </main>
  );
}

export default App;
