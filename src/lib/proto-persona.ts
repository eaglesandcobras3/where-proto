export type ProtoPersona = "guest" | "visitor" | "employer" | "town-manager";

export const PERSONA_STORAGE_KEY = "w30a:persona";
export const PERSONA_EVENT = "w30a:persona";

export const PERSONAS: {
  id: ProtoPersona;
  label: string;
  short: string;
  blurb: string;
}[] = [
  {
    id: "guest",
    label: "Not signed in",
    short: "Guest",
    blurb: "Sign in CTAs and auth gates.",
  },
  {
    id: "visitor",
    label: "Visitor",
    short: "Visitor",
    blurb: "Profile + Ask. Empty merchant hub (no listings).",
  },
  {
    id: "employer",
    label: "Employer / merchant",
    short: "Employer",
    blurb: "Manage business dashboard with listings.",
  },
  {
    id: "town-manager",
    label: "Town manager",
    short: "Town mgr",
    blurb: "Claim/manage a town desk (e.g. Rosemary Beach Town Merchants).",
  },
];

export function isProtoPersona(value: string | null | undefined): value is ProtoPersona {
  return value === "guest" || value === "visitor" || value === "employer" || value === "town-manager";
}

export function readPersona(): ProtoPersona {
  if (typeof window === "undefined") return "guest";
  try {
    const stored = localStorage.getItem(PERSONA_STORAGE_KEY);
    return isProtoPersona(stored) ? stored : "guest";
  } catch {
    return "guest";
  }
}

export function writePersona(next: ProtoPersona) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PERSONA_STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  document.documentElement.dataset.persona = next;
  window.dispatchEvent(new CustomEvent(PERSONA_EVENT, { detail: { persona: next } }));
}

export function personaSignedIn(persona: ProtoPersona = readPersona()) {
  return persona !== "guest";
}

export function personaCaps(persona: ProtoPersona = readPersona()) {
  return {
    signedIn: persona !== "guest",
    showSignIn: persona === "guest",
    showProfile: persona !== "guest",
    showManageBusiness: persona === "employer" || persona === "visitor",
    showTownDesk: persona === "town-manager",
    showAddBusiness: persona === "employer" || persona === "guest" || persona === "visitor",
  };
}
