"use client";

import Image from "next/image";
import { motion } from "motion/react";
import ServicesShowcase, { type ServiceItem } from "@/components/ServicesShowcase";
import AnimatedBackground from "@/components/AnimatedBackground";

const showcase: ServiceItem[] = [
  {
    label: "Preventive Care",
    image: "/assets/images/services/preventive-care.jpg",
    caption: "Stay ahead of illness with proactive, whole-person screening.",
  },
  {
    label: "Advanced Diagnostics",
    image: "/assets/images/services/advanced-diagnostics.jpg",
    caption: "Imaging and testing that catch what routine checkups miss.",
  },
  {
    label: "Longevity",
    image: "/assets/images/services/longevity.jpg",
    caption: "Programs built to extend healthspan, not just lifespan.",
  },
  {
    label: "Fitness & Performance",
    image: "/assets/images/services/fitness-performance.jpg",
    caption: "Train under clinical guidance toward measurable results.",
  },
  {
    label: "Mental Health",
    image: "/assets/images/services/mental-health.jpg",
    caption: "Confidential, integrated care for mind alongside body.",
  },
  {
    label: "Nutrition",
    image: "/assets/images/services/nutrition.jpg",
    caption: "Personalized nutrition grounded in your own biomarkers.",
  },
  {
    label: "Regenerative Medicine",
    image: "/assets/images/services/regenerative-medicine.jpg",
    caption: "Restorative therapies at the frontier of clinical science.",
  },
  {
    label: "Women's Health",
    image: "/assets/images/services/womens-health.jpg",
    caption: "Care designed around every stage of a woman's life.",
  },
  {
    label: "Virtual Care",
    image: "/assets/images/services/virtual-care.jpg",
    caption: "Your physician on call — without the waiting room.",
  },
  {
    label: "Sleep Health",
    image: "/assets/images/services/sleep-health.jpg",
    caption: "Diagnose and resolve what's keeping you from real rest.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function BrandIntro() {
  return (
    <section id="network" className="relative overflow-hidden bg-ink py-28 sm:py-40">
      <AnimatedBackground variant="subtle" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8 h-40 w-40 sm:h-52 sm:w-52"
          >
            <Image
              src="/assets/logo/Zennia-logo.png"
              alt="Zennia — physicians at the center of healthcare"
              fill
              unoptimized
              sizes="208px"
              className="object-contain"
            />
          </motion.div>
          <p className="mt-8 max-w-3xl font-serif text-2xl font-light leading-snug tracking-tight text-bone sm:text-3xl lg:text-4xl">
            An integrated healthcare system designed to put physicians back
            at the center of healthcare.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-line sm:grid-cols-2">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="flex items-center justify-center bg-ink-soft p-10 text-center sm:p-14"
          >
            <h3 className="font-serif text-2xl leading-tight tracking-tight text-bone sm:text-3xl">
              Physician Ownership &amp; Autonomy
            </h3>
          </motion.div>
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center bg-ink-soft p-10 text-center sm:p-14"
          >
            <h3 className="font-serif text-2xl leading-tight tracking-tight text-bone sm:text-3xl">
              Patient-Centered Care
            </h3>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mt-24">
        <ServicesShowcase items={showcase} />
      </div>
    </section>
  );
}
