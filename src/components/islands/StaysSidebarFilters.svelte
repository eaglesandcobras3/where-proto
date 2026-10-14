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
    lodgingTypes = [],
    amenities = [],
    initialTown = "",
    initialKind = "",
    total = 0,
  }: {
    towns: TownCount[];
    lodgingTypes: Named[];
    amenities: Named[];
    initialTown?: string;
    initialKind?: string;
    total?: number;
  } = $props();

  let town = $state(initialTown);
  let kind = $state(initialKind);
  let amenity = $state("");

  function publish(nextTown = town, nextKind = kind, nextAmenity = amenity) {
    town = nextTown;
    kind = nextKind;
    amenity = nextAmenity;
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") ?? "";
    const guests = params.get("guests") ?? "";
    window.dispatchEvent(
      new CustomEvent("w30a:stays-filters", {
        detail: { town: nextTown, category: guests, query, kind: nextKind, amenity: nextAmenity },
      }),
    );
    if (nextTown) params.set("town", nextTown);
    else params.delete("town");
    if (nextKind) params.set("kind", nextKind);
    else params.delete("kind");
    if (nextAmenity) params.set("amenity", nextAmenity);
    else params.delete("amenity");
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ town: string; kind?: string; amenity?: string }>).detail;
      town = detail.town;
      if (detail.kind !== undefined) kind = detail.kind;
      if (detail.amenity !== undefined) amenity = detail.amenity;
    };
    window.addEventListener("w30a:stays-filters", onFilters);
    return () => window.removeEventListener("w30a:stays-filters", onFilters);
  });
</script>

<aside class="side">
  <section class="panel">
    <div class="panel__head">
      <h2>Communities</h2>
      {#if town || kind || amenity}
        <button class="reset" type="button" onclick={() => publish("", "", "")}>Reset</button>
      {/if}
    </div>
    <ul>
      <li>
        <button class:active={!town} type="button" onclick={() => publish("", kind, amenity)}>
          All 30A Corridor
          <span class="count">{total}</span>
        </button>
      </li>
      {#each towns as item (item.slug)}
        <li>
          <button class:active={town === item.slug} type="button" onclick={() => publish(item.slug, kind, amenity)}>
            {item.name}
            <span class="count">{item.count}</span>
          </button>
        </li>
      {/each}
    </ul>
  </section>

  <section class="panel">
    <h2>Lodging Type</h2>
    <div class="checks">
      {#each lodgingTypes as item (item.slug)}
        <button
          class="check"
          class:active={kind === item.slug}
          type="button"
          onclick={() => publish(town, kind === item.slug ? "" : item.slug, amenity)}
        >
          {item.name}
        </button>
      {/each}
    </div>
  </section>

  <section class="panel">
    <h2>Amenities &amp; Perks</h2>
    <div class="checks">
      {#each amenities as item (item.slug)}
        <button
          class="check"
          class:active={amenity === item.slug}
          type="button"
          onclick={() => publish(town, kind, amenity === item.slug ? "" : item.slug)}
        >
          {item.name}
        </button>
      {/each}
    </div>
  </section>

  <section class="callout">
    <p class="callout__label">Walton County Rules</p>
    <p>
      Short-term rental parking and LSV ordinances are enforced. Beach gear must be cleared nightly under Leave No Trace.
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
    border-radius: var(--radius-2);
  }
  .check.active {
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
  .callout {
    background: var(--brand-sun-soft);
    border-color: #fde68a;
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
  .callout p:last-child {
    margin: 0;
    font-size: var(--font-size-1);
    color: #92400e;
    line-height: 1.5;
  }
</style>
