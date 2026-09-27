import { useMemo, useState } from "react";
import { AREAS, MARKETS, PRODUCE } from "@/lib/data";
import { DAYS, getMarketStatus } from "@/lib/marketStatus";
import { EMPTY_FILTERS, filterMarkets, sortMarkets, type Filters, type SortKey } from "@/lib/filters";
import { formatDistance, cn } from "@/lib/utils";
import { useApp } from "@/store/AppStore";
import { useNow } from "@/lib/hooks";
import { MarketCard } from "./cards";
import { SectionFlourish, FLOURISH_IMAGES } from "./Doodles";
import { Btn, Reveal, SectionLabel, StatusPill } from "./ui";

const PRODUCE_OPTIONS = Array.from(new Set(PRODUCE.map((p) => p.category)));

/**
 * "Find Fresh Near You" — the SRS Quick Find module.
 * Filters by area / day / produce, supports browser geolocation and
 * updates results dynamically as the user types.
 */
export function QuickFind({ compact = false }: { compact?: boolean }) {
  const now = useNow(30_000);
  const { data, locate, location, locationLabel, clearLocation, toast } = useApp();
  const markets = data?.markets ?? MARKETS;

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("next");
  const [submitted, setSubmitted] = useState(false);
  const [locating, setLocating] = useState(false);

  const set = (k: keyof Filters) => (v: string) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setSubmitted(true);
  };

  const results = useMemo(() => {
    const base = filterMarkets(markets, filters, now);
    return sortMarkets(base, sort, now, location);
  }, [markets, filters, now, sort, location]);

  const showing = submitted || !compact ? results : results.slice(0, 6);
  const activeCount = Object.values(filters).filter(Boolean).length;

  const useMyLocation = async () => {
    setLocating(true);
    await locate();
    setLocating(false);
    setSort("distance");
    setSubmitted(true);
  };

  return (
    <section id="quick-find" className="relative scroll-mt-24 bg-cream py-20 sm:py-28">
      <SectionFlourish image={FLOURISH_IMAGES.market} opacity={0.08} />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* ---------- heading + controls ---------- */}
          <div className="lg:pt-4">
            <Reveal variant="up">
              <SectionLabel index="02">Quick Find</SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] text-forest">
                Find Fresh
                <br />
                <span className="font-script text-leaf">Near You</span>
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                Discover local markets by place, day or what you're craving. Live opening status is
                calculated from your device clock.
              </p>
            </Reveal>

            <Reveal variant="up" delay={120} className="mt-8 flex flex-wrap gap-3">
              <Btn
                variant={location ? "leaf" : "outline"}
                size="md"
                onClick={location ? clearLocation : useMyLocation}
                className={cn(location && "cursor-default")}
              >
                {locating
                  ? "Locating…"
                  : location
                    ? `📍 ${locationLabel} · clear`
                    : "◎ Use My Location"}
              </Btn>
              {activeCount > 0 && (
                <Btn
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setFilters(EMPTY_FILTERS);
                    setSubmitted(true);
                    toast("Filters cleared");
                  }}
                >
                  Reset filters
                </Btn>
              )}
            </Reveal>
          </div>

          {/* ---------- search panel ---------- */}
          <Reveal variant="right" delay={100}>
            <div className="rounded-[34px] bg-white p-5 shadow-soft sm:p-7">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Area / neighbourhood">
                  <input
                    list="ff-areas"
                    value={filters.area}
                    onChange={(e) => set("area")(e.target.value)}
                    placeholder="e.g. Riverside"
                    className={inputCls}
                    aria-label="Area or neighbourhood"
                  />
                  <datalist id="ff-areas">
                    {AREAS.map((a) => (
                      <option key={a} value={a} />
                    ))}
                  </datalist>
                </Field>

                <Field label="Day of week">
                  <select
                    value={filters.day}
                    onChange={(e) => set("day")(e.target.value)}
                    className={inputCls}
                    aria-label="Day of week"
                  >
                    <option value="">Any day</option>
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Produce type">
                  <select
                    value={filters.produce}
                    onChange={(e) => set("produce")(e.target.value)}
                    className={inputCls}
                    aria-label="Produce type"
                  >
                    <option value="">Anything fresh</option>
                    {PRODUCE_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="flex-1">
                  <span className="sr-only">Search by keyword</span>
                  <input
                    value={filters.q}
                    onChange={(e) => set("q")(e.target.value)}
                    placeholder="Search honey, berries, sourdough…"
                    className={inputCls}
                    aria-label="Search by keyword"
                  />
                </label>
                <label className="flex items-center gap-2 rounded-full border border-forest/12 px-4 py-3 text-[13px] font-semibold text-forest">
                  <input
                    type="checkbox"
                    checked={filters.status === "open"}
                    onChange={(e) => set("status")(e.target.checked ? "open" : "")}
                    className="h-4 w-4 accent-leaf"
                  />
                  Open now
                </label>
                <Btn variant="primary" size="md" withArrow onClick={() => setSubmitted(true)}>
                  Find Markets
                </Btn>
              </div>

              <p className="mt-4 text-[12.5px] text-muted">
                <span className="font-bold text-forest">{results.length}</span> market
                {results.length === 1 ? "" : "s"} found
                {location && sort === "distance" && " · sorted by distance"}
              </p>
            </div>
          </Reveal>
        </div>

        {/* ---------- results ---------- */}
        <div className="mt-12">
          {showing.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-forest/20 bg-white/60 p-12 text-center">
              <p className="font-display text-2xl font-semibold text-forest">No markets match yet</p>
              <p className="mt-2 text-[14px] text-muted">
                Try a different day, or clear your filters to see all 12 markets.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {showing.map((m, i) => (
                <Reveal key={m.id} variant="up" delay={Math.min(i, 6) * 70} className="h-full">
                  <MarketCard market={m} now={now} index={i} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * "Fresh Finds Happening Now" — 3D rotating market wheel
 * ------------------------------------------------------------------ */
const WHEEL_ACCENTS = [
  "var(--color-leaf)",
  "var(--color-lime)",
  "var(--color-forest-2)",
];

export function MarketWheel() {
  const now = useNow(30_000);
  const { distanceTo } = useApp();

  const withStatus = MARKETS.map((m) => ({ m, st: getMarketStatus(m, now) }));
  const open = withStatus.filter((x) => x.st.status === "open" || x.st.status === "opening-soon");
  // Show open markets first, then fill up to 6 with the rest so the wheel
  // always has enough cards to space out evenly (never 1 or 2).
  const rest = withStatus.filter((x) => !open.includes(x));
  const items = [...open, ...rest].slice(0, Math.min(6, withStatus.length));
  const n = Math.max(items.length, 3);

  // Evenly space cards around the wheel so they never overlap, at two card sizes.
  const desktopW = 300;
  const mobileW = 200;
  const radiusFor = (w: number) => Math.round((w / 2 / Math.sin(Math.PI / n)) * 1.08);

  return (
    <div
      className="market-wheel h-[480px] sm:h-[560px]"
      style={
        {
          "--wheel-radius-desktop": `${radiusFor(desktopW)}px`,
          "--wheel-radius-mobile": `${radiusFor(mobileW)}px`,
        } as React.CSSProperties
      }
    >
      <div className="market-wheel-inner" style={{ "--quantity": n } as React.CSSProperties}>
        {items.map(({ m, st }, i) => {
          const accent = WHEEL_ACCENTS[i % WHEEL_ACCENTS.length];
          const dist = distanceTo({ lat: m.lat, lng: m.lng });
          return (
            <article
              key={m.id}
              className="market-wheel-card overflow-hidden bg-white shadow-lift"
              style={{ "--index": i } as React.CSSProperties}
            >
              <div className="flex h-full flex-col">
                <div
                  className="relative shrink-0 border-b border-forest/8 bg-white px-5 pb-5 pt-5 sm:pb-6 sm:pt-6"
                  style={{ borderRadius: "0 0 46% 46% / 0 0 26px 26px" }}
                >
                  <span className="block truncate text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
                    {m.area}
                  </span>
                  <span className="mt-1 block truncate font-display text-[17px] font-semibold text-forest sm:text-[20px]">
                    {m.name}
                  </span>
                </div>

                <div className="relative -mt-4 px-4">
                  <div className="aspect-[16/11] w-full overflow-hidden rounded-2xl shadow-soft">
                    <img
                      src={m.image}
                      alt={`${m.name}, ${m.area}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3 px-4.5 pb-4.5 pt-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <StatusPill status={st.status} message={st.label} />
                    {dist !== null && (
                      <span className="shrink-0 text-[11.5px] font-bold text-muted">{formatDistance(dist)}</span>
                    )}
                  </div>

                  <div className="hidden flex-wrap gap-1.5 sm:flex">
                    {m.days.slice(0, 3).map((d) => (
                      <span
                        key={d}
                        className="rounded-full border border-forest/12 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-forest/70"
                      >
                        {d.slice(0, 3)}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`#/market/${m.id}`}
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-full py-3 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-transform active:scale-95"
                    style={{ background: accent }}
                  >
                    View Market <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-full border border-forest/12 bg-cream px-5 py-3.5 text-[14px] text-forest placeholder:text-muted/60 outline-none transition-all duration-300 focus:border-leaf focus:bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-forest/60">
        {label}
      </span>
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ *
 * "Fresh Finds Happening Now" — open now rail
 * ------------------------------------------------------------------ */
export function OpenNowRail() {
  const now = useNow(30_000);
  const markets = MARKETS;
  const { distanceTo } = useApp();

  const open = markets
    .map((m) => ({ m, st: getMarketStatus(m, now) }))
    .filter((x) => x.st.status === "open" || x.st.status === "opening-soon")
    .sort((a, b) => (a.st.status === "open" ? -1 : 1) - (b.st.status === "open" ? -1 : 1));

  const list = open.length ? open : markets.map((m) => ({ m, st: getMarketStatus(m, now) }));

  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-3">
      {list.slice(0, 6).map(({ m, st }, i) => (
        <Reveal key={m.id} variant="up" delay={i * 80} className="w-[82vw] shrink-0 snap-start sm:w-auto">
          <article className="group relative h-full overflow-hidden rounded-[30px] bg-white p-3 shadow-soft transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-lift">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px]">
              <img
                src={m.image}
                alt={`${m.name}, ${m.area}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-3/70 to-transparent" />
              <div className="absolute left-3 top-3">
                <StatusPill status={st.status} message={st.label} glow />
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="rounded-full bg-cream/92 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-forest">
                  {m.area}
                </span>
                <span className="rounded-full bg-forest-3/65 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-lime backdrop-blur">
                  {st.message}
                </span>
              </div>
            </div>
            <div className="px-2 pb-1 pt-4">
              <h3 className="font-display text-[19px] font-semibold text-forest">{m.name}</h3>
              <p className="mt-1.5 text-[12.5px] text-muted">
                {m.days.map((d) => d.slice(0, 3)).join(" · ")}
                {distanceTo({ lat: m.lat, lng: m.lng }) !== null &&
                  ` · ${formatDistance(distanceTo({ lat: m.lat, lng: m.lng })!)}`}
              </p>
              <a
                href={`#/market/${m.id}`}
                className="mt-3 inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-forest transition group-hover:text-leaf-2"
              >
                View Market <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
