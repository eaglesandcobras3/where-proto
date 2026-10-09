<script lang="ts">
  let {
    title,
    body,
    action,
    kind = "update",
  }: {
    title: string;
    body: string;
    action: string;
    kind?: "update" | "event" | "photo" | "settings";
  } = $props();

  let submitted = $state(false);

  function onSubmit(event: Event) {
    event.preventDefault();
    submitted = true;
  }
</script>

<article class="card">
  <h3>{title}</h3>
  <p>{body}</p>
  <form onsubmit={onSubmit}>
    {#if kind === "update"}
      <wa-textarea placeholder="What is happening?" rows="2"></wa-textarea>
    {:else if kind === "event"}
      <wa-input placeholder="Event title"></wa-input>
    {:else if kind === "settings"}
      <wa-input label="Phone" value="(850) 555-0101"></wa-input>
      <wa-textarea label="Description" rows="3"></wa-textarea>
    {/if}
    <wa-button variant="brand" type="submit">{action}</wa-button>
  </form>
  {#if submitted}
    <p class="note">Prototype only: nothing is posted.</p>
  {/if}
</article>

<style>
  .card {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-4);
    display: grid;
    gap: var(--size-3);
    align-content: start;
  }
  h3 {
    margin: 0;
    font-size: var(--font-size-2);
  }
  p {
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    margin: 0;
  }
  form {
    display: grid;
    gap: var(--size-3);
  }
  .note {
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    margin: 0;
  }
</style>
