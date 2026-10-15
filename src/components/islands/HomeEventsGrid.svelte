<script lang="ts">
  interface Card {
    slug: string;
    name: string;
    summary: string;
    town: string;
    venue: string;
    whenLabel: string;
    types: string[];
    reactions?: { label: "up" | "heart" | "wow"; count: number }[];
  }

  const emoji = { heart: "❤️", up: "👍", wow: "😮" } as const;

  function reactionView(reactions: Card["reactions"]) {
    const list = (reactions ?? []).filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
    return {
      faces: list.map((item) => emoji[item.label]),
      total: list.reduce((sum, item) => sum + item.count, 0),
    };
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
  <div class="filter">
    <label class="select-wrap" for="home-event-type">
      <span class="sr-only">Event type</span>
      <select
        id="home-event-type"
        bind:value={active}
        aria-label="Event types"
      >
        {#each filters as filter (filter.slug)}
          <option value={filter.slug}>{filter.label}</option>
        {/each}
      </select>
    </label>

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
  </div>

  <div class="grid h-scroll">
    {#each visible as item (item.slug)}
      {@const reaction = reactionView(item.reactions)}
      <article class="card">
        <div class="meta">
          {#if reaction.total > 0}
            <span class="reactions" aria-label="{reaction.total} reactions">
              <span class="faces" aria-hidden="true">
                {#each reaction.faces as face}
                  <span class="face">{face}</span>
                {/each}
              </span>
              {reaction.total}
            </span>
          {/if}
          <span class="when">{item.whenLabel}</span>
        </div>
        <h3>
          <a href={path(`/event/${item.slug}`)}>{item.name}</a>
        </h3>
        <p class="town">{item.town}</p>
        {#if item.venue && item.venue !== item.town}
          <p class="venue">{item.venue}</p>
        {/if}
        <p class="summary">{item.summary}</p>
        <a class="details" href={path(`/event/${item.slug}`)}>Details →</a>
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
  .filter {
    min-width: 0;
  }
  .select-wrap {
    position: relative;
    display: inline-block;
    width: auto;
    max-width: 100%;
    min-width: 10.5rem;
  }
  .select-wrap::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0.95rem;
    width: 0.7rem;
    height: 0.45rem;
    transform: translateY(-50%);
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%230C232E' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
      center / contain no-repeat;
    pointer-events: none;
  }
  .select-wrap select {
    display: block;
    width: 100%;
    min-height: 2.75rem;
    padding: 0.65rem 2.4rem 0.65rem 1rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-pill);
    background: white;
    color: var(--brand-deep);
    font-weight: var(--font-weight-6);
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }
  .select-wrap select:focus {
    outline: 2px solid var(--brand-teal);
    outline-offset: 1px;
  }
  .pills {
    display: none;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .pills button {
    flex: 0 0 auto;
    white-space: nowrap;
    border: 0;
    border-radius: var(--radius-pill);
    background: var(--brand-sand);
    color: var(--brand-deep);
    padding: 0.45rem 0.9rem;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    cursor: pointer;
  }
  .pills button:hover {
    background: var(--brand-line);
  }
  .pills button.active {
    background: var(--brand-teal);
    color: white;
    font-weight: var(--font-weight-7);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
  .grid {
    gap: var(--size-4);
  }
  .card {
    flex: 0 0 min(20rem, 85vw);
    width: min(20rem, 85vw);
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
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.15rem;
  }
  .reactions {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin-right: auto;
    font-size: 0.6875rem;
    font-weight: var(--font-weight-5);
    color: var(--brand-ink-soft);
    line-height: 1.4;
  }
  .faces {
    display: inline-flex;
    align-items: center;
  }
  .face {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    margin-left: -0.28rem;
    border-radius: 50%;
    background: white;
    box-shadow: 0 0 0 1px white;
    font-size: 0.72rem;
    line-height: 1;
  }
  .face:first-child {
    margin-left: 0;
  }
  .town {
    margin: 0;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-5);
    color: var(--brand-ink-soft);
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
    text-decoration: none;
  }
  .venue {
    margin: 0;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .summary {
    margin: 0.35rem 0 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .details {
    justify-self: start;
    margin-top: 0.85rem;
    color: var(--brand-teal);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    white-space: nowrap;
  }
  .details:hover {
    text-decoration: none;
  }
  .empty {
    margin: 0;
    color: var(--brand-ink-soft);
    font-size: var(--font-size-1);
  }
  @media (min-width: 1000px) {
    .wrap {
      gap: var(--size-4);
    }
    .select-wrap {
      display: none;
    }
    .pills {
      display: flex;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      overflow: visible;
      scroll-snap-type: none;
      padding-bottom: 0;
    }
    .card {
      flex: none;
      width: auto;
    }
  }
</style>
