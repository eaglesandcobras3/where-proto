import type {
  Area,
  Business,
  Category,
  Comment,
  EventItem,
  Favorite,
  Guide,
  KnowledgeItem,
  Story,
  Photo,
  Post,
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

export const currentUserSlug = "kelley";

export const towns: Town[] = [
  {
    slug: "rosemary-beach",
    name: "Rosemary Beach",
    summary: "Walkable town center, European-inspired streets, Barrett Square.",
    walkability: "Walkable",
    beachAccess: "Private for guests and residents",
    areaSlugs: ["barrett-square", "east-rosemary", "north-rosemary"],
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
    slug: "alys-beach",
    name: "Alys Beach",
    summary: "White Mediterranean-inspired architecture and a quieter pace.",
    walkability: "Walkable",
    beachAccess: "Private for guests and residents",
    areaSlugs: ["alys-town-center", "caliza-courtyard"],
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
    slug: "inlet-beach",
    name: "Inlet Beach",
    summary: "Eastern end of 30A with 30Avenue shops and dining.",
    walkability: "Mixed",
    beachAccess: "Public access points",
    areaSlugs: ["30avenue", "camp-creek"],
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
];

export const businesses: Business[] = [
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
    ownerUserSlug: "brett",
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
    ownerUserSlug: "brett",
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
    ownerUserSlug: "brett",
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
];

export const stays: Stay[] = [
  {
    slug: "the-pearl-hotel",
    name: "The Pearl Hotel",
    townSlug: "rosemary-beach",
    summary: "Hotel rooms in the Rosemary Beach town center.",
    sleeps: 4,
    businessSlug: "the-pearl-hotel",
  },
  {
    slug: "watercolor-inn",
    name: "WaterColor Inn",
    townSlug: "watercolor",
    summary: "Inn rooms on the gulf. Fake stay record.",
    sleeps: 4,
    businessSlug: "watercolor-inn",
  },
  {
    slug: "seagrove-cottage",
    name: "Seagrove Cottage",
    townSlug: "watercolor",
    summary: "Fake vacation rental used to scaffold the Stay page type.",
    sleeps: 8,
    businessSlug: "seagrove-cottage",
  },
];

export const events: EventItem[] = [
  {
    slug: "sounds-of-seaside",
    name: "Sounds of Seaside Wednesday Night Concert Series",
    townSlug: "seaside",
    when: "Every Wednesday, 5:00 PM",
    summary: "Live music at the Seaside Amphitheatre.",
    venue: "Seaside Amphitheatre",
  },
  {
    slug: "grayton-farmers-market",
    name: "Grayton Beach Farmers Market",
    townSlug: "grayton-beach",
    when: "Every Thursday morning",
    summary: "Local produce and makers in Grayton Beach.",
    venue: "Grayton Beach town core",
  },
  {
    slug: "harvest-wine-food",
    name: "Harvest Wine & Food Festival",
    townSlug: "watercolor",
    businessSlug: "edwards-fine-food-and-wine",
    when: "Saturday, 12:00 PM",
    summary: "Food and wine event used as a sample event page.",
    venue: "WaterColor Town Center",
  },
];

export const guides: Guide[] = [
  {
    slug: "first-timers-guide",
    title: "First Timer's Guide to 30A",
    summary: "Towns, beaches, cars, bikes, and what to know before you arrive.",
    body: "Fake guide body. Start with a town, not a hotel dump. Cars, bikes, and beach access are the first decisions.",
  },
  {
    slug: "guide-to-rosemary-beach",
    title: "The Ultimate Guide to Rosemary Beach",
    summary: "Walkability, dining, and how the town center works.",
    body: "Fake guide body. Barrett Square is the center. Most dining is walkable once you park once.",
    townSlug: "rosemary-beach",
  },
  {
    slug: "why-is-it-called-30a",
    title: "Why Is It Called 30A?",
    summary: "Short background on the scenic highway name.",
    body: "Fake guide body. 30A is the county road name for the scenic route along this stretch of coast.",
  },
];

export const updates: Update[] = [
  {
    slug: "wednesday-in-seaside",
    title: "Wednesday night concert traffic",
    body: "Sounds of Seaside fills the square. Fake town update.",
    createdAt: "2026-10-08",
    townSlug: "seaside",
  },
  {
    slug: "market-morning-grayton",
    title: "Market morning",
    body: "Farmers market is running on the usual Thursday rhythm. Fake town update.",
    createdAt: "2026-10-07",
    townSlug: "grayton-beach",
  },
  {
    slug: "edwards-weekend-hours",
    title: "Extended weekend hours",
    body: "Courtyard seating open later Friday and Saturday. Fake business update.",
    createdAt: "2026-10-05",
    townSlug: "rosemary-beach",
    businessSlug: "edwards-fine-food-and-wine",
  },
  {
    slug: "pearl-pool-closed",
    title: "Pool closed Friday",
    body: "Maintenance day. Fake business update.",
    createdAt: "2026-10-03",
    townSlug: "rosemary-beach",
    businessSlug: "the-pearl-hotel",
  },
];

export const stories: Story[] = [
  {
    slug: "finding-30a",
    title: "Finding 30A without twenty tabs",
    summary: "Fake story used to scaffold /story/{story}.",
    body: "Fake story body. The point of this prototype is one place to compare towns, then drill into a category.",
  },
  {
    slug: "town-vs-town",
    title: "Rosemary feels different from Grayton",
    summary: "Fake story about town character.",
    body: "Fake story body. Rosemary is planned and walkable. Grayton is older and looser. Both are on the same road.",
  },
];

export const users: User[] = [
  {
    slug: "kelley",
    name: "Kelley",
    role: "local",
    bio: "Fake signed-in user for profile, favorites, and posts.",
  },
  {
    slug: "brett",
    name: "Brett",
    role: "business-owner",
    bio: "Fake business owner used on manage-my-business screens.",
  },
  {
    slug: "alex",
    name: "Alex",
    role: "visitor",
    bio: "Fake visitor used for community questions.",
  },
  {
    slug: "admin",
    name: "Admin",
    role: "admin",
    bio: "Fake admin account for review-queue screens.",
  },
];

export const posts: Post[] = [
  {
    slug: "sunset-on-the-square",
    authorUserSlug: "kelley",
    postedAs: "user",
    on: { type: "town", slug: "rosemary-beach" },
    body: "Posted as a user on the Rosemary Beach town page. Fake feed item.",
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
    authorUserSlug: "alex",
    postedAs: "user",
    on: { type: "business", slug: "edwards-fine-food-and-wine" },
    body: "User mention on a business page. Fake feed item for the mentions screen.",
    createdAt: "2026-10-04",
  },
  {
    slug: "seaside-wednesday",
    authorUserSlug: "kelley",
    postedAs: "user",
    on: { type: "town", slug: "seaside" },
    body: "Posted as a user on the Seaside town page. Fake feed item.",
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
];

export const questions: Question[] = [
  {
    slug: "parking-near-seaside",
    title: "Best beach access with parking near Seaside?",
    body: "Fake community question. Looking for a public access that still has spaces after 10am.",
    authorUserSlug: "alex",
    townSlug: "seaside",
  },
  {
    slug: "golf-carts-rosemary",
    title: "Are golf carts allowed in Rosemary Beach?",
    body: "Fake community question about local rules.",
    authorUserSlug: "kelley",
    townSlug: "rosemary-beach",
  },
];

export const comments: Comment[] = [
  {
    slug: "parking-reply-1",
    body: "Fake answer: try the county access west of the square, earlier is better.",
    authorUserSlug: "kelley",
    on: { type: "question", slug: "parking-near-seaside" },
  },
  {
    slug: "guide-reply-1",
    body: "Fake comment on the first-timer guide.",
    authorUserSlug: "alex",
    on: { type: "guide", slug: "first-timers-guide" },
  },
  {
    slug: "post-reply-1",
    body: "Fake comment on a feed post.",
    authorUserSlug: "brett",
    on: { type: "post", slug: "sunset-on-the-square" },
  },
];

export const reactions: Reaction[] = [
  { slug: "r1", label: "Helpful", count: 4, on: { type: "question", slug: "parking-near-seaside" } },
  { slug: "r2", label: "Same question", count: 2, on: { type: "question", slug: "parking-near-seaside" } },
  { slug: "r3", label: "Useful", count: 6, on: { type: "guide", slug: "first-timers-guide" } },
  { slug: "r4", label: "Like", count: 3, on: { type: "post", slug: "sunset-on-the-square" } },
];

export const tags: Tag[] = [
  { slug: "family", name: "Family" },
  { slug: "walkable", name: "Walkable" },
  { slug: "live-music", name: "Live music" },
  { slug: "first-timer", name: "First timer" },
];

export const favorites: Favorite[] = [
  { userSlug: "kelley", type: "business", slug: "edwards-fine-food-and-wine" },
  { userSlug: "kelley", type: "event", slug: "sounds-of-seaside" },
  { userSlug: "kelley", type: "guide", slug: "first-timers-guide" },
  { userSlug: "kelley", type: "town", slug: "rosemary-beach" },
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

export function eventBySlug(slug: string) {
  return events.find((item) => item.slug === slug);
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
  return businesses.filter((item) => item.townSlug === townSlug);
}

export function areasForTown(townSlug: string) {
  return areas.filter((item) => item.townSlug === townSlug);
}

export function businessesForArea(areaSlug: string) {
  return businesses.filter((item) => item.areaSlug === areaSlug);
}

export function areaKindLabel(kind: Area["kind"]) {
  return kind === "shopping" ? "Shopping area" : "Neighborhood";
}

export function updatesForTown(townSlug: string) {
  return updates.filter((item) => item.townSlug === townSlug);
}

export function updatesForBusiness(businessSlug: string) {
  return updates.filter((item) => item.businessSlug === businessSlug);
}

export function businessesForLeaf(leafSlug: string) {
  return businesses.filter((item) => item.leafSlug === leafSlug);
}

export function postsFor(type: "town" | "business", slug: string) {
  return posts.filter((item) => item.on.type === type && item.on.slug === slug);
}

export function photosFor(
  type: Photo["attachedTo"]["type"],
  slug: string,
) {
  return photos.filter((item) => item.attachedTo.type === type && item.attachedTo.slug === slug);
}

export function reactionsFor(type: Reaction["on"]["type"], slug: string) {
  return reactions.filter((item) => item.on.type === type && item.on.slug === slug);
}

export function commentsFor(type: Comment["on"]["type"], slug: string) {
  return comments.filter((item) => item.on.type === type && item.on.slug === slug);
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

export function storyBySlug(slug: string) {
  return stories.find((item) => item.slug === slug);
}

export function listingMeta(item: Business) {
  const town = townBySlug(item.townSlug)?.name ?? item.townSlug;
  const tags = item.tagSlugs.map((slug) => tagBySlug(slug)?.name ?? slug).join(", ");
  const open = item.openNow ? "open now" : "closed";
  return `${item.leafSlug} · ${town} · ${open}${tags ? ` · ${tags}` : ""}`;
}
