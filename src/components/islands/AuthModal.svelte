<script lang="ts">
  import { setAuthReturn, takeAuthReturn } from "../../lib/auth-return";
  import { readPersona, writePersona } from "../../lib/proto-persona";

  type Mode = "login" | "signup" | "forgot";

  let {
    initialMode = "login",
    open: openProp = false,
    homeHref = "/",
    legalTermsHref = "/legal/terms",
    legalPrivacyHref = "/legal/privacy",
  }: {
    initialMode?: Mode;
    open?: boolean;
    homeHref?: string;
    legalTermsHref?: string;
    legalPrivacyHref?: string;
  } = $props();

  let open = $state(openProp);
  let mode = $state<Mode>(initialMode);
  let email = $state("");
  let password = $state("");
  let displayName = $state("");
  let submitted = $state(false);
  let dialog = $state<HTMLDialogElement>();

  const title = $derived(
    mode === "signup"
      ? "Create your WhereTo30A account"
      : mode === "forgot"
        ? "Reset your password"
        : "Sign in to WhereTo30A",
  );

  const action = $derived(
    mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Continue",
  );

  const canSubmit = $derived(
    mode === "forgot"
      ? email.trim().includes("@")
      : mode === "signup"
        ? email.trim().includes("@") && password.length >= 6 && displayName.trim().length > 0
        : email.trim().includes("@") && password.length >= 6,
  );

  function modeFromPath(pathname: string): Mode | null {
    if (pathname.includes("/auth/signup")) return "signup";
    if (pathname.includes("/auth/forgot")) return "forgot";
    if (pathname.includes("/auth/login")) return "login";
    return null;
  }

  function syncFromUrl() {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const next = params.get("auth");
    if (next === "login" || next === "signup" || next === "forgot") {
      mode = next;
      open = true;
      submitted = false;
      return;
    }
    const fromPath = modeFromPath(window.location.pathname);
    if (fromPath) {
      mode = fromPath;
      open = true;
      submitted = false;
    }
  }

  function clearAuthParam() {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("auth")) return;
    url.searchParams.delete("auth");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, "", next);
  }

  function show() {
    open = true;
    queueMicrotask(() => dialog?.showModal());
  }

  function hide() {
    open = false;
    submitted = false;
    clearAuthParam();
    if (dialog?.open) dialog.close();
  }

  function setMode(next: Mode) {
    mode = next;
    submitted = false;
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("auth", next);
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }

  function completeAuth() {
    if (readPersona() === "guest") writePersona("visitor");
    submitted = true;
    const next = takeAuthReturn(homeHref);
    hide();
    if (next && next !== window.location.pathname + window.location.search) {
      window.location.assign(next);
    }
  }

  function submit(event?: Event) {
    event?.preventDefault();
    if (!canSubmit) return;
    if (mode === "forgot") {
      submitted = true;
      return;
    }
    completeAuth();
  }

  function onSocial(provider: string) {
    void provider;
    completeAuth();
  }

  $effect(() => {
    syncFromUrl();
    const onPop = () => syncFromUrl();
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: Mode; returnTo?: string }>).detail;
      if (detail?.returnTo) setAuthReturn(detail.returnTo);
      setMode(detail?.mode ?? "login");
      show();
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("w30a:auth", onOpen);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("w30a:auth", onOpen);
    };
  });

  $effect(() => {
    if (open) {
      if (dialog && !dialog.open) dialog.showModal();
    } else if (dialog?.open) {
      dialog.close();
    }
  });
</script>

<dialog
  class="auth"
  bind:this={dialog}
  aria-labelledby="auth-title"
  oncancel={(event) => {
    event.preventDefault();
    hide();
  }}
  onclick={(event) => {
    if (event.target === dialog) hide();
  }}
