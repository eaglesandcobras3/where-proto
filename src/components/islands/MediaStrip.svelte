<script lang="ts">
  import { cardImageSrc } from "../../lib/card-image";

  export type MediaItem =
    | { kind: "photo"; label: string }
    | { kind: "video"; label: string; embed: string; href?: string };

  let {
    items = [],
    empty = "No photos yet",
    scroll = false,
  }: {
    items: MediaItem[];
    empty?: string;
    scroll?: boolean;
  } = $props();

  let dialog = $state<HTMLDialogElement>();
  let index = $state(0);
  let open = $state(false);
  let current = $derived(items[index]);

  function openAt(next: number) {
    if (!items[next]) return;
    index = next;
    open = true;
    dialog?.showModal();
  }

  function close() {
    dialog?.close();
  }

  function prev() {
    if (items.length < 2) return;
    index = (index - 1 + items.length) % items.length;
  }

  function next() {
    if (items.length < 2) return;
    index = (index + 1) % items.length;
  }

  function onDialogKey(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  }
</script>

{#if items.length === 0}
  <p class="empty">{empty}</p>
{:else}
  <div class="strip" class:strip--scroll={scroll}>
    {#each items as item, i}
      <figure class:figure--video={item.kind === "video"}>
        <button
          class="tile"
          class:tile--video={item.kind === "video"}
          type="button"
          aria-label={item.kind === "video" ? `Play ${item.label}` : `View ${item.label}`}
          onclick={() => openAt(i)}
        >
          {#if item.kind === "photo"}
            <img src={cardImageSrc(item.label.charAt(0), "4/3")} alt="" width="400" height="300" />
          {:else}
            <span class="poster img-placeholder" aria-hidden="true">{item.label.charAt(0)}</span>
            <span class="play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <circle cx="12" cy="12" r="11" fill="rgba(12,35,46,0.72)"></circle>
                <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="white"></path>
              </svg>
            </span>
          {/if}
        </button>
        <figcaption>{item.label}</figcaption>
      </figure>
    {/each}
  </div>
{/if}

<dialog
  class="lightbox"
  bind:this={dialog}
  aria-label={current?.label ?? "Media"}
  onclose={() => {
    open = false;
  }}
  onkeydown={onDialogKey}
  onclick={(event) => {
    if (event.target === dialog) close();
  }}
>
  {#if current}
    <div class="stage">
      <button class="icon close" type="button" aria-label="Close" onclick={close}>×</button>
      {#if items.length > 1}
        <button class="icon prev" type="button" aria-label="Previous" onclick={prev}>‹</button>
        <button class="icon next" type="button" aria-label="Next" onclick={next}>›</button>
      {/if}
      <div class="frame">
        {#if current.kind === "photo"}
          <img src={cardImageSrc(current.label.charAt(0), "4/3")} alt={current.label} />
        {:else if open}
          {#key index}
            <iframe
              src={current.embed}
              title={current.label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          {/key}
        {/if}
      </div>
      <p class="caption">
        {#if current.kind === "video" && current.href}
          <a href={current.href} target="_blank" rel="noopener noreferrer">{current.label}</a>
        {:else}
          {current.label}
        {/if}
        {#if items.length > 1}
          <span class="count">{index + 1} / {items.length}</span>
        {/if}
      </p>
    </div>
  {/if}
</dialog>

<style>
  .empty {
    color: var(--brand-ink-soft);
  }
  .strip {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--size-3);
  }
  figure {
    margin: 0;
    min-width: 0;
  }
  .tile {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    border-radius: var(--radius-card);
    overflow: hidden;
    cursor: pointer;
    background: var(--brand-sand-dark);
  }
  .tile img,
  .poster {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }
  .tile--video img,
  .tile--video .poster {
    aspect-ratio: 16 / 9;
  }
  .play {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
  }
  figcaption {
    margin-top: var(--size-2);
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  @media (max-width: 767px) {
    .strip--scroll {
      display: flex;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x mandatory;
      padding-bottom: 0.15rem;
    }
    .strip--scroll figure {
      flex: 0 0 8.75rem;
      scroll-snap-align: start;
    }
    .strip--scroll .figure--video {
      flex-basis: 12.5rem;
    }
  }
  .lightbox {
    width: min(72rem, calc(100vw - 1.5rem));
    max-width: calc(100vw - 1.5rem);
    height: auto;
    max-height: calc(100vh - 1.5rem);
    margin: auto;
    padding: 0;
    border: 0;
    background: transparent;
  }
  .lightbox::backdrop {
    background: rgba(12, 35, 46, 0.78);
  }
  .stage {
    position: relative;
    display: grid;
    gap: 0.75rem;
    color: white;
  }
  .frame {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-3);
    overflow: hidden;
    background: #0c232e;
  }
  .frame img,
  .frame iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    object-fit: contain;
  }
  .caption {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    margin: 0;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
  }
  .caption a {
    color: white;
  }
  .count {
    color: rgba(255, 255, 255, 0.7);
    font-weight: var(--font-weight-5);
  }
  .icon {
    position: absolute;
    z-index: 2;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 0;
    border-radius: 999px;
    background: rgba(12, 35, 46, 0.72);
    color: white;
    font: inherit;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
  }
  .close {
    top: 0.65rem;
    right: 0.65rem;
  }
  .prev,
  .next {
    top: 50%;
    transform: translateY(-50%);
  }
  .prev {
    left: 0.65rem;
  }
  .next {
    right: 0.65rem;
  }
</style>
