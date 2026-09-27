import { MARKETS, SEASONS, getMarketById, produceForMarket, currentSeasonId } from "@/lib/data";
import { formatTime, getMarketStatus, getSchedule, DAYS } from "@/lib/marketStatus";
import { distanceKm, formatDistance, shareContent } from "@/lib/utils";
import { useApp } from "@/store/AppStore";
import { useNow } from "@/lib/hooks";
import {
  Breadcrumbs,
  Btn,
  BtnLink,
  Curve,
  LiveClock,
  Reveal,
  SectionLabel,
  StatusPill,
} from "@/components/ui";
import { MarketCard } from "@/components/cards";
import { MarketMapEmbed } from "@/components/MapPanel";
import { ProduceArt, ART_FOR_ID } from "@/components/ProduceArt";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

export default function MarketDetail({ id }: { id?: string }) {
  const market = getMarketById(id ?? "");
  const now = useNow(30_000);
  const { isSaved, toggle, distanceTo, toast, location, locationLabel } = useApp();

  if (!market) return <NotFound />;

  const status = getMarketStatus(market, now);
  const schedule = getSchedule(market, now);
  const stocked = produceForMarket(market.id);
  const season = SEASONS.find((s) => s.id === currentSeasonId(now)) ?? SEASONS[0];
  const key = `market:${market.id}`;
  const saved = isSaved(key);
  const dist = distanceTo({ lat: market.lat, lng: market.lng });

  const nearby = MARKETS.filter((m) => m.id !== market.id)
    .map((m) => ({ m, d: distanceKm(market, { lat: m.lat, lng: m.lng }) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map((x) => x.m);

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative isolate min-h-[78vh] overflow-hidden bg-forest-3">
        <img
          src={market.image}
          alt={`${market.name} market scene`}
          className="absolute inset-0 -z-10 h-full w-full scale-105 object-cover"
          fetchPriority="high"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-3 via-forest-3/55 to-forest-3/40" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-5 pb-24 pt-40 sm:px-8 sm:pb-28">
          <Reveal variant="up">
            <Breadcrumbs
              items={[
                { label: "Home", href: "#/" },
                { label: "Market Directory", href: "#/directory" },
                { label: market.name },
              ]}
            />
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-lime px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-forest">
                {market.area}
              </span>
              <StatusPill status={status.status} message={status.label} glow className="bg-forest-3/60" />
              <span className="text-[12.5px] font-medium text-cream/70">★ {market.rating} · {market.stalls} stalls</span>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.4rem,7vw,5.4rem)] font-semibold leading-[0.98] text-cream">
              {market.name}
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-cream/75 sm:text-[17px]">
              {market.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Btn
                variant={saved ? "leaf" : "light"}
                size="md"
                onClick={() =>
                  toggle({
                    key,
                    type: "market",
                    id: String(market.id),
                    name: market.name,
                    subtitle: `${market.area} · ${market.days.join(", ")}`,
                    image: market.image,
                  })
                }
              >
                {saved ? "♥ Saved" : "♡ Save market"}
              </Btn>
              <Btn
                variant="outline"
                size="md"
                className="border-cream/35 text-cream hover:border-lime hover:bg-lime/12"
                onClick={async () => {
                  const r = await shareContent(
                    market.name,
                    `${market.name} — ${market.area}. ${market.days.join(", ")}, ${formatTime(market.openingTime)} – ${formatTime(market.closingTime)}.`,
                    window.location.href,
                  );
                  toast(r === "copied" ? "Link copied to clipboard" : r === "shared" ? "Thanks for sharing!" : "Sharing unavailable", r === "failed" ? "warn" : "success");
                }}
              >
                ↗ Share
              </Btn>
              <span className="text-[12.5px] text-cream/60">
                <LiveClock />
              </span>
            </div>
          </Reveal>
        </div>
        <Curve fill="var(--color-cream)" className="bottom-0" height={110} />
      </section>

      {/* ---------------- body ---------------- */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_22rem]">
          {/* main column */}
          <div className="space-y-16">
            {/* About */}
            <Reveal variant="up">
              <SectionLabel index="01">About the market</SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight text-forest">
                {market.name.split(" ").slice(0, 2).join(" ")} since {market.established}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
                {market.description} Located at {market.address}. {market.stalls} regular stalls,
                rated {market.rating}/5 by FreshFind visitors.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {market.features.map((f) => (
                  <li
                    key={f}
                    className="inline-flex items-center gap-2 rounded-full border border-forest/12 bg-white px-4 py-2 text-[12.5px] font-semibold text-forest"
                  >
                    <span aria-hidden="true" className="text-leaf">✓</span> {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Weekly schedule */}
            <Reveal variant="up">
              <SectionLabel index="02">Weekly schedule</SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold text-forest">
                When to <span className="font-script text-leaf">visit</span>
              </h2>
              <ul className="mt-6 overflow-hidden rounded-[28px] bg-white shadow-soft">
                {schedule.map((row, i) => (
                  <li
                    key={row.day}
                    className={cn(
                      "flex items-center justify-between gap-4 px-5 py-4 transition-colors sm:px-7",
                      i % 2 && "bg-cream/60",
                      row.isToday && "bg-lime-soft",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-display text-[13px] font-bold uppercase tracking-[0.18em]",
                          row.isToday ? "text-leaf-2" : "text-forest/60",
                        )}
                      >
                        {row.short}
                      </span>
                      {row.isToday && (
                        <span className="rounded-full bg-forest px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-lime">
                          Today
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[14px] font-semibold tabular-nums",
                        row.open ? "text-forest" : "text-muted/70",
                      )}
                    >
                      {row.open ? `${row.open} – ${row.close}` : "Closed"}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12.5px] text-muted">
                Scheduled days: {DAYS.filter((d) => market.days.includes(d)).join(", ")} ·{" "}
                {formatTime(market.openingTime)} – {formatTime(market.closingTime)}
              </p>
            </Reveal>

            {/* What you'll find */}
            <Reveal variant="up">
              <SectionLabel index="03">What you'll find</SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold text-forest">
                On the stalls this week
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {stocked.map((p) => (
                  <a
                    key={p.id}
                    href={`#/produce/${p.id}`}
                    className="group flex items-center gap-4 rounded-[26px] border border-forest/8 bg-white p-4 transition-all duration-400 hover:-translate-y-1 hover:border-leaf/40 hover:shadow-soft"
                  >
                    <ProduceArt
                      name={ART_FOR_ID[p.id] ?? "leaf"}
                      className="h-14 w-auto shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold text-forest">{p.name}</span>
                      <span className="block text-[12.5px] text-muted">
                        {p.category} · peak {p.peak}
                      </span>
                    </span>
                    <span aria-hidden="true" className="ml-auto text-forest/30 transition group-hover:translate-x-1 group-hover:text-leaf">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>

            {/* Seasonal produce */}
            <Reveal variant="up">
              <SectionLabel index="04">Seasonal produce</SectionLabel>
              <div
                className="mt-6 overflow-hidden rounded-[32px] p-7"
                style={{ background: season.tint }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: season.accent }}>
                      {season.months}
                    </p>
                    <h3 className="mt-1 font-display text-[26px] font-semibold text-forest">
                      {season.name} at this market
                    </h3>
                    <p className="mt-2 max-w-md text-[14px] leading-relaxed text-forest/70">{season.note}</p>
                  </div>
                  <div className="flex -space-x-4">
                    {season.items.slice(0, 4).map((pid) => (
                      <ProduceArt
                        key={pid}
                        name={ART_FOR_ID[pid] ?? "leaf"}
                        className="h-20 w-auto drop-shadow-[0_12px_18px_rgba(22,51,31,0.2)]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Location */}
            <Reveal variant="up">
              <SectionLabel index="05">Location</SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold text-forest">
                {market.area}, {market.city}
              </h2>
              <p className="mt-3 text-[15px] text-muted">{market.address}</p>
              <div className="mt-6">
                <MarketMapEmbed market={market} height={380} />
              </div>
            </Reveal>

            {/* Nearby markets */}
            <Reveal variant="up">
              <SectionLabel index="06">Nearby markets</SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold text-forest">
                Also worth the trip
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {nearby.map((m, i) => (
                  <MarketCard key={m.id} market={m} now={now} index={i} />
                ))}
              </div>
            </Reveal>
          </div>

          {/* sidebar */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <Reveal variant="right">
              <div className="overflow-hidden rounded-[32px] bg-forest p-7 text-cream shadow-lift">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold">Opening status</h2>
                  <StatusPill status={status.status} message={status.label} glow />
                </div>
                <p className="mt-3 text-[13.5px] text-cream/70">{status.message}</p>

                <dl className="mt-6 space-y-3 border-t border-cream/12 pt-5 text-[13.5px]">
                  {[
                    ["Today", status.todayHours ?? "Closed"],
                    ["Trading days", market.days.map((d) => d.slice(0, 3)).join(" · ")],
                    ["Hours", `${formatTime(market.openingTime)} – ${formatTime(market.closingTime)}`],
                    ["Neighbourhood", market.area],
                    ["Stalls", String(market.stalls)],
                    ["Since", String(market.established)],
                    ...(dist !== null ? ([["Distance", formatDistance(dist)]] as [string, string][]) : []),
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-4">
                      <dt className="text-cream/55">{k}</dt>
                      <dd className="text-right font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>

                <BtnLink href="#/find" variant="light" size="md" className="mt-7 w-full" withArrow>
                  Find markets near me
                </BtnLink>
                {!location && <p className="mt-3 text-[11.5px] text-cream/45">Enable location for distances ({locationLabel || "off"}).</p>}
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
