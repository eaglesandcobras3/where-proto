<script lang="ts">
  import ListingToolbar from "./ListingToolbar.svelte";

  interface Row {
    slug: string;
    title: string;
    body?: string;
    author: string;
    handle?: string;
    createdAt: string;
    relative: string;
    answers: number;
    town?: string;
    townSlug?: string;
    role?: string;
  }

  let {
    questions = [],
    initialTown = "",
    initialTopic = "",
    initialQuery = "",
    base = "/",
  }: {
    questions: Row[];
    initialTown?: string;
    initialTopic?: string;
    initialQuery?: string;
    base?: string;
  } = $props();

  let town = $state(initialTown);
  let topic = $state(initialTopic);
  let query = $state(initialQuery);
  let sort = $state<"trending" | "latest" | "unanswered">("trending");
  let didHydrate = false;

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  const topicWords: Record<string, string[]> = {
    parking: ["parking", "park", "access"],
    dining: ["eat", "dinner", "food", "restaurant", "dining"],
    family: ["kids", "family", "children"],
    "getting-around": ["bike", "cart", "trail", "golf"],
    "beach-access": ["beach", "access", "parking"],
  };

  function topicLabel(item: Row) {
    const hay = `${item.title} ${item.body ?? ""}`.toLowerCase();
    if (/(park|access|beach)/.test(hay)) return "Beach Access";
    if (/(eat|dinner|food|restaurant)/.test(hay)) return "Dining & Food";
    if (/(bike|cart|trail|golf)/.test(hay)) return "Golf Carts & Biking";
    if (/(kid|family)/.test(hay)) return "Family";
    return "Local tip";
  }

  let rows = $derived(
    [...questions]
      .filter((item) => {
        if (town && item.townSlug !== town) return false;
        if (topic) {
          const words = topicWords[topic] ?? [topic];
          const hay = `${item.title} ${item.body ?? ""}`.toLowerCase();
          if (!words.some((word) => hay.includes(word))) return false;
        }
        if (query.trim()) {
          const hay = `${item.title} ${item.body ?? ""} ${item.town ?? ""}`.toLowerCase();
          if (!hay.includes(query.trim().toLowerCase())) return false;
        }
        if (sort === "unanswered" && item.answers > 0) return false;
        return true;
      })
      .toSorted((a, b) => {
        if (sort === "trending") return b.answers - a.answers || b.createdAt.localeCompare(a.createdAt);
        return b.createdAt.localeCompare(a.createdAt);
      }),
  );

  $effect(() => {
    if (didHydrate || typeof window === "undefined") return;
    didHydrate = true;
    const params = new URLSearchParams(window.location.search);
    if (params.has("town")) town = params.get("town") ?? "";
    if (params.has("topic")) topic = params.get("topic") ?? "";
    if (params.has("q")) query = params.get("q") ?? "";
  });

  $effect(() => {
    if (typeof window === "undefined") return;
    const onFilters = (event: Event) => {
      const detail = (event as CustomEvent<{ town: string; category: string; query: string }>).detail;
      town = detail.town;
      topic = detail.category;
      query = detail.query;
    };
    window.addEventListener("w30a:ask-filters", onFilters);
    return () => window.removeEventListener("w30a:ask-filters", onFilters);
  });
</script>

