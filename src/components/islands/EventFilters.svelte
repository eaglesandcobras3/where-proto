<script lang="ts">
  interface Row {
    slug: string;
    name: string;
    town?: string;
    townName?: string;
    when: string;
    time?: string;
    venue?: string;
    category?: string;
    bucket: "now" | "today" | "weekend" | "month";
  }

  let {
    events = [],
    initialTown = "",
    initialQuery = "",
    base = "/",
  }: {
    events: Row[];
    initialTown?: string;
    initialQuery?: string;
    base?: string;
  } = $props();

  let town = $state(initialTown);
  let query = $state(initialQuery);
  // Date range is wireframe chrome — kept for sync with the filter bar
  let from = $state("");
  let to = $state("");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    events.filter((item) => {
      if (town && item.town !== town) return false;
      if (query.trim()) {
        const hay = `${item.name} ${item.venue ?? ""} ${item.townName ?? ""} ${item.category ?? ""} ${item.when}`.toLowerCase();
        if (!hay.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    }),
  );

  const buckets: { key: Row["bucket"]; label: string }[] = [
    { key: "now", label: "Happening now" },
    { key: "today", label: "Today" },
    { key: "weekend", label: "This weekend" },
    { key: "month", label: "Next 30 days" },
  ];

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ town: string; from: string; to: string; query: string }>).detail;
      town = detail.town;
      from = detail.from;
      to = detail.to;
      query = detail.query;
    };
    window.addEventListener("w30a:events-filters", onFilters);
    return () => window.removeEventListener("w30a:events-filters", onFilters);
  });
</script>

<p class="count" aria-live="polite">
  {results.length} {results.length === 1 ? "event" : "events"}
  {#if from || to}
    <span class="wire"> · date range is a wireframe control</span>
  {/if}
</p>

{#each buckets as bucket}
  {@const group = results.filter((item) => item.bucket === bucket.key)}
  {#if group.length}
    <section class="group">
      <h2>{bucket.label}</h2>
      <div class="listing-grid-full">
        {#each group as event}
          <a class="card" href={path(`/event/${event.slug}`)}>
            <p class="when">{event.when}{event.time ? ` · ${event.time}` : ""}</p>
            <h3>{event.name}</h3>
            <p class="meta">{event.venue ?? "30A"}{event.townName ? ` · ${event.townName}` : ""}</p>
            {#if event.category}<span class="tag">{event.category}</span>{/if}
          </a>
        {/each}
      </div>
    </section>
  {/if}
{/each}

{#if !results.length}
  <p class="empty">No events match those filters. Try clearing one.</p>
{/if}

<style>
  .count {
    margin: 0 0 var(--size-5);
    font-weight: var(--font-weight-6);
  }
  .wire {
    font-weight: var(--font-weight-5);
    color: var(--brand-ink-soft);
  }
  .group {
    margin-bottom: var(--size-7);
  }
  h2 {
    font-size: var(--font-size-4);
    margin-bottom: var(--size-3);
  }
  .card {
    display: grid;
    gap: var(--size-2);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-4);
    color: var(--brand-ink);
  }
  .card:hover {
    text-decoration: none;
    box-shadow: var(--shadow-card);
  }
  .when {
    margin: 0;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .tag {
    justify-self: start;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--brand-teal);
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-4);
    padding: 2px var(--size-2);
  }
  h3 {
    margin: 0;
    font-size: var(--font-size-2);
    color: var(--brand-deep);
  }
  .meta {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .empty {
    color: var(--brand-ink-soft);
  }
</style>
