<script lang="ts">
  import { openAuth } from "../../lib/auth-return";
  import { PERSONA_EVENT, personaSignedIn, readPersona } from "../../lib/proto-persona";

  const DRAFT_KEY = "w30a:reply-draft";

  let {
    prompt = "Write a reply…",
    placeholder = "Share a local tip.",
  }: {
    prompt?: string;
    placeholder?: string;
  } = $props();

  let signedIn = $state(false);
  let body = $state("");
  let mode = $state<"idle" | "compose" | "gate">("idle");
  let submitted = $state(false);

  function stashDraft() {
    if (typeof window === "undefined" || !body.trim()) return;
    sessionStorage.setItem(DRAFT_KEY, body);
  }

  function restoreDraft() {
    if (typeof window === "undefined") return;
    const draft = sessionStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    body = draft;
    sessionStorage.removeItem(DRAFT_KEY);
    mode = "compose";
  }

  function onPrompt() {
    if (signedIn) {
      mode = "compose";
      return;
    }
    mode = "gate";
    stashDraft();
    openAuth({ mode: "signup", returnTo: window.location.pathname });
  }

  function onSubmit(event: Event) {
    event.preventDefault();
    if (!signedIn) {
      stashDraft();
      mode = "gate";
      openAuth({ mode: "signup", returnTo: window.location.pathname });
      return;
    }
    submitted = true;
  }

  $effect(() => {
    const sync = () => {
      signedIn = personaSignedIn(readPersona());
      if (signedIn && mode === "gate") {
        restoreDraft();
        mode = "compose";
      }
    };
    sync();
    window.addEventListener(PERSONA_EVENT, sync);
    return () => window.removeEventListener(PERSONA_EVENT, sync);
  });
</script>

<section class="composer" id="reply">
  {#if mode === "idle"}
    <button class="prompt" type="button" onclick={onPrompt}>
      <span class="avatar" aria-hidden="true">+</span>
      <span class="prompt__text">{prompt}</span>
    </button>
  {:else if mode === "gate"}
    <div class="gate">
      <p class="gate__title">Log in to reply</p>
      <p class="gate__copy">Create an account or sign in to share a tip. Reading stays open to everyone.</p>
      <div class="actions">
        <button class="btn btn--solid" type="button" onclick={() => openAuth({ mode: "login", returnTo: window.location.pathname })}>Log in</button>
        <button class="btn btn--quiet" type="button" onclick={() => openAuth({ mode: "signup", returnTo: window.location.pathname })}>Create account</button>
        <button class="text-btn" type="button" onclick={() => (mode = "idle")}>Not now</button>
      </div>
    </div>
  {:else}
    <form class="form" onsubmit={onSubmit}>
      <label class="label" for="ask-reply">Your reply</label>
      <textarea
        id="ask-reply"
        name="body"
        rows="3"
        {placeholder}
        bind:value={body}
      ></textarea>
      <div class="actions">
        <button class="btn btn--solid" type="submit">Reply</button>
        <button class="text-btn" type="button" onclick={() => (mode = "idle")}>Cancel</button>
      </div>
      {#if submitted}
        <p class="hint">Prototype only: this does not send anything.</p>
      {/if}
    </form>
  {/if}
</section>

<style>
  .composer {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: 1rem;
  }
  .prompt {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
    border: 0;
    background: transparent;
    padding: 0.85rem 1rem;
    cursor: pointer;
    color: inherit;
    font: inherit;
  }
  .avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: var(--brand-teal-soft);
    color: var(--brand-deep);
    display: grid;
    place-items: center;
    font-weight: var(--font-weight-7);
    flex-shrink: 0;
  }
  .prompt__text {
    color: var(--brand-ink-soft);
    font-size: var(--font-size-2);
  }
  .prompt:hover .prompt__text {
    color: var(--brand-deep);
  }
  .gate,
  .form {
    display: grid;
    gap: var(--size-3);
    padding: var(--size-4);
  }
  .gate__title {
    margin: 0;
    font-size: var(--font-size-3);
    color: var(--brand-deep);
  }
  .gate__copy,
  .hint {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .label {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  textarea {
    width: 100%;
    resize: vertical;
    border: 1px solid var(--brand-line);
    border-radius: 0.75rem;
    padding: var(--size-3);
    font: inherit;
    color: var(--brand-ink);
    background: white;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--size-2);
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 0.55rem 1rem;
    border-radius: var(--radius-button);
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
    background: var(--brand-deep);
    color: white;
  }
  .btn--quiet {
    background: white;
    color: var(--brand-deep);
    border-color: var(--brand-line);
  }
  .text-btn {
    border: 0;
    background: none;
    padding: 0.35rem 0.5rem;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    cursor: pointer;
  }
</style>
