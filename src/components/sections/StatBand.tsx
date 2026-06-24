"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import AnimatedBackground from "@/components/AnimatedBackground";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 3100, suffix: "", label: "Territory Opportunities Nationwide" },
  { value: 1, suffix: "", label: "State Open For Founding Physicians", isWord: true },
  { value: 15, suffix: "+", label: "Integrated Service Lines Per Territory" },
];

export default function StatBand() {
  const numbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = numbersRef.current;
    if (!root) return;

    const counters = root.querySelectorAll<HTMLElement>("[data-counter]");
    const triggers: ScrollTrigger[] = [];

    counters.forEach((el) => {
      const target = Number(el.dataset.counter);
      const obj = { val: 0 };
      const tween = gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toLocaleString();
        },
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-line bg-ink py-24 sm:py-32">
      <AnimatedBackground variant="subtle" />
      {/* center glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(240,240,250,0.07),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div
          ref={numbersRef}
          className="grid gap-14 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              className="flex flex-col items-center px-4 text-center"
            >
              <p
                className="font-serif text-6xl font-light tracking-tight text-bone sm:text-7xl lg:text-8xl"
                style={{ textShadow: "0 0 40px rgba(240,240,250,0.25)" }}
              >
                {stat.isWord ? (
                  "Florida"
                ) : (
                  <>
                    <span data-counter={stat.value}>0</span>
                    <span className="text-white">{stat.suffix}</span>
                  </>
                )}
              </p>
              <span className="mt-5 h-px w-10 bg-white/40" />
              <p className="mt-5 max-w-[15rem] text-sm uppercase tracking-[0.14em] text-bone-dim">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
