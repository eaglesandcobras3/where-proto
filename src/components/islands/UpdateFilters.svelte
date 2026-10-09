<script lang="ts">
  interface Row {
    slug: string;
    title: string;
    body: string;
    type: string;
    typeLabel: string;
    throughLabel: string;
    sourceName?: string;
    sourceHref?: string;
    town?: string;
  }

  let {
    updates = [],
    initialTown = "",
    initialType = "",
    initialQuery = "",
    base = "/",
  }: {
    updates: Row[];
    initialTown?: string;
    initialType?: string;
    initialQuery?: string;
    base?: string;
  } = $props();

  let town = $state(initialTown);
  let type = $state(initialType);
  let query = $state(initialQuery);

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    updates.filter((item) => {
      if (town && item.town !== town) return false;
      if (type && item.type !== type) return false;
      if (query.trim()) {
        const hay = `${item.title} ${item.body} ${item.sourceName ?? ""} ${item.typeLabel}`.toLowerCase();
        if (!hay.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    }),
  );

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ town: string; category: string; query: string }>).detail;
      town = detail.town;
      type = detail.category;
      query = detail.query;
    };
    window.addEventListener("w30a:updates-filters", onFilters);
    return () => window.removeEventListener("w30a:updates-filters", onFilters);
  });
</script>

<p class="count" aria-live="polite">
  {results.length} {results.length === 1 ? "update" : "updates"}
</p>

<div class="grid">
  {#each results as update}
    <article class="card">
      <div class="top">
        <span>{update.typeLabel}</span>
        <small>Through {update.throughLabel}</small>
      </div>
      {#if update.sourceName}<p class="source-name">{update.sourceName}</p>{/if}
      <h3><a href={path(`/updates/${update.slug}`)}>{update.title}</a></h3>
      <p>{update.body}</p>
      {#if update.sourceHref && update.sourceName}
        <p><a href={update.sourceHref}>{update.sourceName}</a></p>
      {/if}
    </article>
  {:else}
    <p class="empty">No live updates match those filters.</p>
  {/each}
</div>

<style>
  .count {
    margin: 0 0 var(--size-4);
    font-weight: var(--font-weight-6);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--size-4);
  }
  .card {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-4);
  }
  .top {
    display: flex;
    justify-content: space-between;
    gap: var(--size-3);
    margin-bottom: var(--size-2);
  }
  span {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--brand-teal);
    background: var(--brand-teal-soft);
    border-radius: var(--radius-4);
    padding: 2px var(--size-2);
  }
  small {
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .source-name,
  h3 {
    margin: 0 0 var(--size-2);
  }
  p {
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .empty {
    color: var(--brand-ink-soft);
  }
</style>
