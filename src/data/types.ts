export type Slug = string;

export interface Town {
  slug: Slug;
  name: string;
  summary: string;
  walkability: string;
  beachAccess: string;
  areaSlugs: Slug[];
}

export type AreaKind = "shopping" | "neighborhood";

export interface Area {
  slug: Slug;
  name: string;
  townSlug: Slug;
  kind: AreaKind;
  summary: string;
}

export interface CategoryLeaf {
  slug: Slug;
  name: string;
}

export interface Category {
  slug: Slug;
  name: string;
  leaves: CategoryLeaf[];
}

/**
 * Listing kinds. Feed, events, and updates attach to business and stay listings.
 * Town/area desks are claimable place entities (hidden from search) that hold that content.
 */
export type BusinessEntityKind = "business" | "stay" | "town" | "area";

export interface Business {
  slug: Slug;
  name: string;
  townSlug: Slug;
  areaSlug?: Slug;
  categorySlug: Slug;
  leafSlug: Slug;
  summary: string;
  tagSlugs: Slug[];
  openNow: boolean;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  priceBand?: string;
  isStay?: boolean;
  /**
   * Default business. Town/area = claimable place desk (e.g. "Rosemary Beach Town Merchants").
   * Place desks are hidden from consumer search; towns/areas themselves are not content hosts.
   */
  entityKind?: BusinessEntityKind;
  ownerUserSlug?: Slug;
  /** Seed ownership row status. Defaults to verified when ownerUserSlug is set. */
  ownershipStatus?: "pending_approval" | "pending_verification" | "verified" | "rejected";
}

export interface Stay {
  slug: Slug;
  name: string;
  townSlug: Slug;
  categorySlug: Slug;
  summary: string;
  sleeps: number;
  businessSlug?: Slug;
}

export type EventBucket = "now" | "today" | "weekend" | "month";

export interface EventItem {
  slug: Slug;
  name: string;
  townSlug?: Slug;
  businessSlug?: Slug;
  when: string;
  time?: string;
  summary: string;
  venue?: string;
  category?: string;
  ticketUrl?: string;
  price?: string;
  bucket: EventBucket;
}

export interface Guide {
  slug: Slug;
  title: string;
  summary: string;
  body: string;
  townSlug?: Slug;
  categorySlug?: Slug;
}

export interface Update {
  slug: Slug;
  title: string;
  body: string;
  createdAt: string;
  through: string;
  type: "new_item" | "limited_offer" | "business_news" | "hours_change";
  /** Public updates belong to exactly one entity. Untied updates never render. */
  townSlug?: Slug;
  areaSlug?: Slug;
  businessSlug?: Slug;
}

export interface User {
  slug: Slug;
  name: string;
  role: "visitor" | "local" | "business-owner" | "admin";
  bio: string;
  memberSince: string;
}

export interface Post {
  slug: Slug;
  authorUserSlug?: Slug;
  authorBusinessSlug?: Slug;
  postedAs: "user" | "business";
  on: { type: "town" | "business"; slug: Slug };
  body: string;
  createdAt: string;
}

export interface Photo {
  slug: Slug;
  caption: string;
  attachedTo: { type: "town" | "business" | "event" | "post" | "area"; slug: Slug };
}

export interface Question {
  slug: Slug;
  title: string;
  body: string;
  authorUserSlug: Slug;
  townSlug?: Slug;
  createdAt: string;
}

export interface Comment {
  slug: Slug;
  body: string;
  authorUserSlug: Slug;
  on: { type: "question" | "post" | "guide"; slug: Slug };
}

export interface Reaction {
  slug: Slug;
  label: "up" | "heart" | "wow";
  count: number;
  on: { type: "post" | "question" | "guide" | "answer"; slug: Slug };
}

export interface Tag {
  slug: Slug;
  name: string;
}

export interface Favorite {
  userSlug: Slug;
  type: "business" | "event" | "guide" | "town";
  slug: Slug;
}

export interface ReviewQueueItem {
  slug: Slug;
  kind: "business" | "event" | "guide" | "post";
  targetSlug: Slug;
  status: "pending" | "approved" | "rejected";
}

export interface SeoOverride {
  slug: Slug;
  path: string;
  title: string;
  description: string;
}

export interface KnowledgeItem {
  slug: Slug;
  title: string;
  body: string;
}
