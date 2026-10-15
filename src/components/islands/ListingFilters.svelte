<script lang="ts">
  import type { ListingSurface } from "../../lib/unified-layout";
  import { SEARCH_PLACEHOLDER } from "../../lib/unified-layout";

  interface Counted {
    slug: string;
    name: string;
    count: number;
  }

  interface Named {
    slug: string;
    name: string;
  }

  interface CategoryGroup {
    slug: string;
    name: string;
    leaves: Counted[];
  }

  interface Secondary {
    key: string;
    label: string;
    options: Counted[];
  }

  interface Note {
    label: string;
    title?: string;
    body: string;
  }

  let {
    surface,
    placement = "rail",
    eventName,
    initialQuery = "",
    extraSearch = "none",
    guestOptions = [],
    initialGuests = "",
    initialFrom = "",
    towns = [],
    initialTown = "",
    townTotal = 0,
    primaryLabel = "Category",
    primaryKey = "category",
    primaryOptions = [],
    initialPrimary = "",
    categoryGroups = [],
    tags = [],
    tagsLabel = "Tags",
    tagsKey = "tag",
    initialTag = "",
    secondaries = [],
    initialSecondaries = {},
    note,
  }: {
    surface: ListingSurface;
    placement?: "rail" | "inline";
    eventName: string;
    initialQuery?: string;
    extraSearch?: "none" | "guests" | "from";
    guestOptions?: Named[];
    initialGuests?: string;
    initialFrom?: string;
    towns?: Counted[];
    initialTown?: string;
    townTotal?: number;
    primaryLabel?: string;
    primaryKey?: string;
    primaryOptions?: Counted[];
    initialPrimary?: string;
    categoryGroups?: CategoryGroup[];
    tags?: Counted[];
    tagsLabel?: string;
    tagsKey?: string;
    initialTag?: string;
    secondaries?: Secondary[];
    initialSecondaries?: Record<string, string>;
    note?: Note;
  } = $props();

  function resolveGroup(value: string) {
    for (const group of categoryGroups) {
      if (group.slug === value) return { parent: group.slug, leaf: "" };
      if (group.leaves.some((leaf) => leaf.slug === value)) return { parent: group.slug, leaf: value };
    }
    return { parent: "", leaf: "" };
  }

  const resolved = resolveGroup(initialPrimary);

  let query = $state(initialQuery);
  let guests = $state(initialGuests);
  let from = $state(initialFrom);
  let town = $state(initialTown);
  let primary = $state(categoryGroups.length ? resolved.leaf || resolved.parent : initialPrimary);
  let parent = $state(resolved.parent);
  let leaf = $state(resolved.leaf);
  let tag = $state(initialTag || initialSecondaries[tagsKey] || "");
  let secondaryValues = $state({ ...initialSecondaries });
  let open = $state(false);
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

  function secondaryOf(key: string) {
    return secondaryValues[key] ?? "";
  }

  let activeCount = $derived(
    [
      query.trim(),
      town,
      categoryGroups.length ? parent : primary,
      leaf,
      tag,
      extraSearch === "guests" ? guests : "",
      extraSearch === "from" ? from : "",
      ...secondaries.map((group) => secondaryOf(group.key)),
    ].filter(Boolean).length,
  );

  function categoryValue() {
    if (categoryGroups.length) return leaf || parent;
    return primary;
  }

  function publish(
    next: {
      town?: string;
      parent?: string;
      leaf?: string;
      primary?: string;
      query?: string;
      guests?: string;
      from?: string;
      tag?: string;
      secondaries?: Record<string, string>;
    } = {},
  ) {
    if (next.town !== undefined) town = next.town;
    if (next.parent !== undefined) parent = next.parent;
    if (next.leaf !== undefined) leaf = next.leaf;
    if (next.primary !== undefined) primary = next.primary;
    if (next.query !== undefined) query = next.query;
    if (next.guests !== undefined) guests = next.guests;
    if (next.from !== undefined) from = next.from;
    if (next.tag !== undefined) tag = next.tag;
    if (next.secondaries) secondaryValues = { ...secondaryValues, ...next.secondaries };

    if (categoryGroups.length) primary = categoryValue();

    const params = new URLSearchParams(window.location.search);
    const detail: Record<string, string> = {
      town,
      query,
      category: surface === "stays" ? guests : surface === "towns" ? primary : categoryValue(),
    };

    if (surface === "towns") {
      detail.region = primary;
      detail.vibe = secondaryOf("vibe");
      detail.beach = secondaryOf("beach");
    } else if (surface === "search") {
      detail.tag = tag;
      detail.group = parent;
    } else if (surface === "stays") {
      detail.kind = primary;
      detail.amenity = tagsKey === "amenity" ? tag : secondaryOf("amenity");
      detail.category = guests;
    } else if (surface === "events") {
      detail.from = from;
      detail.to = params.get("to") ?? "";
    } else if (surface === "guides") {
      detail.source = secondaryOf("source");
    }

    if (tag && !detail[tagsKey]) detail[tagsKey] = tag;

    window.dispatchEvent(new CustomEvent(eventName, { detail }));

    const write = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    write("q", query);
    if (surface !== "towns") write("town", town);
    write(primaryKey, categoryValue());
    if (extraSearch === "guests") write("guests", guests);
    if (extraSearch === "from") write("from", from);
    write(tagsKey, tag);
    for (const group of secondaries) write(group.key, secondaryOf(group.key));

    const nextUrl = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }

  function onParentChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value;
    publish({ parent: value, leaf: "" });
  }

  function pickTag(slug: string) {
    publish({ tag: slug });
    tagQuery = "";
    tagOpen = false;
  }

  function onSearchSubmit(event: Event) {
    event.preventDefault();
    publish();
  }

  function onTagKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      tagOpen = false;
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const first = tagMatches[0];
      if (first) pickTag(first.slug);
    }
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<Record<string, string>>).detail;
      if (detail.query !== undefined) query = detail.query;
      if (detail.town !== undefined && surface !== "towns") town = detail.town;
      if (surface === "towns" && detail.region !== undefined) primary = detail.region;
      else if (surface === "stays" && detail.kind !== undefined) primary = detail.kind;
      else if (detail.category !== undefined && surface !== "stays" && surface !== "towns") {
        if (categoryGroups.length) {
          const next = resolveGroup(detail.category);
          parent = next.parent;
          leaf = next.leaf;
          primary = next.leaf || next.parent;
        } else {
          primary = detail.category;
        }
      }
      if (detail[tagsKey] !== undefined) tag = detail[tagsKey];
      else if (detail.tag !== undefined) tag = detail.tag;
      if (detail.amenity !== undefined && tagsKey !== "amenity") {
        secondaryValues = { ...secondaryValues, amenity: detail.amenity };
      }
      if (detail.vibe !== undefined) secondaryValues = { ...secondaryValues, vibe: detail.vibe };
      if (detail.beach !== undefined) secondaryValues = { ...secondaryValues, beach: detail.beach };
      if (detail.source !== undefined) secondaryValues = { ...secondaryValues, source: detail.source };
      if (detail.from !== undefined) from = detail.from;
      if (surface === "stays" && detail.category !== undefined) guests = detail.category;
    };
    window.addEventListener(eventName, onFilters);
    return () => window.removeEventListener(eventName, onFilters);
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

