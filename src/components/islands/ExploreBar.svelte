<script lang="ts">
  import { tick } from "svelte";
  import {
    exploreButtonLabel,
    exploreDestination,
    explorePreview,
    sameDestination,
    withBase,
  } from "../../lib/explore-link";

  interface Named {
    slug: string;
    name: string;
  }

  interface CategoryGroup extends Named {
    leaves: Named[];
  }

  let {
    towns = [],
    categories = [],
    currentTown = "",
    currentPath = "",
    base = "/",
  }: {
    towns: Named[];
    categories: CategoryGroup[];
    currentTown?: string;
    currentPath?: string;
    base?: string;
  } = $props();

  let town = $state(currentTown);
  let category = $state("");
  let open = $state(false);
  let townSelect: HTMLSelectElement | undefined = $state();
  let chevron: HTMLButtonElement | undefined = $state();

  function nameOf(list: Named[], slug: string) {
    return list.find((item) => item.slug === slug)?.name ?? "";
  }

  function categoryName(slug: string) {
    for (const group of categories) {
      if (group.slug === slug) return group.name;
      const leaf = group.leaves.find((item) => item.slug === slug);
      if (leaf) return leaf.name;
    }
    return "";
  }

  let townLabel = $derived(nameOf(towns, town));
  let catLabel = $derived(categoryName(category));
  let destination = $derived(exploreDestination(town, category));
  let preview = $derived(explorePreview(town, category));
  let href = $derived(withBase(base, destination));
  let here = $derived(sameDestination(destination, currentPath));
  let buttonLabel = $derived(exploreButtonLabel(townLabel, catLabel, here));

  async function expand() {
    open = true;
    await tick();
    townSelect?.focus();
  }

  async function collapse() {
    open = false;
    await tick();
    chevron?.focus();
  }

  function toggle() {
    if (open) void collapse();
    else void expand();
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      void collapse();
    }
  }

  function onPrimaryClick(event: MouseEvent) {
    if (!here) return;
    event.preventDefault();
  }
</script>

<div class="explore-bar" role="navigation" aria-label="Explore" onkeydown={onKeydown}>
  <div class="fb-card">
    <div class="fb-row">
      <button class="fb-pill" type="button" onclick={toggle}>
        <span class="fb-pill-text">
          Explore <strong>{townLabel || "30A"}</strong>
          {#if catLabel}<span> / {catLabel}</span>{/if}
        </span>
      </button>
      <button
        bind:this={chevron}
        class="fb-chevron"
        type="button"
        aria-label={open ? "Collapse explore options" : "Expand explore options"}
        aria-expanded={open}
        aria-controls="explore-panel"
        onclick={toggle}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      </button>
      <a
        class="fb-primary"
        href={href}
        aria-disabled={here ? "true" : undefined}
        onclick={onPrimaryClick}
      >
        {buttonLabel}
      </a>
    </div>

    {#if open}
      <div class="fb-panel" id="explore-panel">
        <div class="fb-fields">
          <label class="fb-label">
            Town
            <select class="fb-control" bind:this={townSelect} bind:value={town}>
              <option value="">All towns</option>
              {#each towns as item}
                <option value={item.slug}>{item.name}</option>
              {/each}
            </select>
          </label>
          <label class="fb-label">
            Category
            <select class="fb-control" bind:value={category}>
              <option value="">Any category</option>
              {#each categories as group}
                <optgroup label={group.name}>
                  <option value={group.slug}>{group.name}</option>
                  {#each group.leaves as leaf}
                    <option value={leaf.slug}>{leaf.name}</option>
                  {/each}
                </optgroup>
              {/each}
            </select>
          </label>
        </div>
        <p class="fb-preview">
          <a href={href}>{preview}</a>
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  .explore-bar {
    margin-block: var(--size-5);
  }
</style>
