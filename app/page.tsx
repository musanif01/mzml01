"use client";

import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Interactive3DHero } from "@/components/sections/Interactive3DHero";
import { WhoWeAreSection } from "@/components/sections/WhoWeAreSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CaseStudySection } from "@/components/sections/CaseStudySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <LayoutWrapper>
      {/* Navigation */}
      <Navigation soundEnabled={true} />

      {/* Interactive 3D Hero - Full immersive experience with 3D cards */}
      <Interactive3DHero />

      <HeroSection soundEnabled={true} />

      <div className="section-divider max-w-7xl mx-auto" />

      <WhoWeAreSection soundEnabled={true} />

      <div className="section-divider max-w-7xl mx-auto" />

      <ServicesSection soundEnabled={true} />

      <div className="section-divider max-w-7xl mx-auto" />

      <CaseStudySection soundEnabled={true} />

      <div className="section-divider max-w-7xl mx-auto" />

      <ContactSection soundEnabled={true} />

      {/* Footer */}
      <Footer soundEnabled={true} />
    </LayoutWrapper>
  );
}
