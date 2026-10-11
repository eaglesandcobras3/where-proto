<script lang="ts">
  interface Named {
    slug: string;
    name: string;
  }

  type Entity = "businesses" | "stays" | "events" | "guides" | "ask";

  const entities: { slug: Entity; name: string; path: string; placeholder: string }[] = [
    {
      slug: "businesses",
      name: "Businesses & Dining",
      path: "/search",
      placeholder: "Search cafes, shops, dining…",
    },
    {
      slug: "stays",
      name: "Stays & Rentals",
      path: "/stays",
      placeholder: "Search inns, cottages, rentals…",
    },
    {
      slug: "events",
      name: "Events & Happenings",
      path: "/events",
      placeholder: "Search concerts, markets, gatherings…",
    },
    {
      slug: "guides",
      name: "Guides & Articles",
      path: "/guides",
      placeholder: "Search guides and itineraries…",
    },
    {
      slug: "ask",
      name: "Ask Community",
      path: "/ask",
      placeholder: "Ask about carts, parking, dining…",
    },
  ];

  let {
    towns = [],
    base = "/",
  }: {
    towns: Named[];
    base?: string;
  } = $props();

  let entity = $state<Entity>("businesses");
  let town = $state("");
  let query = $state("");

  let current = $derived(entities.find((item) => item.slug === entity) ?? entities[0]);

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  function go(nextEntity: Entity, nextQuery = query, nextTown = town) {
    const target = entities.find((item) => item.slug === nextEntity) ?? entities[0];
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextTown) params.set("town", nextTown);
    const qs = params.toString();
    window.location.href = `${path(target.path)}${qs ? `?${qs}` : ""}`;
  }

  function onSubmit(event: Event) {
    event.preventDefault();
    go(entity, query, town);
  }

</script>

<div class="home-search">
  <div class="pills" role="group" aria-label="What to search">
    {#each entities as item (item.slug)}
      <button
        class:active={entity === item.slug}
        type="button"
        onclick={() => (entity = item.slug)}
      >
        {item.name}
      </button>
    {/each}
  </div>

  <form class="bar" onsubmit={onSubmit}>
    <label class="field">
      <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.25" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
        <path
          d="M15.2 15.2 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
        ></path>
      </svg>
      <input type="search" placeholder={current.placeholder} aria-label="Search query" bind:value={query} />
    </label>
    <label class="town">
      <span class="visually-hidden">Town</span>
      <select bind:value={town} aria-label="Town">
        <option value="">All Towns</option>
        {#each towns as item (item.slug)}
          <option value={item.slug}>{item.name}</option>
        {/each}
      </select>
    </label>
    <button class="submit" type="submit">Search 30A →</button>
  </form>
</div>

<style>
  .home-search {
    display: grid;
    gap: var(--size-4);
    width: 100%;
    max-width: 52rem;
    margin-inline: auto;
  }
  .pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.4rem;
  }
  .pills button {
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-pill);
    background: white;
    color: var(--brand-deep);
    padding: 0.4rem 0.85rem;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    cursor: pointer;
  }
  .pills button:hover {
    border-color: var(--brand-teal);
    color: var(--brand-teal);
  }
  .pills button.active {
    background: var(--brand-deep);
    border-color: var(--brand-deep);
    color: white;
    font-weight: var(--font-weight-7);
  }
  .bar {
    display: grid;
    gap: 0.5rem;
    padding: 0.5rem;
    background: white;
    border: 1px solid #cbd5e1;
    border-radius: var(--radius-4);
    box-shadow: var(--shadow-card-hover);
  }
  .field {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-height: 2.75rem;
    padding: 0 0.65rem;
    color: var(--brand-ink-soft);
  }
  .icon {
    display: block;
    flex-shrink: 0;
  }
  .field input,
  .town select {
    flex: 1;
    min-width: 0;
    width: 100%;
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
  }
  .town {
    display: flex;
    align-items: center;
    border-top: 1px solid var(--brand-line);
    padding: 0 0.35rem;
  }
  .town select {
    min-height: 2.5rem;
    padding: 0 0.5rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
  }
  .submit {
    border: 0;
    border-radius: var(--radius-3);
    background: var(--brand-deep);
    color: white;
    min-height: 2.85rem;
    padding: 0 1.25rem;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    cursor: pointer;
    white-space: nowrap;
  }
  .submit:hover {
    background: #163545;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
  @media (min-width: 768px) {
    .bar {
      grid-template-columns: 1fr minmax(11rem, 14rem) auto;
      align-items: stretch;
      gap: 0;
    }
    .bar:has(.field + .submit) {
      grid-template-columns: 1fr auto;
    }
    .town {
      border-top: 0;
      border-left: 1px solid var(--brand-line);
    }
    .submit {
      margin-left: 0.35rem;
    }
  }
</style>
