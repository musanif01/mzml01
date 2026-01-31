"use client";

import React from "react";
import {
  Layers,
  Zap,
  ExternalLink,
  Globe,
  Code,
  Database,
  Cloud,
  Palette,
  Workflow,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { TiltCard } from "@/components/TiltCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";

interface CaseStudySectionProps {
  soundEnabled?: boolean;
}

interface TechItem {
  name: string;
  icon: LucideIcon;
}

interface CaseStudy {
  name: string;
  type: string;
  role: string;
  duration: string;
  overview: string;
  challenge: string;
  highlights: string[];
  responsibilities: string[];
  outcomes: { value: string; label: string }[];
  techStack: TechItem[];
  link: string;
}

const lurnRyteCaseStudy: CaseStudy = {
  name: "LurnRyte",
  type: "Tutoring Platform",
  role: "Founder Engineer & Full-Stack Lead",
  duration: "Jan 2025 – Apr 2025",
  overview:
    "Built an end-to-end tutoring marketplace with realtime classrooms, tutor discovery, and pay-as-you-go booking for students across India. The platform now powers personalized sessions for students preparing for school, competitive exams, and language mastery—complete with flexible scheduling and recorded takeaways.",
  challenge:
    "Parents and students needed a trustworthy way to find subject experts without committing to subscriptions or opaque pricing. Tutors, meanwhile, wanted tooling beyond generic video calls to keep learners engaged.",
  highlights: [
    "Tutor discovery with filters by board, subject, and language, including embedded demo videos",
    "Booking flow that validates availability, triggers reminder workflows, and respects pay-as-you-go purchasing",
    "Realtime study room leveraging Cloudflare Realtime Kit for low-latency presence and screen sharing",
    "Recording pipeline that streams session captures to Cloudflare R2 with signed playback links",
  ],
  responsibilities: [
    "Architected the Supabase schema for tutors, sessions, reviews, and payments with row-level security",
    "Wrote realtime collaboration layer on Cloudflare Durable Objects to sync whiteboard state and chat",
    "Automated onboarding and reminder emails through Cloudflare Workflows and Supabase webhooks",
    "Implemented responsive marketing site and tutor directory with search and filtering",
  ],
  outcomes: [
    { value: "2,500+", label: "Students mentored since launch" },
    { value: "20+", label: "Years of teaching expertise in tutor network" },
  ],
  techStack: [
    { name: "Next.js", icon: Globe },
    { name: "TypeScript", icon: Code },
    { name: "Supabase", icon: Database },
    { name: "Cloudflare", icon: Cloud },
    { name: "Tailwind CSS", icon: Palette },
    { name: "Workflows", icon: Workflow },
  ],
  link: "https://www.lurnryte.com",
};

const stats = [
  { value: 15, suffix: "+", label: "Projects Completed" },
  { value: 50, suffix: "+", label: "Happy Clients" },
  { value: 5, suffix: "+", label: "Years Experience" },
];

export function CaseStudySection({
  soundEnabled = true,
}: CaseStudySectionProps) {
  return (
    <section id="stories" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-40 h-40 border-8 border-primary opacity-5 rotate-12" />
      <div className="absolute bottom-40 left-10 w-20 h-20 bg-primary opacity-10 rotate-45" />

      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-primary mb-4">
            — Featured Case Study —
          </p>
          <h2 className="font-western text-5xl md:text-6xl text-[#1a1a1a] mb-6">
            Client Success Stories
          </h2>
        </ScrollReveal>

        {/* Case Study Card */}
        <ScrollReveal>
          <div className="case-study-card p-8 md:p-12 mb-16">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Header Info */}
              <div className="lg:col-span-3 flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b-4 border-dotted border-primary pb-6">
                <div>
                  <h3 className="font-western text-4xl text-primary mb-2">
                    {lurnRyteCaseStudy.name}
                  </h3>
                  <p className="font-mono text-lg text-[#1a1a1a]">
                    {lurnRyteCaseStudy.type}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-mono text-sm text-primary uppercase tracking-wider">
                    Role
                  </p>
                  <p className="font-mono text-base text-[#1a1a1a]">
                    {lurnRyteCaseStudy.role}
                  </p>
                  <p className="font-mono text-sm text-[#1a3a5c] mt-1">
                    {lurnRyteCaseStudy.duration}
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Overview */}
                <div>
                  <h4 className="font-western text-2xl text-[#1a1a1a] mb-3 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-primary" />
                    Overview
                  </h4>
                  <p className="font-typewriter text-base text-[#1a1a1a] leading-relaxed">
                    {lurnRyteCaseStudy.overview}
                  </p>
                </div>

                {/* Challenge */}
                <div>
                  <h4 className="font-western text-2xl text-[#1a1a1a] mb-3 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    Challenge
                  </h4>
                  <p className="font-typewriter text-base text-[#1a1a1a] leading-relaxed">
                    {lurnRyteCaseStudy.challenge}
                  </p>
                </div>

                {/* Solution Highlights */}
                <div>
                  <h4 className="font-western text-2xl text-[#1a1a1a] mb-3 flex items-center gap-2">
                    <ExternalLink className="w-6 h-6 text-primary" />
                    Solution Highlights
                  </h4>
                  <ul className="space-y-2 font-typewriter text-base text-[#1a1a1a]">
                    {lurnRyteCaseStudy.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Responsibilities */}
                <div>
                  <h4 className="font-western text-2xl text-[#1a1a1a] mb-3">
                    Responsibilities
                  </h4>
                  <ul className="space-y-2 font-typewriter text-base text-[#1a1a1a]">
                    {lurnRyteCaseStudy.responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Visit Site Button */}
                <MagneticButton
                  href={lurnRyteCaseStudy.link}
                  strength={0.25}
                  soundEnabled={soundEnabled}
                  className="w-full ticket-btn text-center flex items-center justify-center gap-2 group"
                >
                  Visit {lurnRyteCaseStudy.name}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </MagneticButton>

                {/* Tech Stack */}
                <div className="bg-secondary border-4 border-primary p-6">
                  <h4 className="font-western text-xl text-primary mb-4">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lurnRyteCaseStudy.techStack.map((tech) => (
                      <TiltCard
                        key={tech.name}
                        maxTilt={5}
                        scale={1.1}
                        soundEnabled={soundEnabled}
                        className="tech-tag flex items-center gap-1 cursor-pointer"
                      >
                        <tech.icon className="w-3 h-3" />
                        {tech.name}
                      </TiltCard>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div className="bg-primary text-secondary p-6">
                  <h4 className="font-western text-xl mb-4">Outcomes</h4>
                  <div className="space-y-4">
                    {lurnRyteCaseStudy.outcomes.map((outcome, index) => (
                      <div
                        key={index}
                        className="outcome-metric bg-secondary/10 border-l-4 border-secondary"
                      >
                        <p className="font-western text-3xl">{outcome.value}</p>
                        <p className="font-mono text-sm">{outcome.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architecture Note */}
                <div className="border-4 border-dashed border-primary p-4">
                  <p className="font-mono text-xs text-[#1a1a1a] text-center uppercase tracking-wider">
                    Cloudflare + Supabase Architecture
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 100}>
              <TiltCard
                maxTilt={8}
                soundEnabled={soundEnabled}
                className={`stat-card p-6 text-center text-secondary cursor-pointer ${
                  index % 2 === 0 ? "bg-primary" : "bg-[#1a3a5c]"
                }`}
              >
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  duration={2000}
                  delay={300}
                  className="font-western text-4xl mb-2"
                />
                <p className="font-mono text-xs uppercase tracking-wider">
                  {stat.label}
                </p>
              </TiltCard>
            </ScrollReveal>
          ))}
          <ScrollReveal delay={300}>
            <TiltCard
              maxTilt={8}
              soundEnabled={soundEnabled}
              className="stat-card bg-primary p-6 text-center text-secondary cursor-pointer"
            >
              <p className="font-western text-4xl mb-2">24/7</p>
              <p className="font-mono text-xs uppercase tracking-wider">
                Support
              </p>
            </TiltCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export type { CaseStudySectionProps, CaseStudy, TechItem };
