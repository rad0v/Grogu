"use client";

import { useEffect, useRef, useState } from "react";

import { formatCompactNumber } from "@/lib/utils";

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasStarted.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted.current) return;
        hasStarted.current = true;

        const startedAt = performance.now();
        const duration = 1100;
        const animate = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.round(value * eased));
          if (progress < 1) window.requestAnimationFrame(animate);
        };

        window.requestAnimationFrame(animate);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{formatCompactNumber(displayValue)}</span>;
}