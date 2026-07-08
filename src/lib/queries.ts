import "server-only";
import { createClient } from "./supabase/server";
import type { Listing, MediaItem, PropertyType } from "./properties";
import type { Product, Banner, Department } from "./products";
import { PRODUCT_BUDGET_RANGES } from "./products";

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

// ============ Marketplace: products & banners ============

const PRODUCT_SELECT =
  "id, product_no, department, category, name, price, compare_at_price, short_description, description, sizes, colors, stock_status, featured, status, created_at, product_media(id, url, is_cover, sort_order)";

function mapProduct(row: any): Product {
  return {
    id: row.id,
    productNo: Number(row.product_no),
    department: row.department as Department,
    category: row.category,
    name: row.name,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    shortDescription: row.short_description,
    description: row.description,
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    stockStatus: row.stock_status,
    featured: !!row.featured,
    status: row.status,
    photos: (row.product_media ?? [])
      .map((m: any) => ({
        id: m.id,
        url: m.url,
        isCover: !!m.is_cover,
        sortOrder: m.sort_order ?? 0,
      }))
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder),
  };
}

export interface ProductFilters {
  department?: string; // Department
  category?: string;
  budget?: string; // key into PRODUCT_BUDGET_RANGES
  sort?: string; // "newest" | "price_asc" | "price_desc"
  q?: string; // free-text search on name
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("status", "published");

  if (filters.department) query = query.eq("department", filters.department);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.q) query = query.ilike("name", `%${filters.q}%`);
  const range = filters.budget ? PRODUCT_BUDGET_RANGES[filters.budget] : undefined;
  if (range) {
    query = query.gte("price", range[0]);
    if (range[1] != null) query = query.lt("price", range[1]);
  }

  if (filters.sort === "price_asc") query = query.order("price", { ascending: true });
  else if (filters.sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data } = await query;
  return (data ?? []).map(mapProduct);
}

export async function getFeaturedProducts(department?: Department, limit = 4): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (department) query = query.eq("department", department);
  const { data } = await query;
  return (data ?? []).map(mapProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).single();
  return data ? mapProduct(data) : null;
}

export async function getRelatedProducts(p: Product, limit = 4): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("department", p.department)
    .neq("id", p.id)
    .limit(limit);
  return (data ?? []).map(mapProduct);
}

/** Distinct published categories for a department (for filter chips). */
export async function getProductCategories(department: string): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("category")
    .eq("status", "published")
    .eq("department", department);
  const set = new Set<string>();
  (data ?? []).forEach((r: any) => r.category && set.add(r.category));
  return Array.from(set).sort();
}

export async function getBanners(placement: Banner["placement"]): Promise<Banner[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("banners")
    .select("id, title, subtitle, image_url, cta_label, cta_href, placement, sort")
    .eq("placement", placement)
    .eq("active", true)
    .order("sort", { ascending: true });
  return (data ?? []).map((b: any) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.image_url,
    ctaLabel: b.cta_label,
    ctaHref: b.cta_href,
    placement: b.placement,
    sort: b.sort ?? 0,
  }));
}
