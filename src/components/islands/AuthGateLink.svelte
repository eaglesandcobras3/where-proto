<script lang="ts">
  import { openAuth } from "../../lib/auth-return";
  import { PERSONA_EVENT, personaSignedIn, readPersona } from "../../lib/proto-persona";

  let {
    href,
    class: className = "",
    returnTo,
    mode = "signup",
    children,
  }: {
    href: string;
    class?: string;
    returnTo?: string;
    mode?: "login" | "signup";
    children?: import("svelte").Snippet;
  } = $props();

  let signedIn = $state(false);

  function onClick(event: MouseEvent) {
    if (signedIn) return;
    event.preventDefault();
    openAuth({ mode, returnTo: returnTo ?? href });
  }

  $effect(() => {
    const sync = () => {
      signedIn = personaSignedIn(readPersona());
    };
    sync();
    window.addEventListener(PERSONA_EVENT, sync);
    return () => window.removeEventListener(PERSONA_EVENT, sync);
  });
</script>

<a {href} class={className} onclick={onClick}>
  {@render children?.()}
</a>
