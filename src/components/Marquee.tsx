"use client";

/** Infinite CSS marquee. Content is duplicated so the -50% loop is seamless. */
export default function Marquee({
  items,
  duration = 38,
  className = "",
}: {
  items: string[];
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="flex shrink-0 animate-marquee items-center"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-6 flex items-center gap-6 whitespace-nowrap text-sm uppercase tracking-[0.18em] text-bone-dim"
          >
            {item}
            <span className="text-white/30">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
