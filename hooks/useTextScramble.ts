"use client";

import { useState, useEffect, useCallback } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface UseTextScrambleOptions {
  text: string;
  duration?: number;
  delay?: number;
  trigger?: boolean;
}

export function useTextScramble({
  text,
  duration = 1500,
  delay = 0,
  trigger = true,
}: UseTextScrambleOptions) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = useCallback(() => {
    if (!trigger) return;
    
    setIsScrambling(true);
    const originalText = text;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      
      const progress = currentStep / steps;
      const revealedLength = Math.floor(progress * originalText.length);
      
      let result = "";
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === " ") {
          result += " ";
        } else if (i < revealedLength) {
          result += originalText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      setDisplayText(result);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayText(originalText);
        setIsScrambling(false);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [text, duration, trigger]);

  useEffect(() => {
    if (!trigger) {
      setDisplayText(text);
      return;
    }

    const timer = setTimeout(() => {
      scramble();
    }, delay);

    return () => clearTimeout(timer);
  }, [scramble, delay, trigger, text]);

  return { displayText, isScrambling, scramble };
}
