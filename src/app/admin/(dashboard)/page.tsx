import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { naira } from "@/lib/site";
import { TYPE_LABEL, type PropertyType } from "@/lib/properties";

export const dynamic = "force-dynamic";

async function counts() {
  const supabase = createClient();
  const base = () =>
    supabase.from("listings").select("*", { count: "exact", head: true });
  const [total, published, products, enquiries, inspections, subscribers] = await Promise.all([
    base(),
    base().eq("status", "published"),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase.from("inspection_requests").select("*", { count: "exact", head: true }),
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
  ]);
  return {
    total: total.count ?? 0,
    published: published.count ?? 0,
    products: products.count ?? 0,
    enquiries: enquiries.count ?? 0,
    inspections: inspections.count ?? 0,
    subscribers: subscribers.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const supabase = createClient();
  const c = await counts();
  const { data: recent } = await supabase
    .from("listings")
    .select("id, title, type, price, unit, status, listing_no")
    .order("created_at", { ascending: false })
    .limit(6);
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("id, name, message, created_at, handled")
    .order("created_at", { ascending: false })
    .limit(5);

  const cards = [
    { label: "Listings", value: c.total },
    { label: "Products", value: c.products },
    { label: "Enquiries", value: c.enquiries },
    { label: "Inspections", value: c.inspections },
    { label: "Subscribers", value: c.subscribers },
    { label: "Published listings", value: c.published },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[26px] font-extrabold text-ink-900">
          Dashboard
        </h1>
        <Link
          href="/admin/listings/new"
          className="rounded-full bg-brand px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-hover"
        >
          + New listing
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[16px] border border-line bg-white p-5"
          >
            <div className="font-display text-[30px] font-extrabold text-ink-900">
              {card.value}
            </div>
            <div className="mt-1 text-[13px] font-semibold text-muted-light">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[16px] border border-line bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="m-0 font-display text-[17px] font-extrabold text-ink-900">
              Recent listings
            </h2>
            <Link href="/admin/listings" className="text-[13px] font-bold text-brand">
              View all →
            </Link>
          </div>
          <div className="flex flex-col">
            {(recent ?? []).map((r) => (
              <Link
                key={r.id}
                href={`/admin/listings/${r.id}/edit`}
                className="flex items-center justify-between gap-3 border-b border-line-soft py-2.5 last:border-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-ink">
                    {r.title}
                  </div>
                  <div className="text-[12px] text-muted-light">
                    {TYPE_LABEL[r.type as PropertyType]} ·{" "}
                    {naira(Number(r.price))}
                    {r.unit}
                  </div>
                </div>
                <span
                  className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    r.status === "published"
                      ? "bg-leaf-bg text-brand-ink"
                      : "bg-[#F1F1ED] text-muted"
                  }`}
                >
                  {r.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[16px] border border-line bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="m-0 font-display text-[17px] font-extrabold text-ink-900">
              Recent enquiries
            </h2>
            <Link href="/admin/enquiries" className="text-[13px] font-bold text-brand">
              View all →
            </Link>
          </div>
          <div className="flex flex-col">
            {(enquiries ?? []).length === 0 && (
              <p className="m-0 py-4 text-[13px] text-muted-light">
                No enquiries yet.
              </p>
            )}
            {(enquiries ?? []).map((e) => (
              <div
                key={e.id}
                className="border-b border-line-soft py-2.5 last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold text-ink">
                    {e.name}
                  </span>
                  {!e.handled && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  )}
                </div>
                <div className="truncate text-[12.5px] text-muted">
                  {e.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
