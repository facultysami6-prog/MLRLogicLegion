import { getMarketStatus, formatTime } from "@/lib/marketStatus";
import { cn, formatDistance } from "@/lib/utils";
import { marketsForProduce } from "@/lib/data";
import { HeartButton, StatusPill } from "./ui";
import { ProduceArt, ART_FOR_ID } from "./ProduceArt";
import { useApp } from "@/store/AppStore";
import type { Farmer, Market, ProduceItem, Testimonial } from "@/lib/types";

/* ============================================================ *
 * Market card — grid & list variants
 * ============================================================ */
const CARD_ACCENTS = ["var(--color-leaf)", "var(--color-lime)", "var(--color-forest-2)"];

export function MarketCard({
  market,
  now,
  variant = "grid",
  index = 0,
}: {
  market: Market;
  now: Date;
  variant?: "grid" | "list";
  index?: number;
}) {
  const { isSaved, toggle, distanceTo } = useApp();
  const status = getMarketStatus(market, now);
  const key = `market:${market.id}`;
  const saved = isSaved(key);
  const dist = distanceTo({ lat: market.lat, lng: market.lng });
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  const heart = (
    <HeartButton
      active={saved}
      size={variant === "grid" ? "md" : "sm"}
      label={saved ? `Remove ${market.name} from saved` : `Save ${market.name}`}
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
    />
  );

  if (variant === "list") {
    return (
      <article className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white p-3 shadow-soft transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-lift sm:flex-row">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[22px] sm:aspect-auto sm:h-52 sm:w-64">
          <img
            src={market.image}
            alt={`${market.name} in ${market.area}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-3/45 to-transparent" />
          <div className="absolute left-3 top-3">
            <StatusPill status={status.status} message={status.label} glow={status.status === "open"} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-soft px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-forest-2">
                {market.area}
              </span>
              <h3 className="mt-2.5 font-display text-xl font-semibold leading-tight text-forest">
                {market.name}
              </h3>
            </div>
            {heart}
          </div>
          <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted">{market.description}</p>
          <p className="mt-3 text-[13px] font-medium text-forest">
            {market.days.join(" · ")} — {formatTime(market.openingTime)} – {formatTime(market.closingTime)}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {market.produce.slice(0, 4).map((p) => (
              <span
                key={p}
                className="rounded-full border border-forest/10 bg-cream px-2.5 py-1 text-[11px] font-medium text-forest/80"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
              ★ {market.rating} · {market.stalls} stalls
              {dist !== null && ` · ${formatDistance(dist)}`}
            </span>
            <a
              href={`#/market/${market.id}`}
              className="group/link inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-cream transition-all duration-400 hover:bg-leaf"
            >
              View Market
              <span className="transition-transform duration-400 group-hover/link:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-soft transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-lift"
      style={{ transitionDelay: `${Math.min(index, 6) * 40}ms` }}
    >
      <div
        className="relative shrink-0 px-4 pb-3 pt-4"
        style={{ borderRadius: "0 0 40% 40% / 0 0 22px 22px" }}
      >
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
          {market.area}
        </span>
      </div>
      <div className="relative -mt-2 px-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
          <img
            src={market.image}
            alt={`${market.name} in ${market.area}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.09]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-3/55 via-forest-3/5 to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <StatusPill status={status.status} message={status.label} glow={status.status === "open"} />
          </div>
          <div className="absolute right-3 top-3 opacity-80 transition-opacity duration-400 group-hover:opacity-100">
            {heart}
          </div>
          {dist !== null && (
            <span className="absolute bottom-3 right-3 rounded-full bg-forest-3/70 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-lime backdrop-blur">
              {formatDistance(dist)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3.5">
        <h3 className="font-display text-[19px] font-semibold leading-snug text-forest transition-colors duration-300 group-hover:text-leaf-2">
          {market.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{market.description}</p>

        <dl className="mt-3.5 space-y-1.5 text-[12.5px] text-forest/85">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Address</dt>
            <span aria-hidden="true" style={{ color: accent }}>◉</span>
            <dd className="truncate">{market.address.split(",")[0]}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Opening days</dt>
            <span aria-hidden="true" style={{ color: accent }}>◷</span>
            <dd>
              {market.days.map((d) => d.slice(0, 3)).join(" · ")} ·{" "}
              {formatTime(market.openingTime)} – {formatTime(market.closingTime)}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {market.produce.slice(0, 3).map((p) => (
            <span
              key={p}
              className="rounded-full border border-forest/10 bg-cream px-2.5 py-1 text-[11px] font-medium text-forest/75"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="shrink-0 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">
            ★ {market.rating}
          </span>
          <a
            href={`#/market/${market.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-white transition-transform active:scale-95"
            style={{ background: accent }}
          >
            View Market
            <span className="transition-transform duration-400 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

/* ============================================================ *
 * Produce card — large floating artwork
 * ============================================================ */
export function ProduceCard({
  item,
  index = 0,
  tone = "cream",
}: {
  item: ProduceItem;
  index?: number;
  tone?: "cream" | "white" | "green";
}) {
  const { isSaved, toggle } = useApp();
  const key = `produce:${item.id}`;
  const saved = isSaved(key);
  const count = marketsForProduce(item.id).length;

  const bg =
    tone === "green"
      ? "bg-forest text-cream"
      : tone === "white"
        ? "bg-white text-forest"
        : "bg-cream-2 text-forest";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[32px] p-6 pt-0 shadow-soft transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-lift",
        bg,
      )}
      style={{ transitionDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      {/* oversized floating artwork that overlaps the card edge */}
      <div className="relative -mx-2 mb-1 mt-2 h-40">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl transition-all duration-700 group-hover:opacity-70"
          style={{ background: item.color }}
        />
        <ProduceArt
          name={ART_FOR_ID[item.id] ?? "leaf"}
          className="animate-float-slow relative mx-auto h-full w-auto drop-shadow-[0_18px_28px_rgba(22,51,31,0.22)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          style={{ ["--ff-rot" as string]: `${(index % 2 ? 1 : -1) * 4}deg` }}
        />
      </div>

      <div className="absolute right-5 top-5 z-10">
        <HeartButton
          active={saved}
          size="sm"
          label={saved ? `Remove ${item.name} from saved` : `Save ${item.name}`}
          className={cn(
            tone === "green" ? "border-cream/40 bg-cream/10 text-cream" : "border-forest/12 bg-white/70 text-forest",
          )}
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
        />
      </div>

      <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-leaf-2">
        {item.category}
      </span>
      <h3 className="mt-1.5 font-display text-2xl font-semibold">{item.name}</h3>
      <p
        className={cn(
          "mt-2 text-[13px] leading-relaxed",
          tone === "green" ? "text-cream/70" : "text-muted",
        )}
      >
        {item.tagline}
      </p>

      <div className={cn("mt-4 flex items-center gap-4 text-[12px]", tone === "green" ? "text-cream/80" : "text-forest/75")}>
        <span>🌱 {item.season.join(" · ")}</span>
        <span aria-hidden="true">·</span>
        <span>🏪 {count} markets</span>
      </div>

      <a
        href={`#/produce/${item.id}`}
        className={cn(
          "mt-5 inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all duration-400",
          tone === "green"
            ? "bg-lime text-forest hover:bg-cream"
            : "bg-forest text-cream hover:bg-leaf",
        )}
      >
        View Details
        <span className="transition-transform duration-400 group-hover:translate-x-1">→</span>
      </a>
    </article>
  );
}

/* ============================================================ *
 * Grower card
 * ============================================================ */
export function FarmerCard({ farmer, index = 0 }: { farmer: Farmer; index?: number }) {
  return (
    <article className="group relative overflow-hidden rounded-[30px] bg-white shadow-soft transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={farmer.image}
          alt={`${farmer.name} of ${farmer.farm}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-3 via-forest-3/25 to-transparent" />
        <div
          aria-hidden="true"
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-cream backdrop-blur"
          style={{ background: `${farmer.tint}cc` }}
        >
          {farmer.specialty}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-xl font-semibold text-cream">{farmer.name}</h3>
          <p className="mt-0.5 text-[12.5px] text-cream/70">{farmer.farm}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <p className="text-[12px] text-muted">
          {farmer.years} years · <a href={`#/market/${farmer.marketId}`} className="font-semibold text-forest underline-offset-2 hover:underline">{farmer.market}</a>
        </p>
        <span
          aria-hidden="true"
          className="font-display text-3xl font-semibold opacity-15"
          style={{ color: farmer.tint }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="px-5 pb-5 font-display text-[15px] italic leading-snug text-forest/80">
        “{farmer.quote}”
      </p>
    </article>
  );
}

/* ============================================================ *
 * Testimonial
 * ============================================================ */
export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="flex h-full w-[86vw] shrink-0 snap-start flex-col justify-between rounded-[32px] bg-white p-7 shadow-soft sm:w-[26rem]">
      <div>
        <div className="flex gap-1 text-citrus" aria-label={`${t.rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} aria-hidden="true" className={i < t.rating ? "" : "opacity-25"}>
              ★
            </span>
          ))}
        </div>
        <blockquote className="mt-5 font-display text-[19px] font-medium leading-snug text-forest">
          “{t.quote}”
        </blockquote>
      </div>
      <footer className="mt-7 flex items-center gap-3">
        <span
          className="grid h-12 w-12 place-items-center rounded-full font-display text-sm font-bold text-white"
          style={{ background: t.tint }}
          aria-hidden="true"
        >
          {t.initials}
        </span>
        <div>
          <p className="text-[14px] font-bold text-forest">{t.name}</p>
          <p className="text-[12px] text-muted">
            {t.role} · {t.location}
          </p>
        </div>
      </footer>
    </article>
  );
}

/** Small helper used in market detail pages for "you'll also find". */
export function ProduceChip({ name }: { name: string }) {
  const item = marketsForProduce(name.toLowerCase().replace(/[^a-z]+/g, "-")).length;
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-cream-2 px-3.5 py-2 text-[12.5px] font-semibold text-forest">
      <span aria-hidden="true" className="text-leaf">◍</span>
      {name}
      {item > 0 && <span className="text-[11px] text-muted">· {item} markets</span>}
    </span>
  );
}
