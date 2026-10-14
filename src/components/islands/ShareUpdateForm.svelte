<script lang="ts">
  import { onMount } from "svelte";

  let {
    townNames = {} as Record<string, string>,
    areaNames = {} as Record<string, string>,
  }: {
    townNames?: Record<string, string>;
    areaNames?: Record<string, string>;
  } = $props();

  let kind = $state<"town" | "area" | "">("");
  let entityName = $state("");
  let submitted = $state(false);

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("share") !== "update") return;
    const town = params.get("town") ?? "";
    const area = params.get("area") ?? "";
    if (area && areaNames[area]) {
      kind = "area";
      entityName = areaNames[area];
      return;
    }
    if (town && townNames[town]) {
      kind = "town";
      entityName = townNames[town];
    }
  });

  function onSubmit(event: Event) {
    event.preventDefault();
    submitted = true;
  }
</script>

{#if kind && entityName}
  <section class="share">
    <h2>Share {kind === "area" ? "an area" : "a town"} update</h2>
    <p>Posting to {entityName}. This stays tied to that place — there is no site-wide updates page.</p>
    <form onsubmit={onSubmit}>
      <label>
        <span>Update</span>
        <textarea rows="3" placeholder="What should visitors know?"></textarea>
      </label>
      <button type="submit">Submit {kind} update</button>
    </form>
    {#if submitted}
      <p class="note">Prototype only: nothing is posted. Live updates would appear on the {entityName} page.</p>
    {/if}
  </section>
{/if}

<style>
  .share {
    margin-bottom: 1.5rem;
    padding: 1.15rem;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
  }
  h2 {
    margin: 0 0 0.4rem;
    color: var(--brand-deep);
    font-size: var(--font-size-3);
  }
  p {
    margin: 0 0 1rem;
    color: var(--brand-ink-soft);
    font-size: var(--font-size-1);
  }
  form {
    display: grid;
    gap: 0.75rem;
  }
  label {
    display: grid;
    gap: 0.35rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
  }
  textarea {
    width: 100%;
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    font: inherit;
    color: var(--brand-ink);
  }
  button {
    justify-self: start;
    min-height: 2.4rem;
    padding: 0.45rem 0.95rem;
    border: 0;
    border-radius: var(--radius-pill);
    background: var(--brand-deep);
    color: white;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  .note {
    margin: 0.85rem 0 0;
  }
</style>
