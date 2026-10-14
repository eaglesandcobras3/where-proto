<script lang="ts">
  import type { ListingSurface } from "../../lib/unified-layout";
  import { resultsHeader, SORT_OPTIONS } from "../../lib/unified-layout";

  interface Chip {
    slug: string;
    name: string;
  }

  let {
    surface,
    count = 0,
    sortValue = "",
    chips = [],
    activeChip = "",
    onSort,
    onChip,
  }: {
    surface: ListingSurface;
    count?: number;
    sortValue?: string;
    chips?: Chip[];
    activeChip?: string;
    onSort?: (value: string) => void;
    onChip?: (slug: string) => void;
  } = $props();

  const options = SORT_OPTIONS[surface];
</script>

<div class="listing-toolbar">
  <p class="listing-toolbar__count" aria-live="polite">{resultsHeader(count, surface)}</p>
  <div class="listing-toolbar__meta">
    {#if chips.length}
      <div class="quick-chips" role="group" aria-label="Quick filters">
        {#each chips as chip (chip.slug)}
          <button
            type="button"
            class:active={activeChip === chip.slug}
            onclick={() => onChip?.(activeChip === chip.slug ? "" : chip.slug)}
          >
            {chip.name}
          </button>
        {/each}
      </div>
    {/if}
    {#if options.length}
      <div class="listing-sort">
        <label>
          Sort by:
          <select value={sortValue} onchange={(event) => onSort?.((event.currentTarget as HTMLSelectElement).value)}>
            {#each options as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </label>
      </div>
    {:else if surface === "events"}
      <p class="listing-sort__note">Upcoming first</p>
    {/if}
  </div>
</div>
