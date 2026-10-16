import type {
  Answer,
  Area,
  Business,
  Category,
  Comment,
  EventItem,
  Favorite,
  Guide,
  KnowledgeItem,
  Photo,
  Post,
  Video,
  Question,
  Reaction,
  ReviewQueueItem,
  SeoOverride,
  Stay,
  Tag,
  Town,
  Update,
  User,
} from "./types";

export const currentUserSlug = "beachlocal";

export const towns: Town[] = [
  {
    slug: "sandestin",
    name: "Sandestin",
    summary: "Resort community at the west end of the 30A corridor.",
    walkability: "Mixed",
    beachAccess: "Mostly private for guests",
    areaSlugs: ["sandestin-village"],
  },
  {
    slug: "santa-rosa-beach",
    name: "Santa Rosa Beach",
    summary: "Larger west-central town wrapping several 30A neighborhoods.",
    walkability: "Drive-first",
    beachAccess: "Public access points",
    areaSlugs: ["santa-rosa-core"],
  },
  {
    slug: "dune-allen-beach",
    name: "Dune Allen Beach",
    summary: "Quiet gulf-front stretch west of Gulf Place.",
    walkability: "Mixed",
    beachAccess: "Public access points",
    areaSlugs: ["dune-allen-shore"],
  },
  {
    slug: "gulf-place",
    name: "Gulf Place",
    summary: "Shops and dining at a western public beach.",
    walkability: "Walkable at the shops",
    beachAccess: "Public beach",
    areaSlugs: ["gulf-place-shops"],
  },
  {
    slug: "blue-mountain-beach",
    name: "Blue Mountain Beach",
    summary: "Artsy, laid-back stretch with a local scene.",
    walkability: "Mixed",
    beachAccess: "Public access nearby",
    areaSlugs: ["blue-mountain-village"],
  },
  {
    slug: "grayton-beach",
    name: "Grayton Beach",
    summary: "Older beach town, state park, and a local hangout feel.",
    walkability: "Mixed",
    beachAccess: "Public and state park",
    areaSlugs: ["hotz-avenue", "grayton-residential"],
  },
  {
    slug: "watercolor",
    name: "WaterColor",
    summary: "Family-oriented planned community west of Seaside.",
    walkability: "Walkable inside the community",
    beachAccess: "Private for guests and residents",
    areaSlugs: ["watercolor-town-center", "western-lake"],
  },
  {
    slug: "seaside",
    name: "Seaside",
    summary: "Classic 30A town around a central square and amphitheatre.",
    walkability: "Walkable",
    beachAccess: "Public access nearby",
    areaSlugs: ["seaside-town-square", "ruskin-place", "seaside-residential"],
  },
  {
    slug: "seagrove-beach",
    name: "Seagrove Beach",
    summary: "Residential beach town between Seaside and WaterSound.",
    walkability: "Mixed",
    beachAccess: "Public access points",
    areaSlugs: ["seagrove-shore"],
  },
  {
    slug: "watersound",
    name: "WaterSound",
    summary: "Newer planned community with a compact town center.",
    walkability: "Walkable inside the community",
    beachAccess: "Private for guests and residents",
    areaSlugs: ["watersound-town-center"],
  },
  {
    slug: "seacrest-beach",
    name: "Seacrest Beach",
    summary: "Quiet gulf-front neighborhood east of WaterSound.",
    walkability: "Mixed",
    beachAccess: "Mostly private for guests",
    areaSlugs: ["seacrest-shore"],
  },
  {
    slug: "alys-beach",
    name: "Alys Beach",
    summary: "White Mediterranean-inspired architecture and a quieter pace.",
    walkability: "Walkable",
    beachAccess: "Private for guests and residents",
    areaSlugs: ["alys-town-center", "caliza-courtyard"],
  },
  {
    slug: "rosemary-beach",
    name: "Rosemary Beach",
    summary: "Walkable town center, European-inspired streets, Barrett Square.",
    walkability: "Walkable",
    beachAccess: "Private for guests and residents",
    areaSlugs: ["barrett-square", "east-rosemary", "north-rosemary"],
  },
  {
    slug: "inlet-beach",
    name: "Inlet Beach",
    summary: "Eastern end of 30A with 30Avenue shops and dining.",
    walkability: "Mixed",
    beachAccess: "Public access points",
    areaSlugs: ["30avenue", "camp-creek"],
  },
  {
    slug: "carillon-beach",
    name: "Carillon Beach",
    summary: "Gated gulf-front community at the east end of 30A.",
    walkability: "Walkable inside the gates",
    beachAccess: "Private for guests and residents",
    areaSlugs: ["carillon-green"],
  },
  {
    slug: "panama-city-beach",
    name: "Panama City Beach",
    summary: "Larger neighbor just east of the 30A corridor.",
    walkability: "Drive-first",
    beachAccess: "Public beaches",
    areaSlugs: ["pcb-pier-park"],
  },
];

export const areas: Area[] = [
  {
    slug: "barrett-square",
    name: "Barrett Square",
    townSlug: "rosemary-beach",
    kind: "shopping",
    summary: "Town green, coffee, dining, and boutique cluster.",
  },
  {
    slug: "east-rosemary",
    name: "East Rosemary",
    townSlug: "rosemary-beach",
    kind: "neighborhood",
    summary: "Residential streets east of the town center.",
  },
  {
    slug: "north-rosemary",
    name: "North of 30A",
    townSlug: "rosemary-beach",
    kind: "neighborhood",
    summary: "Neighborhood north of the highway, still Rosemary Beach.",
  },
  {
    slug: "seaside-town-square",
    name: "Seaside Town Square",
    townSlug: "seaside",
    kind: "shopping",
    summary: "Central square, amphitheatre, shops, and Airstream Row.",
  },
  {
    slug: "ruskin-place",
    name: "Ruskin Place",
    townSlug: "seaside",
    kind: "shopping",
    summary: "Artist alley and galleries just off the square.",
  },
  {
    slug: "seaside-residential",
    name: "Seaside cottages",
    townSlug: "seaside",
    kind: "neighborhood",
    summary: "Picket-fence cottage streets around the square.",
  },
  {
    slug: "alys-town-center",
    name: "Alys Town Center",
    townSlug: "alys-beach",
    kind: "shopping",
    summary: "White-block shops and dining in the town core.",
  },
  {
    slug: "caliza-courtyard",
    name: "Caliza courtyard",
    townSlug: "alys-beach",
    kind: "neighborhood",
    summary: "Pool and residential court on the gulf side.",
  },
  {
    slug: "hotz-avenue",
    name: "Hotz Avenue",
    townSlug: "grayton-beach",
    kind: "shopping",
    summary: "Grayton's small commercial strip.",
  },
  {
    slug: "grayton-residential",
    name: "Grayton streets",
    townSlug: "grayton-beach",
    kind: "neighborhood",
    summary: "Older beach-house blocks around the state park.",
  },
  {
    slug: "watercolor-town-center",
    name: "WaterColor Town Center",
    townSlug: "watercolor",
    kind: "shopping",
    summary: "Shops and dining at the planned-community center.",
  },
  {
    slug: "western-lake",
    name: "Western Lake",
    townSlug: "watercolor",
    kind: "neighborhood",
    summary: "Residential side toward the coastal dune lake.",
  },
  {
    slug: "30avenue",
    name: "30Avenue",
    townSlug: "inlet-beach",
    kind: "shopping",
    summary: "Open-air shopping and dining at the east end of 30A.",
  },
  {
    slug: "camp-creek",
    name: "Camp Creek",
    townSlug: "inlet-beach",
    kind: "neighborhood",
    summary: "Neighborhood and lake side east of 30Avenue.",
  },
  {
    slug: "sandestin-village",
    name: "Sandestin Village",
    townSlug: "sandestin",
    kind: "shopping",
    summary: "Resort village shops and dining at the west end.",
  },
  {
    slug: "santa-rosa-core",
    name: "Santa Rosa Beach",
    townSlug: "santa-rosa-beach",
    kind: "neighborhood",
    summary: "Spread-out residential and commercial pockets.",
  },
  {
    slug: "dune-allen-shore",
    name: "Dune Allen shore",
    townSlug: "dune-allen-beach",
    kind: "neighborhood",
    summary: "Gulf-front houses west of Gulf Place.",
  },
  {
    slug: "gulf-place-shops",
    name: "Gulf Place shops",
    townSlug: "gulf-place",
    kind: "shopping",
    summary: "Public-beach shops and casual dining.",
  },
  {
    slug: "blue-mountain-village",
    name: "Blue Mountain village",
    townSlug: "blue-mountain-beach",
    kind: "shopping",
    summary: "Small commercial cluster on the artsy stretch.",
  },
  {
    slug: "seagrove-shore",
    name: "Seagrove shore",
    townSlug: "seagrove-beach",
    kind: "neighborhood",
    summary: "Residential streets between Seaside and WaterSound.",
  },
  {
    slug: "watersound-town-center",
    name: "WaterSound Town Center",
    townSlug: "watersound",
    kind: "shopping",
    summary: "Newer town-center shops inside the community.",
  },
  {
    slug: "seacrest-shore",
    name: "Seacrest shore",
    townSlug: "seacrest-beach",
    kind: "neighborhood",
    summary: "Quiet gulf-front streets east of WaterSound.",
  },
  {
    slug: "carillon-green",
    name: "Carillon green",
    townSlug: "carillon-beach",
    kind: "neighborhood",
    summary: "Gated green and gulf-front streets.",
  },
  {
    slug: "pcb-pier-park",
    name: "Pier Park",
    townSlug: "panama-city-beach",
    kind: "shopping",
    summary: "Large shopping and dining district east of 30A.",
  },
];

