const orbitItems = [
  { id: 0, angle: 0, radius: 38, size: 22, color: '#d98f3c', kind: 'heart' as const },
  { id: 1, angle: 72, radius: 42, size: 16, color: '#a98a4b', kind: 'petal' as const },
  { id: 2, angle: 144, radius: 36, size: 20, color: '#e8dcc0', kind: 'heart' as const },
  { id: 3, angle: 216, radius: 40, size: 15, color: '#d98f3c', kind: 'petal' as const },
  { id: 4, angle: 288, radius: 44, size: 18, color: '#a98a4b', kind: 'heart' as const },
];

export const OrbitingImages = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center" aria-hidden>
      <div className="orbit-ring relative w-[min(90vw,520px)] aspect-square opacity-50">
        {orbitItems.map((item) => (
          <div
            key={item.id}
            className="absolute left-1/2 top-1/2"
            style={{
              width: item.size,
              height: item.size,
              marginLeft: -item.size / 2,
              marginTop: -item.size / 2,
              transform: `rotate(${item.angle}deg) translateY(-${item.radius}%)`,
            }}
          >
            <div className="orbit-counter">
              {item.kind === 'heart' ? (
                <svg viewBox="0 0 24 24" width={item.size} height={item.size} fill={item.color} opacity={0.55}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg viewBox="0 0 512 512" width={item.size} height={item.size} fill={item.color} opacity={0.45}>
                  <path d="M495.1 76.5c-27.4-44.4-83.3-65.5-133.5-49.3-51.5 16.6-86.7 65.3-85.3 118.8 1.4-53.5-33.8-102.2-85.3-118.8-50.2-16.2-106.1 4.9-133.5 49.3-26.6 43-22 101.3 11.2 139.7 58.1 67.2 166.5 119.5 207.6 270 41.1-150.5 149.5-202.8 207.6-270 33.2-38.4 37.8-96.7 11.2-139.7z" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
