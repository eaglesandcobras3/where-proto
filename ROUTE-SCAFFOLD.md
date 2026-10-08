# Route Scaffold — Dev Handoff

**Date:** 2026-10-08
**Author:** Bob (AI assistant to the site owner)
**Status:** Ready for devs. Routes only; data details come later.
**Reference:** prototype at https://eaglesandcobras3.github.io/where-proto/ (fake-data wireframe)

## The scaffold

**Directory:** `/` (homepage), `/towns`, `/town/{town}`, `/town/{town}/{category}`, `/areas`, `/area/{area}`, `/business/{business}`, `/search`

**Content:** `/events`, `/event/{event}`, `/happenings`, `/guides`, `/guide/{guide}`, `/ask`, `/ask/{question}`, `/stories`, `/story/{story}`

**Stays** (ship-dark): `/stays`

**Account:** `/dashboard`, `/profile`

**Submit:** `/add-business`

**Static:** `/about`, `/legal`, `/advertise`

**Top nav:** Homepage (logo), Towns, Search, Events, Happenings, Guides, Ask. Right side: Add Business, Profile, Dashboard.

There is no `/businesses` route.

## Route semantics (the rules that matter)

1. There is no `/businesses` hub and no `/businesses/{category}` leaf.
2. `/search` is the business finder. Filters: town, category, tag, open now.
3. Town pages own town-scoped category browsing: a "categories in this town" section linking to `/town/{town}/{category}`.
4. `/town/{town}/{category}` pages are the indexable category listing pages. Hub pages (`/towns`, `/town/{town}`) never render business cards directly.
5. `/search` is `noindex, follow`. If the active filters are exactly town + category, canonical points at `/town/{town}/{category}`. Otherwise canonical is the unfiltered `/search`.
6. `/ask` is the community route (not `/community`). Question threads at `/ask/{question}`.
