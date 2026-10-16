<script lang="ts">
  import { eventCategories, eventHasCategory } from "../../data/event-categories";
  import ListingToolbar from "./ListingToolbar.svelte";

  interface Row {
    slug: string;
    name: string;
    town?: string;
    townName?: string;
    when: string;
    time?: string;
    venue?: string;
    category?: string;
    categories?: string[];
    price?: string;
    summary?: string;
    host?: string;
    bucket: "now" | "today" | "weekend" | "month";
  }

  let {
    events = [],
    initialTown = "",
    initialCategory = "",
    initialQuery = "",
    base = "/",
  }: {
    events: Row[];
    initialTown?: string;
    initialCategory?: string;
    initialQuery?: string;
    base?: string;
  } = $props();

  let town = $state(initialTown);
  let category = $state(initialCategory);
  let query = $state(initialQuery);
  let from = $state("");
  let view = $state<"all" | "weekend" | "free" | "family">("all");
  let chip = $state("");
  let didHydrate = false;

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  const eventChips = eventCategories.filter((category) =>
    events.some((item) => eventHasCategory(item, category.slug)),
  );

  let results = $derived(
    events.filter((item) => {
      if (town && item.town !== town) return false;
      const activeCategory = chip || category;
      if (activeCategory && !eventHasCategory(item, activeCategory)) return false;
      if (from && item.when && item.when < from) return false;
      if (query.trim()) {
        const hay = `${item.name} ${item.venue ?? ""} ${item.townName ?? ""} ${item.category ?? ""} ${item.when}`.toLowerCase();
        if (!hay.includes(query.trim().toLowerCase())) return false;
      }
      if (view === "weekend" && item.bucket !== "weekend") return false;
      if (view === "free" && !(item.price ?? "").toLowerCase().includes("free")) return false;
      if (view === "family" && !eventHasCategory(item, "family-kids")) return false;
      return true;
    }),
  );

  const buckets: { key: Row["bucket"][]; label: string; featured?: boolean }[] = [
    { key: ["now", "today"], label: "Happening Today & Tonight", featured: true },
    { key: ["weekend"], label: "This Weekend" },
    { key: ["month"], label: "Next 30 Days" },
  ];

  $effect(() => {
    if (didHydrate || typeof window === "undefined") return;
    didHydrate = true;
    const params = new URLSearchParams(window.location.search);
    if (params.has("town")) town = params.get("town") ?? "";
    if (params.has("category")) category = params.get("category") ?? "";
    if (params.has("q")) query = params.get("q") ?? "";
    if (params.has("from")) from = params.get("from") ?? "";
  });

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (
        event as CustomEvent<{ town: string; from: string; to: string; query: string; category?: string }>
      ).detail;
      town = detail.town;
      query = detail.query;
      if (detail.category !== undefined) category = detail.category;
      if (detail.from !== undefined) from = detail.from;
    };
    window.addEventListener("w30a:events-filters", onFilters);
    return () => window.removeEventListener("w30a:events-filters", onFilters);
  });
</script>

