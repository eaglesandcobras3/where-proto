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
    primaryLabel,
    primaryKey,
    primaryOptions = [],
    primaryType = "list",
    initialPrimary = "",
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
    primaryLabel: string;
    primaryKey: string;
    primaryOptions?: Counted[];
    primaryType?: "list" | "chips";
    initialPrimary?: string;
    secondaries?: Secondary[];
    initialSecondaries?: Record<string, string>;
    note?: Note;
  } = $props();

  let query = $state(initialQuery);
  let guests = $state(initialGuests);
  let from = $state(initialFrom);
  let town = $state(initialTown);
  let primary = $state(initialPrimary);
  let secondaryValues = $state({ ...initialSecondaries });

  function secondaryOf(key: string) {
    return secondaryValues[key] ?? "";
  }

  function publish(next: {
    town?: string;
    primary?: string;
    query?: string;
    guests?: string;
    from?: string;
    secondaries?: Record<string, string>;
  } = {}) {
    if (next.town !== undefined) town = next.town;
    if (next.primary !== undefined) primary = next.primary;
    if (next.query !== undefined) query = next.query;
    if (next.guests !== undefined) guests = next.guests;
    if (next.from !== undefined) from = next.from;
    if (next.secondaries) secondaryValues = { ...secondaryValues, ...next.secondaries };

    const params = new URLSearchParams(window.location.search);
    const detail: Record<string, string> = {
      town,
      query,
      category: surface === "stays" ? guests : surface === "towns" ? primary : primary,
    };

    if (surface === "towns") {
      detail.region = primary;
      detail.vibe = secondaryOf("vibe");
      detail.beach = secondaryOf("beach");
    } else if (surface === "search") {
      detail.tag = secondaryOf("tag");
    } else if (surface === "stays") {
      detail.kind = primary;
      detail.amenity = secondaryOf("amenity");
      detail.category = guests;
    } else if (surface === "events") {
      detail.from = from;
      detail.to = params.get("to") ?? "";
    } else if (surface === "guides") {
      detail.source = secondaryOf("source");
    }

    window.dispatchEvent(new CustomEvent(eventName, { detail }));

    const write = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    write("q", query);
    if (surface !== "towns") write("town", town);
    write(primaryKey, primary);
    if (extraSearch === "guests") write("guests", guests);
    if (extraSearch === "from") write("from", from);
    for (const group of secondaries) write(group.key, secondaryOf(group.key));

    const nextUrl = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }

  function togglePrimary(slug: string) {
    publish({ primary: primary === slug ? "" : slug });
  }

  function toggleSecondary(key: string, slug: string) {
    publish({ secondaries: { [key]: secondaryOf(key) === slug ? "" : slug } });
  }

  function onSearchSubmit(event: Event) {
    event.preventDefault();
    publish();
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
        primary = detail.category;
      }
      if (detail.tag !== undefined) secondaryValues = { ...secondaryValues, tag: detail.tag };
      if (detail.amenity !== undefined) secondaryValues = { ...secondaryValues, amenity: detail.amenity };
      if (detail.vibe !== undefined) secondaryValues = { ...secondaryValues, vibe: detail.vibe };
      if (detail.beach !== undefined) secondaryValues = { ...secondaryValues, beach: detail.beach };
      if (detail.source !== undefined) secondaryValues = { ...secondaryValues, source: detail.source };
      if (detail.from !== undefined) from = detail.from;
      if (surface === "stays" && detail.category !== undefined) guests = detail.category;
    };
    window.addEventListener(eventName, onFilters);
    return () => window.removeEventListener(eventName, onFilters);
  });
</script>

<div class="filters" class:inline={placement === "inline"} class:side={placement === "rail"}>
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
      <ul>
        <li>
          <button class:active={!town} type="button" onclick={() => publish({ town: "" })}>
            All 30A
            <span class="count">{townTotal}</span>
          </button>
        </li>
        {#each towns as item (item.slug)}
          <li>
            <button class:active={town === item.slug} type="button" onclick={() => publish({ town: item.slug })}>
              {item.name}
              <span class="count">{item.count}</span>
            </button>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <section class="panel">
    <h2>{primaryLabel}</h2>
    {#if primaryType === "chips"}
      <div class="chips">
        {#each primaryOptions as item (item.slug)}
          <button
            class="chip"
            class:active={primary === item.slug}
            type="button"
            onclick={() => togglePrimary(item.slug)}
          >
            {item.name}
            <span class="count">{item.count}</span>
          </button>
        {/each}
      </div>
    {:else}
      <ul>
        <li>
          <button class:active={!primary} type="button" onclick={() => publish({ primary: "" })}>
            All
            <span class="count">{primaryOptions.reduce((sum, item) => sum + item.count, 0)}</span>
          </button>
        </li>
        {#each primaryOptions as item (item.slug)}
          <li>
            <button class:active={primary === item.slug} type="button" onclick={() => togglePrimary(item.slug)}>
              {item.name}
              <span class="count">{item.count}</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  {#each secondaries as group (group.key)}
    <section class="panel">
      <h2>{group.label}</h2>
      <div class="chips">
        {#each group.options as item (item.slug)}
          <button
            class="chip"
            class:active={secondaryOf(group.key) === item.slug}
            type="button"
            onclick={() => toggleSecondary(group.key, item.slug)}
          >
            {item.name}
            <span class="count">{item.count}</span>
          </button>
        {/each}
      </div>
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

<style>
  .filters {
    display: grid;
    gap: var(--size-4);
  }
  .inline {
    grid-template-columns: 1fr;
  }
  @media (min-width: 720px) {
    .inline {
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
  .search-row {
    display: grid;
    gap: 0.5rem;
  }
  input,
  select {
    width: 100%;
    font: inherit;
    font-size: var(--font-size-1);
    padding: 0.55rem 0.7rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    background: white;
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
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.25rem;
  }
  button {
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
    font-weight: var(--font-weight-5);
    color: var(--brand-ink);
    padding: 0.55rem 0.75rem;
    cursor: pointer;
    border-radius: var(--radius-2);
  }
  button:hover {
    background: #f8fafc;
  }
  button.active {
    background: var(--brand-teal);
    color: white;
    font-weight: var(--font-weight-7);
  }
  button.active .count {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  .count {
    font-size: 0.6875rem;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    background: var(--brand-sand-dark);
    border-radius: var(--radius-pill);
    padding: 0.15rem 0.45rem;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .chip {
    width: auto;
    justify-content: center;
    background: var(--brand-sand-dark);
    border-radius: var(--radius-pill);
    padding: 0.4rem 0.7rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
  }
  .chip.active {
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
  .chip.active .count {
    background: rgba(0, 150, 136, 0.12);
    color: var(--brand-teal);
  }
</style>
