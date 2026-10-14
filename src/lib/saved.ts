export type SavedEntityType = "business" | "stay" | "event" | "guide" | "town" | "area";

export const DEFAULT_COLLECTION = "My 30A trip";
export const SAVED_STORAGE_KEY = "w30a:saved";
export const SAVED_EVENT = "w30a:saved";

export interface SavedItem {
  type: SavedEntityType;
  slug: string;
  collection: string;
}

export function readSaved(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedItem[];
    return Array.isArray(parsed) ? parsed.filter((item) => item.type && item.slug) : [];
  } catch {
    return [];
  }
}

export function writeSaved(items: SavedItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(SAVED_EVENT));
}

export function isSaved(type: SavedEntityType, slug: string, items = readSaved()) {
  return items.some((item) => item.type === type && item.slug === slug);
}

export function savedItem(type: SavedEntityType, slug: string, items = readSaved()) {
  return items.find((item) => item.type === type && item.slug === slug);
}

export function collectionsFrom(items = readSaved()) {
  const names = new Set<string>([DEFAULT_COLLECTION]);
  for (const item of items) names.add(item.collection || DEFAULT_COLLECTION);
  return [...names];
}

export function saveItem(type: SavedEntityType, slug: string, collection = DEFAULT_COLLECTION) {
  const items = readSaved().filter((item) => !(item.type === type && item.slug === slug));
  items.unshift({ type, slug, collection: collection.trim() || DEFAULT_COLLECTION });
  writeSaved(items);
}

export function unsaveItem(type: SavedEntityType, slug: string) {
  writeSaved(readSaved().filter((item) => !(item.type === type && item.slug === slug)));
}

export function seedSaved(seed: Array<Pick<SavedItem, "type" | "slug">>) {
  const current = readSaved();
  if (current.length > 0) return current;
  const next = seed.map((item) => ({ ...item, collection: DEFAULT_COLLECTION }));
  writeSaved(next);
  return next;
}
