<script lang="ts">
  import ListingToolbar from "./ListingToolbar.svelte";

  interface TownItem {
    slug: string;
    name: string;
    summary: string;
    tagline: string;
    vibe: string;
    vibeSlug: string;
    region: "west" | "central" | "east";
    beachSlug: string;
    walkScore: number;
    highlights: string[];
    eateries: number;
    accesses: number;
  }

  let {
    towns = [],
    initialQuery = "",
    initialRegion = "",
    initialVibe = "",
    base = "/",
  }: {
    towns: TownItem[];
    initialQuery?: string;
    initialRegion?: string;
    initialVibe?: string;
    base?: string;
  } = $props();

  let query = $state(initialQuery);
  let region = $state(initialRegion);
  let vibe = $state(initialVibe);
  let beach = $state("");
  let sort = $state<"west-east" | "az">("west-east");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    towns
      .filter((item) => {
        if (region && item.region !== region) return false;
        if (vibe && item.vibeSlug !== vibe) return false;
        if (beach && item.beachSlug !== beach) return false;
        if (query.trim()) {
          const hay = `${item.name} ${item.summary} ${item.tagline} ${item.vibe} ${item.highlights.join(" ")}`.toLowerCase();
          if (!hay.includes(query.trim().toLowerCase())) return false;
        }
        return true;
      })
      .toSorted((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : 0)),
  );

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (
        event as CustomEvent<{ query: string; region: string; vibe: string; beach?: string }>
      ).detail;
      query = detail.query;
      region = detail.region;
      vibe = detail.vibe;
      if (detail.beach !== undefined) beach = detail.beach;
    };
    window.addEventListener("w30a:towns-filters", onFilters);
    return () => window.removeEventListener("w30a:towns-filters", onFilters);
  });
</script>

<section class="feed">
  
  <div>
    <ListingToolbar surface="towns" count={results.length} sortValue={sort} onSort={(value) => (sort = value as typeof sort)} />
  </div>

  <div class="list">
    {#each results as item (item.slug)}
      <article class="card">
        <div class="body">
          <div class="title-row">
            <div>
              <h3><a href={path(`/town/${item.slug}`)}>{item.name}</a></h3>
              <p class="tagline">{item.tagline}</p>
            </div>
            <span class="vibe">{item.vibe}</span>
          </div>
          <p class="excerpt">{item.summary}</p>
          <div class="tags">
            {#each item.highlights.slice(0, 3) as tag}
              <span>{tag}</span>
            {/each}
          </div>
          <div class="footer">
            <div class="stats">
              <span>{item.accesses} accesses</span>
              <span>{item.eateries} eateries</span>
            </div>
            <a class="explore" href={path(`/town/${item.slug}`)}>Explore {item.name} →</a>
          </div>
        </div>
      </article>
    {:else}
      <p class="empty">No towns match those filters.</p>
    {/each}
  </div>
</section>

<style>
  .feed {
    display: grid;
    gap: var(--size-4);
    min-width: 0;
  }
  .head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: baseline;
  }
  .head h2 {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--font-size-4);
    color: var(--brand-deep);
  }
  .head span {
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .list {
    display: grid;
    gap: var(--size-4);
  }
  .card {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }
  .card:hover {
    box-shadow: var(--shadow-card-hover);
    border-color: var(--brand-line);
  }
  .body {
    padding: var(--size-5);
    display: grid;
    gap: 0.65rem;
  }
  .title-row {
    display: flex;
    justify-content: space-between;
    gap: var(--size-3);
    align-items: flex-start;
  }
  h3 {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--font-size-3);
    color: var(--brand-deep);
  }
  h3 a {
    color: inherit;
  }
  h3 a:hover {
    text-decoration: none;
  }
  .tagline {
    margin: 0.2rem 0 0;
    font-size: var(--font-size-1);
    color: var(--brand-teal);
    font-weight: var(--font-weight-6);
  }
  .vibe {
    flex-shrink: 0;
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-pill);
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
    font-size: 0.625rem;
    font-weight: var(--font-weight-8);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .excerpt {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.5;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .tags span {
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-pill);
    background: var(--brand-sand-dark);
    font-size: 0.6875rem;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink);
  }
  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 0.35rem;
    border-top: 1px solid var(--brand-sand-dark);
    font-size: var(--font-size-1);
  }
  .stats {
    display: flex;
    gap: 0.85rem;
    color: var(--brand-ink-soft);
  }
  .explore {
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
  }
  .empty {
    color: var(--brand-ink-soft);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    padding: var(--size-5);
  }
</style>
