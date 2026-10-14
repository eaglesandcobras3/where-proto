<script lang="ts">
  import ListingToolbar from "./ListingToolbar.svelte";

  interface GuideItem {
    slug: string;
    title: string;
    summary: string;
    town?: string;
    townSlug?: string;
    category?: string;
    topic?: string;
    author: string;
    role: string;
    source: "whereto" | "community";
    minutes: number;
    popularity: number;
    views?: number;
    publishedAt?: string;
    featured?: boolean;
  }

  let {
    guides = [],
    initialTown = "",
    initialCategory = "",
    initialQuery = "",
    base = "/",
  }: {
    guides: GuideItem[];
    initialTown?: string;
    initialCategory?: string;
    initialQuery?: string;
    base?: string;
  } = $props();

  let town = $state(initialTown);
  let category = $state(initialCategory);
  let query = $state(initialQuery);
  let source = $state<"whereto" | "community" | "">("whereto");
  let sort = $state<"latest" | "popular">("latest");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  const topicWords: Record<string, string[]> = {
    "first-timers": ["first", "timer", "arrive", "tabs"],
    "getting-around": ["bike", "cart", "walk", "car", "lsv"],
    dining: ["dining", "food", "eat"],
    family: ["family", "kids"],
    history: ["called", "history", "name"],
    "town-compare": ["different", "vs", "compare", "feels"],
  };

  let results = $derived(
    [...guides]
      .filter((item) => {
        if (source && item.source !== source) return false;
        if (town && item.townSlug !== town) return false;
        if (category) {
          const words = topicWords[category] ?? [category];
          const hay = `${item.title} ${item.summary} ${item.topic ?? ""}`.toLowerCase();
          if (!words.some((word) => hay.includes(word))) return false;
        }
        if (query.trim()) {
          const hay = `${item.title} ${item.summary} ${item.town ?? ""}`.toLowerCase();
          if (!hay.includes(query.trim().toLowerCase())) return false;
        }
        return true;
      })
      .toSorted((a, b) => {
        const aViews = a.views ?? a.popularity;
        const bViews = b.views ?? b.popularity;
        if (sort === "popular") return bViews - aViews || a.title.localeCompare(b.title);
        return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") || b.minutes - a.minutes;
      }),
  );

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ town: string; category: string; query: string }>).detail;
      town = detail.town;
      category = detail.category;
      query = detail.query;
      const extra = detail as { source?: string };
      if (extra.source !== undefined) source = extra.source as typeof source;
    };
    window.addEventListener("w30a:guides-filters", onFilters);
    return () => window.removeEventListener("w30a:guides-filters", onFilters);
  });
</script>

<section class="feed">
  
  <div>
    <ListingToolbar surface="guides" count={results.length} sortValue={sort} onSort={(value) => (sort = value as typeof sort)} />
  </div>

  <div class="list">
    {#each results as item, index (item.slug)}
      <article class="card">
        <div class="tags">
          <span class="tag">{item.town ?? "All 30A"}</span>
          {#if item.topic}<span class="tag tag--topic">{item.topic}</span>{/if}
        </div>
        <h3><a href={path(`/guide/${item.slug}`)}>{item.title}</a></h3>
        <p class="excerpt">{item.summary}</p>
        {#if item.featured || index === 0}
          <div class="banner img-placeholder" aria-hidden="true">
            <span class="featured">Featured Manual</span>
          </div>
        {/if}
        <div class="footer">
          <span class="mins">
            {item.minutes} min read
            <span class="by"> · {item.author}</span>
          </span>
          <a class="join" href={path(`/guide/${item.slug}`)}>
            {item.featured || index === 0 ? "Read complete guide" : "Read guide"} →
          </a>
        </div>
      </article>
    {:else}
      <p class="empty">No guides match those filters.</p>
    {/each}
  </div>
</section>

<style>
  .feed {
    display: grid;
    gap: var(--size-4);
    min-width: 0;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-3);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    padding: 0.75rem 1rem;
  }
  .source {
    display: inline-flex;
    flex-wrap: wrap;
    padding: 0.2rem;
    border-radius: var(--radius-pill);
    background: var(--brand-sand-dark);
    gap: 0.15rem;
  }
  .source button {
    border: 0;
    background: transparent;
    border-radius: var(--radius-pill);
    padding: 0.4rem 0.9rem;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    cursor: pointer;
  }
  .source button.active {
    background: var(--brand-selected);
    color: white;
    font-weight: var(--font-weight-7);
  }
  .toolbar__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--size-3);
  }
  .count {
    margin: 0;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .sort {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.65rem;
  }
  .sort__label {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .sort button {
    border: 0;
    background: none;
    padding: 0;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    cursor: pointer;
  }
  .sort button.active {
    color: var(--brand-selected);
    box-shadow: inset 0 -2px 0 currentColor;
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
    padding: var(--size-5);
  }
  .card:hover {
    box-shadow: var(--shadow-card-hover);
    border-color: var(--brand-line);
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-bottom: var(--size-3);
  }
  .tag {
    font-size: 0.6875rem;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    background: var(--brand-sand-dark);
    border-radius: var(--radius-pill);
    padding: 0.2rem 0.55rem;
  }
  .tag--topic {
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
  h3 {
    margin: 0 0 0.5rem;
    font-family: var(--font-display);
    font-size: var(--font-size-3);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
    line-height: 1.3;
  }
  h3 a {
    color: inherit;
  }
  h3 a:hover {
    text-decoration: none;
  }
  .excerpt {
    margin: 0;
    color: var(--brand-ink-soft);
    font-size: var(--font-size-1);
    line-height: 1.55;
  }
  .banner {
    position: relative;
    margin-top: var(--size-4);
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-2);
    overflow: hidden;
  }
  .featured {
    position: absolute;
    top: 0.65rem;
    left: 0.65rem;
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-pill);
    background: rgba(12, 35, 46, 0.85);
    color: white;
    font-size: 0.625rem;
    font-weight: var(--font-weight-8);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--size-3);
    margin-top: var(--size-4);
    padding-top: var(--size-3);
    border-top: 1px solid var(--brand-sand-dark);
    font-size: var(--font-size-1);
  }
  .mins {
    color: var(--brand-ink-soft);
  }
  .by {
    font-weight: var(--font-weight-4);
  }
  .join {
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
