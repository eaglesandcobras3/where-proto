<script lang="ts">
  import { untrack } from "svelte";

  interface Named {
    slug: string;
    name: string;
  }

  interface Group extends Named {
    leaves: Named[];
  }

  type Panel = "town" | "category" | "";

  let {
    towns = [],
    categories = [],
    initialTown = "",
    initialGroup = "",
    initialLeaf = "",
    categoryLabel = "",
    expanded = false,
    initialPanel = "category",
    base = "/",
  }: {
    towns: Named[];
    categories: Group[];
    initialTown?: string;
    initialGroup?: string;
    initialLeaf?: string;
    /** Shown collapsed when the page's category is not in the picker, e.g. "Stay" */
    categoryLabel?: string;
    /** Start expanded */
    expanded?: boolean;
    /** Which popover opens when expanded (Towns hub uses town) */
    initialPanel?: Panel;
    base?: string;
  } = $props();

  let open = $state(untrack(() => expanded));
  let panel = $state<Panel>(untrack(() => (expanded ? initialPanel : "")));
  let town = $state(untrack(() => initialTown));
  let group = $state(untrack(() => initialGroup));
  let leaf = $state(untrack(() => initialLeaf));
  let panels = $state<HTMLElement>();

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${root}${route}`;
  }

  let selectedGroup = $derived(categories.find((item) => item.slug === group));
  let leaves = $derived(selectedGroup?.leaves ?? []);
  let townName = $derived(towns.find((item) => item.slug === town)?.name ?? "All towns");
  let categoryName = $derived(
    leaves.find((item) => item.slug === leaf)?.name ?? selectedGroup?.name ?? "",
  );

  // A category with no town lists across the corridor at /towns/[category]
  let exploreHref = $derived.by(() => {
    const segment = leaf || group;
    if (town && segment) return path(`/town/${town}/${segment}`);
    if (town) return path(`/town/${town}`);
    if (segment) return path(`/towns/${segment}`);
    return path("/towns");
  });

  function expand() {
    open = true;
    panel = initialPanel || "town";
  }

  function collapse() {
    open = false;
    panel = "";
  }

  function togglePanel(next: Panel) {
    panel = panel === next ? "" : next;
  }

  function onGroup(event: Event) {
    group = (event.currentTarget as HTMLSelectElement).value;
    leaf = "";
  }

  // Close when the pointer goes down outside the town, category, and explore controls
  $effect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && panels?.contains(event.target)) return;
      collapse();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });
</script>

<div class="browse-bar" data-expanded={open}>
  <div class="container">
    <div class="collapsed">
      <button class="stack" type="button" aria-expanded={open} onclick={expand}>
        <span class="primary">{townName}</span>
        <span class="secondary">{categoryName || categoryLabel || "Any category"}</span>
      </button>
      <button class="edit" type="button" aria-label="Edit explore filters" aria-expanded={open} onclick={expand}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 7h10.2a2.5 2.5 0 0 0 4.6 0H20v-2h-1.2a2.5 2.5 0 0 0-4.6 0H4V7zm0 12h2.2a2.5 2.5 0 0 0 4.6 0H20v-2H10.8a2.5 2.5 0 0 0-4.6 0H4v2zm0-6h6.2a2.5 2.5 0 0 0 4.6 0H20v-2h-5.2a2.5 2.5 0 0 0-4.6 0H4v2z"
          ></path>
        </svg>
      </button>
    </div>

    <div class="expanded" bind:this={panels}>
      <div class="shell">
        <div class="segment" data-open={panel === "town"}>
          <button class="field" type="button" aria-expanded={panel === "town"} onclick={() => togglePanel("town")}>
            <span class="label">Town</span>
            <span class="value">{townName}</span>
          </button>
          {#if town}
            <button class="clear" type="button" aria-label="Clear town" onclick={() => (town = "")}>×</button>
          {/if}
          {#if panel === "town"}
            <div class="panel" id="explore-town-panel">
              <label>
                Town
                <select bind:value={town}>
                  <option value="">All towns</option>
                  {#each towns as item (item.slug)}
                    <option value={item.slug}>{item.name}</option>
                  {/each}
                </select>
              </label>
            </div>
          {/if}
        </div>

        <div class="segment" data-open={panel === "category"}>
          <button
            class="field"
            type="button"
            aria-expanded={panel === "category"}
            aria-controls="explore-category-panel"
            onclick={() => togglePanel("category")}
          >
            <span class="label">Category</span>
            <span class="value" class:placeholder={!categoryName}>{categoryName || "Add category"}</span>
          </button>
          {#if panel === "category"}
            <div class="panel" id="explore-category-panel">
              <label>
                Group
                <select value={group} onchange={onGroup}>
                  <option value="">All groups</option>
                  {#each categories as item (item.slug)}
                    <option value={item.slug}>{item.name}</option>
                  {/each}
                </select>
              </label>
              <label>
                Subcategory
                <select bind:value={leaf} disabled={!group}>
                  {#if group}
                    <option value="">All in {selectedGroup?.name}</option>
                    {#each leaves as item (item.slug)}
                      <option value={item.slug}>{item.name}</option>
                    {/each}
                  {:else}
                    <option value="">Choose a group first</option>
                  {/if}
                </select>
              </label>
            </div>
          {/if}
        </div>
      </div>

      <a class="explore" href={exploreHref}>Explore</a>
    </div>
  </div>
</div>

<style>
  .browse-bar {
    position: relative;
    z-index: 25;
    background: var(--brand-deep);
    padding-block: var(--size-4);
  }
  .collapsed {
    display: flex;
    align-items: center;
    gap: var(--size-3);
    max-width: 560px;
    margin-inline: auto;
    padding: var(--size-1) var(--size-1) var(--size-1) var(--size-4);
    background: white;
    border-radius: var(--radius-4);
  }
  .stack {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--size-1) 0;
    border: 0;
    background: transparent;
    text-align: left;
    line-height: 1.3;
    cursor: pointer;
  }
  .primary {
    font-size: var(--font-size-2);
    font-weight: var(--font-weight-7);
    color: var(--brand-ink);
  }
  .secondary {
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .edit {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: var(--brand-deep);
    color: white;
    cursor: pointer;
  }
  .expanded {
    display: none;
    align-items: center;
    justify-content: center;
    gap: var(--size-3);
  }
  [data-expanded="true"] .collapsed {
    display: none;
  }
  [data-expanded="true"] .expanded {
    display: flex;
  }
  .shell {
    display: flex;
    flex: 1;
    min-width: 0;
    max-width: 40rem;
    background: white;
    border-radius: var(--radius-4);
    overflow: visible;
  }
  .segment {
    position: relative;
    flex: 1;
    min-width: 0;
    min-height: 56px;
    display: flex;
    align-items: center;
    padding: var(--size-1) var(--size-3) var(--size-1) var(--size-4);
  }
  .segment + .segment {
    border-left: 1px solid var(--brand-line);
  }
  .segment[data-open="true"] {
    background: var(--brand-sand);
    border-radius: var(--radius-4);
    box-shadow: 0 0 0 2px #3b6fe8;
  }
  .field {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: left;
    line-height: 1.3;
    color: inherit;
    cursor: pointer;
  }
  .label {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-5);
    color: var(--brand-ink-soft);
  }
  .value {
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-ink);
  }
  .value.placeholder {
    color: var(--brand-ink-soft);
    font-weight: var(--font-weight-5);
  }
  .clear {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border: 0;
    background: transparent;
    color: var(--brand-ink-soft);
    font-size: var(--font-size-3);
    line-height: 1;
    cursor: pointer;
  }
  .panel {
    position: absolute;
    top: calc(100% + var(--size-2));
    left: 0.4rem;
    z-index: 30;
    width: min(22rem, calc(100vw - 2rem));
    display: grid;
    gap: var(--size-3);
    padding: var(--size-4);
    background: white;
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
  }
  .panel label {
    display: flex;
    flex-direction: column;
    gap: var(--size-1);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .panel select {
    font-size: var(--font-size-1);
    text-transform: none;
    letter-spacing: normal;
    padding: var(--size-2) var(--size-3);
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    background: white;
  }
  .panel select:disabled {
    color: var(--brand-ink-soft);
    background: var(--brand-sand);
  }
  .explore {
    flex-shrink: 0;
    min-height: 56px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--size-2) var(--size-5);
    background: white;
    color: var(--brand-deep);
    border-radius: var(--radius-4);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
  }
  .explore:hover {
    text-decoration: none;
    background: var(--brand-teal-soft);
  }
  @media (max-width: 719px) {
    [data-expanded="true"] .expanded {
      flex-direction: column;
      align-items: stretch;
    }
    .shell {
      flex-direction: column;
      max-width: none;
    }
    .segment + .segment {
      border-left: 0;
      border-top: 1px solid var(--brand-line);
    }
    .panel {
      left: 0;
      right: 0;
      width: auto;
    }
  }
</style>
