const PHOTO = '/watermark.jpeg';
const CLIP = 'url(#heartClip)';

/** Single couple photo in a heart frame — no carousel. */
export const PhotoCarousel = () => {
  return (
    <div className="flex flex-col items-center mb-4 w-full">
      <svg width="0" height="0" className="absolute overflow-hidden" aria-hidden>
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.9 C0.18,0.68 0,0.52 0,0.33 C0,0.13 0.14,0 0.33,0 C0.42,0 0.5,0.06 0.5,0.06 C0.5,0.06 0.58,0 0.67,0 C0.86,0 1,0.13 1,0.33 C1,0.52 0.82,0.68 0.5,0.9 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative flex items-center justify-center w-[min(78vw,280px)] aspect-square">
        <div className="relative z-10 w-[84%] h-[84%]">
          <img
            src={PHOTO}
            alt="Vimal & Aishwariya"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top block"
            style={{ clipPath: CLIP }}
          />
          <div
            className="absolute inset-0 pointer-events-none z-[6]"
            style={{
              clipPath: CLIP,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, transparent 45%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
