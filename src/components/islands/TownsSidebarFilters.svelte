<script lang="ts">
  interface Named {
    slug: string;
    name: string;
  }

  let {
    vibes = [],
    beachTypes = [],
    initialVibe = "",
  }: {
    vibes: Named[];
    beachTypes: Named[];
    initialVibe?: string;
  } = $props();

  let vibe = $state(initialVibe);
  let beach = $state("");

  function publish(nextVibe = vibe, nextBeach = beach) {
    vibe = nextVibe;
    beach = nextBeach;
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") ?? "";
    const region = params.get("region") ?? "";
    window.dispatchEvent(
      new CustomEvent("w30a:towns-filters", {
        detail: { query, region, vibe: nextVibe, beach: nextBeach },
      }),
    );
    if (nextVibe) params.set("vibe", nextVibe);
    else params.delete("vibe");
    if (nextBeach) params.set("beach", nextBeach);
    else params.delete("beach");
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ vibe: string; beach?: string }>).detail;
      vibe = detail.vibe;
      if (detail.beach !== undefined) beach = detail.beach;
    };
    window.addEventListener("w30a:towns-filters", onFilters);
    return () => window.removeEventListener("w30a:towns-filters", onFilters);
  });
</script>

<aside class="side">
  <section class="panel">
    <h2>Town Vibe</h2>
    <div class="checks">
      {#each vibes as item (item.slug)}
        <button
          class="check"
          class:active={vibe === item.slug}
          type="button"
          onclick={() => publish(vibe === item.slug ? "" : item.slug, beach)}
        >
          {item.name}
        </button>
      {/each}
    </div>
  </section>

  <section class="panel">
    <h2>Beach Access Types</h2>
    <div class="checks">
      {#each beachTypes as item (item.slug)}
        <button
          class="check"
          class:active={beach === item.slug}
          type="button"
          onclick={() => publish(vibe, beach === item.slug ? "" : item.slug)}
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
  h2 {
    margin: 0 0 var(--size-3);
    font-family: var(--font-display);
    font-size: var(--font-size-0);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .checks {
    display: grid;
    gap: 0.35rem;
  }
  .check {
    width: 100%;
    border: 0;
    background: var(--brand-sand-dark);
    border-radius: var(--radius-2);
    padding: 0.55rem 0.75rem;
    text-align: left;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-5);
    color: var(--brand-ink);
    cursor: pointer;
  }
  .check:hover {
    background: #eef2f6;
  }
  .check.active {
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
    font-weight: var(--font-weight-7);
  }
</style>