export const categories: Category[] = [
  {
    slug: "food-and-drink",
    name: "Food & Drink",
    leaves: [
      { slug: "restaurants", name: "Restaurants" },
      { slug: "coffee-shops", name: "Coffee Shops" },
      { slug: "bars", name: "Bars" },
    ],
  },
  {
    slug: "shopping",
    name: "Shopping",
    leaves: [
      { slug: "boutiques", name: "Boutiques & Apparel" },
      { slug: "specialty-retail", name: "Specialty Retail" },
    ],
  },
  {
    slug: "stay",
    name: "Stay",
    leaves: [
      { slug: "hotels", name: "Hotels" },
      { slug: "vacation-rentals", name: "Vacation Rentals" },
    ],
  },
  {
    slug: "things-to-do",
    name: "Things to Do",
    leaves: [
      { slug: "outdoor", name: "Outdoor Activities" },
      { slug: "rentals", name: "Rentals" },
    ],
  },
  {
    slug: "community",
    name: "Community",
    leaves: [
      { slug: "town-merchants", name: "Town Merchants" },
      { slug: "area-merchants", name: "Area Merchants" },
    ],
  },
];

const directoryBusinesses: Business[] = [
  {
    slug: "edwards-fine-food-and-wine",
    name: "Edward's Fine Food & Wine",
    townSlug: "rosemary-beach",
    areaSlug: "barrett-square",
    categorySlug: "food-and-drink",
    leafSlug: "restaurants",
    summary: "Gulf seafood, steaks, and courtyard seating in Rosemary Beach.",
    tagSlugs: ["walkable", "family"],
    openNow: true,
    address: "54 Main St, Rosemary Beach, FL",
    phone: "(850) 555-0101",
    website: "https://example.com/edwards",
    hours: "Tue–Sun 5:00 PM – 9:30 PM",
    priceBand: "$$$",
    ownerUserSlug: "local_owner",
  },
  {
    slug: "beachy-bean-coffee",
    name: "Beachy Bean Coffee Co.",
    townSlug: "seaside",
    areaSlug: "seaside-town-square",
    categorySlug: "food-and-drink",
    leafSlug: "coffee-shops",
    summary: "Coffee and breakfast near the square. Fake listing for the wireframe.",
    tagSlugs: ["walkable"],
    openNow: true,
    address: "1 Central Square, Seaside, FL",
    phone: "(850) 555-0102",
    hours: "Daily 7:00 AM – 2:00 PM",
    priceBand: "$",
    ownerUserSlug: "local_owner",
  },
  {
    slug: "the-rep-theatre",
    name: "The REP Theatre",
    townSlug: "seaside",
    areaSlug: "seaside-town-square",
    categorySlug: "things-to-do",
    leafSlug: "outdoor",
    summary: "Live theater and performing arts in Seaside.",
    tagSlugs: ["family", "live-music"],
    openNow: false,
    address: "Seaside Repertory Theatre, Seaside, FL",
    hours: "Box office 11:00 AM – 5:00 PM on show days",
  },
  {
    slug: "the-pearl-hotel",
    name: "The Pearl Hotel",
    townSlug: "rosemary-beach",
    areaSlug: "barrett-square",
    categorySlug: "stay",
    leafSlug: "hotels",
    summary: "Hotel stay in the Rosemary Beach town center.",
    tagSlugs: ["walkable", "family"],
    openNow: true,
    address: "63 Main St, Rosemary Beach, FL",
    phone: "(850) 555-0103",
    hours: "Front desk 24 hours",
    priceBand: "$$$$",
    isStay: true,
  },
  {
    slug: "grayton-bike-co",
    name: "Grayton Bike Co.",
    townSlug: "grayton-beach",
    areaSlug: "hotz-avenue",
    categorySlug: "things-to-do",
    leafSlug: "rentals",
    summary: "Bike rentals for the Timpoochee Trail.",
    tagSlugs: ["walkable"],
    openNow: false,
    address: "Hwy 30A, Grayton Beach, FL",
    phone: "(850) 555-0104",
    hours: "Daily 8:00 AM – 6:00 PM",
    ownerUserSlug: "local_owner",
    ownershipStatus: "pending_approval",
  },
  {
    slug: "alys-shoppe",
    name: "Alys Shoppe",
    townSlug: "alys-beach",
    areaSlug: "alys-town-center",
    categorySlug: "shopping",
    leafSlug: "boutiques",
    summary: "Beachwear and town-logo goods in Alys Beach.",
    tagSlugs: ["walkable"],
    openNow: true,
    address: "Alys Beach Town Center",
    hours: "Daily 10:00 AM – 6:00 PM",
    priceBand: "$$",
  },
  {
    slug: "bud-and-alleys",
    name: "Bud & Alley's",
    townSlug: "seaside",
    areaSlug: "seaside-town-square",
    categorySlug: "food-and-drink",
    leafSlug: "restaurants",
    summary: "Gulf-front dining on the boardwalk. Fake listing.",
    tagSlugs: ["walkable", "family", "live-music"],
    openNow: true,
    address: "2236 E County Hwy 30A, Seaside, FL",
    phone: "(850) 555-0105",
    hours: "Daily 11:00 AM – 9:00 PM",
    priceBand: "$$$",
  },
  {
    slug: "the-red-bar",
    name: "The Red Bar",
    townSlug: "grayton-beach",
    areaSlug: "hotz-avenue",
    categorySlug: "food-and-drink",
    leafSlug: "restaurants",
    summary: "Local hangout with food and music. Fake listing.",
    tagSlugs: ["live-music"],
    openNow: true,
    address: "70 Hotz Ave, Grayton Beach, FL",
    hours: "Daily 11:00 AM – late",
    priceBand: "$$",
  },
  {
    slug: "fish-out-of-water",
    name: "Fish Out of Water",
    townSlug: "watercolor",
    areaSlug: "watercolor-town-center",
    categorySlug: "food-and-drink",
    leafSlug: "restaurants",
    summary: "Hotel restaurant used as a WaterColor dining sample.",
    tagSlugs: ["family"],
    openNow: false,
    address: "WaterColor Inn",
    hours: "Dinner 5:00 PM – 9:00 PM",
    priceBand: "$$$$",
  },
  {
    slug: "cowgirl-kitchen",
    name: "Cowgirl Kitchen",
    townSlug: "inlet-beach",
    areaSlug: "30avenue",
    categorySlug: "food-and-drink",
    leafSlug: "restaurants",
    summary: "Casual dining at 30Avenue. Fake listing.",
    tagSlugs: ["family"],
    openNow: true,
    address: "30Avenue, Inlet Beach, FL",
    hours: "Daily 11:00 AM – 9:00 PM",
    priceBand: "$$",
  },
  {
    slug: "amavida",
    name: "Amavida Coffee and Tea",
    townSlug: "rosemary-beach",
    areaSlug: "barrett-square",
    categorySlug: "food-and-drink",
    leafSlug: "coffee-shops",
    summary: "Coffee on Barrett Square. Fake listing.",
    tagSlugs: ["walkable"],
    openNow: true,
    address: "Barrett Square, Rosemary Beach, FL",
    hours: "Daily 7:00 AM – 5:00 PM",
    priceBand: "$",
  },
  {
    slug: "cafe-thirty-a",
    name: "Cafe Thirty-A",
    townSlug: "watercolor",
    areaSlug: "watercolor-town-center",
    categorySlug: "food-and-drink",
    leafSlug: "coffee-shops",
    summary: "Breakfast and coffee west of Seaside. Fake listing.",
    tagSlugs: ["family"],
    openNow: false,
    hours: "Daily 7:00 AM – 2:00 PM",
    priceBand: "$$",
  },
  {
    slug: "the-lawn",
    name: "The Lawn at The Pearl",
    townSlug: "rosemary-beach",
    areaSlug: "barrett-square",
    categorySlug: "food-and-drink",
    leafSlug: "bars",
    summary: "Courtyard drinks in Rosemary Beach. Fake listing.",
    tagSlugs: ["walkable", "live-music"],
    openNow: true,
    hours: "Thu–Sun 4:00 PM – 10:00 PM",
    priceBand: "$$$",
  },
  {
    slug: "shunk-gulley",
    name: "Shunk Gulley Pizza",
    townSlug: "inlet-beach",
    areaSlug: "30avenue",
    categorySlug: "food-and-drink",
    leafSlug: "bars",
    summary: "Pizza and a bar at the east end. Fake listing.",
    tagSlugs: ["family"],
    openNow: true,
    hours: "Daily 11:00 AM – 10:00 PM",
    priceBand: "$$",
  },
  {
    slug: "seaside-style",
    name: "Seaside Style",
    townSlug: "seaside",
    areaSlug: "ruskin-place",
    categorySlug: "shopping",
    leafSlug: "boutiques",
    summary: "Apparel around the square. Fake listing.",
    tagSlugs: ["walkable"],
    openNow: true,
    hours: "Daily 10:00 AM – 6:00 PM",
    priceBand: "$$",
  },
  {
    slug: "watercolor-inn",
    name: "WaterColor Inn",
    townSlug: "watercolor",
    areaSlug: "western-lake",
    categorySlug: "stay",
    leafSlug: "hotels",
    summary: "Inn on the gulf in WaterColor. Fake listing.",
    tagSlugs: ["family"],
    openNow: true,
    hours: "Front desk 24 hours",
    priceBand: "$$$$",
    isStay: true,
  },
  {
    slug: "seagrove-cottage",
    name: "Seagrove Cottage",
    townSlug: "watercolor",
    areaSlug: "western-lake",
    categorySlug: "stay",
    leafSlug: "vacation-rentals",
    summary: "Fake vacation rental used for the Stay page type.",
    tagSlugs: ["family"],
    openNow: true,
    isStay: true,
  },
  {
    slug: "30a-paddle",
    name: "30A Paddle Co.",
    townSlug: "inlet-beach",
    areaSlug: "camp-creek",
    categorySlug: "things-to-do",
    leafSlug: "outdoor",
    summary: "Paddleboard and kayak outings. Fake listing.",
    tagSlugs: ["family"],
    openNow: true,
    hours: "Daily 8:00 AM – 5:00 PM",
  },
  {
    slug: "grayton-general",
    name: "Grayton General",
    townSlug: "grayton-beach",
    areaSlug: "hotz-avenue",
    categorySlug: "shopping",
    leafSlug: "specialty-retail",
    summary: "Snacks, ice, and beach goods. Fake listing.",
    tagSlugs: ["walkable"],
    openNow: true,
    hours: "Daily 8:00 AM – 8:00 PM",
    priceBand: "$",
  },
  {
    slug: "sandestin-market",
    name: "Sandestin Market",
    townSlug: "sandestin",
    areaSlug: "sandestin-village",
    categorySlug: "shopping",
    leafSlug: "specialty-retail",
    summary: "Resort-village groceries and beach goods. Fake listing.",
    tagSlugs: ["family"],
    openNow: true,
    hours: "Daily 8:00 AM – 8:00 PM",
    priceBand: "$$",
  },
  {
    slug: "gulf-place-coffee",
    name: "Gulf Place Coffee",
    townSlug: "gulf-place",
    areaSlug: "gulf-place-shops",
    categorySlug: "food-and-drink",
    leafSlug: "coffee-shops",
    summary: "Coffee by the western public beach. Fake listing.",
    tagSlugs: ["walkable"],
    openNow: true,
    hours: "Daily 7:00 AM – 2:00 PM",
    priceBand: "$",
  },
  {
    slug: "seagrove-surf",
    name: "Seagrove Surf Shop",
    townSlug: "seagrove-beach",
    areaSlug: "seagrove-shore",
    categorySlug: "things-to-do",
    leafSlug: "rentals",
    summary: "Boards and beach rentals. Fake listing.",
    tagSlugs: ["family"],
    openNow: false,
    hours: "Daily 9:00 AM – 5:00 PM",
  },
  {
    slug: "watersound-bistro",
    name: "WaterSound Bistro",
    townSlug: "watersound",
    areaSlug: "watersound-town-center",
    categorySlug: "food-and-drink",
    leafSlug: "restaurants",
    summary: "Town-center dining in WaterSound. Fake listing.",
    tagSlugs: ["family", "walkable"],
    openNow: true,
    hours: "Daily 11:00 AM – 9:00 PM",
    priceBand: "$$$",
  },
  {
    slug: "beach-cow-creamery",
    name: "Beach Cow Creamery",
    townSlug: "seacrest-beach",
    areaSlug: "seacrest-shore",
    categorySlug: "food-and-drink",
    leafSlug: "restaurants",
    summary:
      "Beach Cow Creamery serves up hand-dipped ice cream, milkshakes, and sweet treats in the heart of Peddlers Pavilion in Seacrest Beach.",
    tagSlugs: ["family"],
    openNow: true,
    address: "Peddlers Pavilion, Seacrest Beach, FL",
    hours: "Daily 11:00 AM – 9:00 PM",
    priceBand: "$$",
  },
  {
    slug: "ascension-sacred-heart-30a",
    name: "Ascension Medical Group Sacred Heart at 30A",
    townSlug: "inlet-beach",
    areaSlug: "30avenue",
    categorySlug: "community",
    leafSlug: "town-merchants",
    summary:
      "Ascension Medical Group Sacred Heart at 30A provides primary care, internal medicine, and wellness services in Inlet Beach.",
    tagSlugs: ["family"],
    openNow: true,
    address: "Inlet Beach, FL",
    hours: "Mon–Fri 8:00 AM – 5:00 PM",
  },
  {
    slug: "fiddle-haus",
    name: "Fiddle Haus",
    townSlug: "seacrest-beach",
    areaSlug: "seacrest-shore",
    categorySlug: "shopping",
    leafSlug: "boutiques",
    summary:
      "Fiddle Haus is a cozy coastal boutique at The Big Chill featuring curated women’s apparel, loungewear, home decor, and gifts.",
    tagSlugs: ["walkable"],
    openNow: true,
    address: "The Big Chill, Seacrest Beach, FL",
    hours: "Daily 10:00 AM – 6:00 PM",
    priceBand: "$$",
  },
  {
    slug: "amavida-donuts",
    name: "Amavida Donuts",
    townSlug: "seaside",
    areaSlug: "seaside-town-square",
    categorySlug: "food-and-drink",
    leafSlug: "restaurants",
    summary:
      "Handcrafted artisan donuts, specialty cold brew, and sweet treats served from a vintage food truck in Seaside’s Central Square.",
    tagSlugs: ["walkable", "family"],
    openNow: true,
    address: "Central Square, Seaside, FL",
    hours: "Daily 7:00 AM – 2:00 PM",
    priceBand: "$",
  },
];

