import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
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

assert(existsSync(dist), "dist/ exists — run npm run build first");
if (!existsSync(dist)) process.exit(1);

const overview = html("dashboard/edwards-fine-food-and-wine/index.html");
const feed = html("dashboard/edwards-fine-food-and-wine/feed/index.html");
const faqs = html("dashboard/edwards-fine-food-and-wine/faqs/index.html");
const photos = html("dashboard/edwards-fine-food-and-wine/photos/index.html");
const event = html("dashboard/edwards-fine-food-and-wine/events/new/index.html");
const mentions = html("dashboard/edwards-fine-food-and-wine/mentions/index.html");
const listing = html("business/edwards-fine-food-and-wine/index.html");
const pearl = html("business/the-pearl-hotel/index.html");

assert(feed.includes("Post update"), "feed uses Post update");
assert(feed.includes("Post event"), "feed uses Post event");
assert(feed.includes("Goes to the review queue before it appears on your public listing."), "feed uses the review sentence");
assert(faqs.includes("Add FAQ"), "FAQ button is Add FAQ");
assert(faqs.includes("Question"), "FAQ form has Question");
assert(!faqs.includes('label="Phone"'), "FAQ form is not the profile phone fields");
assert(faqs.includes("Is there outdoor seating?"), "dashboard FAQs match the public listing source");
assert(listing.includes("Is there outdoor seating?"), "public listing uses the same FAQ source");
assert(event.includes("Announcement text for the linked update"), "event composer has announcement text");
assert(event.includes("Date"), "event composer has a date field");
assert(photos.includes("I confirm I own the rights"), "photo upload has rights confirmation");
assert(photos.includes("Upload photos"), "photo button is Upload photos");
assert(mentions.includes("Reply as Edward"), "mentions reply uses the business name");
assert(mentions.includes("Replies go live with the Owner badge"), "mentions keep the live-immediately copy");
assert(!overview.includes("Profile actions"), "overview does not show fabricated Profile actions");
assert(overview.includes("data-dash=\"v1\""), "dashboard chrome is flagged for preview");
assert(!listing.includes("Claim this listing"), "claimed listing hides claim CTAs");
assert(pearl.includes("Claim this listing"), "unclaimed listing still shows claim");

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\ndashboard-ui checks passed");
