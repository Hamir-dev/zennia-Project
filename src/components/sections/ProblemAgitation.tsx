"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import TextDistort from "@/components/TextDistort";
import AnimatedBackground from "@/components/AnimatedBackground";

const lines = [
  "Corporate systems replaced relationships.",
  "Insurance replaced flexibility.",
  "SOPs replaced judgment.",
  "Patients started losing trust.",
  "Physicians burned out.",
  "Telehealth came in as a solution, but much of it ended up being built and controlled by tech guys—not doctors.",
];

// Floating imagery — the human cost of a system that drifted, parallaxed on scroll
const floaters = [
  {
    src: "/assets/images/vision/corridor.jpg",
    alt: "An empty, impersonal hospital corridor at night",
    className:
      "left-[-2%] top-[14%] w-[20vw] max-w-[260px] rotate-[-6deg] sm:left-[2%]",
    speed: -90,
  },
  {
    src: "/assets/images/vision/burnout.jpg",
    alt: "A physician alone, worn down by the system",
    className:
      "right-[-2%] top-[28%] w-[20vw] max-w-[260px] rotate-[7deg] sm:right-[3%]",
    speed: 120,
  },
  {
    src: "/assets/images/vision/telehealth.jpg",
    alt: "Cold, faceless screens standing in for care",
    className:
      "left-[4%] bottom-[8%] hidden w-[16vw] max-w-[220px] rotate-[4deg] lg:block",
    speed: -60,
  },
];

function Floater({
  src,
  alt,
  className,
  speed,
  progress,
}: {
  src: string;
  alt: string;
  className: string;
  speed: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], [0, speed]);
  return (
    <motion.div
      style={{ y }}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none absolute z-0 aspect-[16/10] overflow-hidden rounded-lg border border-line/70 shadow-2xl shadow-black/60 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="260px"
        className="object-cover opacity-80 grayscale"
      />
    </motion.div>
  );
}

export default function ProblemAgitation() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      id="vision"
      className="relative overflow-hidden bg-ink-soft py-28 sm:py-40"
    >
      <AnimatedBackground />

      {floaters.map((f) => (
        <Floater key={f.src} {...f} progress={scrollYProgress} />
      ))}

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center sm:px-10 lg:px-16">
        <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-[-0.01em] text-bone sm:text-5xl lg:text-6xl">
          <TextDistort text="Somewhere Along The Way," />
          <br />
          <TextDistort text="Healthcare Lost Its Way." delay={0.1} />
        </h2>

        <ul className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-6 border-t border-line pt-12">
          {lines.map((line, i) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={
                i === lines.length - 1
                  ? "max-w-2xl font-serif text-xl leading-relaxed text-[#fff] sm:text-2xl"
                  : "font-serif text-2xl leading-snug text-[#f0f0fa85] sm:text-3xl"
              }
            >
              {line}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
