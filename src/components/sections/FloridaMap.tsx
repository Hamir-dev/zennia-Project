"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import AnimatedBackground from "@/components/AnimatedBackground";

const StatesMap = dynamic(() => import("@/components/StatesMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[460px] animate-pulse rounded-sm border border-line bg-ink-soft sm:h-[560px]" />
  ),
});

export default function FloridaMap() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 sm:py-36">
      <AnimatedBackground variant="subtle" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.34em] text-bone-dim">
              The First Territory
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-bone sm:text-5xl lg:text-6xl">
              Florida Is Open.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-bone-dim">
            Hover or tap any state to explore territory status. Florida is
            live now — the rest of the nation follows.
          </p>
        </motion.div>

        <StatesMap heightClass="h-[460px] sm:h-[560px] lg:h-[640px]" />
      </div>
    </section>
  );
}
