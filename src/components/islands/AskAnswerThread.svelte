<script lang="ts">
  import type { AskAnswerView } from "../../lib/ask-thread";

  let {
    answers = [],
  }: {
    answers: AskAnswerView[];
  } = $props();
</script>

<ol class="stack">
  {#each answers as item}
    <li class="item" data-kind={item.kind}>
      <div class="avatar" class:avatar--ai={item.kind.startsWith("ai")} class:avatar--guide={item.kind === "local_guide"} aria-hidden="true">
        {item.initial}
      </div>
      <div class="copy">
        <p class="meta">
          <span class="badge" data-kind={item.kind}>{item.badge}</span>
          {#if item.authorHref}
            <a class="author" href={item.authorHref}>{item.author}</a>
          {:else}
            <span class="author">{item.author}</span>
          {/if}
          {#if item.when}
            <span class="when">· {item.when}</span>
          {/if}
        </p>
        <p class="body">{item.body}</p>
      </div>
    </li>
  {/each}
</ol>

<style>
  .stack {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--size-4);
  }
  .item {
    display: grid;
    grid-template-columns: 2.25rem minmax(0, 1fr);
    gap: 0.75rem;
    padding-top: var(--size-3);
    border-top: 1px solid var(--brand-line);
  }
  .item:first-child {
    padding-top: 0;
    border-top: 0;
  }
  .avatar {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: var(--brand-sand-dark);
    color: var(--brand-deep);
    font-size: 0.6875rem;
    font-weight: var(--font-weight-8);
  }
  .avatar--ai {
    background: var(--brand-selected-soft);
    color: var(--brand-selected);
  }
  .avatar--guide {
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem 0.45rem;
    margin: 0 0 0.35rem;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .badge {
    padding: 0.1rem 0.45rem;
    border-radius: var(--radius-pill);
    background: var(--brand-sand-dark);
    font-weight: var(--font-weight-8);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .badge[data-kind="ai_instant"],
  .badge[data-kind="ai_followup"] {
    background: var(--brand-selected-soft);
    color: var(--brand-selected);
  }
  .badge[data-kind="local_guide"] {
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
  }
  .author {
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
  }
  .body {
    margin: 0;
    font-size: var(--font-size-1);
    line-height: 1.55;
    color: var(--brand-ink);
  }
</style>
