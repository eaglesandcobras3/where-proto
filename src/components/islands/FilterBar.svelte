<script lang="ts">
  import { cardImageSrc, listingSizes } from "../../lib/card-image";
  import ListingToolbar from "./ListingToolbar.svelte";

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
    initialQuery = "",
    base = "/",
    searchHref = "",
    totalCount,
    /** Hide local filters when SearchFilterBar drives town/category/query */
    externalChrome = false,
  }: {
    businesses: Biz[];
    towns: Named[];
    categories: Named[];
    tags: Named[];
    initialTown?: string;
    initialCategory?: string;
    initialTag?: string;
    initialOpenNow?: boolean;
    initialQuery?: string;
    base?: string;
    searchHref?: string;
    totalCount?: number;
    externalChrome?: boolean;
  } = $props();

  let town = $state(initialTown);
  let category = $state(initialCategory);
  let tag = $state(initialTag);
  let openNow = $state(initialOpenNow);
  let query = $state(initialQuery);
  let sort = $state<"recommended" | "az">("recommended");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    businesses
      .filter((item) => {
        if (town && item.town !== town) return false;
        if (category && item.category !== category && item.leaf !== category) return false;
        if (tag && !item.tags.includes(tag)) return false;
        if (openNow && !item.openNow) return false;
        if (query.trim()) {
          const hay = `${item.name} ${item.description} ${item.town} ${item.leaf}`.toLowerCase();
          if (!hay.includes(query.trim().toLowerCase())) return false;
        }
        return true;
      })
      .toSorted((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : 0)),
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
    if (externalChrome) {
      const onFilters = (event: Event) => {
        const detail = (
          event as CustomEvent<{ town: string; category: string; query: string; tag?: string }>
        ).detail;
        town = detail.town;
        category = detail.category;
        query = detail.query;
        if (detail.tag !== undefined) tag = detail.tag;
      };
      window.addEventListener("w30a:search-filters", onFilters);
      return () => window.removeEventListener("w30a:search-filters", onFilters);
    }
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => {
      filtersOpen = !media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  });
</script>

<div class="filter-bar" class:external={externalChrome}>
  {#if !externalChrome}
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
  {/if}

  {#if externalChrome}
    <div class="results-head" data-when="legacy">
      <p class="count" aria-live="polite">
        {results.length} {results.length === 1 ? "Result" : "Results"}
      </p>
      <p class="sort">
        Sort by: <span>Recommended Insider</span>
      </p>
    </div>
    <div data-when="unified">
      <ListingToolbar surface="search" count={results.length} sortValue={sort} onSort={(value) => (sort = value as typeof sort)} />
    </div>
  {:else}
    <p class="count" aria-live="polite">
      {results.length} {results.length === 1 ? "result" : "results"}
      {#if searchHref}
        · <a href={searchHref}>Browse all on Search</a>
      {/if}
    </p>
  {/if}

  <div class="listing-grid-split" class:search-grid={externalChrome}>
    {#each results as item}
      <a class="listing-card" class:search-card={externalChrome} href={path(`/business/${item.slug}`)}>
        <div class="listing-tile">
          <img
            src={cardImageSrc(item.name.charAt(0), "2/3")}
            alt=""
            width="112"
            height="168"
            sizes={listingSizes}
          />
        </div>
        <div class="body">
          <h3>{item.name}</h3>
          {#if externalChrome}
            <p class="meta">{townName(item.town)}</p>
            <p class="desc">{item.description}</p>
            <span class="explore">Explore →</span>
          {:else}
            <p class="meta">{townName(item.town)} &middot; {categoryName(item)}</p>
            <p class="desc">{item.description}</p>
            {#if item.openNow}
              <span class="open">Open now</span>
            {/if}
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
    top: var(--header-h);
    z-index: 20;
    background: var(--brand-sand);
    padding-block: var(--size-2);
  }
  .filter-bar.external {
    margin-block: 0;
    position: static;
    background: transparent;
    padding-block: 0;
  }
  .results-head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: var(--size-4);
  }
  .filter-bar.external .count {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--font-size-3);
    font-weight: var(--font-weight-7);
    color: var(--brand-ink);
  }
  .sort {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .sort span {
    font-weight: var(--font-weight-7);
    color: var(--brand-ink);
  }
  .search-grid {
    gap: var(--size-3);
  }
  .search-card {
    text-decoration: none;
    color: inherit;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    padding: var(--size-3);
  }
  .search-card:hover {
    border-color: #b8c4ce;
  }
  .search-card:hover .explore {
    text-decoration: underline;
  }
  .explore {
    display: inline-block;
    margin-top: var(--size-2);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
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
  .listing-card h3 {
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
  }
</style>
