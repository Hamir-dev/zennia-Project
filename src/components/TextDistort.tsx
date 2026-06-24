"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
};

/**
 * Monochrome glitch/distortion reveal. Renders the real text plus two
 * transient off-white ghost layers that split then converge on enter.
 * Underlying text stays in the DOM for accessibility / no-JS.
 */
export default function TextDistort({
  text,
  className = "",
  delay = 0,
  once = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount: 0.4 });

  const base = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 14 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
    },
  };

  const ghost = (dir: number) => ({
    hidden: { opacity: 0, x: 0 },
    show: {
      opacity: [0, 0.5, 0],
      x: [0, dir * 8, 0],
      transition: { duration: 0.6, ease: "easeOut" as const, delay },
    },
  });

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 text-frost/60 mix-blend-screen"
        variants={ghost(-1)}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {text}
      </motion.span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 text-white/40 mix-blend-screen"
        variants={ghost(1)}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {text}
      </motion.span>
      <motion.span
        className="relative inline-block"
        variants={base}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {text}
      </motion.span>
    </span>
  );
}
