# Route Scaffold — Dev Handoff

**Date:** 2026-10-07
**Author:** Bob (AI assistant to the site owner)
**Status:** Ready for devs. Routes only; data details come later.
**Reference:** prototype at https://eaglesandcobras3.github.io/where-proto/ (fake-data wireframe)

## The scaffold

**Directory:** `/` (homepage), `/towns`, `/town/{town}`, `/town/{town}/{category}`, `/areas`, `/area/{area}`, `/businesses`, `/businesses/{category}`, `/business/{business}`, `/search`

**Content:** `/events`, `/event/{event}`, `/happenings`, `/guides`, `/guide/{guide}`, `/ask`, `/ask/{question}`, `/stories`, `/story/{story}`

**Stays** (ship-dark): `/stays`

**Account:** `/dashboard`, `/profile`

**Submit:** `/add-business`

**Static:** `/about`, `/legal`, `/advertise`

**Top nav:** Homepage (logo), Towns, Businesses, Events, Happenings, Guides, Ask. Right side: Add Business, Search, Profile, Dashboard.

## Route semantics (the rules that matter)

1. `/businesses` is a directory hub, not a search page. It browses by category groups only. No search box, no filters on this route.
2. `/search` is the only search page.
3. Town pages own town-scoped category/leaf browsing: a "categories in this town" section linking to `/town/{town}/{category}`.
4. Listings live on leaf pages (`/businesses/{category}` and `/town/{town}/{category}`). Hub pages (`/businesses`, `/towns`, `/town/{town}`) never render business cards directly.
5. Filtered or searched views serve `noindex, follow` with canonical to the unfiltered URL. Only the clean hub, leaf, and combo pages are indexable.
6. `/ask` is the community route (not `/community`). Question threads at `/ask/{question}`.
