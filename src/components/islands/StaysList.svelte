<script lang="ts">
  interface StayItem {
    slug: string;
    name: string;
    town: string;
    townName: string;
    summary: string;
    sleeps: number;
    kind: "inn" | "cottage" | "villa";
    badge: string;
    vibe: string;
    fromPrice: string;
    roomsLabel: string;
  }

  let {
    stays = [],
    initialTown = "",
    initialGuests = "",
    initialKind = "",
    initialQuery = "",
    base = "/",
  }: {
    stays: StayItem[];
    initialTown?: string;
    initialGuests?: string;
    initialKind?: string;
    initialQuery?: string;
    base?: string;
  } = $props();

  let town = $state(initialTown);
  let guests = $state(initialGuests);
  let kind = $state(initialKind);
  let amenity = $state("");
  let query = $state(initialQuery);
  let view = $state<"all" | "beachfront" | "lsv" | "inn">("all");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    stays.filter((item) => {
      if (town && item.town !== town) return false;
      if (guests) {
        const min = Number(guests);
        if (!Number.isNaN(min) && item.sleeps < min) return false;
      }
      if (kind && item.kind !== kind) return false;
      if (view === "inn" && item.kind !== "inn") return false;
      if (view === "beachfront" && item.kind === "inn") return false;
      if (view === "lsv" && item.sleeps < 6) return false;
      if (amenity === "lsv" && item.sleeps < 6) return false;
      if (amenity === "pool" && !/inn|pearl|watercolor/i.test(item.name)) return false;
      if (query.trim()) {
        const hay = `${item.name} ${item.summary} ${item.townName} ${item.badge}`.toLowerCase();
        if (!hay.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    }),
  );

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (
        event as CustomEvent<{ town: string; category: string; query: string; kind?: string; amenity?: string }>
      ).detail;
      town = detail.town;
      guests = detail.category;
      query = detail.query;
      if (detail.kind !== undefined) kind = detail.kind;
      if (detail.amenity !== undefined) amenity = detail.amenity;
    };
    window.addEventListener("w30a:stays-filters", onFilters);
    return () => window.removeEventListener("w30a:stays-filters", onFilters);
  });
</script>

<section class="feed">
  <div class="toolbar">
    <div class="sort" aria-label="Filter stays">
      <button class:active={view === "all"} type="button" onclick={() => (view = "all")}>All Stays</button>
      <button class:active={view === "beachfront"} type="button" onclick={() => (view = "beachfront")}>Beachfront</button>
      <button class:active={view === "lsv"} type="button" onclick={() => (view = "lsv")}>LSV Included</button>
      <button class:active={view === "inn"} type="button" onclick={() => (view = "inn")}>Boutique Inns</button>
    </div>
    <span class="count" aria-live="polite">{results.length} stays · Sort: Recommended</span>
  </div>

  <div class="list">
    {#each results as item (item.slug)}
      <article class="card">
        <a class="media img-placeholder" href={path(`/stay/${item.slug}`)} aria-hidden="true">
          <span class="pill">{item.badge}</span>
          <span class="pill pill--teal">{item.vibe}</span>
        </a>
        <div class="body">
          <div class="title-row">
            <div>
              <p class="town">{item.townName}</p>
              <h3><a href={path(`/stay/${item.slug}`)}>{item.name}</a></h3>
            </div>
            <p class="price">{item.fromPrice}</p>
          </div>
          <p class="excerpt">{item.summary}</p>
          <div class="specs">
            <span>{item.roomsLabel}</span>
            <span>Sleeps {item.sleeps}</span>
            <span>{item.townName} walkable core</span>
          </div>
          <div class="footer">
            <span class="rating">4.{8 + (item.sleeps % 2)} · local favorites</span>
            <a class="explore" href={path(`/stay/${item.slug}`)}>Explore Stay →</a>
          </div>
        </div>
      </article>
    {:else}
      <p class="empty">No stays match those filters.</p>
    {/each}
  </div>
</section>

<style>
  .feed {
    display: grid;
    gap: var(--size-4);
    min-width: 0;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-3);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    padding: 0.85rem 1rem;
  }
  .sort {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .sort button {
    border: 0;
    background: var(--brand-sand-dark);
    border-radius: var(--radius-pill);
    padding: 0.4rem 0.85rem;
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    cursor: pointer;
  }
  .sort button.active {
    background: var(--brand-deep);
    color: white;
  }
  .count {
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .list {
    display: grid;
    gap: var(--size-4);
  }
  .card {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }
  .card:hover {
    box-shadow: var(--shadow-card-hover);
    border-color: #cbd5e1;
  }
  .media {
    position: relative;
    display: block;
    aspect-ratio: 16 / 9;
    text-decoration: none;
  }
  .pill {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-pill);
    background: rgba(12, 35, 46, 0.9);
    color: white;
    font-size: 0.625rem;
    font-weight: var(--font-weight-8);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .pill--teal {
    left: auto;
    right: 0.75rem;
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
  .body {
    padding: var(--size-5);
    display: grid;
    gap: 0.65rem;
  }
  .title-row {
    display: flex;
    justify-content: space-between;
    gap: var(--size-3);
    align-items: flex-start;
  }
  .town {
    margin: 0 0 0.2rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-8);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brand-teal);
  }
  h3 {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--font-size-3);
    color: var(--brand-deep);
  }
  h3 a {
    color: inherit;
  }
  h3 a:hover {
    color: var(--brand-teal);
    text-decoration: none;
  }
  .price {
    margin: 0;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
    white-space: nowrap;
  }
  .excerpt {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.5;
  }
  .specs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    padding: 0.65rem 0.85rem;
    border-radius: var(--radius-2);
    background: #f0f9ff;
    border: 1px solid #dbeafe;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    color: var(--brand-ink);
  }
  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 0.35rem;
    font-size: var(--font-size-1);
  }
  .rating {
    color: var(--brand-ink-soft);
  }
  .explore {
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
  }
  .empty {
    color: var(--brand-ink-soft);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    padding: var(--size-5);
  }
</style>
