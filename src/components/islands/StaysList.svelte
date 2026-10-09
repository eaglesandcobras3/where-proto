<script lang="ts">
  import { cardImageSrc, listingSizes } from "../../lib/card-image";

  interface StayItem {
    slug: string;
    name: string;
    town: string;
    townName: string;
    summary: string;
    sleeps: number;
  }

  let {
    stays = [],
    initialTown = "",
    initialGuests = "",
    initialQuery = "",
    base = "/",
  }: {
    stays: StayItem[];
    initialTown?: string;
    initialGuests?: string;
    initialQuery?: string;
    base?: string;
  } = $props();

  let town = $state(initialTown);
  let guests = $state(initialGuests);
  let query = $state(initialQuery);

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
      if (query.trim()) {
        const hay = `${item.name} ${item.summary} ${item.townName}`.toLowerCase();
        if (!hay.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    }),
  );

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ town: string; category: string; query: string }>).detail;
      town = detail.town;
      guests = detail.category;
      query = detail.query;
    };
    window.addEventListener("w30a:stays-filters", onFilters);
    return () => window.removeEventListener("w30a:stays-filters", onFilters);
  });
</script>

<div class="stays-list">
  <p class="count" aria-live="polite">
    {results.length} {results.length === 1 ? "stay" : "stays"}
  </p>

  <div class="listing-grid-split">
    {#each results as item (item.slug)}
      <a class="listing-card" href={path(`/stay/${item.slug}`)}>
        <div class="listing-tile">
          <img
            src={cardImageSrc(item.name.charAt(0), "2/3")}
            alt=""
            width="112"
            height="168"
            sizes={listingSizes}
          />
        </div>
        <div class="body">
          <h3>{item.name}</h3>
          <p class="meta">{item.townName} · Sleeps {item.sleeps}</p>
          <p class="desc">{item.summary}</p>
          <span class="explore">Explore →</span>
        </div>
      </a>
    {:else}
      <p class="empty">No stays match those filters. Try clearing one.</p>
    {/each}
  </div>
</div>

<style>
  .count {
    margin: 0 0 var(--size-3);
    font-weight: var(--font-weight-6);
  }
  .listing-card .body h3 {
    font-size: var(--font-size-3);
    margin-bottom: var(--size-1);
  }
  .meta,
  .desc {
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    margin: 0 0 var(--size-1);
  }
  .desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .explore {
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
  }
  .listing-card:hover .explore {
    text-decoration: underline;
  }
  .empty {
    color: var(--brand-ink-soft);
  }
</style>
