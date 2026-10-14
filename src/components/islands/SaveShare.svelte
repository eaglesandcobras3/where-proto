<script lang="ts">
  import { openAuth } from "../../lib/auth-return";
  import { personaSignedIn, PERSONA_EVENT, readPersona } from "../../lib/proto-persona";
  import {
    DEFAULT_COLLECTION,
    collectionsFrom,
    isSaved,
    saveItem,
    savedItem,
    unsaveItem,
    type SavedEntityType,
  } from "../../lib/saved";

  let {
    type,
    slug,
    name,
    href = "",
    saveLabel = "Save",
    savedHint = "Saved to {collection}",
    prompt = "Sign in to keep your saved places",
  }: {
    type: SavedEntityType;
    slug: string;
    name: string;
    href?: string;
    saveLabel?: string;
    savedHint?: string;
    prompt?: string;
  } = $props();

  let signedIn = $state(false);
  let saved = $state(false);
  let collection = $state(DEFAULT_COLLECTION);
  let collections = $state<string[]>([DEFAULT_COLLECTION]);
  let picker = $state(false);
  let newName = $state("");
  let toast = $state("");

  function refresh() {
    signedIn = personaSignedIn(readPersona());
    saved = isSaved(type, slug);
    collection = savedItem(type, slug)?.collection ?? DEFAULT_COLLECTION;
    collections = collectionsFrom();
  }

  function showToast(message: string) {
    toast = message;
    window.setTimeout(() => {
      if (toast === message) toast = "";
    }, 2800);
  }

  function persist(nextCollection: string) {
    saveItem(type, slug, nextCollection);
    refresh();
    showToast(savedHint.replace("{collection}", nextCollection));
  }

  function onSave() {
    if (!saved) {
      persist(collection);
      picker = signedIn;
      if (!signedIn) {
        openAuth({ mode: "signup", returnTo: window.location.pathname });
        showToast(prompt);
      }
      return;
    }
    unsaveItem(type, slug);
    picker = false;
    refresh();
    showToast("Removed from saved");
  }

  function choose(name: string) {
    persist(name);
    picker = false;
    newName = "";
  }

  function createCollection() {
    const next = newName.trim();
    if (!next) return;
    choose(next);
  }

  async function onShare() {
    const url = href || window.location.pathname;
    const abs = new URL(url, window.location.origin).toString().split("?")[0];
    const payload = { title: name, url: abs };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch {
      /* fall through to copy */
    }
    try {
      await navigator.clipboard.writeText(abs);
      showToast("Link copied");
    } catch {
      showToast(abs);
    }
  }

  $effect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(PERSONA_EVENT, onChange);
    window.addEventListener("w30a:saved", onChange);
    return () => {
      window.removeEventListener(PERSONA_EVENT, onChange);
      window.removeEventListener("w30a:saved", onChange);
    };
  });
</script>

<div class="pair">
  <button class="icon-btn" class:saved type="button" aria-pressed={saved} onclick={onSave}>
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.4L6 20V5.5a1 1 0 0 1 1-1Z"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linejoin="round"
      ></path>
    </svg>
    <span>{saved ? "Saved" : saveLabel}</span>
  </button>
  <button class="icon-btn" type="button" onclick={onShare}>
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="6" cy="12" r="2.1" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
      <circle cx="18" cy="6.5" r="2.1" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
      <circle cx="18" cy="17.5" r="2.1" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
      <path d="m8 11 8-3.8M8 13l8 3.8" fill="none" stroke="currentColor" stroke-width="1.75"></path>
    </svg>
    <span>Share</span>
  </button>
  {#if picker && signedIn}
    <div class="picker" role="dialog" aria-label="Save to collection">
      <p>Save to</p>
      {#each collections as item}
        <button type="button" class:active={item === collection} onclick={() => choose(item)}>{item}</button>
      {/each}
      <form onsubmit={(event) => { event.preventDefault(); createCollection(); }}>
        <input bind:value={newName} placeholder="New collection name" aria-label="New collection name" />
        <button type="submit">Create</button>
      </form>
    </div>
  {/if}
  {#if toast}
    <p class="toast" role="status">{toast}</p>
  {/if}
</div>

<style>
  .pair {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    align-items: center;
  }
  .icon-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 2.5rem;
    padding: 0.4rem 0.85rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-button);
    background: white;
    color: var(--brand-ink);
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  .icon-btn.saved {
    background: var(--brand-teal-soft);
    border-color: var(--brand-teal);
    color: var(--brand-teal);
  }
  .picker {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    z-index: 20;
    display: grid;
    gap: 0.35rem;
    min-width: 14rem;
    padding: 0.75rem;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
  }
  .picker p {
    margin: 0;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .picker button,
  .picker input {
    font: inherit;
  }
  .picker > button {
    border: 0;
    border-radius: var(--radius-button);
    background: var(--brand-sand-dark);
    color: var(--brand-ink);
    min-height: 2rem;
    text-align: left;
    padding: 0.35rem 0.6rem;
    cursor: pointer;
  }
  .picker > button.active {
    background: var(--brand-teal);
    color: white;
  }
  .picker form {
    display: flex;
    gap: 0.35rem;
  }
  .picker input {
    flex: 1;
    min-width: 0;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-button);
    padding: 0.35rem 0.55rem;
  }
  .picker form button {
    border: 0;
    border-radius: var(--radius-button);
    background: var(--brand-teal);
    color: white;
    padding: 0.35rem 0.6rem;
    cursor: pointer;
  }
  .toast {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    z-index: 21;
    margin: 0;
    padding: 0.45rem 0.7rem;
    border-radius: var(--radius-button);
    background: var(--brand-deep);
    color: white;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    white-space: nowrap;
  }
</style>
