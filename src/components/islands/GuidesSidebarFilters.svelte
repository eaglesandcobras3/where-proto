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
    topics = [],
    initialTown = "",
    initialTopic = "",
    total = 0,
  }: {
    towns: TownCount[];
    topics: Named[];
    initialTown?: string;
    initialTopic?: string;
    total?: number;
  } = $props();

  let town = $state(initialTown);
  let topic = $state(initialTopic);

  function publish(nextTown = town, nextTopic = topic) {
    town = nextTown;
    topic = nextTopic;
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") ?? "";
    window.dispatchEvent(
      new CustomEvent("w30a:guides-filters", {
        detail: { town: nextTown, category: nextTopic, query },
      }),
    );
    if (nextTown) params.set("town", nextTown);
    else params.delete("town");
    if (nextTopic) params.set("topic", nextTopic);
    else params.delete("topic");
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ town: string; category: string; query: string }>).detail;
      town = detail.town;
      topic = detail.category;
    };
    window.addEventListener("w30a:guides-filters", onFilters);
    return () => window.removeEventListener("w30a:guides-filters", onFilters);
  });
</script>

<aside class="side">
  <section class="panel">
    <div class="panel__head">
      <h2>Communities &amp; Towns</h2>
      {#if town || topic}
        <button class="reset" type="button" onclick={() => publish("", "")}>Reset</button>
      {/if}
    </div>
    <ul>
      <li>
        <button class:active={!town} type="button" onclick={() => publish("", topic)}>
          All 30A
          <span class="count">{total}</span>
        </button>
      </li>
      {#each towns as item (item.slug)}
        <li>
          <button class:active={town === item.slug} type="button" onclick={() => publish(item.slug, topic)}>
            {item.name}
            <span class="count">{item.count}</span>
          </button>
        </li>
      {/each}
    </ul>
  </section>

  <section class="panel">
    <h2>Popular Topics</h2>
    <div class="topics">
      {#each topics as item (item.slug)}
        <button
          class="topic"
          class:active={topic === item.slug}
          type="button"
          onclick={() => publish(town, topic === item.slug ? "" : item.slug)}
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
    padding-bottom: var(--size-3);
    border-bottom: 1px solid var(--brand-sand-dark);
  }
  .panel__head h2 {
    margin: 0;
  }
  h2 {
    margin: 0 0 var(--size-3);
    padding-bottom: var(--size-3);
    border-bottom: 1px solid var(--brand-sand-dark);
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
  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .topic {
    width: auto;
    justify-content: center;
    background: var(--brand-sand-dark);
    border-radius: var(--radius-2);
    padding: 0.4rem 0.7rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
  }
  .topic.active {
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
</style>
