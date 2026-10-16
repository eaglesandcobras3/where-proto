/** Launch set, plus Holiday & Seasonal for when recurring seasonal events exist. */
export const eventCategories = [
  { slug: "live-music", name: "Live Music" },
  { slug: "farmers-markets", name: "Farmers Markets" },
  { slug: "family-kids", name: "Family & Kids" },
  { slug: "food-drink", name: "Food & Drink" },
  { slug: "festivals-markets", name: "Festivals & Markets" },
  { slug: "arts-culture", name: "Arts & Culture" },
  { slug: "fitness-wellness", name: "Fitness & Wellness" },
  { slug: "community-causes", name: "Community & Causes" },
  { slug: "holiday-seasonal", name: "Holiday & Seasonal" },
] as const;

export function eventCategoryName(slug: string) {
  return eventCategories.find((item) => item.slug === slug)?.name ?? slug;
}

export function eventHasCategory(
  event: { category?: string; categories?: string[] },
  slug: string,
) {
  if (!slug) return true;
  if (event.categories?.includes(slug)) return true;
  const name = eventCategoryName(slug);
  return event.category === name || event.category === slug;
}
