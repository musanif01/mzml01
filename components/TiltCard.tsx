"use client";

import { use3DTilt } from "@/hooks/use3DTilt";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";
import { ReactNode, useCallback } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  soundEnabled?: boolean;
}

export function TiltCard({
  children,
  className,
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  soundEnabled = true,
}: TiltCardProps) {
  const { ref, style, glareStyle, handlers } = use3DTilt({
    maxTilt,
    perspective,
    scale,
    glare,
  });
  const { playEnter } = useAudio({ enabled: soundEnabled });

  const handleMouseEnter = useCallback(() => {
    playEnter();
    handlers.onMouseEnter();
  }, [handlers, playEnter]);

  return (
    <div
      ref={ref}
      className={cn("tilt-card", className)}
      style={style}
      onMouseMove={handlers.onMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
    >
      {children}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-inherit"
          style={glareStyle}
        />
      )}
    </div>
  );
}
