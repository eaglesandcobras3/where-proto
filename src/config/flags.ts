export const flags = {
  events: true,
  updates: true,
  stays: true,
  ask: true,
  stories: true,
  guides: true,
  communityFeed: true,
  businessDashboard: true,
  userProfile: true,
  addBusiness: true,
  /** PostHog boolean `unified_listing_detail_layout`. Compile-time default OFF. */
  unifiedListingDetailLayout: false,
} as const;

export type FlagName = keyof typeof flags;

export function isEnabled(flag: FlagName): boolean {
  return flags[flag];
}
