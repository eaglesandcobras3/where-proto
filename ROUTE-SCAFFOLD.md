# Route Scaffold — Dev Handoff

**Date:** 2026-10-08
**Author:** Bob (AI assistant to the site owner)
**Status:** Phase 1 routes plus Phase 2 data / page anatomy and Phase 3 account surfaces.
**Reference:** prototype at https://eaglesandcobras3.github.io/where-proto/ (fake-data wireframe)

## The scaffold

**Directory:** `/` (homepage), `/towns`, `/town/{town}`, `/town/{town}/{category}`, `/areas`, `/area/{area}`, `/business/{business}`, `/search`

**Content:** `/events`, `/event/{event}`, `/guides`, `/guide/{guide}`, `/ask`, `/ask/{question}`, `/posts/{post}`

**Stays:** `/stays`, `/stay/{stay}`

**Account:** `/dashboard`, `/dashboard/{business}`, `/dashboard/{business}/listing`, `/dashboard/{business}/feed`, `/dashboard/{business}/events/new`, `/dashboard/{business}/mentions`, `/dashboard/{business}/photos`, `/profile`, `/profile/favorites`, `/profile/posts`, `/profile/settings`, `/u/{user}`

**Admin:** `/admin`, `/admin/review-queue`, `/admin/seo`, `/admin/knowledge`, `/admin/entities`

**Auth:** `/auth/login`, `/auth/signup`, `/auth/forgot-password`

**Submit:** `/add-business`

**Newsletters:** `/newsletters/visitor`, `/newsletters/business`

**Static:** `/about`, `/legal`, `/advertise`

**Top nav:** Homepage (logo), Towns, Areas, Search, Events, Stays, Guides, Ask. Right side: Add Business, Profile, Dashboard.

Stories are guides. `/stories` and `/story/{story}` redirect to `/guides`.

Updates are not a route. They only render on `/town/{town}` and `/business/{business}`.

`/happenings` redirects to `/`.

There is no `/businesses` route.

## Route semantics (the rules that matter)

1. There is no `/businesses` hub and no `/businesses/{category}` leaf.
2. `/search` is the business finder. Filters: town, category, tag, open now.
3. Town pages own town-scoped category browsing: a "categories in this town" section linking to `/town/{town}/{category}`.
4. `/town/{town}/{category}` pages are the indexable category listing pages. Hub pages (`/towns`, `/town/{town}`) never render business cards directly.
5. `/search` is `noindex, follow`. If the active filters are exactly town + category, canonical points at `/town/{town}/{category}`. Otherwise canonical is the unfiltered `/search`.
6. `/ask` is the community route (not `/community`). Question threads at `/ask/{question}`.
7. User posts from a town or business page. Business posts from `/dashboard/{business}/feed`.
8. Updates (formerly happenings) are not top-level. They only show on town and business pages.
9. Areas extend a town. A town can have many areas. Area kinds are shopping area and neighborhood.
