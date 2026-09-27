import { useEffect, useRef, useState } from "react";
import { CHATBOT, MARKETS, PRODUCE } from "@/lib/data";
import { cn } from "@/lib/utils";
import { getMarketStatus } from "@/lib/marketStatus";
import type { ChatIntent } from "@/lib/types";

type Msg = {
  id: number;
  from: "bot" | "me";
  text: string;
  bullets?: string[];
  links?: { label: string; href: string }[];
  suggestions?: string[];
};

/** Escape a string for safe use inside a RegExp. */
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whole-word / whole-phrase containment check — avoids false positives like
 * the keyword "hi" matching inside "this" or "shirt".
 */
function hasWord(q: string, phrase: string) {
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(phrase)}([^a-z0-9]|$)`, "i").test(q);
}

/**
 * Rule-based matcher, scoped to FreshFind only.
 * Scores every intent by keyword hit and keyword length (so "market timings"
 * beats a generic "market" match), with a light produce/market name lookup
 * so the bot can answer things like "where can I buy honey?". Every match
 * uses whole-word boundaries so short keywords ("hi", "sup") never trigger
 * on substrings inside unrelated words.
 */
function matchIntent(raw: string): { intent: ChatIntent | null; extra?: Msg } {
  const q = raw.toLowerCase().trim().replace(/[?!.]/g, "");

  // 1. Direct produce lookup — "honey", "where can I buy basil"
  const produceHit = PRODUCE.find((p) => hasWord(q, p.name.toLowerCase()));
  if (produceHit) {
    const where = MARKETS.filter((m) => produceHit.markets.includes(m.id)).slice(0, 3);
    return {
      intent: {
        id: `produce-${produceHit.id}`,
        keywords: [],
        response: `${produceHit.name} — ${produceHit.tagline} ${produceHit.description}`,
        bullets: [
          `Season: ${produceHit.season.join(" · ")} (peak ${produceHit.peak})`,
          `Origin: ${produceHit.origin}`,
          `Storage: ${produceHit.tips[0]}`,
        ],
        links: [
          { label: `Open ${produceHit.name} guide`, href: `#/produce/${produceHit.id}` },
          ...where.map((m) => ({ label: m.name, href: `#/market/${m.id}` })),
        ],
        suggestions: ["What's in season?", "Find markets near me"],
      },
    };
  }

  // 2. Direct market lookup — "is green valley open"
  const marketHit = MARKETS.find((m) => {
    const words = m.name.toLowerCase().split(" ");
    return words.filter((w) => w.length > 4).some((w) => hasWord(q, w)) || hasWord(q, m.area.toLowerCase());
  });
  if (marketHit) {
    const st = getMarketStatus(marketHit, new Date());
    return {
      intent: {
        id: `market-${marketHit.id}`,
        keywords: [],
        response: `${marketHit.name} is ${st.label.toLowerCase()} — ${st.message}. ${marketHit.description}`,
        bullets: [
          `Days: ${marketHit.days.join(", ")}`,
          `Hours: ${marketHit.openingTime} – ${marketHit.closingTime}`,
          `Where: ${marketHit.address}`,
        ],
        links: [
          { label: `View ${marketHit.name}`, href: `#/market/${marketHit.id}` },
          { label: "All markets", href: "#/directory" },
        ],
        suggestions: ["Market timings", "Find markets near me"],
      },
    };
  }

  // 3. Keyword scoring across the JSON intents — whole-word matches only,
  // longer/more specific keywords win over short generic ones.
  let best: { intent: ChatIntent; score: number } | null = null;
  for (const intent of CHATBOT.intents) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (q === kw) score += kw.length * 3;
      else if (hasWord(q, kw)) score += kw.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  return { intent: best?.intent ?? null };
}

