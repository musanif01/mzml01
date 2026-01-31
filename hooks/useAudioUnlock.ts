"use client";

import { useEffect, useCallback } from "react";

// Global unlocker - only needs to run once
let hasUnlocked = false;

export function useAudioUnlock() {
  const unlockAudio = useCallback(async () => {
    if (hasUnlocked || typeof window === "undefined") return;
    
    try {
      // Create a short silent sound to unlock audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      
      // Play silent buffer
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      
      hasUnlocked = true;
      console.log("🔊 Audio context unlocked!");
    } catch (e) {
      // Ignore errors
    }
  }, []);

  useEffect(() => {
    if (hasUnlocked) return;
    
    const events = ["click", "touchstart", "keydown"];
    
    const handleInteraction = () => {
      unlockAudio();
      // Remove listeners after first interaction
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
    
    // Add listeners
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [unlockAudio]);

  return { unlockAudio };
}
