<script lang="ts">
  interface Biz {
    slug: string;
    name: string;
    town: string;
    category: string;
    leaf: string;
    description: string;
    tags: string[];
    openNow: boolean;
  }

  interface Named {
    slug: string;
    name: string;
  }

  let {
    businesses = [],
    towns = [],
    categories = [],
    tags = [],
    initialTown = "",
    initialCategory = "",
    initialTag = "",
    initialOpenNow = false,
    base = "/",
    searchHref = "",
    totalCount,
  }: {
    businesses: Biz[];
    towns: Named[];
    categories: Named[];
    tags: Named[];
    initialTown?: string;
    initialCategory?: string;
    initialTag?: string;
    initialOpenNow?: boolean;
    base?: string;
    searchHref?: string;
    totalCount?: number;
  } = $props();

  let town = $state(initialTown);
  let category = $state(initialCategory);
  let tag = $state(initialTag);
  let openNow = $state(initialOpenNow);
  let query = $state("");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    businesses.filter((item) => {
      if (town && item.town !== town) return false;
      if (category && item.category !== category && item.leaf !== category) return false;
      if (tag && !item.tags.includes(tag)) return false;
      if (openNow && !item.openNow) return false;
      if (query.trim()) {
        const hay = `${item.name} ${item.description} ${item.town} ${item.leaf}`.toLowerCase();
        if (!hay.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    }),
  );

  function townName(slug: string) {
    return towns.find((item) => item.slug === slug)?.name ?? slug;
  }

  function categoryName(item: Biz) {
    return (
      categories.find((entry) => entry.slug === item.leaf)?.name ??
      categories.find((entry) => entry.slug === item.category)?.name ??
      item.leaf
    );
  }

  function clear() {
    town = "";
    category = "";
    tag = "";
    openNow = false;
    query = "";
  }

  let activeCount = $derived(
    [town, category, tag, query.trim(), openNow ? "open" : ""].filter(Boolean).length,
  );
  let filtersOpen = $state(true);

  $effect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => {
      filtersOpen = !media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  });
</script>

<div class="filter-bar">
  <details class="filter-panel" bind:open={filtersOpen}>
    <summary>Filters{activeCount ? ` (${activeCount})` : ""}</summary>
    <div class="filters">
    <label class="search">
      Search
      <input type="search" bind:value={query} placeholder="Business name or keyword" />
    </label>
    <label>
      Town
      <select bind:value={town}>
        <option value="">All towns</option>
        {#each towns as item}
          <option value={item.slug}>{item.name}</option>
        {/each}
      </select>
    </label>
    <label>
      Category
      <select bind:value={category}>
        <option value="">All categories</option>
        {#each categories as item}
          <option value={item.slug}>{item.name}</option>
        {/each}
      </select>
    </label>
    <label>
      Tag
      <select bind:value={tag}>
        <option value="">Any tag</option>
        {#each tags as item}
          <option value={item.slug}>{item.name}</option>
        {/each}
      </select>
    </label>
    <label class="check">
      <input type="checkbox" bind:checked={openNow} />
      Open now
    </label>
    <button type="button" class="clear" onclick={clear}>Clear</button>
    </div>
  </details>

  <p class="count" aria-live="polite">
    Showing {results.length} of {totalCount ?? businesses.length} listings
    {#if searchHref}
      · <a href={searchHref}>Browse all on Search</a>
    {/if}
  </p>

  <div class="grid">
    {#each results as item}
      <a class="card" href={path(`/business/${item.slug}`)}>
        <div class="thumb img-placeholder" aria-hidden="true">{item.name.charAt(0)}</div>
        <div class="body">
          <h3>{item.name}</h3>
          <p class="meta">{townName(item.town)} &middot; {categoryName(item)}</p>
          <p class="desc">{item.description}</p>
          {#if item.openNow}
            <span class="open">Open now</span>
          {/if}
        </div>
      </a>
    {:else}
      <p class="empty">No businesses match those filters. Try clearing one.</p>
    {/each}
  </div>
</div>

<style>
  .filter-bar {
    margin-block: var(--size-6);
    position: sticky;
    top: 64px;
    z-index: 20;
    background: var(--brand-sand);
    padding-block: var(--size-2);
  }
  .filter-panel {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
  }
  summary {
    list-style: none;
    cursor: pointer;
    min-height: 44px;
    display: flex;
    align-items: center;
    padding: var(--size-3) var(--size-4);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
  }
  summary::-webkit-details-marker {
    display: none;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-3);
    align-items: end;
    padding: 0 var(--size-4) var(--size-4);
  }
  label {
    display: flex;
    flex-direction: column;
    gap: var(--size-1);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--brand-ink-soft);
  }
  select,
  input[type="search"] {
    font: inherit;
    font-size: var(--font-size-1);
    text-transform: none;
    letter-spacing: normal;
    padding: var(--size-2) var(--size-3);
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    background: white;
    min-width: 160px;
  }
  .search {
    flex: 1 1 220px;
  }
  .check {
    flex-direction: row;
    align-items: center;
    min-height: 44px;
    padding-block: var(--size-2);
  }
  .check input {
    width: 18px;
    height: 18px;
    accent-color: var(--brand-teal);
  }
  .clear {
    font: inherit;
    font-size: var(--font-size-1);
    min-height: 44px;
    padding: var(--size-2) var(--size-4);
    border-radius: var(--radius-4);
    border: 1px solid var(--brand-line);
    background: white;
    cursor: pointer;
  }
  .clear:hover {
    border-color: var(--brand-teal);
    color: var(--brand-teal);
  }
  .count {
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    margin-block: var(--size-4) var(--size-2);
  }
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--size-4);
  }
  .card {
    display: flex;
    gap: var(--size-3);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-3);
    color: var(--brand-ink);
  }
  .card:hover {
    text-decoration: none;
    box-shadow: var(--shadow-card);
  }
  .thumb {
    width: 96px;
    height: 96px;
    flex-shrink: 0;
    border-radius: var(--radius-2);
  }
  .card h3 {
    font-size: var(--font-size-2);
    margin-bottom: var(--size-1);
  }
  .meta,
  .desc {
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    margin-bottom: var(--size-1);
  }
  .desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .open {
    display: inline-block;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
    background: var(--brand-teal-soft);
    border-radius: var(--radius-4);
    padding: 2px var(--size-2);
  }
  .empty {
    color: var(--brand-ink-soft);
  }
  @media (max-width: 400px) {
    .card {
      flex-direction: column;
    }
    .thumb {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
    }
    .desc {
      -webkit-line-clamp: 1;
    }
  }
  @media (min-width: 640px) {
    .filter-bar {
      position: static;
      padding-block: 0;
      background: transparent;
    }
    summary {
      display: none;
    }
    .filters {
      padding: var(--size-4);
    }
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
  }
</style>
