<script lang="ts">
  interface Card {
    slug: string;
    name: string;
    summary: string;
    venue: string;
    whenLabel: string;
    badge: string;
    badgeTone: "blue" | "teal" | "mint";
    footerTag: string;
    types: string[];
  }

  const filters = [
    { slug: "all", label: "All" },
    { slug: "weekend", label: "This Weekend" },
    { slug: "music", label: "Live Music" },
    { slug: "market", label: "Farmer's Markets" },
    { slug: "family", label: "Family & Kids" },
  ] as const;

  let {
    items = [],
    base = "/",
  }: {
    items: Card[];
    base?: string;
  } = $props();

  let active = $state<(typeof filters)[number]["slug"]>("all");

  const visible = $derived(
    active === "all" ? items : items.filter((item) => item.types.includes(active)),
  );

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }
</script>

<div class="wrap">
  <div class="pills" role="group" aria-label="Event types">
    {#each filters as filter (filter.slug)}
      <button
        type="button"
        class:active={active === filter.slug}
        onclick={() => (active = filter.slug)}
      >
        {filter.label}
      </button>
    {/each}
  </div>

  <div class="grid">
    {#each visible as item (item.slug)}
      <article class="card">
        <div class="meta">
          <span class:list={["badge", `badge--${item.badgeTone}`]}>{item.badge}</span>
          <span class="when">{item.whenLabel}</span>
        </div>
        <h3>
          <a href={path(`/event/${item.slug}`)}>{item.name}</a>
        </h3>
        <p class="venue">{item.venue}</p>
        <p class="summary">{item.summary}</p>
        <div class="foot">
          <span>{item.footerTag}</span>
          <a href={path(`/event/${item.slug}`)}>Details →</a>
        </div>
      </article>
    {/each}
  </div>

  {#if visible.length === 0}
    <p class="empty">No events in this type right now — try All or another filter.</p>
  {/if}
</div>

<style>
  .wrap {
    display: grid;
    gap: var(--size-5);
  }
  .pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .pills button {
    border: 0;
    border-radius: var(--radius-pill);
    background: #eef2f4;
    color: var(--brand-deep);
    padding: 0.45rem 0.9rem;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    cursor: pointer;
  }
  .pills button:hover {
    background: #e2e8f0;
  }
  .pills button.active {
    background: var(--brand-teal);
    color: white;
    font-weight: var(--font-weight-7);
  }
  .grid {
    display: grid;
    gap: var(--size-4);
    grid-template-columns: 1fr;
  }
  .card {
    display: grid;
    align-content: start;
    gap: 0.35rem;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    padding: 1.1rem;
    min-width: 0;
  }
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }
  .badge {
    display: inline-flex;
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-pill);
    font-size: 0.625rem;
    font-weight: var(--font-weight-8);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .badge--blue {
    background: #e8f0f8;
    color: #1e4a6e;
  }
  .badge--teal {
    background: #d9f3ef;
    color: #0f5c54;
  }
  .badge--mint {
    background: #e8f5e4;
    color: #3d6b2e;
  }
  .when {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
    white-space: nowrap;
  }
  h3 {
    margin: 0;
    font-size: var(--font-size-2);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
    line-height: 1.3;
  }
  h3 a {
    color: inherit;
  }
  h3 a:hover {
    color: var(--brand-teal);
    text-decoration: none;
  }
  .venue {
    margin: 0;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .summary {
    margin: 0.35rem 0 0.75rem;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid var(--brand-line);
    font-size: var(--font-size-0);
  }
  .foot span {
    color: var(--brand-ink-soft);
  }
  .foot a {
    color: var(--brand-teal);
    font-weight: var(--font-weight-7);
    white-space: nowrap;
  }
  .empty {
    margin: 0;
    color: var(--brand-ink-soft);
    font-size: var(--font-size-1);
  }
  @media (min-width: 700px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (min-width: 1000px) {
    .wrap {
      gap: var(--size-4);
    }
    .pills {
      justify-content: flex-start;
    }
    .grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>