>
  <div class="panel">
    <header class="top">
      <a class="logo" href={homeHref} onclick={hide}>WhereTo<span>30A</span></a>
      <button class="close" type="button" aria-label="Close" onclick={hide}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
        </svg>
      </button>
    </header>

    <div class="body">
      <h1 id="auth-title">{title}</h1>
      <p class="legal">
        By continuing, you agree to WhereTo30A’s
        <a href={legalTermsHref}>Terms</a>
        and
        <a href={legalPrivacyHref}>Privacy</a>
        policies.
      </p>

      {#if mode !== "forgot"}
        <div class="social">
          <button type="button" onclick={() => onSocial("google")}>
            <span class="g" aria-hidden="true">G</span>
            Continue with Google
          </button>
          <button type="button" onclick={() => onSocial("apple")}>
            <span class="a" aria-hidden="true"></span>
            Continue with Apple
          </button>
        </div>
        <div class="or" aria-hidden="true"><span>or</span></div>
      {/if}

      <p class="required">All fields marked with * are required.</p>

      <form class="form" onsubmit={submit}>
        {#if mode === "signup"}
          <label>
            <span>Display name *</span>
            <input type="text" autocomplete="name" placeholder="Your name" bind:value={displayName} required />
          </label>
        {/if}

        <label>
          <span>{mode === "login" || mode === "forgot" ? "Email" : "Email"} *</span>
          <input
            type="email"
            autocomplete="email"
            placeholder="name@email.com"
            bind:value={email}
            required
          />
        </label>

        {#if mode !== "forgot"}
          <label>
            <span>Password *</span>
            <input
              type="password"
              autocomplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="••••••••"
              bind:value={password}
              required
              minlength="6"
            />
          </label>
        {/if}

        {#if submitted}
          <p class="note">Prototype only — this does not sign anyone in.</p>
        {/if}
      </form>
    </div>

    <footer class="foot">
      <div class="switch">
        {#if mode === "login"}
          <button type="button" onclick={() => setMode("forgot")}>Forgot password?</button>
          <button type="button" onclick={() => setMode("signup")}>Create an account</button>
        {:else if mode === "signup"}
          <button type="button" onclick={() => setMode("login")}>Already have an account? Sign in</button>
        {:else}
          <button type="button" onclick={() => setMode("login")}>Back to sign in</button>
        {/if}
      </div>
      <button class="continue" type="button" disabled={!canSubmit} onclick={() => submit()}>
        {action}
      </button>
    </footer>
  </div>
</dialog>

<style>
  .auth {
    width: min(28rem, calc(100vw - 1.5rem));
    max-height: calc(100vh - 2rem);
    margin: auto;
    padding: 0;
    border: 0;
    border-radius: 1rem;
    background: transparent;
    overflow: visible;
  }
  .auth::backdrop {
    background: rgba(12, 35, 46, 0.55);
    backdrop-filter: blur(2px);
  }
  .panel {
    display: grid;
    grid-template-rows: auto 1fr auto;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 24px 64px rgba(12, 35, 46, 0.28);
    overflow: hidden;
    max-height: calc(100vh - 2rem);
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.15rem 0.35rem;
  }
  .logo {
    font-family: var(--font-display);
    font-weight: var(--font-weight-8);
    color: var(--brand-deep);
    text-decoration: none;
    font-size: var(--font-size-2);
  }
  .logo span {
    color: var(--brand-teal);
  }
  .close {
    width: 2.25rem;
    height: 2.25rem;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--brand-ink-soft);
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .close:hover {
    background: #f1f5f9;
    color: var(--brand-deep);
  }
  .body {
    padding: 0.5rem 1.35rem 1rem;
    overflow: auto;
  }
  h1 {
    margin: 0 0 0.55rem;
    font-family: var(--font-display);
    font-size: clamp(1.35rem, 3vw, 1.6rem);
    font-weight: var(--font-weight-8);
    color: var(--brand-deep);
    line-height: 1.25;
  }
  .legal {
    margin: 0 0 1.1rem;
    font-size: 0.8125rem;
    line-height: 1.45;
    color: var(--brand-ink-soft);
  }
  .legal a {
    color: var(--brand-teal);
  }
  .social {
    display: grid;
    gap: 0.65rem;
    margin-bottom: 1rem;
  }
  .social button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    min-height: 2.85rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.65rem;
    background: white;
    color: var(--brand-deep);
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
    cursor: pointer;
  }
  .social button:hover {
    background: #f8fafc;
  }
  .g {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 0.75rem;
    font-weight: 800;
    color: #4285f4;
    background: #eef3fe;
  }
  .a {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 0.2rem;
    background: #111;
  }
  .or {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: #94a3b8;
    font-size: 0.8125rem;
  }
  .or::before,
  .or::after {
    content: "";
    height: 1px;
    background: #e2e8f0;
  }
  .required {
    margin: 0 0 0.75rem;
    font-size: 0.75rem;
    color: #94a3b8;
  }
  .form {
    display: grid;
    gap: 0.85rem;
  }
  label {
    display: grid;
    gap: 0.35rem;
  }
  label span {
    font-size: 0.875rem;
    font-weight: var(--font-weight-7);
    color: var(--brand-deep);
  }
  input {
    min-height: 2.75rem;
    padding: 0.65rem 0.85rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.65rem;
    font: inherit;
    font-size: var(--font-size-1);
    color: var(--brand-ink);
    background: white;
  }
  input:focus {
    outline: 2px solid rgba(0, 137, 123, 0.35);
    border-color: var(--brand-teal);
  }
  .note {
    margin: 0;
    font-size: var(--font-size-0);
    color: var(--brand-teal);
  }
  .foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1.35rem 1.15rem;
    border-top: 1px solid #e2e8f0;
    background: #fafbfc;
  }
  .switch {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
  }
  .switch button {
    border: 0;
    background: none;
    padding: 0;
    font: inherit;
    font-size: 0.8125rem;
    font-weight: var(--font-weight-6);
    color: var(--brand-teal);
    cursor: pointer;
  }
  .continue {
    margin-left: auto;
    min-height: 2.5rem;
    padding: 0.55rem 1.25rem;
    border: 0;
    border-radius: 0.55rem;
    background: var(--brand-teal);
    color: white;
    font: inherit;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    cursor: pointer;
  }
  .continue:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .continue:not(:disabled):hover {
    background: #007a6e;
  }
</style>
