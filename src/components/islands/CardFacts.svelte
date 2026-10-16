<script lang="ts">
  export type FactKind = "business" | "stay" | "guide" | "thread";

  interface Fact {
    kind: FactKind;
    count: number;
    label?: string;
  }

  let { facts = [] }: { facts?: Fact[] } = $props();

  const nouns: Record<FactKind, [string, string]> = {
    business: ["business", "businesses"],
    stay: ["stay", "stays"],
    guide: ["guide", "guides"],
    thread: ["thread", "threads"],
  };

  const visible = $derived(facts.filter((item) => item.count > 0));

  function labelFor(item: Fact) {
    if (item.label) return item.label;
    const [one, many] = nouns[item.kind];
    return item.count === 1 ? one : many;
  }
</script>

{#if visible.length}
  <ul class="facts">
    {#each visible as item (item.kind)}
      <li>
        <span class="icon" aria-hidden="true">
          {#if item.kind === "business"}
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"></path>
            </svg>
          {:else if item.kind === "stay"}
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M3 18V9.5A2.5 2.5 0 0 1 5.5 7H11v5h8.5a2.5 2.5 0 0 1 2.5 2.5V18M3 18h18M7 7V5.5A1.5 1.5 0 0 1 8.5 4h2A1.5 1.5 0 0 1 12 5.5V7" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          {:else if item.kind === "guide"}
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M6 4.5h11A1.5 1.5 0 0 1 18.5 6v13.5H7.5A1.5 1.5 0 0 0 6 21V4.5zM6 4.5A1.5 1.5 0 0 0 4.5 6v13" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"></path>
              <path d="M9 8.5h6M9 12h6" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
            </svg>
          {:else}
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M6 16.5 4 19v-11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"></path>
            </svg>
          {/if}
        </span>
        <span class="copy">
          <span class="count">{item.count}</span>
          <span class="label">{labelFor(item)}</span>
        </span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .facts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem 0.9rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-width: 0;
  }
  .icon {
    width: 1.7rem;
    height: 1.7rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
  .icon svg {
    display: block;
  }
  .copy {
    display: inline-flex;
    align-items: baseline;
    gap: 0.28rem;
    min-width: 0;
    font-size: var(--font-size-0);
    line-height: 1.2;
    color: var(--brand-ink-soft);
  }
  .count {
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
  }
</style>
