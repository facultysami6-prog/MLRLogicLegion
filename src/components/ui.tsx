import {
  createContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { useInView, useCountUp, useReveal, useNow } from "@/lib/hooks";
import type { MarketStatus } from "@/lib/types";
import { STATUS_STYLES } from "@/lib/marketStatus";
import { cn } from "@/lib/utils";
import { navigate } from "@/lib/router";

/* ============================================================ *
 * Reveal — declarative scroll-reveal wrapper
 * ============================================================ */
type RevealVariant = "up" | "down" | "left" | "right" | "zoom" | "blur" | "mask";

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span" | "p" | "header";
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", `reveal--${variant}`, className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ============================================================ *
 * Masked heading — line-by-line typographic reveal
 * ============================================================ */
export function MaskedHeading({
  lines,
  className,
  as: Tag = "h2",
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}) {
  const ref = useReveal<HTMLHeadingElement>();
  return (
    <Tag ref={ref as never} className={cn("reveal", className)}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span style={{ transitionDelay: `${delay + i * 110}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/* ============================================================ *
 * Section label — editorial "01 — DISCOVER" markers
 * ============================================================ */
export function SectionLabel({
  index,
  children,
  tone = "dark",
  className,
}: {
  index?: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em]",
        tone === "dark" ? "text-leaf-2" : "text-lime",
        className,
      )}
    >
      {index && (
        <span
          className={cn(
            "font-display text-[13px] font-semibold not-italic",
            tone === "dark" ? "text-tomato" : "text-lime",
          )}
        >
          {index}
        </span>
      )}
      <span
        aria-hidden="true"
        className={cn("h-px w-8", tone === "dark" ? "bg-leaf/50" : "bg-lime/60")}
      />
      {children}
    </span>
  );
}

/* ============================================================ *
 * Organic curve / wave section dividers
 * ============================================================ */
export function Curve({
  fill = "var(--color-cream)",
  flip = false,
  className,
  height = 110,
  path = "M0,54 C220,112 420,4 720,34 C1010,62 1210,118 1440,52 L1440,120 L0,120 Z",
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
  height?: number;
  path?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 z-10 w-full", className)}
      style={{ height, transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-full w-full"
        role="presentation"
      >
        <path d={path} fill={fill} />
      </svg>
    </div>
  );
}

/* ============================================================ *
 * Buttons — premium hover micro-interactions
 * ============================================================ */
type BtnVariant = "primary" | "leaf" | "outline" | "ghost" | "light" | "dark";

const BTN_VARIANTS: Record<BtnVariant, string> = {
  primary:
    "bg-forest text-cream hover:bg-forest-2 shadow-[0_14px_36px_-16px_rgba(22,51,31,0.7)]",
  leaf: "bg-leaf text-white hover:bg-leaf-2 shadow-[0_16px_38px_-16px_rgba(95,168,60,0.85)]",
  outline: "border border-forest/25 text-forest hover:border-leaf hover:bg-leaf/8 bg-transparent",
  ghost: "text-forest hover:bg-forest/6 bg-transparent",
  light:
    "bg-cream text-forest hover:bg-lime shadow-[0_16px_40px_-18px_rgba(0,0,0,0.45)]",
  dark: "bg-forest-3/85 text-cream backdrop-blur hover:bg-forest-3",
};

export function Btn({
  variant = "primary",
  size = "md",
  className,
  children,
  withArrow = false,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: "sm" | "md" | "lg";
  withArrow?: boolean;
}) {
  const sizes = {
    sm: "px-4 py-2 text-[12px]",
    md: "px-6 py-3 text-[13px]",
    lg: "px-8 py-4 text-[14px]",
  }[size];

  return (
    <button
      {...rest}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold uppercase tracking-[0.12em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
        sizes,
        BTN_VARIANTS[variant],
        className,
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {withArrow && (
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0"
      />
    </button>
  );
}

/** Same styling as Btn but renders an anchor (used for hash routes). */
export function BtnLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  withArrow = false,
}: {
  href: string;
  variant?: BtnVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  withArrow?: boolean;
}) {
  const sizes = {
    sm: "px-4 py-2 text-[12px]",
    md: "px-6 py-3 text-[13px]",
    lg: "px-8 py-4 text-[14px]",
  }[size];

  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold uppercase tracking-[0.12em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5",
        sizes,
        BTN_VARIANTS[variant],
        className,
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {withArrow && (
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0"
      />
    </a>
  );
}

/* ============================================================ *
 * Status pill — Open Now / Opening Soon / Closed
 * ============================================================ */
export function StatusPill({
  status,
  message,
  className,
  glow = false,
}: {
  status: MarketStatus["status"];
  message?: string;
  className?: string;
  glow?: boolean;
}) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm",
        s.badge,
        className,
      )}
    >
      <span className="relative inline-flex h-2 w-2 shrink-0 items-center justify-center">
        {glow && status === "open" && (
          <span className={cn("absolute inset-0 rounded-full", s.dot, "pulse-ring text-leaf")} />
        )}
        <span className={cn("relative h-2 w-2 rounded-full", s.dot)} />
      </span>
      {message ?? (status === "open" ? "Open Now" : status === "opening-soon" ? "Opening Soon" : "Closed")}
    </span>
  );
}

/* ============================================================ *
 * Live digital clock (SRS requirement)
 * ============================================================ */
export function LiveClock({ className, compact = false }: { className?: string; compact?: boolean }) {
  const now = useNow(1000);
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const day = now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
  return (
    <span className={cn("inline-flex items-center gap-2 font-medium tabular-nums", className)}>
      <span aria-hidden="true" className="relative inline-flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-leaf pulse-ring text-leaf" />
        <span className="relative h-2 w-2 rounded-full bg-leaf" />
      </span>
      <span className="sr-only">Current local time: </span>
      <span>{time}</span>
      {!compact && <span className="opacity-60">· {day}</span>}
    </span>
  );
}

/* ============================================================ *
 * Animated visitor counter
 * ============================================================ */
export function VisitorCounter({ value, className }: { value: number; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>("-10%");
  const n = useCountUp(value, inView);
  return (
    <div ref={ref} className={className}>
      <span className="font-display text-4xl font-semibold tabular-nums sm:text-5xl">
        {n.toLocaleString()}
      </span>
    </div>
  );
}

/* ============================================================ *
 * Modal — accessible dialog with smooth enter/exit
 * ============================================================ */
export function Modal({
  open,
  onClose,
  title,
  children,
  labelledBy = "ff-modal-title",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("input,button")?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 animate-[ff-pop_.3s_ease_both] bg-forest-3/55 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="animate-pop relative m-0 w-full max-w-lg rounded-t-[32px] bg-cream p-7 shadow-lift sm:m-4 sm:rounded-[32px]"
      >
        <h2 id={labelledBy} className="font-display text-2xl font-semibold text-forest">
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-forest/6 text-forest transition hover:rotate-90 hover:bg-forest/12"
        >
          ✕
        </button>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================ *
 * Skeleton loader
 * ============================================================ */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-forest/8",
        "after:absolute after:inset-0 after:animate-[ff-marquee_1.6s_linear_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
        className,
      )}
    />
  );
}

/* ============================================================ *
 * Horizontal slider (drag + arrows + snap)
 * ============================================================ */
const SliderCtx = createContext<{ ref: React.RefObject<HTMLDivElement | null> } | null>(null);

export function Slider({
  children,
  className,
  label,
  autoPlay,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  /** Interval in ms to auto-advance. Omit to disable autoplay. Pauses on hover. */
  autoPlay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);

  const sync = () => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 12);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 12);
  };

  useEffect(() => {
    sync();
    const el = ref.current;
    el?.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  useEffect(() => {
    if (!autoPlay) return;
    const id = window.setInterval(() => {
      if (paused) return;
      const el = ref.current;
      if (!el) return;
      const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 12;
      if (nearEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollBy(1);
      }
    }, autoPlay);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, paused]);

  return (
    <SliderCtx.Provider value={{ ref }}>
      <div
        className="relative"
        onMouseEnter={() => autoPlay && setPaused(true)}
        onMouseLeave={() => autoPlay && setPaused(false)}
        onFocus={() => autoPlay && setPaused(true)}
        onBlur={() => autoPlay && setPaused(false)}
      >
        <div
          ref={ref}
          role="region"
          aria-label={label || "Slider"}
          tabIndex={0}
          className={cn(
            "no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6",
            className,
          )}
        >
          {children}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Previous"
            className="grid h-11 w-11 place-items-center rounded-full border border-forest/15 bg-cream text-forest transition-all duration-300 hover:border-leaf hover:bg-leaf hover:text-white disabled:opacity-30 disabled:hover:border-forest/15 disabled:hover:bg-cream disabled:hover:text-forest"
          >
            ←
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Next"
            className="grid h-11 w-11 place-items-center rounded-full border border-forest/15 bg-cream text-forest transition-all duration-300 hover:border-leaf hover:bg-leaf hover:text-white disabled:opacity-30 disabled:hover:border-forest/15 disabled:hover:bg-cream disabled:hover:text-forest"
          >
            →
          </button>
        </div>
      </div>
    </SliderCtx.Provider>
  );
}

/* ============================================================ *
 * Breadcrumbs
 * ============================================================ */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[12px] font-medium">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {it.href ? (
              <a
                href={it.href}
                className="text-cream/70 transition-colors hover:text-lime"
              >
                {it.label}
              </a>
            ) : (
              <span className="text-lime" aria-current="page">
                {it.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden="true" className="text-cream/35">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ============================================================ *
 * Toast host
 * ============================================================ */
export function ToastHost({
  toasts,
}: {
  toasts: { id: number; message: string; tone: "success" | "neutral" | "warn" }[];
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-24 left-1/2 z-[130] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col items-center gap-2 sm:bottom-8 sm:left-8 sm:translate-x-0 sm:items-start"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "animate-pop flex items-center gap-3 rounded-2xl border px-4 py-3 text-[13px] font-semibold shadow-soft backdrop-blur",
            t.tone === "success" && "border-leaf/30 bg-forest/92 text-cream",
            t.tone === "warn" && "border-citrus/40 bg-[#5a3b12]/92 text-cream",
            t.tone === "neutral" && "border-forest/12 bg-cream/95 text-forest",
          )}
        >
          <span aria-hidden="true">
            {t.tone === "success" ? "✓" : t.tone === "warn" ? "!" : "♡"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ============================================================ *
 * Heart / bookmark button
 * ============================================================ */
export function HeartButton({
  active,
  onClick,
  label,
  size = "md",
  className,
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "group grid place-items-center rounded-full border backdrop-blur transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90",
        size === "sm" ? "h-8 w-8" : "h-11 w-11",
        active
          ? "border-tomato/40 bg-tomato/10 text-tomato"
          : "border-cream/50 bg-forest-3/25 text-cream hover:border-tomato/60 hover:bg-tomato/15 hover:text-tomato",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn("transition-transform duration-300 group-hover:scale-110", size === "sm" ? "h-4 w-4" : "h-5 w-5")}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <path d="M12 20s-7-4.35-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
      </svg>
    </button>
  );
}

/* ============================================================ *
 * Page hero shared shell (used by inner pages)
 * ============================================================ */
export function PageHero({
  label,
  index,
  title,
  intro,
  image,
  children,
}: {
  label: string;
  index?: string;
  title: ReactNode;
  intro?: string;
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-3">
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-70"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-3/85 via-forest-3/70 to-forest-3/95" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8 sm:pb-28 sm:pt-48">
        <Reveal variant="up">
          <SectionLabel index={index} tone="light">
            {label}
          </SectionLabel>
        </Reveal>
        <MaskedHeading
          as="h1"
          lines={[title]}
          className="mt-5 max-w-4xl font-display text-[clamp(2.4rem,6.5vw,5rem)] font-semibold leading-[0.98] text-cream"
        />
        {intro && (
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-cream/75 sm:text-lg">{intro}</p>
        )}
        {children}
      </div>
      <Curve fill="var(--color-cream)" className="bottom-0" />
    </section>
  );
}

export const goTo = navigate;
