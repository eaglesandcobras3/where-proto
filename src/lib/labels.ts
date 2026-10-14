import type { Update } from "../data/types";

export const updateTypeLabels: Record<Update["type"], string> = {
  new_item: "New item",
  limited_offer: "Limited offer",
  business_news: "Business news",
  hours_change: "Hours change",
};

export const eventBucketLabels = {
  now: "Happening now",
  today: "Today",
  weekend: "This weekend",
  month: "Next 30 days",
} as const;

export function formatThrough(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

/** Prototype "today" for live/expired and relative dates. */
export const PROTO_TODAY = "2026-10-08";

/** Relative under 7 days, absolute after. One public pattern. */
export function formatDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  const today = new Date(`${PROTO_TODAY}T12:00:00`);
  const days = Math.round((today.getTime() - date.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function userHandle(slug: string) {
  return `@${slug}`;
}

export function roleLabel(role: "visitor" | "local" | "business-owner" | "admin") {
  switch (role) {
    case "business-owner":
      return "Business owner";
    case "admin":
      return "Admin";
    case "visitor":
      return "Visitor";
    case "local":
      return "Local";
  }
}

export function countLabel(n: number, singular: string, pluralForm?: string) {
  const word = n === 1 ? singular : (pluralForm ?? `${singular}s`);
  return `${n} ${word}`;
}

export function relativeTime(iso: string) {
  return formatDate(iso);
}

export function mapsUrl(address: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}
