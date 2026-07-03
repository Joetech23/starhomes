import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/properties`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/properties?type=sale`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/properties?type=rent`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/properties?type=land`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/properties?type=shortlet`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/properties?type=commercial`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/interior-design`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/book-inspection`, changeFrequency: "weekly", priority: 0.8 },
  ];

  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("listings")
      .select("id, updated_at")
      .eq("status", "published");

    listingRoutes = (data ?? []).map((l) => ({
      url: `${SITE_URL}/properties/${l.id}`,
      lastModified: l.updated_at ? new Date(l.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Supabase unreachable at build time — fall back to static routes only.
  }

  return [...staticRoutes, ...listingRoutes];
}
