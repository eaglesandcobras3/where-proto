<script lang="ts">
  let {
    mode = "login",
    loginHref = "/auth/login",
    signupHref = "/auth/signup",
    forgotHref = "/auth/forgot-password",
  }: {
    mode?: "login" | "signup" | "forgot";
    loginHref?: string;
    signupHref?: string;
    forgotHref?: string;
  } = $props();

  let submitted = $state(false);

  function onSubmit(event: Event) {
    event.preventDefault();
    submitted = true;
  }

  const title = mode === "signup" ? "Create an account" : mode === "forgot" ? "Reset your password" : "Sign in";
  const action = mode === "signup" ? "Sign up" : mode === "forgot" ? "Send reset link" : "Sign in";
</script>

<form class="form" onsubmit={onSubmit}>
  <h2>{title}</h2>
  <wa-input label="Email" type="email" required></wa-input>
  {#if mode !== "forgot"}
    <wa-input label="Password" type="password" required></wa-input>
  {/if}
  {#if mode === "signup"}
    <wa-input label="Display name" required></wa-input>
  {/if}
  <wa-button variant="brand" type="submit">{action}</wa-button>
  {#if submitted}
    <p class="note">Prototype only: this does not sign anyone in.</p>
  {/if}
  <p class="links">
    {#if mode !== "login"}
      <a href={loginHref}>Sign in</a>
    {/if}
    {#if mode !== "signup"}
      <a href={signupHref}>Create an account</a>
    {/if}
    {#if mode !== "forgot"}
      <a href={forgotHref}>Forgot password</a>
    {/if}
  </p>
</form>

<style>
  .form {
    display: grid;
    gap: var(--size-4);
    max-width: 420px;
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-card);
    padding: var(--size-5);
  }
  h2 {
    margin: 0;
    font-size: var(--font-size-4);
  }
  .note,
  .links {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-3);
  }
</style>
