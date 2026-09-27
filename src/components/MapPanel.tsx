import { useMemo, useState } from "react";
import { cn, mapEmbedUrl, mapLinkUrl, formatDistance } from "@/lib/utils";
import { getMarketStatus } from "@/lib/marketStatus";
import { useApp } from "@/store/AppStore";
import type { Market } from "@/lib/types";

/* ============================================================ *
 * Elegant embedded map (keyless Google Maps embed) with a
 * hand-crafted placeholder underneath as a graceful fallback.
 * ============================================================ */
export function MarketMapEmbed({
  market,
  height = 360,
}: {
  market: Market;
  height?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-[30px] border border-forest/10 bg-cream-2 shadow-soft"
      style={{ height }}
    >
      {/* Always-present illustrated fallback */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          loaded && !failed ? "opacity-0" : "opacity-100",
        )}
      >
        <MapIllustration />
      </div>

      {!failed && (
        <iframe
          title={`Map showing ${market.name}`}
          src={mapEmbedUrl(market)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full border-0 transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-forest-3/85 to-transparent p-5">
        <div className="pointer-events-auto max-w-[70%]">
          <p className="font-display text-lg font-semibold text-cream">{market.name}</p>
          <p className="mt-0.5 text-[13px] text-cream/75">{market.address}</p>
        </div>
        <a
          href={mapLinkUrl(market)}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto shrink-0 rounded-full bg-lime px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-forest transition hover:bg-cream"
        >
          Directions
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ *
 * Stylised illustrated map — used as the fallback and as the
 * "Markets Near You" plotting canvas.
 * ------------------------------------------------------------ */
function MapIllustration() {
  return (
    <svg
      viewBox="0 0 600 400"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="600" height="400" fill="#EFE7D6" />
      {/* park blocks */}
      <path d="M40 40h150v110H40z" fill="#DCE9C6" />
      <path d="M420 250h150v110H420z" fill="#DCE9C6" />
      {/* river */}
      <path
        d="M-20 300 C120 260 220 330 320 290 S520 220 620 250 L620 290 S520 260 320 330 S120 300 -20 340 Z"
        fill="#CFE3EC"
      />
      {/* road grid */}
      <g stroke="#E2D6BE" strokeWidth="14">
        <path d="M0 120h600M0 250h600M180 0v400M400 0v400" />
      </g>
      <g stroke="#F5EEE0" strokeWidth="2" strokeDasharray="12 12">
        <path d="M0 120h600M0 250h600M180 0v400M400 0v400" />
      </g>
      {/* city blocks */}
      <g fill="#E6DCC7">
        <rect x="205" y="140" width="60" height="40" rx="6" />
        <rect x="290" y="145" width="90" height="35" rx="6" />
        <rect x="210" y="270" width="80" height="50" rx="6" />
        <rect x="425" y="140" width="70" height="45" rx="6" />
        <rect x="60" y="270" width="90" height="45" rx="6" />
      </g>
      <g fill="#C7E36B" opacity="0.5">
        <circle cx="100" cy="90" r="26" />
        <circle cx="500" cy="310" r="30" />
      </g>
    </svg>
  );
}

/* ============================================================ *
 * Markets Near You — plotted pin map + synced list
 * ============================================================ */
export function MarketsPlot({
  markets,
  now,
  activeId,
  onSelect,
}: {
  markets: Market[];
  now: Date;
  activeId?: number;
  onSelect?: (id: number) => void;
}) {
  const { distanceTo } = useApp();

  const points = useMemo(() => {
    if (!markets.length) return [];
    const lats = markets.map((m) => m.lat);
    const lngs = markets.map((m) => m.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const pad = 0.12;
    const latSpan = Math.max(maxLat - minLat, 0.02) * (1 + pad * 2);
    const lngSpan = Math.max(maxLng - minLng, 0.02) * (1 + pad * 2);
    return markets.map((m) => ({
      market: m,
      x: ((m.lng - (minLng - (maxLng - minLng) * pad)) / lngSpan) * 100,
      y: 100 - ((m.lat - (minLat - (maxLat - minLat) * pad)) / latSpan) * 100,
    }));
  }, [markets]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[30px] border border-forest/10 bg-cream-2 shadow-soft sm:aspect-[16/10]">
      <div className="absolute inset-0">
        <MapIllustration />
      </div>
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {points.map((p) => (
          <circle
            key={`r-${p.market.id}`}
            cx={`${Math.min(94, Math.max(6, p.x))}%`}
            cy={`${Math.min(92, Math.max(8, p.y))}%`}
            r="26"
            fill="#5FA83C"
            opacity={activeId === p.market.id ? 0.28 : 0.14}
          />
        ))}
      </svg>

      {points.map((p) => {
        const st = getMarketStatus(p.market, now);
        const isActive = activeId === p.market.id;
        const dist = distanceTo({ lat: p.market.lat, lng: p.market.lng });
        return (
          <button
            key={p.market.id}
            onClick={() => onSelect?.(p.market.id)}
            aria-label={`${p.market.name} — ${st.label}`}
            className={cn(
              "group absolute -translate-x-1/2 -translate-y-full transition-transform duration-300 hover:z-20 focus-visible:z-20",
              isActive ? "z-20 scale-110" : "z-10",
            )}
            style={{ left: `${Math.min(94, Math.max(6, p.x))}%`, top: `${Math.min(92, Math.max(8, p.y))}%` }}
          >
            <span
              className={cn(
                "relative grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[13px] shadow-lift transition-colors duration-300",
                st.status === "open"
                  ? "bg-leaf text-white"
                  : st.status === "opening-soon"
                    ? "bg-citrus text-forest"
                    : "bg-forest text-cream",
              )}
            >
              <span className="font-bold">{p.market.id}</span>
              {st.status === "open" && (
                <span className="absolute inset-0 rounded-full bg-leaf pulse-ring text-leaf" />
              )}
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl bg-forest px-3 py-2 text-[11px] font-semibold text-cream shadow-lift group-hover:block group-focus-visible:block">
              {p.market.name}
              {dist !== null && <span className="text-lime"> · {formatDistance(dist)}</span>}
            </span>
          </button>
        );
      })}

      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-2 rounded-2xl bg-cream/90 px-4 py-2.5 text-[11px] font-semibold text-forest backdrop-blur">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-leaf" /> Open
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-citrus" /> Soon
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-forest" /> Closed
        </span>
      </div>
    </div>
  );
}
