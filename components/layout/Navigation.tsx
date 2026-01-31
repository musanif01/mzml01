"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { useAudio } from "@/hooks/useAudio";

interface NavigationProps {
  soundEnabled?: boolean;
}

const navLinks = [
  { name: "Who We Are", href: "#who-we-are" },
  { name: "Services", href: "#services" },
  { name: "Success Stories", href: "#stories" },
  { name: "Contact", href: "#contact" },
];

export function Navigation({ soundEnabled = true }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { playHover, playClick, playOpen, playClose } = useAudio({
    enabled: soundEnabled,
  });

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      playClick();
      setMobileMenuOpen(false);
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [playClick],
  );

  const handleMobileMenuToggle = useCallback(() => {
    if (!mobileMenuOpen) {
      playOpen(); // Opening menu
    } else {
      playClose(); // Closing menu
    }
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen, playOpen, playClose]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#faf9f6]/95 backdrop-blur-sm shadow-lg border-b-4 border-primary"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <MagneticButton
            href="#"
            strength={0.2}
            radius={80}
            soundEnabled={soundEnabled}
            className="flex-shrink-0"
          >
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="font-mono text-2xl font-bold text-primary tracking-wider leading-none">
                MZML.
              </span>
            </div>
          </MagneticButton>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                onMouseEnter={() => playHover()}
                className="nav-link font-mono text-sm uppercase tracking-widest text-[#1a1a1a] hover:text-primary px-4 py-2 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </button>
            ))}
            <MagneticButton
              href="#contact"
              onClick={() => handleNavClick("#contact")}
              strength={0.25}
              soundEnabled={soundEnabled}
              className="ml-4 ticket-btn text-sm py-3 px-6"
            >
              Book Now
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileMenuToggle}
            onMouseEnter={() => playHover()}
            className="md:hidden relative w-12 h-12 border-4 border-primary bg-secondary flex items-center justify-center transition-all duration-300 hover:bg-primary group"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
            ) : (
              <Menu className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-secondary border-t-4 border-b-4 border-primary transition-all duration-500 ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link, index) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              onMouseEnter={() => playHover()}
              className="block w-full text-left font-mono text-sm uppercase tracking-widest text-[#1a1a1a] hover:text-primary hover:bg-primary/5 py-3 px-4 border-l-4 border-transparent hover:border-primary transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4 border-t-2 border-dotted border-primary">
            <button
              onClick={() => handleNavClick("#contact")}
              onMouseEnter={() => playHover()}
              className="block w-full ticket-btn text-center text-sm"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { navLinks };
export type { NavigationProps };
