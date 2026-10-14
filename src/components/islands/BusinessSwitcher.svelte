<script lang="ts">
  interface Biz {
    slug: string;
    name: string;
    status?: "live" | "in_review" | "needs_attention";
  }

  let {
    businesses = [],
    selectedSlug = "",
    live = true,
    statusLabel = "",
    base = "/",
  }: {
    businesses: Biz[];
    selectedSlug: string;
    live?: boolean;
    statusLabel?: string;
    base?: string;
  } = $props();

  const statusCopy = $derived(
    statusLabel || (live ? "Live" : "In review"),
  );

  let open = $state(false);
  let root = $state<HTMLElement>();

  const selected = $derived(businesses.find((item) => item.slug === selectedSlug) ?? businesses[0]);
  const initials = $derived(
    (selected?.name ?? "B")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase(),
  );

  function path(route: string) {
    const rootPath = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${rootPath}${route}`;
  }

  function go(slug: string) {
    open = false;
    window.location.href = path(`/dashboard/${slug}`);
  }

  function addBusiness() {
    open = false;
    window.location.href = path("/add-business");
  }

  $effect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && root?.contains(event.target)) return;
      open = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") open = false;
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  });
</script>

<div class="switcher" bind:this={root}>
  <button class="trigger" type="button" aria-expanded={open} onclick={() => (open = !open)}>
    <span class="avatar" aria-hidden="true">{initials}</span>
    <span class="copy">
      <span class="name">
        {selected?.name ?? "Select business"}
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M8 9.5 12 14l4-4.5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </span>
      <span class="status">
        <span class:list={["dot", live && "dot--live"]}></span>
        {statusCopy}
      </span>
    </span>
  </button>

  {#if open}
    <div class="menu" role="listbox" aria-label="Your businesses">
      <div class="menu__list">
        {#each businesses as item (item.slug)}
          <button
            class:active={item.slug === selectedSlug}
            type="button"
            role="option"
            aria-selected={item.slug === selectedSlug}
            onclick={() => go(item.slug)}
          >
            {item.name}
          </button>
        {/each}
      </div>
      <div class="menu__rule" aria-hidden="true"></div>
      <button class="add" type="button" onclick={addBusiness}>+ Add another business</button>
    </div>
  {/if}
</div>

<style>
  .switcher {
    position: relative;
  }
  .trigger {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.35rem 0.65rem;
    border: 0;
    border-radius: var(--radius-3);
    background: var(--brand-sand-dark);
    cursor: pointer;
    text-align: left;
    font: inherit;
  }
  .trigger:hover {
    background: var(--brand-sand);
  }
  .avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.5rem;
    display: grid;
    place-items: center;
    background: var(--brand-deep);
    color: white;
    font-size: 0.6875rem;
    font-weight: var(--font-weight-8);
    flex-shrink: 0;
  }
  .copy {
    display: grid;
    gap: 0.1rem;
    min-width: 0;
  }
  .name {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
  }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.625rem;
    font-weight: var(--font-weight-6);
    color: var(--brand-teal);
  }
  .dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: var(--brand-ink-on-navy);
  }
  .dot--live {
    background: var(--brand-teal);
  }
  .menu {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    z-index: 40;
    box-sizing: border-box;
    width: max-content;
    min-width: 16rem;
    max-width: min(22rem, calc(100vw - 2rem));
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0.35rem;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card-hover);
  }
  .menu__list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.15rem;
  }
  .menu button {
    display: block;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    border: 0;
    background: transparent;
    text-align: left;
    padding: 0.55rem 0.7rem;
    border-radius: var(--radius-2);
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-5);
    color: var(--brand-ink);
    cursor: pointer;
    white-space: nowrap;
  }
  .menu button:hover {
    background: var(--brand-sand-dark);
  }
  .menu button.active {
    background: var(--brand-teal-soft);
    color: var(--brand-deep);
    font-weight: var(--font-weight-7);
  }
  .menu__rule {
    height: 1px;
    margin: 0.35rem 0.35rem 0.15rem;
    background: var(--brand-line);
  }
  .menu .add {
    color: var(--brand-teal);
    font-weight: var(--font-weight-7);
  }
  .menu .add:hover {
    background: var(--brand-sand-dark);
  }
</style>
