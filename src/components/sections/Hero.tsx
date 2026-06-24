"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import ParticleField from "@/components/webgl/ParticleField";
import TextDistort from "@/components/TextDistort";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink"
    >
      {/* Background — US network / flag imagery */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0">
        <Image
          src="/assets/images/main-hero-bg.jpeg"
          alt="A glowing network of opportunity spanning the United States"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover opacity-90"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/35 to-ink" />

      {/* Gravity particles ambient field */}
      <ParticleField className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_38%,rgba(15,17,18,0.75)_100%)]" />

      <motion.div
        style={{ y, opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center sm:px-10"
      >
        <h1 className="font-serif text-[12.5vw] font-light leading-[0.95] tracking-[-0.02em] text-bone sm:text-[8vw] lg:text-[6vw]">
          <TextDistort text="Bringing Healthcare" delay={0.25} />
          <br />
          <TextDistort text="Back Where It Belongs." delay={0.4} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
          className="mt-9 max-w-xl text-lg leading-relaxed text-bone-dim sm:text-xl"
        >
          A healthcare system designed to return ownership, opportunity, and
          autonomy to physicians.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.85 }}
          className="mt-10"
        >
          <a
            href="#opportunity"
            data-cursor
            className="group inline-flex items-center gap-3 border border-line bg-white/[0.02] px-8 py-4 text-sm uppercase tracking-[0.18em] text-bone backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
          >
            Own The Future Of Healthcare
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
