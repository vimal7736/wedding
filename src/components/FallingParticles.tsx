const leaves = [
  { id: 'lf1', left: '6%', delay: '0s', duration: '22s', size: 12, color: '#e8dcc0' },
  { id: 'lf2', left: '18%', delay: '6s', duration: '26s', size: 10, color: '#98a97e' },
  { id: 'lf3', left: '78%', delay: '3s', duration: '24s', size: 13, color: '#a98a4b' },
  { id: 'lf4', left: '92%', delay: '9s', duration: '28s', size: 11, color: '#98a97e' },
  { id: 'lf5', left: '12%', delay: '14s', duration: '25s', size: 10, color: '#e8dcc0' },
  { id: 'lf6', left: '86%', delay: '11s', duration: '23s', size: 12, color: '#a98a4b' },
];

const hearts = [
  { id: 'h1', left: '10%', delay: '4s', duration: '32s', size: 14, color: '#d98f3c' },
  { id: 'h2', left: '88%', delay: '12s', duration: '36s', size: 12, color: '#a98a4b' },
  { id: 'h3', left: '94%', delay: '2s', duration: '30s', size: 11, color: '#e8dcc0' },
];

export const FallingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {leaves.map((lf) => (
        <svg
          key={lf.id}
          viewBox="0 0 20 20"
          className="absolute fall-particle"
          style={{
            left: lf.left,
            width: lf.size,
            height: lf.size,
            fill: lf.color,
            opacity: 0.45,
            animationDuration: lf.duration,
            animationDelay: lf.delay,
          }}
        >
          <path d="M0,0 Q5,-3 8,0 Q5,3 0,0" transform="translate(5, 10) scale(1.5)" />
        </svg>
      ))}

      {hearts.map((h) => (
        <svg
          key={h.id}
          viewBox="0 0 24 24"
          className="absolute fall-particle"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            fill: h.color,
            opacity: 0.4,
            animationDuration: h.duration,
            animationDelay: h.delay,
          }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
};