/** Friendly speech-bubble + sprout mark used everywhere the chatbot shows its face. */
function ChatbotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path
        d="M24 6C13 6 4 13.6 4 23c0 5.7 3.5 10.7 8.7 13.7-.3 2.1-1.3 4.5-3.1 6.3 3.2-.2 6.4-1.5 9-3.5 1.7.4 3.5.5 5.4.5 11 0 20-7.5 20-17S35 6 24 6Z"
        fill="currentColor"
      />
      <path
        d="M24 17.2c-3.1 0-5.6 2.4-5.6 5.8 0 0 3.3-1.3 5.6.9 2.3-2.2 5.6-.9 5.6-.9 0-3.4-2.5-5.8-5.6-5.8Z"
        fill="var(--color-lime)"
      />
      <path
        d="M24 29v-6.4"
        stroke="var(--color-lime)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BotAvatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest text-lime">
      <ChatbotIcon className="h-[18px] w-[18px] text-cream" />
    </span>
  );
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      from: "bot",
      text: CHATBOT.greeting,
      bullets: undefined,
      suggestions: CHATBOT.quickReplies,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const uid = useRef(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  const push = (m: Omit<Msg, "id">) =>
    setMsgs((prev) => [...prev, { ...m, id: ++uid.current }]);

  const respond = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    push({ from: "me", text: trimmed });
    setInput("");
    setTyping(true);

    // Small delay makes the rule-based engine feel conversational.
    window.setTimeout(() => {
      const { intent } = matchIntent(trimmed);
      setTyping(false);
      if (intent) {
        push({
          from: "bot",
          text: intent.response,
          bullets: intent.bullets,
          links: intent.links,
          suggestions: intent.suggestions,
        });
      } else {
        push({
          from: "bot",
          text: CHATBOT.fallback.response,
          suggestions: CHATBOT.fallback.suggestions,
        });
      }
    }, 620);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ff-chat-panel"
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        className={cn(
          "group fixed bottom-5 right-5 z-[110] grid h-16 w-16 place-items-center rounded-full shadow-lift transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105",
          open ? "bg-forest-2" : "bg-forest",
        )}
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-leaf pulse-ring text-leaf" aria-hidden="true" />
        )}
        <span className="relative transition-transform duration-500 group-hover:rotate-12">
          {open ? (
            <span className="text-2xl text-cream">✕</span>
          ) : (
            <ChatbotIcon className="h-8 w-8 text-cream" />
          )}
        </span>
        {!open && (
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-2xl bg-forest px-4 py-2 text-[12.5px] font-semibold text-cream shadow-soft sm:block">
            Chat with us
          </span>
        )}
      </button>

      {/* Panel */}
      <div
        id="ff-chat-panel"
        role="dialog"
        aria-label="Chatbot"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed bottom-24 right-5 z-[110] flex w-[min(92vw,24rem)] origin-bottom-right flex-col overflow-hidden rounded-[30px] bg-cream shadow-lift transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open
            ? "pointer-events-auto h-[min(70vh,34rem)] scale-100 opacity-100"
            : "pointer-events-none h-0 scale-90 opacity-0",
        )}
      >
        {/* header */}
        <div className="relative overflow-hidden bg-forest px-5 py-4 text-cream">
          <div
            aria-hidden="true"
            className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-leaf/25 blur-xl"
          />
          <div className="relative flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-forest">
              <ChatbotIcon className="h-5 w-5 text-forest" />
            </span>
            <div>
              <p className="font-display text-[17px] font-semibold">{CHATBOT.botName}</p>
              <p className="text-[11.5px] text-cream/65">Always fresh · replies instantly</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-leaf/20 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" /> Online
            </span>
          </div>
        </div>

        {/* messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {msgs.map((m) =>
            m.from === "bot" ? (
              <div key={m.id} className="animate-pop flex gap-2.5">
                <BotAvatar />
                <div className="max-w-[85%]">
                  <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[13.5px] leading-relaxed text-forest shadow-soft">
                    {m.text}
                    {m.bullets && (
                      <ul className="mt-2.5 space-y-1 border-t border-forest/8 pt-2.5">
                        {m.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2 text-[12.5px] text-muted">
                            <span aria-hidden="true" className="text-leaf">▸</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.links && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.links.map((l) => (
                          <a
                            key={l.label + l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-forest px-3.5 py-2 text-[11.5px] font-bold text-cream transition hover:bg-leaf"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div key={m.id} className="animate-pop flex justify-end">
                <p className="max-w-[80%] rounded-2xl rounded-tr-sm bg-leaf px-4 py-3 text-[13.5px] font-medium text-white shadow-soft">
                  {m.text}
                </p>
              </div>
            ),
          )}

          {typing && (
            <div className="flex items-end gap-2.5">
              <BotAvatar />
              <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3.5 shadow-soft">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-leaf"
                    style={{ animationDelay: `${i * 140}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* quick replies attached to the latest bot message */}
          {!typing && msgs[msgs.length - 1]?.from === "bot" && msgs[msgs.length - 1].suggestions && (
            <div className="flex flex-wrap gap-2 pl-11">
              {msgs[msgs.length - 1].suggestions!.map((s) => (
                <button
                  key={s}
                  onClick={() => respond(s)}
                  className="rounded-full border border-forest/15 bg-white/70 px-3.5 py-2 text-[12px] font-semibold text-forest transition-all duration-300 hover:-translate-y-0.5 hover:border-leaf hover:bg-leaf hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            respond(input);
          }}
          className="flex items-center gap-2 border-t border-forest/8 bg-cream-2/70 px-3 py-3"
        >
          <label htmlFor="ff-chat-input" className="sr-only">
            Message the chatbot
          </label>
          <input
            id="ff-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about markets, seasons…"
            className="flex-1 rounded-full border border-forest/10 bg-white px-4 py-3 text-[13.5px] outline-none transition focus:border-leaf"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest text-cream transition hover:bg-leaf"
          >
            →
          </button>
        </form>
      </div>
    </>
  );
}
