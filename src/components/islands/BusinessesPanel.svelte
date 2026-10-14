<script lang="ts">
  import { openAuth } from "../../lib/auth-return";
  import {
    OWNERSHIP_EVENT,
    dashboardUnlocked,
    ownershipsForPerson,
    personSlugForPersona,
    seedOwnershipsFromCatalog,
    statusLabel,
    verifiedCount,
    type Ownership,
  } from "../../lib/ownership";
  import { PERSONA_EVENT, personaSignedIn, readPersona, type ProtoPersona } from "../../lib/proto-persona";

  let {
    seedBusinesses = [],
    townNames = {} as Record<string, string>,
    merchantsHref = "/merchants",
    addHref = "/add-business",
    dashboardRoot = "/dashboard",
    variant = "page",
  }: {
    seedBusinesses?: {
      slug: string;
      name: string;
      townSlug: string;
      summary: string;
      ownerUserSlug?: string;
      ownershipStatus?: "pending_approval" | "pending_verification" | "verified" | "rejected";
      entityKind?: "business" | "stay" | "town" | "area";
      isStay?: boolean;
    }[];
    townNames?: Record<string, string>;
    merchantsHref?: string;
    addHref?: string;
    dashboardRoot?: string;
    variant?: "page" | "card";
  } = $props();

  let persona = $state<ProtoPersona>("guest");
  let rows = $state<Ownership[]>([]);
  let redirected = $state(false);

  const isGuest = $derived(!personaSignedIn(persona));
  const verified = $derived(verifiedCount(rows));
  const showEmpty = $derived(rows.length === 0);

  function seed() {
    return seedOwnershipsFromCatalog(seedBusinesses, (slug) => townNames[slug] ?? slug);
  }

  function refresh() {
    persona = readPersona();
    rows = ownershipsForPerson(personSlugForPersona(persona), seed());
  }

  function hrefFor(row: Ownership) {
    if (!dashboardUnlocked(row)) return `${addHref}?tab=${row.kind === "stay" ? "stay" : "add"}`;
    return `${dashboardRoot}/${row.listingSlug}`;
  }

  function statusCopy(row: Ownership) {
    if (row.status === "pending_approval") {
      return row.kind === "stay"
        ? "New property submitted. In the Stays review queue — you’ll get an email when it’s approved."
        : "New listing submitted. In the review queue — you’ll get an email when it’s approved or if we need a change.";
    }
    if (row.status === "pending_verification") {
      return "Claim started. Dashboard unlocks when verification completes. Check your work email for the link.";
    }
    if (row.status === "rejected") {
      return row.rejectionReason ?? "Rejected in moderation. Edit and resubmit to try again.";
    }
    return row.summary;
  }

  function iconBg(row: Ownership) {
    if (row.status === "verified") return row.kind === "stay" ? "var(--brand-teal-soft)" : "#dcfce7";
    if (row.status === "pending_verification") return "var(--brand-sun-soft)";
    return "var(--brand-sand-dark)";
  }

  $effect(() => {
    refresh();
    if (
      !redirected &&
      variant === "page" &&
      verified === 1 &&
      rows.length === 1 &&
      rows[0]?.status === "verified"
    ) {
      redirected = true;
      window.location.replace(`${dashboardRoot}/${rows[0]!.listingSlug}`);
    }
    const onChange = () => refresh();
    window.addEventListener(PERSONA_EVENT, onChange);
    window.addEventListener(OWNERSHIP_EVENT, onChange);
    return () => {
      window.removeEventListener(PERSONA_EVENT, onChange);
      window.removeEventListener(OWNERSHIP_EVENT, onChange);
    };
  });
</script>

