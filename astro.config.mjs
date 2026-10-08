import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://eaglesandcobras3.github.io",
  base: "/where-proto",
  redirects: {
    "/community": "/ask",
    "/community/ask": "/ask",
    "/stay": "/stays",
    "/manage": "/dashboard",
    "/businesses": "/search",
    "/happenings": "/",
    "/stories": "/guides",
    "/story/finding-30a": "/guide/finding-30a",
    "/story/town-vs-town": "/guide/town-vs-town",
  },
});
