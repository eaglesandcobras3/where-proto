<script lang="ts">
  let { base = "/" }: { base?: string } = $props();

  let query = $state("");
  let open = $state(false);
  let root = $state<HTMLElement>();
  let input = $state<HTMLInputElement>();

  function path(route: string) {
    const rootPath = base.endsWith("/") ? base.slice(0, -1) : base;
    return route === "/" ? `${rootPath}/` : `${rootPath}${route}`;
  }

  function setOpen(next: boolean) {
    open = next;
    if (next) {
      queueMicrotask(() => input?.focus());
    }
  }

  function submit(event: Event) {
    event.preventDefault();
    const q = query.trim();
    const href = q ? `${path("/search")}?q=${encodeURIComponent(q)}` : path("/search");
    window.location.assign(href);
  }

  $effect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && root?.contains(event.target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  });
</script>

<div class="search" class:open bind:this={root}>
  <button
    class="trigger"
    type="button"
    aria-label="Search"
    aria-expanded={open}
    aria-controls="site-search-popover"
    onclick={() => setOpen(!open)}
  >
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
      <path d="m20 20-4-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
    </svg>
  </button>

  {#if open}
    <form id="site-search-popover" class="popover" role="search" onsubmit={submit}>
      <label class="field">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
          <path d="m20 20-4-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
        </svg>
        <input
          bind:this={input}
          type="search"
          name="q"
          placeholder="Kid-friendly lunch in Seaside"
          autocomplete="off"
          bind:value={query}
        />
      </label>
      <button class="submit" type="submit">Search</button>
    </form>
  {/if}
</div>

<style>
  .search {
    position: relative;
    flex-shrink: 0;
  }
  .trigger {
    width: 2.75rem;
    height: 2.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: white;
    color: var(--brand-ink);
    box-shadow: 0 0 0 1px var(--brand-line);
    cursor: pointer;
  }
  .search.open .trigger {
    color: var(--brand-deep);
    box-shadow: 0 0 0 2px var(--brand-deep);
  }
  .popover {
    position: absolute;
    top: calc(100% + 0.65rem);
    right: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: min(36rem, calc(100vw - 1.5rem));
    padding: 0.7rem;
    background: white;
    border-radius: 1.6rem;
    box-shadow: 0 12px 32px rgba(8, 24, 40, 0.16);
  }
  .field {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem 1rem;
    border: 1.5px solid #c5cdd4;
    border-radius: 999px;
    color: var(--brand-ink-soft);
  }
  .field input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
  }
  .submit {
    flex-shrink: 0;
    border: 0;
    border-radius: 999px;
    background: var(--brand-deep);
    color: white;
    padding: 0.85rem 1.45rem;
    font: inherit;
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  @media (max-width: 640px) {
    .popover {
      position: fixed;
      top: calc(var(--header-h) + 0.5rem);
      left: 0.75rem;
      right: 0.75rem;
      width: auto;
      flex-direction: column;
      align-items: stretch;
    }
    .submit {
      width: 100%;
    }
  }
</style>
