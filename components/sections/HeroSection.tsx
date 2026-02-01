"use client";

import React, { useState, useEffect } from "react";
import { TextScramble } from "@/components/TextScramble";
import { ScrollReveal } from "@/components/ScrollReveal";

interface HeroSectionProps {
  soundEnabled?: boolean;
}

export function HeroSection({ soundEnabled = true }: HeroSectionProps) {
  const [heroRevealed, setHeroRevealed] = useState(false);

  // Hero reveal on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroRevealed(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#faf9f6]">
      {/* Decorative elements */}
      <div className="absolute top-16 left-10 w-12 h-12 border-4 border-[#26538d] opacity-20" />
      <div className="absolute bottom-16 right-20 w-16 h-16 bg-[#26538d] opacity-10 rotate-45" />

      <div className="max-w-4xl mx-auto text-center">
        {heroRevealed && (
          <>
            <TextScramble
              text="Premium Software Solutions"
              className="text-sm uppercase tracking-widest text-[#26538d] mb-4 block"
              duration={1000}
              delay={200}
            />

            <h1 className="font-western text-5xl md:text-7xl lg:text-8xl text-[#1a1a1a] leading-tight mb-8">
              <TextScramble
                text="Crafting Digital"
                duration={1200}
                delay={500}
              />
              <br />
              <TextScramble
                text="Excellence"
                duration={1200}
                delay={800}
                className="text-[#26538d]"
              />
            </h1>

            <ScrollReveal delay={1000}>
              <p className="font-typewriter text-lg md:text-xl text-[#1a1a1a] max-w-2xl mx-auto leading-relaxed">
                We engineer bespoke software solutions that drive business
                growth and deliver exceptional user experiences. From concept to
                deployment, we transform your vision into reality.
              </p>
            </ScrollReveal>

            {/* Corner decorations around text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none">
              <div className="absolute top-0 left-1/4 w-24 h-24 border-t-4 border-l-4 border-[#26538d] opacity-30" />
              <div className="absolute bottom-0 right-1/4 w-24 h-24 border-b-4 border-r-4 border-[#26538d] opacity-30" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export type { HeroSectionProps };
