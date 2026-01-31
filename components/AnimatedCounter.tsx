"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  delay = 0,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}: AnimatedCounterProps) {
  const { count, ref } = useCountUp({
    end,
    duration,
    delay,
    decimals,
    suffix,
    prefix,
  });

  return (
    <span ref={ref} className={cn("stat-number", className)}>
      {count}
    </span>
  );
}
