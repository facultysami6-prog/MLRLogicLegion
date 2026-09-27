import { useEffect, useRef, useState, type RefObject } from "react";

/* ------------------------------------------------------------------ *
 * Reduced motion — respects the OS accessibility setting.
 * ------------------------------------------------------------------ */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ *
 * Scroll reveal — single shared IntersectionObserver for performance.
 * Adds `is-visible` to any element carrying a `.reveal` class.
 * ------------------------------------------------------------------ */
let sharedObserver: IntersectionObserver | null = null;
const revealCallbacks = new WeakMap<Element, () => void>();

function getObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            const cb = revealCallbacks.get(entry.target);
            if (cb) cb();
            sharedObserver?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
  }
  return sharedObserver;
}

/** Attach to any element to animate it in when scrolled into view. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { once?: boolean; onReveal?: () => void } = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { onReveal } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (onReveal) revealCallbacks.set(el, onReveal);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("is-visible");
      onReveal?.();
      return;
    }
    const obs = getObserver();
    if (!obs) {
      el.classList.add("is-visible");
      onReveal?.();
      return;
    }
    obs.observe(el);
    return () => obs.unobserve(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/* ------------------------------------------------------------------ *
 * inView — boolean flag, useful for counters & one-shot effects
 * ------------------------------------------------------------------ */
export function useInView<T extends HTMLElement = HTMLDivElement>(margin = "-15%"): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);
  return [ref, inView];
}

/* ------------------------------------------------------------------ *
 * Parallax — rAF-throttled translate based on element position.
 * ------------------------------------------------------------------ */
export function useParallax<T extends HTMLElement = HTMLDivElement>(strength = 60): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (below viewport) → 1 (above viewport)
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const y = Math.max(-1, Math.min(1, progress)) * strength;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength, reduced]);

  return ref;
}

/* ------------------------------------------------------------------ *
 * Scroll progress (0 → 1) across a section — drives scale/zoom fx.
 * ------------------------------------------------------------------ */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = (vh - rect.top) / (vh + rect.height);
      const p = Math.max(0, Math.min(1, raw));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);
  return ref;
}

/* ------------------------------------------------------------------ *
 * Live clock — powers Open Now / Opening Soon / Closed everywhere.
 * ------------------------------------------------------------------ */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

/* ------------------------------------------------------------------ *
 * Sticky nav state
 * ------------------------------------------------------------------ */
export function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > threshold);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);
  return scrolled;
}

/* ------------------------------------------------------------------ *
 * Body scroll lock (mobile nav, modals, chatbot)
 * ------------------------------------------------------------------ */
export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/* ------------------------------------------------------------------ *
 * Media query helper
 * ------------------------------------------------------------------ */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const on = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

/* ------------------------------------------------------------------ *
 * Count-up animation for the visitor counter
 * ------------------------------------------------------------------ */
export function useCountUp(target: number, active: boolean, duration = 1900): number {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, active, duration, reduced]);
  return value;
}
