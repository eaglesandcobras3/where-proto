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

  interface CategoryGroup {
    slug: string;
    name: string;
    leaves: Named[];
  }

  let {
    businesses = [],
    towns = [],
    categories = [],
    categoryGroups = [],
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
    categoryGroups?: CategoryGroup[];
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

  function resolveGroup(value: string) {
    for (const group of categoryGroups) {
      if (group.slug === value) return { parent: group.slug, leaf: "" };
      if (group.leaves.some((leaf) => leaf.slug === value)) return { parent: group.slug, leaf: value };
    }
    return { parent: "", leaf: "" };
  }

  const resolved = resolveGroup(initialCategory);

  let town = $state(initialTown);
  let parent = $state(resolved.parent);
  let leaf = $state(resolved.leaf);
  let category = $state(categoryGroups.length ? resolved.leaf || resolved.parent : initialCategory);
  let tag = $state(initialTag);
  let openNow = $state(initialOpenNow);
  let query = $state(initialQuery);
  let sort = $state<"recommended" | "az">("recommended");
  let tagQuery = $state("");
  let tagOpen = $state(false);
  let tagField = $state<HTMLElement>();

  let selectedGroup = $derived(categoryGroups.find((item) => item.slug === parent));
  let leaves = $derived(selectedGroup?.leaves ?? []);
  let selectedTag = $derived(tags.find((item) => item.slug === tag));
  let tagMatches = $derived.by(() => {
    const needle = tagQuery.trim().toLowerCase();
    const available = tags.filter((item) => item.slug !== tag);
    if (!needle) return available.slice(0, 8);
    return available
      .filter(
        (item) => item.name.toLowerCase().includes(needle) || item.slug.toLowerCase().includes(needle),
      )
      .slice(0, 8);
  });

  function syncCategory(nextParent = parent, nextLeaf = leaf) {
    category = nextLeaf || nextParent;
  }

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  function listingHref(item: Biz) {
    if (item.town && item.category && item.leaf) {
      return path(`/town/${item.town}/${item.category}/${item.leaf}/${item.slug}`);
    }
    return path(`/business/${item.slug}`);
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
    const raw =
      categories.find((entry) => entry.slug === item.leaf)?.name ??
      categories.find((entry) => entry.slug === item.category)?.name ??
      item.leaf;
    const parts = raw.split(" / ");
    return parts[parts.length - 1] ?? raw;
  }

  function clear() {
    town = "";
    parent = "";
    leaf = "";
    category = "";
    tag = "";
    tagQuery = "";
    openNow = false;
    query = "";
  }

  function onParentChange(event: Event) {
    parent = (event.currentTarget as HTMLSelectElement).value;
    leaf = "";
    syncCategory(parent, "");
  }

  function onLeafChange(event: Event) {
    leaf = (event.currentTarget as HTMLSelectElement).value;
    syncCategory(parent, leaf);
  }

  function pickTag(slug: string) {
    tag = slug;
    tagQuery = "";
    tagOpen = false;
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
        if (categoryGroups.length) {
          const next = resolveGroup(detail.category);
          parent = next.parent;
          leaf = next.leaf;
        }
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

  $effect(() => {
    if (!tagOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && tagField?.contains(event.target)) return;
      tagOpen = false;
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
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
      {#if categoryGroups.length}
        <label>
          Category
          <select value={parent} onchange={onParentChange}>
            <option value="">All categories</option>
            {#each categoryGroups as item (item.slug)}
              <option value={item.slug}>{item.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Subcategory
          <select value={leaf} disabled={!parent} onchange={onLeafChange}>
            {#if parent}
              <option value="">All in {selectedGroup?.name}</option>
              {#each leaves as item (item.slug)}
                <option value={item.slug}>{item.name}</option>
              {/each}
            {:else}
              <option value="">Choose a category first</option>
            {/if}
          </select>
        </label>
      {:else}
        <label>
          Category
          <select bind:value={category}>
            <option value="">All categories</option>
            {#each categories as item}
              <option value={item.slug}>{item.name}</option>
            {/each}
          </select>
        </label>
      {/if}
      <div class="typeahead" bind:this={tagField}>
        <span class="tag-label">Tags</span>
        {#if selectedTag}
          <button class="picked" type="button" onclick={() => pickTag("")}>
            {selectedTag.name}
            <span aria-hidden="true">×</span>
          </button>
        {/if}
        <input
          type="search"
          placeholder="Search tags"
          bind:value={tagQuery}
          onfocus={() => (tagOpen = true)}
          oninput={() => (tagOpen = true)}
          autocomplete="off"
        />
        {#if tagOpen && tagMatches.length}
          <ul class="suggest" role="listbox">
            {#each tagMatches as item (item.slug)}
              <li>
                <button type="button" onclick={() => pickTag(item.slug)}>{item.name}</button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
      <label class="check">
        <input type="checkbox" bind:checked={openNow} />
        Open now
      </label>
      <button type="button" class="clear" onclick={clear}>Clear</button>
      </div>
    </details>
  {/if}

  {#if externalChrome}
    
    <div>
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
      <a class="listing-card" href={listingHref(item)}>
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
          <p class="meta">{townName(item.town)}</p>
          <p class="cat">{categoryName(item)} in {townName(item.town)}</p>
          <p class="desc">{item.description}</p>
          <span class="explore">Explore →</span>
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
  .typeahead {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--size-1);
    min-width: 160px;
  }
  .tag-label {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--brand-ink-soft);
  }
  .picked {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 0.35rem;
    border: 0;
    background: var(--brand-teal);
    color: white;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    border-radius: var(--radius-pill);
    padding: 0.3rem 0.65rem;
    cursor: pointer;
  }
  .suggest {
    position: absolute;
    top: calc(100% + 0.2rem);
    left: 0;
    right: 0;
    z-index: 4;
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    box-shadow: var(--shadow-card-hover);
  }
  .suggest button {
    width: 100%;
    border: 0;
    background: transparent;
    text-align: left;
    font: inherit;
    font-size: var(--font-size-1);
    padding: 0.4rem 0.5rem;
    cursor: pointer;
    border-radius: var(--radius-2);
  }
  .suggest button:hover {
    background: var(--brand-sand-dark);
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
  .cat {
    font-size: var(--font-size-1);
    color: var(--brand-coral);
    font-weight: var(--font-weight-6);
    margin-bottom: var(--size-2);
  }
  .desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .explore {
    display: inline-block;
    margin-top: var(--size-2);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
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
