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
      new CustomEvent("w30a:ask-filters", {
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
    window.addEventListener("w30a:ask-filters", onFilters);
    return () => window.removeEventListener("w30a:ask-filters", onFilters);
  });
</script>

<aside class="side">
  <section class="panel">
    <h2>Communities &amp; Towns</h2>
    <ul>
      <li>
        <button class:active={!town} type="button" onclick={() => publish("", topic)}>
          <span class="dot" aria-hidden="true"></span>
          All 30A
          <span class="count">{total}</span>
        </button>
      </li>
      {#each towns as item (item.slug)}
        <li>
          <button class:active={town === item.slug} type="button" onclick={() => publish(item.slug, topic)}>
            <span class="dot" aria-hidden="true"></span>
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

  <section class="callout">
    <p class="callout__label">Leave No Trace</p>
    <p>Pack out what you pack in, stay on marked paths, and respect dune fencing along 30A.</p>
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
    border: 1px solid var(--ask-line, var(--brand-line));
    border-radius: var(--radius-card, 0.75rem);
    box-shadow: var(--shadow-card);
    padding: var(--size-4);
  }
  h2 {
    margin: 0 0 var(--size-3);
    font-size: var(--font-size-0);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.15rem;
  }
  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    border: 0;
    background: transparent;
    text-align: left;
    font: inherit;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
    padding: 0.45rem 0.25rem;
    cursor: pointer;
    border-radius: 0.4rem;
  }
  button:hover {
    background: #f4f7f8;
  }
  button.active {
    color: var(--ask-navy, var(--brand-deep));
    font-weight: var(--font-weight-7);
  }
  button.active .dot {
    background: var(--ask-teal, var(--brand-teal));
  }
  .dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: #d5dde3;
    flex-shrink: 0;
  }
  .count {
    margin-left: auto;
    color: var(--ask-teal, var(--brand-teal));
    font-weight: var(--font-weight-7);
    font-size: var(--font-size-0);
  }
  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }
  .topic {
    width: auto;
    border: 1px solid var(--ask-line, var(--brand-line));
    background: #f4f8f9;
    border-radius: 999px;
    padding: 0.35rem 0.75rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
  }
  .topic.active {
    background: var(--ask-teal-soft, var(--brand-teal-soft));
    border-color: var(--ask-teal, var(--brand-teal));
    color: var(--ask-navy, var(--brand-deep));
  }
  .callout {
    background: var(--brand-sun-soft, #fff7d6);
    border-color: #f0e2a0;
  }
  .callout__label {
    margin: 0 0 0.35rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-8);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8a6d12;
  }
  .callout p:last-child {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
  }
</style>
