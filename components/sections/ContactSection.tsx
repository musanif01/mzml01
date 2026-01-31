"use client";

import React, { useCallback } from "react";
import { Mail, Phone, MapPin, LucideIcon } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAudio } from "@/hooks/useAudio";

interface ContactSectionProps {
  soundEnabled?: boolean;
}

interface ContactInfo {
  icon: LucideIcon;
  title: string;
  value: string;
  href: string;
}

const contactInfo: ContactInfo[] = [
  {
    icon: Mail,
    title: "Email",
    value: "smmhd121@gmail.com",
    href: "mailto:smmhd121@gmail.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 8082008463",
    href: "tel:+918082008463",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "123 Innovation Drive, Tech City, TC 12345",
    href: "#",
  },
];

const services = [
  "Custom Software",
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Maintenance",
  "DevOps",
  "Website Redesign",
  "E-commerce",
];

export function ContactSection({ soundEnabled = true }: ContactSectionProps) {
  const { playHover, playClick } = useAudio({
    enabled: soundEnabled,
  });

  const handleSubmit = useCallback(() => {
    playClick();
  }, [playClick]);

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Decoration */}
      <div className="absolute top-40 right-10 w-24 h-24 border-4 border-dashed border-primary opacity-20 animate-spin" />

      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-primary mb-4">
            — Get In Touch —
          </p>
          <h2 className="font-western text-5xl md:text-6xl text-[#1a1a1a] mb-6">
            Contact Us
          </h2>
          <p className="font-typewriter text-lg text-[#1a1a1a] max-w-2xl mx-auto">
            Ready to start your next project? Reach out and let&apos;s create
            something extraordinary.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 150}>
                <MagneticButton
                  href={item.href}
                  strength={0.15}
                  soundEnabled={soundEnabled}
                  className="w-full block"
                >
                  <div className="geometric-block p-6 flex items-start gap-4 group cursor-pointer w-full min-w-[300px]">
                    <div className="p-3 bg-primary text-secondary transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1a3a5c] shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h4 className="font-western text-xl text-primary mb-1 transition-colors duration-300 group-hover:text-[#1a3a5c]">
                        {item.title}
                      </h4>
                      <p className="font-mono text-sm text-[#1a1a1a] transition-all duration-300 group-hover:text-[#1a1a1a] group-hover:font-bold truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </MagneticButton>
              </ScrollReveal>
            ))}
          </div>

          {/* Contact Form */}
          <ScrollReveal variant="right" delay={300}>
            <div className="relative bg-secondary border-4 border-primary p-8 shadow-xl">
              <div className="corner-decoration top-left" />
              <div className="corner-decoration bottom-right" />

              <form className="space-y-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder=" "
                    required
                  />
                  <label className="form-label">Name</label>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    className="form-input"
                    placeholder=" "
                    required
                  />
                  <label className="form-label">Email</label>
                </div>

                <div className="form-group">
                  <select className="form-input" defaultValue="">
                    <option value="" disabled hidden></option>
                    {services.map((service) => (
                      <option
                        key={service}
                        value={service.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {service}
                      </option>
                    ))}
                  </select>
                  <label className="form-label">Project Type</label>
                </div>

                <div className="form-group">
                  <textarea
                    rows={4}
                    className="form-input resize-none"
                    placeholder=" "
                    required
                  />
                  <label className="form-label">Message</label>
                </div>

                <MagneticButton
                  onClick={handleSubmit}
                  strength={0.3}
                  soundEnabled={soundEnabled}
                  className="w-full ticket-btn"
                >
                  Send Message
                </MagneticButton>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export type { ContactSectionProps, ContactInfo };
