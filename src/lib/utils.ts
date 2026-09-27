import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Market } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ------------------------------------------------------------------ *
 * Geography — haversine distance + browser geolocation
 * ------------------------------------------------------------------ */
export interface Coords {
  lat: number;
  lng: number;
}

export function distanceKm(a: Coords, b: Coords): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(la1) * Math.cos(la2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Keyless Google Maps embed (no API key required). */
export function mapEmbedUrl(market: Market): string {
  const q = encodeURIComponent(`${market.name}, ${market.address}`);
  return `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
}

export function mapLinkUrl(market: Market): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${market.lat},${market.lng}`,
  )}`;
}

/** Requests geolocation, resolving to null when denied / unavailable. */
export function requestLocation(): Promise<Coords | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60_000 },
    );
  });
}

/** Simulated fallback centre so proximity sorting still works without GPS. */
export const CITY_CENTER: Coords = { lat: 45.5152, lng: -122.6784 };

/* ------------------------------------------------------------------ *
 * Bookmark export / share (fully client-side)
 * ------------------------------------------------------------------ */
export interface ExportableRow {
  name: string;
  type: string;
  subtitle: string;
  note: string;
  url: string;
}

export function downloadTextFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function buildExportContents(rows: ExportableRow[], title: string): string {
  const line = "=".repeat(58);
  const out: string[] = [
    line,
    `  ${title.toUpperCase()}`,
    `  Exported ${new Date().toLocaleString()}`,
    `  ${rows.length} saved ${rows.length === 1 ? "item" : "items"}`,
    line,
    "",
  ];
  rows.forEach((r, i) => {
    out.push(`${String(i + 1).padStart(2, "0")}. ${r.name}`);
    out.push(`    Type     : ${r.type}`);
    out.push(`    Where    : ${r.subtitle}`);
    if (r.note.trim()) out.push(`    My note  : ${r.note.trim()}`);
    out.push(`    Link     : ${r.url}`);
    out.push("");
  });
  out.push(line, "  FreshFind — Fresh All Along.", line);
  return out.join("\n");
}

/** Uses the native share sheet when available, clipboard otherwise. */
export async function shareContent(title: string, text: string, url: string): Promise<"shared" | "copied" | "failed"> {
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title, text, url });
      return "shared";
    }
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      return "copied";
    }
  } catch {
    /* user dismissed the share sheet */
  }
  return "failed";
}

/* ------------------------------------------------------------------ *
 * Simulated visitor counter — deterministic per session, stored locally.
 * ------------------------------------------------------------------ */
const VISITOR_KEY = "freshfind.visitor.count";

export function getVisitorCount(): number {
  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    if (raw) return Number(raw);
    const base = 12482 + Math.floor(Math.random() * 640);
    localStorage.setItem(VISITOR_KEY, String(base));
    return base;
  } catch {
    return 12482;
  }
}

export function bumpVisitorCount(): number {
  try {
    const next = getVisitorCount() + 1;
    localStorage.setItem(VISITOR_KEY, String(next));
    return next;
  } catch {
    return 12482;
  }
}

/* ------------------------------------------------------------------ *
 * Misc helpers
 * ------------------------------------------------------------------ */
export const cxJoin = (arr: string[]) => arr.join(" · ");

export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait = 220) {
  let t: number | undefined;
  return (...args: A) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
}

export const CATEGORY_ICONS: Record<string, string> = {
  Fruits: "🍓",
  Vegetables: "🥕",
  Herbs: "🌿",
  Dairy: "🧈",
  "Baked Goods": "🥖",
  Honey: "🍯",
  "Organic Products": "🌾",
  Other: "🧺",
};
