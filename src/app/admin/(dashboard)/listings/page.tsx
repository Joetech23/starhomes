import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { naira } from "@/lib/site";
import { TYPE_LABEL, type PropertyType } from "@/lib/properties";
import ListingRowActions from "@/components/admin/ListingRowActions";

export const dynamic = "force-dynamic";

export default async function AdminListings() {
  const supabase = createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("id, listing_no, title, location, type, price, unit, status, featured")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[26px] font-extrabold text-ink-900">
          Listings
        </h1>
        <Link
          href="/admin/listings/new"
          className="rounded-full bg-brand px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-hover"
        >
          + New listing
        </Link>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-line bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-cream text-[12px] uppercase tracking-[0.04em] text-muted-light">
              <th className="px-4 py-3 font-bold">Property</th>
              <th className="hidden px-4 py-3 font-bold sm:table-cell">Type</th>
              <th className="hidden px-4 py-3 font-bold md:table-cell">Price</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(listings ?? []).map((l) => (
              <tr key={l.id} className="border-b border-line-soft last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/listings/${l.id}/edit`}
                    className="text-[14px] font-semibold text-ink hover:text-brand"
                  >
                    {l.title}
                  </Link>
                  <div className="text-[12px] text-muted-light">
                    SH-{String(l.listing_no).padStart(3, "0")} · {l.location}
                    {l.featured && (
                      <span className="ml-1.5 text-brand">★ featured</span>
                    )}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-[13px] text-muted sm:table-cell">
                  {TYPE_LABEL[l.type as PropertyType]}
                </td>
                <td className="hidden px-4 py-3 text-[13px] font-semibold text-ink md:table-cell">
                  {naira(Number(l.price))}
                  {l.unit}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      l.status === "published"
                        ? "bg-leaf-bg text-brand-ink"
                        : "bg-[#F1F1ED] text-muted"
                    }`}
                  >
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ListingRowActions
                    id={l.id}
                    status={l.status}
                    featured={l.featured}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(listings ?? []).length === 0 && (
          <p className="m-0 px-4 py-10 text-center text-[14px] text-muted-light">
            No listings yet. Create your first one.
          </p>
        )}
      </div>
    </div>
  );
}
