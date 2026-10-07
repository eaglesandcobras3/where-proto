import type {
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
  Question,
  ReviewQueueItem,
  SeoOverride,
  Stay,
  Tag,
  Town,
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
    areaSlugs: ["barrett-square"],
  },
  {
    slug: "seaside",
    name: "Seaside",
    summary: "Classic 30A town around a central square and amphitheatre.",
    walkability: "Walkable",
    beachAccess: "Public access nearby",
    areaSlugs: ["seaside-town-square"],
  },
  {
    slug: "alys-beach",
    name: "Alys Beach",
    summary: "White Mediterranean-inspired architecture and a quieter pace.",
    walkability: "Walkable",
    beachAccess: "Private for guests and residents",
    areaSlugs: [],
  },
  {
    slug: "grayton-beach",
    name: "Grayton Beach",
    summary: "Older beach town, state park, and a local hangout feel.",
    walkability: "Mixed",
    beachAccess: "Public and state park",
    areaSlugs: [],
  },
  {
    slug: "watercolor",
    name: "WaterColor",
    summary: "Family-oriented planned community west of Seaside.",
    walkability: "Walkable inside the community",
    beachAccess: "Private for guests and residents",
    areaSlugs: [],
  },
  {
    slug: "inlet-beach",
    name: "Inlet Beach",
    summary: "Eastern end of 30A with 30Avenue shops and dining.",
    walkability: "Mixed",
    beachAccess: "Public access points",
    areaSlugs: ["30avenue"],
  },
];

export const areas: Area[] = [
  {
    slug: "barrett-square",
    name: "Barrett Square",
    townSlug: "rosemary-beach",
    summary: "Town green, coffee, dining, and boutique cluster.",
  },
  {
    slug: "seaside-town-square",
    name: "Seaside Town Square",
    townSlug: "seaside",
    summary: "Central square, amphitheatre, shops, and Airstream Row.",
  },
  {
    slug: "30avenue",
    name: "30Avenue",
    townSlug: "inlet-beach",
    summary: "Open-air shopping and dining at the east end of 30A.",
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
  },
  {
    slug: "the-pearl-hotel",
    name: "The Pearl Hotel",
    townSlug: "rosemary-beach",
    areaSlug: "barrett-square",
    categorySlug: "stay",
    leafSlug: "hotels",
    summary: "Hotel stay in the Rosemary Beach town center.",
    isStay: true,
  },
  {
    slug: "grayton-bike-co",
    name: "Grayton Bike Co.",
    townSlug: "grayton-beach",
    categorySlug: "things-to-do",
    leafSlug: "rentals",
    summary: "Bike rentals for the Timpoochee Trail.",
    ownerUserSlug: "brett",
  },
  {
    slug: "alys-shoppe",
    name: "Alys Shoppe",
    townSlug: "alys-beach",
    categorySlug: "shopping",
    leafSlug: "boutiques",
    summary: "Beachwear and town-logo goods in Alys Beach.",
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
    slug: "seagrove-cottage",
    name: "Seagrove Cottage",
    townSlug: "watercolor",
    summary: "Fake vacation rental used to scaffold the Stay page type.",
    sleeps: 8,
  },
];

export const events: EventItem[] = [
  {
    slug: "sounds-of-seaside",
    name: "Sounds of Seaside Wednesday Night Concert Series",
    townSlug: "seaside",
    when: "Every Wednesday, 5:00 PM",
    summary: "Live music at the Seaside Amphitheatre.",
  },
  {
    slug: "grayton-farmers-market",
    name: "Grayton Beach Farmers Market",
    townSlug: "grayton-beach",
    when: "Every Thursday morning",
    summary: "Local produce and makers in Grayton Beach.",
  },
  {
    slug: "harvest-wine-food",
    name: "Harvest Wine & Food Festival",
    townSlug: "watercolor",
    businessSlug: "edwards-fine-food-and-wine",
    when: "Saturday, 12:00 PM",
    summary: "Food and wine event used as a sample event page.",
  },
];

export const guides: Guide[] = [
  {
    slug: "first-timers-guide",
    title: "First Timer's Guide to 30A",
    summary: "Towns, beaches, cars, bikes, and what to know before you arrive.",
  },
  {
    slug: "guide-to-rosemary-beach",
    title: "The Ultimate Guide to Rosemary Beach",
    summary: "Walkability, dining, and how the town center works.",
    townSlug: "rosemary-beach",
  },
  {
    slug: "why-is-it-called-30a",
    title: "Why Is It Called 30A?",
    summary: "Short background on the scenic highway name.",
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
];

export const photos: Photo[] = [
  {
    slug: "barrett-square-green",
    caption: "Placeholder photo: Barrett Square",
    attachedTo: { type: "town", slug: "rosemary-beach" },
  },
  {
    slug: "edwards-courtyard",
    caption: "Placeholder photo: courtyard seating",
    attachedTo: { type: "business", slug: "edwards-fine-food-and-wine" },
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

export function businessesForTown(townSlug: string) {
  return businesses.filter((item) => item.townSlug === townSlug);
}

export function businessesForLeaf(leafSlug: string) {
  return businesses.filter((item) => item.leafSlug === leafSlug);
}

export function postsFor(type: "town" | "business", slug: string) {
  return posts.filter((item) => item.on.type === type && item.on.slug === slug);
}

export function currentUser() {
  return userBySlug(currentUserSlug);
}

export function businessesOwnedBy(userSlug: string) {
  return businesses.filter((item) => item.ownerUserSlug === userSlug);
}
