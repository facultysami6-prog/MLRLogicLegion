import type { Market, MarketStatus, ScheduleRow } from "./types";

/** Monday-indexed day names, matching JS Date#getDay(). */
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export const DAY_SHORT = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

/** "08:30" → 510 */
export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** "08:00" → "8:00 AM" */
export function formatTime(time: string): string {
  const mins = toMinutes(time);
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Core open/closed engine.
 * Returns open | opening-soon (within 60 min) | closed, plus the next opening slot.
 */
export function getMarketStatus(market: Market, now: Date = new Date()): MarketStatus {
  const today = DAYS[now.getDay()];
  const nowMins = minutesOfDay(now);
  const isOpenToday = market.days.includes(today);
  const openMins = toMinutes(market.openingTime);
  const closeMins = toMinutes(market.closingTime);
  const todayHours = isOpenToday ? `${formatTime(market.openingTime)} – ${formatTime(market.closingTime)}` : null;

  let status: MarketStatus["status"] = "closed";
  let minutesUntilOpen: number | null = null;
  let minutesUntilClose: number | null = null;

  if (isOpenToday) {
    if (nowMins >= openMins && nowMins < closeMins) {
      status = "open";
      minutesUntilClose = closeMins - nowMins;
    } else if (nowMins < openMins) {
      status = openMins - nowMins <= 60 ? "opening-soon" : "closed";
      minutesUntilOpen = openMins - nowMins;
    }
  }

  // Next future opening slot (searching up to 7 days ahead)
  let nextOpening: MarketStatus["nextOpening"] = null;
  for (let i = 0; i < 8; i++) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + i);
    const dayName = DAYS[candidate.getDay()];
    if (!market.days.includes(dayName)) continue;
    const startMin = toMinutes(market.openingTime);
    const slotStart = new Date(candidate);
    slotStart.setHours(Math.floor(startMin / 60), startMin % 60, 0, 0);
    if (slotStart.getTime() > now.getTime() - 60_000) {
      nextOpening = {
        day: dayName,
        date: slotStart,
        fromNow: Math.round((slotStart.getTime() - now.getTime()) / 60000),
      };
      break;
    }
  }

  const label =
    status === "open" ? "Open Now" : status === "opening-soon" ? "Opening Soon" : "Closed";

  let message: string;
  if (status === "open") {
    const h = Math.floor((minutesUntilClose ?? 0) / 60);
    const m = (minutesUntilClose ?? 0) % 60;
    message =
      minutesUntilClose !== null && minutesUntilClose <= 60
        ? `Closing in ${minutesUntilClose} min`
        : `Open for ${h > 0 ? `${h}h ` : ""}${m}m`;
  } else if (status === "opening-soon") {
    message = `Opens in ${minutesUntilOpen} min`;
  } else if (nextOpening) {
    message = `Opens ${nextOpening.day}${nextOpening.fromNow < 1440 ? ` in ${formatFromNow(nextOpening.fromNow)}` : ""}`;
  } else {
    message = "Check schedule";
  }

  return { status, label, message, todayHours, isOpenToday, minutesUntilOpen, minutesUntilClose, nextOpening };
}

export function formatFromNow(minutes: number): string {
  if (minutes < 1) return "momentarily";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

/** Elegant weekly schedule rows for the market detail page. */
export function getSchedule(market: Market, now: Date = new Date()): ScheduleRow[] {
  const today = DAYS[now.getDay()];
  return DAYS.map((day, i) => {
    const isTrading = market.days.includes(day);
    return {
      day,
      short: DAY_SHORT[i],
      open: isTrading ? formatTime(market.openingTime) : null,
      close: isTrading ? formatTime(market.closingTime) : null,
      isToday: day === today,
    };
  });
}

/** Sorting helper: how many minutes until this market next opens (0 if open). */
export function minutesUntilNextOpen(market: Market, now: Date = new Date()): number {
  const st = getMarketStatus(market, now);
  if (st.status === "open") return -1;
  return st.nextOpening ? st.nextOpening.fromNow : 99_999;
}

export const STATUS_STYLES: Record<
  MarketStatus["status"],
  { badge: string; dot: string; text: string; ring: string }
> = {
  open: {
    badge: "bg-leaf/12 text-leaf-2 border-leaf/30",
    dot: "bg-leaf",
    text: "text-leaf-2",
    ring: "ring-leaf/40",
  },
  "opening-soon": {
    badge: "bg-citrus/16 text-[#9a5c12] border-citrus/40",
    dot: "bg-citrus",
    text: "text-[#9a5c12]",
    ring: "ring-citrus/40",
  },
  closed: {
    badge: "bg-forest/6 text-muted border-forest/12",
    dot: "bg-[#b9bfb4]",
    text: "text-muted",
    ring: "ring-forest/10",
  },
};
