/** Prototype ownership table — dynamic, mutated in localStorage. Not hardcoded UI states. */

import type { ProtoPersona } from "./proto-persona";

export type OwnershipStatus =
  | "pending_approval"
  | "pending_verification"
  | "verified"
  | "rejected";

export type OwnershipRole = "owner";

export type OwnershipKind = "business" | "stay" | "town" | "area";

export interface Ownership {
  id: string;
  personSlug: string;
  listingSlug: string;
  listingName: string;
  town: string;
  summary: string;
  role: OwnershipRole;
  status: OwnershipStatus;
  source: "add" | "claim" | "seed";
  kind: OwnershipKind;
  rejectionReason?: string;
}

export const OWNERSHIP_STORAGE_KEY = "w30a:ownerships";
export const OWNERSHIP_EVENT = "w30a:ownership";

/** Maps browsing persona → person row. Everyone is a person; ownership is separate. */
export function personSlugForPersona(persona: ProtoPersona): string | null {
  if (persona === "guest") return null;
  if (persona === "visitor") return "first_timer";
  if (persona === "employer") return "local_owner";
  return "site_admin";
}

/** Seed verified ownership from catalog ownerUserSlug — used as baseline, overlays apply on top. */
export function seedOwnershipsFromCatalog(
  businesses: {
    slug: string;
    name: string;
    townSlug: string;
    summary: string;
    ownerUserSlug?: string;
    entityKind?: OwnershipKind;
    isStay?: boolean;
  }[],
  townName: (slug: string) => string,
): Ownership[] {
  return businesses
    .filter((biz) => biz.ownerUserSlug)
    .map((biz) => ({
      id: `seed:${biz.ownerUserSlug}:${biz.slug}`,
      personSlug: biz.ownerUserSlug!,
      listingSlug: biz.slug,
      listingName: biz.name,
      town: townName(biz.townSlug),
      summary: biz.summary,
      role: "owner" as const,
      status: "verified" as const,
      source: "seed" as const,
      kind: (biz.entityKind ?? (biz.isStay ? "stay" : "business")) as OwnershipKind,
    }));
}

function readOverlay(): Ownership[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OWNERSHIP_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Ownership[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOverlay(rows: Ownership[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OWNERSHIP_STORAGE_KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent(OWNERSHIP_EVENT));
}

function withKind(row: Ownership): Ownership {
  return { ...row, kind: row.kind ?? "business" };
}

export function mergeOwnerships(seed: Ownership[]): Ownership[] {
  const overlay = readOverlay();
  const byKey = new Map<string, Ownership>();
  for (const row of seed) byKey.set(`${row.personSlug}:${row.listingSlug}`, withKind(row));
  for (const row of overlay) byKey.set(`${row.personSlug}:${row.listingSlug}`, withKind(row));
  return [...byKey.values()];
}

export function ownershipsForPerson(personSlug: string | null, seed: Ownership[]): Ownership[] {
  if (!personSlug) return [];
  return mergeOwnerships(seed).filter((row) => row.personSlug === personSlug);
}

export function verifiedCount(rows: Ownership[]) {
  return rows.filter((row) => row.status === "verified").length;
}

export function findOpenForListing(personSlug: string, listingSlug: string, seed: Ownership[]) {
  return ownershipsForPerson(personSlug, seed).find(
    (row) =>
      row.listingSlug === listingSlug &&
      (row.status === "pending_approval" ||
        row.status === "pending_verification" ||
        row.status === "verified"),
  );
}

export function listingHasVerifiedOwner(listingSlug: string, seed: Ownership[], exceptPerson?: string) {
  return mergeOwnerships(seed).some(
    (row) =>
      row.listingSlug === listingSlug &&
      row.status === "verified" &&
      row.personSlug !== exceptPerson,
  );
}

export function submitNewListing(
  personSlug: string,
  input: {
    listingName: string;
    town: string;
    summary: string;
    listingSlug?: string;
    kind?: OwnershipKind;
  },
  seed: Ownership[],
): Ownership {
  const kind = input.kind ?? "business";
  const listingSlug =
    input.listingSlug ??
    `draft-${input.listingName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-${Date.now().toString(36)}`;

  const existing = ownershipsForPerson(personSlug, seed).find(
    (row) =>
      row.source === "add" &&
      row.listingName.toLowerCase() === input.listingName.trim().toLowerCase() &&
      row.status === "pending_approval" &&
      row.kind === kind,
  );
  if (existing) return existing;

  const row: Ownership = {
    id: `add:${personSlug}:${listingSlug}`,
    personSlug,
    listingSlug,
    listingName: input.listingName.trim(),
    town: input.town,
    summary: input.summary.trim() || "Draft listing awaiting review.",
    role: "owner",
    status: "pending_approval",
    source: "add",
    kind,
  };

  const overlay = readOverlay().filter(
    (item) => !(item.personSlug === personSlug && item.listingSlug === listingSlug),
  );
  overlay.push(row);
  writeOverlay(overlay);
  return row;
}

export function startClaim(
  personSlug: string,
  listing: { slug: string; name: string; town: string; summary: string },
  seed: Ownership[],
): { ok: true; row: Ownership } | { ok: false; reason: "already_owned" | "already_pending" } {
  const mine = findOpenForListing(personSlug, listing.slug, seed);
  if (mine?.status === "verified") return { ok: false, reason: "already_owned" };
  if (mine?.status === "pending_verification" || mine?.status === "pending_approval") {
    return { ok: false, reason: "already_pending" };
  }

  if (listingHasVerifiedOwner(listing.slug, seed, personSlug)) {
    return { ok: false, reason: "already_owned" };
  }

  const row: Ownership = {
    id: `claim:${personSlug}:${listing.slug}`,
    personSlug,
    listingSlug: listing.slug,
    listingName: listing.name,
    town: listing.town,
    summary: listing.summary,
    role: "owner",
    status: "pending_verification",
    source: "claim",
    kind: "business",
  };

  const overlay = readOverlay().filter(
    (item) => !(item.personSlug === personSlug && item.listingSlug === listing.slug),
  );
  overlay.push(row);
  writeOverlay(overlay);
  return { ok: true, row };
}

export function statusLabel(status: OwnershipStatus) {
  switch (status) {
    case "pending_approval":
      return "Pending approval";
    case "pending_verification":
      return "Verification pending";
    case "verified":
      return "Verified";
    case "rejected":
      return "Rejected";
  }
}

export function dashboardUnlocked(row: Ownership) {
  return row.status === "verified";
}
