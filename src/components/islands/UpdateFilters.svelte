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

  interface Named {
    slug: string;
    name: string;
  }

  let {
    updates = [],
    towns = [],
    types = [],
    base = "/",
  }: { updates: Row[]; towns: Named[]; types: Named[]; base?: string } = $props();

  let town = $state("");
  let type = $state("");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    updates.filter((item) => {
      if (town && item.town !== town) return false;
      if (type && item.type !== type) return false;
      return true;
    }),
  );
</script>

<div class="filters">
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
    Type
    <select bind:value={type}>
      <option value="">All types</option>
      {#each types as item}
        <option value={item.slug}>{item.name}</option>
      {/each}
    </select>
  </label>
</div>

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
    <p>No live updates match those filters.</p>
  {/each}
</div>

<style>
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-3);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-4);
    margin-bottom: var(--size-5);
  }
  label {
    display: grid;
    gap: var(--size-1);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--brand-ink-soft);
  }
  select {
    font: inherit;
    font-size: var(--font-size-1);
    text-transform: none;
    letter-spacing: normal;
    padding: var(--size-2);
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    min-width: 160px;
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
</style>
