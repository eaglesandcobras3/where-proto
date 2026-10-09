<script lang="ts">
  let { audience = "visitor" }: { audience?: "visitor" | "business" } = $props();
  let submitted = $state(false);

  function onSubmit(event: Event) {
    event.preventDefault();
    submitted = true;
  }
</script>

<form class="form" onsubmit={onSubmit}>
  <wa-input label="Email" type="email" required placeholder="you@example.com"></wa-input>
  {#if audience === "business"}
    <wa-input label="Business name" placeholder="Optional"></wa-input>
  {/if}
  <wa-button variant="brand" type="submit">Subscribe</wa-button>
  {#if submitted}
    <p class="note">Prototype only: no email is stored.</p>
  {/if}
</form>

<style>
  .form {
    display: grid;
    gap: var(--size-3);
    max-width: 420px;
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
