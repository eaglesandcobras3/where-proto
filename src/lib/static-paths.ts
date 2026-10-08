export function slugPaths<T extends { slug: string }>(items: readonly T[], param = "slug") {
  return items.map((item) => ({
    params: { [param]: item.slug },
    props: { item },
  }));
}
