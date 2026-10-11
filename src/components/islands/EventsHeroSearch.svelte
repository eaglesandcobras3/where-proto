<script lang="ts">
  interface Named {
    slug: string;
    name: string;
  }

  let {
    towns = [],
    initialTown = "",
    initialFrom = "",
    initialTo = "",
    initialQuery = "",
  }: {
    towns: Named[];
    initialTown?: string;
    initialFrom?: string;
    initialTo?: string;
    initialQuery?: string;
  } = $props();

  let town = $state(initialTown);
  let from = $state(initialFrom);
  let to = $state(initialTo);
  let query = $state(initialQuery);
  let category = $state("");

  function publish() {
    window.dispatchEvent(
      new CustomEvent("w30a:events-filters", {
        detail: { town, from, to, query: query.trim(), category },
      }),
    );
    const params = new URLSearchParams();
    if (town) params.set("town", town);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (category) params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (
        event as CustomEvent<{ town: string; from: string; to: string; query: string; category?: string }>
      ).detail;
      town = detail.town;
      from = detail.from;
      to = detail.to;
      if (detail.query !== undefined) query = detail.query;
      if (detail.category !== undefined) category = detail.category;
    };
    window.addEventListener("w30a:events-filters", onFilters);
    return () => window.removeEventListener("w30a:events-filters", onFilters);
  });

  function onSubmit(event: Event) {
    event.preventDefault();
    publish();
  }
</script>

<form class="hero-search" onsubmit={onSubmit}>
  <label class="field">
    <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.25" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
      <path d="M15.2 15.2 20 20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
    </svg>
    <input
      type="search"
      placeholder="Search events, venues, hosts…"
      aria-label="Search events"
      bind:value={query}
    />
  </label>
  <label class="town">
    <span class="visually-hidden">Town</span>
    <select bind:value={town} onchange={publish}>
      <option value="">All 30A Towns</option>
      {#each towns as item (item.slug)}
        <option value={item.slug}>{item.name}</option>
      {/each}
    </select>
  </label>
  <label class="dates">
    <span class="visually-hidden">From date</span>
    <input type="date" bind:value={from} onchange={publish} />
  </label>
  <button class="submit" type="submit">Find Events</button>
</form>

<style>
  .hero-search {
    display: grid;
    gap: 0;
    width: 100%;
    padding: 0;
    overflow: hidden;
    background: white;
    border-radius: var(--radius-3);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }
  .field {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-height: 3rem;
    padding: 0 0.85rem;
    color: var(--brand-ink-soft);
  }
  .icon {
    display: block;
    flex-shrink: 0;
  }
  .field input,
  .dates input,
  .town select {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
  }
  .town select,
  .dates input {
    min-height: 3rem;
    border-radius: 0;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
  }
  .submit {
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
  }
  .town select,
  .dates input {
    width: 100%;
    padding: 0 0.75rem;
    color: var(--brand-ink-soft);
  }
  .submit {
    border: 0;
    border-radius: 0;
    background: var(--brand-teal);
    color: white;
    cursor: pointer;
    padding: 0 1.35rem;
    min-height: 3rem;
    height: 100%;
    align-self: stretch;
  }
  .submit:hover {
    background: #00796b;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
  @media (min-width: 900px) {
    .hero-search {
      grid-template-columns: 1fr minmax(8rem, 10rem) minmax(8rem, 9rem) auto;
      align-items: stretch;
      gap: 0;
    }
  }
</style>