/** Place desks (town/area) — claimable listings that own feed/events/updates for a place. Hidden from search. */
export function isPlaceDesk(biz: Pick<Business, "entityKind">) {
  return biz.entityKind === "town" || biz.entityKind === "area";
}

/** Consumer-facing directory only — excludes town/area desk entities. */
export function isSearchableBusiness(biz: Pick<Business, "entityKind">) {
  return !isPlaceDesk(biz);
}

/** One claimable town-desk listing per town (e.g. "Rosemary Beach Town Merchants"). */
export function townMerchantSlug(townSlug: string) {
  return `${townSlug}-town-merchants`;
}

export const townMerchantBusinesses: Business[] = towns.map((town) => ({
  slug: townMerchantSlug(town.slug),
  name: `${town.name} Town Merchants`,
  townSlug: town.slug,
  categorySlug: "community",
  leafSlug: "town-merchants",
  summary: `Town desk for ${town.name} — local updates, merchant coordination, and community information.`,
  tagSlugs: ["walkable"],
  openNow: true,
  entityKind: "town" as const,
  // Demo: town-manager persona (site_admin) already verifies Rosemary Beach.
  ...(town.slug === "rosemary-beach" ? { ownerUserSlug: "site_admin" } : {}),
}));

/** One claimable area-desk listing per area (neighborhood / shopping strip). */
export function areaMerchantSlug(areaSlug: string) {
  return `${areaSlug}-area-merchants`;
}

export const areaMerchantBusinesses: Business[] = areas.map((area) => ({
  slug: areaMerchantSlug(area.slug),
  name: `${area.name} Merchants`,
  townSlug: area.townSlug,
  areaSlug: area.slug,
  categorySlug: "community",
  leafSlug: "area-merchants",
  summary: `Area desk for ${area.name} — posts, events, and local updates for this ${area.kind === "shopping" ? "shopping area" : "neighborhood"}.`,
  tagSlugs: ["walkable"],
  openNow: true,
  entityKind: "area" as const,
  // Demo: town-manager already verifies Barrett Square area desk.
  ...(area.slug === "barrett-square" ? { ownerUserSlug: "site_admin" } : {}),
}));

export const businesses: Business[] = [
  ...directoryBusinesses,
  ...townMerchantBusinesses,
  ...areaMerchantBusinesses,
];

