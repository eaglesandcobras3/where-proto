<script lang="ts">
  interface Biz {
    slug: string;
    name: string;
    town: string;
  }

  let { businesses = [], base = "/" }: { businesses: Biz[]; base?: string } = $props();

  let query = $state("");
  let open = $state(false);

  function path(route: string) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base;
    return route === "/" ? `${root}/` : `${root}${route}`;
  }

  let results = $derived(
    query.trim().length < 2
      ? []
      : businesses
          .filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()))
          .slice(0, 5),
  );

  function onBlur() {
    setTimeout(() => (open = false), 150);
  }
</script>

<div class="search-wrap">
  <input
    type="search"
    placeholder="Search businesses"
    aria-label="Search businesses"
    bind:value={query}
    onfocus={() => (open = true)}
    onblur={onBlur}
  />
  {#if open && results.length > 0}
    <ul class="dropdown" role="listbox">
      {#each results as result}
        <li>
          <a href={path(`/business/${result.slug}`)}>{result.name}</a>
        </li>
      {/each}
      <li class="see-all">
        <a href={path(`/search?q=${encodeURIComponent(query.trim())}`)}>See all results</a>
      </li>
    </ul>
  {/if}
</div>

<style>
  .search-wrap {
    position: relative;
  }
  input {
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-4);
    padding: var(--size-2) var(--size-3);
    font-size: var(--font-size-1);
    width: 160px;
    background: white;
    font-family: inherit;
  }
  input:focus {
    outline: 2px solid var(--brand-teal);
    outline-offset: 1px;
  }
  .dropdown {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    width: 280px;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    list-style: none;
    margin: 0;
    padding: var(--size-2);
    z-index: 60;
  }
  .dropdown a {
    display: block;
    padding: var(--size-2) var(--size-3);
    border-radius: var(--radius-2);
    color: var(--brand-ink);
    font-size: var(--font-size-1);
  }
  .dropdown a:hover {
    background: var(--brand-teal-soft);
    text-decoration: none;
  }
  .see-all {
    border-top: 1px solid var(--brand-line);
    margin-top: var(--size-1);
    padding-top: var(--size-1);
  }
  .see-all a {
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
  }
  @media (min-width: 960px) {
    input {
      width: 200px;
    }
  }
</style>
