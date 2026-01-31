"use client";

import { useTextScramble } from "@/hooks/useTextScramble";
import { cn } from "@/lib/utils";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  trigger?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
}

export function TextScramble({
  text,
  className,
  duration = 1500,
  delay = 0,
  trigger = true,
  as: Component = "span",
}: TextScrambleProps) {
  const { displayText, isScrambling } = useTextScramble({
    text,
    duration,
    delay,
    trigger,
  });

  return (
    <Component
      className={cn(
        "font-mono tracking-wider",
        isScrambling && "text-primary",
        className
      )}
    >
      {displayText}
    </Component>
  );
}
