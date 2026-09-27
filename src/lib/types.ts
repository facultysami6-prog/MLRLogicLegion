/**
 * Shared TypeScript contracts for the FreshFind JSON data layer.
 * Every field maps 1:1 to the JSON files inside /src/data.
 */

export interface Market {
  id: number;
  name: string;
  area: string;
  city: string;
  address: string;
  days: string[];
  openingTime: string;
  closingTime: string;
  produce: string[];
  categories: string[];
  image: string;
  lat: number;
  lng: number;
  rating: number;
  stalls: number;
  established: number;
  description: string;
  features: string[];
}

export interface ProduceItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  season: string[];
  peak: string;
  markets: number[];
  image: string;
  color: string;
  origin: string;
  tips: string[];
  pairs: string[];
}

export interface Season {
  id: string;
  name: string;
  months: string;
  note: string;
  accent: string;
  tint: string;
  image: string;
  items: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  initials: string;
  tint: string;
  rating: number;
  quote: string;
}

export interface Farmer {
  id: number;
  name: string;
  farm: string;
  market: string;
  marketId: number;
  specialty: string;
  years: number;
  initials: string;
  tint: string;
  image: string;
  quote: string;
}

export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatIntent {
  id: string;
  keywords: string[];
  response: string;
  bullets?: string[];
  links?: ChatLink[];
  suggestions?: string[];
}

export interface ChatData {
  botName: string;
  greeting: string;
  greetingSub: string;
  quickReplies: string[];
  fallback: { response: string; suggestions: string[] };
  intents: ChatIntent[];
}

/** open = trading now · opening-soon = opens within 60 min · closed = everything else */
export type MarketStatusKind = "open" | "opening-soon" | "closed";

export interface MarketStatus {
  status: MarketStatusKind;
  label: string;
  message: string;
  todayHours: string | null;
  isOpenToday: boolean;
  minutesUntilOpen: number | null;
  minutesUntilClose: number | null;
  nextOpening: { day: string; date: Date; fromNow: number } | null;
}

export interface ScheduleRow {
  day: string;
  short: string;
  open: string | null;
  close: string | null;
  isToday: boolean;
}

export interface Bookmark {
  /** e.g. "market:4" or "produce:avocado" */
  key: string;
  type: "market" | "produce";
  id: string;
  name: string;
  subtitle: string;
  image: string;
  note: string;
  addedAt: number;
}

export interface AppData {
  markets: Market[];
  produce: ProduceItem[];
  seasonal: Season[];
  testimonials: Testimonial[];
  farmers: Farmer[];
}