<section class="feed">
  
  <div>
    <ListingToolbar surface="ask" count={rows.length} sortValue={sort} onSort={(value) => (sort = value as typeof sort)} />
  </div>

  <div class="list">
    {#each rows as item}
      <article class="card">
        <div class="card__top">
          <div class="who">
            <span class="avatar" aria-hidden="true">{(item.handle || item.author).replace(/^@/, "").charAt(0)}</span>
            <div>
              <p class="name">{item.handle || item.author}</p>
              <p class="meta">
                {item.handle || item.author} · {item.role ?? "Local"} · {item.relative}
              </p>
            </div>
          </div>
          <div class="tags">
            {#if item.town}<span class="tag">{item.town}</span>{/if}
            <span class="tag tag--topic">{topicLabel(item)}</span>
          </div>
        </div>
        <h3><a href={path(`/ask/${item.slug}`)}>{item.title}</a></h3>
        {#if item.body}
          <p class="excerpt">{item.body}</p>
        {/if}
        {#if item.answers > 0}
          <div class="highlight">
            <span class="highlight__label">Top answer</span>
            <p>Locals have shared {item.answers} {item.answers === 1 ? "reply" : "replies"} on this thread.</p>
          </div>
        {/if}
        <div class="footer">
          <div class="stats">
            <span>Helpful</span>
            <span>{item.answers} {item.answers === 1 ? "answer" : "answers"}</span>
            <span>Share</span>
          </div>
          <a class="join" href={path(`/ask/${item.slug}`)}>Join discussion →</a>
        </div>
      </article>
    {:else}
      <p class="empty">No questions match those filters.</p>
    {/each}
  </div>
</section>

<style>
  .sort {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: var(--size-4);
    font-size: var(--font-size-1);
  }
  .sort__label {
    color: var(--brand-ink-soft);
    font-weight: var(--font-weight-7);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: var(--font-size-0);
  }
  .sort button {
    border: 0;
    background: none;
    padding: 0;
    font: inherit;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    cursor: pointer;
  }
  .sort button.active {
    color: var(--ask-teal, var(--brand-teal));
    box-shadow: inset 0 -2px 0 currentColor;
  }
  .list {
    display: grid;
    gap: var(--size-3);
  }
  .card {
    background: white;
    border: 1px solid var(--ask-line, var(--brand-line));
    border-radius: var(--radius-card, 0.75rem);
    box-shadow: var(--shadow-card);
    padding: var(--size-4) var(--size-5);
  }
  .card__top {
    display: flex;
    justify-content: space-between;
    gap: var(--size-3);
    align-items: flex-start;
    margin-bottom: var(--size-3);
  }
  .who {
    display: flex;
    gap: 0.65rem;
    align-items: center;
  }
  .avatar {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: var(--ask-teal-soft, var(--brand-teal-soft));
    color: var(--ask-navy, var(--brand-deep));
    display: grid;
    place-items: center;
    font-weight: var(--font-weight-7);
  }
  .name {
    margin: 0;
    font-weight: var(--font-weight-7);
    color: var(--ask-teal, var(--brand-teal));
  }
  .meta {
    margin: 0;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: flex-end;
  }
  .tag {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    color: var(--ask-navy, var(--brand-deep));
    background: var(--ask-teal-soft, var(--brand-teal-soft));
    border-radius: 999px;
    padding: 0.2rem 0.65rem;
  }
  .tag--topic {
    background: var(--brand-sand);
  }
  h3 {
    margin: 0 0 var(--size-2);
    font-size: var(--font-size-3);
    color: var(--ask-navy, var(--brand-deep));
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
    color: var(--brand-ink-soft);
    font-size: var(--font-size-1);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .highlight {
    margin-top: var(--size-3);
    padding: var(--size-3);
    border-radius: 0.65rem;
    background: var(--ask-teal-soft, var(--brand-teal-soft));
  }
  .highlight__label {
    display: inline-block;
    margin-bottom: 0.25rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-8);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ask-teal, var(--brand-teal));
  }
  .highlight p {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--ask-navy, var(--brand-deep));
  }
  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--size-3);
    margin-top: var(--size-4);
    padding-top: var(--size-3);
    border-top: 1px solid var(--ask-line, var(--brand-line));
    font-size: var(--font-size-1);
  }
  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    color: var(--brand-ink-soft);
  }
  .join {
    font-weight: var(--font-weight-7);
    color: var(--ask-teal, var(--brand-teal));
  }
  .empty {
    color: var(--brand-ink-soft);
  }
</style>
