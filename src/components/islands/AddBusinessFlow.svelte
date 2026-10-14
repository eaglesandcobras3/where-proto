<script lang="ts">
  import { openAuth } from "../../lib/auth-return";
  import {
    OWNERSHIP_EVENT,
    listingHasVerifiedOwner,
    personSlugForPersona,
    seedOwnershipsFromCatalog,
    startClaim,
    submitNewListing,
    type Ownership,
  } from "../../lib/ownership";
  import { PERSONA_EVENT, personaSignedIn, readPersona } from "../../lib/proto-persona";

  type Named = { slug: string; name: string };
  type Listing = {
    slug: string;
    name: string;
    townSlug: string;
    summary: string;
    categoryName?: string;
    ownerUserSlug?: string;
    entityKind?: "business" | "stay" | "town" | "area";
  };

  let {
    towns = [],
    categories = [],
    listings = [],
    seedBusinesses = [],
    dashboardHref = "/dashboard",
    merchantsHref = "/merchants",
  }: {
    towns?: Named[];
    categories?: Named[];
    listings?: Listing[];
    seedBusinesses?: {
      slug: string;
      name: string;
      townSlug: string;
      summary: string;
      ownerUserSlug?: string;
      entityKind?: "business" | "stay" | "town" | "area";
      isStay?: boolean;
    }[];
    dashboardHref?: string;
    merchantsHref?: string;
  } = $props();

  type Tab = "add" | "claim" | "stay";

  let signedIn = $state(false);
  let tab = $state<Tab>("add");
  let success = $state<Ownership | null>(null);
  let claimError = $state("");
  let claimSelected = $state<Listing | null>(null);
  let verifyMethod = $state<"email" | "phone" | "manual">("email");

  let name = $state("");
  let description = $state("");
  let town = $state("");
  let category = $state("");
  let address = $state("");
  let phone = $state("");
  let website = $state("");
  let instagram = $state("");
  let hours = $state("");
  let tags = $state("");
  let workEmail = $state("");
  let query = $state("");

  let stayName = $state("");
  let stayTown = $state("");
  let stayType = $state("Beach house");
  let stayRole = $state("Owner");
  let bedrooms = $state("4");
  let bathrooms = $state("3");
  let sleeps = $state("10");
  let stayAddress = $state("");
  let stayDescription = $state("");
  let stayLink = $state("");
  let amenities = $state<string[]>(["Private pool", "Beach access", "Golf cart", "Full kitchen"]);

  const amenityOptions = [
    "Private pool",
    "Beach access",
    "Gulf view",
    "Golf cart",
    "Dog friendly",
    "Hot tub",
    "Full kitchen",
    "Bunk room",
    "EV charger",
  ];

  const seed = $derived(
    seedOwnershipsFromCatalog(seedBusinesses, (slug) => towns.find((t) => t.slug === slug)?.name ?? slug),
  );
  const townName = $derived((slug: string) => towns.find((t) => t.slug === slug)?.name ?? slug);
  const categoryName = $derived(
    (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug,
  );

  const filtered = $derived(
    listings.filter((item) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        townName(item.townSlug).toLowerCase().includes(q)
      );
    }),
  );

  const previewName = $derived(name.trim() || "Your business name");
  const previewTown = $derived(town ? townName(town) : "Town");
  const previewCat = $derived(category ? categoryName(category) : "Category");
  const previewDesc = $derived(
    description.trim()
      ? description.trim().slice(0, 90) + (description.trim().length > 90 ? "…" : "")
      : "Your short description will show here.",
  );

  function syncTabFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("tab");
    if (next === "claim" || next === "add" || next === "stay") tab = next;
  }

  function setTab(next: Tab) {
    tab = next;
    success = null;
    claimError = "";
    claimSelected = null;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }

  function ensureAuth(): boolean {
    if (personaSignedIn(readPersona())) return true;
    openAuth({ mode: "signup", returnTo: `${window.location.pathname}?tab=${tab}` });
    return false;
  }

  function returnPath() {
    return typeof window !== "undefined"
      ? `${window.location.pathname}?tab=${tab}`
      : "/add-business";
  }

  function onAddSubmit(event: Event) {
    event.preventDefault();
    if (!ensureAuth()) return;
    const person = personSlugForPersona(readPersona());
    if (!person) return;
    success = submitNewListing(
      person,
      {
        listingName: name,
        town: townName(town) || town,
        summary: description,
        kind: "business",
      },
      seed,
    );
    window.dispatchEvent(new CustomEvent(OWNERSHIP_EVENT));
  }

  function onStaySubmit(event: Event) {
    event.preventDefault();
    if (!ensureAuth()) return;
    const person = personSlugForPersona(readPersona());
    if (!person) return;
    success = submitNewListing(
      person,
      {
        listingName: stayName,
        town: townName(stayTown) || stayTown,
        summary: stayDescription || `${stayType} · Sleeps ${sleeps}`,
        kind: "stay",
      },
      seed,
    );
    window.dispatchEvent(new CustomEvent(OWNERSHIP_EVENT));
  }

  function pickClaim(listing: Listing) {
    claimError = "";
    if (!ensureAuth()) return;
    if (listingHasVerifiedOwner(listing.slug, seed, personSlugForPersona(readPersona()) ?? undefined)) {
      claimError =
        "This listing already has a verified owner. Contact support if you need a transfer.";
      claimSelected = null;
      return;
    }
    claimSelected = listing;
  }

  function confirmClaim() {
    if (!claimSelected) return;
    const person = personSlugForPersona(readPersona());
    if (!person) return;
    const result = startClaim(
      person,
      {
        slug: claimSelected.slug,
        name: claimSelected.name,
        town: townName(claimSelected.townSlug),
        summary: claimSelected.summary,
      },
      seed,
    );
    if (!result.ok) {
      claimError =
        result.reason === "already_owned"
          ? "This listing already has a verified owner. Contact support if you need a transfer."
          : "You already have a claim in progress for this listing.";
      return;
    }
    success = result.row;
    void verifyMethod;
  }

  function toggleAmenity(item: string) {
    amenities = amenities.includes(item)
      ? amenities.filter((a) => a !== item)
      : [...amenities, item];
  }

  function initial(nameValue: string) {
    return nameValue.trim().charAt(0).toUpperCase() || "?";
  }

  function thumbColor(slug: string) {
    const colors = ["var(--brand-deep)", "var(--brand-teal)", "var(--brand-teal)", "var(--brand-coral)", "var(--brand-coral)"];
    let hash = 0;
    for (let i = 0; i < slug.length; i++) hash = (hash + slug.charCodeAt(i) * (i + 1)) % colors.length;
    return colors[hash] ?? "var(--brand-deep)";
  }

  $effect(() => {
    const sync = () => {
      signedIn = personaSignedIn(readPersona());
      syncTabFromUrl();
    };
    sync();
    window.addEventListener(PERSONA_EVENT, sync);
    return () => window.removeEventListener(PERSONA_EVENT, sync);
  });
