import type { OwnershipStatus } from "./ownership";

/** PostHog / proto flag key. Default OFF. Rollback is flag OFF. Preview: ?dashboard=1 */
export const DASHBOARD_V1_FLAG_KEY = "business_dashboard_v1";
export const DASHBOARD_V1_QUERY = "dashboard";

export const REVIEW_QUEUE_SENTENCE =
  "Goes to the review queue before it appears on your public listing.";

export const VIEW_PUBLIC_LABEL = "View public listing";

export type ListingPublicStatus = "live" | "in_review" | "needs_attention";

export function listingPublicStatusFromOwnership(status: OwnershipStatus): ListingPublicStatus {
  if (status === "verified") return "live";
  if (status === "rejected") return "needs_attention";
  return "in_review";
}

export function listingPublicStatusFromBusiness(business: {
  ownerUserSlug?: string;
  ownershipStatus?: OwnershipStatus;
}): ListingPublicStatus {
  if (business.ownershipStatus) return listingPublicStatusFromOwnership(business.ownershipStatus);
  if (business.ownerUserSlug) return "live";
  return "in_review";
}

export function listingPublicStatusLabel(status: ListingPublicStatus) {
  switch (status) {
    case "live":
      return "Live";
    case "in_review":
      return "In review";
    case "needs_attention":
      return "Needs attention";
  }
}

export function envDashboardV1Enabled() {
  const value = import.meta.env.PUBLIC_BUSINESS_DASHBOARD_V1;
  return value === "true" || value === "1";
}
