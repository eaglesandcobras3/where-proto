<script lang="ts">
  interface GuideItem {
    slug: string;
    title: string;
    summary: string;
    town?: string;
    category?: string;
  }

  let {
    guides = [],
    initialTown = "",
    initialCategory = "",
    initialQuery = "",
    base = "/",
  }: {
    guides: GuideItem[];
    initialTown?: string;
    initialCategory?: string;
    initialQuery?: string;
    base?: string;
  } = $props();

  let town = $state(initialTown);
  let category = $state(initialCategory);
  let query = $state(initialQuery);

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let results = $derived(
    guides.filter((item) => {
      if (town && item.town !== town) return false;
      if (category && item.category !== category) return false;
      if (query.trim()) {
        const hay = `${item.title} ${item.summary}`.toLowerCase();
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
      category = detail.category;
      query = detail.query;
    };
    window.addEventListener("w30a:guides-filters", onFilters);
    return () => window.removeEventListener("w30a:guides-filters", onFilters);
  });
</script>

<div class="guides-list">
  <p class="count" aria-live="polite">
    {results.length} {results.length === 1 ? "guide" : "guides"}
  </p>
  <div class="story-grid">
    {#each results as guide (guide.slug)}
      <a class="story-card" href={path(`/guide/${guide.slug}`)}>
        <div class="story-card__media img-placeholder" aria-hidden="true">{guide.title.charAt(0)}</div>
        <h3>{guide.title}</h3>
        <p>{guide.summary}</p>
        <span class="story-card__link">Read guide →</span>
      </a>
    {:else}
      <p class="empty">No guides match those filters.</p>
    {/each}
  </div>
</div>

<style>
  .count {
    margin: 0 0 var(--size-4);
    font-weight: var(--font-weight-6);
  }
  .story-card {
    display: grid;
    gap: 0.65rem;
    align-content: start;
    color: var(--brand-ink);
    min-width: 0;
  }
  .story-card:hover {
    text-decoration: none;
  }
  .story-card:hover .story-card__link {
    text-decoration: underline;
  }
  .story-card__media {
    aspect-ratio: 3 / 4;
    border-radius: 1.25rem;
    font-size: var(--font-size-7);
    margin-bottom: 0.35rem;
  }
  .story-card h3 {
    margin: 0;
    font-size: var(--font-size-3);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
    line-height: 1.25;
  }
  .story-card p {
    margin: 0;
    color: var(--brand-ink-soft);
    font-size: var(--font-size-1);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .story-card__link {
    margin-top: 0.15rem;
    font-weight: var(--font-weight-7);
    font-size: var(--font-size-1);
    color: var(--brand-deep);
  }
  .empty {
    color: var(--brand-ink-soft);
  }
</style>
