<script lang="ts">
  import MediaStrip, { type MediaItem } from "./MediaStrip.svelte";

  let {
    official = [],
    community = [],
    officialLabel = "Business photos",
    communityLabel = "Community photos",
    fallbackLabel = "Gallery",
  }: {
    official?: MediaItem[];
    community?: MediaItem[];
    officialLabel?: string;
    communityLabel?: string;
    fallbackLabel?: string;
  } = $props();

  const fallback: MediaItem[] = [{ kind: "photo", label: fallbackLabel }];
  let source = $state<"official" | "community">(official.length > 0 ? "official" : "community");
  const showToggle = $derived(official.length > 0 && community.length > 0);
  const items = $derived(
    source === "community" && community.length > 0
      ? community
      : official.length > 0
        ? official
        : community.length > 0
          ? community
          : fallback,
  );
</script>

{#if showToggle}
  <div class="toggle" role="tablist" aria-label="Photo source">
    <button
      type="button"
      role="tab"
      aria-selected={source === "official"}
      class:is-on={source === "official"}
      onclick={() => (source = "official")}
    >
      {officialLabel}
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={source === "community"}
      class:is-on={source === "community"}
      onclick={() => (source = "community")}
    >
      {communityLabel}
    </button>
  </div>
{/if}

<MediaStrip {items} empty="No photos yet" scroll />

<style>
  .toggle {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-bottom: var(--size-3);
    padding: 0.2rem;
    width: fit-content;
    max-width: 100%;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-pill);
    background: var(--brand-sand);
  }
  button {
    appearance: none;
    border: 0;
    border-radius: var(--radius-pill);
    padding: 0.4rem 0.85rem;
    background: transparent;
    color: var(--brand-ink-soft);
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  button.is-on {
    background: white;
    color: var(--brand-deep);
    box-shadow: var(--shadow-card);
  }
</style>
