import { useMemo, useState } from "react";
import { FARMERS, MARKETS, PRODUCE, SEASONS, TESTIMONIALS, getProduceById, marketsForProduce } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/AppStore";
import { useInView, useParallax, useReveal, useScrollProgress } from "@/lib/hooks";
import { ProduceArt, ART_FOR_ID } from "./ProduceArt";
import { SectionFlourish, FLOURISH_IMAGES } from "./Doodles";
import { FarmerCard, TestimonialCard } from "./cards";
import { BtnLink, Curve, MaskedHeading, Modal, Reveal, SectionLabel, Slider, VisitorCounter } from "./ui";

const EDITORIAL_IMAGE =
  "https://images.pexels.com/photos/5701917/pexels-photo-5701917.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800";
const LOVE_IMAGE =
  "https://images.pexels.com/photos/1334131/pexels-photo-1334131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800";

/** The "Discover FreshFind" film — opens as an embedded YouTube player. */
const FILM_URL = "https://www.youtube.com/embed/Oj0uxJSZfos";

/* ============================================================ *
 * 12 — "Choose Your Fresh Find" tabbed experience
 * ============================================================ */
const TABS = [
  { label: "Fresh Fruits", category: "Fruits", art: "strawberry", tint: "#FBE5DE" },
  { label: "Vegetables", category: "Vegetables", art: "broccoli", tint: "#EAF3D8" },
  { label: "Herbs", category: "Herbs", art: "basil", tint: "#E7F1DC" },
  { label: "Dairy", category: "Dairy", art: "cheese", tint: "#FBF1D8" },
  { label: "Bakery", category: "Baked Goods", art: "sourdough", tint: "#F6E7D2" },
  { label: "Honey & Preserves", category: "Honey", art: "honey", tint: "#FCEED0" },
];

