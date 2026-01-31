"use client";

import { useCallback, useRef, useEffect } from "react";

interface UseAudioOptions {
  enabled?: boolean;
}

// Audio context singleton
let audioContext: AudioContext | null = null;
let isContextUnlocked = false;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Sound synthesizers
const createClickSound = (ctx: AudioContext) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
};

const createPopSound = (ctx: AudioContext) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
};

const createButtonDownSound = (ctx: AudioContext) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
};

const createButtonUpSound = (ctx: AudioContext) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
};

const createSlideSound = (ctx: AudioContext) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(100, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.15);
  
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 0.15);
  
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
};

const createSuccessSound = (ctx: AudioContext) => {
  // Play a pleasant major chord arpeggio
  const notes = [523.25, 659.25, 783.99]; // C major: C, E, G
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.value = freq;
    
    const startTime = ctx.currentTime + i * 0.05;
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + 0.35);
  });
};

export function useAudio(options: UseAudioOptions = {}) {
  const { enabled = true } = options;
  const ctxRef = useRef<AudioContext | null>(null);
  
  useEffect(() => {
    ctxRef.current = getAudioContext();
  }, []);

  const unlockAudio = useCallback(async () => {
    const ctx = ctxRef.current || getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    
    if (!isContextUnlocked) {
      // Play silent sound to unlock
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.001);
      
      isContextUnlocked = true;
    }
  }, []);

  const play = useCallback(
    async (soundCreator: (ctx: AudioContext) => void) => {
      if (!enabled) return;
      
      const ctx = ctxRef.current || getAudioContext();
      if (!ctx) return;
      
      // Ensure context is unlocked
      if (!isContextUnlocked || ctx.state === "suspended") {
        await unlockAudio();
      }
      
      try {
        soundCreator(ctx);
      } catch (error) {
        console.error("Audio playback error:", error);
      }
    },
    [enabled, unlockAudio]
  );

  // Specific sound functions
  const playClick = useCallback(() => play(createClickSound), [play]);
  const playHover = useCallback(() => play(createPopSound), [play]);
  const playButtonDown = useCallback(() => play(createButtonDownSound), [play]);
  const playButtonUp = useCallback(() => play(createButtonUpSound), [play]);
  const playSlide = useCallback(() => play(createSlideSound), [play]);
  const playEnter = useCallback(() => play(createPopSound), [play]);
  const playOpen = useCallback(() => play(createButtonDownSound), [play]);
  const playClose = useCallback(() => play(createButtonUpSound), [play]);
  const playSuccess = useCallback(() => play(createSuccessSound), [play]);
  const playToggle = useCallback(() => play(createClickSound), [play]);

  return {
    playClick,
    playHover,
    playButtonDown,
    playButtonUp,
    playSlide,
    playEnter,
    playOpen,
    playClose,
    playSuccess,
    playToggle,
    unlockAudio,
  };
}

// Backward compatibility
export function useSound(options: UseAudioOptions = {}) {
  const audio = useAudio(options);
  
  return {
    playHoverSound: audio.playHover,
    playClickSound: audio.playClick,
    playSuccessSound: audio.playSuccess,
    ...audio,
  };
}
