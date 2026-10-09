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

  interface Named {
    slug: string;
    name: string;
  }

  let {
    events = [],
    towns = [],
    categories = [],
    base = "/",
  }: { events: Row[]; towns: Named[]; categories: string[]; base?: string } = $props();

  let town = $state("");
  let category = $state("");
  let from = $state("");
  let to = $state("");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    events.filter((item) => {
      if (town && item.town !== town) return false;
      if (category && item.category !== category) return false;
      return true;
    }),
  );

  const buckets: { key: Row["bucket"]; label: string }[] = [
    { key: "now", label: "Happening now" },
    { key: "today", label: "Today" },
    { key: "weekend", label: "This weekend" },
    { key: "month", label: "Next 30 days" },
  ];
</script>

<div class="filters">
  <label>From <input type="date" bind:value={from} /></label>
  <label>To <input type="date" bind:value={to} /></label>
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
    Category
    <select bind:value={category}>
      <option value="">All categories</option>
      {#each categories as item}
        <option value={item}>{item}</option>
      {/each}
    </select>
  </label>
</div>
<p class="note">Date range is a wireframe control. Groupings below stay live-only.</p>

{#each buckets as bucket}
  {@const group = results.filter((item) => item.bucket === bucket.key)}
  {#if group.length}
    <section class="group">
      <h2>{bucket.label}</h2>
      <div class="listing-grid-full">
        {#each group as event}
          {@const dateBits = event.when.split(",")[0] ?? event.when}
          <a class="card" href={path(`/event/${event.slug}`)}>
            <div class="dateblock" aria-hidden="true">
              <span class="day">{dateBits}</span>
              {#if event.time}<span class="time">{event.time}</span>{/if}
            </div>
            <div class="body">
              <h3>{event.name}</h3>
              <p>{event.time ?? event.when}</p>
              <p>{event.venue ?? "30A"}{event.townName ? ` · ${event.townName}` : ""}</p>
              {#if event.category}<span class="tag">{event.category}</span>{/if}
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}
{/each}

<style>
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-3);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-4);
    margin-bottom: var(--size-3);
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
  input,
  select {
    font: inherit;
    font-size: var(--font-size-1);
    text-transform: none;
    letter-spacing: normal;
    padding: var(--size-2);
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
  }
  .note {
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
    margin-bottom: var(--size-6);
  }
  .group {
    margin-bottom: var(--size-7);
  }
  h2 {
    font-size: var(--font-size-4);
    margin-bottom: var(--size-3);
  }
  .card {
    display: flex;
    gap: var(--size-3);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-3);
    color: var(--brand-ink);
  }
  .card:hover {
    text-decoration: none;
    box-shadow: var(--shadow-card);
  }
  .dateblock {
    flex: 0 0 64px;
    width: 64px;
    height: 64px;
    aspect-ratio: 1 / 1;
    background: var(--brand-teal-soft);
    border-radius: var(--radius-2);
    padding: 4px;
    text-align: center;
    color: var(--brand-deep);
    display: grid;
    place-content: center;
  }
  .day {
    display: block;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-8);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .time {
    display: block;
    margin-top: var(--size-1);
    font-size: 0.68rem;
  }
  .body {
    min-width: 0;
  }
  .tag {
    display: inline-block;
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
    margin: 0 0 var(--size-1);
    font-size: var(--font-size-2);
  }
  p {
    margin: 0 0 var(--size-2);
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
</style>
