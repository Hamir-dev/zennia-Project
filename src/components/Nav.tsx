"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";

const links = [
  { href: "#vision", label: "Vision" },
  { href: "#network", label: "Network" },
  { href: "#opportunity", label: "Opportunity" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-colors duration-300 sm:px-10 lg:px-16",
        scrolled || open
          ? "border-b border-line bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <a
        href="#top"
        data-cursor
        aria-label="Zennia — home"
        className="flex items-center"
      >
        <span className="relative h-24 w-24 shrink-0 sm:h-40 sm:w-40">
          <span
            aria-hidden
            className="absolute inset-0 -z-10 scale-125 rounded-full bg-white/15 blur-xl"
          />
          <Image
            src="/assets/logo/zennia-logo.png"
            alt="Zennia"
            fill
            priority
            unoptimized
            sizes="160px"
            className="object-contain drop-shadow-[0_0_14px_rgba(255,255,255,0.25)]"
          />
        </span>
      </a>

      <nav className="hidden items-center gap-9 md:flex">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            data-cursor
            className="group relative text-xs uppercase tracking-[0.18em] text-bone-dim transition-colors duration-200 hover:text-bone"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <a
          href="#opportunity"
          data-cursor
          className="hidden cursor-pointer border border-line px-4 py-2 text-xs uppercase tracking-[0.18em] text-bone transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink md:inline-block"
        >
          Own A Territory
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-cursor
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={clsx(
              "h-px w-6 bg-bone transition-transform duration-300",
              open && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={clsx(
              "h-px w-6 bg-bone transition-transform duration-300",
              open && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[128px] z-40 flex flex-col gap-2 bg-ink px-6 py-10 sm:top-[192px] md:hidden"
          >
            {[...links, { href: "#opportunity", label: "Own A Territory" }].map(
              (link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.4 }}
                  className="border-b border-line py-5 font-serif text-3xl text-bone"
                >
                  {link.label}
                </motion.a>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
