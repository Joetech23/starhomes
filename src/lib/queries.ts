import "server-only";
import { createClient } from "./supabase/server";
import type { Listing, MediaItem, PropertyType } from "./properties";

const SELECT =
  "id, listing_no, type, title, location, price, unit, featured, status, description, card_specs, features, fees, amenities, total_label, agent_id, created_at, listing_media(id, url, caption, is_cover, sort_order, kind), agents(name, title, phone, email, avatar_url, verified)";

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapMedia(
  rows: any[] | null | undefined,
  kind: "photo" | "document" | "video"
): MediaItem[] {
  return (rows ?? [])
    .filter((m) => (m.kind ?? "photo") === kind)
    .map((m) => ({
      id: m.id,
      url: m.url,
      caption: m.caption,
      isCover: !!m.is_cover,
      sortOrder: m.sort_order ?? 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function mapRow(row: any): Listing {
  const agent = row.agents
    ? {
        name: row.agents.name,
        title: row.agents.title,
        phone: row.agents.phone,
        email: row.agents.email,
        avatarUrl: row.agents.avatar_url,
        verified: !!row.agents.verified,
      }
    : null;

  return {
    id: row.id,
    listingNo: Number(row.listing_no),
    type: row.type as PropertyType,
    title: row.title,
    location: row.location,
    price: Number(row.price),
    unit: row.unit ?? "",
    featured: !!row.featured,
    status: row.status,
    description: row.description,
    cardSpecs: row.card_specs ?? [],
    features: Array.isArray(row.features) ? row.features : [],
    fees: Array.isArray(row.fees) ? row.fees : [],
    amenities: row.amenities ?? [],
    totalLabel: row.total_label ?? "Total payable",
    photos: mapMedia(row.listing_media, "photo"),
    documents: mapMedia(row.listing_media, "document"),
    videos: mapMedia(row.listing_media, "video"),
    agent,
    agentId: row.agent_id ?? null,
  };
}

export async function getFeatured(): Promise<Listing[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: true })
    .limit(6);
  return (data ?? []).map(mapRow);
}

export async function getByType(filter: string): Promise<Listing[]> {
  const supabase = createClient();
  let query = supabase
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: true });
  if (filter !== "all") query = query.eq("type", filter);
  const { data } = await query;
  return (data ?? []).map(mapRow);
}

/**
 * value -> [min, max) naira range used by the hero/listings budget filter.
 * Lower bounds are inclusive and start at 1 (never 0) so "price on request"
 * listings (price = 0) never match a specific budget filter.
 */
export const BUDGET_RANGES: Record<string, [number, number | null]> = {
  u5: [1, 5_000_000],
  "5to50": [5_000_000, 50_000_000],
  "50to200": [50_000_000, 200_000_000],
  "200plus": [200_000_000, null],
};

export interface ListingFilters {
  type?: string; // "all" | PropertyType
  location?: string; // substring matched against the location column
  budget?: string; // key into BUDGET_RANGES
}

export async function getFiltered(filters: ListingFilters): Promise<Listing[]> {
  const supabase = createClient();
  let query = supabase
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (filters.type && filters.type !== "all") query = query.eq("type", filters.type);
  if (filters.location) query = query.ilike("location", `%${filters.location}%`);
  const range = filters.budget ? BUDGET_RANGES[filters.budget] : undefined;
  if (range) {
    query = query.gte("price", range[0]);
    if (range[1] != null) query = query.lt("price", range[1]);
  }

  const { data } = await query;
  return (data ?? []).map(mapRow);
}

export async function getListing(id: string): Promise<Listing | null> {
  const supabase = createClient();
  const { data } = await supabase.from("listings").select(SELECT).eq("id", id).single();
  return data ? mapRow(data) : null;
}

export async function getSimilar(listing: Listing): Promise<Listing[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .eq("type", listing.type)
    .neq("id", listing.id)
    .limit(3);
  return (data ?? []).map(mapRow);
}
