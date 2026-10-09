<script lang="ts">
  interface Row {
    slug: string;
    title: string;
    body?: string;
    author: string;
    createdAt: string;
    relative: string;
    answers: number;
    town?: string;
    townSlug?: string;
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

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  const topicWords: Record<string, string[]> = {
    parking: ["parking", "park", "access"],
    dining: ["eat", "dinner", "food", "restaurant"],
    family: ["kids", "family", "children"],
    "getting-around": ["bike", "cart", "trail", "golf"],
  };

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
        return true;
      })
      .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );

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

<section class="latest">
  <div class="latest__head">
    <h2>Latest questions</h2>
    <p class="count" aria-live="polite">
      {rows.length} {rows.length === 1 ? "question" : "questions"}
    </p>
  </div>
  <div class="list">
    {#each rows as item}
      <a class="card" href={path(`/ask/${item.slug}`)}>
        <div class="meta">
          <span class="avatar" aria-hidden="true">{item.author.charAt(0)}</span>
          <span>
            {item.relative}
            · {item.answers}
            {item.answers === 1 ? "reply" : "replies"}
            {#if item.town}
              · {item.town}
            {/if}
          </span>
        </div>
        <h3>{item.title}</h3>
        <div class="footer">
          <span class="like">👍 Like</span>
          <span class="comments">
            {item.answers}
            {item.answers === 1 ? "comment" : "comments"} →
          </span>
        </div>
      </a>
    {:else}
      <p class="empty">No questions match those filters.</p>
    {/each}
  </div>
</section>

<style>
  .latest__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--size-3);
    margin-bottom: var(--size-4);
  }
  .latest h2 {
    margin: 0;
    font-size: var(--font-size-4);
    color: var(--brand-deep);
  }
  .count {
    margin: 0;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
  }
  .list {
    display: grid;
    gap: var(--size-3);
  }
  .card {
    display: grid;
    gap: var(--size-3);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: 1rem;
    padding: var(--size-4) var(--size-5);
    color: var(--brand-ink);
  }
  .card:hover {
    text-decoration: none;
    box-shadow: var(--shadow-card);
  }
  .meta {
    display: flex;
    align-items: center;
    gap: var(--size-2);
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: var(--brand-teal-soft);
    color: var(--brand-deep);
    display: grid;
    place-items: center;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
  }
  h3 {
    margin: 0;
    font-size: var(--font-size-3);
    color: var(--brand-deep);
  }
  .footer {
    display: flex;
    justify-content: space-between;
    gap: var(--size-3);
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .comments {
    font-weight: var(--font-weight-6);
    color: var(--brand-deep);
  }
  .empty {
    color: var(--brand-ink-soft);
  }
</style>
