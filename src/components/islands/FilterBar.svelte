<script lang="ts">
  import { onMount, tick } from "svelte";
  import { cardImageSrc, listingSizes } from "../../lib/card-image";
  import { withBase } from "../../lib/explore-link";

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

  interface CategoryGroup extends Named {
    leaves?: Named[];
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
    categories: CategoryGroup[];
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
  let filtersOpen = $state(false);
  let ready = $state(false);
  let townSelect: HTMLSelectElement | undefined = $state();
  let chevron: HTMLButtonElement | undefined = $state();

  function path(route: string) {
    return withBase(base, route);
  }

  function categoryLabel(slug: string) {
    for (const group of categories) {
      if (group.slug === slug) return group.name;
      const leaf = group.leaves?.find((item) => item.slug === slug);
      if (leaf) return leaf.name;
    }
    return slug;
  }

  function townName(slug: string) {
    return towns.find((item) => item.slug === slug)?.name ?? slug;
  }

  function listingCategory(item: Biz) {
    return categoryLabel(item.leaf) || categoryLabel(item.category) || item.leaf;
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

  let pillTown = $derived(town ? townName(town) : "All 30A");
  let pillCategory = $derived(category ? categoryLabel(category) : "");
  let showIndexable = $derived(Boolean(town && category && !tag && !openNow));
  let indexableHref = $derived(path(`/town/${town}/${category}`));

  function clear() {
    town = "";
    category = "";
    tag = "";
    openNow = false;
    query = "";
  }

  async function expand() {
    filtersOpen = true;
    await tick();
    townSelect?.focus();
  }

  async function collapse() {
    filtersOpen = false;
    await tick();
    chevron?.focus();
  }

  function toggle() {
    if (filtersOpen) void collapse();
    else void expand();
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && filtersOpen) {
      event.preventDefault();
      void collapse();
    }
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.pathname.includes("/search")) {
      if (params.has("town")) town = params.get("town") ?? "";
      if (params.has("category")) category = params.get("category") ?? "";
      if (params.has("tag")) tag = params.get("tag") ?? "";
      if (params.has("open")) openNow = params.get("open") === "1";
    }
    filtersOpen = window.matchMedia("(min-width: 640px)").matches;
    ready = true;
  });

  $effect(() => {
    if (!ready || typeof window === "undefined") return;
    if (!window.location.pathname.includes("/search")) return;
    const params = new URLSearchParams();
    if (town) params.set("town", town);
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (openNow) params.set("open", "1");
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
    const now = `${window.location.pathname}${window.location.search}`;
    if (next !== now) history.replaceState(null, "", next);
  });
</script>

<div class="filter-bar">
  <div class="filter-chrome" role="search" onkeydown={onKeydown}>
    <div class="fb-card">
      <div class="fb-row">
        <button class="fb-pill" type="button" onclick={toggle}>
          <span class="fb-pill-text">
            <strong>{pillTown}</strong>
            {#if pillCategory}<span> / {pillCategory}</span>{/if}
          </span>
        </button>
        <button
          bind:this={chevron}
          class="fb-chevron"
          type="button"
          aria-label={filtersOpen ? "Collapse filters" : "Expand filters"}
          aria-expanded={filtersOpen}
          aria-controls="search-filter-panel"
          onclick={toggle}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </button>
        <button class="fb-primary" type="button" onclick={() => (filtersOpen ? void collapse() : void expand())}>
          {results.length} businesses
        </button>
      </div>

      {#if filtersOpen}
        <div class="fb-panel" id="search-filter-panel">
          <div class="fb-fields">
            <label class="fb-label">
              Town
              <select class="fb-control" bind:this={townSelect} bind:value={town}>
                <option value="">All towns</option>
                {#each towns as item}
                  <option value={item.slug}>{item.name}</option>
                {/each}
              </select>
            </label>
            <label class="fb-label">
              Category
              <select class="fb-control" bind:value={category}>
                <option value="">All categories</option>
                {#each categories as group}
                  {#if group.leaves?.length}
                    <optgroup label={group.name}>
                      <option value={group.slug}>{group.name}</option>
                      {#each group.leaves as leaf}
                        <option value={leaf.slug}>{leaf.name}</option>
                      {/each}
                    </optgroup>
                  {:else}
                    <option value={group.slug}>{group.name}</option>
                  {/if}
                {/each}
              </select>
            </label>
            <label class="fb-label">
              Tag
              <select class="fb-control" bind:value={tag}>
                <option value="">Any tag</option>
                {#each tags as item}
                  <option value={item.slug}>{item.name}</option>
                {/each}
              </select>
            </label>
            <label class="fb-label">
              Search
              <input class="fb-control" type="search" bind:value={query} placeholder="Business name or keyword" />
            </label>
          </div>
          <div class="fb-actions">
            <label class="fb-label fb-check">
              <input type="checkbox" bind:checked={openNow} />
              Open now
            </label>
            <button type="button" class="fb-clear" onclick={clear}>Clear</button>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <p class="count" aria-live="polite">
    {results.length} businesses
    {#if searchHref}
      · <a href={searchHref}>Browse all on Search</a>
    {/if}
  </p>

  {#if showIndexable}
    <p class="indexable">
      View the indexable page:
      <a href={indexableHref}>/town/{town}/{category}</a>
    </p>
  {/if}

  <div class="listing-grid-split">
    {#each results as item}
      <a class="listing-card" href={path(`/business/${item.slug}`)}>
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
          <p class="meta">{townName(item.town)} &middot; {listingCategory(item)}</p>
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
  }
  .filter-chrome {
    background: var(--brand-sand);
  }
  .fb-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-3);
    align-items: center;
  }
  .count,
  .indexable {
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
  @media (max-width: 639px) {
    .filter-chrome {
      position: sticky;
      top: 64px;
      z-index: 20;
      padding-block: var(--size-2);
    }
  }
</style>
