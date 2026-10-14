export type ListingSurface = "towns" | "search" | "stays" | "events" | "guides" | "ask";
export type ExploreKey = "towns" | "businesses" | "stays" | "events" | "guides" | "ask";

export const EXPLORE_LINKS: { key: ExploreKey; label: string; path: string }[] = [
  { key: "towns", label: "Towns", path: "/towns" },
  { key: "businesses", label: "Businesses", path: "/search" },
  { key: "stays", label: "Stays", path: "/stays" },
  { key: "events", label: "Events", path: "/events" },
  { key: "guides", label: "Guides", path: "/guides" },
  { key: "ask", label: "Ask", path: "/ask" },
];

export const ENTITY_NOUN: Record<ListingSurface, { singular: string; plural: string }> = {
  towns: { singular: "town", plural: "towns" },
  search: { singular: "business", plural: "businesses" },
  stays: { singular: "stay", plural: "stays" },
  events: { singular: "event", plural: "events" },
  guides: { singular: "guide", plural: "guides" },
  ask: { singular: "question", plural: "questions" },
};

export const SEARCH_PLACEHOLDER: Record<ListingSurface, string> = {
  towns: "Search towns",
  search: "Search businesses",
  stays: "Search stays",
  events: "Search events",
  guides: "Search guides",
  ask: "Search questions",
};

export const SORT_OPTIONS: Record<ListingSurface, { value: string; label: string }[]> = {
  towns: [
    { value: "west-east", label: "West to East" },
    { value: "az", label: "A-Z" },
  ],
  search: [
    { value: "recommended", label: "Recommended" },
    { value: "az", label: "A-Z" },
  ],
  stays: [
    { value: "recommended", label: "Recommended" },
    { value: "price-asc", label: "Price: low to high" },
    { value: "price-desc", label: "Price: high to low" },
    { value: "sleeps", label: "Sleeps: most first" },
  ],
  events: [],
  guides: [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Most popular" },
  ],
  ask: [
    { value: "trending", label: "Trending" },
    { value: "latest", label: "Latest" },
    { value: "unanswered", label: "Unanswered" },
  ],
};

export function resultsHeader(count: number, surface: ListingSurface) {
  const noun = count === 1 ? ENTITY_NOUN[surface].singular : ENTITY_NOUN[surface].plural;
  return `${count} ${noun}`;
}

export function parsePriceValue(label: string) {
  const match = label.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

export function townCountsFor<T>(
  towns: { slug: string; name: string }[],
  items: T[],
  townOf: (item: T) => string | undefined,
) {
  return towns.map((town) => ({
    slug: town.slug,
    name: town.name,
    count: items.filter((item) => townOf(item) === town.slug).length,
  }));
}