</script>

{#if !signedIn}
  <div class="gate card">
    <p class="eyebrow">Your account</p>
    <h2>Sign in to add or claim</h2>
    <p>
      You’ll use the same WhereTo30A account. Adding or claiming attaches a listing — there’s no
      second signup.
    </p>
    <div class="cta-row">
      <button
        class="btn btn--teal"
        type="button"
        onclick={() => openAuth({ mode: "signup", returnTo: returnPath() })}
      >
        Create account
      </button>
      <button
        class="btn btn--ghost"
        type="button"
        onclick={() => openAuth({ mode: "login", returnTo: returnPath() })}
      >
        Sign in
      </button>
    </div>
  </div>
{:else if success}
  <div class="success card">
    <div class="success__icon" aria-hidden="true">✓</div>
    <h2>
      {#if success.kind === "stay"}
        Property submitted
      {:else if success.status === "pending_verification"}
        Claim started
      {:else}
        Submitted
      {/if}
    </h2>
    <p>
      {#if success.kind === "stay"}
        It’s in the Stays review queue. Once approved it appears under <strong>Your businesses</strong>
        alongside any businesses you manage.
      {:else if success.status === "pending_verification"}
        Check your inbox for the verification step. This listing is under
        <strong>Your businesses</strong> as Verification pending — the dashboard stays locked until
        it completes.
      {:else}
        We’ll review it and it will appear under <strong>Your businesses</strong> once approved.
        You’ll get an email at each step.
      {/if}
    </p>
    <p class="success__meta"><strong>{success.listingName}</strong> · {success.town}</p>
    <div class="cta-row cta-row--center">
      <a class="btn btn--teal" href={dashboardHref}>See Your businesses</a>
      <button class="btn btn--ghost" type="button" onclick={() => (success = null)}>Add another</button>
    </div>
  </div>
{:else}
  <div class="tabs" role="tablist" aria-label="Add or claim">
    <button type="button" role="tab" class:active={tab === "add"} aria-selected={tab === "add"} onclick={() => setTab("add")}>
      Add a new business
    </button>
    <button type="button" role="tab" class:active={tab === "claim"} aria-selected={tab === "claim"} onclick={() => setTab("claim")}>
      Claim an existing listing
    </button>
    <button type="button" role="tab" class:active={tab === "stay"} aria-selected={tab === "stay"} onclick={() => setTab("stay")}>
      Add a stay / STR
    </button>
  </div>

  {#if tab === "add"}
    <div class="form-grid">
      <form class="card form-card" onsubmit={onAddSubmit}>
        <h2>New business listing</h2>
        <p class="form-lede">
          Goes into review as a draft. Nothing goes live until it’s approved — then it appears under
          Your businesses.
        </p>

        <p class="section-label">The basics</p>
        <label class="field">
          <span>Business name *</span>
          <input type="text" required bind:value={name} placeholder="e.g. The Perfect Pig" />
        </label>
        <div class="field-row">
          <label class="field">
            <span>Category *</span>
            <select required bind:value={category}>
              <option value="">Choose a category</option>
              {#each categories as item (item.slug)}
                <option value={item.slug}>{item.name}</option>
              {/each}
            </select>
          </label>
          <label class="field">
            <span>Town *</span>
            <select required bind:value={town}>
              <option value="">Choose a town</option>
              {#each towns as item (item.slug)}
                <option value={item.slug}>{item.name}</option>
              {/each}
            </select>
          </label>
        </div>
        <label class="field">
          <span>Short description * <em>— 1–2 sentences, in your words</em></span>
          <textarea required rows="3" bind:value={description} placeholder="What you offer and where to find you."
          ></textarea>
          <span class="hint">This is what shows in search and town pages. Skip the sales talk.</span>
        </label>

        <p class="section-label">Location &amp; contact</p>
        <label class="field">
          <span>Street address</span>
          <input type="text" bind:value={address} placeholder="1234 W County Hwy 30A" />
        </label>
        <div class="field-row field-row--3">
          <label class="field">
            <span>Phone</span>
            <input type="tel" bind:value={phone} placeholder="(850) 555-0100" />
          </label>
          <label class="field">
            <span>Website</span>
            <input type="url" bind:value={website} placeholder="https://…" />
          </label>
          <label class="field">
            <span>Instagram</span>
            <input type="text" bind:value={instagram} placeholder="@handle" />
          </label>
        </div>
        <div class="field-row">
          <label class="field">
            <span>Hours</span>
            <input type="text" bind:value={hours} placeholder="e.g. Tue–Sat 11am–9pm" />
          </label>
          <label class="field">
            <span>Price / vibe tags</span>
            <input type="text" bind:value={tags} placeholder="affordable, dog-friendly" />
          </label>
        </div>

        <p class="section-label">Photos</p>
        <div class="upload">
          <strong>Add up to 10 photos</strong>
          <p>Storefront, food, interior, the view — real photos beat stock every time.</p>
          <button class="btn btn--ghost btn--sm" type="button">Choose photos</button>
        </div>

        <p class="section-label">Confirm it’s yours</p>
        <label class="field">
          <span>Your work email <em>— for review updates, not shown publicly</em></span>
          <input type="email" bind:value={workEmail} placeholder="you@yourbusiness.com" />
        </label>
        <p class="hint">
          By submitting you’re confirming you own or manage this business. We’ll email you when it’s
          approved. <a href={merchantsHref}>How it works</a>
        </p>
        <button class="btn btn--teal btn--block" type="submit">Submit for review</button>
      </form>

      <aside class="aside">
        <div class="card aside-card">
          <h3>How it will look</h3>
          <p>Live preview from what you typed:</p>
          <div class="preview">
            <div class="preview__img">{previewName}</div>
            <div class="preview__body">
              <strong>{previewName}</strong>
              <p>📍 {previewTown} · {previewCat}</p>
              <p>{previewDesc}</p>
            </div>
          </div>
          <ul>
            <li>Town + category pages include you automatically</li>
            <li>Edit hours, photos and FAQ later in the dashboard</li>
            <li>Free. No card, no trial clock</li>
          </ul>
        </div>
      </aside>
    </div>
  {:else if tab === "claim"}
    <div class="form-grid">
      <div class="card form-card">
        <h2>Claim a listing that’s already live</h2>
        <p class="form-lede">
          Most 30A businesses are already in the directory. Find yours, claim it, verify you run it —
          the dashboard unlocks when verification completes.
        </p>

        <div class="search">
          <input type="search" bind:value={query} placeholder="Search by business name…" />
        </div>

        {#if claimError}
          <p class="error">{claimError}</p>
        {/if}

        <ul class="listings">
          {#each filtered as item (item.slug)}
            {@const managed = listingHasVerifiedOwner(item.slug, seed)}
            {@const isPlaceDesk = item.entityKind === "town" || item.entityKind === "area"}
            {@const deskLabel =
              item.entityKind === "town" ? "Town desk" : item.entityKind === "area" ? "Area desk" : null}
            <li class="listing">
              <span class="listing__thumb" style={`background:${thumbColor(item.slug)}`}
                >{initial(item.name)}</span
              >
              <div class="listing__main">
                <strong>{item.name}</strong>
                <p>
                  {townName(item.townSlug)} ·
                  {deskLabel ?? "Already listed"}
                </p>
              </div>
              <span class="badge" class:badge--ok={managed} class:badge--draft={!managed} class:badge--town={isPlaceDesk && !managed}>
                {managed ? "Managed" : deskLabel ?? "Unclaimed"}
              </span>
              {#if managed}
                <button class="btn btn--ghost btn--sm" type="button" disabled>Already managed</button>
              {:else}
                <button
                  class="btn btn--outline btn--sm"
                  class:selected={claimSelected?.slug === item.slug}
                  type="button"
                  onclick={() => pickClaim(item)}
                >
                  {claimSelected?.slug === item.slug ? "Selected" : "Claim this listing"}
                </button>
              {/if}
            </li>
          {:else}
            <li class="listings__empty">
              No match in the directory. Try <button type="button" class="text-link" onclick={() => setTab("add")}
                >Add a new business</button
              > — it may not be listed yet.
            </li>
          {/each}
        </ul>

        {#if claimSelected}
          <div class="verify">
            <h3>Verify you run {claimSelected.name}</h3>
            <p>
              Pick the fastest option you can do. Until it completes, this listing shows under Your
              businesses as Verification pending and the dashboard stays locked.
            </p>
            <label class="radio">
              <input type="radio" name="verify" value="email" bind:group={verifyMethod} />
              <span>
                <strong>Work email on the business domain</strong>
                <span>We send a link to an email at the business’s own domain. Usually fastest.</span>
              </span>
            </label>
            <label class="radio">
              <input type="radio" name="verify" value="phone" bind:group={verifyMethod} />
              <span>
                <strong>Code to the public phone number</strong>
                <span>We call or text the number already on the listing with a 6-digit code.</span>
              </span>
            </label>
            <label class="radio">
              <input type="radio" name="verify" value="manual" bind:group={verifyMethod} />
              <span>
                <strong>Manual review</strong>
                <span>Send a utility bill, license, or lease. Takes 1–2 business days.</span>
              </span>
            </label>
            <button class="btn btn--teal btn--block" type="button" onclick={confirmClaim}>
              Start verification
            </button>
          </div>
        {/if}
      </div>

      <aside class="aside">
        <div class="card aside-card">
          <h3>Why verify?</h3>
          <p>
            So a competitor, ex-employee, or random visitor can’t take over your page, change your
            hours, or post as you.
          </p>
          <ul>
            <li>Already managed? We won’t start a second claim — we’ll point you to support</li>
            <li>Rejected? You’ll see the reason and a retry path</li>
            <li>One verified owner per listing in v1; transfers go through support</li>
          </ul>
        </div>
      </aside>
    </div>
  {:else}
    <div class="form-grid">
      <form class="card form-card" onsubmit={onStaySubmit}>
        <span class="pill-stay">Stays · Direct booking</span>
        <h2>Add a rental property</h2>
        <p class="form-lede">
          Same account, same idea: you’re a person attaching a property you own or manage. Listings go
          into the Stays review queue, separate from business listings.
        </p>

        <p class="section-label">Property</p>
        <label class="field">
          <span>Property name * <em>— as guests know it</em></span>
          <input type="text" required bind:value={stayName} placeholder="e.g. Sea La Vie — 4BR Gulf View Home" />
        </label>
        <div class="field-row field-row--3">
          <label class="field">
            <span>Town *</span>
            <select required bind:value={stayTown}>
              <option value="">Choose a town</option>
              {#each towns as item (item.slug)}
                <option value={item.slug}>{item.name}</option>
              {/each}
            </select>
          </label>
          <label class="field">
            <span>Type</span>
            <select bind:value={stayType}>
              <option>Beach house</option>
              <option>Condo</option>
              <option>Cottage</option>
              <option>Townhome</option>
              <option>Hotel / Inn</option>
            </select>
          </label>
          <label class="field">
            <span>You are the</span>
            <select bind:value={stayRole}>
              <option>Owner</option>
              <option>Property manager</option>
            </select>
          </label>
        </div>
        <div class="field-row field-row--3">
          <label class="field">
            <span>Bedrooms</span>
            <input type="text" bind:value={bedrooms} />
          </label>
          <label class="field">
            <span>Bathrooms</span>
            <input type="text" bind:value={bathrooms} />
          </label>
          <label class="field">
            <span>Sleeps</span>
            <input type="text" bind:value={sleeps} />
          </label>
        </div>
        <label class="field">
          <span>Street address <em>— shown approximately on the map</em></span>
          <input type="text" bind:value={stayAddress} placeholder="Street address" />
        </label>
        <label class="field">
          <span>Description *</span>
          <textarea required rows="3" bind:value={stayDescription}></textarea>
        </label>

        <p class="section-label">What guests get</p>
        <div class="chips">
          {#each amenityOptions as item (item)}
            <button
              type="button"
              class="chip"
              class:on={amenities.includes(item)}
              onclick={() => toggleAmenity(item)}>{item}</button
            >
          {/each}
        </div>

        <p class="section-label">Booking &amp; photos</p>
        <label class="field">
          <span>Direct booking link <em>— your site, Airbnb, Vrbo, or manager page</em></span>
          <input type="url" bind:value={stayLink} placeholder="https://…" />
        </label>
        <div class="upload">
          <strong>Add property photos</strong>
          <p>Exterior, living room, bedrooms, pool, and the walk to the beach.</p>
          <button class="btn btn--ghost btn--sm" type="button">Choose photos</button>
        </div>
        <button class="btn btn--teal btn--block" type="submit">Submit property for review</button>
        <p class="hint hint--center">
          Hotels use this same form — pick “Hotel / Inn” as the type.
        </p>
      </form>

      <aside class="aside">
        <div class="card aside-card">
          <h3>How Stays is different</h3>
          <ul>
            <li>Separate queue from business listings — a stay is not a business category</li>
            <li>Direct-booking model: guests book through your link</li>
            <li>Update photos and details later — no new account</li>
            <li>One person can hold businesses and properties under the same account</li>
          </ul>
        </div>
      </aside>
    </div>
  {/if}
{/if}

<style>
  .card {
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-4);
    box-shadow: var(--shadow-card);
  }
  .eyebrow {
    margin: 0 0 0.5rem;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--brand-teal);
  }
  .gate {
    padding: var(--size-6);
    max-width: 36rem;
  }
  .gate h2,
  .success h2,
  .form-card h2 {
    margin: 0 0 0.5rem;
    font-family: var(--font-display);
    font-size: clamp(1.35rem, 2.5vw, 1.65rem);
    font-weight: var(--font-weight-8);
    color: var(--brand-deep);
  }
  .gate p,
  .form-lede,
  .aside-card p {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.55;
  }
  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-top: var(--size-4);
  }
  .cta-row--center {
    justify-content: center;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.75rem;
    padding: 0.65rem 1.2rem;
    border-radius: var(--radius-button);
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
  .btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
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
  .btn--outline {
    background: transparent;
    border-color: var(--brand-teal);
    color: var(--brand-teal);
  }
  .btn--outline.selected {
    background: var(--brand-teal);
    color: white;
  }
  .btn--sm {
    min-height: 2.35rem;
    padding: 0.45rem 0.95rem;
    font-size: var(--font-size-0);
  }
  .btn--block {
    width: 100%;
  }
  .success {
    padding: var(--size-7) var(--size-5);
    text-align: center;
    max-width: 36rem;
    margin-inline: auto;
  }
  .success__icon {
    width: 3.5rem;
    height: 3.5rem;
    margin: 0 auto 0.85rem;
    border-radius: 50%;
    background: var(--brand-teal-soft);
    color: var(--brand-coral);
    display: grid;
    place-items: center;
    font-size: 1.5rem;
    font-weight: var(--font-weight-8);
  }
  .success p {
    margin: 0.65rem auto 0;
    max-width: 28rem;
    color: var(--brand-ink-soft);
    font-size: var(--font-size-1);
    line-height: 1.55;
  }
  .success__meta {
    color: var(--brand-deep) !important;
    font-weight: var(--font-weight-6);
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    width: fit-content;
    max-width: 100%;
    margin-bottom: var(--size-5);
    padding: 0.3rem;
    background: var(--brand-sand-dark);
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-button);
  }
  .tabs button {
    border: 0;
    background: transparent;
    padding: 0.65rem 1rem;
    border-radius: var(--radius-button);
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
    color: var(--brand-ink-soft);
    cursor: pointer;
    white-space: nowrap;
  }
  .tabs button.active {
    background: var(--brand-deep);
    color: white;
    font-weight: var(--font-weight-7);
  }

  .form-grid {
    display: grid;
    gap: var(--size-5);
    align-items: start;
  }
  @media (min-width: 880px) {
    .form-grid {
      grid-template-columns: 1fr min(20rem, 34%);
    }
  }
  .form-card {
    padding: var(--size-5);
  }
  .form-lede {
    margin-bottom: var(--size-4) !important;
  }
  .section-label {
    margin: 1.35rem 0 0.75rem;
    padding-top: 1.1rem;
    border-top: 1px solid var(--brand-line);
    font-size: 0.6875rem;
    font-weight: var(--font-weight-8);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .section-label:first-of-type {
    border: 0;
    padding-top: 0;
    margin-top: 0.25rem;
  }
  .field {
    display: grid;
    gap: 0.35rem;
    margin-bottom: 0.95rem;
  }
  .field span {
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
  }
  .field em {
    font-style: normal;
    font-weight: var(--font-weight-4);
    color: var(--brand-ink-soft);
  }
  .field input,
  .field select,
  .field textarea {
    width: 100%;
    min-height: 2.75rem;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    background: white;
    font: inherit;
    color: var(--brand-ink);
  }
  .field textarea {
    min-height: 5.5rem;
    resize: vertical;
  }
  .field input:focus,
  .field select:focus,
  .field textarea:focus {
    outline: 2px solid rgba(0, 137, 123, 0.28);
    border-color: var(--brand-teal);
  }
  .field-row {
    display: grid;
    gap: 0.75rem;
  }
  @media (min-width: 560px) {
    .field-row {
      grid-template-columns: 1fr 1fr;
    }
    .field-row--3 {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
  .hint {
    display: block;
    margin: 0.35rem 0 0.85rem;
    font-size: 0.8125rem;
    color: var(--brand-ink-soft);
    line-height: 1.45;
  }
  .hint--center {
    text-align: center;
  }
  .upload {
    padding: 1.25rem;
    border: 1.5px dashed var(--brand-line);
    border-radius: var(--radius-3);
    background: var(--brand-sand);
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .upload strong {
    font-size: var(--font-size-1);
    color: var(--brand-deep);
  }
  .upload p {
    margin: 0.35rem 0 0.75rem;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }

  .aside-card {
    padding: var(--size-5);
    position: sticky;
    top: calc(var(--header-h) + 0.75rem);
  }
  .aside-card h3 {
    margin: 0 0 0.5rem;
    font-family: var(--font-display);
    font-size: var(--font-size-3);
    font-weight: var(--font-weight-8);
    color: var(--brand-deep);
  }
  .aside-card ul {
    margin: 0.85rem 0 0;
    padding-left: 1.15rem;
    color: var(--brand-ink-soft);
    font-size: var(--font-size-1);
    line-height: 1.55;
  }
  .preview {
    margin-top: 0.85rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    overflow: hidden;
  }
  .preview__img {
    min-height: 6.5rem;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: linear-gradient(135deg, var(--mint), var(--brand-deep));
    color: white;
    font-family: var(--font-display);
    font-weight: var(--font-weight-7);
    font-size: var(--font-size-3);
    text-align: center;
  }
  .preview__body {
    padding: 0.85rem 1rem;
  }
  .preview__body strong {
    color: var(--brand-deep);
    font-size: var(--font-size-1);
  }
  .preview__body p {
    margin: 0.2rem 0 0;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }

  .search input {
    width: 100%;
    min-height: 2.85rem;
    padding: 0.7rem 1.1rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-button);
    font: inherit;
    margin-bottom: 0.85rem;
  }
  .listings {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.65rem;
  }
  .listing {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    background: var(--brand-sand);
  }
  .listing__thumb {
    width: 3.25rem;
    height: 3.25rem;
    border-radius: var(--radius-2);
    display: grid;
    place-items: center;
    color: white;
    font-family: var(--font-display);
    font-weight: var(--font-weight-8);
    flex-shrink: 0;
  }
  .listing__main {
    flex: 1;
    min-width: 10rem;
  }
  .listing__main strong {
    color: var(--brand-deep);
    font-size: var(--font-size-1);
  }
  .listing__main p {
    margin: 0.15rem 0 0;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
  }
  .badge {
    padding: 0.25rem 0.55rem;
    border-radius: var(--radius-pill);
    font-size: 0.625rem;
    font-weight: var(--font-weight-7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1px solid var(--brand-line);
    background: white;
    color: var(--brand-ink-soft);
  }
  .badge--draft {
    background: var(--brand-sand-dark);
  }
  .badge--ok {
    background: var(--brand-teal-soft);
    color: var(--brand-coral);
    border-color: #bbf7d0;
  }
  .badge--town {
    background: var(--brand-selected-soft);
    color: var(--brand-selected);
    border-color: var(--brand-line);
  }
  .listings__empty {
    padding: 1rem;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .text-link {
    border: 0;
    background: none;
    padding: 0;
    color: var(--brand-teal);
    font: inherit;
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  .error {
    margin: 0 0 0.75rem;
    padding: 0.75rem 0.9rem;
    border-radius: var(--radius-2);
    background: var(--brand-sun-soft);
    border: 1px solid var(--brand-line);
    color: var(--brand-coral);
    font-size: var(--font-size-1);
  }
  .verify {
    margin-top: 1.15rem;
    padding: 1.15rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    background: var(--brand-sand);
  }
  .verify h3 {
    margin: 0 0 0.35rem;
    font-family: var(--font-display);
    font-size: var(--font-size-3);
    color: var(--brand-deep);
  }
  .verify > p {
    margin: 0 0 0.85rem;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
    line-height: 1.5;
  }
  .radio {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 0.8rem;
    margin-bottom: 0.55rem;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-2);
    background: white;
    cursor: pointer;
  }
  .radio input {
    margin-top: 0.2rem;
    accent-color: var(--brand-teal);
  }
  .radio strong {
    display: block;
    font-size: var(--font-size-1);
    color: var(--brand-deep);
  }
  .radio span span {
    display: block;
    margin-top: 0.15rem;
    font-size: var(--font-size-0);
    color: var(--brand-ink-soft);
    line-height: 1.45;
  }
  .pill-stay {
    display: inline-flex;
    margin-bottom: 0.65rem;
    padding: 0.3rem 0.7rem;
    border-radius: var(--radius-pill);
    background: var(--brand-teal-soft);
    color: var(--brand-coral);
    border: 1px solid var(--brand-line);
    font-size: 0.625rem;
    font-weight: var(--font-weight-8);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  .chip {
    border: 1px solid var(--brand-line);
    background: white;
    padding: 0.45rem 0.8rem;
    border-radius: var(--radius-pill);
    font: inherit;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    color: var(--brand-deep);
    cursor: pointer;
  }
  .chip.on {
    background: var(--brand-teal);
    border-color: var(--brand-teal);
    color: white;
  }
</style>
