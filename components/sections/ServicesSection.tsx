"use client";

import React, { useCallback } from "react";
import {
  Code,
  Globe,
  Smartphone,
  Palette,
  Wrench,
  Cloud,
  RefreshCw,
  ShoppingCart,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAudio } from "@/hooks/useAudio";

interface ServicesSectionProps {
  soundEnabled?: boolean;
}

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Code,
    title: "Custom Software",
    description:
      "Bespoke solutions engineered to address your unique business challenges with precision.",
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Responsive, high-performance websites built with cutting-edge technologies.",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Intuitive interfaces and seamless user experiences that delight and convert.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description:
      "Ongoing support and updates to keep your systems running flawlessly.",
  },
  {
    icon: Cloud,
    title: "DevOps",
    description:
      "Streamlined deployment pipelines and cloud infrastructure management.",
  },
  {
    icon: RefreshCw,
    title: "Website Redesign",
    description:
      "Transform your existing digital presence into a modern masterpiece.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Full-featured online stores with secure payment processing.",
  },
];

export function ServicesSection({ soundEnabled = true }: ServicesSectionProps) {
  const { playHover, playClick } = useAudio({
    enabled: soundEnabled,
  });

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
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Decorations */}
      <div className="absolute top-40 left-20 w-20 h-20 border-4 border-dashed border-primary opacity-20 rotate-45 animate-spin" />
      <div className="absolute bottom-40 right-20 w-16 h-16 bg-primary opacity-10 rounded-full animate-pulse" />

      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-primary mb-4">
            — What We Offer —
          </p>
          <h2 className="font-western text-5xl md:text-6xl text-[#1a1a1a] mb-6">
            Our Services
          </h2>
          <p className="font-typewriter text-lg text-[#1a1a1a] max-w-2xl mx-auto">
            Comprehensive software solutions tailored to your unique business
            needs
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 100}>
              <TiltCard
                maxTilt={12}
                scale={1.03}
                glare={true}
                soundEnabled={soundEnabled}
                className="service-card-3d p-6 cursor-pointer h-full"
              >
                <div className="corner-decoration top-left" />
                <div className="corner-decoration bottom-right" />

                <service.icon className="service-icon w-12 h-12 text-primary mb-4 transition-colors duration-300" />
                <h3 className="service-title font-western text-xl text-[#1a1a1a] mb-3 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="service-description font-mono text-sm text-[#1a1a1a] transition-colors duration-300">
                  {service.description}
                </p>

                <div className="mt-4 pt-4 border-t-2 border-dotted border-primary transition-colors duration-300">
                  <button
                    onClick={() => handleNavClick("#contact")}
                    onMouseEnter={() => playHover()}
                    className="inline-flex items-center font-mono text-xs uppercase tracking-wider text-primary hover:underline transition-colors duration-300"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export type { ServicesSectionProps, Service };
