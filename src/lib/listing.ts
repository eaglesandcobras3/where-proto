import { businessBySlug, categoryBySlug, leafBySlug, tagBySlug, townBySlug } from "../data/catalog";
import type { Crumb } from "./crumbs";
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

type BusinessPathFields = {
  slug: string;
  townSlug?: string;
  town?: string;
  categorySlug?: string;
  category?: string;
  leafSlug?: string;
  leaf?: string;
};

/** Public business URL: /town/{town}/{parent}/{leaf}/{slug} */
export function businessPath(item: BusinessPathFields) {
  const town = item.townSlug ?? item.town ?? "";
  const group = item.categorySlug ?? item.category ?? "";
  const leaf = item.leafSlug ?? item.leaf ?? "";
  if (!town || !group || !leaf) return `/business/${item.slug}`;
  return `/town/${town}/${group}/${leaf}/${item.slug}`;
}

export function businessPathBySlug(slug: string) {
  const biz = businessBySlug(slug);
  return biz ? businessPath(biz) : `/business/${slug}`;
}

export function businessCrumbs(item: Pick<Business, "name" | "townSlug" | "categorySlug" | "leafSlug">): Crumb[] {
  const town = townBySlug(item.townSlug);
  const group = categoryBySlug(item.categorySlug);
  const leaf = leafBySlug(item.leafSlug);
  return [
    { label: "Towns", path: "/towns" },
    ...(town ? [{ label: town.name, path: `/town/${town.slug}` }] : []),
    ...(group ? [{ label: group.name, path: `/town/${item.townSlug}/${group.slug}` }] : []),
    ...(leaf ? [{ label: leaf.name, path: `/town/${item.townSlug}/${leaf.slug}` }] : []),
    { label: item.name },
  ];
}