/** Directory businesses only (no town/area desks) — use for search and consumer listings. */
export const searchableBusinesses = businesses.filter(isSearchableBusiness);

export function townMerchantForTown(townSlug: string) {
  return townMerchantBusinesses.find((item) => item.townSlug === townSlug);
}

export function areaMerchantForArea(areaSlug: string) {
  return areaMerchantBusinesses.find((item) => item.areaSlug === areaSlug);
}

export const stayCategories = [
  { slug: "hotels", name: "Hotels" },
  { slug: "vacation-rentals", name: "Vacation Rentals" },
];

export const stays: Stay[] = [
  {
    slug: "the-pearl-hotel",
    name: "The Pearl Hotel",
    townSlug: "rosemary-beach",
    categorySlug: "hotels",
    summary: "Hotel rooms in the Rosemary Beach town center.",
    sleeps: 4,
    businessSlug: "the-pearl-hotel",
  },
  {
    slug: "watercolor-inn",
    name: "WaterColor Inn",
    townSlug: "watercolor",
    categorySlug: "hotels",
    summary: "Inn rooms on the gulf. Fake stay record.",
    sleeps: 4,
    businessSlug: "watercolor-inn",
  },
  {
    slug: "seagrove-cottage",
    name: "Seagrove Cottage",
    townSlug: "watercolor",
    categorySlug: "vacation-rentals",
    summary: "Fake vacation rental used to scaffold the Stay page type.",
    sleeps: 8,
    businessSlug: "seagrove-cottage",
  },
];

export const events: EventItem[] = [
  {
    slug: "alys-sunset-yoga",
    name: "Sunset yoga on the green",
    townSlug: "alys-beach",
    when: "Today, 5:30 PM",
    time: "5:30 PM – 6:30 PM",
    summary: "Drop-in yoga on the Alys Beach green. Fake event happening now.",
    venue: "Alys Beach green",
    category: "Fitness & Wellness",
    categories: ["fitness-wellness"],
    price: "Free",
    bucket: "now",
  },
  {
    slug: "sounds-of-seaside",
    name: "Sounds of Seaside Wednesday Night Concert Series",
    townSlug: "seaside",
    when: "Today, 5:00 PM",
    time: "5:00 PM – 7:00 PM",
    summary: "Live music at the Seaside Amphitheatre.",
    venue: "Seaside Amphitheatre",
    category: "Live Music",
    categories: ["live-music"],
    price: "Free",
    bucket: "today",
  },
  {
    slug: "seaside-storytime",
    name: "Storytime on the square",
    townSlug: "seaside",
    when: "Today, 10:00 AM",
    time: "10:00 AM – 10:45 AM",
    summary: "Kids stories near the amphitheatre. Fake event.",
    venue: "Seaside Town Square",
    category: "Family & Kids",
    categories: ["family-kids"],
    price: "Free",
    bucket: "today",
  },
  {
    slug: "grayton-farmers-market",
    name: "Grayton Beach Farmers Market",
    townSlug: "grayton-beach",
    when: "Saturday, 8:00 AM",
    time: "8:00 AM – 12:00 PM",
    summary: "Local produce and makers in Grayton Beach.",
    venue: "Grayton Beach town core",
    category: "Farmers Markets",
    categories: ["farmers-markets"],
    price: "Free",
    bucket: "weekend",
  },
  {
    slug: "rosemary-art-walk",
    name: "Rosemary Beach art walk",
    townSlug: "rosemary-beach",
    when: "Saturday, 6:00 PM",
    time: "6:00 PM – 8:00 PM",
    summary: "Galleries open late around Barrett Square. Fake event.",
    venue: "Barrett Square",
    category: "Arts & Culture",
    categories: ["arts-culture"],
    price: "Free",
    bucket: "weekend",
  },
  {
    slug: "pearl-porch-hour",
    name: "Porch hour at The Pearl",
    townSlug: "rosemary-beach",
    businessSlug: "the-pearl-hotel",
    when: "Friday, 5:00 PM",
    time: "5:00 PM – 6:00 PM",
    summary: "Hosted hour on the hotel porch. Fake stay event.",
    venue: "The Pearl Hotel porch",
    category: "Food & Drink",
    categories: ["food-drink"],
    price: "Free",
    bucket: "weekend",
  },
  {
    slug: "watercolor-inn-sundown",
    name: "Gulf-front sundown at the inn",
    townSlug: "watercolor",
    businessSlug: "watercolor-inn",
    when: "Tonight, 6:00 PM",
    time: "6:00 PM – 7:00 PM",
    summary: "Hosted hour on the inn lawn. Fake stay event.",
    venue: "WaterColor Inn lawn",
    category: "Community & Causes",
    categories: ["community-causes"],
    price: "Free",
    bucket: "now",
  },
  {
    slug: "harvest-wine-food",
    name: "Harvest Wine & Food Festival",
    townSlug: "watercolor",
    businessSlug: "edwards-fine-food-and-wine",
    when: "Saturday, Oct 25, 12:00 PM",
    time: "12:00 PM – 5:00 PM",
    summary: "Food and wine event used as a sample event page.",
    venue: "WaterColor Town Center",
    category: "Festivals & Markets",
    categories: ["festivals-markets", "food-drink"],
    ticketUrl: "https://example.com/harvest",
    price: "$45",
    bucket: "month",
  },
  {
    slug: "beachy-bean-cupping",
    name: "Saturday cupping at Beachy Bean",
    townSlug: "seaside",
    businessSlug: "beachy-bean-coffee",
    when: "Saturday, 9:00 AM",
    time: "9:00 AM – 10:00 AM",
    summary: "Taste this week’s roast with the baristas near the square. Fake business event.",
    venue: "Beachy Bean Coffee Co.",
    category: "Food & Drink",
    categories: ["food-drink"],
    price: "Free",
    bucket: "weekend",
  },
];

export const guides: Guide[] = [
  {
    slug: "first-timers-guide",
    title: "First Timer's Guide to 30A",
    summary: "Towns, beaches, cars, bikes, and what to know before you arrive.",
    body: "Fake guide body. Start with a town, not a hotel dump. Cars, bikes, and beach access are the first decisions.",
    categorySlug: "food-and-drink",
  },
  {
    slug: "guide-to-rosemary-beach",
    title: "The Ultimate Guide to Rosemary Beach",
    summary: "Walkability, dining, and how the town center works.",
    body: "Fake guide body. Barrett Square is the center. Most dining is walkable once you park once.",
    townSlug: "rosemary-beach",
    categorySlug: "food-and-drink",
  },
  {
    slug: "why-is-it-called-30a",
    title: "Why Is It Called 30A?",
    summary: "Short background on the scenic highway name.",
    body: "Fake guide body. 30A is the county road name for the scenic route along this stretch of coast.",
  },
  {
    slug: "finding-30a",
    title: "Finding 30A without twenty tabs",
    summary: "Compare towns first, then drill into a category.",
    body: "Fake guide body. The point of this prototype is one place to compare towns, then drill into a category.",
  },
  {
    slug: "town-vs-town",
    title: "Rosemary feels different from Grayton",
    summary: "Town character: planned and walkable vs older and looser.",
    body: "Fake guide body. Rosemary is planned and walkable. Grayton is older and looser. Both are on the same road.",
  },
];

export const updates: Update[] = [
  {
    slug: "wednesday-in-seaside",
    title: "Wednesday night concert traffic",
    body: "Sounds of Seaside fills the square. Fake town update.",
    createdAt: "2026-10-08",
    through: "2026-10-08",
    type: "business_news",
    townSlug: "seaside",
  },
  {
    slug: "market-morning-grayton",
    title: "Market morning",
    body: "Farmers market is running on the usual Thursday rhythm. Fake town update.",
    createdAt: "2026-10-07",
    through: "2026-10-11",
    type: "new_item",
    townSlug: "grayton-beach",
  },
  {
    slug: "edwards-weekend-hours",
    title: "Extended weekend hours",
    body: "Courtyard seating open later Friday and Saturday. Fake business update.",
    createdAt: "2026-10-05",
    through: "2026-10-12",
    type: "hours_change",
    townSlug: "rosemary-beach",
    businessSlug: "edwards-fine-food-and-wine",
  },
  {
    slug: "pearl-pool-closed",
    title: "Pool closed Friday",
    body: "Maintenance day. Fake business update.",
    createdAt: "2026-10-03",
    through: "2026-10-10",
    type: "hours_change",
    townSlug: "rosemary-beach",
    businessSlug: "the-pearl-hotel",
  },
  {
    slug: "watercolor-inn-beach-setups",
    title: "Beach chairs set by 9",
    body: "Gulf setups go out each morning for inn guests. Fake stay update.",
    createdAt: "2026-10-07",
    through: "2026-10-20",
    type: "new_item",
    townSlug: "watercolor",
    businessSlug: "watercolor-inn",
  },
  {
    slug: "beachy-bean-cold-brew",
    title: "New cold brew on tap",
    body: "Seasonal cold brew at the square. Fake business update.",
    createdAt: "2026-10-06",
    through: "2026-10-20",
    type: "new_item",
    townSlug: "seaside",
    businessSlug: "beachy-bean-coffee",
  },
  {
    slug: "edwards-oyster-night",
    title: "Half-price oysters Thursday",
    body: "Courtyard special this week only. Fake limited offer.",
    createdAt: "2026-10-07",
    through: "2026-10-09",
    type: "limited_offer",
    townSlug: "rosemary-beach",
    businessSlug: "edwards-fine-food-and-wine",
  },
  {
    slug: "square-pavers-weekend",
    title: "Pavers closed Friday morning",
    body: "Town square pavers get a rinse before the weekend. Fake area update.",
    createdAt: "2026-10-08",
    through: "2026-10-10",
    type: "business_news",
    areaSlug: "seaside-town-square",
  },
  {
    slug: "expired-beachy-bean-hours",
    title: "Summer hours ended",
    body: "Back to regular hours. Fake expired update — must never render publicly.",
    createdAt: "2026-09-01",
    through: "2026-09-30",
    type: "hours_change",
    townSlug: "seaside",
    businessSlug: "beachy-bean-coffee",
  },
];

