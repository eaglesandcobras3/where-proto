<script lang="ts">
  interface Named {
    slug: string;
    name: string;
  }

  let { towns = [], categories = [] }: { towns: Named[]; categories: Named[] } = $props();

  function onSubmit(event: Event) {
    event.preventDefault();
    const dialog = document.getElementById("add-business-dialog") as { show?: () => void } | null;
    dialog?.show?.();
  }

  function closeDialog() {
    const dialog = document.getElementById("add-business-dialog") as { hide?: () => void } | null;
    dialog?.hide?.();
  }
</script>

<form class="form" onsubmit={onSubmit}>
  <wa-input label="Business name" required placeholder="Seaside Coffee Roasters"></wa-input>
  <wa-select label="Town" required placeholder="Choose a town">
    {#each towns as town}
      <wa-option value={town.slug}>{town.name}</wa-option>
    {/each}
  </wa-select>
  <wa-select label="Category" required placeholder="Choose a category">
    {#each categories as category}
      <wa-option value={category.slug}>{category.name}</wa-option>
    {/each}
  </wa-select>
  <wa-input label="Phone" type="tel" placeholder="(850) 555-0100"></wa-input>
  <wa-input label="Website" type="url" placeholder="https://example.com"></wa-input>
  <wa-textarea
    label="Description"
    rows="4"
    placeholder="What do you do, and what makes it great? Stick to the facts about the business itself."
  ></wa-textarea>
  <wa-button variant="brand" type="submit">Submit for review</wa-button>
</form>

<wa-dialog label="Mock submission" id="add-business-dialog">
  This is a prototype: the form does not send anything. In the real build this posts to the listings
  endpoint and lands in the review queue.
  <wa-button slot="footer" variant="brand" onclick={closeDialog}>Got it</wa-button>
</wa-dialog>

<style>
  .form {
    display: grid;
    gap: var(--size-4);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-5);
  }
</style>
