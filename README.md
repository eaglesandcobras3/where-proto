# WhereTo30A prototype

Astro rebuild of [whereto30a.com](https://whereto30a.com/). Mock data only.

## Stack

| Choice | Why |
|---|---|
| Astro 5, static output | Content pages pre-render. Zero JS by default. |
| Svelte 5 islands | Interactive widgets hydrate with `client:load` / `client:visible`. |
| Web Awesome | Web components for drawers, inputs, dialogs, and buttons. |
| Open Props + scoped CSS | Design tokens without Tailwind. Styles live on each component. |

## Local

```bash
npm install
npm run dev
```

## GitHub Pages

The deploy workflow builds the site and pushes `dist/` to the `gh-pages` branch.

https://eaglesandcobras3.github.io/where-proto/

## Routes

See `ROUTE-SCAFFOLD.md`. `/ia` lists every live route. `/updates` is footer only.
