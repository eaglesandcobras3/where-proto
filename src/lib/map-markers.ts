export interface MapMarker {
  label: string;
  rating?: string;
  top: string;
  left: string;
  active?: boolean;
  detail?: string;
  href?: string;
}

/** Deterministic placeholder positions along a coastal band for prototype maps */
export function markersFromNames(
  items: { name: string; slug?: string; href?: string; detail?: string; rating?: string }[],
  limit = 6,
): MapMarker[] {
  const band = [
    { top: "48%", left: "45%" },
    { top: "38%", left: "76%" },
    { top: "52%", left: "26%" },
    { top: "60%", left: "46%" },
    { top: "42%", left: "68%" },
    { top: "58%", left: "23%" },
    { top: "35%", left: "40%" },
    { top: "55%", left: "72%" },
  ];

  return items.slice(0, limit).map((item, index) => {
    const pos = band[index % band.length];
    return {
      label: item.name.length > 18 ? `${item.name.slice(0, 16)}…` : item.name,
      rating: item.rating ?? (4.6 + (index % 4) * 0.1).toFixed(1),
      top: pos.top,
      left: pos.left,
      active: index === 0,
      detail: item.detail,
      href: item.href,
    };
  });
}

export function withViewMap(path: string, search = ""): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.set("view", "map");
  const qs = params.toString();
  return qs ? `${path}?${qs}` : `${path}?view=map`;
}

export function withoutViewMap(path: string, search = ""): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.delete("view");
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