<section class="feed">
  
  <div>
    <ListingToolbar
      surface="events"
      count={results.length}
      chips={eventChips}
      activeChip={chip || category}
      onChip={(slug) => {
        chip = slug;
        category = slug;
      }}
    />
  </div>

  {#each buckets as bucket}
    {@const group = results.filter((item) => bucket.key.includes(item.bucket))}
    {#if group.length}
      <section class="group">
        <div class="group__head">
          <h2>
            {#if bucket.featured}<span class="live" aria-hidden="true"></span>{/if}
            {bucket.label}
          </h2>
          <span>{group.length} scheduled</span>
        </div>

        {#if bucket.featured}
          <div class="featured">
            {#each group as event}
              <article class="card card--feature">
                <a class="media img-placeholder" href={path(`/event/${event.slug}`)} aria-hidden="true">
                  <span class="pill">{event.category ?? "Event"}</span>
                  {#if event.price}<span class="pill pill--light">{event.price}</span>{/if}
                  <span class="when-chip">{event.when}{#if event.time} · {event.time}{/if}</span>
                </a>
                <div class="body">
                  <p class="place">{event.venue ?? "30A"}{#if event.townName} · {event.townName}{/if}</p>
                  <h3><a href={path(`/event/${event.slug}`)}>{event.name}</a></h3>
                  {#if event.summary}<p class="excerpt">{event.summary}</p>{/if}
                  <div class="footer">
                    <span class="host">{event.host ?? "Community host"}</span>
                    <a class="explore" href={path(`/event/${event.slug}`)}>Explore event →</a>
                  </div>
                </div>
              </article>
            {/each}
          </div>
        {:else if bucket.key[0] === "weekend"}
          <div class="weekend">
            {#each group as event}
              <article class="card card--compact">
                <p class="when">{event.when}</p>
                {#if event.time}<p class="time">{event.time}</p>{/if}
                <h3><a href={path(`/event/${event.slug}`)}>{event.name}</a></h3>
                <p class="meta">{event.venue ?? "30A"}{#if event.townName} · {event.townName}{/if}</p>
                {#if event.category}<span class="tag">{event.category}</span>{/if}
                <a class="explore" href={path(`/event/${event.slug}`)}>Explore →</a>
              </article>
            {/each}
          </div>
        {:else}
          <div class="month">
            {#each group as event}
              <article class="card card--row">
                <a class="thumb img-placeholder" href={path(`/event/${event.slug}`)} aria-hidden="true">
                  {event.name.charAt(0)}
                </a>
                <div class="body">
                  <p class="when">{event.when}</p>
                  <h3><a href={path(`/event/${event.slug}`)}>{event.name}</a></h3>
                  <p class="meta">{event.venue ?? "30A"}{#if event.townName} · {event.townName}{/if}</p>
                </div>
                <div class="row-actions">
                  <a class="btn" href={path(`/event/${event.slug}`)}>{event.price ?? "Details"}</a>
                  <a class="explore" href={path(`/event/${event.slug}`)}>Save</a>
                </div>
              </article>
            {/each}
          </div>
        {/if}
      </section>
    {/if}
  {/each}

  {#if !results.length}
    <p class="empty">No events match those filters.</p>
  {/if}
</section>

<style>
  .feed {
    display: grid;
    gap: var(--size-5);
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
  .group__head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: baseline;
    margin-bottom: var(--size-3);
  }
  .group__head h2 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-display);
    font-size: var(--font-size-4);
    color: var(--brand-deep);
  }
  .group__head span {
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .live {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--brand-teal-accent, var(--brand-teal));
    box-shadow: 0 0 0 4px rgba(0, 150, 136, 0.2);
  }
  .featured,
  .weekend,
  .month {
    display: grid;
    gap: var(--size-4);
  }
  .weekend {
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
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
    border-color: var(--brand-line);
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
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
    font-size: 0.625rem;
    font-weight: var(--font-weight-8);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .pill--light {
    left: auto;
    right: 0.75rem;
    background: white;
    color: var(--brand-deep);
  }
  .when-chip {
    position: absolute;
    left: 0.75rem;
    bottom: 0.75rem;
    padding: 0.3rem 0.55rem;
    border-radius: var(--radius-2);
    background: rgba(12, 35, 46, 0.9);
    color: white;
    font-size: 0.625rem;
    font-weight: var(--font-weight-7);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .body {
    padding: var(--size-4) var(--size-5);
  }
  .place {
    margin: 0 0 0.35rem;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
    color: var(--brand-teal);
  }
  h3 {
    margin: 0 0 0.4rem;
    font-family: var(--font-display);
    font-size: var(--font-size-3);
    color: var(--brand-deep);
    line-height: 1.3;
  }
  h3 a {
    color: inherit;
  }
  h3 a:hover {
    text-decoration: none;
  }
  .excerpt {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.5;
  }
  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: var(--size-4);
    padding-top: var(--size-3);
    border-top: 1px solid var(--brand-sand-dark);
    font-size: var(--font-size-1);
  }
  .host {
    color: var(--brand-ink-soft);
  }
  .explore {
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
  }
  .card--compact {
    padding: var(--size-4);
    display: grid;
    gap: 0.35rem;
    align-content: start;
  }
  .when,
  .time {
    margin: 0;
    font-size: 0.6875rem;
    font-weight: var(--font-weight-7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brand-teal);
  }
  .time {
    color: var(--brand-ink-soft);
  }
  .meta {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .tag {
    width: fit-content;
    font-size: 0.6875rem;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    background: var(--brand-sand-dark);
    border-radius: var(--radius-pill);
    padding: 0.2rem 0.55rem;
  }
  .card--row {
    display: grid;
    grid-template-columns: 4.5rem 1fr;
    gap: var(--size-3);
    padding: var(--size-3);
    align-items: center;
  }
  .thumb {
    aspect-ratio: 1;
    border-radius: var(--radius-2);
    display: grid;
    place-items: center;
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
    text-decoration: none;
  }
  .row-actions {
    grid-column: 1 / -1;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-2);
    background: var(--brand-deep);
    color: white;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
  }
  .btn:hover {
    background: var(--brand-teal);
    text-decoration: none;
  }
  .empty {
    color: var(--brand-ink-soft);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    padding: var(--size-5);
  }
  @media (min-width: 700px) {
    .card--row {
      grid-template-columns: 4.5rem 1fr auto;
    }
    .row-actions {
      grid-column: auto;
      flex-direction: column;
      align-items: flex-end;
    }
  }
</style>
