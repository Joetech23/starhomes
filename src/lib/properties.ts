// Domain types + display helpers for Star Homes listings.
// Data now comes from Supabase (see lib/queries.ts); this file holds the shared
// shape, label maps, and content fallbacks ported from the original design.

import { naira } from "./site";

export type PropertyType = "rent" | "sale" | "land" | "shortlet" | "commercial";

export interface MediaItem {
  id: string;
  url: string;
  caption: string | null;
  isCover: boolean;
  sortOrder: number;
}

export interface Agent {
  name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  verified: boolean;
}

export interface Listing {
  id: string;
  listingNo: number;
  type: PropertyType;
  title: string;
  location: string;
  price: number;
  unit: string;
  featured: boolean;
  status: "draft" | "published";
  description: string | null;
  cardSpecs: string[];
  features: { k: string; v: string }[];
  fees: { label: string; amount: number; note: string }[];
  amenities: string[];
  totalLabel: string;
  photos: MediaItem[];
  documents: MediaItem[];
  videos: MediaItem[];
  agent: Agent | null;
  agentId: string | null;
}

export const TYPE_LABEL: Record<PropertyType, string> = {
  rent: "For Rent",
  sale: "For Sale",
  land: "Land",
  shortlet: "Shortlet",
  commercial: "Commercial",
};

export const FILTER_LABEL_PLURAL: Record<string, string> = {
  all: "All Properties",
  sale: "For Sale",
  rent: "For Rent",
  land: "Land & Plots",
  shortlet: "Shortlets",
  commercial: "Commercial",
};

/** Hero/listings location filter options — label shown to the user, keyword matched (case-insensitive, substring) against listing.location. */
export const LOCATIONS: { label: string; keyword: string }[] = [
  { label: "Awka, Anambra", keyword: "Awka" },
  { label: "Onitsha, Anambra", keyword: "Onitsha" },
  { label: "Nnewi, Anambra", keyword: "Nnewi" },
  { label: "Lagos", keyword: "Lagos" },
  { label: "Enugu", keyword: "Enugu" },
  { label: "Abuja", keyword: "Abuja" },
];

export const BUDGET_OPTIONS: { value: string; label: string }[] = [
  { value: "u5", label: "Under ₦5M" },
  { value: "5to50", label: "₦5M – ₦50M" },
  { value: "50to200", label: "₦50M – ₦200M" },
  { value: "200plus", label: "₦200M+" },
];

export const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80";

/** Default amenities by type — used when a listing has none set. */
export function amenitiesFor(type: PropertyType): string[] {
  if (type === "land")
    return [
      "Dry, fenced land",
      "Good road access",
      "Verified title documents",
      "Free from litigation",
      "Survey plan available",
      "Developing neighbourhood",
    ];
  if (type === "commercial")
    return [
      "3-phase power supply",
      "Ample on-site parking",
      "Open floor plan",
      "Restrooms on each floor",
      "24/7 security",
      "Lift access",
    ];
  return [
    "24/7 power & backup",
    "Borehole / treated water",
    "Fully fitted kitchen",
    "All rooms en-suite",
    "Secure parking",
    "CCTV & gated security",
    "POP ceiling & spotlights",
    "Fitted wardrobes",
  ];
}

/** Two-paragraph description fallback when `listing.description` is empty. */
export function descFor(l: Pick<Listing, "title" | "location" | "type">): [string, string] {
  const loc = l.location;
  if (l.type === "land")
    return [
      `This ${l.title.toLowerCase()} in ${loc} comes with verified title documents and is completely free from government acquisition or litigation. The land is dry, accessible and ready for immediate development.`,
      "Whether you are building your dream home or securing a smart long-term investment, our team handles survey, documentation and perfection of title end-to-end — so you buy with total peace of mind.",
    ];
  if (l.type === "commercial")
    return [
      `A well-positioned ${l.title.toLowerCase()} in ${loc}, offering flexible open-plan space, reliable power and generous parking in a busy commercial corridor.`,
      "Ideal for offices, showrooms or professional services. All charges are stated upfront and our team manages inspection, agreement and handover from start to finish.",
    ];
  if (l.type === "sale")
    return [
      `${l.title} in ${loc} is a rare chance to own a premium property in one of the area’s most desirable neighbourhoods. Generous living spaces, quality finishes and excellent natural light throughout.`,
      "Every document is verified and the title is clean and transferable. We guide you through pricing, legal documentation and a smooth handover with no hidden costs.",
    ];
  return [
    `Set in ${loc}, this ${l.title.toLowerCase()} blends comfortable, modern living with a secure and well-managed environment. Finished to a high standard and ready to move into.`,
    "All fees are stated upfront with no hidden charges. Our team handles inspection, documentation and handover from start to finish, so you can move in with complete confidence.",
  ];
}

/** Headline price, or "Price on request" when no price is set (price <= 0). */
export function priceText(l: Pick<Listing, "price">): string {
  return l.price > 0 ? naira(l.price) : "Price on request";
}

export function feeTotal(l: Listing): number {
  return l.fees.reduce((s, f) => s + (Number(f.amount) || 0), 0);
}

export function refOf(l: Pick<Listing, "listingNo">): string {
  return "SH-" + String(l.listingNo).padStart(3, "0");
}

export function specsText(l: Pick<Listing, "cardSpecs">): string {
  return l.cardSpecs.join("   ·   ");
}

export function coverPhoto(l: Listing): string {
  const cover = l.photos.find((p) => p.isCover) ?? l.photos[0];
  return cover?.url ?? PLACEHOLDER;
}

export function galleryPhotos(l: Listing): MediaItem[] {
  return [...l.photos].sort((a, b) => a.sortOrder - b.sortOrder);
}
