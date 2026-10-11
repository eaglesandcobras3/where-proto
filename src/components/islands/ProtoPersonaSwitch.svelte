<script lang="ts">
  import {
    PERSONAS,
    PERSONA_EVENT,
    type ProtoPersona,
    readPersona,
    writePersona,
  } from "../../lib/proto-persona";

  let open = $state(false);
  let persona = $state<ProtoPersona>("guest");

  const current = $derived(PERSONAS.find((item) => item.id === persona) ?? PERSONAS[0]);

  function select(next: ProtoPersona) {
    persona = next;
    writePersona(next);
    open = false;
  }

  $effect(() => {
    persona = readPersona();
    document.documentElement.dataset.persona = persona;
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ persona?: ProtoPersona }>).detail;
      if (detail?.persona) persona = detail.persona;
      else persona = readPersona();
    };
    window.addEventListener(PERSONA_EVENT, onChange);
    return () => window.removeEventListener(PERSONA_EVENT, onChange);
  });
</script>

<div class="proto">
  {#if open}
    <div class="panel" role="dialog" aria-label="Prototype persona">
      <header class="panel__head">
        <div>
          <p class="eyebrow">Prototype mode</p>
          <h2>Who are you browsing as?</h2>
        </div>
        <button class="close" type="button" aria-label="Close" onclick={() => (open = false)}>×</button>
      </header>
      <p class="lede">
        Switches chrome and gates in this browser only — not real auth.
      </p>
      <div class="list" role="list">
        {#each PERSONAS as item (item.id)}
          <button
            type="button"
            class="option"
            class:active={persona === item.id}
            role="listitem"
            onclick={() => select(item.id)}
          >
            <span class="option__label">{item.label}</span>
            <span class="option__blurb">{item.blurb}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <button class="fab" type="button" aria-expanded={open} onclick={() => (open = !open)}>
    <span class="fab__kicker">Mode</span>
    <span class="fab__value">{current.short}</span>
  </button>
</div>

<style>
  .proto {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 80;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.65rem;
    width: min(20.5rem, calc(100vw - 2rem));
    font-family: var(--font-body);
    pointer-events: none;
  }
  .proto > * {
    pointer-events: auto;
  }

  .fab {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
    min-height: 2.75rem;
    height: auto;
    padding: 0.55rem 0.9rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-pill);
    background: var(--brand-deep);
    color: white;
    box-shadow: 0 10px 28px rgba(12, 35, 46, 0.28);
    cursor: pointer;
    text-align: left;
    white-space: nowrap;
  }
  .fab:hover {
    background: #071820;
  }
  .fab__kicker {
    font-size: 0.625rem;
    font-weight: var(--font-weight-7);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #85f6e5;
    line-height: 1.2;
  }
  .fab__value {
    font-family: var(--font-display);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    line-height: 1.2;
  }

  .panel {
    width: 100%;
    padding: 1rem;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: 1rem;
    box-shadow: 0 18px 48px rgba(12, 35, 46, 0.22);
  }
  .panel__head {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    align-items: flex-start;
  }
  .eyebrow {
    margin: 0 0 0.25rem;
    font-size: 0.625rem;
    font-weight: var(--font-weight-7);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--brand-teal);
    line-height: 1.3;
  }
  h2 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: var(--font-weight-8);
    color: var(--brand-deep);
    line-height: 1.25;
  }
  .close {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border: 0;
    border-radius: 50%;
    background: var(--brand-sand);
    color: var(--brand-ink-soft);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
  }
  .lede {
    margin: 0.55rem 0 0.85rem;
    font-size: 0.75rem;
    color: var(--brand-ink-soft);
    line-height: 1.45;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .option {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    width: 100%;
    height: auto;
    min-height: 0;
    margin: 0;
    padding: 0.75rem 0.85rem;
    border: 1px solid var(--brand-line);
    border-radius: 0.75rem;
    background: var(--brand-sand);
    box-shadow: none;
    cursor: pointer;
    text-align: left;
    white-space: normal;
    overflow: visible;
    appearance: none;
    -webkit-appearance: none;
    font-family: var(--font-body);
    font-size: 0.875rem;
    line-height: 1.35;
    color: var(--brand-ink);
  }
  .option:hover {
    border-color: #cbd5e1;
    background: white;
  }
  .option.active {
    border-color: var(--brand-teal);
    background: var(--brand-teal-soft);
  }
  .option__label,
  .option__blurb {
    display: block;
    width: 100%;
    position: static;
  }
  .option__label {
    font-family: var(--font-display);
    font-size: 0.875rem;
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
    line-height: 1.3;
  }
  .option__blurb {
    font-size: 0.75rem;
    font-weight: var(--font-weight-4);
    color: var(--brand-ink-soft);
    line-height: 1.4;
  }
</style>