<div class="filters" class:inline={placement === "inline"} class:side={placement === "rail"} class:is-open={open}>
  <button
    class="filter-toggle"
    type="button"
    aria-expanded={open}
    aria-controls="listing-filter-body"
    onclick={() => (open = !open)}
  >
    <span class="toggle-label">
      <svg class="toggle-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M4 7h16M7 12h10M10 17h4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.85"
          stroke-linecap="round"
        ></path>
      </svg>
      Filters
    </span>
    {#if activeCount}
      <span class="toggle-count">{activeCount}</span>
    {:else}
      <svg class="toggle-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="m6 9 6 6 6-6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.85"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    {/if}
  </button>

  <div class="filter-body" id="listing-filter-body">
    <section class="panel">
      <h2>Search</h2>
      <form class="search-row" onsubmit={onSearchSubmit}>
        <label class="search">
          <span class="sr-only">{SEARCH_PLACEHOLDER[surface]}</span>
          <input
            type="search"
            placeholder={SEARCH_PLACEHOLDER[surface]}
            bind:value={query}
            oninput={() => publish({ query })}
          />
        </label>
        {#if extraSearch === "guests"}
          <label>
            <span class="sr-only">Guests</span>
            <select bind:value={guests} onchange={() => publish({ guests })}>
              <option value="">Any guests</option>
              {#each guestOptions as item (item.slug)}
                <option value={item.slug}>{item.name}</option>
              {/each}
            </select>
          </label>
        {/if}
        {#if extraSearch === "from"}
          <label>
            <span class="sr-only">From date</span>
            <input type="date" bind:value={from} onchange={() => publish({ from })} />
          </label>
        {/if}
      </form>
    </section>

    {#if towns.length}
      <section class="panel">
        <h2>Town</h2>
        <label>
          <span class="sr-only">Town</span>
          <select bind:value={town} onchange={() => publish({ town })}>
            <option value="">All 30A{townTotal ? ` (${townTotal})` : ""}</option>
            {#each towns as item (item.slug)}
              <option value={item.slug}>{item.name}{item.count ? ` (${item.count})` : ""}</option>
            {/each}
          </select>
        </label>
      </section>
    {/if}

    {#if categoryGroups.length}
      <section class="panel">
        <h2>Category</h2>
        <div class="stack">
          <label>
            <span class="field-label">Category</span>
            <select value={parent} onchange={onParentChange}>
              <option value="">All categories</option>
              {#each categoryGroups as item (item.slug)}
                <option value={item.slug}>{item.name}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="field-label">Subcategory</span>
            <select bind:value={leaf} disabled={!parent} onchange={() => publish({ leaf })}>
              {#if parent}
                <option value="">All in {selectedGroup?.name}</option>
                {#each leaves as item (item.slug)}
                  <option value={item.slug}>{item.name}{item.count ? ` (${item.count})` : ""}</option>
                {/each}
              {:else}
                <option value="">Choose a category first</option>
              {/if}
            </select>
          </label>
        </div>
      </section>
    {:else if primaryOptions.length}
      <section class="panel">
        <h2>{primaryLabel}</h2>
        <label>
          <span class="sr-only">{primaryLabel}</span>
          <select bind:value={primary} onchange={() => publish({ primary })}>
            <option value="">All</option>
            {#each primaryOptions as item (item.slug)}
              <option value={item.slug}>{item.name}{item.count ? ` (${item.count})` : ""}</option>
            {/each}
          </select>
        </label>
      </section>
    {/if}

    {#if tags.length}
      <section class="panel">
        <h2>{tagsLabel}</h2>
        <div class="typeahead" bind:this={tagField}>
          {#if selectedTag}
            <button class="picked" type="button" onclick={() => pickTag("")}>
              {selectedTag.name}
              <span aria-hidden="true">×</span>
            </button>
          {/if}
          <label>
            <span class="sr-only">{tagsLabel}</span>
            <input
              type="search"
              placeholder={`Search ${tagsLabel.toLowerCase()}`}
              bind:value={tagQuery}
              onfocus={() => (tagOpen = true)}
              oninput={() => (tagOpen = true)}
              onkeydown={onTagKeydown}
              autocomplete="off"
            />
          </label>
          {#if tagOpen && tagMatches.length}
            <ul class="suggest" role="listbox">
              {#each tagMatches as item (item.slug)}
                <li>
                  <button type="button" onclick={() => pickTag(item.slug)}>
                    {item.name}
                    {#if item.count}<span class="count">{item.count}</span>{/if}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </section>
    {/if}

    {#each secondaries as group (group.key)}
      <section class="panel">
        <h2>{group.label}</h2>
        <label>
          <span class="sr-only">{group.label}</span>
          <select
            value={secondaryOf(group.key)}
            onchange={(event) =>
              publish({ secondaries: { [group.key]: (event.currentTarget as HTMLSelectElement).value } })}
          >
            <option value="">Any</option>
            {#each group.options as item (item.slug)}
              <option value={item.slug}>{item.name}{item.count ? ` (${item.count})` : ""}</option>
            {/each}
          </select>
        </label>
      </section>
    {/each}

    {#if note}
      <section class="listing-note">
        <p class="listing-note__label">{note.label}</p>
        {#if note.title}<p><strong>{note.title}</strong></p>{/if}
        <p>{note.body}</p>
      </section>
    {/if}
  </div>
</div>

<style>
  .filters {
    display: grid;
    gap: var(--size-3);
  }
  .filter-toggle {
    display: none;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    min-height: 2.85rem;
    padding: 0.65rem 1.1rem;
    border: 0;
    border-radius: var(--radius-pill);
    background: var(--brand-teal);
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: white;
    box-shadow: var(--shadow-card);
    cursor: pointer;
  }
  .filter-toggle:hover {
    background: #00796b;
  }
  .filters.is-open .filter-toggle {
    background: var(--brand-deep);
  }
  .toggle-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .toggle-icon,
  .toggle-chevron {
    display: block;
    flex-shrink: 0;
  }
  .filters.is-open .toggle-chevron {
    transform: rotate(180deg);
  }
  .toggle-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.35rem;
    height: 1.35rem;
    padding: 0 0.35rem;
    border-radius: var(--radius-pill);
    background: white;
    color: var(--brand-teal);
    font-size: 0.6875rem;
    font-weight: var(--font-weight-7);
  }
  .filter-body {
    display: grid;
    gap: var(--size-3);
  }
  .inline .filter-body {
    grid-template-columns: 1fr;
  }
  @media (min-width: 720px) {
    .inline .filter-body {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 1023px) {
    .filter-toggle {
      display: inline-flex;
    }
    .filters:not(.is-open) .filter-body {
      display: none;
    }
  }
  .panel {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    padding: var(--size-4);
  }
  h2 {
    margin: 0 0 var(--size-3);
    font-family: var(--font-display);
    font-size: var(--font-size-0);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .search-row,
  .stack {
    display: grid;
    gap: 0.5rem;
  }
  .field-label {
    display: block;
    margin-bottom: 0.3rem;
    font-size: 0.6875rem;
    font-weight: var(--font-weight-7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  input,
  select {
    width: 100%;
    font: inherit;
    font-size: var(--font-size-1);
    padding: 0.55rem 0.7rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    background-color: white;
  }
  select:disabled {
    color: var(--brand-ink-soft);
    background-color: var(--brand-sand);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  .typeahead {
    position: relative;
    display: grid;
    gap: 0.5rem;
  }
  .picked {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 0.4rem;
    border: 0;
    background: var(--brand-teal);
    color: white;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    border-radius: var(--radius-pill);
    padding: 0.35rem 0.7rem;
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
    display: grid;
    gap: 0.15rem;
  }
  .suggest button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.55rem;
    border: 0;
    background: transparent;
    text-align: left;
    font: inherit;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
    padding: 0.45rem 0.55rem;
    cursor: pointer;
    border-radius: var(--radius-2);
  }
  .suggest button:hover {
    background: var(--brand-sand-dark);
  }
  .count {
    font-size: 0.6875rem;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    background: var(--brand-sand-dark);
    border-radius: var(--radius-pill);
    padding: 0.15rem 0.45rem;
  }
</style>
