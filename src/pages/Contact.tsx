import { useState } from "react";
import { MARKETS, SITE, getMarketById } from "@/lib/data";
import { MarketMapEmbed } from "@/components/MapPanel";
import { Breadcrumbs, Btn, PageHero, Reveal, SectionLabel, StatusPill } from "@/components/ui";
import { ProduceArt } from "@/components/ProduceArt";
import { SectionFlourish, FLOURISH_IMAGES } from "@/components/Doodles";
import { getMarketStatus } from "@/lib/marketStatus";
import { useNow } from "@/lib/hooks";
import { useApp } from "@/store/AppStore";
import type { Market } from "@/lib/types";

const HERO = "https://images.pexels.com/photos/1334131/pexels-photo-1334131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800";

/** FreshFind HQ, shaped as a Market so the map component can render it. */
const HQ: Market = {
  id: 0,
  name: "FreshFind HQ",
  area: "Bloomfield",
  city: "Portland",
  address: SITE.address,
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  openingTime: "09:00",
  closingTime: "18:00",
  produce: [],
  categories: [],
  image: HERO,
  lat: 45.46,
  lng: -122.556,
  rating: 5,
  stalls: 0,
  established: 2019,
  description: SITE.tagline,
  features: ["Studio above the baker's row"],
};

export default function Contact() {
  const now = useNow(30_000);
  const { toast, location } = useApp();
  const [form, setForm] = useState({ name: "", email: "", topic: "General", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nearest = (location ? MARKETS : MARKETS.slice(0, 4)).slice(0, 4);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const trimmedName = form.name.trim();
    const NAME_PATTERN = /^[A-Za-z\u00C0-\u024F\u0900-\u097F' -]+$/;
    if (trimmedName.length < 2) {
      errs.name = "Please tell us your name.";
    } else if (!NAME_PATTERN.test(trimmedName)) {
      errs.name = "Name can only contain letters — no numbers or symbols.";
    }
    if (!form.email.includes("@")) errs.email = "A valid email, please.";
    if (form.message.trim().length < 10) errs.message = "A little more detail would help.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    toast(`Thanks ${form.name.split(" ")[0]} — message queued locally 🌿`);
    setForm({ name: "", email: "", topic: "General", message: "" });
  };

  return (
    <>
      <PageHero
        label="Contact"
        index="06"
        title={
          <>
            Come say <span className="font-script text-lime">hello</span>
          </>
        }
        intro="Questions about a market, a listing or the season? We answer every message — usually before the Saturday rush."
        image={HERO}
      >
        <div className="mt-8">
          <Breadcrumbs items={[{ label: "Home", href: "#/" }, { label: "Contact" }]} />
        </div>
      </PageHero>

      <section className="relative overflow-hidden bg-cream py-16 sm:py-24">
        <SectionFlourish image={FLOURISH_IMAGES.harvest} opacity={0.07} />
        <ProduceArt
          name="honey"
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute right-[4%] top-24 hidden w-32 opacity-50 lg:block"
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          {/* contact details */}
          <div>
            <Reveal variant="up">
              <SectionLabel index="01">Details</SectionLabel>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold leading-tight text-forest">
                The FreshFind studio
              </h2>
              <dl className="mt-7 space-y-4">
                {[
                  ["Email", SITE.email, `mailto:${SITE.email}`],
                  ["Phone", SITE.phone, `tel:${SITE.phone.replace(/[^+\d]/g, "")}`],
                  ["Address", SITE.address, undefined],
                  ["Office hours", SITE.hours, undefined],
                ].map(([k, v, href]) => (
                  <div key={k} className="rounded-[24px] bg-white p-5 shadow-soft">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{k}</dt>
                    <dd className="mt-1.5 text-[15px] font-semibold text-forest">
                      {href ? (
                        <a href={href} className="transition hover:text-leaf-2">
                          {v}
                        </a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal variant="up" delay={120} className="mt-8">
              <h3 className="font-display text-xl font-semibold text-forest">
                Find fresh near you
              </h3>
              <p className="mt-2 text-[14px] text-muted">
                {location
                  ? "Here are the markets closest to you right now."
                  : "Allow location on the Find page and we'll sort all twelve markets by distance."}
              </p>
              <ul className="mt-4 space-y-2">
                {nearest.map((m) => {
                  const st = getMarketStatus(m, now);
                  return (
                    <li key={m.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft">
                      <a href={`#/market/${m.id}`} className="truncate text-[14px] font-semibold text-forest hover:text-leaf-2">
                        {m.name}
                      </a>
                      <StatusPill status={st.status} message={st.label} />
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          {/* form */}
          <Reveal variant="right" delay={100}>
            <form onSubmit={submit} className="rounded-[36px] bg-white p-6 shadow-lift sm:p-9">
              <h2 className="font-display text-2xl font-semibold text-forest">Send a message</h2>
              <p className="mt-2 text-[13.5px] text-muted">
                Frontend only — your message is validated and acknowledged in the browser.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Name" error={errors.name}>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Topic">
                  <select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className={inputCls}
                  >
                    {["General", "List a market", "Grower enquiry", "Seasonal data", "Press"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Message" error={errors.message}>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputCls} resize-none rounded-[24px]`}
                    placeholder="Tell us what you're looking for…"
                    aria-invalid={!!errors.message}
                  />
                </Field>
              </div>

              <Btn type="submit" variant="leaf" size="lg" className="mt-6 w-full" withArrow>
                Send message
              </Btn>
            </form>
          </Reveal>
        </div>

        {/* map */}
        <div className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
          <Reveal variant="up">
            <SectionLabel index="02">Find us</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold text-forest">
              Above the baker's row
            </h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <MarketMapEmbed market={HQ} height={400} />
              <div className="rounded-[32px] bg-forest p-7 text-cream">
                <h3 className="font-display text-xl font-semibold">Visiting?</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-cream/70">
                  We're above Bloomfield Artisan Market — follow the smell of sourdough up the stairs.
                  Saturdays are our favourite day to talk markets.
                </p>
                <dl className="mt-6 space-y-2.5 text-[13.5px]">
                  <div className="flex justify-between gap-4 border-b border-cream/10 pb-2.5">
                    <dt className="text-cream/55">Nearest market</dt>
                    <dd className="font-semibold">{getMarketById(12)?.name ?? "Bloomfield Artisan Market"}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-cream/10 pb-2.5">
                    <dt className="text-cream/55">Market day</dt>
                    <dd className="font-semibold">Saturday, 8:00 AM – 2:00 PM</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-cream/55">Email</dt>
                    <dd className="font-semibold">{SITE.email}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const inputCls =
  "w-full rounded-2xl border border-forest/12 bg-cream px-4 py-3.5 text-[14px] text-forest placeholder:text-muted/60 outline-none transition focus:border-leaf focus:bg-white";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-forest/60">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[12px] font-semibold text-tomato">{error}</span>}
    </label>
  );
}
