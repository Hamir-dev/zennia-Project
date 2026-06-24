"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/MagneticButton";
import TextDistort from "@/components/TextDistort";

const ParticleField = dynamic(
  () => import("@/components/webgl/ParticleField"),
  { ssr: false }
);

export default function ClosingCta() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-ink py-28 text-center sm:py-40">
      <ParticleField className="absolute inset-0 h-full w-full" opacity={0.6} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(15,17,18,0.85)_100%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-xs uppercase tracking-[0.34em] text-bone-dim"
        >
          Join The Founding Cohort
        </motion.p>

        <h2 className="font-serif text-5xl font-light leading-[1.0] tracking-tight text-bone sm:text-6xl lg:text-7xl">
          <TextDistort text="Become A Founding Physician" />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-bone-dim"
        >
          Explore available territory opportunities and join the next chapter
          of healthcare.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-12 flex justify-center"
        >
          <MagneticButton
            href="#opportunity"
            className="group inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 text-sm uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-frost"
          >
            Explore Territory Opportunities
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
