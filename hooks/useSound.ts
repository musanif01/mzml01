"use client";

import { useRef, useCallback } from "react";

interface UseSoundOptions {
  volume?: number;
  enabled?: boolean;
}

// Simple beep sound using Web Audio API
export function useSound(options: UseSoundOptions = {}) {
  const { volume = 0.3, enabled = true } = options;
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  }, []);

  const playHoverSound = useCallback(() => {
    if (!enabled) return;
    initAudioContext();
    
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [enabled, volume, initAudioContext]);

  const playClickSound = useCallback(() => {
    if (!enabled) return;
    initAudioContext();
    
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }, [enabled, volume, initAudioContext]);

  const playSuccessSound = useCallback(() => {
    if (!enabled) return;
    initAudioContext();
    
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Play a pleasant chord
    const frequencies = [523.25, 659.25, 783.99]; // C major chord
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.05);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + index * 0.05);
      gainNode.gain.linearRampToValueAtTime(volume * 0.15, ctx.currentTime + index * 0.05 + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.05 + 0.5);

      oscillator.start(ctx.currentTime + index * 0.05);
      oscillator.stop(ctx.currentTime + index * 0.05 + 0.5);
    });
  }, [enabled, volume, initAudioContext]);

  return {
    playHoverSound,
    playClickSound,
    playSuccessSound,
  };
}
