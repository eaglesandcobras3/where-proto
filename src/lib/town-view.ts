import { areasForTown } from "../data/catalog";
import type { Town } from "../data/types";

export interface GlanceFact {
  label: string;
  value: string;
  detail: string;
}

export interface TownView extends Town {
  tagline: string;
  glance: GlanceFact[];
  highlights: string[];
}

const extras: Record<string, { tagline: string; glance: GlanceFact[]; highlights: string[] }> = {
  seaside: {
    tagline: "The iconic 30A town",
    glance: [
      {
        label: "Walkability",
        value: "Walkable",
        detail: "Most destinations around the town center are a short walk.",
      },
      {
        label: "Beach access",
        value: "Public nearby",
        detail: "Community access is often reserved for guests. Public access is nearby.",
      },
      {
        label: "Getting around",
        value: "Walk, bike",
        detail: "Nearby towns are easy to reach on foot or by bike.",
      },
    ],
    highlights: ["Town square", "Amphitheatre", "Walkable", "Boutique shopping", "Family friendly"],
  },
  "rosemary-beach": {
    tagline: "European charm on 30A",
    glance: [
      {
        label: "Walkability",
        value: "Walkable",
        detail: "Barrett Square and the town center are compact and built for strolling.",
      },
      {
        label: "Beach access",
        value: "Private for guests",
        detail: "Beach access is generally for owners and registered guests.",
      },
      {
        label: "Getting around",
        value: "Walk, bike",
        detail: "Park once and walk the courtyards and town green.",
      },
    ],
    highlights: ["Barrett Square", "Courtyards", "Walkable", "Boutique shopping", "Fine dining"],
  },
  "alys-beach": {
    tagline: "White architecture, calm streets",
    glance: [
      {
        label: "Walkability",
        value: "Walkable",
        detail: "The town center and beach are an easy walk apart.",
      },
      {
        label: "Beach access",
        value: "Private for guests",
        detail: "Beach access is reserved for owners and registered guests.",
      },
      {
        label: "Getting around",
        value: "Walk, bike",
        detail: "Calm streets make biking easy.",
      },
    ],
    highlights: ["White architecture", "Town center", "Calm streets", "Walkable"],
  },
  "grayton-beach": {
    tagline: "Old Florida soul",
    glance: [
      {
        label: "Walkability",
        value: "Mixed",
        detail: "The village core is walkable. The state park is a short hop.",
      },
      {
        label: "Beach access",
        value: "Public and state park",
        detail: "Public access and Grayton Beach State Park sit next to town.",
      },
      {
        label: "Getting around",
        value: "Walk, drive",
        detail: "Hotz Avenue is the small commercial strip.",
      },
    ],
    highlights: ["State park", "Live music", "Old Florida", "Local hangout"],
  },
  watercolor: {
    tagline: "Family-oriented planned community",
    glance: [
      {
        label: "Walkability",
        value: "Walkable inside",
        detail: "The community is walkable once you are inside the gates.",
      },
      {
        label: "Beach access",
        value: "Private for guests",
        detail: "Beach access is generally for owners and registered guests.",
      },
      {
        label: "Getting around",
        value: "Walk, bike",
        detail: "Town center shops sit a short walk from Western Lake.",
      },
    ],
    highlights: ["Town center", "Family friendly", "Western Lake", "Walkable"],
  },
  "inlet-beach": {
    tagline: "The east end of 30A",
    glance: [
      {
        label: "Walkability",
        value: "Mixed",
        detail: "30Avenue is walkable. Other pockets are more spread out.",
      },
      {
        label: "Beach access",
        value: "Public access points",
        detail: "Public access points sit along the east end of 30A.",
      },
      {
        label: "Getting around",
        value: "Walk, drive",
        detail: "30Avenue concentrates shops and dining.",
      },
    ],
    highlights: ["30Avenue", "Public beach access", "Dining", "East end"],
  },
};

export function townView(town: Town): TownView {
  const extra = extras[town.slug];
  const areaCount = areasForTown(town.slug).length;
  return {
    ...town,
    tagline: extra?.tagline ?? town.summary,
    glance: extra?.glance ?? [
      { label: "Walkability", value: town.walkability, detail: town.summary },
      { label: "Beach access", value: town.beachAccess, detail: "Access rules vary by stay and neighborhood." },
      {
        label: "Areas",
        value: `${areaCount} in this town`,
        detail: "Shopping areas and neighborhoods that sit inside this town.",
      },
    ],
    highlights: extra?.highlights ?? [town.walkability, town.beachAccess],
  };
}
