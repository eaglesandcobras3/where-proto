<script lang="ts">
  import { href as siteHref } from "../../lib/href";
  import { PERSONA_EVENT, personaSignedIn, readPersona } from "../../lib/proto-persona";
  import {
    DEFAULT_COLLECTION,
    SAVED_EVENT,
    collectionsFrom,
    readSaved,
    seedSaved,
    type SavedEntityType,
  } from "../../lib/saved";

  interface Card {
    type: SavedEntityType;
    slug: string;
    title: string;
    meta: string;
    summary: string;
    href: string;
    cta: string;
    letter: string;
    image: string;
  }

  let {
    seed = [],
    cards = [],
    initialType = "all",
  }: {
    seed: Array<{ type: SavedEntityType; slug: string }>;
    cards: Card[];
    initialType?: string;
  } = $props();

  let type = $state(initialType);
  let collection = $state("all");
  let items = $state(readSaved());
  let tripPrompt = $state(false);

  const catalog = $derived(new Map(cards.map((card) => [`${card.type}:${card.slug}`, card])));
  const collections = $derived(collectionsFrom(items));
  const visible = $derived(
    items
      .filter((item) => collection === "all" || item.collection === collection)
      .filter((item) => type === "all" || item.type === type)
      .map((item) => {
        const card = catalog.get(`${item.type}:${item.slug}`);
        return card ? { ...card, collection: item.collection } : null;
      })
      .filter((item): item is Card & { collection: string } => Boolean(item)),
  );

  const filters: { slug: string; label: string }[] = [
    { slug: "all", label: "All" },
    { slug: "business", label: "Businesses" },
    { slug: "stay", label: "Stays" },
    { slug: "event", label: "Events" },
    { slug: "guide", label: "Guides" },
    { slug: "town", label: "Towns" },
    { slug: "area", label: "Areas" },
  ];

  $effect(() => {
    items = seedSaved(seed);
    if (items.length >= 3) tripPrompt = true;
    const onChange = () => {
      items = readSaved();
      if (items.length >= 3) tripPrompt = true;
    };
    window.addEventListener(SAVED_EVENT, onChange);
    window.addEventListener(PERSONA_EVENT, onChange);
    return () => {
      window.removeEventListener(SAVED_EVENT, onChange);
      window.removeEventListener(PERSONA_EVENT, onChange);
    };
  });
</script>

{#if tripPrompt && personaSignedIn(readPersona())}
  <p class="trip">
    Planning a trip? You have {items.length} saved places.
    <a href={siteHref("/profile/favorites")}>View your trip.</a>
  </p>
{/if}

<div class="collections" role="list">
  <button type="button" class:active={collection === "all"} onclick={() => (collection = "all")}>
    All collections
  </button>
  {#each collections as name}
    <button type="button" class:active={collection === name} onclick={() => (collection = name)}>
      {name}
    </button>
  {/each}
</div>

<div class="filters" role="list">
  {#each filters as item}
    <button type="button" class:active={type === item.slug} onclick={() => (type = item.slug)}>
      {item.label}
    </button>
  {/each}
</div>

<div class="cards">
  {#each visible as card}
    <article class="card">
      <div class="media">
        <img src={card.image} alt="" width="400" height="300" />
        <span class="type">{card.type}</span>
      </div>
      <div class="body">
        <p class="meta">{card.collection} · {card.meta}</p>
        <h3><a href={card.href}>{card.title}</a></h3>
        <p class="summary">{card.summary}</p>
        <a class="cta" href={card.href}>{card.cta} →</a>
      </div>
    </article>
  {:else}
    <p class="empty">
      Nothing saved yet. Tap the bookmark on any business, town, stay, or guide.
    </p>
  {/each}
</div>

<style>
  .trip,
  .empty {
    margin: 0 0 var(--size-4);
    color: var(--brand-ink-soft);
    font-size: var(--font-size-1);
  }
  .trip {
    padding: 0.75rem 0.9rem;
    border-radius: var(--radius-card);
    background: var(--brand-teal-soft);
    color: var(--brand-deep);
    font-weight: var(--font-weight-6);
  }
  .trip a {
    color: var(--brand-teal);
    font-weight: var(--font-weight-7);
  }
  .collections,
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin: 0 0 var(--size-4);
  }
  .collections button,
  .filters button {
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-pill);
    border: 1px solid var(--brand-line);
    background: var(--brand-sand-dark);
    color: var(--brand-ink);
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
    cursor: pointer;
  }
  .collections button.active,
  .filters button.active {
    background: var(--brand-teal);
    border-color: var(--brand-teal);
    color: white;
    font-weight: var(--font-weight-7);
  }
  .cards {
    display: grid;
    gap: var(--size-3);
  }
  .card {
    display: grid;
    gap: var(--size-3);
    grid-template-columns: 1fr;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    overflow: hidden;
    background: white;
    box-shadow: var(--shadow-card);
  }
  .media {
    position: relative;
    aspect-ratio: 16 / 10;
    background: var(--brand-teal-soft);
  }
  .media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .type {
    position: absolute;
    top: 0.65rem;
    left: 0.65rem;
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-pill);
    background: var(--brand-sand-dark);
    color: var(--brand-ink-soft);
    font-size: 0.625rem;
    font-weight: var(--font-weight-8);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .body {
    padding: 0 var(--size-4) var(--size-4);
  }
  .meta {
    margin: 0 0 0.25rem;
    font-size: var(--font-size-0);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  h3 {
    margin: 0 0 0.35rem;
    font-size: var(--font-size-3);
  }
  h3 a {
    color: inherit;
  }
  .summary {
    margin: 0 0 0.45rem;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .cta {
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
  }
  @media (min-width: 720px) {
    .card {
      grid-template-columns: 11rem minmax(0, 1fr);
    }
    .media {
      aspect-ratio: auto;
      min-height: 100%;
    }
    .body {
      padding: var(--size-4);
    }
  }
</style>
