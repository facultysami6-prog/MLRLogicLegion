/**
 * FreshFind data layer.
 *
 * All content lives in JSON files under /src/data and is loaded through
 * this module — components never hardcode market or produce copy.
 * The loader is asynchronous (and cached) so pages can render skeleton
 * states exactly as they would with a real fetch()/XHR call.
 */

import marketsJson from "@/data/markets.json";
import produceJson from "@/data/produce.json";
import seasonalJson from "@/data/seasonal.json";
import testimonialsJson from "@/data/testimonials.json";
import farmersJson from "@/data/farmers.json";
import chatbotJson from "@/data/chatbot.json";
import type { AppData, ChatData, Farmer, Market, ProduceItem, Season, Testimonial } from "./types";

export const MARKETS = marketsJson as Market[];
export const PRODUCE = produceJson as ProduceItem[];
export const SEASONS = seasonalJson as Season[];
export const TESTIMONIALS = testimonialsJson as Testimonial[];
export const FARMERS = farmersJson as Farmer[];
export const CHATBOT = chatbotJson as ChatData;

/** Simulated network latency so loading skeletons are meaningful. */
const LATENCY = 220;

let cache: AppData | null = null;

export async function loadAppData(): Promise<AppData> {
  if (cache) return cache;
  await new Promise((r) => setTimeout(r, LATENCY));
  cache = {
    markets: MARKETS,
    produce: PRODUCE,
    seasonal: SEASONS,
    testimonials: TESTIMONIALS,
    farmers: FARMERS,
  };
  return cache;
}

/* ---------------- derived selectors ---------------- */

export const AREAS = Array.from(new Set(MARKETS.map((m) => m.area))).sort();

export const PRODUCE_CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Herbs",
  "Dairy",
  "Baked Goods",
  "Honey",
  "Organic Products",
  "Other",
] as const;

export const PRODUCE_NAMES = PRODUCE.map((p) => p.name).sort();

export const getMarketById = (id: number | string) => MARKETS.find((m) => m.id === Number(id));

export const getProduceById = (id: string) => PRODUCE.find((p) => p.id === id);

/** Which markets stock a given produce item. */
export const marketsForProduce = (produceId: string): Market[] => {
  const item = getProduceById(produceId);
  if (!item) return [];
  return MARKETS.filter((m) => item.markets.includes(m.id));
};

/** Which produce items are stocked at a given market. */
export const produceForMarket = (marketId: number): ProduceItem[] => {
  const market = getMarketById(marketId);
  if (!market) return [];
  return PRODUCE.filter(
    (p) => p.markets.includes(Number(marketId)) || market.produce.includes(p.name),
  );
};

export const currentSeasonId = (date = new Date()): string => {
  const m = date.getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
};

export const SITE = {
  name: "FreshFind",
  tagline: "Fresh All Along.",
  email: "hello@freshfind.market",
  phone: "+92 300 000 0000",
  phone2: "+92 21 000 0000",
  addressLine1: "Clifton Block 4,",
  addressLine2: "Karachi, Pakistan",
  address: "Clifton Block 4, Karachi, Pakistan",
  hours: "Mon – Fri, 9:00 AM – 6:00 PM",
};
