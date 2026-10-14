<script lang="ts">
  type Entity = "businesses" | "stays" | "events" | "guides" | "ask";

  const entities: { slug: Entity; name: string; path: string; placeholder: string }[] = [
    {
      slug: "businesses",
      name: "Businesses & Dining",
      path: "/search",
      placeholder: "Search cafes, shops, dining…",
    },
    {
      slug: "stays",
      name: "Stays & Rentals",
      path: "/stays",
      placeholder: "Search inns, cottages, rentals…",
    },
    {
      slug: "events",
      name: "Events & Happenings",
      path: "/events",
      placeholder: "Search concerts, markets, gatherings…",
    },
    {
      slug: "guides",
      name: "Guides & Articles",
      path: "/guides",
      placeholder: "Search guides and itineraries…",
    },
    {
      slug: "ask",
      name: "Ask Community",
      path: "/ask",
      placeholder: "Ask about carts, parking, dining…",
    },
  ];

  let { base = "/" }: { base?: string } = $props();

  let entity = $state<Entity>("businesses");
  let query = $state("");
  let open = $state(false);
  let root = $state<HTMLElement>();
  let input = $state<HTMLInputElement>();

  let current = $derived(entities.find((item) => item.slug === entity) ?? entities[0]);

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
    const target = entities.find((item) => item.slug === entity) ?? entities[0];
    const q = query.trim();
    const href = q
      ? `${path(target.path)}?q=${encodeURIComponent(q)}`
      : path(target.path);
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
    <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.25" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
      <path
        d="M15.2 15.2 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
      ></path>
    </svg>
  </button>

  {#if open}
    <div id="site-search-popover" class="popover">
      <div class="pills" role="group" aria-label="What to search">
        {#each entities as item (item.slug)}
          <button
            class:active={entity === item.slug}
            type="button"
            onclick={() => (entity = item.slug)}
          >
            {item.name}
          </button>
        {/each}
      </div>

      <form class="row" role="search" onsubmit={submit}>
        <label class="field">
          <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.25" fill="none" stroke="currentColor" stroke-width="1.75"></circle>
            <path
              d="M15.2 15.2 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
            ></path>
          </svg>
          <input
            bind:this={input}
            type="search"
            name="q"
            placeholder={current.placeholder}
            autocomplete="off"
            bind:value={query}
          />
        </label>
        <button class="submit" type="submit">Search</button>
      </form>
    </div>
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
    padding: 0;
    line-height: 0;
  }
  .icon {
    display: block;
    flex-shrink: 0;
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
    display: grid;
    gap: 0.75rem;
    width: min(40rem, calc(100vw - 1.5rem));
    padding: 0.85rem;
    background: white;
    border-radius: 1.25rem;
    box-shadow: 0 12px 32px rgba(8, 24, 40, 0.16);
  }
  .pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .pills button {
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-pill);
    background: white;
    color: var(--brand-deep);
    padding: 0.35rem 0.7rem;
    font: inherit;
    font-size: 0.6875rem;
    font-weight: var(--font-weight-6);
    cursor: pointer;
  }
  .pills button:hover {
    border-color: var(--brand-teal);
    color: var(--brand-teal);
  }
  .pills button.active {
    background: var(--brand-teal);
    border-color: var(--brand-teal);
    color: white;
    font-weight: var(--font-weight-7);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }
  .field {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem 1rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-button);
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
    }
    .row {
      flex-direction: column;
      align-items: stretch;
    }
    .submit {
      width: 100%;
    }
  }
</style>
