import { useEffect, useState } from "react";
import { useParallax, useReducedMotion, useReveal } from "@/lib/hooks";
import { BtnLink, Curve, SectionLabel, MaskedHeading } from "./ui";
import { LiveClock } from "./ui";
import { cn } from "@/lib/utils";

/** Cinematic auto-rotating hero backdrop. */
const HERO_SLIDES = [
  {
    image:
      "https://i.pinimg.com/736x/5e/0c/2e/5e0c2e0721837dadf62302d49c6cb1b1.jpg",
    alt: "Fresh seasonal produce arranged on a dark background",
    label: "Seasonal produce",
  },
  {
    image:
      "https://i.pinimg.com/1200x/1e/9d/07/1e9d07cb1bf74ae8e4da616e17a579d8.jpg",
    alt: "A colourful outdoor market stand under a green umbrella",
    label: "Market mornings",
  },
  {
    image:
      "https://i.pinimg.com/1200x/91/c9/c6/91c9c60bb72894ca678392706c32058b.jpg",
    alt: "A vibrant stall of fresh fruit and vegetables",
    label: "Grown locally",
  },
  {
    image:
      "https://i.pinimg.com/1200x/3d/08/24/3d0824b86e4b80bc07d3f4f6e744021b.jpg",
    alt: "A grower selling fresh greens to a customer",
    label: "The people behind it",
  },
  {
    image:
      "https://i.pinimg.com/736x/f6/fb/ce/f6fbce413ca896eafcd16c0351feaa81.jpg",
    alt: "A street market counter stacked with pumpkins",
    label: "Harvest season",
  },
];

const SLIDE_MS = 5200;

const FLOATERS = [
  // { name: "avocado", image: "/images/avacado.png", className: "left-[3%] top-[18%] w-24 sm:w-32", rot: -12, delay: "0s" },
  { name: "strawberry", image: "/images/strawberry.png", className: "right-[5%] top-[14%] w-20 sm:w-28", rot: 14, delay: "1.2s" },
  { name: "tomato", image: "/images/tomato.png", className: "left-[10%] bottom-[22%] w-16 sm:w-24", rot: 8, delay: "0.6s" },
  { name: "basil", image: "/images/basil.png", className: "right-[9%] bottom-[18%] w-20 sm:w-28", rot: -8, delay: "1.8s" },
  { name: "honey", image: "/images/honey.png", className: "right-[22%] top-[62%] hidden w-20 lg:block", rot: 10, delay: "2.4s" },
];

export function Hero() {
  const imgRef = useParallax<HTMLDivElement>(90);
  const vegRef = useParallax<HTMLDivElement>(45);
  const textRef = useReveal<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  /* Auto-advance the backdrop. Disabled for prefers-reduced-motion and
     when the user hovers/focuses the controls or the tab loses visibility. */
  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(
      () => setSlide((s) => (s + 1) % HERO_SLIDES.length),
      SLIDE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-forest-3">
      {/* Cinematic auto-rotating background */}
      <div
        ref={imgRef}
        className="absolute inset-0 -z-10 scale-[1.18]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {HERO_SLIDES.map((s, i) => (
          <img
            key={s.image}
            src={s.image}
            alt={i === 0 ? s.alt : ""}
            aria-hidden={i !== 0}
            fetchPriority={i === 0 ? "high" : undefined}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              i === slide ? "opacity-100" : "opacity-0",
              /* slow Ken-Burns drift, restarted on every slide change */
              i === slide && !reduced && "animate-[ff-kenburns_9s_ease-out_both]",
            )}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-3/92 via-forest-3/70 to-forest-3/45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_20%_10%,rgba(199,227,107,0.18),transparent_60%)]"
      />

     {/* Vegetable / produce layer */}
