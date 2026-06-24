export default function AnimatedBackground({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "subtle";
}) {
  const strength = variant === "subtle" ? 0.6 : 1;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="animate-drift-a absolute left-[-15%] top-[-20%] h-[55%] w-[55%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(240,240,250,${0.12 * strength}), transparent 70%)`,
        }}
      />
      <div
        className="animate-drift-b absolute bottom-[-20%] right-[-12%] h-[50%] w-[50%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,${0.08 * strength}), transparent 70%)`,
        }}
      />
      <div
        className="animate-drift-c absolute left-1/2 top-1/2 h-[140%] w-[140%]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, rgba(240,240,250,${0.035 * strength}) 90deg, transparent 180deg, rgba(240,240,250,${0.035 * strength}) 270deg, transparent 360deg)`,
        }}
      />
    </div>
  );
}
