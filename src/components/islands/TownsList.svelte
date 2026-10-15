<script lang="ts">
  import ListingToolbar from "./ListingToolbar.svelte";

  interface ReactionView {
    label: "up" | "heart" | "wow";
    count: number;
  }

  interface TownItem {
    slug: string;
    name: string;
    summary: string;
    tagline: string;
    vibe: string;
    vibeSlug: string;
    region: "west" | "central" | "east";
    regionLabel: string;
    beachSlug: string;
    beachLabel: string;
    walkScore: number;
    highlights: string[];
    tags: string[];
    eateries: number;
    accesses: number;
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
    initialRegion = "",
    initialVibe = "",
    base = "/",
  }: {
    towns: TownItem[];
    initialQuery?: string;
    initialRegion?: string;
    initialVibe?: string;
    base?: string;
  } = $props();

  let query = $state(initialQuery);
  let region = $state(initialRegion);
  let vibe = $state(initialVibe);
  let beach = $state("");
  let sort = $state<"west-east" | "az">("west-east");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    towns
      .filter((item) => {
        if (region && item.region !== region) return false;
        if (vibe && item.vibeSlug !== vibe) return false;
        if (beach && item.beachSlug !== beach) return false;
        if (query.trim()) {
          const hay = `${item.name} ${item.summary} ${item.tagline} ${item.vibe} ${item.tags.join(" ")}`.toLowerCase();
          if (!hay.includes(query.trim().toLowerCase())) return false;
        }
        return true;
      })
      .toSorted((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : 0)),
  );

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (
        event as CustomEvent<{ query: string; region: string; vibe: string; beach?: string }>
      ).detail;
      query = detail.query;
      region = detail.region;
      vibe = detail.vibe;
      if (detail.beach !== undefined) beach = detail.beach;
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
          <span class="pill pill--teal">{item.vibe}</span>
        </a>
        <div class="body">
          <div class="title-row">
            <div>
              <h3><a href={path(`/town/${item.slug}`)}>{item.name}</a></h3>
              <p class="tagline">{item.tagline}</p>
            </div>
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
          <div class="tags">
            {#each item.tags as tag}
              <span>{tag}</span>
            {/each}
          </div>
          <div class="footer">
            <div class="stats">
              <span>{item.accesses} accesses</span>
              <span>{item.eateries} eateries</span>
              <span>Walk {item.walkScore}</span>
            </div>
            <a class="explore" href={path(`/town/${item.slug}`)}>Explore {item.name} →</a>
          </div>
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
  .tagline {
    margin: 0.2rem 0 0;
    font-size: var(--font-size-1);
    color: var(--brand-teal);
    font-weight: var(--font-weight-6);
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
  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 0.35rem;
    border-top: 1px solid var(--brand-sand-dark);
    font-size: var(--font-size-1);
  }
  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
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
