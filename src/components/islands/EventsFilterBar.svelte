<script lang="ts">
  import { untrack } from "svelte";

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
    expanded = false,
  }: {
    towns: Named[];
    initialTown?: string;
    initialFrom?: string;
    initialTo?: string;
    initialQuery?: string;
    expanded?: boolean;
  } = $props();

  let open = $state(untrack(() => expanded));
  let town = $state(untrack(() => initialTown));
  let from = $state(untrack(() => initialFrom));
  let to = $state(untrack(() => initialTo));
  let query = $state(untrack(() => initialQuery));
  let panels = $state<HTMLElement>();

  const townLabel = $derived(towns.find((item) => item.slug === town)?.name ?? "All 30A");
  const datesLabel = $derived.by(() => {
    if (from && to) return `${from} – ${to}`;
    if (from) return `From ${from}`;
    if (to) return `Until ${to}`;
    return "Any dates";
  });

  function publish() {
    const detail = { town, from, to, query: query.trim() };
    window.dispatchEvent(new CustomEvent("w30a:events-filters", { detail }));
    const params = new URLSearchParams();
    if (town) params.set("town", town);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (query.trim()) params.set("q", query.trim());
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }

  function expand() {
    open = true;
  }

  function collapse() {
    open = false;
  }

  function submitSearch(event?: Event) {
    event?.preventDefault();
    publish();
    open = false;
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    void town;
    void from;
    void to;
    void query;
    publish();
  });

  $effect(() => {
    if (typeof window === "undefined" || !open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && panels?.contains(event.target)) return;
      collapse();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });
</script>

<div class="search-band" data-expanded={open}>
  <div class="container" bind:this={panels}>
    <div class="collapsed">
      <form class="search-pill" onsubmit={submitSearch}>
        <input type="search" placeholder="Search" bind:value={query} aria-label="Search events" />
        <button class="icon-btn" type="submit" aria-label="Search">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
            <path d="m20 20-4-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
          </svg>
        </button>
      </form>
      <button class="place-pill" type="button" aria-expanded={open} onclick={expand}>
        <span class="place-pill__stack">
          <span class="place-pill__primary">{townLabel}</span>
          <span class="place-pill__secondary">{datesLabel}</span>
        </span>
        <span class="icon-btn" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="currentColor"
              d="M4 7h10.2a2.5 2.5 0 0 0 4.6 0H20v-2h-1.2a2.5 2.5 0 0 0-4.6 0H4V7zm0 12h2.2a2.5 2.5 0 0 0 4.6 0H20v-2H10.8a2.5 2.5 0 0 0-4.6 0H4v2zm0-6h6.2a2.5 2.5 0 0 0 4.6 0H20v-2h-5.2a2.5 2.5 0 0 0-4.6 0H4v2z"
            ></path>
          </svg>
        </span>
      </button>
    </div>

    <div class="expanded">
      <form class="shell" onsubmit={submitSearch}>
        <button class="icon-btn shell__search" type="submit" aria-label="Search">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
            <path d="m20 20-4-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
          </svg>
        </button>

        <label class="field">
          <span>From</span>
          <input type="date" bind:value={from} />
        </label>

        <label class="field">
          <span>To</span>
          <input type="date" bind:value={to} />
        </label>

        <label class="field">
          <span>Where</span>
          <select bind:value={town}>
            <option value="">All 30A</option>
            {#each towns as item (item.slug)}
              <option value={item.slug}>{item.name}</option>
            {/each}
          </select>
        </label>

        <label class="field field--keywords">
          <span>Keywords</span>
          <input type="search" placeholder="Event, venue, or town..." bind:value={query} />
        </label>

        <button class="icon-btn" type="button" aria-label="Collapse filters" onclick={collapse}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 7h10.2a2.5 2.5 0 0 0 4.6 0H20v-2h-1.2a2.5 2.5 0 0 0-4.6 0H4V7zm0 12h2.2a2.5 2.5 0 0 0 4.6 0H20v-2H10.8a2.5 2.5 0 0 0-4.6 0H4v2zm0-6h6.2a2.5 2.5 0 0 0 4.6 0H20v-2h-5.2a2.5 2.5 0 0 0-4.6 0H4v2z"
            ></path>
          </svg>
        </button>
      </form>
    </div>
  </div>
</div>

<style>
  .search-band {
    position: relative;
    z-index: 25;
    background: var(--brand-deep);
    padding-block: var(--size-4);
  }
  .collapsed {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-3);
  }
  .search-pill,
  .place-pill,
  .shell {
    display: flex;
    align-items: center;
    gap: var(--size-2);
    background: white;
    border-radius: 999px;
    min-height: 3.5rem;
  }
  .search-pill {
    flex: 1.2;
    max-width: 28rem;
    padding: 0.3rem 0.35rem 0.3rem 1.25rem;
  }
  .search-pill input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    font: inherit;
    font-size: var(--font-size-2);
    background: transparent;
  }
  .place-pill {
    flex: 0.9;
    max-width: 18rem;
    padding: 0.3rem 0.35rem 0.3rem 1.25rem;
    border: 0;
    text-align: left;
    cursor: pointer;
    color: inherit;
  }
  .place-pill__stack {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 0.05rem;
  }
  .place-pill__primary {
    font-weight: var(--font-weight-7);
    font-size: var(--font-size-2);
  }
  .place-pill__secondary {
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .icon-btn {
    width: 2.75rem;
    height: 2.75rem;
    border: 0;
    border-radius: 50%;
    background: var(--brand-deep);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
  }
  .expanded {
    display: none;
  }
  [data-expanded="true"] .collapsed {
    display: none;
  }
  [data-expanded="true"] .expanded {
    display: block;
  }
  .shell {
    width: min(56rem, 100%);
    margin-inline: auto;
    padding: 0.35rem;
    gap: 0;
  }
  .shell__search {
    margin-right: 0.15rem;
  }
  .field {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 0.1rem;
    padding: 0.45rem 0.75rem;
    border-left: 1px solid var(--brand-line);
  }
  .field span {
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .field select,
  .field input {
    width: 100%;
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-ink);
  }
  .field input[type="date"] {
    min-width: 0;
  }
  .field--keywords {
    flex: 1.2;
    background: var(--brand-sand);
    border-radius: 999px;
    border-left: 0;
    margin-inline: 0.25rem;
  }
  .field--keywords input {
    font-weight: var(--font-weight-5);
  }
  .shell > .icon-btn:last-child {
    margin-left: 0.15rem;
  }
  @media (max-width: 900px) {
    .collapsed,
    .shell {
      flex-direction: column;
      align-items: stretch;
    }
    .search-pill,
    .place-pill,
    .shell {
      max-width: none;
      border-radius: 1.25rem;
    }
    .field {
      border-left: 0;
      border-top: 1px solid var(--brand-line);
    }
    .field--keywords {
      border-radius: 1rem;
    }
  }
</style>
