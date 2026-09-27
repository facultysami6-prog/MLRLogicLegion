import type { Market } from "./types";
import { minutesUntilNextOpen } from "./marketStatus";
import { distanceKm, type Coords } from "./utils";

export interface Filters {
  q: string;
  area: string;
  day: string;
  produce: string;
  /** "all" | "open" */
  status: string;
}

export const EMPTY_FILTERS: Filters = { q: "", area: "", day: "", produce: "", status: "" };

export function filterMarkets(markets: Market[], f: Filters, now: Date): Market[] {
  const q = f.q.trim().toLowerCase();
  const day = f.day.trim().toLowerCase();
  const area = f.area.trim().toLowerCase();
  const produce = f.produce.trim().toLowerCase();

  return markets.filter((m) => {
    if (area && !(m.area.toLowerCase().includes(area) || m.address.toLowerCase().includes(area)))
      return false;
    if (day && day !== "any" && !m.days.some((d) => d.toLowerCase() === day)) return false;
    if (produce && produce !== "any") {
      const hit =
        m.produce.some((p) => p.toLowerCase().includes(produce)) ||
        m.categories.some((c) => c.toLowerCase() === produce);
      if (!hit) return false;
    }
    if (f.status === "open") {
      const st = minutesUntilNextOpen(m, now);
      if (st !== -1) return false;
    }
    if (q) {
      const haystack = `${m.name} ${m.area} ${m.address} ${m.description} ${m.produce.join(" ")} ${m.categories.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export type SortKey = "name" | "next" | "distance" | "rating";

export function sortMarkets(
  markets: Market[],
  sort: SortKey,
  now: Date,
  coords: Coords | null,
): Market[] {
  const list = [...markets];
  switch (sort) {
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "distance":
      if (!coords) return sortMarkets(list, "next", now, coords);
      return list.sort(
        (a, b) => distanceKm(coords, a) - distanceKm(coords, b),
      );
    case "next":
    default:
      return list.sort((a, b) => minutesUntilNextOpen(a, now) - minutesUntilNextOpen(b, now));
  }
}
