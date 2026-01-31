"use client";

import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";
import { ReactNode, useCallback, useState } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  onClick?: () => void;
  href?: string;
  soundEnabled?: boolean;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  radius = 100,
  onClick,
  href,
  soundEnabled = true,
}: MagneticButtonProps) {
  const { ref, position, handlers } = useMagneticEffect({ strength, radius });
  const { playHover, playClick, playButtonDown, playButtonUp } = useAudio({
    enabled: soundEnabled,
  });
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = useCallback(() => {
    playClick();
    onClick?.();
  }, [onClick, playClick]);

  const handleMouseEnter = useCallback(() => {
    playHover();
  }, [playHover]);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
    playButtonDown();
  }, [playButtonDown]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
    playButtonUp();
  }, [playButtonUp]);

  const handleTouchStart = useCallback(() => {
    setIsPressed(true);
    playButtonDown();
  }, [playButtonDown]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    playButtonUp();
  }, [playButtonUp]);

  const scale = isPressed ? 0.95 : 1;

  if (href) {
    return (
      <a
        ref={ref as unknown as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handlers.onMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={cn("magnetic-btn", className)}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        <span
          className="magnetic-btn-inner"
          style={{
            transform: `translate(${position.x * 0.5}px, ${
              position.y * 0.5
            }px)`,
          }}
        >
          {children}
        </span>
      </a>
    );
  }

  return (
    <button
      ref={ref as unknown as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handlers.onMouseMove as unknown as React.MouseEventHandler<HTMLButtonElement>}
      onMouseLeave={handlers.onMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn("magnetic-btn", className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
      }}
    >
      <span
        className="magnetic-btn-inner"
        style={{
          transform: `translate(${position.x * 0.5}px, ${position.y * 0.5}px)`,
        }}
      >
        {children}
      </span>
    </button>
  );
}
