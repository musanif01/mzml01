"use client";

import { useRef, useCallback, useState } from "react";

interface Use3DTiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
}

interface TiltValues {
  rotateX: number;
  rotateY: number;
  scale: number;
  glareX: number;
  glareY: number;
}

export function use3DTilt(options: Use3DTiltOptions = {}) {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.02,
    speed = 400,
    glare = false,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [tiltValues, setTiltValues] = useState<TiltValues>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
  });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const rotateX = ((mouseY / height) * 2 - 1) * -maxTilt;
      const rotateY = ((mouseX / width) * 2 - 1) * maxTilt;

      setTiltValues({
        rotateX,
        rotateY,
        scale,
        glareX: (mouseX / width) * 100,
        glareY: (mouseY / height) * 100,
      });
    },
    [maxTilt, scale]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTiltValues({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
    });
  }, []);

  const style = {
    transform: `perspective(${perspective}px) rotateX(${tiltValues.rotateX}deg) rotateY(${tiltValues.rotateY}deg) scale3d(${tiltValues.scale}, ${tiltValues.scale}, ${tiltValues.scale})`,
    transition: isHovering ? `transform ${speed}ms ease-out` : `transform ${speed}ms ease-in-out`,
    transformStyle: "preserve-3d" as const,
  };

  const glareStyle = glare
    ? {
        background: `radial-gradient(circle at ${tiltValues.glareX}% ${tiltValues.glareY}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
        opacity: isHovering ? 1 : 0,
        transition: `opacity ${speed}ms ease-out`,
      }
    : undefined;

  return {
    ref,
    style,
    glareStyle,
    isHovering,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}
