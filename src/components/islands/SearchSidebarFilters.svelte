<script lang="ts">
  interface Counted {
    slug: string;
    name: string;
    count: number;
  }

  interface Named {
    slug: string;
    name: string;
  }

  let {
    categories = [],
    towns = [],
    tags = [],
    initialTown = "",
    initialCategory = "",
    initialTag = "",
    total = 0,
  }: {
    categories: Counted[];
    towns: Counted[];
    tags: Named[];
    initialTown?: string;
    initialCategory?: string;
    initialTag?: string;
    total?: number;
  } = $props();

  let town = $state(initialTown);
  let category = $state(initialCategory);
  let tag = $state(initialTag);

  function publish(nextTown = town, nextCategory = category, nextTag = tag) {
    town = nextTown;
    category = nextCategory;
    tag = nextTag;
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") ?? "";
    window.dispatchEvent(
      new CustomEvent("w30a:search-filters", {
        detail: { town: nextTown, category: nextCategory, query, tag: nextTag },
      }),
    );
    if (nextTown) params.set("town", nextTown);
    else params.delete("town");
    if (nextCategory) params.set("category", nextCategory);
    else params.delete("category");
    if (nextTag) params.set("tag", nextTag);
    else params.delete("tag");
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (
        event as CustomEvent<{ town: string; category: string; tag?: string }>
      ).detail;
      town = detail.town;
      category = detail.category;
      if (detail.tag !== undefined) tag = detail.tag;
    };
    window.addEventListener("w30a:search-filters", onFilters);
    return () => window.removeEventListener("w30a:search-filters", onFilters);
  });
</script>

<aside class="side">
  <section class="panel">
    <div class="panel__head">
      <h2>Categories</h2>
      {#if town || category || tag}
        <button class="reset" type="button" onclick={() => publish("", "", "")}>Reset</button>
      {/if}
    </div>
    <ul>
      <li>
        <button class:active={!category} type="button" onclick={() => publish(town, "", tag)}>
          All Listings
          <span class="count">{total}</span>
        </button>
      </li>
      {#each categories as item (item.slug)}
        <li>
          <button
            class:active={category === item.slug}
            type="button"
            onclick={() => publish(town, item.slug, tag)}
          >
            {item.name}
            <span class="count">{item.count}</span>
          </button>
        </li>
      {/each}
    </ul>
  </section>

  <section class="panel">
    <h2>Town Corridor</h2>
    <ul>
      <li>
        <button class:active={!town} type="button" onclick={() => publish("", category, tag)}>
          All 30A Corridor
          <span class="count">{total}</span>
        </button>
      </li>
      {#each towns as item (item.slug)}
        <li>
          <button
            class:active={town === item.slug}
            type="button"
            onclick={() => publish(item.slug, category, tag)}
          >
            {item.name}
            <span class="count">{item.count}</span>
          </button>
        </li>
      {/each}
    </ul>
  </section>

  <section class="panel">
    <h2>Vibe &amp; Amenities</h2>
    <div class="checks">
      {#each tags as item (item.slug)}
        <button
          class="check"
          class:active={tag === item.slug}
          type="button"
          onclick={() => publish(town, category, tag === item.slug ? "" : item.slug)}
        >
          {item.name}
        </button>
      {/each}
    </div>
  </section>
</aside>

<style>
  .side {
    display: grid;
    gap: var(--size-4);
  }
  .panel {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    padding: var(--size-4);
  }
  .panel__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: var(--size-3);
  }
  .panel__head h2 {
    margin: 0;
  }
  h2 {
    margin: 0 0 var(--size-3);
    font-family: var(--font-display);
    font-size: var(--font-size-0);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .reset {
    border: 0;
    background: none;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    color: var(--brand-teal);
    cursor: pointer;
    padding: 0;
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
    background: #f8fafc;
  }
  button.active {
    background: var(--brand-teal);
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
  .checks {
    display: grid;
    gap: 0.35rem;
  }
  .check {
    justify-content: flex-start;
    background: var(--brand-sand-dark);
  }
  .check.active {
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
</style>
