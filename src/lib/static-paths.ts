import { businesses } from "../data/catalog";
import type { Business } from "../data/types";

export function slugPaths<T extends { slug: string }>(items: readonly T[], param = "slug") {
  return items.map((item) => ({
    params: { [param]: item.slug },
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
