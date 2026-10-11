# Business attachment (owner directive 2026-10-11)

Implemented as a dynamic ownership table (seed + localStorage overlay), not hardcoded per-user UI.

Summary of system:

- One person account; ownership is a relationship to a listing
- Feed, events, and updates attach to **business** and **stay** listings only — not to towns/areas as first-class hosts
- Town and area “desks” are also listings (`entityKind: town | area`, e.g. “Rosemary Beach Town Merchants”, “Barrett Square Merchants”) — claimable like any other listing; they hold place-level posts/events/updates
- Place desks are **hidden from consumer search** and directory filters (`searchableBusinesses` / `isPlaceDesk`)
- Ownership status: `pending_approval` | `pending_verification` | `verified` | `rejected`
- Entry: `/merchants`, profile “Your businesses”, header Manage business → `/dashboard`
- `/add-business`: auth-gated; tabs Add / Claim (`?tab=` survives auth return); claim list includes town/area desks
- `/dashboard`: empty (0 verified + no rows), redirect (1 verified only), picker (>1 or pending mixed in)

Outcome tests: see owner directive.