export const users: User[] = [
  {
    slug: "beachlocal",
    name: "beachlocal",
    role: "local",
    bio: "East-end regular tracking coffee stops, town greens, and Timpoochee Trail tips for the next 30A outing.",
    memberSince: "2024-03-12",
  },
  {
    slug: "local_owner",
    name: "Jamie Lee",
    role: "business-owner",
    bio: "Business owner managing listings along Scenic Highway 30A.",
    memberSince: "2023-06-01",
  },
  {
    slug: "first_timer",
    name: "first_timer",
    role: "visitor",
    bio: "Fake visitor used for community questions.",
    memberSince: "2026-09-20",
  },
  {
    slug: "site_admin",
    name: "site_admin",
    role: "admin",
    bio: "Fake admin account for review-queue screens.",
    memberSince: "2022-01-01",
  },
];

export const posts: Post[] = [
  {
    slug: "sunset-on-the-square",
    authorUserSlug: "beachlocal",
    postedAs: "user",
    on: { type: "town", slug: "rosemary-beach" },
    body: "Barrett Square at sunset. Locals on the green, kids on the paths, and the last light on the cottages. This is the Rosemary I came back for.",
    createdAt: "2026-10-06",
  },
  {
    slug: "weekend-hours",
    authorBusinessSlug: "edwards-fine-food-and-wine",
    postedAs: "business",
    on: { type: "business", slug: "edwards-fine-food-and-wine" },
    body: "Posted as the business from business management. Fake feed item.",
    createdAt: "2026-10-05",
  },
  {
    slug: "loved-the-courtyard",
    authorUserSlug: "first_timer",
    postedAs: "user",
    on: { type: "business", slug: "edwards-fine-food-and-wine" },
    body: "Sat in the courtyard at dusk and it felt like a dinner party someone else planned. Get there a little early — the good tables go first.",
    createdAt: "2026-10-04",
  },
  {
    slug: "edwards-date-night",
    authorUserSlug: "beachlocal",
    postedAs: "user",
    on: { type: "business", slug: "edwards-fine-food-and-wine" },
    body: "Came back for the courtyard, stayed for the wine list. Not a review — just the easiest date-night walk from Barrett Square.",
    createdAt: "2026-10-03",
  },
  {
    slug: "latte-before-the-beach",
    authorUserSlug: "first_timer",
    postedAs: "user",
    on: { type: "business", slug: "beachy-bean-coffee" },
    body: "Grabbed a latte at Beachy Bean before the beach. Patio was already full by 8:30. Worth the wait if you want something besides hotel coffee.",
    createdAt: "2026-10-05",
  },
  {
    slug: "cowgirl-after-the-beach",
    authorUserSlug: "beachlocal",
    postedAs: "user",
    on: { type: "business", slug: "cowgirl-kitchen" },
    body: "Sandy feet, cold drinks, and a booth that still had room after the beach rush. Cowgirl Kitchen is the reset after a long morning in the gulf.",
    createdAt: "2026-10-02",
  },
  {
    slug: "pearl-porch-evening",
    authorUserSlug: "first_timer",
    postedAs: "user",
    on: { type: "stay", slug: "the-pearl-hotel" },
    body: "Porch at The Pearl at blue hour. Not a review — just the quietest five minutes of the trip before dinner on the square.",
    createdAt: "2026-10-06",
  },
  {
    slug: "watercolor-lawn-sunset",
    authorUserSlug: "beachlocal",
    postedAs: "user",
    on: { type: "stay", slug: "watercolor-inn" },
    body: "Watched the light go pink on the WaterColor Inn lawn. Bring a sweater. The gulf breeze picks up fast once the sun drops.",
    createdAt: "2026-10-05",
  },
  {
    slug: "cottage-bikes-morning",
    authorUserSlug: "first_timer",
    postedAs: "user",
    on: { type: "stay", slug: "seagrove-cottage" },
    body: "Bikes from the cottage to the trail before anyone else was up. Seagrove Cottage is a home base, not a hotel — pack like you mean it.",
    createdAt: "2026-10-03",
  },
  {
    slug: "seaside-wednesday",
    authorUserSlug: "beachlocal",
    postedAs: "user",
    on: { type: "town", slug: "seaside" },
    body: "Wednesday concert night on the Seaside green. Bring a blanket and claim a spot early if you want to see the stage.",
    createdAt: "2026-10-01",
  },
];

export const photos: Photo[] = [
  {
    slug: "barrett-square-green",
    caption: "Barrett Square green",
    attachedTo: { type: "town", slug: "rosemary-beach" },
  },
  {
    slug: "rosemary-street",
    caption: "Town center street",
    attachedTo: { type: "town", slug: "rosemary-beach" },
  },
  {
    slug: "seaside-amphitheatre",
    caption: "Amphitheatre",
    attachedTo: { type: "town", slug: "seaside" },
  },
  {
    slug: "edwards-courtyard",
    caption: "Courtyard seating",
    attachedTo: { type: "business", slug: "edwards-fine-food-and-wine" },
  },
  {
    slug: "edwards-plate",
    caption: "Plate from the courtyard",
    attachedTo: { type: "business", slug: "edwards-fine-food-and-wine" },
  },
  {
    slug: "beachy-bean-counter",
    caption: "Espresso counter",
    attachedTo: { type: "business", slug: "beachy-bean-coffee" },
  },
  {
    slug: "beachy-bean-patio",
    caption: "Patio near the square",
    attachedTo: { type: "business", slug: "beachy-bean-coffee" },
  },
  {
    slug: "beachy-bean-pastries",
    caption: "Morning pastry case",
    attachedTo: { type: "business", slug: "beachy-bean-coffee" },
  },
  {
    slug: "beachy-bean-latte",
    caption: "Latte art",
    attachedTo: { type: "business", slug: "beachy-bean-coffee" },
  },
  {
    slug: "pearl-lobby",
    caption: "Hotel lobby",
    attachedTo: { type: "business", slug: "the-pearl-hotel" },
  },
  {
    slug: "concert-night",
    caption: "Wednesday concert",
    attachedTo: { type: "event", slug: "sounds-of-seaside" },
  },
  {
    slug: "barrett-area",
    caption: "Square edge shops",
    attachedTo: { type: "area", slug: "barrett-square" },
  },
  {
    slug: "loved-courtyard-lights",
    caption: "Courtyard string lights",
    attachedTo: { type: "post", slug: "loved-the-courtyard" },
  },
  {
    slug: "loved-courtyard-table",
    caption: "Table in the courtyard",
    attachedTo: { type: "post", slug: "loved-the-courtyard" },
  },
  {
    slug: "edwards-night-glass",
    caption: "Wine on the patio",
    attachedTo: { type: "post", slug: "edwards-date-night" },
  },
  {
    slug: "beachy-bean-to-go",
    caption: "Latte for the walk",
    attachedTo: { type: "post", slug: "latte-before-the-beach" },
  },
  {
    slug: "cowgirl-booth-snap",
    caption: "Booth after the beach",
    attachedTo: { type: "post", slug: "cowgirl-after-the-beach" },
  },
  {
    slug: "pearl-porch-snap",
    caption: "Porch at blue hour",
    attachedTo: { type: "post", slug: "pearl-porch-evening" },
  },
  {
    slug: "watercolor-lawn-snap",
    caption: "Inn lawn at dusk",
    attachedTo: { type: "post", slug: "watercolor-lawn-sunset" },
  },
  {
    slug: "cottage-bikes-snap",
    caption: "Bikes by the cottage",
    attachedTo: { type: "post", slug: "cottage-bikes-morning" },
  },
  {
    slug: "sunset-square-snap",
    caption: "Last light on the square",
    attachedTo: { type: "post", slug: "sunset-on-the-square" },
  },
  {
    slug: "seaside-green-snap",
    caption: "Blanket on the green",
    attachedTo: { type: "post", slug: "seaside-wednesday" },
  },
];

