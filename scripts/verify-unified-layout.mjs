import { readFileSync } from "node:fs";
import { join } from "node:path";

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

const root = "dist";
const pages = {
  towns: "towns/index.html",
  search: "search/index.html",
  stays: "stays/index.html",
  events: "events/index.html",
  guides: "guides/index.html",
  ask: "ask/index.html",
  town: "town/seaside/index.html",
  business: "business/beachy-bean-coffee/index.html",
  stay: "stay/watercolor-inn/index.html",
  event: "event/alys-sunset-yoga/index.html",
  guide: "guide/first-timers-guide/index.html",
};

const failures = [];
function assert(page, rule, cond, detail) {
  if (!cond) failures.push({ page, rule, detail });
}

const forbidden = ["Town Corridor", "Communities & Towns", "Vibe & Amenities", "Amenities & Perks"];
const ratingHits = ["Top Rated", "% helpful", "local rating", "Thumbs up"];

for (const [name, rel] of Object.entries(pages)) {
  const raw = readFileSync(join(root, rel), "utf8");
  const text = textOf(raw);

  assert(name, "flag", !raw.includes("data-when=") && !raw.includes("unified_listing_detail_layout"), "flag leftover");

  if (["towns", "search", "stays", "events", "guides", "ask"].includes(name)) {
    assert(name, 3, forbidden.every((term) => !text.includes(term)), `found ${forbidden.filter((t) => text.includes(t)).join(", ")}`);
    assert(name, 7, /\d+ (towns|businesses|stays|events|guides|questions)\b/.test(text) || name === "ask", `missing results header in: ${text.slice(0, 200)}`);
    assert(name, 10, /Explore/.test(text) && /Towns/.test(text) && /Businesses/.test(text), "explore links missing");
  }

  if (name === "search") {
    assert(name, 4, /Category/.test(text) && /Amenities/.test(text) && /Town/.test(text), "facet labels missing");
    assert(name, 8, !/Stay\s*<span class="count">/.test(raw), "Stay category still present in filters");
    assert(name, 1, /Search businesses/.test(text), "search placeholder missing");
  }
  if (name === "stays") {
    assert(name, 4, /Lodging type/.test(text) && /Amenities/.test(text), "stays facets missing");
    assert(name, 1, /Search stays/.test(text), "stays search missing");
  }
  if (name === "events") {
    assert(name, 6, /Upcoming first/.test(text), "events sort note missing");
    assert(name, 1, /Search events/.test(text), "events search missing");
  }
  if (name === "guides") {
    assert(name, 4, /Topic/.test(text) && /Source/.test(text), "guides facets missing");
  }
  if (name === "ask") {
    assert(name, 4, /Topic/.test(text) && /Search questions/.test(text), "ask facets missing");
  }
  if (name === "towns") {
    assert(name, 4, /Region/.test(text) && /Vibe/.test(text) && /Beach access/.test(text), "towns facets missing");
  }

  if (["town", "business", "stay", "event", "guide"].includes(name)) {
    assert(name, 10, /Gallery/.test(text), "gallery missing");
    assert(name, 10, /Ask the Locals/.test(text), "community Q&A missing");
    assert(name, 10, /Related guides/.test(text), "related guides missing");
  }
  if (name === "town") {
    assert(name, 11, /Stays in Seaside/.test(text), "town stays missing");
  }

  for (const hit of ratingHits) {
    assert(name, 13, !text.includes(hit), `rating leftover: ${hit}`);
  }
}

if (failures.length) {
  console.error("UNIFIED LAYOUT CHECKS FAILED");
  for (const fail of failures) {
    console.error(`- ${fail.page} rule ${fail.rule}: ${fail.detail}`);
  }
  process.exit(1);
}

console.log(`Checked ${Object.keys(pages).length} pages: shared listing/detail layout is the only layout.`);
