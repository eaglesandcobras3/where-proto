<script lang="ts">
  import { POSTED_EVENT, postedFor } from "../../lib/posted";
  import { formatThrough, updateTypeLabels } from "../../lib/labels";
  import type { Update } from "../../data/types";

  let {
    businessSlug = "",
    townSlug = "",
    areaSlug = "",
  }: {
    businessSlug?: string;
    townSlug?: string;
    areaSlug?: string;
  } = $props();

  let items = $state<Update[]>([]);

  function refresh() {
    items = postedFor({
      businessSlug: businessSlug || undefined,
      townSlug: townSlug || undefined,
      areaSlug: areaSlug || undefined,
    });
  }

  $effect(() => {
    refresh();
    window.addEventListener(POSTED_EVENT, refresh);
    return () => window.removeEventListener(POSTED_EVENT, refresh);
  });
</script>

{#if items.length > 0}
  <div class="grid">
    {#each items as update (update.slug)}
      <article class="card">
        <div class="top">
          <span class="type">{updateTypeLabels[update.type]}</span>
          <span class="when">Through {formatThrough(update.through)}</span>
        </div>
        <h3>{update.title}</h3>
        <p>{update.body}</p>
      </article>
    {/each}
  </div>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--size-4);
    margin-bottom: var(--size-4);
  }
  .card {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    padding: var(--size-4);
  }
  .top {
    display: flex;
    justify-content: space-between;
    gap: var(--size-3);
    margin-bottom: var(--size-2);
  }
  .type {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
    background: var(--brand-teal-soft);
    border-radius: var(--radius-pill);
    padding: 2px var(--size-2);
  }
  .when {
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  h3 {
    font-size: var(--font-size-3);
    margin: var(--size-2) 0;
  }
  p {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
</style>
