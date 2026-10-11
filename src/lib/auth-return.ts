const RETURN_KEY = "w30a:auth-return";

export function setAuthReturn(path: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(RETURN_KEY, path);
  } catch {
    /* ignore */
  }
}

export function takeAuthReturn(fallback = "/"): string {
  if (typeof window === "undefined") return fallback;
  try {
    const value = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    if (value && value.startsWith("/")) return value;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function openAuth(opts: {
  mode?: "login" | "signup" | "forgot";
  returnTo?: string;
}) {
  if (typeof window === "undefined") return;
  if (opts.returnTo) setAuthReturn(opts.returnTo);
  window.dispatchEvent(
    new CustomEvent("w30a:auth", {
      detail: { mode: opts.mode ?? "login", returnTo: opts.returnTo },
    }),
  );
}
