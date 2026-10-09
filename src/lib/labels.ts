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

export function relativeTime(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  const today = new Date("2026-10-08T12:00:00");
  const days = Math.round((today.getTime() - date.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function mapsUrl(address: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}
