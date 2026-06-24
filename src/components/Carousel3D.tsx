"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CSS 3D cylinder carousel. Chosen over WebGL text so specialty labels stay
 * crisp and accessible. Auto-rotates, draggable/scroll-spun. Falls back to a
 * static grid on small screens and when reduced motion is requested.
 */
export default function Carousel3D({ items }: { items: string[] }) {
  const ringRef = useRef<HTMLDivElement>(null);
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setIs3D(mq.matches && !reduced.matches);
    update();
    mq.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!is3D) return;
    const ring = ringRef.current;
    if (!ring) return;

    let rotation = 0;
    let velocity = 0.04; // idle auto-spin
    let dragging = false;
    let lastX = 0;
    let raf = 0;

    const render = () => {
      if (!dragging) {
        rotation += velocity;
        velocity += (0.04 - velocity) * 0.02; // ease back to idle speed
      }
      ring.style.transform = `translateZ(-460px) rotateX(-6deg) rotateY(${rotation}deg)`;
      raf = requestAnimationFrame(render);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      ring.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      rotation += dx * 0.35;
      velocity = dx * 0.05;
    };
    const onUp = () => {
      dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      velocity += e.deltaY * 0.004;
    };

    ring.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    ring.addEventListener("wheel", onWheel, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ring.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      ring.removeEventListener("wheel", onWheel);
    };
  }, [is3D]);

  if (!is3D) {
    // Mobile / reduced-motion: 2–3 row grid fallback
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-line bg-ink-soft px-5 py-3 text-sm text-bone-dim"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  const step = 360 / items.length;

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-5xl overflow-hidden">
      <div
        className="relative h-full w-full select-none"
        style={{ perspective: "1200px" }}
        data-cursor
        aria-label="Specialty services carousel"
      >
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 h-[120px] w-[200px] cursor-grab active:cursor-grabbing"
          style={{
            transformStyle: "preserve-3d",
            marginLeft: "-100px",
            marginTop: "-60px",
          }}
        >
          {items.map((item, i) => (
            <div
              key={item}
              className="absolute inset-0 flex items-center justify-center rounded-sm border border-line bg-ink-soft/80 px-4 text-center text-sm uppercase tracking-[0.08em] text-bone backdrop-blur-sm transition-colors"
              style={{
                transform: `rotateY(${i * step}deg) translateZ(460px)`,
                backfaceVisibility: "hidden",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* edge fades — mask edge-on cards for a clean frame */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 bg-gradient-to-r from-ink via-ink/85 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/4 bg-gradient-to-l from-ink via-ink/85 to-transparent" />
    </div>
  );
}