{#if variant === "page"}
  <section class="hub">
    {#if showEmpty}
      <div class="hero-grid">
        <div class="card empty">
          <p class="eyebrow">{persona === "town-manager" ? "For town managers" : "For business owners"}</p>
          <h1>{persona === "town-manager" ? "No town desk yet" : "No businesses yet"}</h1>
          <p class="lede">
            {#if persona === "town-manager"}
              Each town has a claimable desk listing (e.g. Rosemary Beach Town Merchants). Claim yours
              to manage town updates from the same account — no separate login.
            {:else}
              Add a free listing or claim one that’s already on WhereTo30A. It lives under this same
              account — no second signup, no separate login.
            {/if}
          </p>
          <div class="cta-row">
            {#if isGuest}
              <button
                class="btn btn--teal"
                type="button"
                onclick={() => openAuth({ mode: "signup", returnTo: addHref })}
              >
                Add a business →
              </button>
            {:else if persona === "town-manager"}
              <a class="btn btn--teal" href={`${addHref}?tab=claim`}>Claim a town desk →</a>
            {:else}
              <a class="btn btn--teal" href={addHref}>Add a business →</a>
            {/if}
            {#if persona !== "town-manager"}
              <a class="btn btn--ghost" href={`${addHref}?tab=stay`}>Add a stay / rental</a>
            {/if}
            <a class="btn btn--link" href={merchantsHref}>How it works</a>
          </div>
          <div class="mini-steps">
            <div class="step">
              <span class="step__n">1</span>
              <strong>Add or claim</strong>
              <p>Submit a new listing, or find yours in the directory and claim it.</p>
            </div>
            <div class="step">
              <span class="step__n">2</span>
              <strong>We review it</strong>
              <p>New listings are reviewed. Claims are verified so only the real owner gets access.</p>
            </div>
            <div class="step">
              <span class="step__n">3</span>
              <strong>It appears here</strong>
              <p>Once approved or verified, it shows under Your businesses with its dashboard.</p>
            </div>
          </div>
        </div>

        <aside class="side">
          <div class="card side-card">
            <p class="eyebrow">On your profile</p>
            <h3>Your businesses</h3>
            <p>Add a free listing or claim one that’s already on WhereTo30A.</p>
            <a class="btn btn--ghost btn--block" href={addHref}>Add a business</a>
          </div>
          <div class="card side-card">
            <h3>What you get, free</h3>
            <ul class="checks">
              <li>Your own page with photos, FAQ, hours and contact buttons</li>
              <li>Post updates — menu changes, hours, news — straight to your page</li>
              <li>Add events and get found in town &amp; category pages</li>
              <li>Reply in the community as the verified owner</li>
              <li>No ratings, ever. No stars working against you</li>
            </ul>
          </div>
        </aside>
      </div>
    {:else}
      <header class="hub__head">
        <p class="eyebrow">Your account</p>
        <h1>{verified > 1 ? "Your businesses" : "Your businesses"}</h1>
        <p class="lede">
          Everything attached to your account, and where each one stands. Pending items stay visible
          until approval or verification finishes.
        </p>
      </header>
      <div class="card list-card">
        {#each rows as row (row.id)}
          <div class="biz-row">
            <div class="biz-icon" style={`background:${iconBg(row)}`} aria-hidden="true">
              {row.kind === "stay" ? "⌂" : row.listingName.charAt(0)}
            </div>
            <div class="biz-main">
              <div class="biz-title">
                <strong>{row.listingName}</strong>
                <span
                  class="badge"
                  class:badge--ok={row.status === "verified"}
                  class:badge--pending={row.status === "pending_approval" || row.status === "pending_verification"}
                  class:badge--alert={row.status === "rejected"}
                >
                  {statusLabel(row.status)}
                </span>
              </div>
              <p>{statusCopy(row)}</p>
            </div>
            {#if dashboardUnlocked(row)}
              <a class="btn btn--teal btn--sm" href={hrefFor(row)}>
                {row.kind === "town"
                  ? "Open town desk →"
                  : row.kind === "area"
                    ? "Open area desk →"
                    : "Open dashboard →"}
              </a>
            {:else if row.status === "pending_verification"}
              <span class="btn btn--ghost btn--sm" aria-disabled="true">Dashboard locked</span>
            {:else if row.status === "rejected"}
              <a class="btn btn--ghost btn--sm" href={addHref}>Edit and resubmit</a>
            {:else}
              <span class="btn btn--ghost btn--sm" aria-disabled="true">In review</span>
            {/if}
          </div>
        {/each}
      </div>
      <div class="cta-row">
        <a class="btn btn--teal" href={addHref}>+ Add another business or stay</a>
        <a class="btn btn--link" href={merchantsHref}>How it works</a>
      </div>
    {/if}
  </section>
{:else}
  <section class="widget">
    <p class="widget__label">Your businesses</p>
    {#if showEmpty}
      <p class="widget__copy">Add a free listing or claim one that’s already on WhereTo30A.</p>
      <div class="card-actions">
        {#if isGuest}
          <button
            class="text-btn"
            type="button"
            onclick={() => openAuth({ mode: "signup", returnTo: addHref })}
          >
            Add a business
          </button>
        {:else}
          <a class="text-btn" href={addHref}>Add a business</a>
        {/if}
      </div>
    {:else}
      <ul class="mini-list">
        {#each rows as row (row.id)}
          <li>
            {#if dashboardUnlocked(row)}
              <a href={hrefFor(row)}>
                <span>{row.listingName}</span>
                <span class="muted">{statusLabel(row.status)}</span>
              </a>
            {:else}
              <div>
                <span class="mini-name">{row.listingName}</span>
                <span class="muted">{statusLabel(row.status)}</span>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
      <a class="widget__link" href={dashboardRoot}>Manage business →</a>
    {/if}
  </section>
{/if}

<style>
  .hero-grid {
    display: grid;
    gap: var(--size-5);
  }
  @media (min-width: 860px) {
    .hero-grid {
      grid-template-columns: 1.15fr 0.85fr;
    }
  }
  .card {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-4);
    box-shadow: var(--shadow-card);
  }
  .empty {
    padding: clamp(1.5rem, 3vw, 2rem);
  }
  .eyebrow {
    margin: 0 0 0.55rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--brand-teal);
  }
  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 2.6rem);
    font-weight: var(--font-weight-8);
    color: var(--brand-deep);
    letter-spacing: -0.03em;
    line-height: 1.05;
  }
  .lede {
    margin: 0.85rem 0 0;
    max-width: 34rem;
    font-size: var(--font-size-2);
    color: var(--brand-ink-soft);
    line-height: 1.55;
  }
  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-top: 1.35rem;
    align-items: center;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.75rem;
    padding: 0.65rem 1.2rem;
    border-radius: var(--radius-pill);
    border: 1px solid transparent;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    cursor: pointer;
    text-decoration: none;
  }
  .btn:hover {
    text-decoration: none;
  }
  .btn--teal {
    background: var(--brand-teal);
    color: white;
  }
  .btn--ghost {
    background: white;
    border-color: var(--brand-line);
    color: var(--brand-deep);
  }
  .btn--link {
    background: transparent;
    border: 0;
    color: var(--brand-teal);
    min-height: auto;
    padding: 0.65rem 0.35rem;
  }
  .btn--sm {
    min-height: 2.4rem;
    padding: 0.5rem 1rem;
    font-size: var(--font-size-0);
  }
  .btn--block {
    width: 100%;
  }
  .btn[aria-disabled="true"] {
    opacity: 0.65;
    cursor: default;
  }
  .mini-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-top: 1.75rem;
  }
  @media (max-width: 640px) {
    .mini-steps {
      grid-template-columns: 1fr;
    }
  }
  .step {
    padding: 0.9rem;
    background: var(--brand-sand);
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
  }
  .step__n {
    width: 1.75rem;
    height: 1.75rem;
    margin-bottom: 0.5rem;
    border-radius: 50%;
    background: var(--brand-deep);
    color: white;
    display: grid;
    place-items: center;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-8);
  }
  .step strong {
    display: block;
    font-size: var(--font-size-1);
    color: var(--brand-deep);
  }
  .step p {
    margin: 0.3rem 0 0;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
    line-height: 1.45;
  }
  .side {
    display: grid;
    gap: var(--size-4);
    align-content: start;
  }
  .side-card {
    padding: var(--size-5);
  }
  .side-card h3 {
    margin: 0 0 0.45rem;
    font-family: var(--font-display);
    font-size: var(--font-size-3);
    font-weight: var(--font-weight-8);
    color: var(--brand-deep);
  }
  .side-card > p {
    margin: 0 0 0.9rem;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.5;
  }
  .checks {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.65rem;
  }
  .checks li {
    display: flex;
    gap: 0.65rem;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.45;
  }
  .checks li::before {
    content: "✓";
    width: 1.35rem;
    height: 1.35rem;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--brand-teal-soft);
    color: var(--brand-teal);
    display: grid;
    place-items: center;
    font-size: 0.7rem;
    font-weight: var(--font-weight-8);
    margin-top: 0.1rem;
  }

  .hub__head {
    margin-bottom: var(--size-5);
    max-width: 40rem;
  }
  .list-card {
    overflow: hidden;
  }
  .biz-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem 1.2rem;
  }
  .biz-row + .biz-row {
    border-top: 1px solid var(--brand-line);
  }
  .biz-icon {
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-3);
    display: grid;
    place-items: center;
    font-family: var(--font-display);
    font-weight: var(--font-weight-8);
    color: var(--brand-deep);
    flex-shrink: 0;
  }
  .biz-main {
    flex: 1;
    min-width: 12rem;
  }
  .biz-title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.45rem;
  }
  .biz-title strong {
    font-size: var(--font-size-2);
    color: var(--brand-deep);
  }
  .biz-main p {
    margin: 0.3rem 0 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.45;
  }
  .badge {
    padding: 0.25rem 0.55rem;
    border-radius: var(--radius-pill);
    font-size: 0.625rem;
    font-weight: var(--font-weight-7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1px solid var(--brand-line);
  }
  .badge--pending {
    background: var(--brand-sun-soft);
    color: #78350f;
    border-color: #fde68a;
  }
  .badge--alert {
    background: #fee2e2;
    color: #991b1b;
  }
  .badge--ok {
    background: #dcfce7;
    color: #166534;
    border-color: #bbf7d0;
  }

  .widget {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    padding: var(--size-4);
    box-shadow: var(--shadow-card);
  }
  .widget__label {
    margin: 0 0 0.55rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .widget__copy {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.45;
  }
  .mini-list {
    list-style: none;
    margin: 0 0 0.85rem;
    padding: 0;
    display: grid;
    gap: 0.55rem;
  }
  .mini-list a,
  .mini-name {
    display: grid;
    gap: 0.1rem;
    text-decoration: none;
    color: var(--brand-deep);
    font-weight: var(--font-weight-6);
    font-size: var(--font-size-1);
  }
  .muted {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-4);
    color: var(--brand-ink-soft);
  }
  .widget__link,
  .text-btn {
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
    text-decoration: none;
    border: 0;
    background: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
  }
  .card-actions {
    margin-top: 0.85rem;
  }
</style>
