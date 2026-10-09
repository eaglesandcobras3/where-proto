<script lang="ts">
  interface Row {
    slug: string;
    title: string;
    author: string;
    createdAt: string;
    relative: string;
    answers: number;
    town?: string;
  }

  let { questions = [], base = "/" }: { questions: Row[]; base?: string } = $props();
  let query = $state("");
  let sort = $state<"newest" | "answered">("newest");

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let rows = $derived(
    questions
      .filter((item) => {
        if (!query.trim()) return true;
        const hay = `${item.title} ${item.author} ${item.town ?? ""}`.toLowerCase();
        return hay.includes(query.trim().toLowerCase());
      })
      .toSorted((a, b) => {
        if (sort === "answered") return b.answers - a.answers;
        return b.createdAt.localeCompare(a.createdAt);
      }),
  );
</script>

<div class="tools">
  <label>
    Search questions
    <input type="search" bind:value={query} placeholder="Search questions and answers" />
  </label>
  <fieldset>
    <legend>Sort</legend>
    <label class="radio"><input type="radio" bind:group={sort} value="newest" /> Newest</label>
    <label class="radio"><input type="radio" bind:group={sort} value="answered" /> Most answered</label>
  </fieldset>
</div>

<div class="list">
  {#each rows as item}
    <a class="row" href={path(`/ask/${item.slug}`)}>
      <div class="avatar">{item.author.charAt(0)}</div>
      <div>
        <h3>{item.title}</h3>
        <p class="meta">{item.author} · {item.relative} · {item.answers} {item.answers === 1 ? "answer" : "answers"}</p>
        {#if item.town}
          <span class="chip">{item.town}</span>
        {/if}
      </div>
    </a>
  {:else}
    <p class="empty">No questions match that search.</p>
  {/each}
</div>

<style>
  .tools {
    display: grid;
    gap: var(--size-3);
    margin-bottom: var(--size-5);
    max-width: 720px;
  }
  label,
  legend {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  input[type="search"] {
    display: block;
    width: 100%;
    margin-top: var(--size-1);
    padding: var(--size-2) var(--size-3);
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    font: inherit;
  }
  fieldset {
    border: 0;
    padding: 0;
    display: flex;
    gap: var(--size-4);
  }
  .radio {
    display: flex;
    align-items: center;
    gap: var(--size-1);
    text-transform: none;
    letter-spacing: normal;
    font-weight: var(--font-weight-6);
    color: var(--brand-ink);
  }
  .list {
    display: grid;
    gap: var(--size-3);
    max-width: 720px;
  }
  .row {
    display: flex;
    gap: var(--size-3);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-4);
    color: var(--brand-ink);
  }
  .row:hover {
    text-decoration: none;
    box-shadow: var(--shadow-card);
  }
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--brand-sand-dark);
    display: grid;
    place-items: center;
    font-weight: 700;
    color: var(--brand-deep);
    flex-shrink: 0;
  }
  h3 {
    font-size: var(--font-size-2);
    margin: 0 0 var(--size-1);
  }
  .meta {
    margin: 0 0 var(--size-2);
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .chip {
    display: inline-block;
    font-size: var(--font-size-0);
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-4);
    padding: 2px var(--size-2);
  }
  .empty {
    color: var(--brand-ink-soft);
  }
</style>
