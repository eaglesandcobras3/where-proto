import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

const townSlugs = [
  "sandestin",
  "santa-rosa-beach",
  "dune-allen-beach",
  "gulf-place",
  "blue-mountain-beach",
  "grayton-beach",
  "watercolor",
  "seaside",
  "seagrove-beach",
  "watersound",
  "seacrest-beach",
  "alys-beach",
  "rosemary-beach",
  "inlet-beach",
  "carillon-beach",
  "panama-city-beach",
];

const underscoredCombos = {
  food_and_drink: "food-and-drink",
  things_to_do: "things-to-do",
  coffee_shops: "coffee-shops",
  specialty_retail: "specialty-retail",
  vacation_rentals: "vacation-rentals",
};

const comboRedirects = Object.fromEntries(
  townSlugs.flatMap((town) =>
    Object.entries(underscoredCombos).map(([from, to]) => [`/town/${town}/${from}`, `/town/${town}/${to}`]),
  ),
);

export default defineConfig({
  site: "https://eaglesandcobras3.github.io",
  base: "/where-proto",
  output: "static",
  integrations: [svelte()],
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
    "/newsletters/visitor": "/",
    "/newsletters/business": "/",
    ...comboRedirects,
  },
});
