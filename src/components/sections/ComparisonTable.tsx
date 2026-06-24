"use client";

import { motion } from "motion/react";
import { Check, Minus } from "lucide-react";
import TextDistort from "@/components/TextDistort";
import AnimatedBackground from "@/components/AnimatedBackground";

const independent = [
  "Own One Practice",
  "Revenue Limited By Time",
  "Build Everything Yourself",
  "Compete Alone",
  "High Patient Acquisition Costs",
];

const zennia = [
  "Ownership Beyond A Practice",
  "Multiple Revenue Streams",
  "Shared Infrastructure",
  "National Network",
  "Scale Beyond Personal Capacity",
];

const row = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.08 },
  }),
};

export default function ComparisonTable() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 sm:py-40">
      <AnimatedBackground variant="subtle" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-bone sm:text-5xl lg:text-6xl">
            <TextDistort text="The Old Model Is Breaking." />
            <br />
            <span className="text-bone-dim">Own More Than A Practice.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Independent Practice — muted */}
          <div className="rounded-lg border border-line bg-ink-soft/40 p-8 sm:p-10">
            <p className="text-sm uppercase tracking-[0.16em] text-bone-dim">
              Independent Practice
            </p>
            <ul className="mt-8 flex flex-col">
              {independent.map((item, i) => (
                <motion.li
                  key={item}
                  variants={row}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                  className="flex items-center gap-3 border-b border-line py-4 text-base text-bone-dim last:border-b-0 sm:text-lg"
                >
                  <Minus size={16} className="shrink-0 text-bone-dim/50" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Zennia — elevated */}
          <div className="relative rounded-lg border border-white/25 bg-ink-soft p-8 shadow-[0_0_60px_-15px_rgba(240,240,250,0.18)] sm:p-10">
            <div className="pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_50%_0%,rgba(240,240,250,0.08),transparent_60%)]" />
            <p className="relative font-serif text-sm uppercase tracking-[0.16em] text-white">
              Zennia
            </p>
            <ul className="relative mt-8 flex flex-col">
              {zennia.map((item, i) => (
                <motion.li
                  key={item}
                  variants={row}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                  className="flex items-center gap-3 border-b border-line py-4 text-base text-bone last:border-b-0 sm:text-lg"
                >
                  <Check size={16} className="shrink-0 text-white" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
