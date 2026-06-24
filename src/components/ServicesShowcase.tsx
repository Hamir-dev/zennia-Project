"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type ServiceItem = {
  label: string;
  image: string;
  caption: string;
};

/**
 * 3D coverflow ring of service-line cards. Auto-spins when idle, responds to
 * drag (with inertia), wheel, click-to-front, and prev/next controls. The
 * front-most card is brought into full color + brightness; side cards recede
 * into grayscale and shadow. Falls back to a horizontal snap gallery on
 * smaller screens and when reduced motion is requested.
 */
export default function ServicesShowcase({ items }: { items: ServiceItem[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const controls = useRef<{ next: () => void; prev: () => void } | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [active, setActive] = useState(0);

  const N = items.length;
  const step = 360 / N;
  const CARD_W = 300;
  const CARD_H = 420;
  const radius = Math.round(CARD_W / 2 / Math.tan(Math.PI / N)) + 70;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
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
    const stage = stageRef.current;
    if (!ring) return;

    const AUTO_SPEED = 0.11; // deg/frame ≈ 6.6°/s — a slow, calm drift
    let rotation = 0;
    let target = 0;
    let dragging = false;
    let hovering = false;
    let lastX = 0;
    let lastInteraction = -Infinity;
    let lastActive = -1;
    let raf = 0;

    const snap = (t: number) => Math.round(t / step) * step;

    const render = (now: number) => {
      const idle = now - lastInteraction > 2600;
      // Auto-spin only when idle, not dragging, and not hovered.
      if (idle && !dragging && !hovering) target -= AUTO_SPEED;
      rotation += (target - rotation) * 0.085;
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rotation}deg)`;

      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        let a = (i * step + rotation) % 360;
        if (a > 180) a -= 360;
        if (a < -180) a += 360;
        const abs = Math.abs(a);
        const focus = Math.max(0, 1 - abs / 55);
        el.style.opacity = String(0.22 + 0.78 * Math.max(0, 1 - abs / 115));
        el.style.filter = `grayscale(${(1 - focus).toFixed(3)}) brightness(${(
          0.5 +
          0.5 * focus
        ).toFixed(3)})`;
        el.style.zIndex = String(Math.round(1000 - abs));
      }

      let front = Math.round(-rotation / step) % N;
      front = ((front % N) + N) % N;
      if (front !== lastActive) {
        lastActive = front;
        setActive(front);
      }
      raf = requestAnimationFrame(render);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastInteraction = performance.now();
      ring.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      target += dx * 0.32;
      rotation += dx * 0.32;
      lastInteraction = performance.now();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      target = snap(target);
      lastInteraction = performance.now();
    };
    const onWheel = (e: WheelEvent) => {
      target = snap(target) - Math.sign(e.deltaY) * step;
      lastInteraction = performance.now();
    };

    controls.current = {
      next: () => {
        target = snap(target) - step;
        lastInteraction = performance.now();
      },
      prev: () => {
        target = snap(target) + step;
        lastInteraction = performance.now();
      },
    };

    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    ring.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    ring.addEventListener("wheel", onWheel, { passive: true });
    stage?.addEventListener("pointerenter", onEnter);
    stage?.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ring.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      ring.removeEventListener("wheel", onWheel);
      stage?.removeEventListener("pointerenter", onEnter);
      stage?.removeEventListener("pointerleave", onLeave);
      controls.current = null;
    };
  }, [is3D, N, step, radius]);

  /* ---- Mobile / reduced-motion: horizontal snap gallery ---- */
  if (!is3D) {
    return (
      <div className="px-6 sm:px-10">
        <div className="mx-auto flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => (
            <article
              key={item.label}
              className="relative aspect-[3/4] w-[68vw] max-w-[300px] shrink-0 snap-center overflow-hidden rounded-lg border border-line bg-ink-soft"
            >
              <Image
                src={item.image}
                alt={item.label}
                fill
                unoptimized
                sizes="300px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="font-serif text-xs tracking-[0.3em] text-white/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-serif text-xl leading-tight text-bone">
                  {item.label}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  /* ---- Desktop: 3D coverflow ring ---- */
  return (
    <div className="select-none">
      <div
        ref={stageRef}
        className="relative h-[480px] w-full overflow-hidden"
        style={{ perspective: "1500px" }}
        data-cursor
      >
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 cursor-grab active:cursor-grabbing"
          style={{
            transformStyle: "preserve-3d",
            width: CARD_W,
            height: CARD_H,
            marginLeft: -CARD_W / 2,
            marginTop: -CARD_H / 2,
          }}
          aria-label="Service lines gallery — drag to explore"
        >
          {items.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => {
                if (i === active) return;
                // bring clicked card to front via the nearest equivalent angle
                const ctrl = controls.current;
                if (!ctrl) return;
                const forward = (i - active + N) % N;
                const diff = forward <= N / 2 ? forward : forward - N;
                for (let k = 0; k < Math.abs(diff); k++) {
                  if (diff > 0) ctrl.next();
                  else ctrl.prev();
                }
              }}
              className="group absolute inset-0 overflow-hidden rounded-lg border border-line bg-ink-soft shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
              style={{
                transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
                willChange: "filter, opacity",
              }}
            >
              <Image
                src={item.image}
                alt={item.label}
                fill
                unoptimized
                sizes="300px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                <span className="font-serif text-[11px] tracking-[0.3em] text-white/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-serif text-lg leading-tight text-bone">
                  {item.label}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1100] w-1/5 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1100] w-1/5 bg-gradient-to-l from-ink to-transparent" />
      </div>

      {/* Active line + controls */}
      <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-8">
        <button
          onClick={() => controls.current?.prev()}
          data-cursor
          aria-label="Previous service line"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-bone-dim transition-colors duration-200 hover:border-white hover:text-bone"
        >
          ←
        </button>

        <div className="min-w-[260px] text-center">
          <span className="font-serif text-xs tracking-[0.32em] text-white/50">
            {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </span>
          <p className="mt-2 font-serif text-2xl leading-tight text-bone sm:text-3xl">
            {items[active]?.label}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-bone-dim">
            {items[active]?.caption}
          </p>
        </div>

        <button
          onClick={() => controls.current?.next()}
          data-cursor
          aria-label="Next service line"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-bone-dim transition-colors duration-200 hover:border-white hover:text-bone"
        >
          →
        </button>
      </div>
    </div>
  );
}
