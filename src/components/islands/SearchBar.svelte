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
      placeholder: "Ask about carts, parking, dining…",
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

  let entity = $state<Entity>("businesses");
  let town = $state("");
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
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (town) params.set("town", town);
    const qs = params.toString();
    window.location.assign(`${path(target.path)}${qs ? `?${qs}` : ""}`);
  }

  $effect(() => {
    if (variant === "inline" || !open) return;
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

<div class="search" class:inline={variant === "inline"} class:open bind:this={root}>
  {#if variant !== "inline"}
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
  {/if}

  {#if variant === "inline" || open}
    <div class="sheet" class:card={variant !== "inline"} id={variant === "inline" ? undefined : "site-search-popover"}>
    <form class="bar" role="search" onsubmit={submit}>
      <label class="entity">
        <span class="visually-hidden">What to search</span>
        <select bind:value={entity} aria-label="What to search">
          {#each entities as item (item.slug)}
            <option value={item.slug}>{item.name}</option>
          {/each}
        </select>
      </label>

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

      <label class="town">
        <span class="visually-hidden">Town</span>
        <select bind:value={town} aria-label="Town">
          <option value="">All Towns</option>
          {#each towns as item (item.slug)}
            <option value={item.slug}>{item.name}</option>
          {/each}
        </select>
      </label>

      <button class="submit" type="submit">
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
        Search
      </button>
    </form>
    </div>
  {/if}
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
  .bar > label.field,
  .bar > label.town,
  .bar > button.submit {
    display: flex;
    align-items: center;
    align-self: stretch;
    min-width: 0;
    margin: 0;
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
    appearance: none;
    font-weight: var(--font-weight-7);
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: right 0.1rem center;
    background-size: 0.7rem;
  }
  .bar > label.entity select {
    width: 7.5rem;
    padding: 0 1.35rem 0 0;
    color: white;
    color-scheme: light;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='white' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }
  .bar select option {
    color: var(--brand-ink);
    background: white;
  }
  .bar > label.field {
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
  .bar > label.town select {
    width: 100%;
    padding: 0 1.25rem 0 0;
    color: var(--brand-deep);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%230c232e' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }
  .bar > button.submit {
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
  .bar > button.submit:hover {
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
    .bar {
      flex-direction: column;
      height: auto;
    }
    .sheet.card {
      position: fixed;
      top: calc(var(--header-h) + 0.5rem);
      left: 0.75rem;
      right: 0.75rem;
      width: auto;
    }
    .bar > label.entity,
    .bar > label.field,
    .bar > label.town,
    .bar > button.submit {
      flex: 1 1 auto;
      width: 100%;
      height: 3rem;
      min-height: 3rem;
    }
    .bar > label.entity {
      width: 100%;
    }
    .bar > label.entity select,
    .bar > label.town select {
      width: 100%;
    }
    .bar > label.field,
    .bar > label.town {
      border-left: 0;
      border-top: 1px solid var(--brand-line);
    }
  }
</style>
