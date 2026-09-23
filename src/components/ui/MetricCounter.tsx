"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "framer-motion";

interface MetricCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  description?: string;
  className?: string;
}

export const MetricCounter: React.FC<MetricCounterProps> = ({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  description,
  className = "",
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const start = 0;
    const duration = 1500; // ms
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (value - start) * easeProgress;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(update);
  }, [isInView, value]);

  return (
    <div ref={ref} className={`flex flex-col ${className}`}>
      <div className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-[#00FF7F] tabular-nums green-glow-text">
        {prefix}
        {displayValue.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </div>
      <div className="mt-1 font-heading text-sm font-semibold uppercase tracking-wider text-[#E8FCEF]">
        {label}
      </div>
      {description && (
        <div className="mt-0.5 text-xs text-[#7FA98F]">
          {description}
        </div>
      )}
    </div>
  );
};
