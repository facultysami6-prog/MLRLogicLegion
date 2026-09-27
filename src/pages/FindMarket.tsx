import { useState } from "react";
import { MARKETS } from "@/lib/data";
import { QuickFind } from "@/components/QuickFind";
import { PageHero, Btn, Reveal, SectionLabel, StatusPill, Breadcrumbs } from "@/components/ui";
import { MarketsPlot } from "@/components/MapPanel";
import { getMarketStatus } from "@/lib/marketStatus";
import { useNow } from "@/lib/hooks";
import { useApp } from "@/store/AppStore";
import { cn, formatDistance } from "@/lib/utils";

const HERO = "https://images.pexels.com/photos/868110/pexels-photo-868110.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800";

export default function FindMarket() {
  const now = useNow(30_000);
  const { location, locate, locationLabel, distanceTo, clearLocation, toast } = useApp();
  const [activeId, setActiveId] = useState<number | undefined>(MARKETS[0].id);
  const [busy, setBusy] = useState(false);

  const sorted = [...MARKETS].sort((a, b) => {
    const da = distanceTo({ lat: a.lat, lng: a.lng });
    const db = distanceTo({ lat: b.lat, lng: b.lng });
    if (da === null || db === null) return 0;
    return da - db;
  });
  const list = location ? sorted : MARKETS;

  const useLocation = async () => {
    setBusy(true);
    await locate();
    setBusy(false);
  };

  return (
    <>
      <PageHero
        label="Find a Market"
        index="01"
        title={
          <>
            Markets within <span className="font-script text-lime">reach</span>
          </>
        }
        intro="Search by place, day or what you're craving. Switch on location and we sort everything by how far away it is."
        image={HERO}
      >
        <div className="mt-8">
          <Breadcrumbs items={[{ label: "Home", href: "#/" }, { label: "Find a Market" }]} />
        </div>
      </PageHero>

      <QuickFind />

      {/* ---- Markets near you: map + listing ---- */}
      <section className="bg-cream-2 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <Reveal variant="up">
              <SectionLabel index="09">Nearby</SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.04] text-forest">
                Markets <span className="font-script text-leaf">Near You</span>
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                {location
                  ? `Sorted by distance from ${locationLabel}. Nothing is uploaded — your position never leaves the browser.`
                  : "Allow location access to sort by distance, or browse the full plotted list below."}
              </p>
            </Reveal>
            <Reveal variant="up" delay={120} className="flex flex-wrap gap-3">
              <Btn variant={location ? "outline" : "leaf"} onClick={location ? clearLocation : useLocation}>
                {busy ? "Locating…" : location ? `Clear ${locationLabel}` : "◎ Use My Location"}
              </Btn>
              <Btn
                variant="outline"
                onClick={() => toast("Proximity list refreshed", "neutral")}
              >
                Refresh
              </Btn>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal variant="left">
              <MarketsPlot markets={list} now={now} activeId={activeId} onSelect={setActiveId} />
            </Reveal>

            <Reveal variant="right" delay={100}>
              <ul className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
                {list.map((m, i) => {
                  const st = getMarketStatus(m, now);
                  const d = distanceTo({ lat: m.lat, lng: m.lng });
                  const active = activeId === m.id;
                  return (
                    <li key={m.id}>
                      <button
                        onClick={() => setActiveId(m.id)}
                        className={cn(
                          "group flex w-full items-center gap-4 rounded-[24px] border p-4 text-left transition-all duration-400",
                          active
                            ? "border-leaf bg-white shadow-soft"
                            : "border-transparent bg-white/60 hover:border-forest/10 hover:bg-white",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-10 w-10 shrink-0 place-items-center rounded-full text-[13px] font-bold",
                            active ? "bg-forest text-cream" : "bg-cream-2 text-forest",
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-bold text-forest">{m.name}</span>
                          <span className="block truncate text-[12.5px] text-muted">{m.area} · {m.days.map((d2) => d2.slice(0, 3)).join("/")}</span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1.5">
                          <StatusPill status={st.status} message={st.label} />
                          {d !== null && (
                            <span className="text-[11.5px] font-bold text-forest/70">{formatDistance(d)}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
