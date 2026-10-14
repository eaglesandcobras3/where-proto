import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`ok  ${message}`);
    return;
  }
  failed += 1;
  console.error(`FAIL  ${message}`);
}

function html(rel) {
  return readFileSync(join(dist, rel), "utf8");
}

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkHtml(full, files);
    else if (entry.endsWith(".html")) files.push(full);
  }
  return files;
}

function moduleCount(page) {
  return (page.match(/class="updates-module"/g) ?? []).length;
}

function cardSlugs(page) {
  return [...page.matchAll(/data-update-slug="([^"]+)"/g)].map((match) => match[1]);
}

assert(!existsSync(join(root, "src/pages/updates")), "no src/pages/updates route");
assert(!existsSync(join(root, "src/pages/updates.astro")), "no src/pages/updates.astro");
assert(existsSync(dist), "dist/ exists — run npm run build first");

if (existsSync(dist)) {
  assert(!existsSync(join(dist, "updates")), "built site has no /updates directory");

  const pages = walkHtml(dist);
  for (const file of pages) {
    const rel = relative(dist, file);
    const body = readFileSync(file, "utf8");
    const hrefHits = body.match(/href="[^"]*\/updates(?:\/|"|\?|#)/g) ?? [];
    assert(hrefHits.length === 0, `${rel} has no /updates href (${hrefHits.length})`);
    assert(!/See all updates/i.test(body), `${rel} has no See all updates link`);
  }

  const home = html("index.html");
  assert(moduleCount(home) === 0, "homepage has no updates module");
  assert(!/Latest updates|Updates in /.test(home), "homepage has no updates heading");

  const edwards = html("town/rosemary-beach/business/food-and-drink/restaurants/edwards-fine-food-and-wine/index.html");
  assert(moduleCount(edwards) === 1, "Edwards business page has one updates module");
  assert(edwards.includes("Latest updates"), "Edwards heading is Latest updates");
  assert(edwards.includes("Own this business? Share an update"), "Edwards has scoped business CTA");
  assert(edwards.includes("Through October"), "Edwards cards show Through {Month Day}");
  assert(edwards.includes("Hours change"), "Edwards uses plain type labels");
  const edwardsSlugs = cardSlugs(edwards);
  assert(
    edwardsSlugs.includes("edwards-weekend-hours") && edwardsSlugs.includes("edwards-oyster-night"),
    "Edwards module lists only that business's live updates",
  );
  assert(!edwardsSlugs.includes("pearl-pool-closed"), "Edwards does not show Pearl updates");
  assert(!edwardsSlugs.includes("beachy-bean-cold-brew"), "Edwards does not show Beachy Bean updates");
  assert(!edwards.includes("Summer hours ended"), "expired updates do not render on Edwards");

  const pearl = html("town/rosemary-beach/business/stay/hotels/the-pearl-hotel/index.html");
  assert(cardSlugs(pearl).join() === "pearl-pool-closed", "Pearl module is only that business");
  assert(!pearl.includes("Extended weekend hours"), "Pearl does not show Edwards updates");

  const bean = html("town/seaside/business/food-and-drink/coffee-shops/beachy-bean-coffee/index.html");
  assert(cardSlugs(bean).join() === "beachy-bean-cold-brew", "Beachy Bean shows only its live update");
  assert(!bean.includes("Summer hours ended"), "expired Beachy Bean update is hidden");

  const rep = html("town/seaside/business/things-to-do/outdoor/the-rep-theatre/index.html");
  assert(moduleCount(rep) === 0, "business with no live updates hides the module");

  const seaside = html("town/seaside/index.html");
  assert(seaside.includes("Updates in Seaside"), "Seaside heading uses Updates in {Town}");
  assert(seaside.includes("Share a town update"), "Seaside has scoped town CTA");
  const seasideSlugs = cardSlugs(seaside);
  assert(seasideSlugs.includes("wednesday-in-seaside"), "Seaside includes the town announcement");
  assert(seasideSlugs.includes("beachy-bean-cold-brew"), "Seaside includes Beachy Bean");
  assert(!seasideSlugs.includes("square-pavers-weekend"), "Seaside does not inherit the area announcement");
  assert(!seasideSlugs.includes("edwards-weekend-hours"), "Seaside does not show Rosemary updates");
  assert(!seasideSlugs.includes("expired-beachy-bean-hours"), "Seaside hides expired updates");
  assert(seasideSlugs.length <= 3, "Seaside town module is capped at 3");

  const grayton = html("town/grayton-beach/index.html");
  assert(cardSlugs(grayton).includes("market-morning-grayton"), "Grayton shows its town announcement");
  assert(!grayton.includes("New cold brew on tap"), "Grayton does not show Seaside business updates");
  assert(!grayton.includes("Extended weekend hours"), "Grayton does not show Rosemary updates");

  const watercolor = html("town/watercolor/index.html");
  assert(moduleCount(watercolor) === 0, "town with no live updates hides the module");

  const rosemary = html("town/rosemary-beach/index.html");
  const rosemarySlugs = cardSlugs(rosemary);
  assert(rosemarySlugs.includes("edwards-oyster-night"), "Rosemary includes Edwards");
  assert(rosemarySlugs.includes("pearl-pool-closed"), "Rosemary includes Pearl");
  assert(!rosemarySlugs.includes("beachy-bean-cold-brew"), "Rosemary does not show Seaside businesses");
  assert(rosemarySlugs.length <= 3, "Rosemary town module is capped at 3");

  const square = html("area/seaside-town-square/index.html");
  assert(square.includes("Updates in Seaside Town Square"), "area heading uses Updates in {Area}");
  assert(square.includes("Share an area update"), "area has scoped CTA");
  const squareSlugs = cardSlugs(square);
  assert(squareSlugs.includes("square-pavers-weekend"), "area includes its announcement");
  assert(squareSlugs.includes("beachy-bean-cold-brew"), "area includes businesses in that area");
  assert(!squareSlugs.includes("wednesday-in-seaside"), "area does not inherit the town announcement");
  assert(!squareSlugs.includes("edwards-weekend-hours"), "area does not show other-town businesses");
  assert(squareSlugs.length <= 3, "area module is capped at 3");

  const ruskin = html("area/ruskin-place/index.html");
  assert(moduleCount(ruskin) === 0, "area with no live updates hides the module");

  const barrett = html("area/barrett-square/index.html");
  const barrettSlugs = cardSlugs(barrett);
  assert(
    barrettSlugs.includes("edwards-weekend-hours") || barrettSlugs.includes("edwards-oyster-night"),
    "Barrett Square includes Edwards updates",
  );
  assert(!barrettSlugs.includes("beachy-bean-cold-brew"), "Barrett Square does not show Seaside businesses");
  assert(barrettSlugs.length <= 3, "Barrett Square module is capped at 3");
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}

console.log("\nupdates-module checks passed");
