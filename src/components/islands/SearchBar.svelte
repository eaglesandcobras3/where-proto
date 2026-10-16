<script lang="ts">
  interface Named {
    slug: string;
    name: string;
  }

  type Entity = "businesses" | "stays" | "events" | "guides" | "ask";

  const entities: { slug: Entity; name: string; path: string; placeholder: string }[] = [
    {
      slug: "businesses",
      name: "Businesses",
      path: "/search",
      placeholder: "Search cafes, shops, dining…",
    },
    {
      slug: "stays",
      name: "Stays",
      path: "/stays",
      placeholder: "Search inns, cottages, rentals…",
    },
    {
      slug: "events",
      name: "Events",
      path: "/events",
      placeholder: "Search concerts, markets, gatherings…",
    },
    {
      slug: "guides",
      name: "Guides",
      path: "/guides",
      placeholder: "Search guides and itineraries…",
    },
    {
      slug: "ask",
      name: "Ask",
      path: "/ask",
      placeholder: "Ask the locals anything about 30A…",
    },
  ];

  let {
    towns = [],
    base = "/",
    variant = "popover",
  }: {
    towns?: Named[];
    base?: string;
    variant?: "inline" | "popover";
  } = $props();

  const drawerId = variant === "inline" ? "hero-search-drawer" : "nav-search-drawer";

  let entity = $state<Entity>("businesses");
  let town = $state("");
  let query = $state("");
  let open = $state(false);
  let isMobile = $state(false);
  let root = $state<HTMLElement>();
  let drawer = $state<HTMLDialogElement>();
  let input = $state<HTMLElement>();
  let drawerEntity = $state<HTMLSelectElement>();

  let current = $derived(entities.find((item) => item.slug === entity) ?? entities[0]);
  let asking = $derived(entity === "ask");

  function path(route: string) {
    const rootPath = base.endsWith("/") ? base.slice(0, -1) : base;
    return route === "/" ? `${rootPath}/` : `${rootPath}${route}`;
  }

  function focusField(node?: HTMLElement) {
    queueMicrotask(() => node?.focus());
  }

  function openDrawer() {
    drawer?.showModal();
    focusField(drawerEntity);
  }

  function closeDrawer() {
    if (drawer?.open) drawer.close();
  }

  function setOpen(next: boolean) {
    open = next;
    if (next) focusField(input);
  }

  function openSearch() {
    if (isMobile) {
      openDrawer();
      return;
    }
    if (variant === "popover") setOpen(!open);
  }

  function submit(event: Event) {
    event.preventDefault();
    const target = entities.find((item) => item.slug === entity) ?? entities[0];
    const params = new URLSearchParams();
    const text = query.trim();
    if (entity === "ask" && !text) return;
    if (text) params.set(entity === "ask" ? "post" : "q", text);
    if (town) params.set("town", town);
    const qs = params.toString();
    window.location.assign(`${path(target.path)}${qs ? `?${qs}` : ""}`);
  }

  $effect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const sync = () => {
      isMobile = mq.matches;
      if (mq.matches) setOpen(false);
      else closeDrawer();
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  });

  $effect(() => {
    if (variant === "inline" || !open || isMobile) return;
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

{#snippet searchIconMarkup()}
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
{/snippet}

{#snippet desktopBar()}
  <form class="bar" class:bar--ask={asking} role={asking ? "form" : "search"} onsubmit={submit}>
    <label class="entity">
      <span class="visually-hidden">{asking ? "What to post" : "What to search"}</span>
      <select bind:value={entity} aria-label={asking ? "What to post" : "What to search"}>
        {#each entities as item (item.slug)}
          <option value={item.slug}>{item.name}</option>
        {/each}
      </select>
    </label>

    {#if asking}
      <div class="composer">
        <span class="avatar" aria-hidden="true">You</span>
        <label class="field">
          <span class="visually-hidden">Your question</span>
          <textarea
            bind:this={input}
            name="post"
            rows="2"
            placeholder={current.placeholder}
            bind:value={query}
          ></textarea>
        </label>
      </div>
    {/if}

    <label class="town">
      <span class="visually-hidden">Town</span>
      <select bind:value={town} aria-label="Town">
        <option value="">All Towns</option>
        {#each towns as item (item.slug)}
          <option value={item.slug}>{item.name}</option>
        {/each}
      </select>
    </label>

    {#if asking}
      <button class="submit" type="submit">Ask</button>
    {:else}
      <div class="query">
        <label class="field">
          <span class="visually-hidden">Search query</span>
          <input
            bind:this={input}
            type="search"
            name="q"
            placeholder={current.placeholder}
            autocomplete="off"
            bind:value={query}
          />
        </label>

        <button class="submit" type="submit">
          {@render searchIconMarkup()}
          <span class="submit__label">Search</span>
        </button>
      </div>
    {/if}
  </form>
{/snippet}

<div class="search" class:inline={variant === "inline"} class:open bind:this={root}>
  {#if variant === "inline"}
    <button class="mobile-launch" type="button" aria-haspopup="dialog" aria-controls={drawerId} onclick={openSearch}>
      {@render searchIconMarkup()}
      <span>Search</span>
    </button>

    <div class="desktop-inline">
      {@render desktopBar()}
    </div>
  {:else}
    <button
      class="trigger"
      type="button"
      aria-label="Search"
      aria-expanded={isMobile ? Boolean(drawer?.open) : open}
      aria-haspopup={isMobile ? "dialog" : "true"}
      aria-controls={isMobile ? drawerId : "site-search-popover"}
      onclick={openSearch}
    >
      {@render searchIconMarkup()}
    </button>

    {#if open && !isMobile}
      <div class="sheet card" id="site-search-popover">
        {@render desktopBar()}
      </div>
    {/if}
  {/if}

  <dialog
    class="drawer"
    id={drawerId}
    bind:this={drawer}
    aria-label={asking ? "Ask 30A" : "Search 30A"}
    onclick={(event) => {
      if (event.target === drawer) closeDrawer();
    }}
  >
    <div class="drawer__panel">
      <div class="drawer__head">
        <p class="drawer__title">{asking ? "Ask" : "Search"}</p>
        <button class="drawer__close" type="button" onclick={closeDrawer}>Close</button>
      </div>
      <form class="drawer__form" role={asking ? "form" : "search"} onsubmit={submit}>
        <label class="drawer__field">
          <span>{asking ? "Posting" : "Looking for"}</span>
          <select bind:this={drawerEntity} bind:value={entity} aria-label={asking ? "What to post" : "What to search"}>
            {#each entities as item (item.slug)}
              <option value={item.slug}>{item.name}</option>
            {/each}
          </select>
        </label>
        <label class="drawer__field">
          <span>Town</span>
          <select bind:value={town} aria-label="Town">
            <option value="">All Towns</option>
            {#each towns as item (item.slug)}
              <option value={item.slug}>{item.name}</option>
            {/each}
          </select>
        </label>
        <label class="drawer__field">
          <span>{asking ? "Your question" : "Search"}</span>
          {#if asking}
            <textarea
              name="post"
              rows="3"
              placeholder={current.placeholder}
              bind:value={query}
            ></textarea>
          {:else}
            <input
              type="search"
              name="q"
              placeholder={current.placeholder}
              autocomplete="off"
              bind:value={query}
            />
          {/if}
        </label>
        <button class="drawer__submit" type="submit">
          {#if !asking}
            {@render searchIconMarkup()}
          {/if}
          {asking ? "Ask" : "Search"}
        </button>
      </form>
    </div>
  </dialog>
</div>

<style>
  .search {
    position: relative;
    flex-shrink: 0;
  }
  .search.inline {
    position: static;
    width: 100%;
    max-width: 52rem;
  }
  .mobile-launch {
    display: none;
    width: auto;
    min-height: 2.85rem;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0 1.25rem;
    border: 0;
    border-radius: 999px;
    background: var(--brand-teal);
    color: white;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    box-shadow: var(--shadow-card);
    cursor: pointer;
  }
  .mobile-launch:hover {
    background: #00796b;
  }
  .mobile-launch .icon {
    color: white;
  }
  .desktop-inline {
    display: block;
    width: 100%;
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
  .bar {
    display: flex;
    align-items: stretch;
    height: 3.5rem;
    min-width: 0;
    background: white;
    border: 1px solid #cbd5e1;
    border-radius: var(--radius-4);
    overflow: hidden;
    box-shadow: var(--shadow-card-hover);
  }
  .bar.bar--ask {
    display: grid;
    height: auto;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "composer composer composer"
      "entity town action";
    gap: 0.75rem;
    align-items: center;
    padding: 0.9rem 0.9rem 0.8rem;
  }
  .bar:focus-within {
    border-color: var(--brand-teal);
    box-shadow: 0 0 0 3px rgba(0, 137, 123, 0.18);
  }
  .sheet.card {
    position: absolute;
    top: calc(100% + 0.65rem);
    right: 0;
    z-index: 60;
    width: min(46rem, calc(100vw - 1.5rem));
    padding: 0.75rem;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: 1.15rem;
    box-shadow: 0 16px 40px rgba(8, 24, 40, 0.16);
  }
  .sheet.card .bar {
    width: 100%;
    box-shadow: none;
  }
  .bar > label.entity,
  .bar > label.town,
  .query,
  .query > label.field,
  .query > button.submit {
    display: flex;
    align-items: center;
    align-self: stretch;
    min-width: 0;
    margin: 0;
  }
  .query {
    flex: 1 1 auto;
    min-width: 0;
    border-left: 1px solid var(--brand-line);
  }
  .bar > label.entity {
    flex: 0 0 auto;
    width: auto;
    background: var(--brand-deep);
    color: white;
    padding: 0 0.7rem 0 0.85rem;
  }
  .bar > label.entity:hover,
  .bar > label.entity:focus-within {
    background: #163545;
  }
  .bar input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="file"]),
  .bar select {
    height: 100%;
    margin: 0;
    border: 0;
    border-radius: 0;
    outline: none;
    box-shadow: none;
    background-color: transparent;
    font: inherit;
    font-size: var(--font-size-1);
    line-height: 1.2;
  }
  .bar input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="file"]):focus,
  .bar select:focus {
    border: 0;
    outline: none;
    box-shadow: none;
  }
  .bar select {
    font-weight: var(--font-weight-7);
    cursor: pointer;
    --select-chevron-inset: 0.1rem;
    --select-padding-end: 1.35rem;
  }
  .bar > label.entity {
    --select-chevron: var(--select-chevron-on-dark);
  }
  .bar > label.entity select {
    width: 7.5rem;
    padding: 0 1.35rem 0 0;
    color: white;
    color-scheme: light;
    --select-chevron: var(--select-chevron-on-dark);
  }
  .bar select option {
    color: var(--brand-ink);
    background: white;
  }
  .query > label.field {
    flex: 1 1 auto;
    width: auto;
    padding: 0 0.95rem;
  }
  .bar input {
    width: 100%;
    min-width: 0;
    color: var(--brand-ink);
  }
  .bar input::placeholder {
    color: var(--brand-ink-soft);
  }
  .bar > label.town {
    flex: 0 0 12.25rem;
    width: 12.25rem;
    border-left: 1px solid var(--brand-line);
    padding: 0 0.7rem 0 0.85rem;
  }
  .composer {
    grid-area: composer;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    min-width: 0;
  }
  .composer .field {
    flex: 1 1 auto;
    min-width: 0;
  }
  .avatar {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: var(--brand-teal-soft);
    color: var(--brand-deep);
    display: grid;
    place-items: center;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    flex-shrink: 0;
  }
  .bar.bar--ask > label.entity {
    grid-area: entity;
    height: 2.5rem;
    border-radius: 0.55rem;
  }
  .bar.bar--ask > label.town {
    grid-area: town;
    width: auto;
    max-width: 16rem;
    height: 2.5rem;
    border: 1px solid var(--brand-line);
    border-radius: 0.55rem;
    background: var(--brand-sand);
  }
  .bar.bar--ask > button.submit {
    grid-area: action;
    height: 2.5rem;
    border: 0;
    border-radius: 0.55rem;
    background: var(--brand-teal);
    color: white;
    padding: 0 1.15rem;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  .bar.bar--ask > button.submit:hover {
    background: #00796b;
  }
  .bar textarea {
    width: 100%;
    min-height: 3.25rem;
    margin: 0;
    padding: 0.15rem 0 0;
    border: 0;
    border-radius: 0;
    outline: none;
    box-shadow: none;
    resize: none;
    background: transparent;
    color: var(--brand-ink);
    font: inherit;
    font-size: var(--font-size-1);
    line-height: 1.45;
  }
  .bar textarea:focus {
    border: 0;
    outline: none;
    box-shadow: none;
  }
  .bar textarea::placeholder {
    color: var(--brand-ink-soft);
  }
  .bar > label.town select {
    width: 100%;
    padding: 0 1.25rem 0 0;
    color: var(--brand-deep);
    --select-padding-end: 1.25rem;
  }
  .query > button.submit {
    flex: 0 0 auto;
    justify-content: center;
    gap: 0.45rem;
    height: 100%;
    border: 0;
    border-radius: 0;
    background: var(--brand-teal);
    color: white;
    padding: 0 1.15rem;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    line-height: 1;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: none;
  }
  .query > button.submit:hover {
    background: #00796b;
  }
  .drawer {
    width: 100%;
    max-width: none;
    height: auto;
    max-height: none;
    margin: 0;
    margin-top: auto;
    padding: 0;
    border: 0;
    background: transparent;
  }
  .drawer[open] {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .drawer::backdrop {
    background: rgb(12 35 46 / 0.45);
  }
  .drawer__panel {
    width: 100%;
    max-height: min(85vh, 40rem);
    overflow: auto;
    background: white;
    border-radius: 1.25rem 1.25rem 0 0;
    box-shadow: 0 -12px 40px rgba(8, 24, 40, 0.18);
    padding: 1rem 1rem 1.25rem;
  }
  .drawer__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .drawer__title {
    margin: 0;
    font-size: var(--font-size-3);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
  }
  .drawer__close {
    min-height: 2.5rem;
    padding: 0.45rem 0.85rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-pill);
    background: var(--brand-sand);
    color: var(--brand-deep);
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  .drawer__form {
    display: grid;
    gap: 0.85rem;
  }
  .drawer__field {
    display: grid;
    gap: 0.35rem;
    margin: 0;
  }
  .drawer__field > span {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    color: var(--brand-ink-soft);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .drawer__field select,
  .drawer__field input,
  .drawer__field textarea {
    width: 100%;
    min-height: 3rem;
    margin: 0;
    padding: 0.7rem 0.9rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    background-color: var(--brand-sand);
    color: var(--brand-ink);
    font: inherit;
    font-size: max(16px, 1rem);
  }
  .drawer__field select {
    font-weight: var(--font-weight-6);
    background-color: var(--brand-sand);
    --select-chevron-inset: 0.9rem;
    --select-padding-end: 2.4rem;
  }
  .drawer__field textarea {
    min-height: 6.5rem;
    padding: 0.75rem 0.9rem;
    resize: vertical;
    line-height: 1.45;
  }
  .drawer__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 3.1rem;
    margin-top: 0.25rem;
    border: 0;
    border-radius: var(--radius-pill);
    background: var(--brand-teal);
    color: white;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  .drawer__submit:hover {
    background: #00796b;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
  @media (max-width: 720px) {
    .search.inline {
      width: auto;
      display: flex;
      justify-content: center;
    }
    .mobile-launch {
      display: inline-flex;
    }
    .desktop-inline {
      display: none;
    }
  }
  @media (min-width: 721px) {
    .drawer {
      display: none !important;
    }
  }
</style>
