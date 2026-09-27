import { getProduceById, marketsForProduce, PRODUCE } from "@/lib/data";
import { getMarketStatus } from "@/lib/marketStatus";
import { shareContent } from "@/lib/utils";
import { useApp } from "@/store/AppStore";
import { useNow, useScrollProgress } from "@/lib/hooks";
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
import { ProduceArt, ART_FOR_ID } from "@/components/ProduceArt";
import NotFound from "./NotFound";

export default function ProduceDetail({ id }: { id?: string }) {
  const item = getProduceById(id ?? "");
  const now = useNow(30_000);
  const { isSaved, toggle, toast } = useApp();
  const artRef = useScrollProgress<HTMLDivElement>();

  if (!item) return <NotFound />;

  const markets = marketsForProduce(item.id);
  const key = `produce:${item.id}`;
  const saved = isSaved(key);
  const related = PRODUCE.filter(
    (p) => p.id !== item.id && (p.category === item.category || item.pairs.includes(p.name)),
  ).slice(0, 3);

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden bg-forest-3">
        <div className="absolute inset-0 -z-10">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover opacity-55" fetchPriority="high" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-forest-3/92 via-forest-3/70 to-forest-3/50" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40"
            style={{ background: `radial-gradient(80% 60% at 75% 20%, ${item.color}55, transparent 70%)` }}
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-28 pt-40 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] sm:pb-32">
          <Reveal variant="up">
            <Breadcrumbs
              items={[
                { label: "Home", href: "#/" },
                { label: "Produce Guide", href: "#/produce" },
                { label: item.name },
              ]}
            />
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-lime">
              {item.category}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[0.94] text-cream">
              {item.name}
            </h1>
            <p className="mt-5 max-w-xl font-display text-[19px] italic leading-snug text-cream/85 sm:text-[23px]">
              “{item.tagline}”
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn
                variant={saved ? "leaf" : "light"}
                size="md"
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
              >
                {saved ? "♥ Saved" : "♡ Save produce"}
              </Btn>
              <Btn
                variant="outline"
                size="md"
                className="border-cream/35 text-cream hover:border-lime hover:bg-lime/12"
                onClick={async () => {
                  const r = await shareContent(item.name, item.tagline, window.location.href);
                  toast(r === "copied" ? "Link copied" : r === "shared" ? "Shared!" : "Sharing unavailable", r === "failed" ? "warn" : "success");
                }}
              >
                ↗ Share
              </Btn>
            </div>
            <p className="mt-6 text-[12.5px] text-cream/55">
              <LiveClock />
            </p>
          </Reveal>

          {/* oversized artwork that scales on scroll */}
          <div ref={artRef} className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute h-64 w-64 rounded-full opacity-35 blur-3xl"
              style={{ background: item.color }}
            />
            <ProduceArt
              name={ART_FOR_ID[item.id] ?? "leaf"}
              className="animate-float-slow relative h-72 w-auto drop-shadow-[0_36px_50px_rgba(0,0,0,0.5)] sm:h-[26rem]"
              style={{ transform: "scale(calc(0.88 + var(--p, 0) * 0.2))" } as React.CSSProperties}
            />
          </div>
        </div>
        <Curve fill="var(--color-cream)" className="bottom-0" height={110} />
      </section>

      {/* facts */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
            <div className="space-y-14">
              <Reveal variant="up">
                <SectionLabel index="01">The short version</SectionLabel>
                <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-forest/85">
                  {item.description}
                </p>
              </Reveal>

              <Reveal variant="up">
                <SectionLabel index="02">How to buy, store &amp; cook it</SectionLabel>
                <ul className="mt-5 space-y-3">
                  {item.tips.map((t, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 rounded-[24px] bg-white p-5 shadow-soft transition-transform duration-400 hover:-translate-y-0.5"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime text-[13px] font-bold text-forest">
                        {i + 1}
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-forest/85">{t}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal variant="up">
                <SectionLabel index="03">Available at these markets</SectionLabel>
                <h2 className="mt-4 font-display text-[clamp(1.6rem,3.2vw,2.3rem)] font-semibold text-forest">
                  {markets.length} market{markets.length === 1 ? "" : "s"} stocking {item.name}
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {markets.map((m, i) => (
                    <MarketCard key={m.id} market={m} now={now} index={i} />
                  ))}
                </div>
              </Reveal>

              {related.length > 0 && (
                <Reveal variant="up">
                  <SectionLabel index="04">Goes well with</SectionLabel>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {related.map((r) => (
                      <a
                        key={r.id}
                        href={`#/produce/${r.id}`}
                        className="group rounded-[28px] bg-white p-5 text-center shadow-soft transition-all duration-400 hover:-translate-y-1.5 hover:shadow-lift"
                      >
                        <ProduceArt
                          name={ART_FOR_ID[r.id] ?? "leaf"}
                          className="mx-auto h-20 w-auto transition-transform duration-500 group-hover:scale-110"
                        />
                        <p className="mt-3 font-display text-lg font-semibold text-forest">{r.name}</p>
                        <p className="text-[12px] text-muted">{r.peak}</p>
                      </a>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* sidebar */}
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <Reveal variant="right">
                <div className="rounded-[32px] bg-forest p-7 text-cream shadow-lift">
                  <h2 className="font-display text-xl font-semibold">At a glance</h2>
                  <dl className="mt-5 space-y-3 text-[13.5px]">
                    {[
                      ["Category", item.category],
                      ["Season", item.season.join(" · ")],
                      ["Peak", item.peak],
                      ["Origin", item.origin],
                      ["Markets", `${markets.length} markets`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-cream/10 pb-3">
                        <dt className="text-cream/55">{k}</dt>
                        <dd className="text-right font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.16em] text-lime">Pairs with</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.pairs.map((p) => (
                      <span key={p} className="rounded-full bg-cream/10 px-3 py-1.5 text-[12px] font-semibold text-cream/85">
                        {p}
                      </span>
                    ))}
                  </div>

                  <BtnLink href="#/directory" variant="light" size="md" className="mt-7 w-full" withArrow>
                    Browse all markets
                  </BtnLink>
                </div>
              </Reveal>

              <Reveal variant="up" delay={100} className="mt-6 rounded-[32px] bg-cream-2 p-6">
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-muted">Open now</p>
                <ul className="mt-3 space-y-2">
                  {markets.slice(0, 4).map((m) => {
                    const st = getMarketStatus(m, now);
                    return (
                      <li key={m.id} className="flex items-center justify-between gap-3">
                        <a href={`#/market/${m.id}`} className="truncate text-[13px] font-semibold text-forest hover:text-leaf-2">
                          {m.name}
                        </a>
                        <StatusPill status={st.status} message={st.label} />
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
