"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function StatItem({ value, suffix, label, format }: { value: number; suffix: string; label: string; format: boolean }) {
  const { count, ref } = useCountUp(value);
  const display = format ? count.toLocaleString() : String(count);

  return (
    <div className="flex flex-col items-center" ref={ref}>
      <span className="text-2xl font-black text-white sm:text-3xl">
        {display}
        <span className="text-lg font-bold text-white/80 sm:text-xl">{suffix}</span>
      </span>
      <span className="mt-1 text-xs text-white/60 sm:text-sm">{label}</span>
    </div>
  );
}

const stats = [
  { value: 73000, suffix: "+", label: "누적 상담건수", format: true },
  { value: 20, suffix: "년+", label: "업력", format: false },
];

export default function HeroStats() {
  return (
    <div className="flex items-center justify-center gap-8 sm:gap-16">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
}
