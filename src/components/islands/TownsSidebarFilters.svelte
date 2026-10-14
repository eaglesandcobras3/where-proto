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
    <label class="field">
      <span>Town vibe</span>
      <span class="control">
        <select
          aria-label="Town vibe"
          value={vibe}
          onchange={(event) => publish((event.currentTarget as HTMLSelectElement).value, beach)}
        >
          <option value="">Any vibe</option>
          {#each vibes as item (item.slug)}
            <option value={item.slug}>{item.name}</option>
          {/each}
        </select>
        <svg class="chevron" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
          <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
    </label>

    <label class="field">
      <span>Beach access</span>
      <span class="control">
        <select
          aria-label="Beach access"
          value={beach}
          onchange={(event) => publish(vibe, (event.currentTarget as HTMLSelectElement).value)}
        >
          <option value="">Any beach access</option>
          {#each beachTypes as item (item.slug)}
            <option value={item.slug}>{item.name}</option>
          {/each}
        </select>
        <svg class="chevron" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
          <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
    </label>
  </section>
</aside>

<style>
  .side {
    display: grid;
  }
  .panel {
    display: grid;
    gap: var(--size-4);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    padding: var(--size-4);
  }
  .field {
    display: grid;
    gap: 0.4rem;
  }
  .field > span {
    font-family: var(--font-display);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-8);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .control {
    position: relative;
    display: block;
  }
  select {
    width: 100%;
    appearance: none;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    background: white;
    padding: 0.7rem 2.4rem 0.7rem 0.8rem;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
    color: var(--brand-ink);
    cursor: pointer;
  }
  select:hover {
    border-color: #cbd5e1;
  }
  select:focus-visible {
    outline: 2px solid var(--brand-teal);
    outline-offset: 2px;
  }
  .chevron {
    position: absolute;
    top: 50%;
    right: 0.7rem;
    transform: translateY(-50%);
    color: var(--brand-deep);
    pointer-events: none;
  }
</style>
