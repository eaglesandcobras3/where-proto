import { leafBySlug, tagBySlug, townBySlug } from "../data/catalog";
import type { Business } from "../data/types";

export interface FilterBusiness {
  slug: string;
  name: string;
  town: string;
  category: string;
  leaf: string;
  description: string;
  tags: string[];
  openNow: boolean;
}

export function toFilterBusiness(item: Business): FilterBusiness {
  return {
    slug: item.slug,
    name: item.name,
    town: item.townSlug,
    category: item.categorySlug,
    leaf: item.leafSlug,
    description: item.summary,
    tags: item.tagSlugs,
    openNow: item.openNow,
  };
}

export function categoryLabel(slug: string) {
  return leafBySlug(slug)?.name ?? leafBySlug(slug)?.groupName ?? slug;
}

export function townLabel(slug: string) {
  return townBySlug(slug)?.name ?? slug;
}

export function tagLabel(slug: string) {
  return tagBySlug(slug)?.name ?? slug;
}
