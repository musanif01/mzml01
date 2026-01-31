"use client";

import React from "react";
import { TiltCard } from "@/components/TiltCard";
import { ScrollReveal } from "@/components/ScrollReveal";

interface WhoWeAreSectionProps {
  soundEnabled?: boolean;
}

const values = [
  {
    title: "Our Mission",
    text: "To empower businesses with technology that drives growth, efficiency, and innovation.",
  },
  {
    title: "Our Vision",
    text: "To be the premier partner for businesses seeking transformative digital solutions.",
  },
  {
    title: "Our Values",
    text: "Excellence, integrity, innovation, and unwavering commitment to client success.",
  },
];

export function WhoWeAreSection({ soundEnabled = true }: WhoWeAreSectionProps) {
  return (
    <section id="who-we-are" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-32 h-32 border-8 border-primary opacity-10 rotate-12" />
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary opacity-10 rounded-full" />

      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-primary mb-4">
            — Our Story —
          </p>
          <h2 className="font-western text-5xl md:text-6xl text-[#1a1a1a]">
            Who We Are
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Description */}
          <ScrollReveal variant="left">
            <div className="relative group">
              <div className="absolute -top-4 -left-4 w-full h-full border-4 border-primary transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2" />
              <div className="relative bg-primary p-8 md:p-12 text-secondary">
                <h3 className="font-western text-3xl mb-6">
                  Pioneers in Digital Craft
                </h3>
                <p className="font-typewriter text-base leading-relaxed mb-4">
                  MZML Corp stands at the intersection of artistry and
                  engineering. Founded by a collective of passionate developers
                  and designers, we&apos;ve made it our mission to transform
                  complex problems into elegant digital solutions.
                </p>
                <p className="font-typewriter text-base leading-relaxed">
                  Our approach combines time-tested methodologies with
                  cutting-edge technologies, ensuring every project we undertake
                  exceeds expectations and stands the test of time.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column - Values Cards */}
          <div className="space-y-6">
            {values.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 150}>
                <TiltCard
                  maxTilt={8}
                  scale={1.02}
                  soundEnabled={soundEnabled}
                  className="geometric-block p-6 group cursor-pointer bg-primary border-secondary"
                >
                  <h4 className="font-western text-2xl text-black mb-2">
                    {item.title}
                  </h4>
                  <p className="font-mono text-sm text-black/90">{item.text}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export type { WhoWeAreSectionProps };
