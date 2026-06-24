"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const delay = reduced ? 300 : 1900;
    const timer = setTimeout(() => setDone(true), delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
        >
          <div className="relative flex h-40 w-40 items-center justify-center">
            {/* Orbit rings */}
            <div
              className="absolute inset-0 rounded-full border border-line"
              style={{ animation: "orbit-spin 3.4s linear infinite" }}
            >
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </div>
            <div
              className="absolute inset-5 rounded-full border border-line"
              style={{
                animation: "orbit-spin 2.4s linear infinite reverse",
              }}
            >
              <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-frost" />
            </div>
            <div
              className="absolute inset-10 rounded-full border border-line"
              style={{ animation: "orbit-spin 1.8s linear infinite" }}
            >
              <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
            </div>

            {/* Core */}
            <div
              className="h-3 w-3 rounded-full bg-frost"
              style={{ animation: "orbit-pulse 1.6s ease-in-out infinite" }}
            />

            <motion.span
              className="absolute -bottom-12 text-xs uppercase tracking-[0.4em] text-bone-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Zennia
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
