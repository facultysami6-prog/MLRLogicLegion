import { Hero, Ticker } from "@/components/Hero";
import { MarketWheel, QuickFind } from "@/components/QuickFind";
import {
  AvocadoFeature,
  ChooseYourFind,
  CounterStrip,
  FeaturedProduceSlider,
  FreshAllAlong,
  FreshPicks,
  Growers,
  MadeWithLove,
  SeasonalTeaser,
  Testimonials,
} from "@/components/Sections";
import { BtnLink, Reveal, SectionLabel } from "@/components/ui";
import { useNow } from "@/lib/hooks";
import { MARKETS } from "@/lib/data";
import { getMarketStatus } from "@/lib/marketStatus";

export default function Home() {
  const now = useNow(30_000);
  const openCount = MARKETS.filter((m) => getMarketStatus(m, now).status === "open").length;

  return (
    <>
      <Hero />
      <Ticker />

      {/* 06 — Quick find */}
      <QuickFind compact />

      {/* 07 — Open right now */}
      <section className="relative overflow-hidden bg-cream-2 py-20 sm:py-28">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <Reveal variant="up">
              <SectionLabel index="02.5">Live</SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.02] text-forest">
                Fresh Finds <span className="font-script text-leaf">Happening Now</span>
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                {openCount > 0
                  ? `${openCount} market${openCount === 1 ? " is" : "s are"} trading right now. Status is recalculated every 30 seconds from your device clock.`
                  : "No markets are trading at this exact moment — here are the next ones to open."}
              </p>
            </Reveal>
            <Reveal variant="up" delay={120}>
              <BtnLink href="#/directory" variant="primary" size="md" withArrow>
                All 12 markets
              </BtnLink>
            </Reveal>
          </div>

          <div className="mt-12">
            <MarketWheel />
          </div>
        </div>
      </section>

      <ChooseYourFind />
      <FeaturedProduceSlider />
      <AvocadoFeature />
      <FreshPicks />
      <SeasonalTeaser />
      <FreshAllAlong />
      <Growers />
      <Testimonials />
      <CounterStrip />
      <MadeWithLove />
    </>
  );
}
