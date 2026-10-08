import { businesses } from "../data/catalog";
import type { Business } from "../data/types";

export function slugPaths<T extends { slug: string }>(items: readonly T[]) {
  return items.map((item) => ({
    params: { slug: item.slug },
    props: { item },
  }));
}

export function ownedBusinessPaths() {
  return businesses
    .filter((item): item is Business & { ownerUserSlug: string } => Boolean(item.ownerUserSlug))
    .map((business) => ({
      params: { business: business.slug },
      props: { business },
    }));
}
