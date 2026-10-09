<script lang="ts">
  interface Named {
    slug: string;
    name: string;
  }

  let { towns = [] }: { towns: Named[] } = $props();
  let submitted = $state(false);

  function onSubmit(event: Event) {
    event.preventDefault();
    submitted = true;
  }
</script>

<form class="form" onsubmit={onSubmit}>
  <wa-input label="Title" name="title" required placeholder="Best beach access near Seaside?"></wa-input>
  <wa-select label="Town" name="town" placeholder="Optional town">
    <wa-option value="">None</wa-option>
    {#each towns as town}
      <wa-option value={town.slug}>{town.name}</wa-option>
    {/each}
  </wa-select>
  <wa-textarea label="Question" name="body" rows="4" placeholder="Ask locals something specific."></wa-textarea>
  <wa-button variant="brand" type="submit">Post question</wa-button>
  {#if submitted}
    <p class="note">Prototype only: this does not send anything.</p>
  {/if}
</form>

<style>
  .form {
    display: grid;
    gap: var(--size-4);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-5);
  }
  .note {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
</style>