export const videos: Video[] = [
  {
    slug: "rosemary-beach-walk",
    title: "A walk through Rosemary Beach",
    youtubeUrl: "https://www.youtube.com/watch?v=30ARosemary",
    attachedTo: { type: "town", slug: "rosemary-beach" },
  },
  {
    slug: "seaside-square",
    title: "Seaside town square",
    youtubeUrl: "https://youtu.be/30ASeaside1",
    attachedTo: { type: "town", slug: "seaside" },
  },
  {
    slug: "edwards-courtyard-reel",
    title: "Courtyard dinner at Edward's",
    youtubeUrl: "https://www.youtube.com/watch?v=Edwards30A1",
    attachedTo: { type: "business", slug: "edwards-fine-food-and-wine" },
  },
  {
    slug: "pearl-stay-tour",
    title: "Tour of The Pearl Hotel",
    youtubeUrl: "https://www.youtube.com/watch?v=PearlStay30",
    attachedTo: { type: "stay", slug: "the-pearl-hotel" },
  },
  {
    slug: "watercolor-inn-lawn",
    title: "Sunset on the WaterColor Inn lawn",
    youtubeUrl: "https://www.youtube.com/watch?v=WaterColr30",
    attachedTo: { type: "stay", slug: "watercolor-inn" },
  },
];

export const questions: Question[] = [
  {
    slug: "parking-near-seaside",
    title: "Best beach access with parking near Seaside?",
    body: "Fake community question. Looking for a public access that still has spaces after 10am near Seaside.",
    authorUserSlug: "first_timer",
    townSlug: "seaside",
    createdAt: "2026-10-06",
  },
  {
    slug: "golf-carts-rosemary",
    title: "Are golf carts allowed in Rosemary Beach?",
    body: "Fake community question about local rules in Rosemary Beach.",
    authorUserSlug: "beachlocal",
    townSlug: "rosemary-beach",
    createdAt: "2026-10-04",
  },
  {
    slug: "kids-dinner-watercolor",
    title: "Where do families eat early in WaterColor?",
    body: "Fake community question. Need a 5pm table with kids near WaterColor Town Center.",
    authorUserSlug: "first_timer",
    townSlug: "watercolor",
    createdAt: "2026-10-03",
  },
  {
    slug: "bike-path-grayton",
    title: "Is the Timpoochee Trail easy from Grayton Beach?",
    body: "Fake community question about biking from Grayton Beach toward Seaside.",
    authorUserSlug: "beachlocal",
    townSlug: "grayton-beach",
    createdAt: "2026-10-01",
  },
];

export const comments: Comment[] = [
  {
    slug: "parking-reply-1",
    body: "We used the county access west of the square after 10 and still found a space. Earlier is easier on concert Wednesdays.",
    authorUserSlug: "beachlocal",
    on: { type: "question", slug: "parking-near-seaside" },
  },
  {
    slug: "golf-carts-reply-1",
    body: "Carts are limited on the town streets. Check the current Rosemary Beach LSV rules before you rent.",
    authorUserSlug: "local_owner",
    on: { type: "question", slug: "golf-carts-rosemary" },
  },
  {
    slug: "golf-carts-reply-2",
    body: "We skipped the cart and walked Barrett Square. Easier than hunting a legal overnight spot.",
    authorUserSlug: "first_timer",
    on: { type: "question", slug: "golf-carts-rosemary" },
  },
  {
    slug: "guide-reply-1",
    body: "Fake comment on the first-timer guide.",
    authorUserSlug: "first_timer",
    on: { type: "guide", slug: "first-timers-guide" },
  },
  {
    slug: "post-reply-1",
    body: "Fake comment on a feed post.",
    authorUserSlug: "local_owner",
    on: { type: "post", slug: "sunset-on-the-square" },
  },
];

export const answers: Answer[] = [
  {
    slug: "parking-ai-instant",
    questionSlug: "parking-near-seaside",
    kind: "ai_instant",
    body: "For parking after 10am near Seaside, use a Walton County public access rather than a marked guest-only path. Those lots have restrooms and, in season, lifeguards.",
    createdAt: "2026-10-06",
  },
  {
    slug: "parking-ai-followup",
    questionSlug: "parking-near-seaside",
    kind: "ai_followup",
    body: "The lots closest to the square fill first. The county access west of the amphitheatre is the more reliable leftover, especially on Wednesday concert nights.",
    createdAt: "2026-10-06",
  },
  {
    slug: "parking-guide",
    questionSlug: "parking-near-seaside",
    kind: "local_guide",
    body: "Prefer Walton County regional accesses when you need parking, restrooms, and seasonal lifeguards. Guest-only paths may be marked private.",
    createdAt: "2026-10-06",
    authorUserSlug: "site_admin",
  },
  {
    slug: "carts-ai-instant",
    questionSlug: "golf-carts-rosemary",
    kind: "ai_instant",
    body: "Golf carts and LSVs are limited on Rosemary Beach streets. Do not assume a rental can roll the town center or park overnight.",
    createdAt: "2026-10-04",
  },
  {
    slug: "carts-ai-followup",
    questionSlug: "golf-carts-rosemary",
    kind: "ai_followup",
    body: "Which streets allow carts and where overnight parking is legal changes. Ask the host or town desk before you rent.",
    createdAt: "2026-10-04",
  },
  {
    slug: "carts-guide",
    questionSlug: "golf-carts-rosemary",
    kind: "local_guide",
    body: "Rosemary Beach treats carts as a privilege, not a default. Walk Barrett Square unless your host has a posted LSV plan.",
    createdAt: "2026-10-04",
    authorUserSlug: "site_admin",
  },
  {
    slug: "kids-ai-instant",
    questionSlug: "kids-dinner-watercolor",
    kind: "ai_instant",
    body: "For a 5pm table with kids near WaterColor Town Center, look at the inn lawn and town-center kitchens that open early — not the later dining rooms.",
    createdAt: "2026-10-03",
  },
  {
    slug: "kids-ai-followup",
    questionSlug: "kids-dinner-watercolor",
    kind: "ai_followup",
    body: "Walk-in is easier at 5 than 7. If the town center is slammed, the inn and nearby casual spots usually still have a high-top or patio.",
    createdAt: "2026-10-03",
  },
  {
    slug: "kids-guide",
    questionSlug: "kids-dinner-watercolor",
    kind: "local_guide",
    body: "Aim for 5pm in the town center or at the inn. Call ahead on weekends — early family tables go first.",
    createdAt: "2026-10-03",
    authorUserSlug: "site_admin",
  },
  {
    slug: "bike-ai-instant",
    questionSlug: "bike-path-grayton",
    kind: "ai_instant",
    body: "Yes — the Timpoochee Trail is the easy bike link from Grayton Beach toward Seaside. Stay on the marked path and watch carts at crossings.",
    createdAt: "2026-10-01",
  },
  {
    slug: "bike-ai-followup",
    questionSlug: "bike-path-grayton",
    kind: "ai_followup",
    body: "The trail is mostly flat. Give yourself extra time around Grayton’s tighter streets before you merge onto the path.",
    createdAt: "2026-10-01",
  },
  {
    slug: "bike-guide",
    questionSlug: "bike-path-grayton",
    kind: "local_guide",
    body: "The Timpoochee Trail is the right move from Grayton toward Seaside. Rent in town, skip 30A traffic, and stay off the dunes.",
    createdAt: "2026-10-01",
    authorUserSlug: "site_admin",
  },
];

