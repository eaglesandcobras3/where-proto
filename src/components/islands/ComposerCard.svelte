<script lang="ts">
  import { PROTO_TODAY } from "../../lib/labels";
  import { writePosted } from "../../lib/posted";

  let {
    title,
    body,
    action,
    kind = "update",
    businessSlug = "",
    townSlug = "",
  }: {
    title: string;
    body: string;
    action: string;
    kind?: "update" | "event" | "photo" | "settings" | "faq" | "offer";
    businessSlug?: string;
    townSlug?: string;
  } = $props();

  let submitted = $state(false);
  let rightsConfirmed = $state(false);
  let offerThrough = $state("");
  let offerTitle = $state("");
  let offerTerms = $state("");

  function onSubmit(event: Event) {
    event.preventDefault();
    if (kind === "photo" && !rightsConfirmed) return;
    if (kind === "offer") {
      if (!offerThrough || !offerTitle.trim()) return;
      writePosted({
        slug: `offer-${businessSlug || "listing"}-${Date.now()}`,
        title: offerTitle.trim(),
        body: offerTerms.trim() || offerTitle.trim(),
        createdAt: PROTO_TODAY,
        through: offerThrough,
        type: "limited_offer",
        businessSlug: businessSlug || undefined,
        townSlug: townSlug || undefined,
      });
    }
    submitted = true;
  }
</script>

<article class="card">
  <h3>{title}</h3>
  <p>{body}</p>
  <form onsubmit={onSubmit}>
    {#if kind === "offer"}
      <input bind:value={offerTitle} placeholder="Offer title" required />
      <textarea bind:value={offerTerms} placeholder="Terms" rows="2"></textarea>
      <label class="date-field">
        <span>End date</span>
        <input type="date" required bind:value={offerThrough} />
      </label>
    {:else if kind === "update"}
      <wa-textarea placeholder="What is happening?" rows="2"></wa-textarea>
    {:else if kind === "event"}
      <wa-input placeholder="Event title"></wa-input>
      <wa-input type="date" label="Date"></wa-input>
      <wa-input type="time" label="Time"></wa-input>
      <wa-input placeholder="Location"></wa-input>
      <wa-textarea placeholder="Announcement text for the linked update" rows="2"></wa-textarea>
    {:else if kind === "faq"}
      <wa-input placeholder="Question"></wa-input>
      <wa-textarea placeholder="Answer" rows="3"></wa-textarea>
    {:else if kind === "photo"}
      <wa-input type="file" accept="image/*" multiple></wa-input>
      <label class="rights">
        <input type="checkbox" bind:checked={rightsConfirmed} />
        <span>I confirm I own the rights to these photos.</span>
      </label>
    {:else if kind === "settings"}
      <wa-input label="Phone" value="(850) 555-0101"></wa-input>
      <wa-textarea label="Description" rows="3"></wa-textarea>
    {/if}
    <wa-button variant="brand" type="submit" disabled={(kind === "photo" && !rightsConfirmed) || (kind === "offer" && (!offerThrough || !offerTitle.trim()))}>
      {action}
    </wa-button>
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
  .date-field {
    display: grid;
    gap: 0.35rem;
  }
  .date-field span {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .date-field input,
  input,
  textarea {
    min-height: 2.75rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-button);
    padding: 0.55rem 0.75rem;
    font: inherit;
    width: 100%;
  }
  textarea {
    min-height: 5rem;
    resize: vertical;
  }
  .rights {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
  }
  .rights input {
    margin-top: 0.2rem;
  }
  .note {
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    margin: 0;
  }
</style>
