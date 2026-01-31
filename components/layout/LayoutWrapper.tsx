"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { useAudioUnlock } from "@/hooks/useAudioUnlock";

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const { playToggle } = useAudio({ enabled: soundEnabled });
  
  // Unlock audio on first user interaction
  useAudioUnlock();

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse tracking for cursor glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] noise-bg overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Cursor Glow Effect */}
      <div
        ref={cursorGlowRef}
        className="cursor-glow hidden md:block"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          opacity: scrollProgress > 5 ? 0.5 : 0.8,
        }}
      />

      {/* Sound Toggle */}
      <button
        onClick={() => {
          playToggle();
          setSoundEnabled(!soundEnabled);
        }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#26538d] text-[#f0ffff] border-4 border-[#1a3a5c] flex items-center justify-center hover:bg-[#1a3a5c] transition-all duration-300 group"
        aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        ) : (
          <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Parallax Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="bg-decoration bg-decoration-1 absolute top-20 left-10 parallax-layer"
          style={{
            transform: `translateY(${scrollProgress * 0.5}px)`,
          }}
        />
        <div
          className="bg-decoration bg-decoration-2 absolute top-40 right-20 parallax-layer"
          style={{
            transform: `translateY(${scrollProgress * 0.3}px)`,
          }}
        />
        <div
          className="bg-decoration bg-decoration-3 absolute bottom-40 left-1/4 parallax-layer"
          style={{
            transform: `translateY(${scrollProgress * -0.4}px)`,
          }}
        />
        <div
          className="bg-decoration bg-decoration-4 absolute top-1/3 right-1/3 parallax-layer"
          style={{
            transform: `translateY(${scrollProgress * 0.6}px)`,
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}

export type { LayoutWrapperProps };
