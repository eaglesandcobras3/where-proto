import type { Update } from "../data/types";

export const POSTED_KEY = "w30a:posted-updates";
export const POSTED_EVENT = "w30a:posted";

export function readPosted(): Update[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(POSTED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Update[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writePosted(update: Update) {
  if (typeof window === "undefined") return;
  const next = [update, ...readPosted().filter((item) => item.slug !== update.slug)];
  window.localStorage.setItem(POSTED_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(POSTED_EVENT));
}

export function postedFor(filter: { businessSlug?: string; townSlug?: string; areaSlug?: string }) {
  return readPosted().filter((item) => {
    if (filter.businessSlug) return item.businessSlug === filter.businessSlug;
    if (filter.areaSlug) return item.areaSlug === filter.areaSlug;
    if (filter.townSlug) return item.townSlug === filter.townSlug;
    return false;
  });
}
