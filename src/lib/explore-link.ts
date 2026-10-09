export function exploreDestination(town: string, category: string) {
  if (town && category) return `/town/${town}/${category}`;
  if (town) return `/town/${town}`;
  if (category) return `/search?category=${encodeURIComponent(category)}`;
  return "/search";
}

export function explorePreview(town: string, category: string) {
  return `whereto30a.com${exploreDestination(town, category)}`;
}

export function exploreButtonLabel(townName: string, categoryName: string, here = false) {
  if (here) return "You are here";
  if (townName && categoryName) return `Explore ${categoryName.toLowerCase()} in ${townName}`;
  if (townName) return `Explore ${townName}`;
  if (categoryName) return `Explore ${categoryName.toLowerCase()} on 30A`;
  return "Explore 30A";
}

export function explorePillLabel(townName: string, categoryName: string) {
  if (townName && categoryName) return `Explore ${townName} / ${categoryName}`;
  if (townName) return `Explore ${townName}`;
  if (categoryName) return `Explore ${categoryName}`;
  return "Explore 30A";
}

export function withBase(base: string, route: string) {
  const root = base.endsWith("/") ? base.slice(0, -1) : base;
  const [pathname = "/", query] = route.split("?");
  const suffix = query ? `?${query}` : "";
  if (pathname === "/") {
    return `${root || ""}/${suffix}`;
  }
  return `${root}${pathname}${suffix}`;
}

export function sameDestination(route: string, currentPath: string, currentSearch = "") {
  const [destPath = route, destQuery] = route.split("?");
  const destSearch = destQuery ? `?${destQuery}` : "";
  const normalize = (value: string) => {
    const withSlash = value.startsWith("/") ? value : `/${value}`;
    return withSlash.replace(/\/$/, "") || "/";
  };
  return normalize(destPath) === normalize(currentPath) && destSearch === currentSearch;
}
