import { useState } from "react";
import { useApp } from "@/store/AppStore";
import { Breadcrumbs, Btn, BtnLink, Reveal, SectionLabel } from "@/components/ui";
import { ProduceArt, ART_FOR_ID } from "@/components/ProduceArt";
import { SectionFlourish, FLOURISH_IMAGES } from "@/components/Doodles";
import { buildExportContents, downloadTextFile, shareContent, type ExportableRow } from "@/lib/utils";
import { getMarketById, getProduceById } from "@/lib/data";
import { getMarketStatus } from "@/lib/marketStatus";
import { useNow } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function MyFinds() {
  const { bookmarks, remove, setNote, clearAll, toast } = useApp();
  const now = useNow(30_000);
  const [tab, setTab] = useState<"all" | "market" | "produce">("all");

  const filtered = bookmarks.filter((b) => (tab === "all" ? true : b.type === tab));
  const markets = bookmarks.filter((b) => b.type === "market");
  const produce = bookmarks.filter((b) => b.type === "produce");

  const absoluteUrl = (hashPath: string) =>
    `${window.location.origin}${window.location.pathname}${hashPath}`;

  const exportAll = () => {
    if (!bookmarks.length) return toast("Nothing to export yet", "warn");
    const rows: ExportableRow[] = bookmarks.map((b) => ({
      name: b.name,
      type: b.type === "market" ? "Market" : "Produce",
      subtitle: b.subtitle,
      note: b.note,
      url: absoluteUrl(b.type === "market" ? `#/market/${b.id}` : `#/produce/${b.id}`),
    }));
    downloadTextFile("freshfind-my-fresh-finds.txt", buildExportContents(rows, "My Fresh Finds"));
    toast("Exported your fresh finds");
  };

  const shareOne = async (b: (typeof bookmarks)[number]) => {
    const url = absoluteUrl(b.type === "market" ? `#/market/${b.id}` : `#/produce/${b.id}`);
    const r = await shareContent(`FreshFind — ${b.name}`, `${b.name} · ${b.subtitle}`, url);
    toast(
      r === "copied" ? "Link copied to clipboard" : r === "shared" ? "Shared!" : "Sharing unavailable",
      r === "failed" ? "warn" : "success",
    );
  };

  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-36 sm:pt-44">
        <SectionFlourish image={FLOURISH_IMAGES.fruit} opacity={0.07} />
        <ProduceArt
          name="strawberry"
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute right-[6%] top-24 hidden w-36 opacity-70 lg:block"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs
            items={[{ label: "Home", href: "#/" }, { label: "My Fresh Finds" }]}
          />
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index="—">Saved</SectionLabel>
              <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1] text-forest">
                My <span className="font-script text-leaf">Fresh Finds</span>
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                Every market and produce item you've hearted, with room for your own notes. Stored
                locally in your browser — nothing leaves your device.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Btn variant="primary" size="md" onClick={exportAll}>
                ⭳ Export My Fresh Finds
              </Btn>
              {bookmarks.length > 0 && (
                <Btn
                  variant="outline"
                  size="md"
                  onClick={() => {
                    clearAll();
                    toast("All saved items cleared", "neutral");
                  }}
                >
                  Clear all
                </Btn>
              )}
            </div>
          </div>

          {/* stats + tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-forest/10 py-5">
            <div className="flex gap-8">
              {[
                ["All", bookmarks.length, "all" as const],
                ["Markets", markets.length, "market" as const],
                ["Produce", produce.length, "produce" as const],
              ].map(([label, count, key]) => (
                <button
                  key={label}
                  onClick={() => setTab(key as "all" | "market" | "produce")}
                  className={cn(
                    "text-left transition-all duration-300",
                    tab === key ? "text-forest" : "text-muted hover:text-forest",
                  )}
                >
                  <span className="block font-display text-3xl font-semibold">{count}</span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em]">{label}</span>
                </button>
              ))}
            </div>
            <p className="text-[12.5px] text-muted">
              {bookmarks.filter((b) => b.note.trim()).length} personal notes saved
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {filtered.length === 0 ? (
            <Reveal variant="up" className="mt-10">
              <div className="rounded-[36px] border border-dashed border-forest/20 bg-white/70 p-12 text-center">
                <div className="mx-auto flex w-fit -space-x-3">
                  {["avocado", "tomato", "basil"].map((n) => (
                    <ProduceArt key={n} name={n} className="h-20 w-auto opacity-90" />
                  ))}
                </div>
                <h2 className="mt-6 font-display text-2xl font-semibold text-forest">
                  Nothing saved yet
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">
                  Tap the heart on any market or produce card and it will appear here with space for
                  your own note.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <BtnLink href="#/directory" variant="leaf" size="md" withArrow>
                    Browse markets
                  </BtnLink>
                  <BtnLink href="#/produce" variant="outline" size="md">
                    Produce guide
                  </BtnLink>
                </div>
              </div>
            </Reveal>
          ) : (
            <ul className="mt-10 grid gap-5 lg:grid-cols-2">
              {filtered.map((b, i) => {
                const market = b.type === "market" ? getMarketById(b.id) : undefined;
                const item = b.type === "produce" ? getProduceById(b.id) : undefined;
                const status = market ? getMarketStatus(market, now) : null;
                return (
                  <Reveal key={b.key} variant="up" delay={Math.min(i, 6) * 60} as="li">
                    <article className="group flex h-full flex-col gap-4 rounded-[32px] bg-white p-5 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:shadow-lift sm:flex-row">
                      <a
                        href={b.type === "market" ? `#/market/${b.id}` : `#/produce/${b.id}`}
                        className="relative h-32 w-full shrink-0 overflow-hidden rounded-[24px] sm:h-auto sm:w-36"
                      >
                        <img src={b.image} alt={b.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        {item && (
                          <ProduceArt
                            name={ART_FOR_ID[item.id] ?? "leaf"}
                            className="absolute -bottom-2 right-1 h-16 w-auto drop-shadow-[0_10px_16px_rgba(0,0,0,0.3)]"
                          />
                        )}
                      </a>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-leaf-2">
                              {b.type === "market" ? "Market" : item?.category ?? "Produce"}
                            </span>
                            <h3 className="mt-1 font-display text-[20px] font-semibold text-forest">
                              <a
                                href={b.type === "market" ? `#/market/${b.id}` : `#/produce/${b.id}`}
                                className="hover:text-leaf-2"
                              >
                                {b.name}
                              </a>
                            </h3>
                            <p className="mt-0.5 text-[12.5px] text-muted">{b.subtitle}</p>
                          </div>
                          {status && <StatusBadge status={status.status} label={status.label} />}
                        </div>

                        {/* personal note */}
                        <label className="mt-3 block">
                          <span className="sr-only">Personal note for {b.name}</span>
                          <textarea
                            defaultValue={b.note}
                            onBlur={(e) => setNote(b.key, e.target.value)}
                            rows={2}
                            placeholder="Add a note — ask Elena about the purple basil…"
                            className="w-full resize-none rounded-2xl border border-forest/10 bg-cream px-4 py-2.5 text-[13px] text-forest placeholder:text-muted/60 outline-none transition focus:border-leaf focus:bg-white"
                          />
                        </label>

                        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                          <Btn variant="ghost" size="sm" onClick={() => shareOne(b)}>
                            ↗ Share
                          </Btn>
                          <Btn
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              remove(b.key);
                              toast(`${b.name} removed`, "neutral");
                            }}
                            className="text-tomato hover:bg-tomato/8"
                          >
                            ✕ Remove
                          </Btn>
                          <span className="ml-auto text-[11px] text-muted">
                            Saved {new Date(b.addedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

function StatusBadge({ status, label }: { status: ReturnType<typeof getMarketStatus>["status"]; label: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
        status === "open"
          ? "border-leaf/30 bg-leaf/12 text-leaf-2"
          : status === "opening-soon"
            ? "border-citrus/40 bg-citrus/16 text-[#9a5c12]"
            : "border-forest/12 bg-forest/6 text-muted",
      )}
    >
      {label}
    </span>
  );
}
