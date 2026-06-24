"use client";

import { FileCheck, Search, MapPin, Rocket } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { useFadeUpReveal } from "@/lib/useScrollReveal";
import AnimatedBackground from "@/components/AnimatedBackground";

const timelineData = [
  {
    id: 1,
    title: "Apply",
    date: "Stage 01",
    content:
      "Submit your interest in a specific territory. We evaluate fit, not just credentials — clinical philosophy matters as much as licensure.",
    category: "Application",
    icon: FileCheck,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Diligence",
    date: "Stage 02",
    content:
      "A structured review of your practice goals, target market, and capital position determines the right ownership structure for your territory.",
    category: "Diligence",
    icon: Search,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 80,
  },
  {
    id: 3,
    title: "Territory Award",
    date: "Stage 03",
    content:
      "Approved physicians are granted exclusive rights to their county or region — with shared infrastructure, technology, and revenue access from day one.",
    category: "Ownership",
    icon: MapPin,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 55,
  },
  {
    id: 4,
    title: "Launch & Scale",
    date: "Stage 04",
    content:
      "Open your territory backed by a national network, then grow across service lines without rebuilding operations from scratch each time.",
    category: "Growth",
    icon: Rocket,
    relatedIds: [3],
    status: "pending" as const,
    energy: 25,
  },
];

export default function Process() {
  const headerRef = useFadeUpReveal<HTMLDivElement>("top 80%");

  return (
    <section id="process" className="relative overflow-hidden bg-ink-soft py-28 sm:py-36">
      <AnimatedBackground variant="subtle" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div ref={headerRef} className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-4xl leading-tight tracking-tight text-bone sm:text-5xl lg:text-6xl">
            From Application
            <br />
            To Ownership.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-bone-dim">
            Select a stage to trace how a territory moves from first
            application to a fully launched, founder-owned practice.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8">
        <RadialOrbitalTimeline timelineData={timelineData} />
      </div>
    </section>
  );
}
