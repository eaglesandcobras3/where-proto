export function href(path = "/"): string {
  const base = import.meta.env.BASE_URL;
  const [pathname, query] = path.split("?");
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const suffix = query ? `?${query}` : "";

  if (normalized === "/") {
    const root = base.endsWith("/") ? base : `${base}/`;
    return `${root}${suffix}`;
  }

  return `${base.replace(/\/$/, "")}${normalized}${suffix}`;
}

export function absHref(path = "/"): string {
  const site = (import.meta.env.SITE ?? "").replace(/\/$/, "");
  return `${site}${href(path)}`;
}