export const reactions: Reaction[] = [
  { slug: "r1", label: "up", count: 4, on: { type: "question", slug: "parking-near-seaside" } },
  { slug: "r2", label: "heart", count: 2, on: { type: "question", slug: "parking-near-seaside" } },
  { slug: "r3", label: "wow", count: 1, on: { type: "question", slug: "parking-near-seaside" } },
  { slug: "r4", label: "up", count: 3, on: { type: "answer", slug: "parking-reply-1" } },
  { slug: "r5", label: "heart", count: 1, on: { type: "answer", slug: "parking-reply-1" } },
  { slug: "r6", label: "up", count: 6, on: { type: "guide", slug: "first-timers-guide" } },
  { slug: "r7", label: "heart", count: 3, on: { type: "post", slug: "sunset-on-the-square" } },
  { slug: "r8", label: "heart", count: 5, on: { type: "post", slug: "loved-the-courtyard" } },
  { slug: "r9", label: "up", count: 2, on: { type: "post", slug: "loved-the-courtyard" } },
  { slug: "r10", label: "heart", count: 4, on: { type: "post", slug: "pearl-porch-evening" } },
  { slug: "r11", label: "heart", count: 4, on: { type: "guide", slug: "first-timers-guide" } },
  { slug: "r12", label: "wow", count: 1, on: { type: "guide", slug: "first-timers-guide" } },
  { slug: "r13", label: "heart", count: 7, on: { type: "guide", slug: "guide-to-rosemary-beach" } },
  { slug: "r14", label: "up", count: 2, on: { type: "guide", slug: "guide-to-rosemary-beach" } },
  { slug: "r15", label: "up", count: 5, on: { type: "guide", slug: "why-is-it-called-30a" } },
  { slug: "r16", label: "heart", count: 3, on: { type: "guide", slug: "finding-30a" } },
  { slug: "r17", label: "up", count: 1, on: { type: "guide", slug: "finding-30a" } },
  { slug: "r18", label: "heart", count: 8, on: { type: "business", slug: "beach-cow-creamery" } },
  { slug: "r19", label: "up", count: 3, on: { type: "business", slug: "beach-cow-creamery" } },
  { slug: "r20", label: "up", count: 4, on: { type: "business", slug: "ascension-sacred-heart-30a" } },
  { slug: "r21", label: "heart", count: 6, on: { type: "business", slug: "fiddle-haus" } },
  { slug: "r22", label: "wow", count: 2, on: { type: "business", slug: "fiddle-haus" } },
  { slug: "r23", label: "heart", count: 11, on: { type: "business", slug: "amavida-donuts" } },
  { slug: "r24", label: "up", count: 4, on: { type: "business", slug: "amavida-donuts" } },
  { slug: "r25", label: "wow", count: 1, on: { type: "business", slug: "amavida-donuts" } },
  { slug: "r26", label: "heart", count: 9, on: { type: "stay", slug: "the-pearl-hotel" } },
  { slug: "r27", label: "up", count: 2, on: { type: "stay", slug: "the-pearl-hotel" } },
  { slug: "r28", label: "heart", count: 5, on: { type: "stay", slug: "watercolor-inn" } },
  { slug: "r29", label: "wow", count: 1, on: { type: "stay", slug: "watercolor-inn" } },
  { slug: "r30", label: "up", count: 3, on: { type: "stay", slug: "seagrove-cottage" } },
  { slug: "r31", label: "heart", count: 2, on: { type: "stay", slug: "seagrove-cottage" } },
  { slug: "r32", label: "up", count: 8, on: { type: "event", slug: "grayton-farmers-market" } },
  { slug: "r33", label: "heart", count: 3, on: { type: "event", slug: "grayton-farmers-market" } },
  { slug: "r34", label: "heart", count: 12, on: { type: "event", slug: "sounds-of-seaside" } },
  { slug: "r35", label: "wow", count: 4, on: { type: "event", slug: "sounds-of-seaside" } },
  { slug: "r36", label: "up", count: 2, on: { type: "event", slug: "sounds-of-seaside" } },
  { slug: "r37", label: "heart", count: 6, on: { type: "event", slug: "seaside-storytime" } },
  { slug: "r38", label: "up", count: 2, on: { type: "event", slug: "seaside-storytime" } },
  { slug: "r39", label: "heart", count: 4, on: { type: "event", slug: "alys-sunset-yoga" } },
  { slug: "r40", label: "wow", count: 1, on: { type: "event", slug: "alys-sunset-yoga" } },
  { slug: "r41", label: "heart", count: 14, on: { type: "town", slug: "seaside" } },
  { slug: "r42", label: "up", count: 6, on: { type: "town", slug: "seaside" } },
  { slug: "r43", label: "wow", count: 2, on: { type: "town", slug: "seaside" } },
  { slug: "r44", label: "heart", count: 11, on: { type: "town", slug: "rosemary-beach" } },
  { slug: "r45", label: "up", count: 4, on: { type: "town", slug: "rosemary-beach" } },
  { slug: "r46", label: "heart", count: 9, on: { type: "town", slug: "alys-beach" } },
  { slug: "r47", label: "wow", count: 3, on: { type: "town", slug: "alys-beach" } },
  { slug: "r48", label: "up", count: 7, on: { type: "town", slug: "grayton-beach" } },
  { slug: "r49", label: "heart", count: 5, on: { type: "town", slug: "grayton-beach" } },
  { slug: "r50", label: "heart", count: 8, on: { type: "town", slug: "watercolor" } },
  { slug: "r51", label: "up", count: 3, on: { type: "town", slug: "watercolor" } },
  { slug: "r52", label: "heart", count: 6, on: { type: "town", slug: "seagrove-beach" } },
  { slug: "r53", label: "up", count: 2, on: { type: "town", slug: "watersound" } },
  { slug: "r54", label: "heart", count: 4, on: { type: "town", slug: "inlet-beach" } },
  { slug: "r55", label: "up", count: 5, on: { type: "town", slug: "sandestin" } },
  { slug: "r56", label: "heart", count: 3, on: { type: "town", slug: "blue-mountain-beach" } },
];

export const tags: Tag[] = [
  { slug: "family", name: "Family" },
  { slug: "walkable", name: "Walkable" },
  { slug: "live-music", name: "Live music" },
  { slug: "first-timer", name: "First timer" },
];

export const favorites: Favorite[] = [
  { userSlug: "beachlocal", type: "business", slug: "edwards-fine-food-and-wine" },
  { userSlug: "beachlocal", type: "event", slug: "sounds-of-seaside" },
  { userSlug: "beachlocal", type: "guide", slug: "first-timers-guide" },
  { userSlug: "beachlocal", type: "town", slug: "rosemary-beach" },
];

export const reviewQueue: ReviewQueueItem[] = [
  {
    slug: "rq-business-1",
    kind: "business",
    targetSlug: "grayton-bike-co",
    status: "pending",
  },
  {
    slug: "rq-event-1",
    kind: "event",
    targetSlug: "harvest-wine-food",
    status: "pending",
  },
];

export const seoOverrides: SeoOverride[] = [
  {
    slug: "seo-home",
    path: "/",
    title: "WhereTo30A: 30A Travel Guide (fake)",
    description: "Wireframe SEO override example for the homepage.",
  },
];

export const knowledge: KnowledgeItem[] = [
  {
    slug: "public-beach-access",
    title: "Does 30A have public beaches?",
    body: "Fake knowledge item. Public access exists; many neighborhood beaches are private.",
  },
  {
    slug: "golf-carts",
    title: "Golf cart rules",
    body: "Fake knowledge item. Rules vary by town. Check the town page before renting.",
  },
];

export function townBySlug(slug: string) {
  return towns.find((item) => item.slug === slug);
}

export function areaBySlug(slug: string) {
  return areas.find((item) => item.slug === slug);
}

