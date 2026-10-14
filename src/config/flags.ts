export const flags = {
  events: true,
  updates: true,
  stays: true,
  ask: true,
  stories: true,
  guides: true,
  communityFeed: true,
  businessDashboard: true,
  /** Merchant dashboard chrome. Default OFF. Preview with ?dashboard=1 */
  businessDashboardV1: false,
  userProfile: true,
  addBusiness: true,
} as const;

export type FlagName = keyof typeof flags;

export function isEnabled(flag: FlagName): boolean {
  return flags[flag];
}
