import { FARMERS } from "@/lib/data";
import { Growers } from "@/components/Sections";
import { ProduceArt } from "@/components/ProduceArt";
import { SectionFlourish, FLOURISH_IMAGES } from "@/components/Doodles";
import { Breadcrumbs, BtnLink, MaskedHeading, PageHero, Reveal, SectionLabel } from "@/components/ui";
import { useParallax } from "@/lib/hooks";

const HERO = "https://images.pexels.com/photos/868110/pexels-photo-868110.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800";
const STORY_1 = "https://images.pexels.com/photos/2158060/pexels-photo-2158060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200";
const STORY_2 = "https://images.pexels.com/photos/1334131/pexels-photo-1334131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200";

const TEAM = [
  { name: "Noor Haddad", role: "Founder", initials: "NH", tint: "#3F7D2B", bio: "Grew up on a market stall. Built FreshFind after one too many Saturdays driving to find nothing." },
  { name: "Ellis Vaughn", role: "Head of Grower Relations", initials: "EV", tint: "#E14B32", bio: "Visits every market we list. Knows which stall has the best runner beans and on which day." },
  { name: "Mira Oyelaran", role: "Product & Design", initials: "MO", tint: "#5C7FBF", bio: "Believes a directory can be beautiful. Responsible for every curve you scroll past." },
  { name: "Jonah Weiss", role: "Data & Seasonality", initials: "JW", tint: "#F2A03D", bio: "Turns harvest calendars into the season tables that decide what you cook this week." },
];

const VALUES = [
  { n: "01", title: "Short chains", copy: "The shorter the distance between field and kitchen, the better everything tastes. We optimise for that, always." },
  { n: "02", title: "Season first", copy: "We don't list produce out of its natural window. If it isn't in season here, we say so." },
  { n: "03", title: "Named growers", copy: "Every market tells you who grew the food. Anonymity is how quality disappears." },
  { n: "04", title: "Honest status", copy: "Opening hours are checked, not assumed. Live status is calculated on your device, not cached in ours." },
];

export default function About() {
  const p1 = useParallax<HTMLDivElement>(45);
  const p2 = useParallax<HTMLDivElement>(-35);

  return (
    <>
      <PageHero
        label="About FreshFind"
        index="05"
        title={
          <>
            Fresh Food. Local People.{" "}
            <span className="font-script text-lime">Better Discoveries.</span>
          </>
        }
        intro="We started FreshFind because good food is almost always grown closer than you think — you just need to know where to look."
        image={HERO}
      >
        <div className="mt-8">
          <Breadcrumbs items={[{ label: "Home", href: "#/" }, { label: "About" }]} />
        </div>
      </PageHero>

      {/* ---------- story ---------- */}
      <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
        <SectionFlourish image={FLOURISH_IMAGES.market} opacity={0.07} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div className="relative">
            <Reveal variant="left">
              <div ref={p1} className="overflow-hidden rounded-[36px] shadow-lift">
                <img
                  src={STORY_1}
                  alt="A grower harvesting in the early morning"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal variant="right" delay={140}>
              <div ref={p2} className="absolute -bottom-10 -right-4 w-1/2 overflow-hidden rounded-[30px] border-[6px] border-cream shadow-lift sm:-right-10">
                <img
                  src={STORY_2}
                  alt="A table of fresh fruit, bread and flowers"
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </Reveal>
            <ProduceArt
              name="avocado"
              aria-hidden="true"
              className="animate-float-slow absolute -left-10 top-1/2 hidden w-28 drop-shadow-[0_20px_30px_rgba(22,51,31,0.3)] lg:block"
            />
          </div>

          <div>
            <Reveal variant="up">
              <SectionLabel index="01">Why we exist</SectionLabel>
              <MaskedHeading
                delay={60}
                lines={[
                  <>
                    The best food is usually{" "}
                    <span className="font-script text-leaf">close by</span>
                  </>,
                ]}
                className="mt-4 font-display text-[clamp(1.9rem,4.2vw,3rem)] font-semibold leading-[1.06] text-forest"
              />
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
                <p>
                  In 2019 we drove to three different “farmers markets” in one Saturday and found two
                  of them closed. The information existed — it was just scattered across noticeboards,
                  social posts and a dozen stale listings.
                </p>
                <p>
                  FreshFind pulls it into one place: which markets trade when, what's actually in
                  season, which grower brought it, and how far you have to travel. Twelve markets,
                  sixteen produce guides, six growers — all mapped, all checked, all local.
                </p>
                <p>
                  No warehouse, no middle layer. Just the shortest possible route from the field to
                  your kitchen.
                </p>
              </div>
              <div className="mt-8">
                <BtnLink href="#/directory" variant="leaf" size="md" withArrow>
                  Explore the markets
                </BtnLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- values ---------- */}
      <section className="relative overflow-hidden bg-forest py-20 sm:py-28">
        <ProduceArt
          name="leaf"
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute -right-8 top-16 hidden w-40 opacity-20 lg:block"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal variant="up">
            <SectionLabel index="02" tone="light">
              Our values
            </SectionLabel>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.04] text-cream">
              Four rules we don't <span className="font-script text-lime">break</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.n} variant="up" delay={i * 90}>
                <article className="group h-full rounded-[30px] border border-cream/12 bg-cream/5 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-lime/50 hover:bg-cream/10">
                  <span className="font-display text-4xl font-semibold text-cream/18">{v.n}</span>
                  <h3 className="mt-3 font-display text-[21px] font-semibold text-cream">{v.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-cream/65">{v.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- team ---------- */}
      <section className="bg-cream-2 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal variant="up" className="text-center">
            <SectionLabel index="03" className="justify-center">
              The team
            </SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.2rem)] font-semibold text-forest">
              The people behind the <span className="font-script text-leaf">listings</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} variant="up" delay={i * 80}>
                <article className="group h-full rounded-[32px] bg-white p-6 text-center shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift">
                  <span
                    className="mx-auto grid h-20 w-20 place-items-center rounded-full font-display text-2xl font-bold text-white transition-transform duration-500 group-hover:scale-105"
                    style={{ background: m.tint }}
                    aria-hidden="true"
                  >
                    {m.initials}
                  </span>
                  <h3 className="mt-5 font-display text-[19px] font-semibold text-forest">{m.name}</h3>
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-leaf-2">{m.role}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">{m.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Growers />

      {/* ---------- stats ---------- */}
      <section className="bg-cream pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal variant="up">
            <div className="grid gap-6 rounded-[40px] bg-forest p-8 sm:grid-cols-4 sm:p-12">
              {[
                ["12", "Markets listed"],
                ["6", "Partner growers"],
                ["40mi", "Average food miles"],
                ["2019", "Founded"],
              ].map(([n, l]) => (
                <div key={l} className="text-center sm:text-left">
                  <p className="font-display text-4xl font-semibold text-lime">{n}</p>
                  <p className="mt-1.5 text-[12px] font-bold uppercase tracking-[0.18em] text-cream/60">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <p className="mt-8 text-center text-[13px] text-muted">
            {FARMERS.length} of our growers are featured —{" "}
            <a href="#/contact" className="font-semibold text-forest underline-offset-2 hover:underline">
              talk to us about joining
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
