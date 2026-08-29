import { useState, useEffect } from 'react';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const emptyTime: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const WEDDING_DATE = new Date('2026-10-25T07:45:00').getTime();
const RECEPTION_DATE = new Date('2026-11-01T18:30:00').getTime();

function calcTimeLeft(target: number): TimeLeft {
  const difference = target - Date.now();
  if (difference <= 0) return emptyTime;
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

function TimeUnits({ timeLeft }: { timeLeft: TimeLeft }) {
  return (
    <div className="grid grid-cols-4 gap-1 w-full">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hrs', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Sec', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center min-w-0">
          <span className="font-['Cormorant_Garamond'] text-[22px] sm:text-[28px] md:text-[32px] text-[var(--color-olive-deep)] font-semibold leading-none tabular-nums">
            {item.value.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[var(--color-ink)] opacity-60 mt-1.5 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function CountdownBlock({
  label,
  subtitle,
  timeLeft,
}: {
  label: string;
  subtitle: string;
  timeLeft: TimeLeft;
}) {
  return (
    <div className="w-full rounded-xl border border-[rgba(74,90,55,0.12)] bg-[rgba(74,90,55,0.04)] px-3 py-4 sm:px-5 sm:py-5">
      <p className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[3px] uppercase text-[var(--color-olive-deep)] text-center font-semibold">
        {label}
      </p>
      <p className="font-['Cormorant_Garamond'] text-[12px] sm:text-[13px] text-[var(--color-ink)] opacity-55 text-center mt-0.5 mb-3 tracking-wide">
        {subtitle}
      </p>
      <TimeUnits timeLeft={timeLeft} />
    </div>
  );
}

export const CountdownTimer = () => {
  const [weddingLeft, setWeddingLeft] = useState<TimeLeft>(() => calcTimeLeft(WEDDING_DATE));
  const [receptionLeft, setReceptionLeft] = useState<TimeLeft>(() => calcTimeLeft(RECEPTION_DATE));

  useEffect(() => {
    const tick = () => {
      setWeddingLeft(calcTimeLeft(WEDDING_DATE));
      setReceptionLeft(calcTimeLeft(RECEPTION_DATE));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 mb-6 w-full max-w-xl mx-auto flex flex-col gap-3">
      <CountdownBlock
        label="Wedding"
        subtitle="25 Oct 2026 · Dindigul"
        timeLeft={weddingLeft}
      />
      <CountdownBlock
        label="Reception"
        subtitle="01 Nov 2026 · Calicut"
        timeLeft={receptionLeft}
      />
    </div>
  );
};
