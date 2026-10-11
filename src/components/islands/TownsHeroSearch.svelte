<script lang="ts">
  let {
    initialQuery = "",
    initialRegion = "",
  }: {
    initialQuery?: string;
    initialRegion?: string;
  } = $props();

  let query = $state(initialQuery);
  let region = $state(initialRegion);
  let vibe = $state("");

  function publish() {
    window.dispatchEvent(
      new CustomEvent("w30a:towns-filters", {
        detail: { query: query.trim(), region, vibe },
      }),
    );
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (region) params.set("region", region);
    if (vibe) params.set("vibe", vibe);
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ query: string; region: string; vibe: string }>).detail;
      if (detail.query !== undefined) query = detail.query;
      region = detail.region;
      vibe = detail.vibe;
    };
    window.addEventListener("w30a:towns-filters", onFilters);
    return () => window.removeEventListener("w30a:towns-filters", onFilters);
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
      placeholder="Search towns, vibes, or neighborhoods…"
      aria-label="Search towns"
      bind:value={query}
    />
  </label>
  <label class="region">
    <span class="visually-hidden">Region</span>
    <select bind:value={region} onchange={publish}>
      <option value="">All Regions (All 30A)</option>
      <option value="west">West 30A</option>
      <option value="central">Central 30A</option>
      <option value="east">East 30A</option>
    </select>
  </label>
  <button class="submit" type="submit">Explore Towns</button>
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
    padding: 0 1rem;
    color: var(--brand-ink-soft);
  }
  .icon {
    display: block;
    flex-shrink: 0;
  }
  .field input,
  .region select {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
  }
  .region select {
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
  .region select {
    width: 100%;
    padding: 0 1rem;
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
  @media (min-width: 800px) {
    .hero-search {
      grid-template-columns: 1fr minmax(10rem, 13rem) auto;
      align-items: stretch;
      gap: 0;
    }
  }
</style>