export function ChooseYourFind() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  const items = useMemo(
    () => PRODUCE.filter((p) => p.category === tab.category),
    [tab.category],
  );

  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
      <SectionFlourish image={FLOURISH_IMAGES.greens} opacity={0.07} />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal variant="up">
            <SectionLabel index="03">Choose</SectionLabel>
            <MaskedHeading
              delay={80}
              lines={[
                <>
                  Choose Your{" "}
                  <span className="font-script text-leaf">Fresh Find</span>
                </>,
              ]}
              className="mt-4 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.04] text-forest"
            />
          </Reveal>
          <Reveal variant="up" delay={140}>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-muted">
              Six ways into the market. Pick a category and we'll show you what's peaking, where to
              find it and how to keep it fresh.
            </p>
          </Reveal>
        </div>

        {/* Tabs */}
        <Reveal variant="up" delay={80} className="mt-10">
          <div
            role="tablist"
            aria-label="Choose a produce category"
            className="no-scrollbar flex gap-2 overflow-x-auto pb-2"
          >
            {TABS.map((t, i) => (
              <button
                key={t.label}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative shrink-0 overflow-hidden rounded-full px-6 py-3 text-[13px] font-bold uppercase tracking-[0.1em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  active === i
                    ? "bg-forest text-cream shadow-[0_14px_34px_-16px_rgba(22,51,31,0.8)]"
                    : "bg-white text-forest/70 hover:bg-lime-soft hover:text-forest",
                )}
              >
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Panel */}
        <div
          className="mt-6 overflow-hidden rounded-[40px] transition-colors duration-700"
          style={{ backgroundColor: tab.tint }}
        >
          <div key={tab.category} className="animate-pop grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
            {/* hero art for the category */}
            <div className="relative flex min-h-[16rem] items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute h-56 w-56 rounded-full bg-white/60 blur-3xl"
              />
              <ProduceArt
                name={tab.art}
                className="animate-float-slow relative h-64 w-auto drop-shadow-[0_26px_36px_rgba(22,51,31,0.22)] sm:h-80"
              />
              <ProduceArt
                name="leaf"
                aria-hidden="true"
                className="animate-float absolute -bottom-2 left-2 hidden h-24 w-auto opacity-50 sm:block"
              />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-leaf-2">
                {tab.category}
              </p>
              <h3 className="mt-2 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight text-forest">
                {tab.category === "Honey"
                  ? "Raw, unheated, unhurried"
                  : tab.category === "Dairy"
                    ? "Made within twenty miles"
                    : tab.category === "Baked Goods"
                      ? "Slow ferment, early bake"
                      : tab.category === "Herbs"
                        ? "Cut after you order"
                        : tab.category === "Fruits"
                          ? "Picked ripe, sold within a day"
                          : "Grown in soil, not freight"}
              </h3>
              <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-forest/70">
                {items[0]?.description ?? "Fresh, local and seasonal."}
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {items.map((it, i) => (
                  <li key={it.id}>
                    <a
                      href={`#/produce/${it.id}`}
                      className="group flex items-center gap-3 rounded-2xl bg-white/75 p-3 transition-all duration-400 hover:-translate-y-1 hover:bg-white hover:shadow-soft"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <ProduceArt
                        name={ART_FOR_ID[it.id] ?? "leaf"}
                        className="h-11 w-auto shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                      />
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold text-forest">{it.name}</span>
                        <span className="block truncate text-[12px] text-muted">{it.peak}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ *
 * 13 — Featured produce slider
 * ============================================================ */
export function FeaturedProduceSlider() {
  const { isSaved, toggle } = useApp();
  const items = PRODUCE.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-cream-2 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal variant="up">
          <SectionLabel index="04">Featured</SectionLabel>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.04] text-forest">
            The produce everyone is{" "}
            <span className="font-script text-tomato">talking about</span>
          </h2>
        </Reveal>

        <div className="mt-12">
          <Slider label="Featured produce" autoPlay={3400}>
            {items.map((item) => {
              const key = `produce:${item.id}`;
              const saved = isSaved(key);
              return (
                <article
                  key={item.id}
                  data-slide
                  className="group relative w-[85vw] shrink-0 snap-start overflow-hidden rounded-[36px] bg-cream p-7 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift sm:w-[27rem]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-25 blur-3xl transition-opacity duration-700 group-hover:opacity-50"
                    style={{ background: item.color }}
                  />
                  <div className="relative flex h-52 items-center justify-center">
                    <ProduceArt
                      name={ART_FOR_ID[item.id] ?? "leaf"}
                      className="animate-float-slow h-full w-auto drop-shadow-[0_24px_34px_rgba(22,51,31,0.22)] transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <button
                    onClick={() =>
                      toggle({
                        key,
                        type: "produce",
                        id: item.id,
                        name: item.name,
                        subtitle: `${item.category} · ${item.peak}`,
                        image: item.image,
                      })
                    }
                    aria-pressed={saved}
                    aria-label={saved ? `Remove ${item.name}` : `Save ${item.name}`}
                    className={cn(
                      "absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border transition-all duration-400 active:scale-90",
                      saved
                        ? "border-tomato/40 bg-tomato/10 text-tomato"
                        : "border-forest/12 bg-white text-forest hover:border-tomato/50 hover:text-tomato",
                    )}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <path d="M12 20s-7-4.35-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
                    </svg>
                  </button>

                  <h3 className="mt-2 font-display text-[2rem] font-semibold uppercase leading-none text-forest">
                    {item.name}
                  </h3>
                  <p className="mt-3 max-w-xs text-[14.5px] italic leading-relaxed text-muted">
                    “{item.tagline}”
                  </p>
                  <dl className="mt-5 flex gap-8 border-t border-forest/10 pt-5">
                    <div>
                      <dt className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-muted">Season</dt>
                      <dd className="mt-1 text-[14px] font-semibold text-forest">{item.season.join(" – ")}</dd>
                    </div>
                    <div>
                      <dt className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-muted">Available at</dt>
                      <dd className="mt-1 text-[14px] font-semibold text-forest">
                        {marketsForProduce(item.id).length} Markets
                      </dd>
                    </div>
                  </dl>
                  <a
                    href={`#/produce/${item.id}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-leaf"
                  >
                    Explore {item.name} <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </article>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ *
 * 14 — Signature avocado panel
 * ============================================================ */
const CHECKS = [
  { title: "Locally sourced", copy: "Grown within 40 miles of the stall you buy it from." },
  { title: "In season", copy: "Picked in its natural window — never forced, never flown." },
  { title: "Freshly harvested", copy: "Cut, picked or pulled within 24 hours of sale." },
  { title: "Available nearby", copy: "Find it at markets sorted by how close they are." },
];

export function AvocadoFeature() {
  const panel = useScrollProgress<HTMLDivElement>();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          ref={panel}
          className="relative isolate overflow-hidden rounded-[46px] bg-forest px-6 py-14 sm:px-12 sm:py-20"
        >
          {/* organic blobs */}
          <div
            aria-hidden="true"
            className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-leaf/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-lime/20 blur-3xl"
          />

          <div ref={ref} className="reveal reveal--up relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-8">
            {/* left: headline + art */}
            <div className="relative">
              <SectionLabel index="05" tone="light">
                In Season
              </SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[0.98] text-cream">
                Organic &amp;
                <br />
                <span className="font-script text-lime">In Season</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/70">
                Every item listed on FreshFind is checked against four simple promises. If a stall
                can't meet all four, it doesn't get listed.
              </p>

              {/* whole + halved avocado overlap the green panel and
                  tilt/scale in 3D as the section scrolls through view —
                  sized up so it reads as the hero of this panel */}
              <div className="relative -mx-6 mt-4 flex h-[24rem] items-center justify-center sm:-mx-10 sm:h-[36rem]">
                <ProduceArt
                  name="avocado"
                  className="animate-pop3d h-full w-auto max-w-none object-contain"
                  style={
                    {
                      transform:
                        "perspective(1000px) rotateY(calc(-7deg + var(--p, 0) * 15deg)) rotateX(4deg) scale(calc(0.88 + var(--p, 0) * 0.22))",
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

            {/* right: checklist */}
            <ul className="flex flex-col justify-center gap-4">
              {CHECKS.map((c, i) => (
                <li
                  key={c.title}
                  className="group flex items-start gap-4 rounded-[28px] border border-cream/12 bg-cream/6 p-5 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-lime/50 hover:bg-cream/12"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="animate-pop relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime text-forest" style={{ animationDelay: `${i * 120}ms` }}>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                      <path d="M4 12.5 9.5 18 20 6.5" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-display text-[20px] font-semibold text-cream">{c.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-cream/65">{c.copy}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="ml-auto font-display text-3xl font-semibold text-cream/12"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ *
 * 16 — Fresh Picks cards
 * ============================================================ */
const PICK_IDS = ["strawberry", "avocado", "tomato", "carrot", "blueberry", "peach"];

export function FreshPicks() {
  const { isSaved, toggle } = useApp();
  const items = PICK_IDS.map((id) => getProduceById(id)!).filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
      <SectionFlourish image={FLOURISH_IMAGES.fruit} opacity={0.07} />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal variant="up">
            <SectionLabel index="06">Fresh Picks</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.02] text-forest">
              Today's <span className="font-script text-leaf">Fresh Picks</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const key = `produce:${item.id}`;
            const saved = isSaved(key);
            const count = marketsForProduce(item.id).length;
            return (
              <Reveal key={item.id} variant="up" delay={i * 80}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[34px] bg-white shadow-soft transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-lift">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-3/60 via-transparent to-transparent" />
                    <ProduceArt
                      name={ART_FOR_ID[item.id] ?? "leaf"}
                      className="animate-float-slow absolute -bottom-6 right-4 h-28 w-auto drop-shadow-[0_18px_26px_rgba(0,0,0,0.35)] transition-transform duration-700 group-hover:scale-110"
                    />
                    <button
                      onClick={() =>
                        toggle({
                          key,
                          type: "produce",
                          id: item.id,
                          name: item.name,
                          subtitle: `${item.category} · ${item.peak}`,
                          image: item.image,
                        })
                      }
                      aria-pressed={saved}
                      aria-label={saved ? `Remove ${item.name}` : `Save ${item.name}`}
                      className={cn(
                        "absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full backdrop-blur transition-all duration-400 active:scale-90",
                        saved ? "bg-tomato text-white" : "bg-cream/85 text-forest hover:bg-tomato hover:text-white",
                      )}
                    >
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M12 20s-7-4.35-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
                      </svg>
                    </button>
                    <span className="absolute left-4 top-4 rounded-full bg-lime px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-forest">
                      {item.season[0]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-[24px] font-semibold text-forest">{item.name}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.tagline}</p>
                    <p className="mt-4 text-[12.5px] font-semibold text-forest/80">
                      {item.peak} · {count} markets
                    </p>
                    <a
                      href={`#/produce/${item.id}`}
                      className="mt-5 inline-flex items-center gap-2 self-start text-[11.5px] font-bold uppercase tracking-[0.14em] text-forest transition group-hover:text-leaf-2"
                    >
                      View Details <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ *
 * 15 — What's in season (teaser on home)
 * ============================================================ */
const SEASON_TAGLINES: Record<string, string> = {
  spring: "Fresh Beginnings",
  summer: "Sunshine & Harvest",
  autumn: "Rich & Earthy",
  winter: "Comfort in Every Bite",
};

const SEASON_EMOJI: Record<string, string> = {
  spinach: "🥬",
  strawberry: "🍓",
  basil: "🌿",
  avocado: "🥑",
  tomato: "🍅",
  peach: "🍑",
  blueberry: "🫐",
  honey: "🍯",
  pumpkin: "🎃",
  apple: "🍎",
  broccoli: "🥦",
  carrot: "🥕",
  citrus: "🍊",
};

export function SeasonalTeaser() {
  return (
    <section className="relative overflow-hidden bg-forest py-20 sm:py-28">
      <Curve fill="var(--color-cream)" flip className="top-0" height={90} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-1/3 h-72 w-72 rounded-full bg-leaf/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-lime/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal variant="up">
            <SectionLabel index="07" tone="light">
              Seasonal
            </SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2.3rem,5.4vw,3.8rem)] font-semibold leading-[1.02] text-cream">
              What's in <span className="font-script text-lime">Season?</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream/70">
              Fresh. Local. Seasonal. Discover what nature brings each season — straight to your
              market.
            </p>
          </Reveal>

          <Reveal variant="right" delay={100} className="relative hidden lg:block">
            <span className="absolute -top-9 right-16 z-10 -rotate-6 font-script text-[19px] text-lime">
              Good Food Grows Here
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 60 50"
              className="absolute -top-2 right-4 z-10 h-12 w-14 text-lime"
            >
              <path
                d="M4 4c14 2 30 10 40 30M44 34c3-4 6-6 12-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1 7"
              />
              <path
                d="M50 22c4 3 6 7 6 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="aspect-[4/3] overflow-hidden rounded-[36px] shadow-lift">
              <img
                src={FLOURISH_IMAGES.harvest}
                alt="A basket overflowing with seasonal fruit and vegetables"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SEASONS.map((s, i) => (
            <Reveal key={s.id} variant="up" delay={i * 90}>
              <a
                href="#/produce"
                className="group relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[30px] shadow-lift transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2"
              >
                <img
                  src={s.image}
                  alt={`${s.name} produce`}
                  loading="lazy"
                  className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10"
                  style={{
                    background: `linear-gradient(180deg, ${s.accent}33 0%, rgba(15,26,18,0.35) 45%, rgba(10,18,13,0.94) 100%)`,
                  }}
                />

                <div className="relative flex flex-1 flex-col justify-between p-6">
                  <span
                    className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-forest"
                    style={{ background: s.accent }}
                  >
                    {s.months}
                  </span>

                  <div>
                    <h3 className="font-display text-[32px] font-semibold leading-none text-cream">
                      {s.name}
                    </h3>
                    <p
                      className="mt-1.5 font-script text-[19px]"
                      style={{ color: s.accent }}
                    >
                      {SEASON_TAGLINES[s.id] ?? s.name}
                    </p>

                    <ul className="mt-4 space-y-1.5">
                      {s.items.map((pid) => {
                        const it = getProduceById(pid);
                        if (!it) return null;
                        return (
                          <li key={pid} className="flex items-center gap-2 text-[13.5px] text-cream/85">
                            <span aria-hidden="true" className="text-[15px] leading-none">
                              {SEASON_EMOJI[pid] ?? "🌿"}
                            </span>
                            {it.name}
                          </li>
                        );
                      })}
                    </ul>

                    <span
                      className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-forest transition-transform duration-400 group-hover:translate-x-1"
                      style={{ background: s.accent }}
                    >
                      Explore <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 text-right">
          <a
            href="#/seasonal"
            className="inline-flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.16em] text-lime transition hover:text-cream"
          >
            Ask the chatbot what to buy this week <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
      <Curve fill="var(--color-cream)" className="bottom-0" height={90} />
    </section>
  );
}

/* ============================================================ *
 * 19 — "Fresh All Along" cinematic editorial band
 * ============================================================ */
export function FreshAllAlong() {
  const imgRef = useParallax<HTMLDivElement>(70);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative isolate min-h-[86vh] overflow-hidden bg-forest-3">
      <Curve fill="var(--color-cream)" flip className="top-0" height={110} />
      <div ref={imgRef} className="absolute inset-0 -z-10 scale-[1.2]">
        <img
          src={EDITORIAL_IMAGE}
          alt="Freshly harvested vegetables in net bags"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-forest-3/72" />

      <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <div ref={ref} className="reveal reveal--zoom">
          <SectionLabel tone="light">Since 2019</SectionLabel>
          <h2 className="mt-5 font-display text-[clamp(3rem,12vw,9rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-cream">
            <span className="font-script text-lime">Fresh All Along</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-[15.5px] leading-relaxed text-cream/75 sm:text-[17px]">
            From the first strawberry of spring to the last squash of autumn — twelve markets,
            sixteen produce guides and one very short journey from field to table.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <BtnLink href="#/directory" variant="light" size="lg" withArrow>
              Explore Markets
            </BtnLink>
            <BtnLink
              href="#/produce"
              variant="outline"
              size="lg"
              className="border-cream/35 text-cream hover:border-lime hover:bg-lime/12"
            >
              See What's In Season
            </BtnLink>
          </div>
        </div>
      </div>
      <Curve fill="var(--color-cream)" className="bottom-0" height={110} />
    </section>
  );
}

/* ============================================================ *
 * 20 — "Grown with Love" signature section
 * ============================================================ */
export function MadeWithLove() {
  const wrap = useScrollProgress<HTMLDivElement>();
  const [playing, setPlaying] = useState(false);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative isolate bg-cream">
      <div ref={wrap} className="relative isolate min-h-[92vh] overflow-hidden">
        {/* organic curved top edge flowing out of the cream section above */}
        <Curve fill="var(--color-cream)" flip className="top-0" height={110} />
        {/* zooming image */}
        <div
          className="absolute inset-0 -z-10"
          style={{ transform: "scale(calc(1 + var(--p, 0) * 0.14))" }}
        >
          <img
            src={LOVE_IMAGE}
            alt="A table of fresh fruit, vegetables, bread and flowers"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-forest-3/55" />

        <div
          ref={ref}
          className="reveal reveal--up relative mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8"
        >
          <SectionLabel tone="light">Our promise</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(3.2rem,12vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.03em] text-cream">
            <span className="font-script text-lime">Grown with Love</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15.5px] leading-relaxed text-cream/78">
            Freshness, made local. Ninety seconds inside a Saturday morning — the growers, the
            regulars and the produce that never sees a warehouse.
          </p>

          <div className="mt-10 flex flex-col items-center gap-6">
            <button
              onClick={() => setPlaying(true)}
              className="group relative grid h-24 w-24 place-items-center rounded-full border border-cream/40 bg-cream/10 backdrop-blur transition-all duration-500 hover:scale-105 hover:bg-lime"
              aria-label="Play the FreshFind film on YouTube"
            >
              <span className="absolute inset-0 rounded-full bg-cream/40 pulse-ring text-cream" />
              <span className="relative ml-1 text-2xl text-cream transition-colors group-hover:text-forest">
                ▶
              </span>
            </button>
            <span className="text-[11.5px] font-bold uppercase tracking-[0.24em] text-cream/70">
              Discover FreshFind
            </span>
          </div>
        </div>
      </div>

      <Modal open={playing} onClose={() => setPlaying(false)} title="Discover FreshFind">
        <div className="overflow-hidden rounded-3xl bg-forest-3">
          <iframe
            className="aspect-video w-full"
            src={playing ? `${FILM_URL}?autoplay=1&rel=0` : undefined}
            title="FreshFind — a Saturday morning at the market"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
          Ninety seconds inside a Saturday morning at the Portland Farmers Market — the growers, the
          regulars and the produce that never sees a warehouse.
        </p>
        <a
          href={FILM_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-leaf"
        >
          Watch on YouTube <span aria-hidden="true">↗</span>
        </a>
      </Modal>
    </section>
  );
}

/* ============================================================ *
 * 22 — Meet your local growers
 * ============================================================ */
export function Growers() {
  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
      <SectionFlourish image={FLOURISH_IMAGES.herbs} opacity={0.07} />
      <ProduceArt
        name="carrot"
        aria-hidden="true"
        className="animate-float pointer-events-none absolute -right-6 top-16 hidden w-32 opacity-60 lg:block"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal variant="up">
            <SectionLabel index="08">Community</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.02] text-forest">
              Meet Your <span className="font-script text-leaf">Local Growers</span>
            </h2>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-muted">
              Six of the growers behind the stalls. Ask them what the herd was grazing on — they will
              tell you, in detail.
            </p>
          </Reveal>
        </div>

        <div className="mt-12">
          <Slider label="Local growers" autoPlay={3200}>
            {FARMERS.map((f, i) => (
              <div key={f.id} data-slide className="w-[78vw] shrink-0 snap-start sm:w-[22rem]">
                <FarmerCard farmer={f} index={i} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ *
 * 21 — Testimonials
 * ============================================================ */
export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-cream-2 py-20 sm:py-28">
      <SectionFlourish image={FLOURISH_IMAGES.bakery} opacity={0.06} />
      <ProduceArt
        name="apple"
        aria-hidden="true"
        className="animate-float-slow pointer-events-none absolute left-4 top-10 z-[1] hidden w-24 opacity-50 lg:block"
      />
      <ProduceArt
        name="blueberry"
        aria-hidden="true"
        className="animate-float pointer-events-none absolute bottom-16 right-8 z-[1] hidden w-20 opacity-50 lg:block"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal variant="up" className="text-center">
          <SectionLabel index="09" className="justify-center">
            Kind words
          </SectionLabel>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.2rem)] font-semibold text-forest">
            Loved by cooks, chefs &amp; growers
          </h2>
        </Reveal>

        <div className="mt-12">
          <Slider label="Testimonials">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} data-slide className="shrink-0 snap-start">
                <TestimonialCard t={t} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ *
 * 28 — Visitor counter strip
 * ============================================================ */
export function CounterStrip() {
  const { visitors } = useApp();
  const [ref, inView] = useInView<HTMLDivElement>("-5%");

  return (
    <section ref={ref} className="bg-cream py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 rounded-[40px] bg-forest px-6 py-10 sm:grid-cols-3 sm:px-12 sm:py-14">
          <div className="text-center sm:text-left">
            <VisitorCounter value={visitors} className="text-lime" />
            <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.2em] text-cream/60">
              Fresh discoveries made
            </p>
          </div>
          {[
            ["12", "Markets across the city"],
            ["40 mi", "Average food miles"],
          ].map(([n, l]) => (
            <div key={l} className={cn("text-center sm:text-left")}>
              <p className="font-display text-4xl font-semibold text-cream sm:text-5xl">{n}</p>
              <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.2em] text-cream/60">{l}</p>
            </div>
          ))}
        </div>
        {inView && null}
      </div>
    </section>
  );
}

/** Small helper used on inner pages to avoid repeating the markets import. */
export const ALL_MARKETS = MARKETS;
