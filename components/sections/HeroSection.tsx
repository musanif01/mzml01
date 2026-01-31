"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { TiltCard } from "@/components/TiltCard";
import { TextScramble } from "@/components/TextScramble";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useAudio } from "@/hooks/useAudio";

interface HeroSectionProps {
  soundEnabled?: boolean;
}

const stats = [
  { value: 15, suffix: "+", label: "Projects Delivered" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 5, suffix: "+", label: "Years Experience" },
];

export function HeroSection({ soundEnabled = true }: HeroSectionProps) {
  const [heroRevealed, setHeroRevealed] = useState(false);
  const { playHover, playClick } = useAudio({
    enabled: soundEnabled,
  });

  // Hero reveal on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroRevealed(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      playClick();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [playClick],
  );

  return (
    <section className="relative min-h-screen flex items-center pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-32 left-10 w-16 h-16 border-4 border-primary opacity-20 animate-pulse" />
      <div className="absolute bottom-32 right-20 w-24 h-24 bg-primary opacity-10 rotate-45" />
      <div className="absolute top-1/2 left-20 w-8 h-8 bg-primary rounded-full opacity-20" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-primary animate-pulse" />
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-primary animate-pulse"
              style={{ animationDelay: "1s" }}
            />

            <div className="relative bg-secondary p-8 md:p-12 border-4 border-primary shadow-2xl">
              <div className="absolute -top-3 left-8 bg-primary px-4 py-1">
                <p className="font-mono text-xs text-secondary uppercase tracking-widest">
                  Est. 2024
                </p>
              </div>

              {heroRevealed && (
                <>
                  <TextScramble
                    text="Premium Software Solutions"
                    className="text-sm uppercase tracking-widest text-primary mb-4 mt-4 block"
                    duration={1000}
                    delay={200}
                  />

                  <h1 className="font-western text-5xl md:text-7xl text-[#1a1a1a] leading-tight mb-6">
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
                      className="text-primary"
                    />
                  </h1>

                  <ScrollReveal delay={1000}>
                    <p className="font-typewriter text-lg text-[#1a1a1a] mb-8 leading-relaxed">
                      We engineer bespoke software solutions that drive business
                      growth and deliver exceptional user experiences.
                    </p>
                  </ScrollReveal>

                  <ScrollReveal delay={1200}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <MagneticButton
                        href="#contact"
                        onClick={() => handleNavClick("#contact")}
                        strength={0.3}
                        soundEnabled={soundEnabled}
                        className="ticket-btn text-center"
                      >
                        Book Appointment
                      </MagneticButton>
                      <button
                        onClick={() => handleNavClick("#services")}
                        onMouseEnter={() => playHover()}
                        className="inline-flex items-center justify-center px-6 py-4 font-mono text-sm uppercase tracking-widest border-4 border-primary text-primary hover:bg-primary hover:text-secondary transition-all duration-300 group"
                      >
                        Our Services
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </ScrollReveal>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Stats Cards */}
          <div className="relative hidden md:block">
            <ScrollReveal variant="scale" delay={600}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary transform translate-x-4 translate-y-4 transition-transform duration-500 hover:translate-x-6 hover:translate-y-6" />
                <div className="relative bg-secondary border-4 border-primary p-8 shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <TiltCard
                        key={stat.label}
                        maxTilt={10}
                        scale={1.05}
                        glare={true}
                        soundEnabled={soundEnabled}
                        className={`stat-card p-6 text-secondary cursor-pointer ${
                          index % 2 === 0 ? "bg-primary" : "bg-[#1a3a5c]"
                        }`}
                      >
                        <AnimatedCounter
                          end={stat.value}
                          suffix={stat.suffix}
                          duration={2000}
                          delay={1500 + index * 200}
                          className="font-western text-4xl mb-2"
                        />
                        <p className="font-mono text-sm">{stat.label}</p>
                      </TiltCard>
                    ))}
                    <TiltCard
                      maxTilt={10}
                      scale={1.05}
                      glare={true}
                      soundEnabled={soundEnabled}
                      className="stat-card bg-[#1a3a5c] p-6 text-secondary cursor-pointer"
                    >
                      <p className="font-western text-4xl mb-2">24/7</p>
                      <p className="font-mono text-sm">Support Available</p>
                    </TiltCard>
                    <TiltCard
                      maxTilt={10}
                      scale={1.05}
                      glare={true}
                      soundEnabled={soundEnabled}
                      className="stat-card bg-primary p-6 text-secondary cursor-pointer"
                    >
                      <AnimatedCounter
                        end={50}
                        suffix="+"
                        duration={2000}
                        delay={2100}
                        className="font-western text-4xl mb-2"
                      />
                      <p className="font-mono text-sm">Happy Clients</p>
                    </TiltCard>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { HeroSectionProps };
