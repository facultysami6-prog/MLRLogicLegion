import { useMemo, useState } from "react";
import { AREAS, MARKETS, PRODUCE } from "@/lib/data";
import { DAYS, getMarketStatus } from "@/lib/marketStatus";
import { EMPTY_FILTERS, filterMarkets, sortMarkets, type Filters, type SortKey } from "@/lib/filters";
import { MarketCard } from "@/components/cards";
import { SectionFlourish, FLOURISH_IMAGES } from "@/components/Doodles";
import { MarketsPlot } from "@/components/MapPanel";
import {
  Breadcrumbs,
  Btn,
  LiveClock,
  PageHero,
  Reveal,
  SectionLabel,
  Skeleton,
} from "@/components/ui";
import { useNow } from "@/lib/hooks";
import { useApp } from "@/store/AppStore";
import { cn } from "@/lib/utils";
import { useRoute } from "@/lib/router";

const HERO = "https://images.pexels.com/photos/32465897/pexels-photo-32465897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800";
const CATEGORIES = Array.from(new Set(PRODUCE.map((p) => p.category)));
const SORTS: { key: SortKey; label: string }[] = [
  { key: "next", label: "Next open day" },
  { key: "name", label: "Alphabetical" },
  { key: "distance", label: "Proximity" },
  { key: "rating", label: "Top rated" },
];

