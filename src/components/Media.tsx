"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Media({
  src,
  alt,
  label,
  className,
  parallax = true,
  priority = false,
  videoSrc,
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  parallax?: boolean;
  priority?: boolean;
  videoSrc?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parallax) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const tween = gsap.fromTo(
      inner,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [parallax]);

  return (
    <div ref={wrapRef} className={clsx("isolate", className)}>
      <div className="relative h-full w-full overflow-hidden">
      <div ref={innerRef} className="absolute inset-0 scale-110">
        {videoSrc ? (
          <video
            className="h-full w-full object-cover grayscale"
            src={videoSrc}
            poster={src}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover grayscale"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-ink/35" />
      <div className="absolute inset-0 mix-blend-overlay bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_3px)]" />
      {label ? (
        <span className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.18em] text-bone-dim/70">
          {label}
        </span>
      ) : null}
      </div>
    </div>
  );
}