export function categoryBySlug(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function leafBySlugs(categorySlug: string, leafSlug: string) {
  return categoryBySlug(categorySlug)?.leaves.find((leaf) => leaf.slug === leafSlug);
}

export function businessBySlug(slug: string) {
  return businesses.find((item) => item.slug === slug);
}

export function stayBySlug(slug: string) {
  return stays.find((item) => item.slug === slug);
}

export function stayCategoryBySlug(slug: string) {
  return stayCategories.find((item) => item.slug === slug);
}

export function staysForTown(townSlug: string) {
  return stays.filter((item) => item.townSlug === townSlug);
}

export function eventBySlug(slug: string) {
  return events.find((item) => item.slug === slug);
}

export function updateBySlug(slug: string) {
  return updates.find((item) => item.slug === slug);
}

export function liveUpdates(list: Update[] = updates) {
  const today = "2026-10-08";
  return list.filter((item) => item.through >= today).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function guideBySlug(slug: string) {
  return guides.find((item) => item.slug === slug);
}

export function userBySlug(slug: string) {
  return users.find((item) => item.slug === slug);
}

export function questionBySlug(slug: string) {
  return questions.find((item) => item.slug === slug);
}

export function postBySlug(slug: string) {
  return posts.find((item) => item.slug === slug);
}

export function tagBySlug(slug: string) {
  return tags.find((item) => item.slug === slug);
}

export function businessesForTown(townSlug: string) {
  return searchableBusinesses.filter((item) => item.townSlug === townSlug);
}

export function areasForTown(townSlug: string) {
  return areas.filter((item) => item.townSlug === townSlug);
}

export function businessesForArea(areaSlug: string) {
  return searchableBusinesses.filter((item) => item.areaSlug === areaSlug);
}

export function areaKindLabel(kind: Area["kind"]) {
  return kind === "shopping" ? "Shopping area" : "Neighborhood";
}

/** An update renders publicly only when it belongs to a business, town, or area. */
export function isTiedUpdate(update: Update) {
  return Boolean(update.businessSlug || update.areaSlug || update.townSlug);
}

/**
 * Town announcements (town-only, no business/area host) plus updates from
 * businesses that sit in this town. Area announcements stay on the area page.
 */
export function updatesForTown(townSlug: string) {
  return updates.filter((item) => {
    if (!isTiedUpdate(item)) return false;
    if (item.businessSlug) {
      return businessBySlug(item.businessSlug)?.townSlug === townSlug;
    }
    if (item.areaSlug) return false;
    return item.townSlug === townSlug;
  });
}

/**
 * Area announcements plus updates from businesses in this area.
 * Town-wide announcements do not inherit onto area pages.
 */
export function updatesForArea(areaSlug: string) {
  return updates.filter((item) => {
    if (!isTiedUpdate(item)) return false;
    if (item.businessSlug) {
      return businessBySlug(item.businessSlug)?.areaSlug === areaSlug;
    }
    return item.areaSlug === areaSlug;
  });
}

export function updatesForBusiness(businessSlug: string) {
  return updates.filter((item) => item.businessSlug === businessSlug);
}

export function eventsForBusiness(businessSlug: string) {
  return events.filter((item) => item.businessSlug === businessSlug);
}

/** Composer or claim flow scoped to one entity — never a generic /updates destination. */
export function updateSharePath(kind: "business" | "town" | "area", slug: string) {
  if (kind === "business") {
    const biz = businessBySlug(slug);
    return biz?.ownerUserSlug ? `/dashboard/${biz.slug}/feed` : "/dashboard";
  }
  if (kind === "town") {
    const desk = townMerchantForTown(slug);
    return desk?.ownerUserSlug
      ? `/dashboard/${desk.slug}/feed`
      : `/dashboard?share=update&town=${slug}`;
  }
  const desk = areaMerchantForArea(slug);
  return desk?.ownerUserSlug
    ? `/dashboard/${desk.slug}/feed`
    : `/dashboard?share=update&area=${slug}`;
}

export function businessesForLeaf(leafSlug: string) {
  return searchableBusinesses.filter((item) => item.leafSlug === leafSlug);
}

export function postsFor(type: Post["on"]["type"], slug: string) {
  return posts.filter((item) => item.on.type === type && item.on.slug === slug);
}

function uniqueBySlug<T extends { slug: string }>(list: T[]) {
  const seen = new Set<string>();
  return list.filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

export function visitorPostsFor(type: Post["on"]["type"], slug: string) {
  return postsFor(type, slug)
    .filter((item) => item.postedAs === "user")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function visitorPostsAboutBusiness(slug: string) {
  const linkedStay = stayBySlug(slug) ?? stays.find((item) => item.businessSlug === slug);
  return uniqueBySlug([
    ...visitorPostsFor("business", slug),
    ...(linkedStay ? visitorPostsFor("stay", linkedStay.slug) : []),
  ]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function visitorPostsAboutStay(stay: Stay) {
  return uniqueBySlug([
    ...visitorPostsFor("stay", stay.slug),
    ...(stay.businessSlug ? visitorPostsFor("business", stay.businessSlug) : []),
  ]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function visitorPostsAboutTown(slug: string) {
  return visitorPostsFor("town", slug);
}

export function communityPhotosForPosts(list: Post[]) {
  const slugs = new Set(list.map((item) => item.slug));
  return photos.filter((item) => item.attachedTo.type === "post" && slugs.has(item.attachedTo.slug));
}

export function photosFor(
  type: Photo["attachedTo"]["type"],
  slug: string,
) {
  return photos.filter((item) => item.attachedTo.type === type && item.attachedTo.slug === slug);
}

export function videosFor(type: Video["attachedTo"]["type"], slug: string) {
  return videos.filter((item) => item.attachedTo.type === type && item.attachedTo.slug === slug);
}

export function reactionsFor(type: Reaction["on"]["type"], slug: string) {
  return reactions.filter((item) => item.on.type === type && item.on.slug === slug);
}

export function commentsFor(type: Comment["on"]["type"], slug: string) {
  return comments.filter((item) => item.on.type === type && item.on.slug === slug);
}

export function answersForQuestion(slug: string) {
  return answers.filter((item) => item.questionSlug === slug);
}

export function currentUser() {
  return userBySlug(currentUserSlug);
}

export function businessesOwnedBy(userSlug: string) {
  return businesses.filter((item) => item.ownerUserSlug === userSlug);
}

export function allLeaves() {
  return categories.flatMap((group) =>
    group.leaves.map((leaf) => ({
      ...leaf,
      groupSlug: group.slug,
      groupName: group.name,
    })),
  );
}

export function leafBySlug(slug: string) {
  return allLeaves().find((leaf) => leaf.slug === slug);
}

export function listingMeta(item: Business) {
  const town = townBySlug(item.townSlug)?.name ?? item.townSlug;
  const tags = item.tagSlugs.map((slug) => tagBySlug(slug)?.name ?? slug).join(", ");
  const open = item.openNow ? "open now" : "closed";
  return `${item.leafSlug} · ${town} · ${open}${tags ? ` · ${tags}` : ""}`;
}

export function faqsForStay(stay: Stay) {
  const town = townBySlug(stay.townSlug);
  const listing = stay.businessSlug ? businessBySlug(stay.businessSlug) : undefined;
  const inn = /hotel|inn/i.test(stay.name);
  return [
    {
      q: "Are golf carts allowed for getting to the beach from this stay?",
      a: town
        ? `Cart rules differ by town center. Ask the host for the latest ${town.name} LSV guidance and where overnight parking is allowed.`
        : "Cart rules differ by town center. Ask your host for the latest LSV guidance and where overnight parking is allowed.",
    },
    {
      q: "Where should I park?",
      a: listing?.address
        ? `Use posted guest parking at ${listing.address}. Overflow uses nearby ${town?.name ?? "30A"} lots.`
        : town
          ? `Use posted ${town.name} lots or the property’s guest spaces. Confirm with the host before arrival.`
          : "Use posted town lots or the property’s guest spaces. Confirm with the host before arrival.",
    },
    {
      q: "How close is the beach?",
      a: inn
        ? "This inn sits on or near the gulf — check the map pin for the nearest public walkover versus guest-only paths."
        : `Most ${town?.name ?? "30A"} stays sit a short walk or golf-cart hop from a public walkover.`,
    },
    {
      q: `Does ${stay.name} sleep a full family?`,
      a: `This stay sleeps ${stay.sleeps}. Ask the host about beds, cribs, and extra linens before you lock dates.`,
    },
  ];
}

export function faqsForBusiness(business: Business) {
  const town = townBySlug(business.townSlug);
  return [
    {
      q: "Is there outdoor seating?",
      a: business.tagSlugs.includes("walkable")
        ? "Yes — patio or courtyard seating is part of the local vibe here."
        : "Ask the host on arrival; many 30A spots rotate patio tables seasonally.",
    },
    {
      q: "Any dietary or dairy-free options?",
      a: "Most corridor cafes and kitchens can guide dairy-free and gluten-aware picks — confirm at the counter.",
    },
    {
      q: "Where should I park or bike?",
      a: town
        ? `Use posted ${town.name} lots, or roll up on the Timpoochee Trail when bike racks are available.`
        : "Use posted town lots or the Timpoochee Trail bike racks nearby.",
    },
    {
      q: "How close is the beach?",
      a: "Most 30A outposts sit a short walk or golf-cart hop from a public walkover — check the map pin for the nearest access.",
    },
  ];
}

export function mentionsForBusiness(business: Pick<Business, "slug" | "name">) {
  const name = business.name.toLowerCase();
  const first = business.name.split(/\s+/)[0]?.toLowerCase() ?? "";
  const postHits = visitorPostsAboutBusiness(business.slug);
  const questionHits = questions.filter((item) => {
    const hay = `${item.title} ${item.body}`.toLowerCase();
    return hay.includes(name) || (first.length > 3 && hay.includes(first));
  });
  return [
    ...postHits.map((item) => ({
      kind: "Community post" as const,
      excerpt: item.body,
      time: item.createdAt,
      username: userBySlug(item.authorUserSlug ?? "")?.name ?? "a visitor",
      href: `/posts/${item.slug}`,
    })),
    ...questionHits.map((item) => ({
      kind: "Ask thread" as const,
      excerpt: item.title,
      time: item.createdAt,
      username: userBySlug(item.authorUserSlug)?.name ?? "a visitor",
      href: `/ask/${item.slug}`,
    })),
  ];
}

export function guideMentionsForBusiness(business: Pick<Business, "name" | "townSlug">) {
  const name = business.name.toLowerCase();
  const first = business.name.split(/\s+/)[0]?.toLowerCase() ?? "";
  return guides.filter((guide) => {
    if (guide.townSlug && guide.townSlug === business.townSlug) return true;
    const hay = `${guide.title} ${guide.summary} ${guide.body}`.toLowerCase();
    return hay.includes(name) || (first.length > 3 && hay.includes(first));
  });
}

export function profileStrength(business: Business) {
  const checks = [
    { label: "Contact details", done: Boolean(business.phone || business.website) },
    { label: "Hours", done: Boolean(business.hours) },
    { label: "Address", done: Boolean(business.address) },
    { label: "Photos", done: photosFor("business", business.slug).length > 0 },
    { label: "Summary", done: Boolean(business.summary) },
  ];
  const done = checks.filter((item) => item.done).length;
  return {
    checks,
    percent: Math.round((done / checks.length) * 100),
  };
}
