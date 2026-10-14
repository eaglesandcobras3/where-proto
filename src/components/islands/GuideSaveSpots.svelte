<script lang="ts">
  import { openAuth } from "../../lib/auth-return";
  import { personaSignedIn, readPersona } from "../../lib/proto-persona";
  import { DEFAULT_COLLECTION, saveItem } from "../../lib/saved";

  let {
    spots = [],
  }: {
    spots: { slug: string; name: string }[];
  } = $props();

  let done = $state(false);

  function saveAll() {
    for (const spot of spots) saveItem("business", spot.slug, DEFAULT_COLLECTION);
    done = true;
    if (!personaSignedIn(readPersona())) {
      openAuth({ mode: "signup", returnTo: window.location.pathname });
    }
  }
</script>

{#if spots.length > 0}
  <div class="nudge">
    <p>Save the spots in this guide</p>
    <button type="button" onclick={saveAll} disabled={done}>
      {done ? `Saved ${spots.length} places to ${DEFAULT_COLLECTION}` : `Save ${spots.length} linked businesses`}
    </button>
  </div>
{/if}

<style>
  .nudge {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
    align-items: center;
    margin-top: var(--size-5);
    padding: var(--size-4);
    background: var(--brand-deep);
    color: white;
    border-radius: var(--radius-card);
  }
  .nudge p {
    margin: 0;
    font-weight: var(--font-weight-7);
  }
  button {
    min-height: 2.5rem;
    padding: 0.45rem 0.9rem;
    border: 0;
    border-radius: var(--radius-button);
    background: var(--mint);
    color: var(--brand-deep);
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.85;
    cursor: default;
  }
</style>