<div ref={vegRef} aria-hidden="true" className="absolute inset-0 -z-10">
  {FLOATERS.map((f) => (
    <img
      key={f.name}
      src={f.image}
      alt={f.name}
      className={`animate-float-slow pointer-events-none absolute drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)] ${f.className}`}
      style={
        {
          animationDelay: f.delay,
          ["--ff-rot" as string]: `${f.rot}deg`,
        } as React.CSSProperties
      }
    />
  ))}
</div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-32 pt-36 sm:px-8 sm:pb-40">
        <div ref={textRef} className="reveal reveal--up max-w-4xl">
          <div className="flex flex-wrap items-center gap-4">
            <SectionLabel index="01" tone="light">
              Discover · Portland
            </SectionLabel>
            <span className="hidden items-center gap-2 rounded-full border border-cream/25 bg-cream/5 px-4 py-1.5 text-[11px] font-semibold text-cream/75 backdrop-blur sm:inline-flex">
              <LiveClock />
            </span>
          </div>

          <MaskedHeading
            as="h1"
            delay={120}
            lines={[
              <span key="a">Fresh</span>,
              <span key="b" className="font-script text-lime">
                All Along.
              </span>,
            ]}
            className="mt-6 font-display text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-cream [&>span:last-child]:text-[1.05em] [&>span:last-child]:leading-[1.1]"
          />

          <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-cream/75 sm:text-[18px]">
            Discover local farmers markets, seasonal produce and fresh finds near you — with live
            opening hours, what's peaking this week, and the growers behind every stall.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <BtnLink href="#/find" variant="light" size="lg" withArrow>
              Find a Market Near You
            </BtnLink>
            <BtnLink
              href="#/seasonal"
              variant="outline"
              size="lg"
              className="border-cream/35 text-cream hover:border-lime hover:bg-lime/12"
            >
              Explore Seasonal Produce
            </BtnLink>
          </div>

          <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-cream/15 pt-8">
            {[
              ["12", "Markets mapped"],
              ["16", "Produce guides"],
              ["6", "Local growers"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl font-semibold text-lime">{n}</dt>
                <dd className="mt-0.5 text-[12.5px] uppercase tracking-[0.16em] text-cream/55">{l}</dd>
              </div>
            ))}
          </dl>

          {/* carousel controls */}
          <div
            className="mt-8 flex items-center gap-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div role="tablist" aria-label="Hero background slides" className="flex items-center gap-2">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.image}
                  role="tab"
                  aria-selected={i === slide}
                  aria-label={`Slide ${i + 1} — ${s.label}`}
                  onClick={() => setSlide(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    i === slide ? "w-10 bg-lime" : "w-5 bg-cream/35 hover:bg-cream/70",
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cream/60 tabular-nums">
              {String(slide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
              <span className="ml-2 text-lime/70">{HERO_SLIDES[slide].label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#quick-find"
        className="absolute bottom-28 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.24em] text-cream/55 transition hover:text-lime sm:flex"
      >
        <span>Scroll</span>
        <span className="relative grid h-10 w-6 place-items-start justify-center rounded-full border border-cream/35 pt-2">
          <span className="animate-scroll-dot h-1.5 w-1.5 rounded-full bg-lime" />
        </span>
      </a>

      {/* Curved organic bottom edge */}
      <Curve
        fill="var(--color-cream)"
        className="bottom-0"
        height={120}
        path="M0,64 C180,120 380,10 720,30 C1040,48 1230,118 1440,58 L1440,120 L0,120 Z"
      />
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Marquee ticker — "Fresh today" strip
 * ------------------------------------------------------------------ */
export function Ticker() {
  const items = [
    "Strawberries · peak season",
    "Heritage tomatoes",
    "Raw wildflower honey",
    "Cut-to-order basil",
    "36-hour sourdough",
    "Freshly pulled carrots",
    "Heritage apples",
    "Pasture-raised eggs",
  ];
  return (
    <div className="relative overflow-hidden bg-forest py-4">
      <div className="marquee-mask flex w-max animate-marquee items-center gap-10">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.22em] text-cream/75">
              {t}
            </span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />
          </span>
        ))}
      </div>
    </div>
  );
}
