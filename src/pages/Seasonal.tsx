import { useMemo, useState } from "react";
import { SEASONS, getProduceById, currentSeasonId, marketsForProduce, getMarketById } from "@/lib/data";
import { ProduceArt, ART_FOR_ID } from "@/components/ProduceArt";
import { Breadcrumbs, BtnLink, PageHero, Reveal, SectionLabel, StatusPill } from "@/components/ui";
import { getMarketStatus } from "@/lib/marketStatus";
import { useNow, useParallax } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const HERO = "https://images.pexels.com/photos/5965952/pexels-photo-5965952.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800";

export default function Seasonal() {
  const now = useNow(30_000);
  const currentId = currentSeasonId(now);
  const [active, setActive] = useState(currentId);
  const season = SEASONS.find((s) => s.id === active) ?? SEASONS[0];
  const imgRef = useParallax<HTMLDivElement>(40);

  const items = useMemo(() => season.items.map((id) => getProduceById(id)).filter(Boolean), [season]);

  return (
    <>
      <PageHero
        label="Seasonal Picks"
        index="04"
        title={
          <>
            What's in <span className="font-script text-lime">Season?</span>
          </>
        }
        intro="Seasonality is the whole point. Here is what growers are picking right now, and what to look forward to next."
        image={HERO}
      >
        <div className="mt-8">
          <Breadcrumbs items={[{ label: "Home", href: "#/" }, { label: "Seasonal Picks" }]} />
        </div>
      </PageHero>

      {/* season switcher */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal variant="up" className="text-center">
            <SectionLabel index="—" className="justify-center">
              Four seasons
            </SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.2rem)] font-semibold text-forest">
              Currently: <span className="font-script" style={{ color: (SEASONS.find((s) => s.id === currentId) ?? SEASONS[0]).accent }}>
                {(SEASONS.find((s) => s.id === currentId) ?? SEASONS[0]).name}
              </span>
            </h2>
          </Reveal>

          <Reveal variant="up" delay={80} className="mt-10">
            <div role="tablist" aria-label="Choose a season" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SEASONS.map((s) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={active === s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-[26px] border p-5 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active === s.id
                      ? "border-transparent text-cream shadow-lift"
                      : "border-forest/10 bg-white text-forest hover:-translate-y-1",
                  )}
                  style={active === s.id ? { background: s.accent } : undefined}
                >
                  <span className="block text-[11px] font-bold uppercase tracking-[0.18em] opacity-70">
                    {s.months}
                  </span>
                  <span className="mt-1 block font-display text-[26px] font-semibold">{s.name}</span>
                  {s.id === currentId && (
                    <span className="mt-2 inline-block rounded-full bg-white/25 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em]">
                      Now
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Reveal>

          {/* season feature */}
          <div
            key={season.id}
            className="animate-pop mt-12 grid overflow-hidden rounded-[40px] lg:grid-cols-2"
            style={{ background: season.tint }}
          >
            <div className="relative min-h-[18rem] overflow-hidden">
              <div ref={imgRef} className="absolute inset-0 scale-110">
                <img src={season.image} alt={`${season.name} produce`} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${season.tint}cc, transparent 70%)` }} />
              <div className="relative flex h-full flex-col justify-end p-7 sm:p-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: season.accent }}>
                  {season.months}
                </p>
                <h3 className="mt-2 font-display text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[0.98] text-forest">
                  {season.name}
                </h3>
                <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-forest/70">{season.note}</p>
              </div>
            </div>

            <div className="p-7 sm:p-10">
              <ul className="space-y-4">
                {items.map((p, i) =>
                  p ? (
                    <li key={p.id}>
                      <a
                        href={`#/produce/${p.id}`}
                        className="group flex items-center gap-5 rounded-[26px] bg-white/80 p-4 transition-all duration-400 hover:-translate-y-1 hover:bg-white hover:shadow-soft"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <ProduceArt
                          name={ART_FOR_ID[p.id] ?? "leaf"}
                          className="h-16 w-auto shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[16px] font-bold text-forest">{p.name}</span>
                          <span className="block text-[12.5px] text-muted">{p.tagline}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Peak</span>
                          <span className="block text-[12.5px] font-semibold text-forest">{p.peak}</span>
                        </span>
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>

              <BtnLink href="#/produce" variant="primary" size="md" className="mt-7" withArrow>
                Full produce guide
              </BtnLink>
            </div>
          </div>

          {/* where to buy this season */}
          <Reveal variant="up" className="mt-16">
            <SectionLabel index="05">Where to find it</SectionLabel>
            <h3 className="mt-4 font-display text-[clamp(1.6rem,3.2vw,2.3rem)] font-semibold text-forest">
              Markets stocking {season.name.toLowerCase()} produce
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from(
                new Set(items.flatMap((p) => (p ? p.markets : []))),
              )
                .slice(0, 6)
                .map((mid) => {
                  const m = getMarketById(mid);
                  if (!m) return null;
                  const st = getMarketStatus(m, now);
                  return (
                    <a
                      key={mid}
                      href={`#/market/${m.id}`}
                      className="group flex items-center gap-4 rounded-[24px] bg-white p-4 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:shadow-lift"
                    >
                      <img src={m.image} alt={m.name} loading="lazy" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] font-bold text-forest">{m.name}</span>
                        <span className="block text-[12px] text-muted">
                          {m.area} · {marketsForProduce(items[0]?.id ?? "tomato").length ? `${m.days.map((d) => d.slice(0, 3)).join("/")}` : ""}
                        </span>
                      </span>
                      <StatusPill status={st.status} message={st.label} />
                    </a>
                  );
                })}
            </div>
          </Reveal>

          {/* year strip */}
          <Reveal variant="up" className="mt-16">
            <div className="overflow-hidden rounded-[36px] bg-forest p-7 sm:p-10">
              <h3 className="font-display text-2xl font-semibold text-cream">The whole year</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {SEASONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className="rounded-3xl border border-cream/12 p-5 text-left transition-all duration-400 hover:border-lime/60 hover:bg-cream/6"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: s.accent }}>
                      {s.months}
                    </span>
                    <span className="mt-1 block font-display text-xl font-semibold text-cream">{s.name}</span>
                    <span className="mt-2 block text-[12.5px] text-cream/60">
                      {s.items.map((i) => getProduceById(i)?.name).filter(Boolean).join(", ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
