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

// Real press clippings, floated left/right around the text — the same
// parallax treatment as the Section 2 floaters, but kept legible (no
// grayscale/crop) since the proof is the headline text itself.
const floaters = [
  {
    src: "/assets/images/vision/3.jpg",
    alt: "Business Insider — Big corporations are quietly taking over your medical practice.",
    className:
      "left-3 top-[3%] w-[24vw] max-w-[270px] rotate-[-5deg] sm:left-6 lg:left-10",
    speed: -90,
  },
  {
    src: "/assets/images/vision/2.jpg",
    alt: "Radiology Business — CEO of America's largest public hospital system says he's ready to replace radiologists with AI.",
    className:
      "right-3 top-[8%] w-[24vw] max-w-[270px] rotate-[5deg] sm:right-6 lg:right-10",
    speed: 120,
  },
  {
    src: "/assets/images/vision/4.jpg",
    alt: "NBC News — Inside the fight between doctors and insurance companies over downcoding.",
    className:
      "left-3 top-[42%] hidden w-[22vw] max-w-[250px] rotate-[4deg] sm:left-8 sm:block lg:left-14",
    speed: -60,
  },
  {
    src: "/assets/images/vision/6.jpg",
    alt: "Forbes — 6 reasons doctors are burning out and how that threatens your healthcare.",
    className:
      "right-3 top-[44%] hidden w-[22vw] max-w-[250px] rotate-[-4deg] sm:right-8 sm:block lg:right-14",
    speed: 100,
  },
  {
    src: "/assets/images/vision/5.jpg",
    alt: "The Medical Independent — US doctors flee healthcare chaos.",
    className:
      "left-3 bottom-[3%] hidden w-[20vw] max-w-[230px] rotate-[-3deg] lg:left-12 lg:block",
    speed: -70,
  },
  {
    src: "/assets/images/vision/7.jpg",
    alt: "Medscape — Specialists are 'underwater' with some insurance-preferred biosimilars.",
    className:
      "right-3 bottom-[5%] hidden w-[20vw] max-w-[230px] rotate-[3deg] lg:right-12 lg:block",
    speed: 80,
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
      className={`pointer-events-none absolute z-0 aspect-[3/2] overflow-hidden rounded-lg border border-line/70 bg-white p-1.5 shadow-2xl shadow-black/60 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="270px"
        className="object-contain"
      />
      {/* Dark overlay so the bright clipping blends into the section instead
          of reading as a stark white card. */}
      <div className="absolute inset-0 bg-ink/30" />
    </motion.div>
  );
}

export default function Headlines() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink py-28 sm:py-40"
    >
      <AnimatedBackground variant="subtle" />

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
