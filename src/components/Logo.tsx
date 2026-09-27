import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * FreshFind brand mark.
 * Five leaf blades spiralling around a serif "F" — drawn entirely as vector
 * path data so it scales, reverses to a single colour and stays editable.
 */
export function FreshFindMark({
  size = 48,
  className,
  mono = false,
  ring = true,
}: {
  size?: number;
  className?: string;
  mono?: boolean;
  ring?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const bladeId = `ff-blade-${uid}`;
  const aId = `ff-leaf-a-${uid}`;
  const bId = `ff-leaf-b-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="FreshFind"
    >
      <title>FreshFind</title>
      <defs>
        <linearGradient id={aId} x1="0.86" y1="0.08" x2="0.14" y2="0.94">
          <stop offset="0%" stopColor="#F2C79A" />
          <stop offset="50%" stopColor="#E08543" />
          <stop offset="100%" stopColor="#A30824" />
        </linearGradient>
        <linearGradient id={bId} x1="0.2" y1="0.06" x2="0.92" y2="0.96">
          <stop offset="0%" stopColor="#E0A579" />
          <stop offset="55%" stopColor="#A30824" />
          <stop offset="100%" stopColor="#5c0415" />
        </linearGradient>
        {/* one leaf blade, re-used five times around the rosette */}
        <path
          id={bladeId}
          d="M105.75 55.19C107.35 70.4 101.28 85.41 89.57 95.24C86.2 76 92 62 105.75 55.19Z"
        />
      </defs>

      {ring && !mono && <circle cx="60" cy="60" r="30.5" fill="#FFFFFF" opacity="0.72" />}

      <g>
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <use
            key={deg}
            href={`#${bladeId}`}
            transform={`rotate(${deg} 60 60)`}
            fill={mono ? "currentColor" : `url(#${i % 2 ? bId : aId})`}
          />
        ))}
      </g>

      {/* serif F */}
      <path
        d="M50.2 44H70v4.4h-9.5v7.4h6.7v4.4h-6.7v12.2l4.7.6v3.8H50.8v-3.8l4.6-.6V48.4h-5.2Z"
        fill={mono ? "currentColor" : "#2E1B0E"}
      />
    </svg>
  );
}

/** Logo lockup: mark + wordmark. `tone` flips it for dark or light surfaces. */
export function Logo({
  tone = "dark",
  className,
  markSize = 44,
  subtitle,
}: {
  tone?: "dark" | "light";
  className?: string;
  markSize?: number;
  subtitle?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <FreshFindMark size={markSize} className="shrink-0 drop-shadow-[0_4px_10px_rgba(163,8,36,0.3)]" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[24px] font-semibold tracking-tight",
            tone === "dark" ? "text-forest" : "text-cream",
          )}
        >
          Fresh<span className="text-leaf">Find</span>
        </span>
        {subtitle && (
          <span className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-leaf">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
