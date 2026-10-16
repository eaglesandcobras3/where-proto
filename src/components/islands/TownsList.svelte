<script lang="ts">
  import CardFacts from "./CardFacts.svelte";
  import ListingToolbar from "./ListingToolbar.svelte";

  interface ReactionView {
    label: "up" | "heart" | "wow";
    count: number;
  }

  interface Metric {
    kind: "business" | "stay" | "guide" | "thread";
    label: string;
    count: number;
  }

  interface TownItem {
    slug: string;
    name: string;
    summary: string;
    vibe: string;
    vibeSlug: string;
    region: "west" | "central" | "east";
    regionLabel: string;
    beachSlug: string;
    beachLabel: string;
    tags: string[];
    categorySlugs: string[];
    leafSlugs: string[];
    metrics: Metric[];
    reactions?: ReactionView[];
  }

  const emoji = { heart: "❤️", up: "👍", wow: "😮" } as const;

  function reactionView(reactions: ReactionView[] = []) {
    const list = reactions.filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
    return {
      faces: list.map((item) => emoji[item.label]),
      total: list.reduce((sum, item) => sum + item.count, 0),
    };
  }

  let {
    towns = [],
    initialQuery = "",
    initialTown = "",
    initialCategory = "",
    base = "/",
  }: {
    towns: TownItem[];
    initialQuery?: string;
    initialTown?: string;
    initialCategory?: string;
    base?: string;
  } = $props();

  let query = $state(initialQuery);
  let town = $state(initialTown);
  let category = $state(initialCategory);
  let sort = $state<"west-east" | "az">("west-east");
  let didReadQuery = false;

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  function matchesCategory(item: TownItem, value: string) {
    if (!value) return true;
    return item.categorySlugs.includes(value) || item.leafSlugs.includes(value);
  }

  let results = $derived(
    towns
      .filter((item) => {
        if (town && item.slug !== town) return false;
        if (!matchesCategory(item, category)) return false;
        if (query.trim()) {
          const hay = `${item.name} ${item.summary} ${item.vibe} ${item.tags.join(" ")}`.toLowerCase();
          if (!hay.includes(query.trim().toLowerCase())) return false;
        }
        return true;
      })
      .toSorted((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : 0)),
  );

  $effect(() => {
    if (didReadQuery || typeof window === "undefined") return;
    didReadQuery = true;
    const posted = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    if (posted) query = posted;
  });

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (
        event as CustomEvent<{ query?: string; town?: string; category?: string }>
      ).detail;
      if (detail.query !== undefined) query = detail.query;
      if (detail.town !== undefined) town = detail.town;
      if (detail.category !== undefined) category = detail.category;
    };
    window.addEventListener("w30a:towns-filters", onFilters);
    return () => window.removeEventListener("w30a:towns-filters", onFilters);
  });
</script>

<section class="feed">
  <div>
    <ListingToolbar
      surface="towns"
      count={results.length}
      sortValue={sort}
      onSort={(value) => (sort = value as typeof sort)}
    />
  </div>

  <div class="list">
    {#each results as item (item.slug)}
      {@const reaction = reactionView(item.reactions)}
      <article class="card">
        <a class="media img-placeholder" href={path(`/town/${item.slug}`)} aria-hidden="true">
          <span class="media__letter">{item.name.charAt(0)}</span>
          <span class="pill">{item.regionLabel}</span>
        </a>
        <div class="body">
          <div class="title-row">
            <h3><a href={path(`/town/${item.slug}`)}>{item.name}</a></h3>
            {#if reaction.total > 0}
              <span class="reactions" aria-label="{reaction.total} reactions">
                <span class="faces" aria-hidden="true">
                  {#each reaction.faces as face}
                    <span class="face">{face}</span>
                  {/each}
                </span>
                {reaction.total}
              </span>
            {/if}
          </div>
          <p class="excerpt">{item.summary}</p>
          <CardFacts facts={item.metrics} />
          {#if item.tags.length}
            <div class="tags">
              {#each item.tags as tag}
                <span>{tag}</span>
              {/each}
            </div>
          {/if}
          <a class="explore" href={path(`/town/${item.slug}`)}>Explore {item.name} →</a>
        </div>
      </article>
    {:else}
      <p class="empty">No towns match those filters.</p>
    {/each}
  </div>
</section>

<style>
  .feed {
    display: grid;
    gap: var(--size-4);
    min-width: 0;
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
    border-color: var(--brand-line);
  }
  .media {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 16 / 9;
    text-decoration: none;
    font-size: clamp(2.5rem, 8vw, 3.5rem);
    color: var(--brand-teal);
  }
  .media__letter {
    font-family: var(--font-display);
    font-weight: var(--font-weight-8);
    line-height: 1;
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
    text-decoration: none;
  }
  .reactions {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.6875rem;
    font-weight: var(--font-weight-5);
    color: var(--brand-ink-soft);
    line-height: 1.4;
  }
  .faces {
    display: inline-flex;
    align-items: center;
  }
  .face {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    margin-left: -0.28rem;
    border-radius: 50%;
    background: white;
    box-shadow: 0 0 0 1px white;
    font-size: 0.72rem;
    line-height: 1;
  }
  .face:first-child {
    margin-left: 0;
  }
  .excerpt {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.5;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .tags span {
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-pill);
    background: var(--brand-sand-dark);
    font-size: 0.6875rem;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink);
  }
  .explore {
    justify-self: start;
    font-size: var(--font-size-1);
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