export default function Directory() {
  const now = useNow(30_000);
  const route = useRoute();
  const { loading, location, locate, locationLabel } = useApp();

  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    area: route.query.area ?? "",
    day: route.query.day ?? "",
    produce: route.query.produce ?? "",
  });
  const [sort, setSort] = useState<SortKey>("next");
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [mobileFilters, setMobileFilters] = useState(false);

  const set = (k: keyof Filters) => (v: string) => setFilters((f) => ({ ...f, [k]: v }));

  const results = useMemo(
    () => sortMarkets(filterMarkets(MARKETS, filters, now), sort, now, location),
    [filters, now, sort, location],
  );

  const openCount = results.filter((m) => getMarketStatus(m, now).status === "open").length;
  const activeChips = Object.entries(filters).filter(([, v]) => v).length;

  return (
    <>
      <PageHero
        label="Market Directory"
        index="02"
        title={
          <>
            Every market, <span className="font-script text-lime">one list</span>
          </>
        }
        intro="Twelve markets, filtered by neighbourhood, day of the week and produce type. Switch between grid, list and map views."
        image={HERO}
      >
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Breadcrumbs items={[{ label: "Home", href: "#/" }, { label: "Market Directory" }]} />
          <span className="text-[12.5px] font-medium text-cream/70">
            <LiveClock />
          </span>
        </div>
      </PageHero>

      <section className="relative overflow-hidden bg-cream py-16 sm:py-20">
        <SectionFlourish image={FLOURISH_IMAGES.stall} opacity={0.06} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[19rem_1fr]">
            {/* ---------------- filter sidebar ---------------- */}
            <aside aria-label="Filter markets">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center justify-between lg:hidden">
                  <Btn variant="primary" size="sm" onClick={() => setMobileFilters((v) => !v)}>
                    {mobileFilters ? "Hide filters" : `Filters${activeChips ? ` (${activeChips})` : ""}`}
                  </Btn>
                  <span className="text-[12.5px] font-semibold text-muted">{results.length} results</span>
                </div>

                <div className={cn("mt-4 lg:mt-0", mobileFilters ? "block" : "hidden lg:block")}>
                  <div className="rounded-[30px] bg-white p-6 shadow-soft">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl font-semibold text-forest">Filters</h2>
                      {activeChips > 0 && (
                        <button
                          onClick={() => setFilters(EMPTY_FILTERS)}
                          className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-tomato"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* search */}
                    <div className="mt-5">
                      <label htmlFor="ff-dir-q" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-forest/60">
                        Keyword
                      </label>
                      <input
                        id="ff-dir-q"
                        value={filters.q}
                        onChange={(e) => set("q")(e.target.value)}
                        placeholder="berries, honey…"
                        className="w-full rounded-full border border-forest/12 bg-cream px-4 py-2.5 text-[13.5px] outline-none transition focus:border-leaf focus:bg-white"
                      />
                    </div>

                    {/* area */}
                    <fieldset className="mt-6">
                      <legend className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-forest/60">
                        Area
                      </legend>
                      <div className="flex flex-wrap gap-1.5">
                        {AREAS.map((a) => (
                          <button
                            key={a}
                            onClick={() => set("area")(filters.area === a ? "" : a)}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all duration-300",
                              filters.area === a
                                ? "border-leaf bg-leaf text-white"
                                : "border-forest/12 bg-cream text-forest/75 hover:border-leaf/60",
                            )}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* day */}
                    <fieldset className="mt-6">
                      <legend className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-forest/60">
                        Day of week
                      </legend>
                      <div className="grid grid-cols-3 gap-1.5">
                        {DAYS.map((d) => (
                          <button
                            key={d}
                            onClick={() => set("day")(filters.day === d ? "" : d)}
                            className={cn(
                              "rounded-xl border px-2 py-2 text-[11.5px] font-bold uppercase transition-all duration-300",
                              filters.day === d
                                ? "border-forest bg-forest text-cream"
                                : "border-forest/12 bg-cream text-forest/70 hover:border-forest/40",
                            )}
                          >
                            {d.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* produce */}
                    <div className="mt-6">
                      <label htmlFor="ff-dir-produce" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-forest/60">
                        Produce type
                      </label>
                      <select
                        id="ff-dir-produce"
                        value={filters.produce}
                        onChange={(e) => set("produce")(e.target.value)}
                        className="w-full rounded-2xl border border-forest/12 bg-cream px-4 py-2.5 text-[13.5px] outline-none transition focus:border-leaf focus:bg-white"
                      >
                        <option value="">All produce</option>
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <label className="mt-5 flex items-center gap-2.5 rounded-2xl bg-cream px-4 py-3 text-[13px] font-semibold text-forest">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-leaf"
                        checked={filters.status === "open"}
                        onChange={(e) => set("status")(e.target.checked ? "open" : "")}
                      />
                      Open now only
                    </label>

                    <div className="mt-5 border-t border-forest/8 pt-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-forest/60">Sort by</p>
                      <div className="mt-2 space-y-1">
                        {SORTS.map((s) => (
                          <button
                            key={s.key}
                            onClick={() => {
                              setSort(s.key);
                              if (s.key === "distance" && !location) void locate();
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-medium transition",
                              sort === s.key ? "bg-forest text-cream" : "text-forest/75 hover:bg-cream",
                            )}
                          >
                            {s.label}
                            {s.key === "distance" && location && (
                              <span className="text-[10.5px] uppercase tracking-wider text-lime">on</span>
                            )}
                          </button>
                        ))}
                      </div>
                      {location && (
                        <p className="mt-3 text-[11.5px] text-muted">Using {locationLabel} for distances.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* ---------------- results ---------------- */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <SectionLabel index="—">Results</SectionLabel>
                  <p className="mt-2 text-[14px] text-muted">
                    <span className="font-bold text-forest">{results.length}</span> markets
                    {openCount > 0 && (
                      <>
                        {" · "}
                        <span className="font-bold text-leaf-2">{openCount} open now</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-full border border-forest/12 bg-white p-1">
                  {(["grid", "list", "map"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      aria-pressed={view === v}
                      className={cn(
                        "rounded-full px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.1em] transition-all duration-300",
                        view === v ? "bg-forest text-cream" : "text-forest/65 hover:text-forest",
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {view === "map" ? (
                <Reveal variant="up" className="mt-8">
                  <MarketsPlot markets={results.length ? results : MARKETS} now={now} />
                </Reveal>
              ) : loading ? (
                <div className={cn("mt-8 grid gap-6", view === "grid" ? "sm:grid-cols-2" : "")}>
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className={view === "grid" ? "h-[26rem]" : "h-52"} />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="mt-8 rounded-[32px] border border-dashed border-forest/20 bg-white/60 p-12 text-center">
                  <p className="font-display text-2xl font-semibold text-forest">No markets match</p>
                  <p className="mt-2 text-[14px] text-muted">Try clearing a filter or two.</p>
                  <Btn variant="outline" size="md" className="mt-5" onClick={() => setFilters(EMPTY_FILTERS)}>
                    Reset filters
                  </Btn>
                </div>
              ) : (
                <div className={cn("mt-8 grid gap-6", view === "grid" ? "sm:grid-cols-2" : "")}>
                  {results.map((m, i) => (
                    <Reveal key={m.id} variant="up" delay={Math.min(i, 5) * 60}>
                      <MarketCard market={m} now={now} variant={view === "grid" ? "grid" : "list"} index={i} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
