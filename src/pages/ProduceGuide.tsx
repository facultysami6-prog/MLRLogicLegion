import { useMemo, useState } from "react";
import { PRODUCE, PRODUCE_CATEGORIES, marketsForProduce } from "@/lib/data";
import { ProduceCard } from "@/components/cards";
import { ProduceArt, ART_FOR_ID } from "@/components/ProduceArt";
import { SectionFlourish, FLOURISH_IMAGES } from "@/components/Doodles";
import { Breadcrumbs, PageHero, Reveal, SectionLabel } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useRoute } from "@/lib/router";

const HERO = "https://images.pexels.com/photos/4589144/pexels-photo-4589144.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800";

export default function ProduceGuide() {
  const route = useRoute();
  const [active, setActive] = useState<string>(route.query.category ?? "All");

  const items = useMemo(
    () => (active === "All" ? PRODUCE : PRODUCE.filter((p) => p.category === active)),
    [active],
  );

  return (
    <>
      <PageHero
        label="Produce Guide"
        index="03"
        title={
          <>
            Know your <span className="font-script text-lime">produce</span>
          </>
        }
        intro="Eight categories, sixteen guides. Each one tells you when it peaks, where it comes from, how to store it and exactly which markets are stocking it."
        image={HERO}
      >
        <div className="mt-8">
          <Breadcrumbs items={[{ label: "Home", href: "#/" }, { label: "Produce Guide" }]} />
        </div>
      </PageHero>

      {/* editorial composition — oversized overlapping artwork */}
      <section className="relative overflow-hidden bg-cream py-16 sm:py-24">
        <SectionFlourish image={FLOURISH_IMAGES.harvest} opacity={0.07} />
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-full lg:block">
          <ProduceArt
            name="avocado"
            aria-hidden="true"
            className="animate-float-slow absolute -left-16 top-10 w-52 opacity-90"
          />
          <ProduceArt
            name="tomato"
            aria-hidden="true"
            className="animate-float absolute right-[6%] top-40 w-40 opacity-90"
          />
          <ProduceArt
            name="lemon"
            aria-hidden="true"
            className="animate-float-slow absolute bottom-10 left-[12%] w-44 opacity-80"
          />
          <ProduceArt
            name="basil"
            aria-hidden="true"
            className="animate-float absolute bottom-0 right-[18%] w-40 opacity-80"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal variant="up">
              <SectionLabel index="—" className="justify-center">
                Eight categories
              </SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.05] text-forest">
                Everything the market has, <span className="font-script text-leaf">explained</span>
              </h2>
            </Reveal>
          </div>

          {/* category filter */}
          <Reveal variant="up" delay={80} className="mt-10">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
              {["All", ...PRODUCE_CATEGORIES].map((c) => {
                const count = c === "All" ? PRODUCE.length : PRODUCE.filter((p) => p.category === c).length;
                return (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    aria-pressed={active === c}
                    className={cn(
                      "group flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-bold transition-all duration-400",
                      active === c
                        ? "border-forest bg-forest text-cream"
                        : "border-forest/12 bg-white text-forest/70 hover:border-leaf hover:text-forest",
                    )}
                  >
                    {c}
                    <span
                      className={cn(
                        "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px]",
                        active === c ? "bg-lime text-forest" : "bg-cream-2 text-forest/60",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, i) => (
              <Reveal key={item.id} variant="up" delay={Math.min(i, 7) * 60}>
                <ProduceCard item={item} index={i} />
              </Reveal>
            ))}
          </div>

          {items.length === 0 && (
            <p className="mt-10 text-center text-muted">No produce in this category yet.</p>
          )}

          {/* availability strip */}
          <Reveal variant="up" className="mt-16">
            <div className="grid gap-4 rounded-[36px] bg-forest p-7 sm:grid-cols-3 sm:p-10">
              {[
                ["16", "produce guides"],
                ["12", "markets stocking them"],
                ["4", "seasons mapped"],
              ].map(([n, l]) => (
                <div key={l} className="text-center sm:text-left">
                  <p className="font-display text-4xl font-semibold text-lime">{n}</p>
                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.18em] text-cream/60">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* quick availability list */}
          <Reveal variant="up" className="mt-14">
            <h3 className="font-display text-2xl font-semibold text-forest">Where everything is stocked</h3>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {PRODUCE.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[13.5px] shadow-soft"
                >
                  <ProduceArt name={ART_FOR_ID[p.id] ?? "leaf"} className="h-8 w-auto" />
                  <a href={`#/produce/${p.id}`} className="font-bold text-forest hover:text-leaf-2">
                    {p.name}
                  </a>
                  <span className="ml-auto text-[12px] text-muted">
                    {marketsForProduce(p.id).length} markets
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
