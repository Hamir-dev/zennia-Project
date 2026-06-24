"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { MapPin, TrendingUp, Network } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

const CountyMap = dynamic(() => import("@/components/CountyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] animate-pulse rounded-sm border border-line bg-ink-soft sm:h-[520px]" />
  ),
});

const stats = [
  "3,100 counties.",
  "3,100 ownership opportunities.",
  "One shared vision for the future of healthcare.",
];

const pillars = [
  {
    icon: MapPin,
    title: "Own A Territory",
    body: "Participate in the growth of healthcare within your local market through territory-based ownership opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Participate In Revenue",
    body: "Benefit from multiple healthcare revenue streams generated across the system—not just the patients you personally see.",
  },
  {
    icon: Network,
    title: "Join A National Network",
    body: "Leverage the strength of a connected healthcare system designed for scale.",
  },
];

const territories: { state: string; open: boolean }[] = [
  { state: "Florida", open: true },
  { state: "Texas", open: false },
  { state: "Georgia", open: false },
  { state: "North Carolina", open: false },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: i * 0.08,
    },
  }),
};

export default function NationalMap() {
  return (
    <section
      id="opportunity"
      className="relative overflow-hidden bg-ink-soft py-28 sm:py-40"
    >
      <AnimatedBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            variants={reveal}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-bone sm:text-5xl lg:text-6xl"
          >
            The Largest Physician Ownership
            <br />
            Opportunity Of Our Time.
          </motion.h2>

          <div className="mt-8 flex flex-col gap-1">
            {stats.map((line, i) => (
              <motion.p
                key={line}
                variants={reveal}
                custom={i + 2}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
                className={
                  i === 2
                    ? "text-lg text-bone-dim"
                    : "font-serif text-2xl text-bone sm:text-3xl"
                }
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <CountyMap
            onlyStateFips="12"
            projection="geoMercator"
            projectionConfig={{ center: [-83.6, 28.3], scale: 3400 }}
            heightClass="h-[420px] sm:h-[520px] lg:h-[600px]"
            strokeWidth={1}
          />

          <div className="flex flex-col justify-between gap-10">
            <div className="grid gap-6">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  variants={reveal}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.6 }}
                  className="border-t border-line pt-5"
                >
                  <div className="flex items-center gap-3">
                    <pillar.icon
                      size={18}
                      className="text-white"
                      strokeWidth={1.5}
                    />
                    <h3 className="font-serif text-xl text-bone">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-dim">
                    {pillar.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-line pt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-bone-dim">
                Territory Status
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {territories.map((t) => (
                  <li
                    key={t.state}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-bone">{t.state}</span>
                    {t.open ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Open
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-3 py-1 text-xs uppercase tracking-[0.12em] text-bone-dim">
                        Coming Soon
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
