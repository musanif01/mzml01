"use client";

import React, { useCallback } from "react";
import { useAudio } from "@/hooks/useAudio";

interface FooterProps {
  soundEnabled?: boolean;
}

const navLinks = [
  { name: "Who We Are", href: "#who-we-are" },
  { name: "Services", href: "#services" },
  { name: "Success Stories", href: "#stories" },
  { name: "Contact", href: "#contact" },
];

const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

const socialLinks = ["LinkedIn", "Twitter", "GitHub"];

export function Footer({ soundEnabled = true }: FooterProps) {
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
    <footer className="bg-primary text-secondary py-12 px-4 sm:px-6 lg:px-8 border-t-4 border-[#1a3a5c]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-2xl font-bold text-secondary tracking-wider leading-none">
                MZML.
              </span>
            </div>
            <p className="font-mono text-sm leading-relaxed max-w-md">
              Premium software solutions crafted with precision. We transform
              visions into digital reality through innovative design and expert
              engineering.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-western text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    onMouseEnter={() => playHover()}
                    className="font-mono text-sm hover:underline transition-all duration-300 hover:pl-2"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-western text-xl mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((item) => (
                <li key={item}>
                  <button
                    onMouseEnter={() => playHover()}
                    className="font-mono text-sm hover:underline transition-all duration-300 hover:pl-2"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-dotted border-secondary pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-sm">
            © 2024 MZML Corp. All rights reserved.
          </p>
          <div className="flex gap-6">
            {socialLinks.map((social) => (
              <button
                key={social}
                onMouseEnter={() => playHover()}
                className="font-mono text-sm hover:underline transition-all duration-300 hover:text-secondary/80"
              >
                {social}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export type { FooterProps };
