<script lang="ts">
  import AskAnswerThread from "./AskAnswerThread.svelte";
  import { generatedAskAnswers } from "../../lib/ask-thread";
  import { PERSONA_EVENT, personaSignedIn, readPersona } from "../../lib/proto-persona";

  interface Named {
    slug: string;
    name: string;
  }

  let {
    towns = [],
    topics = [],
    placeName = "",
    tip = "",
    placeholder = "Ask the locals anything about 30A…",
    bare = false,
  }: {
    towns?: Named[];
    topics?: Named[];
    placeName?: string;
    tip?: string;
    placeholder?: string;
    bare?: boolean;
  } = $props();

  const scoped = $derived(Boolean(placeName));
  let signedIn = $state(false);
  let body = $state("");
  let town = $state("");
  let topic = $state("");
  let submitted = $state("");

  function openAuth(next: "login" | "signup") {
    window.dispatchEvent(new CustomEvent("w30a:auth", { detail: { mode: next } }));
  }

  function onSubmit(event: Event) {
    event.preventDefault();
    const asked = body.trim();
    if (!asked) return;
    submitted = asked;
  }

  $effect(() => {
    const sync = () => {
      signedIn = personaSignedIn(readPersona());
    };
    sync();
    window.addEventListener(PERSONA_EVENT, sync);
    return () => window.removeEventListener(PERSONA_EVENT, sync);
  });
</script>

<section class="composer" class:composer--bare={bare}>
  <form class="form" onsubmit={onSubmit}>
    <div class="prompt-row">
      <span class="avatar" aria-hidden="true">You</span>
      <label class="visually-hidden" for="ask-body">Your question</label>
      <textarea
        id="ask-body"
        name="body"
        rows="2"
        {placeholder}
        bind:value={body}
      ></textarea>
    </div>
    <div class="toolbar">
      {#if !scoped}
        <label class="select">
          <span class="visually-hidden">Town</span>
          <select bind:value={town}>
            <option value="">Choose Town / Beach</option>
            {#each towns as item (item.slug)}
              <option value={item.slug}>{item.name}</option>
            {/each}
          </select>
        </label>
        <label class="select">
          <span class="visually-hidden">Category</span>
          <select bind:value={topic}>
            <option value="">Choose Category</option>
            {#each topics as item (item.slug)}
              <option value={item.slug}>{item.name}</option>
            {/each}
          </select>
        </label>
      {/if}
      <button class="btn btn--solid post" type="submit">Ask</button>
    </div>
  </form>

  {#if submitted}
    <div class="instant">
      <p class="asked">
        <strong>You asked</strong>
        {submitted}
      </p>
      <AskAnswerThread answers={generatedAskAnswers(submitted, tip, placeName || undefined)} delayFollowup />
      {#if !signedIn}
        <p class="hint">
          Instant AI and the local-guide note don’t need an account.
          <button class="text-btn" type="button" onclick={() => openAuth("signup")}>Log in</button>
          to keep the thread and add a community reply.
        </p>
      {:else}
        <p class="hint">Community replies can land after the AI follow-up. Prototype only — this does not save.</p>
      {/if}
    </div>
  {/if}
</section>

<style>
  .composer {
    background: white;
    border: 1px solid var(--ask-line, var(--brand-line));
    border-radius: var(--radius-card, 0.75rem);
    box-shadow: var(--shadow-card);
    padding: var(--size-4);
  }
  .composer--bare {
    border: 0;
    box-shadow: none;
    padding: 0;
    background: transparent;
  }
  .prompt-row {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }
  .avatar {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: var(--ask-teal-soft, var(--brand-teal-soft));
    color: var(--ask-navy, var(--brand-deep));
    display: grid;
    place-items: center;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    flex-shrink: 0;
  }
  textarea {
    flex: 1;
    min-width: 0;
    resize: vertical;
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: var(--font-size-2);
    color: var(--brand-ink);
    padding: 0.35rem 0;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    align-items: center;
    margin-top: var(--size-3);
    padding-top: var(--size-3);
    border-top: 1px solid var(--ask-line, var(--brand-line));
  }
  .select {
    flex: 1 1 10rem;
  }
  .select select {
    width: 100%;
    min-height: 2.5rem;
    border: 1px solid var(--ask-line, var(--brand-line));
    border-radius: 0.55rem;
    padding: 0 0.75rem;
    background: var(--brand-sand);
    font: inherit;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
  }
  .post {
    margin-left: auto;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.5rem;
    padding: 0.55rem 1.1rem;
    border-radius: 0.55rem;
    font: inherit;
    font-weight: var(--font-weight-7);
    font-size: var(--font-size-1);
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
  }
  .btn:hover {
    text-decoration: none;
  }
  .btn--solid {
    background: var(--ask-teal, var(--brand-teal));
    color: white;
  }
  .asked {
    margin: 0;
    font-size: var(--font-size-2);
  }
  .asked strong {
    display: block;
    margin-bottom: 0.2rem;
    font-size: var(--font-size-0);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .hint {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .instant {
    display: grid;
    gap: var(--size-3);
    margin-top: var(--size-3);
    padding-top: var(--size-3);
    border-top: 1px solid var(--ask-line, var(--brand-line));
  }
  .text-btn {
    border: 0;
    background: none;
    padding: 0;
    font: inherit;
    font-size: inherit;
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
    cursor: pointer;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
</style>
