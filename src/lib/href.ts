export function href(path = "/"): string {
  const base = import.meta.env.BASE_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized === "/") {
    return base.endsWith("/") ? base : `${base}/`;
  }

  return `${base.replace(/\/$/, "")}${normalized}`;
}
