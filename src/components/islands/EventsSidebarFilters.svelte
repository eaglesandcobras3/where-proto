<script lang="ts">
  interface TownCount {
    slug: string;
    name: string;
    count: number;
  }

  interface Named {
    slug: string;
    name: string;
  }

  let {
    towns = [],
    categories = [],
    initialTown = "",
    initialCategory = "",
    total = 0,
  }: {
    towns: TownCount[];
    categories: Named[];
    initialTown?: string;
    initialCategory?: string;
    total?: number;
  } = $props();

  let town = $state(initialTown);
  let category = $state(initialCategory);

  function publish(nextTown = town, nextCategory = category) {
    town = nextTown;
    category = nextCategory;
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") ?? "";
    const from = params.get("from") ?? "";
    const to = params.get("to") ?? "";
    window.dispatchEvent(
      new CustomEvent("w30a:events-filters", {
        detail: { town: nextTown, from, to, query, category: nextCategory },
      }),
    );
    if (nextTown) params.set("town", nextTown);
    else params.delete("town");
    if (nextCategory) params.set("category", nextCategory);
    else params.delete("category");
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ town: string; category?: string }>).detail;
      town = detail.town;
      if (detail.category !== undefined) category = detail.category;
    };
    window.addEventListener("w30a:events-filters", onFilters);
    return () => window.removeEventListener("w30a:events-filters", onFilters);
  });
</script>

<aside class="side">
  <section class="panel">
    <p class="eyebrow">Towns</p>
    <ul>
      <li>
        <button class:active={!town} type="button" onclick={() => publish("", category)}>
          All 30A Corridor
          <span class="count">{total}</span>
        </button>
      </li>
      {#each towns as item (item.slug)}
        <li>
          <button class:active={town === item.slug} type="button" onclick={() => publish(item.slug, category)}>
            {item.name}
            <span class="count">{item.count}</span>
          </button>
        </li>
      {/each}
    </ul>
  </section>

  <section class="panel">
    <p class="eyebrow">Categories</p>
    <div class="topics">
      {#each categories as item (item.slug)}
        <button
          class="topic"
          class:active={category === item.slug}
          type="button"
          onclick={() => publish(town, category === item.slug ? "" : item.slug)}
        >
          {item.name}
        </button>
      {/each}
    </div>
  </section>

  <section class="callout">
    <p class="callout__label">Local Ordinance</p>
    <p class="callout__title">Bonfire Permits Required</p>
    <p>
      Evening beach bonfires need a Walton County permit and a licensed container. Leave no trace at dune accesses.
    </p>
  </section>
</aside>

<style>
  .side {
    display: grid;
    gap: var(--size-4);
  }
  .panel,
  .callout {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    padding: var(--size-4);
  }
  .eyebrow {
    margin-bottom: var(--size-3);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.25rem;
  }
  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.55rem;
    border: 0;
    background: transparent;
    text-align: left;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-5);
    color: var(--brand-ink);
    padding: 0.55rem 0.75rem;
    cursor: pointer;
    border-radius: var(--radius-2);
  }
  button:hover {
    background: var(--brand-sand);
  }
  button.active {
    background: var(--brand-deep);
    color: white;
    font-weight: var(--font-weight-7);
  }
  button.active .count {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  .count {
    font-size: 0.6875rem;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    background: var(--brand-sand-dark);
    border-radius: var(--radius-pill);
    padding: 0.15rem 0.45rem;
  }
  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .topic {
    width: auto;
    justify-content: center;
    background: var(--brand-sand-dark);
    border-radius: var(--radius-pill);
    padding: 0.4rem 0.75rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
  }
  .topic.active {
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
  .callout {
    background: var(--brand-sun-soft);
    border-color: var(--brand-line);
    border-left: 4px solid var(--brand-sun);
  }
  .callout__label {
    margin: 0 0 0.35rem;
    font-size: 0.625rem;
    font-weight: var(--font-weight-8);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brand-coral);
  }
  .callout__title {
    margin: 0 0 0.35rem;
    font-family: var(--font-display);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-ink);
  }
  .callout p:last-child {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-coral);
    line-height: 1.5;
  }
</style>
