/**
 * FreshFind doodle system — the ✦˖° / ☘︎ ݁˖ / ○ flourish language used to
 * keep the cream and white sections from reading as empty boxes.
 * Everything is inline SVG so it stays crisp at any size and costs nothing.
 */

type GlyphKind = "sparkle" | "sparkle-thin" | "clover" | "plus" | "ring" | "dot" | "sprout";

export function Doodle({
  glyph = "sparkle",
  className,
  style,
}: {
  glyph?: GlyphKind;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {glyph === "sparkle" && (
        <path
          d="M12 0C13.2 7.2 16.8 10.8 24 12c-7.2 1.2-10.8 4.8-12 12-1.2-7.2-4.8-10.8-12-12C7.2 10.8 10.8 7.2 12 0Z"
          fill="currentColor"
        />
      )}
      {glyph === "sparkle-thin" && (
        <path
          d="M12 1.5C13.1 7.8 16.2 10.9 22.5 12c-6.3 1.1-9.4 4.2-10.5 10.5C10.9 16.2 7.8 13.1 1.5 12 7.8 10.9 10.9 7.8 12 1.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      )}
      {glyph === "clover" && (
        <>
          <circle cx="8.6" cy="8.2" r="4.3" fill="currentColor" />
          <circle cx="15.4" cy="8.2" r="4.3" fill="currentColor" />
          <circle cx="12" cy="13.6" r="4.3" fill="currentColor" />
          <path
            d="M12 15.5c0 3.6-.9 6.3-3 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </>
      )}
      {glyph === "sprout" && (
        <>
          <path
            d="M12 22V9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 12c-3.6 0-6.4-2.4-6.4-5.8 0 0 3.4-.8 6.4 1.2Z"
            fill="currentColor"
            opacity="0.85"
          />
          <path
            d="M12 9.5c3 0 5.4-2 5.4-5 0 0-3-.7-5.4 1Z"
            fill="currentColor"
            opacity="0.6"
          />
        </>
      )}
      {glyph === "plus" && (
        <path
          d="M12 4v16M4 12h16"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {glyph === "ring" && (
        <circle cx="12" cy="12" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      )}
      {glyph === "dot" && <circle cx="12" cy="12" r="4" fill="currentColor" />}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

export interface DoodleItem {
  glyph: GlyphKind;
  /** CSS position strings, e.g. "6%" */
  x?: string;
  y?: string;
  size?: number;
  rotate?: number;
  opacity?: number;
  hideOnMobile?: boolean;
}

/** The signature four-corner cluster seen in the reference layout. */
export const CORNER_SET: DoodleItem[] = [
  { glyph: "sparkle", x: "5%", y: "16%", size: 34, rotate: -6, hideOnMobile: true },
  { glyph: "ring", x: "11%", y: "19%", size: 15, opacity: 0.8, hideOnMobile: true },
  { glyph: "dot", x: "14%", y: "23%", size: 6, opacity: 0.7 },
  { glyph: "sparkle", x: "92%", y: "12%", size: 30, rotate: 8, hideOnMobile: true },
  { glyph: "ring", x: "87%", y: "16%", size: 13, opacity: 0.8, hideOnMobile: true },
  { glyph: "plus", x: "84%", y: "21%", size: 11, opacity: 0.55 },
  { glyph: "sparkle-thin", x: "12%", y: "72%", size: 38, rotate: 10, hideOnMobile: true },
  { glyph: "ring", x: "18%", y: "68%", size: 14, opacity: 0.7, hideOnMobile: true },
  { glyph: "dot", x: "21%", y: "74%", size: 5, opacity: 0.6 },
  { glyph: "sparkle", x: "88%", y: "70%", size: 32, rotate: -10, hideOnMobile: true },
  { glyph: "ring", x: "82%", y: "74%", size: 13, opacity: 0.7, hideOnMobile: true },
  { glyph: "plus", x: "92%", y: "77%", size: 10, opacity: 0.5 },
  { glyph: "clover", x: "2%", y: "44%", size: 26, rotate: -14, opacity: 0.75, hideOnMobile: true },
  { glyph: "clover", x: "96%", y: "44%", size: 22, rotate: 16, opacity: 0.65, hideOnMobile: true },
  { glyph: "sprout", x: "47%", y: "6%", size: 24, rotate: 8, opacity: 0.5, hideOnMobile: true },
];

export function DoodleScatter({
  items = CORNER_SET,
  className,
  tone = "text-white",
}: {
  items?: DoodleItem[];
  className?: string;
  tone?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${tone} ${className ?? ""}`}>
      {items.map((d, i) => (
        <Doodle
          key={i}
          glyph={d.glyph}
          className={`absolute animate-float-slow drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] ${d.hideOnMobile ? "hidden md:block" : ""}`}
          style={
            {
              left: d.x,
              top: d.y,
              width: d.size ?? 24,
              height: d.size ?? 24,
              opacity: d.opacity ?? 0.95,
              animationDelay: `${(i % 5) * 0.7}s`,
              ["--ff-rot"]: `${d.rotate ?? 0}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * FaintImage — the soft photographic watermark that sits behind cream
 * sections so the page never reads as flat white.
 * ------------------------------------------------------------------ */
export function FaintImage({
  src,
  alt = "",
  className,
  opacity = 0.09,
  position = "center",
}: {
  src: string;
  alt?: string;
  className?: string;
  opacity?: number;
  position?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full scale-105 object-cover mix-blend-multiply"
        style={{
          opacity,
          objectPosition: position,
          maskImage: "radial-gradient(75% 65% at 50% 50%, #000 35%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(75% 65% at 50% 50%, #000 35%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * SectionFlourish — faint photo + doodles in one drop-in wrapper.
 * Place as the first child of any `relative` section.
 * ------------------------------------------------------------------ */
export function SectionFlourish({
  image,
  items = CORNER_SET,
  opacity = 0.09,
  tone = "text-white",
}: {
  image?: string;
  items?: DoodleItem[];
  opacity?: number;
  tone?: string;
}) {
  return (
    <>
      {image && <FaintImage src={image} opacity={opacity} />}
      <DoodleScatter items={items} tone={tone} />
    </>
  );
}

/** Shared faint photography so every cream band is textured the same way. */
export const FLOURISH_IMAGES = {
  market: "https://images.pexels.com/photos/12944639/pexels-photo-12944639.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800",
  greens: "https://images.pexels.com/photos/33554298/pexels-photo-33554298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800",
  fruit: "https://images.pexels.com/photos/3252766/pexels-photo-3252766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800",
  herbs: "https://images.pexels.com/photos/30666729/pexels-photo-30666729.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800",
  stall: "https://images.pexels.com/photos/30893271/pexels-photo-30893271.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800",
  harvest: "https://images.pexels.com/photos/4589144/pexels-photo-4589144.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800",
  bakery: "https://images.pexels.com/photos/16125451/pexels-photo-16125451.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800",
};
