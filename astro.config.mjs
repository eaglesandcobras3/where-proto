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
  },
});
