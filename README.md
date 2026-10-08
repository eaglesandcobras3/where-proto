# WhereTo30A wireframe

Astro prototype of [whereto30a.com](https://whereto30a.com/). Fake data. Gray-box wireframe, not a designed UI.

Phase 1 is routes. Phase 2 is page anatomy and richer fake data. Phase 3 is account, admin, auth, and newsletter surfaces.

## Local

```bash
npm install
npm run dev
```

## GitHub Pages

The deploy workflow builds the site and pushes `dist/` to the `gh-pages` branch.

After the first successful deploy, point Pages at that branch:

1. Open Settings → Pages
2. Set Source to **Deploy from a branch**
3. Set Branch to `gh-pages` / `/ (root)`

The site URL is:

https://eaglesandcobras3.github.io/where-proto/

If the repository stays private, GitHub Pages needs a paid plan. Making the repo public is the other option.

## Routes

See `ROUTE-SCAFFOLD.md`. `/ia` lists every live wireframe route.
